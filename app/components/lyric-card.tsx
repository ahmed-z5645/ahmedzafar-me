import Image from "next/image";

interface LyricCardProps {
  lyric: string;
  song: string;
  artist: string;
  album: string;
  artwork: string;
}

export default function LyricCard({ lyric, song, artist, album, artwork }: LyricCardProps) {
  const lines = lyric.split("\n");

  return (
    <div className="relative flex flex-col justify-between rounded-2xl overflow-hidden bg-[#111] p-6 aspect-square">
      {/* Subtle radial gradient for depth */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_#2a2a2a,_#0a0a0a)] pointer-events-none" />

      {/* Lyric */}
      <div className="relative flex-1 flex items-center">
        <p className="font-[family-name:var(--font-newsreader)] text-[22px] leading-[1.35] tracking-tight text-white">
          {lines.map((line, i) => (
            <span key={i}>
              {line}
              {i < lines.length - 1 && <br />}
            </span>
          ))}
        </p>
      </div>

      {/* Footer — artwork + metadata */}
      <div className="relative flex items-center gap-3 mt-6">
        {artwork ? (
          <Image
            src={artwork}
            alt={album}
            width={40}
            height={40}
            className="rounded-md shrink-0"
          />
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
        {/* Apple Music logo mark */}
        <svg className="ml-auto shrink-0 opacity-40" width="20" height="20" viewBox="0 0 24 24" fill="white">
          <path d="M23.994 6.124a9.23 9.23 0 0 0-.24-2.19c-.317-1.31-1.062-2.31-2.18-3.043a5.022 5.022 0 0 0-1.764-.76c-.584-.13-1.182-.19-1.773-.22-.8-.04-1.055-.05-3.093-.05H9.057c-2.038 0-2.274.01-3.093.05-.59.03-1.19.09-1.773.22a5.022 5.022 0 0 0-1.764.76C1.315 1.624.57 2.624.253 3.934a9.23 9.23 0 0 0-.24 2.19C-.002 6.954-.01 7.2-.01 9.257v5.486c0 2.057.008 2.303.044 3.123a9.23 9.23 0 0 0 .24 2.19c.317 1.31 1.062 2.31 2.18 3.043.585.374 1.155.62 1.764.76.584.13 1.182.19 1.773.22.8.04 1.055.05 3.093.05h5.886c2.038 0 2.274-.01 3.093-.05.59-.03 1.19-.09 1.773-.22a5.022 5.022 0 0 0 1.764-.76c1.118-.733 1.863-1.733 2.18-3.043a9.23 9.23 0 0 0 .24-2.19c.036-.82.044-1.066.044-3.123V9.257c0-2.057-.008-2.303-.044-3.133zM12 18.915a6.915 6.915 0 1 1 0-13.83 6.915 6.915 0 0 1 0 13.83zm0-11.366a4.451 4.451 0 1 0 0 8.902 4.451 4.451 0 0 0 0-8.902zm7.192-2.415a1.615 1.615 0 1 1 0 3.23 1.615 1.615 0 0 1 0-3.23z"/>
        </svg>
      </div>
    </div>
  );
}
