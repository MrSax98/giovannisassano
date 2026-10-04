import { Hero } from "@/sections/Hero";
import { About } from "@/sections/About";
import { Expertise } from "@/sections/Expertise";
import { Projects } from "@/sections/Projects";
import { Thinking } from "@/sections/Thinking";
import { Now } from "@/sections/Now";
import { Beyond } from "@/sections/Beyond";
import { Contact } from "@/sections/Contact";

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Expertise />
      <Projects />
      <Thinking />
      <Now />
      <Beyond />
      <Contact />
    </>
  );
}
