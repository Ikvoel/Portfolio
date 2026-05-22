import { motion } from "motion/react";
import { ChevronDown } from "lucide-react";

export function Hero() {
  const scrollToNext = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: "smooth",
    });
  };

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* ===== BACKGROUND VIDEO ===== */}
      {/* You can replace this src with your own video URL (MP4 format works best) */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-30"
        >
          {/* Default placeholder cinematic video */}
          <source src="https://www.dropbox.com/scl/fi/jogcbx3iuwi1dux4ykdjh/web-play-bg.mp4?rlkey=pxobr35dj2f9ma7yos3dlgtxu&st=ohlftfr5&raw=1" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        {/* Gradient overlay to seamlessly blend with the page background */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-transparent to-[#0a0a0a]"></div>
      </div>

      {/* ===== BRAND LOGO - TOP LEFT ===== */}
      {/* Adjust positioning with these classes: */}
      {/* Mobile: top-4 left-4 = 16px from edges */}
      {/* Desktop: md:top-8 md:left-8 = 32px from edges */}
      {/* Logo size: h-16 (mobile 64px) → md:h-24 (tablet 96px) → lg:h-32 (desktop 128px) */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="absolute top-4 left-4 md:top-8 md:left-8 z-20"
      >
        <img
          src="https://i.ibb.co.com/MD6xpWds/hsno-mark-f.png"
          alt="Logo"
          loading="eager"
          decoding="async"
          className="w-auto h-16 md:h-24 lg:h-32 drop-shadow-2xl"
        />
      </motion.div>

      {/* Hero content with glassmorphism */}
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          {/* Main headline - Glamour Absolute font */}
          <motion.h1
            className="section-title mb-3 text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Kairo
          </motion.h1>

          {/* Role Stack */}
          <motion.div
            className="metadata text-white/80 mb-8 tracking-[0.2em] uppercase text-xs md:text-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            Cinematographer — Editor — Colorist
          </motion.div>

          {/* Subtitle - minimal and secondary */}
          <motion.p
            className="body-text text-white/60 max-w-2xl mx-auto mb-10 text-base md:text-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Crafting cinematic experiences through visual
            storytelling
          </motion.p>

          {/* CTA Button with glass morphism */}
          <motion.button
            className="px-8 py-4 glass-card text-white hover:bg-white/10 transition-all duration-300 rounded-full group relative overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={scrollToNext}
          >
            <span className="relative z-10 metadata">
              View Works
            </span>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20"
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
          </motion.button>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 10, 0] }}
        transition={{
          opacity: { delay: 1.2, duration: 0.5 },
          y: {
            repeat: Infinity,
            duration: 2,
            ease: "easeInOut",
          },
        }}
        onClick={scrollToNext}
      >
        <div className="glass-subtle rounded-full p-3">
          <ChevronDown className="w-6 h-6 text-white/70" />
        </div>
      </motion.div>
    </section>
  );
}
