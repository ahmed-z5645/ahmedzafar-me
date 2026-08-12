import { Redis } from "@upstash/redis";
import { NextRequest, NextResponse } from "next/server";
import type { CampingSearchResult } from "./search/route";

export const dynamic = "force-dynamic";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

/** Redis hash: field = track id, value = CampingTrack. Hash + HSETNX makes
 *  "add only if nobody has added it yet" atomic, so two friends adding at the
 *  same moment can't clobber each other. */
const KEY = "camping:playlist";
const MAX_TRACKS = 200;
const MAX_NAME_LENGTH = 24;

export type CampingTrack = CampingSearchResult & {
  addedBy: string;
  addedAt: number;
};

async function readPlaylist(): Promise<CampingTrack[]> {
  const all = await redis.hgetall<Record<string, CampingTrack>>(KEY);
  return Object.values(all ?? {}).sort((a, b) => a.addedAt - b.addedAt);
}

export async function GET() {
  try {
    return NextResponse.json(await readPlaylist());
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const track = body?.track as Partial<CampingSearchResult> | undefined;
  const addedBy = String(body?.addedBy ?? "").trim().slice(0, MAX_NAME_LENGTH);

  if (!track?.id || !track.song || !track.artist || !addedBy) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  if ((await redis.hlen(KEY)) >= MAX_TRACKS) {
    return NextResponse.json({ error: "Playlist is full" }, { status: 400 });
  }

  const entry: CampingTrack = {
    id: String(track.id),
    song: track.song,
    artist: track.artist,
    album: track.album ?? "",
    artwork: track.artwork ?? "",
    appleUrl: track.appleUrl ?? "",
    addedBy,
    addedAt: Date.now(),
  };

  const added = await redis.hsetnx(KEY, entry.id, entry);

  if (!added) {
    const existing = await redis.hget<CampingTrack>(KEY, entry.id);
    return NextResponse.json(
      { error: "Already in the playlist", addedBy: existing?.addedBy ?? "someone" },
      { status: 409 }
    );
  }

  return NextResponse.json({ playlist: await readPlaylist() });
}

export async function DELETE(req: NextRequest) {
  const token = req.headers.get("x-camping-token");
  if (!token || token !== process.env.CAMPING_ADMIN_TOKEN) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const id = body?.id ? String(body.id) : "";
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  await redis.hdel(KEY, id);
  return NextResponse.json({ playlist: await readPlaylist() });
}
