import { useState, useEffect, useRef } from "react";
import "./client.css";

import NavBar   from "./components/NavBar";
import Hero     from "./sections/Hero";
import About    from "./sections/About";
import Services from "./sections/Services";
import Doctors  from "./sections/Doctors";
import Booking  from "./sections/Booking";
import Contacts from "./sections/Contacts";
import Footer   from "./sections/Footer";

const SECTIONS = ["hero", "about", "services", "doctors", "booking", "contacts"];

export default function ClientApp() {
  const bookRef = useRef(null);
  const [activeSection, setActiveSection] = useState("hero");

  const scrollToBook  = () => document.getElementById("booking")?.scrollIntoView({ behavior: "smooth" });
  const goAdmin       = () => { window.location.hash = "#/dashboard"; };

  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) setActiveSection(e.target.id); }),
      { threshold: 0.4 }
    );
    SECTIONS.forEach(id => { const el = document.getElementById(id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, []);

  return (
    <>
      <NavBar   activeSection={activeSection} onBook={scrollToBook} onAdmin={goAdmin} />
      <Hero     onBook={scrollToBook} />
      <About />
      <Services onBook={scrollToBook} />
      <Doctors />
      <Booking  bookRef={bookRef} />
      <Contacts />
      <Footer />
    </>
  );
}
