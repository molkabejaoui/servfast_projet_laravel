import { useState } from "react";
import Navbar from "../components/common/Navbar";
import Footer from "../components/common/Footer";
import HeroSection from "../components/home/HeroSection";
import CategoryGrid from "../components/home/CategoryGrid";
import FeaturedProfessionals from "../components/home/FeaturedProfessionals";
import HowItWorks from "../components/home/HowItWorks";
import TestimonialBanner from "../components/home/TestimonialBanner";

export default function HomePage() {
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: "#fff", minWidth: 1280 }}>
      <Navbar />
      <HeroSection />
      <CategoryGrid />
      <FeaturedProfessionals />
      <HowItWorks />
      <TestimonialBanner />
      <Footer />

      <button
        onClick={() => setChatOpen(!chatOpen)}
        style={{
          position: "fixed", bottom: 28, right: 28,
          background: "#C0001B", color: "#fff",
          border: "none", borderRadius: "50%",
          width: 54, height: 54, fontSize: 22,
          cursor: "pointer",
          boxShadow: "0 4px 18px rgba(192,0,27,0.4)",
          zIndex: 200,
        }}
      >💬</button>
    </div>
  );
}