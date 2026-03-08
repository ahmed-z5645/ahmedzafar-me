import Header from "../components/header/header";
import Footer from "../components/footer/footer";
import ProjectCard from "../components/cards/card";
import GithubCalendarSection from "../components/github-calendar-section";
import funProjects from "../data/fun.json";

export default function Fun() {
  return (
    <div className="min-h-screen">
      <main className="max-w-[1600px] mx-auto px-8 pt-8 pb-12 lg:px-24 flex flex-col">

        <Header />

        {/* Hero */}
        <section className="mb-12">
          <p className="font-[family-name:var(--font-geist-mono)] text-body text-foreground/[0.58] mb-8">
            ISSUE 02 | ENGINEERING PLAYGROUND
          </p>
          <h1 className="font-[family-name:var(--font-newsreader)] text-hero leading-[1.1] tracking-tight text-foreground">
            Engineering Playground.
          </h1>
        </section>

        {/* GitHub Contribution Calendar */}
        <section className="mb-16">
          <h2 className="font-[family-name:var(--font-geist-mono)] text-body text-foreground/[0.58] mb-6 tracking-wide">
            [GitHub Activity]
          </h2>
          <GithubCalendarSection />
        </section>

        {/* Side Projects */}
        <section className="mb-12">
          <h2 className="font-[family-name:var(--font-geist-mono)] text-body text-foreground/[0.58] mb-6 tracking-wide">
            [Side Projects]
          </h2>
          <div className="columns-1 md:columns-2 xl:columns-3 gap-6 w-full">
            {funProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </section>

        <Footer />

      </main>
    </div>
  );
}
