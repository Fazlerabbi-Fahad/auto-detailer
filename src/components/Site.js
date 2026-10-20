import brand from "@/brand.config";
import ConceptBar from "./ConceptBar";
import Nav from "./Nav";
import Hero from "./Hero";
import Packages from "./Packages";
import AddOns from "./AddOns";
import BeforeAfter from "./BeforeAfter";
import HowItWorks from "./HowItWorks";
import Gallery from "./Gallery";
import Reviews from "./Reviews";
import AreaFaq from "./AreaFaq";
import Book from "./Book";
import Footer from "./Footer";
import StickyBar from "./StickyBar";
import MotionRoot from "./MotionRoot";
import { BookingProvider } from "./BookingContext";

export default function Site({ biz }) {
  // Accent is a validated 6-digit hex, safe to inline.
  const vars = `:root{--accent:#${biz.accent};--accent-ink:${biz.accentInk};--accent-text:${biz.accentText};}`;
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: vars }} />
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      {brand.conceptBanner ? <ConceptBar name={biz.name} /> : null}
      <BookingProvider>
        <Nav biz={biz} />
        <main id="main">
          <Hero biz={biz} />
          <Packages />
          <AddOns />
          <BeforeAfter />
          <HowItWorks biz={biz} />
          <Gallery biz={biz} />
          <Reviews />
          <AreaFaq biz={biz} />
          <Book biz={biz} />
        </main>
        <Footer biz={biz} />
        <StickyBar biz={biz} />
      </BookingProvider>
      <MotionRoot />
    </>
  );
}
