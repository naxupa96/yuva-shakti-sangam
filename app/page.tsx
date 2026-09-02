import React from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import BigIdea from "@/components/BigIdea";
import ChiefGuest from "@/components/ChiefGuest";
import WhyAttend from "@/components/WhyAttend";
import Experience from "@/components/Experience";
import WhatCanYouDo from "@/components/WhatCanYouDo";
import Samvaad from "@/components/Samvaad";
import AboutRSS from "@/components/AboutRSS";
import Timeline from "@/components/Timeline";
import Swayamsevak from "@/components/Swayamsevak";
import EventJourney from "@/components/EventJourney";
import EventInfo from "@/components/EventInfo";
import RegistrationCTA from "@/components/RegistrationCTA";
import MobileBottomNav from "@/components/MobileBottomNav";
import AudioPlayer from "@/components/AudioPlayer";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-text-primary selection:bg-saffron selection:text-black">
      {/* Global Navigation Header */}
      <Navbar />

      {/* Background Music Player */}
      <AudioPlayer />

      {/* 1. Hero Section with Live Countdown & Sacred Geometry Backdrop */}
      <Hero />

      {/* 2. Editorial Statement "The Big Idea" */}
      <BigIdea />

      {/* 3. Chief Guest & Keynote Speaker Spotlight */}
      <ChiefGuest />

      {/* 4. Four Core Dimensions: Think, Connect, Experience, Act */}
      <WhyAttend />

      {/* 4. What Awaits You (Games, Drama, Samvaad, Community) */}
      <Experience />

      {/* 5. Yuva Samvaad (Bilingual Youth Dialogue & Pre-Sangam Question Builder) */}
      <Samvaad />

      {/* 6. What Can You Do For Bharat? (Action Pathways) */}
      <WhatCanYouDo />

      {/* 7. Factual RSS Introduction */}
      <AboutRSS />

      {/* 8. Glowing Milestones Timeline */}
      <Timeline />

      {/* 9. What is a Swayamsevak? */}
      <Swayamsevak />

      {/* 10. The 7-Step Sangam Journey */}
      <EventJourney />

      {/* 11. Event Logistics, Directions & Dark Editorial FAQs */}
      <EventInfo />

      {/* 12. Final High-Impact Registration CTA & Memorial Statement */}
      <RegistrationCTA />

      {/* Global Footer */}
      <Footer />

      {/* Mobile Bottom Navigation Bar */}
      <MobileBottomNav />
    </main>
  );
}
