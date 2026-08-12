/** Shared types + dedupe helpers for the /camping playlist. */

export type CampingSearchResult = {
  id: string;
  song: string;
  artist: string;
  album: string;
  artwork: string;
  appleUrl: string;
};

export type CampingTrack = CampingSearchResult & {
  /** Normalised "song|artist", so a typed-in song matches the catalogue version. */
  nkey: string;
  addedBy: string;
  addedAt: number;
  /** True when someone typed this in rather than picking it from the catalogue. */
  manual: boolean;
};

/**
 * Collapse a song + artist into a comparison key. Strips accents, bracketed
 * qualifiers ("(feat. X)", "[Remastered]"), punctuation and spacing, so
 * "Holocene" and "holocene (feat. Bon Iver)" land on the same key.
 */
export function normalizeKey(song: string, artist: string): string {
  const clean = (s: string) =>
    s
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/\([^)]*\)|\[[^\]]*\]/g, "")
      .replace(/\b(feat|ft|featuring|with)\b.*$/g, "")
      .replace(/\b(remaster(ed)?|deluxe|mono|stereo|version|edit)\b/g, "")
      .replace(/[^a-z0-9]/g, "");

  return `${clean(song)}|${clean(artist)}`;
}

/** Deterministic id for a typed-in song, so two people typing the same thing collide. */
export function manualId(nkey: string): string {
  return `manual-${nkey}`;
}
