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

const FALLBACK_COLORS: [string, string, string] = ["hsl(220, 60%, 40%)", "hsl(260, 50%, 45%)", "hsl(200, 55%, 38%)"];

function extractColors(src: string): Promise<[string, string, string]> {
  return new Promise((resolve) => {
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        const SIZE = 50;
        const canvas = document.createElement("canvas");
        canvas.width = SIZE;
        canvas.height = SIZE;
        const ctx = canvas.getContext("2d")!;
        ctx.drawImage(img, 0, 0, SIZE, SIZE);
        const { data } = ctx.getImageData(0, 0, SIZE, SIZE);

        // Quantize each pixel into buckets of 32 to group similar colours
        const buckets = new Map<string, number>();
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i], g = data[i + 1], b = data[i + 2];
          // Skip near-black and near-white
          if (r + g + b < 60 || r + g + b > 700) continue;
          const key = `${Math.round(r / 32) * 32},${Math.round(g / 32) * 32},${Math.round(b / 32) * 32}`;
          buckets.set(key, (buckets.get(key) ?? 0) + 1);
        }

        const sorted = [...buckets.entries()].sort((a, b) => b[1] - a[1]);
        if (sorted.length < 3) return resolve(FALLBACK_COLORS);

        const toRgb = (key: string) => `rgb(${key})`;
        resolve([toRgb(sorted[0][0]), toRgb(sorted[1][0]), toRgb(sorted[2][0])]);
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
    <div className="relative aspect-square lg:aspect-video rounded-2xl overflow-hidden bg-[#1a1a1a] flex flex-col">

      {/* ── Ambient lava-lamp background ── */}
      <div className="absolute inset-0">
        <div className="lyric-blob lyric-blob-1" style={{ background: colors[0] }} />
        <div className="lyric-blob lyric-blob-2" style={{ background: colors[1] }} />
        <div className="lyric-blob lyric-blob-3" style={{ background: colors[2] }} />
      </div>

      {/* Dark vignette so text stays readable */}
      <div className="absolute inset-0 bg-black/20 pointer-events-none" />

      {/* ── LARGE: full lyric card ── */}
      <div className="relative hidden lg:flex flex-col justify-between h-full p-6">
        <div className="flex-1 flex items-center">
          <p className="font-[family-name:var(--font-geist-sans)] font-bold text-[22px] leading-[1.35] tracking-normal text-white">
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
            <p className="font-[family-name:var(--font-geist-sans)] font-bold text-[13px] text-white leading-tight truncate">
              {song}
            </p>
            <p className="font-[family-name:var(--font-geist-sans)] font-bold text-[12px] text-white/50 leading-tight truncate">
              {artist} · {album}
            </p>
          </div>
        </div>
      </div>

      {/* ── SMALL/MEDIUM: square with large artwork ── */}
      <div className="relative flex lg:hidden flex-col items-center justify-center h-full gap-3 p-5">
        {artwork ? (
          <Image src={artwork} alt={album} width={160} height={160} className="w-3/5 h-auto rounded-xl shadow-2xl shrink-0" />
        ) : (
          <div className="w-3/5 aspect-square rounded-xl bg-white/10 shrink-0" />
        )}
        <div className="text-center min-w-0 w-full px-2">
          <p className="font-[family-name:var(--font-geist-sans)] font-bold text-[13px] text-white leading-tight truncate">
            {song}
          </p>
          <p className="font-[family-name:var(--font-geist-sans)] font-bold text-[11px] text-white/50 leading-tight truncate mt-0.5">
            {artist}
          </p>
        </div>
      </div>
    </div>
  );
}
