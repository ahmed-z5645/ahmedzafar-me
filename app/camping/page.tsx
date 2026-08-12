import type { Metadata } from "next";
import Header from "../components/header/header";
import Footer from "../components/footer/footer";
import CampingPlaylist from "../components/camping-playlist";

export const metadata: Metadata = {
  title: "Camping Playlist",
  description: "A shared playlist, built by the people in the tent.",
  robots: { index: false, follow: false },
};

export default function Camping() {
  return (
    <div className="min-h-screen">
      <main className="flex flex-col lg:flex-row max-w-[1600px] mx-auto">

        {/* =========================================
            LEFT COLUMN — hero
            ========================================= */}
        <div className="lg:w-[40%] lg:h-screen lg:sticky lg:top-0 lg:overflow-y-auto flex flex-col p-8 pb-0 lg:pt-9 lg:pb-12 lg:pl-24 lg:pr-12">
          <p className="font-[family-name:var(--font-geist-mono)] text-body text-foreground/[0.58]">
            CAMPING | SUMMER 2026
          </p>

          <div className="mt-8 lg:mt-18">
            <h1 className="hero-title-group font-[family-name:var(--font-newsreader)] text-hero leading-[1.1] tracking-tight text-foreground mb-3">
              Every good trip needs a{" "}
              <span className="italic wipe-word wipe-1">soundtrack</span>. Add yours.
            </h1>
            <p className="text-body text-foreground/[0.58] max-w-[640px]">
              Search for a song, hit add, and it goes into the shared list. Everything
              anyone has picked is down there — if it&apos;s already in, you&apos;ll see who
              got to it first. I&apos;ll pull the whole thing into an Apple Music playlist
              before we leave.
              <span className="font-[family-name:var(--font-geist-sans)] note-annotation italic text-accent block mt-1">
                (No duplicates, no judgement. One of those is enforced in code.)
              </span>
            </p>
          </div>
        </div>

        {/* =========================================
            RIGHT COLUMN — nav + playlist
            ========================================= */}
        <div className="lg:w-[60%] p-8 lg:pt-8 lg:pb-2 lg:pr-24 lg:pl-12 flex flex-col">
          <Header />

          <div className="mt-8 lg:mt-1">
            <CampingPlaylist />
          </div>

          <div className="lg:mt-auto">
            <Footer />
          </div>
        </div>
      </main>
    </div>
  );
}
