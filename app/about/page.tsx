import { Redis } from "@upstash/redis";
import Footer from "../components/footer/footer";
import Header from "../components/header/header";
import ProjectCard from "../components/cards/card";
import Image from "next/image";
import LyricCard from "../components/lyric-card";
import photos from "../data/about.json";
import checklist from "../data/checklist.json";
import defaultLyrics from "../data/lyrics.json";

export const dynamic = "force-dynamic";

async function getLyrics() {
  try {
    const redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    });
    const stored = await redis.get<typeof defaultLyrics>("lyrics");
    return stored && stored.length > 0 ? stored : defaultLyrics;
  } catch {
    return defaultLyrics;
  }
}

export default async function About() {
  const lyrics = await getLyrics();

  return (
    <div className="min-h-screen">
      <main className="max-w-[1600px] mx-auto">

        {/* =========================================
            TOP — 40/60 split (natural height)
            ========================================= */}
        <div className="flex flex-col lg:flex-row">

          {/* LEFT — issue label + hero + checklist */}
          <div className="lg:w-[40%] flex flex-col p-8 pb-0 lg:pt-9 lg:pb-12 lg:pl-24 lg:pr-12">
            <p className="font-[family-name:var(--font-geist-mono)] text-body text-foreground/[0.58]">
              ISSUE 02 | SPRING 2026
            </p>
            <div className="mt-8 lg:mt-18">
              <h1 className="hero-title-group font-[family-name:var(--font-newsreader)] text-hero leading-[1.1] tracking-tight text-foreground mb-2">
                Beyond the <span className="italic wipe-word wipe-1">code.</span>
              </h1>
              <p className="text-body text-foreground/[0.58]">
                Outside of engineering, I'm a musician, a reader, and someone who takes too many photos of ordinary things.
                <br />
                <br />
                This page is a small window into who I am when I'm not staring at a terminal.
              </p>
            </div>

          </div>

          {/* RIGHT — nav + photo grid */}
          <div className="lg:w-[60%] p-8 lg:pt-8 lg:pr-24 lg:pl-12 flex flex-col">
            <Header />
            <section>
              <h2 className="font-[family-name:var(--font-geist-mono)] text-body text-foreground/[0.58] mb-6 tracking-wide">
                [Photos]
              </h2>
              <div className="columns-1 md:columns-3 gap-6 w-full">
                {photos.map((photo) => (
                  <ProjectCard key={photo.id} project={photo} />
                ))}
              </div>
            </section>
          </div>

        </div>

        {/* =========================================
            CHECKLIST — full width, two columns
            ========================================= */}
        <section className="px-8 py-12 lg:px-24 lg:py-16">
          <h2 className="font-[family-name:var(--font-geist-mono)] text-body text-foreground/[0.58] mb-4 tracking-wide">
            [Life list - {checklist.filter(i => i.checked).length}/{checklist.length}]
          </h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-16">
            {checklist.map((item) => (
              <li key={item.id} className="group flex items-start gap-2.5 py-1.5 border-foreground/[0.06]">
                <span className={`font-[family-name:var(--font-geist-mono)] text-[11px] mt-[3px] shrink-0 ${item.checked ? "text-accent" : "text-foreground/[0.25]"}`}>
                  {item.checked ? "✓" : "○"}
                </span>
                <span className={`text-body leading-snug transition-colors duration-150 ${item.checked ? "text-foreground/[0.40] line-through decoration-foreground/[0.25]" : "text-foreground/[0.75]"} group-hover:text-accent`}>
                  {item.text}
                </span>
                <div className="font-[family-name:var(--font-geist-sans)] note-annotation text-body mt-4 italic text-accent">
                  {item.note}
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* =========================================
            LYRIC CARDS — Apple Music style
            ========================================= */}
        <section className="px-8 py-12 lg:px-24 lg:py-16 border-t border-foreground/[0.08]">
          <h2 className="font-[family-name:var(--font-geist-mono)] text-body text-foreground/[0.58] mb-10 tracking-wide">
            [On repeat]
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {lyrics.map((item) => (
              <LyricCard
                key={item.id}
                lyric={item.lyric}
                song={item.song}
                artist={item.artist}
                album={item.album}
                artwork={item.artwork}
              />
            ))}
          </div>
        </section>

        <Footer />

      </main>
    </div>
  );
}
