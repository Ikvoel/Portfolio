import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Play, Plus, Heart, Share2 } from 'lucide-react';

interface Credit { role: string; name: string; }
interface VideoModalProps {
  isOpen: boolean; onClose: () => void; videoUrl: string; title: string;
  titleImage?: string; year: string; description: string; credits?: Credit[];
  image: string; watermarkLogo?: string; cinematicStills?: string[];
  category?: string; status?: string;
}

export function VideoModal({ isOpen, onClose, videoUrl, title, titleImage, year, description, credits, image, watermarkLogo, cinematicStills, category, status }: VideoModalProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
      setIsPlaying(false);
      if (modalRef.current) modalRef.current.scrollTop = 0;
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen && videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [isOpen]);

  const safeCredits = credits || [];
  const safeStills = cinematicStills || [];

  const handlePlay = () => {
    if (videoUrl && videoUrl !== 'Not Available' && videoUrl !== 'Not available') {
      setIsPlaying(true);
    }
  };

  // HeroContent accepts isPlaying to hide the "Watch Trailer" button when video is active
  const HeroContent = ({ isPlaying = false }) => (
    <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }} className="max-w-4xl">
      {titleImage ? (
        <img src={titleImage} alt={title} className="h-12 md:h-24 lg:h-32 w-auto object-contain drop-shadow-2xl mb-4 md:mb-6" style={{ filter: 'brightness(0) invert(1)' }} />
      ) : (
        <h1 className="text-4xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-white leading-[0.9] mb-4 md:mb-6 drop-shadow-2xl">{title}</h1>
      )}
      <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-8 text-white/60 text-[10px] md:text-sm uppercase tracking-[0.2em] font-medium">
        <span>{year}</span>
        <span className="w-1 h-1 rounded-full bg-white/30" />
        <span>{category || 'Short Film'}</span>
        {status && (<><span className="w-1 h-1 rounded-full bg-white/30" /><span>{status}</span></>)}
      </div>
      <div className="flex items-center gap-3 md:gap-6">
        {!isPlaying && (
          <motion.button onClick={handlePlay} className="flex items-center gap-2 md:gap-3 bg-white text-black px-6 md:px-8 py-3 md:py-3.5 rounded-full font-semibold hover:bg-white/90 transition-colors shadow-[0_8px_30px_rgba(255,255,255,0.2)] text-sm md:text-base" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Play className="w-4 h-4 md:w-5 md:h-5" fill="black" /> Watch Trailer
          </motion.button>
        )}
        <motion.button className="w-10 h-10 md:w-14 md:h-14 rounded-full liquid-glass-floating flex items-center justify-center text-white" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} title="Add to List"><Plus className="w-4 h-4 md:w-6 md:h-6" /></motion.button>
        <motion.button className="w-10 h-10 md:w-14 md:h-14 rounded-full liquid-glass-floating flex items-center justify-center text-white" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} title="Favorite"><Heart className="w-4 h-4 md:w-6 md:h-6" /></motion.button>
        <motion.button className="w-10 h-10 md:w-14 md:h-14 rounded-full liquid-glass-floating flex items-center justify-center text-white" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} title="Share"><Share2 className="w-4 h-4 md:w-6 md:h-6" /></motion.button>
      </div>
    </motion.div>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div ref={modalRef} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }} className="fixed inset-0 z-[9999] bg-[#050505] overflow-y-auto">
          <motion.button initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3, duration: 0.4 }} type="button" onClick={onClose} className="fixed top-6 right-6 z-50 w-12 h-12 rounded-full liquid-glass-floating text-white/90 flex items-center justify-center group">
            <X className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </motion.button>

          {/* Outer wrapper: removed fixed height/overflow so content can stack naturally */}
          <div className="relative w-full">
            <AnimatePresence mode="wait">
              {!isPlaying ? (
                <motion.div key="hero-state" initial={{ opacity: 0, scale: 1.05 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }} className="relative w-full md:h-[85vh] overflow-hidden flex flex-col">
                  <div className="relative w-full md:h-full flex-shrink-0">
                    <img src={image} alt={title} className="w-full h-auto md:h-full object-cover block" />
                    <div className="hidden md:block absolute inset-0 bg-gradient-to-t from-[#050505]/80 via-transparent to-transparent pointer-events-none" />
                    <div className="hidden md:block absolute inset-0 shadow-[inset_0_0_60px_rgba(0,0,0,0.15)] pointer-events-none" />
                    <motion.button onClick={handlePlay} className="absolute inset-0 flex items-center justify-center z-20 group" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <div className="w-20 h-20 md:w-32 md:h-32 rounded-full liquid-glass-floating flex items-center justify-center">
                        <Play className="w-8 h-8 md:w-14 md:h-14 text-white ml-1" fill="white" />
                      </div>
                    </motion.button>
                  </div>
                  <div className="md:hidden p-6 pb-8 bg-[#050505]"><HeroContent /></div>
                  <div className="hidden md:block absolute bottom-0 left-0 w-full p-16 lg:p-24 z-20"><HeroContent /></div>
                </motion.div>
              ) : (
                <motion.div key="video-state" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} className="relative w-full">
                  {/* 1. Video Container (Takes up the hero space) */}
                  <div className="relative w-full md:h-[85vh] bg-black flex items-center justify-center overflow-hidden">
                    <video ref={videoRef} src={videoUrl} controls autoPlay className="w-full h-auto md:h-full object-contain block" playsInline>
                      Your browser does not support the video tag.
                    </video>
                  </div>

                  {/* 2. Title & Actions (Sits cleanly below the video) */}
                  <div className="w-full p-6 md:p-16 lg:p-24 bg-[#050505]">
                    <HeroContent isPlaying={true} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 3. Rest of the content (Synopsis, Credits, etc.) */}
          <div className="max-w-5xl mx-auto px-6 md:px-16 lg:px-24 py-12 md:py-24 space-y-16 md:space-y-24">
            <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
              <h2 className="text-[10px] md:text-xs uppercase tracking-[0.3em] text-white/40 font-semibold mb-6 md:mb-8">Synopsis</h2>
              <p className="text-lg md:text-2xl lg:text-3xl text-white/85 leading-[1.6] font-light tracking-tight max-w-4xl">{description || 'No synopsis available for this feature.'}</p>
            </motion.section>

            {safeCredits.length > 0 && (
              <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
                <h2 className="text-[10px] md:text-xs uppercase tracking-[0.3em] text-white/40 font-semibold mb-8 md:mb-10">Cast & Crew</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 md:gap-x-16 gap-y-6 md:gap-y-8">
                  {safeCredits.map((credit, idx) => (
                    <div key={idx} className="flex items-baseline gap-4 md:gap-6 border-b border-white/[0.06] pb-5 md:pb-6 group hover:border-white/20 transition-colors">
                      <span className="text-[10px] md:text-sm text-white/40 uppercase tracking-wider min-w-[100px] md:min-w-[120px] font-medium">{credit.role}</span>
                      <span className="text-base md:text-xl text-white font-light tracking-tight group-hover:text-white transition-colors">{credit.name}</span>
                    </div>
                  ))}
                </div>
              </motion.section>
            )}

            {safeStills.length > 0 && (
              <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
                <h2 className="text-[10px] md:text-xs uppercase tracking-[0.3em] text-white/40 font-semibold mb-8 md:mb-10">Behind The Scenes</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  {safeStills.map((still, idx) => (
                    <motion.div key={idx} className="relative aspect-[16/10] overflow-hidden rounded-xl bg-white/[0.02] border border-white/[0.04] group" whileHover={{ scale: 0.98 }} transition={{ duration: 0.4 }}>
                      <img src={still} alt={`Behind the scenes ${idx + 1}`} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
                    </motion.div>
                  ))}
                </div>
              </motion.section>
            )}

            <motion.section initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }} className="pt-8 md:pt-12 border-t border-white/[0.06]">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-8">
                <div>
                  <h2 className="text-[10px] md:text-xs uppercase tracking-[0.3em] text-white/40 font-semibold mb-2 md:mb-3">Production</h2>
                  <p className="text-white/80 text-base md:text-lg tracking-tight">{category || 'Short Film'} • {year}</p>
                </div>
                {watermarkLogo && (
                  <div className="flex flex-col items-start md:items-end">
                    <h2 className="text-[10px] md:text-xs uppercase tracking-[0.3em] text-white/40 font-semibold mb-2 md:mb-3">Studio</h2>
                    <img src={watermarkLogo} alt="Production Studio" className="h-6 md:h-10 w-auto object-contain opacity-70 hover:opacity-100 transition-opacity duration-500" style={{ filter: 'brightness(0) invert(1)' }} />
                  </div>
                )}
              </div>
              <div className="mt-16 md:mt-24 pt-6 md:pt-8 border-t border-white/[0.04] text-center">
                <p className="text-[10px] uppercase tracking-[0.2em] text-white/20">© {year} • Muhammad Nur Husein</p>
              </div>
            </motion.section>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}