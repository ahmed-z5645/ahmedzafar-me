"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  normalizeKey,
  type CampingSearchResult as Track,
  type CampingTrack as PlaylistTrack,
} from "../lib/camping";

const NAME_KEY = "campingName";
const MAX_NAME_LENGTH = 24;

const puff = "font-[family-name:var(--font-dynapuff)]";

const inputClass =
  "w-full bg-[var(--camp-cream)] rounded-full border-2 border-foreground/15 px-6 py-3.5 text-[16px] text-foreground placeholder:text-foreground/35 outline-none focus:border-accent transition-colors";

/** Cover art, or a friendly placeholder when there isn't any. */
function Artwork({ src, alt }: { src: string; alt: string }) {
  if (!src) {
    return (
      <div className="w-14 h-14 shrink-0 rounded-2xl bg-foreground/10 flex items-center justify-center text-[20px]">
        🎵
      </div>
    );
  }
  return (
    <Image
      src={src}
      alt={alt}
      width={56}
      height={56}
      unoptimized
      className="w-14 h-14 shrink-0 rounded-2xl object-cover"
    />
  );
}

export default function CampingPlaylist() {
  const [name, setName] = useState<string | null>(null);
  const [nameDraft, setNameDraft] = useState("");
  const [nameLoaded, setNameLoaded] = useState(false);

  const [playlist, setPlaylist] = useState<PlaylistTrack[]>([]);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Track[]>([]);
  const [searching, setSearching] = useState(false);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  const [manualOpen, setManualOpen] = useState(false);
  const [manualSong, setManualSong] = useState("");
  const [manualArtist, setManualArtist] = useState("");

  // Ignore responses from searches the user has already typed past
  const searchSeq = useRef(0);

  useEffect(() => {
    setName(localStorage.getItem(NAME_KEY));
    setNameLoaded(true);
  }, []);

  const loadPlaylist = useCallback(async () => {
    try {
      const res = await fetch("/api/camping", { cache: "no-store" });
      if (res.ok) setPlaylist(await res.json());
    } catch {
      setMessage("Couldn't load the playlist. Try refreshing!");
    }
  }, []);

  useEffect(() => {
    loadPlaylist();
  }, [loadPlaylist]);

  // Debounced catalogue search
  useEffect(() => {
    const q = query.trim();
    if (!q) {
      setResults([]);
      setSearching(false);
      return;
    }

    setSearching(true);
    const seq = ++searchSeq.current;
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/camping/search?q=${encodeURIComponent(q)}`);
        const data = res.ok ? await res.json() : [];
        if (seq === searchSeq.current) setResults(data);
      } catch {
        if (seq === searchSeq.current) setResults([]);
      } finally {
        if (seq === searchSeq.current) setSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  function saveName(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = nameDraft.trim().slice(0, MAX_NAME_LENGTH);
    if (!trimmed) return;
    localStorage.setItem(NAME_KEY, trimmed);
    setName(trimmed);
  }

  async function addTrack(track: Track, manual = false) {
    if (!name || pendingId !== null) return;
    // Manual entries have no id yet — the server derives one from the name.
    setPendingId(track.id || "manual");
    setMessage("");

    // Optimistic — reconciled with whatever the server sends back
    const optimistic: PlaylistTrack = {
      ...track,
      nkey: normalizeKey(track.song, track.artist),
      addedBy: name,
      addedAt: Date.now(),
      manual,
    };
    setPlaylist((prev) => [...prev, optimistic]);

    try {
      const res = await fetch("/api/camping", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ track, addedBy: name, manual }),
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        setPlaylist(data.playlist);
        setMessage(`“${track.song}” is in! 🔥`);
      } else {
        setPlaylist((prev) => prev.filter((t) => t !== optimistic));
        setMessage(
          res.status === 409
            ? `“${track.song}” is already in there — ${data.addedBy} beat you to it!`
            : data.error ?? "Couldn't add that one."
        );
        if (res.status === 409) loadPlaylist();
      }
    } catch {
      setPlaylist((prev) => prev.filter((t) => t !== optimistic));
      setMessage("Couldn't add that one — check your connection.");
    } finally {
      setPendingId(null);
    }
  }

  // Keyed on the normalised name, not the id, so a song someone typed in by
  // hand still shows as "already added" when the next person finds it in search.
  const addedBy = new Map(playlist.map((t) => [t.nkey, t.addedBy]));

  async function addManual(e: React.FormEvent) {
    e.preventDefault();
    const song = manualSong.trim();
    const artist = manualArtist.trim();
    if (!song || !artist) return;

    await addTrack(
      { id: "", song, artist, album: "", artwork: "", appleUrl: "" },
      true
    );
    setManualSong("");
    setManualArtist("");
    setManualOpen(false);
  }

  /* =========================================
     NAME GATE
     ========================================= */
  if (!nameLoaded) return null;

  if (!name) {
    return (
      <div className="bg-[var(--camp-cream)] rounded-[28px] p-8 sm:p-10 shadow-[0_2px_0_rgba(27,67,50,0.15)] border-2 border-foreground/10 text-center">
        <h2 className={`${puff} text-[26px] mb-2`}>who ARE you 😭😭</h2>
        <p className="text-[16px] text-foreground/70 mb-6">
          For song editing purposes etc.
        </p>
        <form onSubmit={saveName} className="flex flex-col sm:flex-row gap-3 max-w-[440px] mx-auto">
          <input
            autoFocus
            value={nameDraft}
            onChange={(e) => setNameDraft(e.target.value)}
            maxLength={MAX_NAME_LENGTH}
            placeholder="your name"
            className={`${inputClass} bg-background text-center sm:text-left`}
          />
          <button
            type="submit"
            className={`${puff} camp-button cursor-pointer px-7 py-3.5 text-[16px] shrink-0`}
          >
            Let&apos;s go
          </button>
        </form>
      </div>
    );
  }

  /* =========================================
     SEARCH + PLAYLIST
     ========================================= */
  return (
    <div className="pb-4">

      {/* ---------- Add a song ---------- */}
      <div className="bg-[var(--camp-cream)] rounded-[28px] p-6 sm:p-8 shadow-[0_2px_0_rgba(27,67,50,0.15)] border-2 border-foreground/10">
        <div className="flex items-baseline justify-between gap-4 mb-4 flex-wrap">
          <h2 className={`${puff} text-[24px]`}>Add a song</h2>
          <p className="text-[14px] text-foreground/60">
            you&apos;re {name} ·{" "}
            <button
              onClick={() => {
                localStorage.removeItem(NAME_KEY);
                setName(null);
                setNameDraft("");
              }}
              className="cursor-pointer underline underline-offset-2 hover:text-accent transition-colors"
            >
              not you?
            </button>
          </p>
        </div>

        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="🔍  search a song or artist…"
          className={`${inputClass} bg-background`}
        />

        {searching && (
          <p className="text-[15px] text-foreground/50 mt-4 px-2">looking…</p>
        )}

        {!searching && results.length > 0 && (
          <ul className="mt-4 flex flex-col gap-2">
            {results.map((track) => {
              const owner = addedBy.get(normalizeKey(track.song, track.artist));
              return (
                <li
                  key={track.id}
                  className="flex items-center gap-4 p-2.5 rounded-2xl bg-background/60"
                >
                  <Artwork src={track.artwork} alt={`${track.song} cover art`} />
                  <div className="min-w-0 flex-1">
                    <p className="text-[16px] font-semibold text-foreground truncate">
                      {track.song}
                    </p>
                    <p className="text-[14px] text-foreground/60 truncate">
                      {track.artist}
                      {track.album && ` · ${track.album}`}
                    </p>
                  </div>
                  {owner ? (
                    <span className="text-[14px] text-accent shrink-0 pr-2 text-right">
                      ✓ {owner} got it
                    </span>
                  ) : (
                    <button
                      onClick={() => addTrack(track)}
                      disabled={pendingId !== null}
                      className={`${puff} camp-button cursor-pointer px-5 py-2.5 text-[15px] shrink-0`}
                    >
                      {pendingId === track.id ? "adding…" : "Add"}
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        )}

        {/* Escape hatch — Apple's search index doesn't have everything, and
            the export resolves songs by name anyway, so typed-in entries work. */}
        <div className="mt-5">
          {manualOpen ? (
            <form onSubmit={addManual} className="flex flex-col sm:flex-row gap-3">
              <input
                autoFocus
                value={manualSong}
                onChange={(e) => setManualSong(e.target.value)}
                placeholder="song title"
                className={`${inputClass} bg-background`}
              />
              <input
                value={manualArtist}
                onChange={(e) => setManualArtist(e.target.value)}
                placeholder="artist"
                className={`${inputClass} bg-background`}
              />
              <div className="flex gap-2 shrink-0 justify-center">
                <button
                  type="submit"
                  disabled={pendingId !== null || !manualSong.trim() || !manualArtist.trim()}
                  className={`${puff} camp-button cursor-pointer px-6 py-3.5 text-[15px]`}
                >
                  Add it
                </button>
                <button
                  type="button"
                  onClick={() => setManualOpen(false)}
                  className="cursor-pointer px-3 py-3.5 text-[15px] text-foreground/50 hover:text-accent transition-colors"
                >
                  cancel
                </button>
              </div>
            </form>
          ) : (
            <button
              onClick={() => setManualOpen(true)}
              className="cursor-pointer text-[15px] text-foreground/55 hover:text-accent transition-colors"
            >
              Can&apos;t find it? Type it in yourself →
            </button>
          )}
        </div>

        {message && (
          <p
            className="text-[15px] text-accent mt-4 px-2 font-semibold"
            role="status"
          >
            {message}
          </p>
        )}
      </div>

      {/* ---------- The playlist ---------- */}
      <div className="flex items-baseline justify-between gap-4 mt-14 mb-5 px-2 flex-wrap">
        <h2 className={`${puff} text-[30px]`}>The pile</h2>
        <span className="text-[15px] text-foreground/60">
          {playlist.length} {playlist.length === 1 ? "song" : "songs"} so far
        </span>
      </div>

      {playlist.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 rounded-[28px] border-2 border-dashed border-foreground/25 py-16 px-6 text-center">
          <span className="text-[30px]">🪵</span>
          <p className={`${puff} text-[20px]`}>Nothing here yet</p>
          <p className="text-[15px] text-foreground/60">Somebody has to go first.</p>
        </div>
      ) : (
        <ol className="flex flex-col gap-3">
          {playlist.map((track, i) => (
            <li
              key={track.id}
              className="camp-tilt flex items-center gap-4 bg-[var(--camp-cream)] rounded-3xl p-3.5 pr-5 border-2 border-foreground/10 shadow-[0_2px_0_rgba(27,67,50,0.12)]"
            >
              <span className={`${puff} text-[17px] text-foreground/35 w-7 shrink-0 text-center`}>
                {i + 1}
              </span>
              <Artwork src={track.artwork} alt={`${track.song} cover art`} />
              <div className="min-w-0 flex-1">
                <p className="text-[17px] font-semibold text-foreground truncate">
                  {track.song}
                </p>
                <p className="text-[14px] text-foreground/60 truncate">
                  {track.artist}
                  {track.manual && (
                    <span className="text-foreground/40"> · typed in</span>
                  )}
                </p>
              </div>
              <span className="text-[14px] text-foreground/45 shrink-0 hidden sm:block">
                {track.addedBy}
              </span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
