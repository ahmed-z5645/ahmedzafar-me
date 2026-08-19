import { Redis } from "@upstash/redis";
import { NextRequest, NextResponse } from "next/server";
import { BBSS_EVENTS_KEY as KEY, type BBSSEvent } from "../../lib/bbss-events";

export const dynamic = "force-dynamic";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const MAX_EVENTS = 300;
const MAX_TITLE_LENGTH = 120;
const MAX_LOCATION_LENGTH = 120;
const MAX_DESCRIPTION_LENGTH = 500;

async function readEvents(): Promise<BBSSEvent[]> {
  const all = await redis.hgetall<Record<string, BBSSEvent>>(KEY);
  return Object.values(all ?? {}).sort((a, b) => a.start.localeCompare(b.start));
}

function isAdmin(req: NextRequest): boolean {
  const token = req.headers.get("x-bbss-events-token");
  return Boolean(token && token === process.env.BBSS_EVENTS_ADMIN_TOKEN);
}

// GET is fetched cross-origin from the Squarespace widget, so it needs its
// own CORS header. Writes only ever happen same-origin from the admin page.
export async function GET() {
  try {
    const events = await readEvents();
    return NextResponse.json(events, {
      headers: { "Access-Control-Allow-Origin": "*" },
    });
  } catch {
    return NextResponse.json([], {
      status: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
    });
  }
}

export async function POST(req: NextRequest) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const title = String(body?.title ?? "").trim().slice(0, MAX_TITLE_LENGTH);
  const start = String(body?.start ?? "");
  const end = String(body?.end ?? start);
  const allDay = Boolean(body?.allDay);
  const location = String(body?.location ?? "").trim().slice(0, MAX_LOCATION_LENGTH);
  const description = String(body?.description ?? "").trim().slice(0, MAX_DESCRIPTION_LENGTH);

  if (!title || !start || Number.isNaN(Date.parse(start))) {
    return NextResponse.json({ error: "Missing or invalid title/start" }, { status: 400 });
  }
  if (Number.isNaN(Date.parse(end))) {
    return NextResponse.json({ error: "Invalid end" }, { status: 400 });
  }

  if ((await redis.hlen(KEY)) >= MAX_EVENTS) {
    return NextResponse.json({ error: "Event list is full" }, { status: 400 });
  }

  const entry: BBSSEvent = {
    id: `evt-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    title,
    start,
    end,
    allDay,
    location,
    description,
    source: "manual",
  };

  await redis.hset(KEY, { [entry.id]: entry });
  return NextResponse.json({ events: await readEvents() });
}

export async function PATCH(req: NextRequest) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const id = body?.id ? String(body.id) : "";
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const existing = await redis.hget<BBSSEvent>(KEY, id);
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const title = body?.title !== undefined
    ? String(body.title).trim().slice(0, MAX_TITLE_LENGTH)
    : existing.title;
  const start = body?.start !== undefined ? String(body.start) : existing.start;
  const end = body?.end !== undefined ? String(body.end) : existing.end;
  const allDay = body?.allDay !== undefined ? Boolean(body.allDay) : existing.allDay;
  const location = body?.location !== undefined
    ? String(body.location).trim().slice(0, MAX_LOCATION_LENGTH)
    : existing.location;
  const description = body?.description !== undefined
    ? String(body.description).trim().slice(0, MAX_DESCRIPTION_LENGTH)
    : existing.description;

  if (!title || !start || Number.isNaN(Date.parse(start)) || Number.isNaN(Date.parse(end))) {
    return NextResponse.json({ error: "Missing or invalid title/start/end" }, { status: 400 });
  }

  const updated: BBSSEvent = {
    id,
    title,
    start,
    end,
    allDay,
    location,
    description,
    source: existing.source,
  };
  await redis.hset(KEY, { [id]: updated });
  return NextResponse.json({ events: await readEvents() });
}

export async function DELETE(req: NextRequest) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const id = body?.id ? String(body.id) : "";
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  await redis.hdel(KEY, id);
  return NextResponse.json({ events: await readEvents() });
}
