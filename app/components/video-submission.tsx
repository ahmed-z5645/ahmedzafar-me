import Header from "./header/header";
import Footer from "./footer/footer";
import Links from "./links/links";

type VideoSubmissionProps = {
  /** The role this submission is for, e.g. "Data Science" */
  role: string;
  /**
   * The YouTube video ID (the part after `watch?v=` or `youtu.be/`).
   * Leave as the placeholder until you have the link — the page shows
   * a clean "video coming" state until a real ID is set.
   */
  youtubeId: string;
  /**
   * Full video transcript. Hidden by default; revealed when notes are
   * toggled on (press `n`). Paste raw text — line breaks are preserved.
   */
  transcript?: string;
};

const PLACEHOLDER_ID = "REPLACE_WITH_VIDEO_ID";

export default function VideoSubmission({
  role,
  youtubeId,
  transcript,
}: VideoSubmissionProps) {
  const hasVideo = youtubeId && youtubeId !== PLACEHOLDER_ID;
  const hasTranscript = Boolean(transcript && transcript.trim());

  return (
    <div className="min-h-screen">
      <main className="flex flex-col lg:flex-row max-w-[1600px] mx-auto">

        {/* =========================================
            LEFT COLUMN — hero, transcript, links
            ========================================= */}
        <div className="lg:w-[40%] lg:h-screen lg:sticky lg:top-0 lg:overflow-y-auto flex flex-col p-8 pb-0 lg:pt-9 lg:pb-12 lg:pl-24 lg:pr-12">
          <p className="font-[family-name:var(--font-geist-mono)] text-body text-foreground/[0.58]">
            WEALTHSIMPLE | {role.toUpperCase()} INTERNSHIP
          </p>

          <div className="mt-8 lg:mt-18">
            <h1 className="hero-title-group font-[family-name:var(--font-newsreader)] text-hero leading-[1.1] tracking-tight text-foreground mb-3">
              My favourite use of {" "}
              <span className="italic wipe-word wipe-1">{role}</span> principles in the real world.
            </h1>
            <p className="text-body text-foreground/[0.58] max-w-[640px]">
              The original recording was too large to upload directly, so
              here it is hosted instead. Thanks for taking the time to watch, I appreciate the consideration!
              <span className="font-[family-name:var(--font-geist-sans)] note-annotation italic text-accent block mt-1">
                (Hi Wealthsimple! I've been investing using your platform since I was 18! Excited to be here.)
              </span>
            </p>

            {/* Transcript — same accordion + frosted-glass reveal as the / job cards */}
            {hasTranscript && (
              <div className="mt-6 max-w-[640px] relative isolate group transition-all duration-400 ease-[cubic-bezier(0.25,1,0.5,1)] has-[:checked]:mt-12 has-[:checked]:mb-6">
                <input
                  type="checkbox"
                  id="transcript-toggle"
                  className="accordion-toggle peer absolute opacity-0 pointer-events-none"
                />

                {/* Frosted glass background */}
                <div className="absolute -inset-x-4 -inset-y-3 z-[-1] rounded-2xl bg-foreground/5 backdrop-blur-md border border-transparent [.show-notes_&]:bg-transparent [.show-notes_&]:backdrop-blur-none [.show-notes_&]:border-foreground/20 [.show-notes_&]:border-dashed opacity-0 peer-checked:opacity-100 transition-all duration-400 ease-[cubic-bezier(0.25,1,0.5,1)] pointer-events-none" />

                <label
                  htmlFor="transcript-toggle"
                  className="relative z-10 flex items-center justify-between cursor-pointer font-[family-name:var(--font-geist-mono)] text-body text-foreground/[0.58] group-hover:text-accent transition-colors"
                >
                  [Transcript]
                  <span className="text-xs transition-transform duration-400 ease-[cubic-bezier(0.25,1,0.5,1)] group-has-[:checked]:rotate-180">
                    ▼
                  </span>
                </label>

                <div className="accordion-wrapper relative z-10">
                  <div className="accordion-content">
                    <div className="accordion-inner font-[family-name:var(--font-geist-sans)] text-body leading-relaxed text-foreground/[0.75] whitespace-pre-line">
                      {transcript}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mt-12 mb-0 lg:mb-0 lg:mt-auto lg:pt-12">
            <Links />
          </div>
        </div>

        {/* =========================================
            RIGHT COLUMN — header + video
            ========================================= */}
        <div className="lg:w-[60%] p-8 lg:pt-8 lg:pb-2 lg:pr-24 lg:pl-12 relative flex flex-col">

          <Header />

          <div className="mt-8 lg:mt-1">
            {hasVideo ? (
              <div className="aspect-video w-full overflow-hidden rounded-xl border border-foreground/10 shadow-sm">
                <iframe
                  className="h-full w-full"
                  src={`https://www.youtube.com/embed/${youtubeId}`}
                  title={`Ahmed Zafar — Wealthsimple ${role} submission`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              </div>
            ) : (
              <div className="aspect-video w-full flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-foreground/[0.20] bg-foreground/[0.02]">
                <p className="font-[family-name:var(--font-geist-mono)] text-body text-foreground/[0.40]">
                  [ Video link pending ]
                </p>
                <p className="font-[family-name:var(--font-geist-mono)] text-[11px] text-foreground/[0.30]">
                  Set the YouTube ID in this page&apos;s source.
                </p>
              </div>
            )}

            {hasVideo && (
              <div className="mt-4">
                <a
                  href={`https://www.youtube.com/watch?v=${youtubeId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-[family-name:var(--font-geist-mono)] text-body text-foreground/[0.58] hover:text-accent transition-colors"
                >
                  Trouble with the embed? Watch on YouTube ↗
                </a>
              </div>
            )}
          </div>

          <div className="lg:mt-auto">
            <Footer />
          </div>
        </div>
      </main>
    </div>
  );
}
