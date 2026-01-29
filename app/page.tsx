import Image from "next/image";
import Links from "./components/links/links";
import Footer from "./components/footer/footer";
import Header from "./components/header/header";

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

          <Footer />
        </div>
      </main>
      <footer></footer>
    </div>
  );
}
