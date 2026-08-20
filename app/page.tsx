import Loader from "@/components/Loader";
import ScrollProgress from "@/components/ScrollProgress";
import CourtLines from "@/components/CourtLines";
import SiteHeader from "@/components/SiteHeader";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import Projects from "@/components/Projects";
import Experience from "@/components/Experience";
import NetDivider from "@/components/NetDivider";
import About from "@/components/About";
import Beyond from "@/components/Beyond";
import Contact from "@/components/Contact";
import SiteFooter from "@/components/SiteFooter";

export default function Home() {
  return (
    <>
      <Loader />
      <ScrollProgress />
      <CourtLines />
      <SiteHeader />
      <main>
        <Hero />
        <Marquee />
        <Projects />
        <Experience />
        <NetDivider />
        <About />
        <Beyond />
        <Contact />
      </main>
      <SiteFooter />
    </>
  );
}
