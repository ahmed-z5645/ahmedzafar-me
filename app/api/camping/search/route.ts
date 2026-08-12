import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/** A song from the iTunes catalogue, before anyone has claimed it. */
export type CampingSearchResult = {
  id: string;
  song: string;
  artist: string;
  album: string;
  artwork: string;
  appleUrl: string;
};

type ITunesTrack = {
  trackId?: number;
  trackName?: string;
  artistName?: string;
  collectionName?: string;
  artworkUrl100?: string;
  trackViewUrl?: string;
};

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim();
  if (!q) return NextResponse.json([]);

  try {
    const url =
      "https://itunes.apple.com/search?" +
      new URLSearchParams({
        term: q,
        media: "music",
        entity: "song",
        limit: "8",
        country: "CA",
      });

    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return NextResponse.json([]);

    const data = (await res.json()) as { results?: ITunesTrack[] };

    const results: CampingSearchResult[] = (data.results ?? [])
      .filter((t) => t.trackId && t.trackName && t.artistName)
      .map((t) => ({
        id: String(t.trackId),
        song: t.trackName!,
        artist: t.artistName!,
        album: t.collectionName ?? "",
        // artworkUrl100 is a resizable URL — ask for something sharper
        artwork: (t.artworkUrl100 ?? "").replace("100x100", "300x300"),
        appleUrl: t.trackViewUrl ?? "",
      }));

    return NextResponse.json(results);
  } catch {
    return NextResponse.json([]);
  }
}
