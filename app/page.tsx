import Links from "./components/links/links";
import Footer from "./components/footer/footer";
import Header from "./components/header/header";
import Info from "./components/positions/info";
import ProjectCard from "./components/cards/card";
import currentlyWorking from "./data/current/current.json";
import featured from "./data/featured/featured.json";

export default function Home() {
  return (
    <div className="min-h-screen">
      <main className="flex flex-col lg:flex-row max-w-[1600px] mx-auto">
        
        {/* =========================================
            LEFT COLUMN 
            ========================================= */}
        <div className="lg:w-[40%] lg:h-screen lg:sticky lg:top-0 flex flex-col p-8 pb-0 lg:pt-9 lg:pb-12 lg:pl-24 lg:pr-12">
          <p className="font-[family-name:var(--font-geist-mono)] text-body text-foreground/[0.58]">
              ISSUE 02 | SPRING 2026
          </p>
          <div className="mt-8 lg:mt-18">
            <h1 className="hero-title-group font-[family-name:var(--font-boska)] text-hero leading-[1.1] tracking-tight text-foreground">
              I’m Ahmed, a <span className="italic wipe-word wipe-1">software</span><br />
              and <span className="italic wipe-word wipe-2">biomedical</span> engineer.
            </h1>
            <div className="font-[family-name:var(--font-geist-sans)] note-annotation text-body mt-4 italic text-accent">
              Software AND biomedical, not software with biomedical, not biomedical with software. <br /> I’ve worked too hard in this dual degree taking ALL the software courses, and ALL the BME courses.
            </div>

          </div>
          
          <div className="mt-12 mb-0 lg:mb-0 lg:mt-auto">
            <Links />
          </div>

        </div>

        {/* =========================================
            RIGHT COLUMN 
            ========================================= */}
        <div className="lg:w-[60%] p-8 lg:pt-8 lg:pr-24 lg:pl-12 relative flex flex-col">
          
          <Header />
            
          {/* Section: Experience */}
          <section className="mb-12 mt-0" id="experience">
            <Info />
          </section>

          {/* Section: R&D */}
          <section className="mb-12" id="research">
            <h2 className="font-[family-name:var(--font-geist-mono)] text-body text-foreground/[0.58] mb-4 tracking-wide">
              [Current Research and Development]
            </h2>
            <div className="columns-1 xl:columns-2 gap-6 w-full">
              {currentlyWorking.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </section>

          {/* Section: Featured */}
          <section className="mb-12" id="featured">
            <h2 className="font-[family-name:var(--font-geist-mono)] text-body text-foreground/[0.58] mb-4 tracking-wide">
              [Featured Projects]
            </h2>
            <div className="columns-1 xl:columns-2 gap-6 w-full">
              {featured.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </section>
            
          <Footer />
        </div>
      </main>
    </div>
  );
}