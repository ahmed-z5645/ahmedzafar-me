import { Redis } from "@upstash/redis";
import Footer from "../components/footer/footer";
import Header from "../components/header/header";
import ProjectCard from "../components/cards/card";
import LyricCard from "../components/lyric-card";
import photos from "../data/about.json";
import checklist from "../data/checklist.json";
import testimonials from "../data/testimonials.json";
import TestimonialsBoard from "../components/testimonials-grid";
import Links from "../components/links/links";
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
                Engineer by training.<br />
                <span className="italic wipe-word wipe-1">Human</span> by design.
              </h1>
              <p className="text-body text-foreground/[0.58]">
                Building doesn't always mean minimizing latency, or maximizing throughput. While I'm definitely obsessing about numerical acceleration or trying to model biological systems, I lead a very full and rich life in the analog world.
                Outside the terminal you can find me:
              </p>
              <ul className="list-disc ml-5 mt-1 space-y-0 text-foreground/[0.58] text-body leading-snug">
                <li>Expanding my music taste <div className="font-[family-name:var(--font-geist-sans)] note-annotation italic text-accent">probably still listening to the Strokes</div></li>
                <li>Trying or inventing new recipes</li>
                <li>Buying books I'll get around to reading one day</li>
                <li>Playing the guitar <div className="font-[family-name:var(--font-geist-sans)] note-annotation italic text-accent">(trying**)</div></li>
                <li>Playing on our intramural soccer and volleyball teams</li>
                <li>Watering my plants</li>
                <li>Blogging</li>
                <li className="note-li font-[family-name:var(--font-geist-sans)] italic text-accent">At the gym</li>
                <li className="note-li font-[family-name:var(--font-geist-sans)] italic text-accent">Fighting Ticket Master</li>
                <li className="note-li font-[family-name:var(--font-geist-sans)] italic text-accent">Chasing the best americano</li>
                <li className="note-li font-[family-name:var(--font-geist-sans)] italic text-accent">Spinning some vinyl</li>
                <li className="note-li font-[family-name:var(--font-geist-sans)] italic text-accent">Planning my next trip</li>
              </ul>
              <p className="text-body text-foreground/[0.58] mt-4">
                The best engineers understand how to build communities, pursue passions, and live in the intersections of what they love.
              </p>

              <br />
              <p className="text-body text-foreground/[0.58]">Always open new opportunities. If you're working on something cool, interesting, let's chat!</p>
            </div>

            <div className="mt-12 mb-0 lg:mb-0 lg:mt-auto">
              <Links />
            </div>
          </div>

          {/* RIGHT — nav + photo grid */}
          <div className="lg:w-[60%] p-8 lg:pt-8 lg:pr-24 lg:pl-12 flex flex-col">
            <Header />
            <section>
              <h2 className="font-[family-name:var(--font-geist-mono)] text-body text-foreground/[0.58] mb-6 tracking-wide">
                [Photos]
              </h2>
              <div className="columns-2 md:columns-3 gap-6 w-full">
                {photos.map((photo) => (
                  <ProjectCard key={photo.id} project={photo} square />
                ))}
              </div>
            </section>
          </div>

        </div>

        {/* =========================================
            GROUP CHAT — masonry of message screenshots
            ========================================= */}
        <section className="px-8 py-12 lg:px-24 lg:py-16 border-t border-foreground/[0.08]">
          <h2 className="font-[family-name:var(--font-geist-mono)] text-body text-foreground/[0.58] mb-10 tracking-wide">
            [Through the grapevine]
            <div className="font-[family-name:var(--font-geist-sans)] note-annotation text-body mb-0 mt-0 italic text-accent">
              These are the things people have said that I try to live up to.
              <br />
              Drag and drop, by the way.
            </div>
          </h2>
          
          <TestimonialsBoard items={testimonials.filter(t => t.image) as { id: string; image: string }[]} />
        </section>

        <hr className="border-t border-foreground/[0.08] mx-8 lg:mx-24" />

        {/* =========================================
            CHECKLIST — full width, two columns
            ========================================= */}
        <section className="px-8 py-12 lg:px-24 lg:py-16">
          <h2 className="font-[family-name:var(--font-geist-mono)] text-body text-foreground/[0.58] mb-4 tracking-wide">
            [Life checklist - {checklist.filter(i => i.checked).length}/{checklist.length}]
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16">
            {[checklist.slice(0, 10), checklist.slice(10)].map((col, ci) => (
              <ul key={ci}>
                {col.map((item) => (
                  <li key={item.id} className="group flex items-start gap-2.5 py-1.5 transition-transform duration-150 ease-out hover:translate-x-1.5">
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
            ))}
          </div>
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
