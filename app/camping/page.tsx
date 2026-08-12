import type { Metadata } from "next";
import CampingPlaylist from "../components/camping-playlist";

export const metadata: Metadata = {
  title: "Camping Playlist",
  description: "A shared playlist, built by the people in the tent.",
  robots: { index: false, follow: false },
};

export default function Camping() {
  return (
    <main className="max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-24">
      <div className="max-w-[820px] mx-auto">

        {/* =========================================
            HERO
            ========================================= */}
        <div className="text-center pt-16 sm:pt-20 pb-12">
          <p className="text-body tracking-[0.18em] uppercase text-foreground/60">
            🏕️ &nbsp;Grundy lake &nbsp;·&nbsp; Summer 2026
          </p>

          <h1 className="camp-title text-[44px] sm:text-[62px] mt-5 mb-5">
            Bring a song
            <br />
            to our campsite!
          </h1>

          <p className="text-[17px] leading-relaxed text-foreground/75 max-w-[520px] mx-auto">
            Search for something, hit add, and it goes in the playlist. You&apos;ll see
            everything everyone else picked. I&apos;ll turn the whole
            thing into an Apple Music playlist before we leave.
          </p>
          <p>...</p>

          <p className="text-[17px] leading-relaxed text-foreground/75 max-w-[520px] mx-auto">
            If I&apos;m put on aux for the whole trip,{" "}
            <span className="font-bold">i will kill myself 🔥🔥</span>
          </p>
        </div>

        <CampingPlaylist />
      </div>

      <div className="h-20" />
    </main>
  );
}
