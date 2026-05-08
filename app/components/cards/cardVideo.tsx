'use client';

import { useEffect, useRef } from 'react';

export default function CardVideo({
  src,
  poster,
  square,
}: {
  src: string;
  poster?: string;
  square?: boolean;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;

    v.muted = true;
    v.defaultMuted = true;
    v.playsInline = true;

    const attemptPlay = () => {
      const p = v.play();
      if (p && typeof p.catch === 'function') p.catch(() => {});
    };

    attemptPlay();
    v.addEventListener('loadedmetadata', attemptPlay);
    v.addEventListener('canplay', attemptPlay);

    const onVisible = () => {
      if (document.visibilityState === 'visible') attemptPlay();
    };
    document.addEventListener('visibilitychange', onVisible);

    return () => {
      v.removeEventListener('loadedmetadata', attemptPlay);
      v.removeEventListener('canplay', attemptPlay);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [src]);

  const videoEl = (
    <video
      ref={ref}
      src={src}
      poster={poster}
      autoPlay
      loop
      muted
      playsInline
      preload="auto"
      webkit-playsinline="true"
      disableRemotePlayback
      className="absolute inset-0 w-full h-full object-cover"
    />
  );

  if (square) return videoEl;

  return (
    <>
      {poster && (
        <img
          src={poster}
          alt=""
          aria-hidden
          decoding="async"
          className="block w-full h-auto select-none pointer-events-none"
          draggable={false}
        />
      )}
      {videoEl}
    </>
  );
}
