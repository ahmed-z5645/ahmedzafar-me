import Footer from "../components/footer/footer";
import Header from "../components/header/header";
import ProjectCard from "../components/cards/card";
import GithubCalendarSection from "../components/github-calendar-section";
import funProjects from "../data/fun.json";

export default function Fun() {
  return (
    <div className="min-h-screen">
      <main className="max-w-[1600px] mx-auto">

        {/* =========================================
            TOP — 40/60 split (natural height)
            ========================================= */}
        <div className="flex flex-col lg:flex-row">

          {/* LEFT — issue label + hero */}
          <div className="lg:w-[40%] flex flex-col p-8 pb-0 lg:pt-9 lg:pb-12 lg:pl-24 lg:pr-12">
            <p className="font-[family-name:var(--font-geist-mono)] text-body text-foreground/[0.58]">
              ISSUE 02 | SPRING 2026
            </p>
            <div className="mt-8 lg:mt-18">
              <h1 className="hero-title-group font-[family-name:var(--font-boska)] text-hero leading-[1.1] tracking-tight text-foreground mb-2">
                Programming should be <span className="italic wipe-word wipe-1">fun</span>. Keep building things that <span className="italic wipe-word wipe-2">excite</span> you.
              </h1>
              <p className="text-body text-foreground/[0.58]">
                Every project on this page was built purely for fun — no work, no clients, no deadlines. Just me, an idea, and the freedom to explore it. I hope these reflections of my curiosity and passion for programming inspire you to create something just for the joy of it too.
              </p>
            </div>
          </div>

          {/* RIGHT — nav + GitHub calendar */}
          <div className="lg:w-[60%] p-8 lg:pt-8 lg:pr-24 lg:pl-12 flex flex-col">
            <Header />
            <section>
              <h2 className="font-[family-name:var(--font-geist-mono)] text-body text-foreground/[0.58] mb-6 tracking-wide">
                [GitHub Activity]
              </h2>
              <GithubCalendarSection />
            </section>
          </div>
        </div>
        
        {/* =========================================
            BOTTOM — full-width project grid
            ========================================= */}
        <div className="p-8 lg:px-24 lg:py-12">
          <h2 className="font-[family-name:var(--font-geist-mono)] text-body text-foreground/[0.58] mb-6 tracking-wide">
            [Side Projects]
          </h2>
          <div className="columns-1 md:columns-2 xl:columns-3 gap-6 w-full">
            {funProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>

        <Footer />

      </main>
    </div>
  );
}
