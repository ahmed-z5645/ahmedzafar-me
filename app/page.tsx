import Image from "next/image";
import Links from "./components/links/links";
import Footer from "./components/footer/footer";
import Header from "./components/header/header";
import Info from "./components/positions/info";
import ProjectCard from "./components/cards/card";
import currentlyWorking from "./data/current/current.json";
import featured from "./data/featured/featured.json";

export default function Home() {
  return (
    <div>
      <main >
        <div id="left">
          <div>
            <h1>I'm Ahmed, a 
              <span>software</span>
              and
              <span>biomedical</span>
              engineer.
            </h1>
          </div>
          <Links />
        </div>
        <div id="right">
          <Header />
            <Info />
            <h1>Current Research and Development</h1>
            {currentlyWorking.map((project) => (
              <ProjectCard key={project.title} project={project} />
            ))}
            <h1>Featured Projects</h1>
            {featured.map((project) => (
              <ProjectCard key={project.title} project={project} />
            ))}
          <Footer />
        </div>
      </main>
      <footer></footer>
    </div>
  );
}
