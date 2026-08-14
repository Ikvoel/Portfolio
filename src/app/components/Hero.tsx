import { useState } from "react";
import { motion } from "motion/react";
import { ChevronDown, Play } from "lucide-react";
import { ShowreelModal } from "./ShowreelModal";
import hsno from "@/assets/images/logo/hsno.png"

// Background ambient video — loops silently behind the hero section
const BG_VIDEO_URL = "https://res.cloudinary.com/asfa6j6o/video/upload/v1785344176/web_play_bg_dvwrqm.mp4";

// Actual showreel — plays in the modal when clicking "See Showreel"
const SHOWREEL_VIDEO_URL = ""; // TODO: ganti dengan URL showreel yang asli

export function Hero() {
  const [isShowreelOpen, setIsShowreelOpen] = useState(false);

  const scrollToNext = () => {
    const el = document.getElementById('filmography-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
    }
  };

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <video autoPlay loop muted playsInline preload="metadata" className="w-full h-full object-cover opacity-30">
          <source src={BG_VIDEO_URL} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-transparent to-[#0a0a0a]"></div>
      </div>

      <div className="absolute top-4 left-4 md:top-8 md:left-8 z-20">
        <img
          src={hsno}
          alt="Logo"
          loading="eager"
          decoding="async"
          className="w-auto h-6 md:h-9 lg:h-11 drop-shadow-2xl"
        />
      </div>

      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        <h1 className="section-title mb-3 text-white">
          Muhammad Nur Husein
        </h1>

        <div className="metadata text-white/80 mb-8 tracking-[0.2em] uppercase text-xs md:text-sm">
          Cinematographer
        </div>

        <p className="body-text text-white/60 max-w-2xl mx-auto mb-10 text-base md:text-lg">
          Crafting visual through my lens
        </p>

        <div className="flex flex-col items-center justify-center gap-4 w-full max-w-xs mx-auto">
          <motion.button
            className="w-full px-8 py-4 liquid-glass-button text-white rounded-full group relative overflow-hidden flex items-center justify-center gap-3"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsShowreelOpen(true)}
          >
            <div className="liquid-glass-floating w-7 h-7 rounded-full flex items-center justify-center shrink-0">
              <Play className="w-3.5 h-3.5 text-white ml-0.5" fill="white" />
            </div>
            <span className="relative z-10 metadata">See Showreel</span>
            <div className="absolute inset-0 bg-gradient-to-r from-white/15 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </motion.button>

          <motion.button
            className="w-full px-8 py-4 liquid-glass-button text-white rounded-full group relative overflow-hidden flex items-center justify-center"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={scrollToNext}
          >
            <span className="relative z-10 metadata">View Works</span>
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </motion.button>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 cursor-pointer" onClick={scrollToNext}>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <div className="liquid-glass-floating rounded-full p-3">
            <ChevronDown className="w-6 h-6 text-white/90" />
          </div>
        </motion.div>
      </div>

      <ShowreelModal
        isOpen={isShowreelOpen}
        onClose={() => setIsShowreelOpen(false)}
        videoUrl={SHOWREEL_VIDEO_URL}
      />
    </section>
  );
}