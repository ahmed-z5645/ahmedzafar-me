import { Redis } from "@upstash/redis";
import { NextRequest, NextResponse } from "next/server";
import {
  manualId,
  normalizeKey,
  type CampingSearchResult,
  type CampingTrack,
} from "../../lib/camping";

export const dynamic = "force-dynamic";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

/** Redis hash: field = track id, value = CampingTrack. Hash + HSETNX makes
 *  "add only if nobody has added it yet" atomic, so two friends adding at the
 *  same moment can't clobber each other. */
const KEY = "camping:playlist";
const MAX_TRACKS = 800;
const MAX_NAME_LENGTH = 24;
const MAX_FIELD_LENGTH = 200;

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
  const manual = Boolean(body?.manual);
  const addedBy = String(body?.addedBy ?? "").trim().slice(0, MAX_NAME_LENGTH);

  const song = String(track?.song ?? "").trim().slice(0, MAX_FIELD_LENGTH);
  const artist = String(track?.artist ?? "").trim().slice(0, MAX_FIELD_LENGTH);

  if (!song || !artist || !addedBy) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const nkey = normalizeKey(song, artist);
  // Catalogue picks are keyed by their Apple track id; typed-in songs get a
  // deterministic id from the normalised name, so two people typing the same
  // thing still collide on HSETNX.
  const id = manual || !track?.id ? manualId(nkey) : String(track.id);

  if ((await redis.hlen(KEY)) >= MAX_TRACKS) {
    return NextResponse.json({ error: "Playlist is full" }, { status: 400 });
  }

  // Cross-source duplicate check: catches "typed in by hand" vs "picked from
  // the catalogue" for the same song, which have different ids. Best-effort —
  // HSETNX below is what actually guarantees no exact-id double-write.
  const existingByName = (await readPlaylist()).find((t) => t.nkey === nkey);
  if (existingByName) {
    return NextResponse.json(
      { error: "Already in the playlist", addedBy: existingByName.addedBy },
      { status: 409 }
    );
  }

  const entry: CampingTrack = {
    id,
    song,
    artist,
    album: manual ? "" : track?.album ?? "",
    artwork: manual ? "" : track?.artwork ?? "",
    appleUrl: manual ? "" : track?.appleUrl ?? "",
    nkey,
    addedBy,
    addedAt: Date.now(),
    manual,
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
  const isAdmin = Boolean(token && token === process.env.CAMPING_ADMIN_TOKEN);

  // A wrong key is worth calling out rather than silently falling through
  // to the weaker name check.
  if (token && !isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const id = body?.id ? String(body.id) : "";
  const addedBy = String(body?.addedBy ?? "").trim();
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const entry = await redis.hget<CampingTrack>(KEY, id);
  if (!entry) {
    // Already gone — treat as success so double-clicks don't error.
    return NextResponse.json({ playlist: await readPlaylist() });
  }

  // Anyone can take back their own pick; only the admin key removes someone
  // else's. Name matching is not real auth — see the note in the README.
  if (!isAdmin && entry.addedBy !== addedBy) {
    return NextResponse.json(
      { error: "That's not yours to remove" },
      { status: 403 }
    );
  }

  await redis.hdel(KEY, id);
  return NextResponse.json({ playlist: await readPlaylist() });
}
