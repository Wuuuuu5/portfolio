import Loader from "@/components/Loader";
import ScrollProgress from "@/components/ScrollProgress";
import CourtLines from "@/components/CourtLines";
import SiteHeader from "@/components/SiteHeader";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import Projects from "@/components/Projects";
import KitBag from "@/components/KitBag";
import Experience from "@/components/Experience";
import NetDivider from "@/components/NetDivider";
import About from "@/components/About";
import Beyond from "@/components/Beyond";
import BadmintonSetup from "@/components/BadmintonSetup";
import Contact from "@/components/Contact";
import SiteFooter from "@/components/SiteFooter";
import SmoothScroll from "@/components/SmoothScroll";

export default function Home() {
  return (
    <>
      <SmoothScroll />
      <Loader />
      <ScrollProgress />
      <CourtLines />
      <SiteHeader />
      <main>
        <Hero />
        <Marquee />
        <About />
        <Experience />
        <Projects />
        <KitBag />
        <NetDivider />
        <Beyond />
        <BadmintonSetup />
        <Contact />
      </main>
      <SiteFooter />
    </>
  );
}
