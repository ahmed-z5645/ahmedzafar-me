"use client";

import { useState } from "react";

/** A YouTube walkthrough, embedded as a click-to-load facade.
 *
 *  The facade is the point: these docs pages carry a video each, and most
 *  visitors come to copy a snippet and leave. Showing a thumbnail until someone
 *  actually clicks keeps YouTube's player (and its cookies) off the page for
 *  everyone else. The embed uses youtube-nocookie for the same reason. */
export default function Walkthrough({
  videoId,
  title,
  caption,
}: {
  videoId: string;
  title: string;
  caption?: string;
}) {
  const [playing, setPlaying] = useState(false);
  // maxresdefault is missing for some uploads; hqdefault always exists.
  const [thumb, setThumb] = useState(
    `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`,
  );

  return (
    <figure className="mt-8">
      <div className="relative w-full aspect-video overflow-hidden rounded border border-foreground/[0.15] bg-surface">
        {playing ? (
          <iframe
            className="absolute inset-0 w-full h-full border-0"
            src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            aria-label={`Play video: ${title}`}
            className="group absolute inset-0 w-full h-full cursor-pointer"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={thumb}
              alt=""
              aria-hidden
              onError={() =>
                setThumb(`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`)
              }
              className="absolute inset-0 w-full h-full object-cover"
            />
            <span className="absolute inset-0 bg-black/25 group-hover:bg-black/10 transition-colors" />
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="flex items-center justify-center w-16 h-16 rounded-full bg-white/95 shadow-lg group-hover:scale-105 transition-transform">
                <svg
                  viewBox="0 0 24 24"
                  className="w-6 h-6 ml-1"
                  fill="#1D1F3E"
                  aria-hidden
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
            </span>
          </button>
        )}
      </div>
      {caption && (
        <figcaption className="mt-3 font-[family-name:var(--font-geist-sans)] text-body leading-relaxed text-foreground/[0.58]">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
