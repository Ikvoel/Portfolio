import { motion, AnimatePresence, useMotionValue, useTransform } from 'motion/react';
import { useState, useEffect, useRef } from 'react';
import { Play } from 'lucide-react';
import { VideoModal } from './VideoModal';
import { OptimizedImage } from './ui/OptimizedImage';

function normalizeVideoUrl(url: string | undefined): string | undefined {
  if (!url || url === 'Not available' || url === 'Not Available') return undefined;
  if (url.includes('drive.google.com')) {
    const fileIdMatch = url.match(/[-\w]{25,}/);
    if (fileIdMatch) return `https://drive.google.com/uc?export=download&id=${fileIdMatch[0]}`;
  }
  if (url.includes('dropbox.com')) {
    let normalized = url;
    if (normalized.includes('dl=raw1')) normalized = normalized.replace('dl=raw1', 'raw=1');
    else if (normalized.includes('dl=0')) normalized = normalized.replace('dl=0', 'raw=1');
    else if (normalized.includes('dl=1')) normalized = normalized.replace('dl=1', 'raw=1');
    else if (!normalized.includes('raw=1')) normalized += (normalized.includes('?') ? '&' : '?') + 'raw=1';
    return normalized;
  }
  return url;
}

function getDominantColorForImage(imageUrl: string | undefined): { r: number; g: number; b: number } {
  if (!imageUrl) return { r: 168, g: 85, b: 247 };
  const url = imageUrl.toLowerCase();
  if (url.includes('matcha') || url.includes('2025-12-23')) {
    if (url.includes('-2-1')) return { r: 143, g: 188, b: 143 };
    if (url.includes('-12-1')) return { r: 60, g: 179, b: 113 };
    if (url.includes('-48-1')) return { r: 107, g: 142, b: 35 };
    return { r: 46, g: 139, b: 87 };
  }
  if (url.includes('bounce') || url.includes('165429')) {
    if (url.includes('-1-2')) return { r: 99, g: 102, b: 241 };
    if (url.includes('-4-2')) return { r: 59, g: 130, b: 246 };
    if (url.includes('-9-4')) return { r: 245, g: 158, b: 11 };
    return { r: 139, g: 92, b: 246 };
  }
  if (url.includes('bam') || url.includes('174333')) {
    if (url.includes('-58-4')) return { r: 249, g: 115, b: 22 };
    if (url.includes('-58-32')) return { r: 14, g: 165, b: 233 };
    if (url.includes('-58-43')) return { r: 6, g: 182, b: 212 };
    return { r: 239, g: 68, b: 68 };
  }
  if (url.includes('laberinto') || url.includes('c0140')) {
    if (url.includes('still008')) return { r: 236, g: 72, b: 153 };
    if (url.includes('still026')) return { r: 168, g: 85, b: 247 };
    if (url.includes('still001')) return { r: 37, g: 99, b: 235 };
    return { r: 6, g: 182, b: 212 };
  }
  let hash = 0;
  for (let i = 0; i < url.length; i++) hash = url.charCodeAt(i) + ((hash << 5) - hash);
  const colors = [{ r: 168, g: 85, b: 247 }, { r: 59, g: 130, b: 246 }, { r: 249, g: 115, b: 22 }, { r: 16, g: 185, b: 129 }, { r: 236, g: 72, b: 153 }, { r: 245, g: 158, b: 11 }];
  return colors[Math.abs(hash) % colors.length];
}

interface Credit { role: string; name: string; }
interface ClientLogo { name: string; logo: string; hasGlassBadge?: boolean; }
interface Project {
  id: number; title: string; category: string; year: string; description: string; image: string;
  videoUrl?: string; previewVideoUrl?: string; credits: Credit[]; cinematicStills?: string[];
  clientLogos?: ClientLogo[]; titleImage?: string;
}
interface FilmProjectProps { project: Project; index: number; isInView: boolean; }

