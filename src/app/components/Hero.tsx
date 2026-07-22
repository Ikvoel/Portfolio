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
      <div className="absolute inset-0 z-0">
        <video autoPlay loop muted playsInline className="w-full h-full object-cover opacity-30">
          <source src="https://www.dropbox.com/scl/fi/jogcbx3iuwi1dux4ykdjh/web-play-bg.mp4?rlkey=pxobr35dj2f9ma7yos3dlgtxu&st=ohlftfr5&raw=1" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-transparent to-[#0a0a0a]"></div>
      </div>

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

      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.2 }}>
          <motion.h1
            className="section-title mb-3 text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Muhammad Nur Husein
          </motion.h1>

          <motion.div
            className="metadata text-white/80 mb-8 tracking-[0.2em] uppercase text-xs md:text-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            Cinematographer
          </motion.div>

          <motion.p
            className="body-text text-white/60 max-w-2xl mx-auto mb-10 text-base md:text-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Crafting visual through my lens
          </motion.p>

          <motion.button
            className="px-8 py-4 liquid-glass-button text-white rounded-full group relative overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={scrollToNext}
          >
            <span className="relative z-10 metadata">View Works</span>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5"
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            />
          </motion.button>
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 10, 0] }}
        transition={{
          opacity: { delay: 1.2, duration: 0.5 },
          y: { repeat: Infinity, duration: 2, ease: "easeInOut" },
        }}
        onClick={scrollToNext}
      >
        <div className="liquid-glass-floating rounded-full p-3">
          <ChevronDown className="w-6 h-6 text-white/90" />
        </div>
      </motion.div>
    </section>
  );
}