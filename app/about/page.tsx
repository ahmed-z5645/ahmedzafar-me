import Footer from "../components/footer/footer";
import Header from "../components/header/header";
import ProjectCard from "../components/cards/card";
import photos from "../data/about.json";

export default function About() {
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
              ISSUE 02 | ABOUT
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
              <div className="columns-1 md:columns-2 gap-6 w-full">
                {photos.map((photo) => (
                  <ProjectCard key={photo.id} project={photo} />
                ))}
              </div>
            </section>
          </div>

        </div>

        <Footer />

      </main>
    </div>
  );
}
