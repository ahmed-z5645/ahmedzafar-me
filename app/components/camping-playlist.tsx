"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";

type Track = {
  id: string;
  song: string;
  artist: string;
  album: string;
  artwork: string;
  appleUrl: string;
};

type PlaylistTrack = Track & { addedBy: string; addedAt: number };

const NAME_KEY = "campingName";
const MAX_NAME_LENGTH = 24;

const mono = "font-[family-name:var(--font-geist-mono)]";
const serif = "font-[family-name:var(--font-newsreader)]";

/** Small square cover art, or a grey box when the catalogue has none. */
function Artwork({ src, alt }: { src: string; alt: string }) {
  if (!src) {
    return <div className="w-12 h-12 shrink-0 rounded-md bg-foreground/10" />;
  }
  return (
    <Image
      src={src}
      alt={alt}
      width={48}
      height={48}
      unoptimized
      className="w-12 h-12 shrink-0 rounded-md object-cover"
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
      setMessage("Couldn't load the playlist. Try refreshing.");
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

  async function addTrack(track: Track) {
    if (!name || pendingId) return;
    setPendingId(track.id);
    setMessage("");

    // Optimistic — reconciled with whatever the server sends back
    const optimistic: PlaylistTrack = { ...track, addedBy: name, addedAt: Date.now() };
    setPlaylist((prev) => [...prev, optimistic]);

    try {
      const res = await fetch("/api/camping", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ track, addedBy: name }),
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        setPlaylist(data.playlist);
        setMessage(`Added "${track.song}".`);
      } else {
        setPlaylist((prev) => prev.filter((t) => t !== optimistic));
        setMessage(
          res.status === 409
            ? `"${track.song}" is already in there — ${data.addedBy} beat you to it.`
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

  const addedBy = new Map(playlist.map((t) => [t.id, t.addedBy]));

  /* =========================================
     NAME GATE
     ========================================= */
  if (!nameLoaded) return null;

  if (!name) {
    return (
      <div className="max-w-[640px]">
        <h2 className={`${mono} text-body text-foreground/[0.58] mb-4 tracking-wide`}>
          [Who&apos;s There]
        </h2>
        <form onSubmit={saveName} className="flex gap-3 items-center">
          <input
            autoFocus
            value={nameDraft}
            onChange={(e) => setNameDraft(e.target.value)}
            maxLength={MAX_NAME_LENGTH}
            placeholder="your name"
            className={`${mono} text-body flex-1 bg-glass/40 backdrop-blur-md rounded-xl border border-foreground/10 px-5 py-3 text-foreground placeholder:text-foreground/[0.40] outline-none focus:border-accent/40 transition-colors`}
          />
          <button
            type="submit"
            className={`${mono} text-body cursor-pointer px-4 py-3 text-foreground/[0.58] hover:text-accent transition-colors`}
          >
            [enter]
          </button>
        </form>
        <p className={`${mono} text-body text-foreground/[0.40] mt-3`}>
          So we know whose fault each song is.
        </p>
      </div>
    );
  }

  /* =========================================
     SEARCH + PLAYLIST
     ========================================= */
  return (
    <div>
      <h2 className={`${mono} text-body text-foreground/[0.58] mb-4 tracking-wide`}>
        [Add a Song]
      </h2>

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="search a song or artist"
        className={`${mono} text-body w-full bg-glass/40 backdrop-blur-md rounded-xl border border-foreground/10 px-5 py-3 text-foreground placeholder:text-foreground/[0.40] outline-none focus:border-accent/40 transition-colors`}
      />

      <p className={`${mono} text-body text-foreground/[0.40] mt-2`}>
        Adding as {name}.{" "}
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

      {searching && (
        <p className={`${mono} text-body text-foreground/[0.40] mt-4`}>searching…</p>
      )}

      {!searching && results.length > 0 && (
        <ul className="mt-4 divide-y divide-foreground/10 border-y border-foreground/10">
          {results.map((track) => {
            const owner = addedBy.get(track.id);
            return (
              <li key={track.id} className="flex items-center gap-4 py-3">
                <Artwork src={track.artwork} alt={`${track.song} cover art`} />
                <div className="min-w-0 flex-1">
                  <p className={`${serif} text-card text-foreground truncate`}>{track.song}</p>
                  <p className={`${mono} text-body text-foreground/[0.58] truncate`}>
                    {track.artist}
                    {track.album && ` · ${track.album}`}
                  </p>
                </div>
                {owner ? (
                  <span className={`${mono} text-body text-accent shrink-0`}>
                    ✓ added by {owner}
                  </span>
                ) : (
                  <button
                    onClick={() => addTrack(track)}
                    disabled={pendingId !== null}
                    className={`${mono} text-body shrink-0 cursor-pointer text-foreground/[0.58] hover:text-accent disabled:opacity-40 disabled:cursor-default transition-colors`}
                  >
                    {pendingId === track.id ? "[adding…]" : "[add]"}
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      )}

      {message && (
        <p className={`${mono} text-body text-accent mt-4`} role="status">
          {message}
        </p>
      )}

      <h2 className={`${mono} text-body text-foreground/[0.58] mt-12 mb-4 tracking-wide`}>
        [The Playlist] — {playlist.length} {playlist.length === 1 ? "song" : "songs"}
      </h2>

      {playlist.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-foreground/[0.20] bg-foreground/[0.02] py-16">
          <p className={`${mono} text-body text-foreground/[0.40]`}>[ Nothing yet ]</p>
          <p className={`${mono} text-[11px] text-foreground/[0.30]`}>
            Somebody has to go first.
          </p>
        </div>
      ) : (
        <ol className="divide-y divide-foreground/10 border-y border-foreground/10">
          {playlist.map((track, i) => (
            <li key={track.id} className="flex items-center gap-4 py-3">
              <span className={`${mono} text-body text-foreground/[0.40] w-6 shrink-0 tabular-nums`}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <Artwork src={track.artwork} alt={`${track.song} cover art`} />
              <div className="min-w-0 flex-1">
                <p className={`${serif} text-card text-foreground truncate`}>{track.song}</p>
                <p className={`${mono} text-body text-foreground/[0.58] truncate`}>
                  {track.artist}
                </p>
              </div>
              <span className={`${mono} text-body text-foreground/[0.40] shrink-0 hidden sm:block`}>
                {track.addedBy}
              </span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
