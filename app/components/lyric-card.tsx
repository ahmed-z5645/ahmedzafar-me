"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface LyricCardProps {
  lyric: string;
  song: string;
  artist: string;
  album: string;
  artwork: string;
}

const FALLBACK_COLORS: [string, string, string] = ["#1a1a2e", "#16213e", "#0f3460"];

function extractColors(src: string): Promise<[string, string, string]> {
  return new Promise((resolve) => {
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = 30;
        canvas.height = 30;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0, 30, 30);

        const sample = (x: number, y: number): string => {
          const d = ctx.getImageData(x, y, 1, 1).data;
          // Boost towards a more saturated version for visual punch
          return `rgb(${d[0]}, ${d[1]}, ${d[2]})`;
        };

        resolve([sample(4, 4), sample(25, 4), sample(15, 25)]);
      } catch {
        resolve(FALLBACK_COLORS);
      }
    };
    img.onerror = () => resolve(FALLBACK_COLORS);
    img.src = src;
  });
}

export default function LyricCard({ lyric, song, artist, album, artwork }: LyricCardProps) {
  const [colors, setColors] = useState<[string, string, string]>(FALLBACK_COLORS);
  const lines = lyric.split("\n");

  useEffect(() => {
    if (!artwork) return;
    extractColors(artwork).then(setColors);
  }, [artwork]);

  return (
    <div className="relative aspect-video rounded-2xl overflow-hidden bg-[#0a0a0a] flex flex-col">

      {/* ── Ambient lava-lamp background ── */}
      <div className="absolute inset-0">
        <div className="lyric-blob lyric-blob-1" style={{ background: colors[0] }} />
        <div className="lyric-blob lyric-blob-2" style={{ background: colors[1] }} />
        <div className="lyric-blob lyric-blob-3" style={{ background: colors[2] }} />
      </div>

      {/* Dark vignette so text stays readable */}
      <div className="absolute inset-0 bg-black/40 pointer-events-none" />

      {/* ── LARGE: full lyric card ── */}
      <div className="relative hidden lg:flex flex-col justify-between h-full p-6">
        <div className="flex-1 flex items-center">
          <p className="font-[family-name:var(--font-newsreader)] text-[22px] leading-[1.35] tracking-tight text-white">
            {lines.map((line, i) => (
              <span key={i}>
                {line}
                {i < lines.length - 1 && <br />}
              </span>
            ))}
          </p>
        </div>

        <div className="flex items-center gap-3 mt-6">
          {artwork ? (
            <Image src={artwork} alt={album} width={40} height={40} className="rounded-md shrink-0" />
          ) : (
            <div className="w-10 h-10 rounded-md bg-white/10 shrink-0" />
          )}
          <div className="min-w-0">
            <p className="font-[family-name:var(--font-geist-sans)] text-[13px] text-white leading-tight truncate">
              {song}
            </p>
            <p className="font-[family-name:var(--font-geist-sans)] text-[12px] text-white/50 leading-tight truncate">
              {artist} · {album}
            </p>
          </div>
        </div>
      </div>

      {/* ── SMALL/MEDIUM: compact — art + title only ── */}
      <div className="relative flex lg:hidden flex-col justify-end h-full p-4">
        <p className="font-[family-name:var(--font-geist-sans)] text-[13px] font-medium text-white leading-tight truncate">
          {song}
        </p>
        <p className="font-[family-name:var(--font-geist-sans)] text-[11px] text-white/50 leading-tight truncate mt-0.5">
          {artist}
        </p>
      </div>
    </div>
  );
}
