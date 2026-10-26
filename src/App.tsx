import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import { Stats } from "@/components/Section";
import { Work } from "@/components/Work";
import { Lab } from "@/components/Lab";
import { Experience } from "@/components/Experience";
import { Contact, Footer } from "@/components/Contact";
import { Terminal } from "@/components/Terminal";

export default function App() {
  return (
    <>
      <a
        href="#work"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-fg focus:px-3 focus:py-2 focus:text-bg"
      >
        Skip to content
      </a>
      <Nav />
      <main>
        <Hero />
        <Stats />
        <Work />
        <Lab />
        <Experience />
        <Contact />
      </main>
      <Footer />
      <Terminal />
    </>
  );
}
