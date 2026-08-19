import { Redis } from "@upstash/redis";
import { NextRequest, NextResponse } from "next/server";
import { BBSS_EVENTS_KEY as KEY, type BBSSEvent } from "../../../lib/bbss-events";
import { fetchNotionEvents, isNotionConfigured } from "../../../lib/notion-events";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

/** Vercel Cron sends `Authorization: Bearer <CRON_SECRET>`. The admin page's
 *  "Sync now" button sends the same `x-bbss-events-token` used for manual
 *  writes, since it's already gated behind that password. */
function isAuthorized(req: NextRequest): boolean {
  const auth = req.headers.get("authorization");
  if (auth === `Bearer ${process.env.CRON_SECRET}`) return true;

  const token = req.headers.get("x-bbss-events-token");
  return Boolean(token && token === process.env.BBSS_EVENTS_ADMIN_TOKEN);
}

async function runSync(): Promise<{ synced: number; removed: number }> {
  const notionEvents = await fetchNotionEvents();

  const existing = (await redis.hgetall<Record<string, BBSSEvent>>(KEY)) ?? {};
  const freshIds = new Set(notionEvents.map((e) => e.id));

  // Remove Notion-sourced entries that no longer exist upstream (deleted/
  // archived in Notion). Manual entries are never touched here.
  const staleIds = Object.values(existing)
    .filter((e) => e.source === "notion" && !freshIds.has(e.id))
    .map((e) => e.id);

  if (notionEvents.length > 0) {
    const upserts: Record<string, BBSSEvent> = {};
    for (const event of notionEvents) upserts[event.id] = event;
    await redis.hset(KEY, upserts);
  }

  if (staleIds.length > 0) {
    await redis.hdel(KEY, ...staleIds);
  }

  return { synced: notionEvents.length, removed: staleIds.length };
}

async function handleSyncRequest(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Not having Notion set up is a valid state, not a failure: the events list
  // works on manually-added events alone. Answering 200 keeps the daily cron
  // from logging an error every morning on a deployment that never intended to
  // sync. A bad token still 502s below — that one is worth surfacing.
  if (!isNotionConfigured()) {
    return NextResponse.json({
      synced: 0,
      removed: 0,
      skipped: true,
      reason: "Notion sync is not set up, so nothing was pulled in. Events added by hand are unaffected.",
    });
  }

  try {
    const result = await runSync();
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Notion fetch failed" },
      { status: 502 }
    );
  }
}

// Vercel Cron always sends a GET request to the scheduled path. The admin
// page's "Sync now" button uses POST instead, since it's a manually
// triggered write. Both run the same sync.
export async function GET(req: NextRequest) {
  return handleSyncRequest(req);
}

export async function POST(req: NextRequest) {
  return handleSyncRequest(req);
}
