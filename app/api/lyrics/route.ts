import { Redis } from "@upstash/redis";
import { NextRequest, NextResponse } from "next/server";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const MAX_CARDS = 6;

export async function GET() {
  try {
    const lyrics = await redis.get<object[]>("lyrics");
    return NextResponse.json(lyrics ?? []);
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(req: NextRequest) {
  // Auth
  const token = req.headers.get("x-lyrics-token");
  if (!token || token !== process.env.LYRICS_UPDATE_TOKEN) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { lyric, song, artist, album, artworkBase64 } = body;

  if (!lyric || !song || !artist) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const newEntry = {
    id: `lyr-${Date.now()}`,
    lyric,
    song,
    artist,
    album: album ?? "",
    artwork: artworkBase64 ? `data:image/jpeg;base64,${artworkBase64}` : "",
  };

  // Prepend to existing list, cap at MAX_CARDS
  const existing = (await redis.get<object[]>("lyrics")) ?? [];
  const updated = [newEntry, ...existing].slice(0, MAX_CARDS);
  await redis.set("lyrics", updated);

  return NextResponse.json({ success: true });
}