export function FilmProject({ project, index, isInView }: FilmProjectProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStillIndex, setCurrentStillIndex] = useState(0);
  const [dominantColor, setDominantColor] = useState({ r: 168, g: 85, b: 247 });

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-150, 150], [3, -3]);
  const rotateY = useTransform(mouseX, [-150, 150], [-3, 3]);

  const hasStills = !!(project.cinematicStills && project.cinematicStills.length > 0);
  const hasVideo = !!project.videoUrl;
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (isHovered && hasStills && !project.previewVideoUrl) {
      const interval = setInterval(() => setCurrentStillIndex((prev) => (prev + 1) % project.cinematicStills!.length), 1800);
      return () => clearInterval(interval);
    } else {
      setCurrentStillIndex(0);
    }
  }, [isHovered, hasStills, project.cinematicStills, project.previewVideoUrl]);

  useEffect(() => {
    const activeImage = (hasStills && isHovered && !project.previewVideoUrl) ? project.cinematicStills![currentStillIndex] : project.image;
    setDominantColor(getDominantColorForImage(activeImage));
  }, [currentStillIndex, isHovered, hasStills, project.image, project.cinematicStills, project.previewVideoUrl]);

  useEffect(() => {
    if (!videoRef.current) return;
    if (isHovered && project.previewVideoUrl) {
      videoRef.current.muted = true;
      videoRef.current.play().catch((err) => console.warn(`[FilmProject] Video preview play failed:`, err));
    } else {
      videoRef.current.pause();
      if (videoRef.current.readyState >= 1) videoRef.current.currentTime = 0;
    }
  }, [isHovered, project.previewVideoUrl]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  const glowColor = `rgba(${dominantColor.r}, ${dominantColor.g}, ${dominantColor.b}, 0.6)`;
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const isShortFilm = project.category === "Short Film";

  return (
    <>
      <motion.div
        ref={cardRef}
        initial={{ opacity: 1, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: isMobile ? 0 : 0.8, delay: isMobile ? 0 : index * 0.12, ease: [0.22, 1, 0.36, 1] }}
        className={`relative group ${hasVideo ? 'cursor-pointer' : 'cursor-default'} w-full`}
        onMouseEnter={() => !isMobile && setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        onMouseMove={!isMobile ? handleMouseMove : undefined}
        onClick={() => hasVideo && setIsModalOpen(true)}
        style={{ transformStyle: 'preserve-3d', padding: isShortFilm ? '0' : (isMobile ? '0' : '24px'), margin: isShortFilm ? '0' : (isMobile ? '0' : '-24px') }}
      >
        {isShortFilm ? (
          <motion.div
            className="relative z-10 rounded-3xl overflow-hidden liquid-glass-card h-[55vh] md:h-[65vh] lg:h-[75vh] w-full"
            style={{ rotateX: (isHovered && !isMobile) ? rotateX : 0, rotateY: (isHovered && !isMobile) ? rotateY : 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {!isMobile && (
              <motion.div
                className="absolute pointer-events-none rounded-3xl"
                style={{ inset: '-20px', background: `radial-gradient(circle, rgba(${dominantColor.r}, ${dominantColor.g}, ${dominantColor.b}, 0.35) 0%, rgba(${dominantColor.r}, ${dominantColor.g}, ${dominantColor.b}, 0.08) 50%, transparent 100%)`, filter: 'blur(32px)', boxShadow: `0 0 60px 10px rgba(${dominantColor.r}, ${dominantColor.g}, ${dominantColor.b}, 0.25)`, zIndex: -1 }}
                animate={{ opacity: isHovered ? 1 : 0.6, scale: isHovered ? 1.02 : 1.0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />
            )}
            <div className="absolute inset-0 w-full h-full bg-black">
              <motion.div className="absolute inset-0 w-full h-full" animate={{ opacity: (isHovered && (hasStills || project.previewVideoUrl)) ? 0 : 1 }} transition={{ duration: 0.6 }}>
                <OptimizedImage src={project.image} alt={project.title} className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-102" />
              </motion.div>
              {project.previewVideoUrl && (
                <motion.div className="absolute inset-0 w-full h-full pointer-events-none" initial={{ opacity: 0 }} animate={{ opacity: isHovered ? 1 : 0 }} transition={{ duration: 0.6, ease: "easeInOut" }}>
                  <video ref={videoRef} src={normalizeVideoUrl(project.previewVideoUrl)} loop muted playsInline preload="auto" className="w-full h-full object-cover" />
                </motion.div>
              )}
              {!project.previewVideoUrl && hasStills && (
                <motion.div className="absolute inset-0 w-full h-full pointer-events-none" initial={{ opacity: 0 }} animate={{ opacity: isHovered ? 1 : 0 }} transition={{ duration: 0.6, ease: "easeInOut" }}>
                  <AnimatePresence>
                    {isHovered && (
                      <motion.img key={currentStillIndex} src={project.cinematicStills![currentStillIndex]} alt={`${project.title} still`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8, ease: "easeInOut" }} className="absolute inset-0 w-full h-full object-cover" />
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/25 to-transparent z-10 pointer-events-none" />
            {project.clientLogos && project.clientLogos.length > 0 ? (
              <div className="absolute top-6 right-6 z-20 opacity-50 group-hover:opacity-30 transition-opacity duration-500 pointer-events-none">
                <img src={project.clientLogos![0].logo} alt="Watermark Logo" className="w-auto h-12 md:h-16 lg:h-20 object-contain" style={{ filter: 'brightness(0) invert(1)' }} />
              </div>
            ) : (
              <div className="absolute top-6 right-6 z-20 opacity-20 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none">
                <img src="https://i.ibb.co.com/MD6xpWds/hsno-mark-f.png" alt="Watermark" className="w-auto h-12 md:h-16 object-contain" style={{ filter: 'brightness(0) invert(1)' }} />
              </div>
            )}
            {hasVideo && (
              <motion.div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none" initial={{ opacity: isMobile ? 0.8 : 0, scale: 0.9 }} animate={{ opacity: isMobile || isHovered ? 1 : 0.8, scale: 1 }} transition={{ duration: 0.4 }}>
                <motion.div className="w-16 h-16 md:w-20 md:h-20 rounded-full liquid-glass-floating pointer-events-auto" whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.95 }}>
                  <Play className="w-6 h-6 md:w-8 md:h-8 text-white ml-0.5" fill="white" />
                </motion.div>
              </motion.div>
            )}
            <div className="absolute bottom-0 left-0 w-full p-6 sm:p-8 md:p-12 z-20 flex flex-col items-start gap-4 max-w-2xl text-left select-text">
              <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="w-full flex justify-start items-end">
                {project.titleImage ? (
                  <img src={project.titleImage} alt={project.title} className="h-10 sm:h-12 md:h-16 lg:h-20 w-auto object-contain select-none filter drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)]" />
                ) : (
                  <h3 className="film-title text-white text-2xl sm:text-3xl md:text-4xl font-bold tracking-wide select-none drop-shadow-md">{project.title}</h3>
                )}
              </motion.div>
              <div className="flex flex-col items-start gap-3 w-full">
                <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="flex items-center flex-wrap gap-2.5 sm:gap-3">
                  <span className="metadata liquid-glass-badge text-white/95 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase">{project.category}</span>
                  <span className="metadata liquid-glass-badge text-white/85 px-3 py-1 rounded-full text-xs font-semibold tracking-wider">{project.year}</span>
                </motion.div>
                <motion.p initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }} className="body-text text-white/85 text-xs sm:text-sm md:text-base leading-relaxed max-w-xl md:max-w-2xl drop-shadow-md line-clamp-3">{project.description}</motion.p>
                {project.credits && project.credits.length > 0 && (
                  <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.5 }} className="flex flex-wrap gap-2 mt-1.5">
                    {project.credits.slice(0, 3).map((credit, idx) => (
                      <span key={idx} className="metadata liquid-glass-chip text-white/80 text-[10px] sm:text-xs font-medium rounded-full px-2.5 py-1">{credit.role}</span>
                    ))}
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            className="relative z-10 rounded-2xl liquid-glass-card"
            style={{ rotateX: (isHovered && !isMobile) ? rotateX : 0, rotateY: (isHovered && !isMobile) ? rotateY : 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {!isMobile && (
              <motion.div
                className="absolute pointer-events-none rounded-2xl"
                style={{ inset: '-20px', background: `radial-gradient(circle, rgba(${dominantColor.r}, ${dominantColor.g}, ${dominantColor.b}, 0.35) 0%, rgba(${dominantColor.r}, ${dominantColor.g}, ${dominantColor.b}, 0.08) 50%, transparent 100%)`, filter: 'blur(32px)', boxShadow: `0 0 60px 10px rgba(${dominantColor.r}, ${dominantColor.g}, ${dominantColor.b}, 0.35)`, zIndex: -1 }}
                animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1.05 : 0.95 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />
            )}
            <div className="relative aspect-video overflow-hidden bg-black rounded-t-2xl">
              <OptimizedImage src={project.image} alt={project.title} className="w-full h-full transition-transform duration-700 ease-out group-hover:scale-105" />
              {project.previewVideoUrl && (
                <motion.div className="absolute inset-0 w-full h-full pointer-events-none" initial={{ opacity: 0 }} animate={{ opacity: isHovered ? 1 : 0 }} transition={{ duration: 0.6, ease: "easeInOut" }}>
                  <video ref={videoRef} src={normalizeVideoUrl(project.previewVideoUrl)} loop muted playsInline preload="auto" className="w-full h-full object-cover" />
                </motion.div>
              )}
              {!project.previewVideoUrl && hasStills && (
                <motion.div className="absolute inset-0 w-full h-full pointer-events-none" initial={{ opacity: 0 }} animate={{ opacity: isHovered ? 1 : 0 }} transition={{ duration: 0.6, ease: "easeInOut" }}>
                  <AnimatePresence>
                    {isHovered && (
                      <motion.img key={currentStillIndex} src={project.cinematicStills![currentStillIndex]} alt={`${project.title} still`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8, ease: "easeInOut" }} className="absolute inset-0 w-full h-full object-cover" />
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
              <div className="absolute top-3 right-4 md:top-4 md:right-4 z-10 opacity-20 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none">
                <img src="https://i.ibb.co.com/MD6xpWds/hsno-mark-f.png" alt="Watermark" loading="lazy" decoding="async" className="w-auto h-12 sm:h-16 md:h-20 drop-shadow-lg object-contain" style={{ filter: 'brightness(0) invert(1)' }} />
              </div>
              <motion.div className="absolute inset-0 mix-blend-soft-light pointer-events-none" animate={{ opacity: isHovered ? 0.35 : 0.15 }} transition={{ duration: 0.5 }} style={{ background: `radial-gradient(circle at center, rgba(${dominantColor.r}, ${dominantColor.g}, ${dominantColor.b}, 0.4) 0%, transparent 60%)` }} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />
              {hasStills && isHovered && !project.previewVideoUrl && (
                <div className="absolute top-4 left-4 flex gap-1.5 z-10">
                  {project.cinematicStills!.map((_, idx) => (
                    <motion.div key={idx} className="h-1 bg-white/25 rounded-full overflow-hidden" style={{ width: '32px' }}>
                      <motion.div className="h-full bg-white rounded-full" initial={{ width: '0%' }} animate={{ width: idx === currentStillIndex ? '100%' : '0%' }} transition={{ duration: 1.8, ease: "linear" }} />
                    </motion.div>
                  ))}
                </div>
              )}
              {hasVideo && (
                <motion.div className="absolute inset-0 z-20 flex items-center justify-center" initial={{ opacity: isMobile ? 0.8 : 0, scale: 0.85 }} animate={{ opacity: (isHovered || isMobile) ? 1 : 0, scale: (isHovered || isMobile) ? 1 : 0.85 }} transition={{ duration: 0.4 }}>
                  <motion.div className="w-16 h-16 md:w-20 md:h-20 rounded-full liquid-glass-floating" whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.95 }}>
                    <Play className="w-7 h-7 md:w-8 md:h-8 text-white ml-0.5" fill="white" />
                  </motion.div>
                </motion.div>
              )}
              {project.clientLogos && project.clientLogos.length > 0 && (
                <div className="absolute bottom-4 right-4 z-10 flex gap-2">
                  {project.clientLogos.map((client, idx) => (
                    <motion.div key={idx} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 + idx * 0.1 }} className="relative">
                      {client.hasGlassBadge !== false && <div className="absolute inset-0 rounded-lg liquid-glass-card" />}
                      <div className="relative p-2" style={{ width: '75px', height: '75px' }}>
                        <img src={client.logo} alt={client.name} loading="lazy" decoding="async" className="w-full h-full object-contain" style={{ filter: 'brightness(0) invert(1) drop-shadow(0 2px 8px rgba(0,0,0,0.3))' }} />
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
            <div className="p-6 relative rounded-b-2xl">
              <div className="flex items-center justify-between mb-3">
                <span className="metadata liquid-glass-badge text-white/85 px-3 py-1.5 rounded-full text-xs">{project.category}</span>
                <span className="metadata liquid-glass-badge text-white/65 px-3 py-1.5 rounded-full text-xs">{project.year}</span>
              </div>
              <h3 className="film-title mb-3 text-white tracking-wide">{project.title}</h3>
              <p className="body-text text-white/70 text-sm mb-4 leading-relaxed line-clamp-2">{project.description}</p>
              <div className="flex flex-wrap gap-2">
                {project.credits.slice(0, 4).map((credit, idx) => (
                  <span key={idx} className="metadata liquid-glass-chip text-white/55 text-xs rounded-full px-3 py-1">{credit.role}</span>
                ))}
              </div>
            </div>
            <div className="absolute top-0 left-0 right-0 h-px opacity-60 pointer-events-none" style={{ background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)' }} />
            <motion.div className="absolute inset-0 rounded-2xl pointer-events-none" animate={{ opacity: isHovered ? 0.8 : 0 }} transition={{ duration: 0.5 }} style={{ boxShadow: `inset 0 0 24px rgba(${dominantColor.r}, ${dominantColor.g}, ${dominantColor.b}, 0.2), inset 0 0 44px rgba(${dominantColor.r}, ${dominantColor.g}, ${dominantColor.b}, 0.08)` }} />
          </motion.div>
        )}
      </motion.div>
      {hasVideo && (
        <VideoModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} videoUrl={normalizeVideoUrl(project.videoUrl) || ''} title={project.title} titleImage={project.titleImage} year={project.year} description={project.description} credits={project.credits} image={project.image} watermarkLogo={project.clientLogos?.[0]?.logo} cinematicStills={project.cinematicStills || []} category={project.category} />
      )}
    </>
  );
}