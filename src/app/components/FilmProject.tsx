import { motion, AnimatePresence, useMotionValue, useTransform } from 'motion/react';
import { useState, useEffect, useRef } from 'react';
import { Play } from 'lucide-react';
import { VideoModal } from './VideoModal';

// Helper function to normalize Dropbox links to direct stream links (raw=1)
function normalizeVideoUrl(url: string | undefined): string | undefined {
  if (!url) return url;
  if (url.includes('dropbox.com')) {
    let normalized = url;
    if (normalized.includes('dl=raw1')) {
      normalized = normalized.replace('dl=raw1', 'raw=1');
    } else if (normalized.includes('dl=0')) {
      normalized = normalized.replace('dl=0', 'raw=1');
    } else if (normalized.includes('dl=1')) {
      normalized = normalized.replace('dl=1', 'raw=1');
    } else if (!normalized.includes('raw=1')) {
      normalized += (normalized.includes('?') ? '&' : '?') + 'raw=1';
    }
    return normalized;
  }
  return url;
}

// Custom mapping to extract/assign dominant color based on still or cover image URL
function getDominantColorForImage(imageUrl: string | undefined): { r: number; g: number; b: number } {
  if (!imageUrl) return { r: 168, g: 85, b: 247 }; // purple fallback
  const url = imageUrl.toLowerCase();
  
  if (url.includes('matcha') || url.includes('2025-12-23')) {
    if (url.includes('-2-1')) return { r: 143, g: 188, b: 143 }; // dark sea green
    if (url.includes('-12-1')) return { r: 60, g: 179, b: 113 }; // medium sea green
    if (url.includes('-48-1')) return { r: 107, g: 142, b: 35 }; // olive drab
    return { r: 46, g: 139, b: 87 }; // sea green
  }
  
  if (url.includes('bounce') || url.includes('165429')) {
    if (url.includes('-1-2')) return { r: 99, g: 102, b: 241 }; // indigo
    if (url.includes('-4-2')) return { r: 59, g: 130, b: 246 }; // blue
    if (url.includes('-9-4')) return { r: 245, g: 158, b: 11 }; // warm amber light
    return { r: 139, g: 92, b: 246 }; // violet
  }
  
  if (url.includes('bam') || url.includes('174333')) {
    if (url.includes('-58-4')) return { r: 249, g: 115, b: 22 }; // orange
    if (url.includes('-58-32')) return { r: 14, g: 165, b: 233 }; // sky blue
    if (url.includes('-58-43')) return { r: 6, g: 182, b: 212 }; // cyan
    return { r: 239, g: 68, b: 68 }; // red
  }
  
  if (url.includes('laberinto') || url.includes('c0140')) {
    if (url.includes('still008')) return { r: 236, g: 72, b: 153 }; // neon pink
    if (url.includes('still026')) return { r: 168, g: 85, b: 247 }; // purple
    if (url.includes('still001')) return { r: 37, g: 99, b: 235 }; // blue
    return { r: 6, g: 182, b: 212 }; // cyan
  }

  let hash = 0;
  for (let i = 0; i < url.length; i++) {
    hash = url.charCodeAt(i) + ((hash << 5) - hash);
  }
  const colors = [
    { r: 168, g: 85, b: 247 },   // purple
    { r: 59, g: 130, b: 246 },   // blue
    { r: 249, g: 115, b: 22 },   // orange
    { r: 16, g: 185, b: 129 },   // emerald
    { r: 236, g: 72, b: 153 },   // pink
    { r: 245, g: 158, b: 11 },   // amber
  ];
  return colors[Math.abs(hash) % colors.length];
}

interface ClientLogo {
  name: string;
  logo: string;
  hasGlassBadge?: boolean; // Optional glassmorphism badge toggle
}

interface Project {
  id: number;
  title: string;
  category: string;
  year: string;
  description: string;
  image: string;
  videoUrl?: string;
  previewVideoUrl?: string; // Cinematic Moving Poster / Loop URL
  roles: string[];
  cinematicStills?: string[];
  clientLogos?: ClientLogo[]; // Client collaboration logos
}

interface FilmProjectProps {
  project: Project;
  index: number;
  isInView: boolean;
}

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
  const videoRef = useRef<HTMLVideoElement>(null);

  // Cycle through cinematic stills
  useEffect(() => {
    if (isHovered && hasStills && !project.previewVideoUrl) {
      const interval = setInterval(() => {
        setCurrentStillIndex((prev) =>
          (prev + 1) % project.cinematicStills!.length
        );
      }, 1800);
      return () => clearInterval(interval);
    } else {
      setCurrentStillIndex(0);
    }
  }, [isHovered, hasStills, project.cinematicStills, project.previewVideoUrl]);

  // Extract dominant color from current image or cover
  useEffect(() => {
    const activeImage = (hasStills && isHovered && !project.previewVideoUrl)
      ? project.cinematicStills![currentStillIndex]
      : project.image;
    setDominantColor(getDominantColorForImage(activeImage));
  }, [currentStillIndex, isHovered, hasStills, project.image, project.cinematicStills, project.previewVideoUrl]);

  // Manage programmatic play/pause for preview video
  useEffect(() => {
    if (!videoRef.current) return;
    if (isHovered && project.previewVideoUrl) {
      videoRef.current.muted = true;
      videoRef.current.play().catch((err) => {
        console.warn(`[FilmProject] Video preview play failed:`, err);
      });
    } else {
      videoRef.current.pause();
      if (videoRef.current.readyState >= 1) {
        videoRef.current.currentTime = 0;
      }
    }
  }, [isHovered, project.previewVideoUrl]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  const currentImage = hasStills && isHovered && !project.previewVideoUrl
    ? project.cinematicStills![currentStillIndex]
    : project.image;

  const glowColor = `rgba(${dominantColor.r}, ${dominantColor.g}, ${dominantColor.b}, 0.6)`;

  // Detect mobile devices
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <>
      <motion.div
        ref={cardRef}
        initial={{ opacity: 1, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: isMobile ? 0 : 0.8,
          delay: isMobile ? 0 : index * 0.12,
          ease: [0.22, 1, 0.36, 1]
        }}
        className="relative group cursor-pointer"
        onMouseEnter={() => !isMobile && setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        onMouseMove={!isMobile ? handleMouseMove : undefined}
        onClick={() => project.videoUrl && setIsModalOpen(true)}
        style={{
          transformStyle: 'preserve-3d',
          padding: isMobile ? '0' : '24px',
          margin: isMobile ? '0' : '-24px',
        }}
      >
        {/* ADVANCED GLASSMORPHISM CARD */}
        <motion.div
          className="relative z-10 rounded-2xl"
          style={{
            background: 'rgba(255, 255, 255, 0.04)',
            backdropFilter: isMobile ? 'none' : 'blur(8px)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow: `0 6px 22px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.1)`,
            rotateX: (isHovered && !isMobile) ? rotateX : 0,
            rotateY: (isHovered && !isMobile) ? rotateY : 0,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {/* TRUE 360-DEGREE AMBIENT GLOW - Environmental Light Layer */}
          {!isMobile && (
            <motion.div
              className="absolute pointer-events-none rounded-2xl"
              style={{
                inset: '-20px',
                background: `radial-gradient(circle, rgba(${dominantColor.r}, ${dominantColor.g}, ${dominantColor.b}, 0.35) 0%, rgba(${dominantColor.r}, ${dominantColor.g}, ${dominantColor.b}, 0.08) 50%, transparent 100%)`,
                filter: 'blur(32px)',
                boxShadow: `0 0 60px 10px rgba(${dominantColor.r}, ${dominantColor.g}, ${dominantColor.b}, 0.3)`,
                zIndex: -1,
              }}
              animate={{
                opacity: isHovered ? 1 : 0,
                scale: isHovered ? 1.05 : 0.95,
              }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          )}

          {/* Image Container */}
          <div className="relative aspect-video overflow-hidden bg-black rounded-t-2xl">
            {/* Base cover image (always visible as fallback or background) */}
            <img
              src={project.image}
              alt={project.title}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />

            {/* Video preview overlay */}
            {project.previewVideoUrl && (
              <motion.div
                className="absolute inset-0 w-full h-full pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: isHovered ? 1 : 0 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
              >
                <video
                  ref={videoRef}
                  src={normalizeVideoUrl(project.previewVideoUrl)}
                  loop
                  muted
                  playsInline
                  preload="auto"
                  className="w-full h-full object-cover"
                />
              </motion.div>
            )}

            {/* Cinematic Stills (Image Sequence) overlay */}
            {!project.previewVideoUrl && hasStills && (
              <motion.div
                className="absolute inset-0 w-full h-full pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: isHovered ? 1 : 0 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
              >
                <AnimatePresence>
                  {isHovered && (
                    <motion.img
                      key={currentStillIndex}
                      src={project.cinematicStills![currentStillIndex]}
                      alt={`${project.title} still`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.8, ease: "easeInOut" }}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  )}
                </AnimatePresence>
              </motion.div>
            )}

            {/* Watermark Logo - Top Right (Responsive Constraints) */}
            <div className="absolute top-3 right-4 md:top- -1 md:right-4 z-10 opacity-20 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none">
              <img
                src="https://i.ibb.co.com/MD6xpWds/hsno-mark-f.png"
                alt="Watermark"
                loading="lazy"
                decoding="async"
                className="w-auto h-12 sm:h-16 md:h-20 drop-shadow-lg object-contain"
                style={{ filter: 'brightness(0) invert(1)' }}
              />
            </div>

            {/* Color-adaptive ambient overlay */}
            <motion.div
              className="absolute inset-0 mix-blend-soft-light pointer-events-none"
              animate={{
                opacity: isHovered ? 0.35 : 0.15,
              }}
              transition={{ duration: 0.5 }}
              style={{
                background: `radial-gradient(circle at center, rgba(${dominantColor.r}, ${dominantColor.g}, ${dominantColor.b}, 0.4) 0%, transparent 60%)`,
              }}
            />

            {/* Gradient overlay for text contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />

            {/* Cinematic preview indicators */}
            {hasStills && isHovered && !project.previewVideoUrl && (
              <div className="absolute top-4 left-4 flex gap-1.5 z-10">
                {project.cinematicStills!.map((_, idx) => (
                  <motion.div
                    key={idx}
                    className="h-1 bg-white/25 rounded-full overflow-hidden"
                    style={{ width: '32px' }}
                  >
                    <motion.div
                      className="h-full bg-white rounded-full"
                      initial={{ width: '0%' }}
                      animate={{
                        width: idx === currentStillIndex ? '100%' : '0%',
                      }}
                      transition={{ duration: 1.8, ease: "linear" }}
                    />
                  </motion.div>
                ))}
              </div>
            )}

            {/* Play Button - PERFECTLY CENTERED FOR ALL DEVICES */}
            {project.videoUrl && (
              <motion.div
                className="absolute inset-0 z-20 flex items-center justify-center"
                initial={{ opacity: isMobile ? 0.8 : 0, scale: 0.85 }}
                animate={{
                  opacity: (isHovered || isMobile) ? 1 : 0,
                  scale: (isHovered || isMobile) ? 1 : 0.85,
                }}
                transition={{ duration: 0.4 }}
              >
                <motion.div
                  className="w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center"
                  style={{
                    background: 'rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(6px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    boxShadow: `0 6px 20px ${glowColor}`,
                  }}
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Play className="w-7 h-7 md:w-8 md:h-8 text-white ml-0.5" fill="white" />
                </motion.div>
              </motion.div>
            )}

            {/* CLIENT LOGOS - Bottom Right */}
            {project.clientLogos && project.clientLogos.length > 0 && (
              <div
                className="absolute bottom-4 right-4 z-10 flex gap-2"
                style={{
                  /* Adjust logo container positioning:
                   * bottom: '16px' = 16px from bottom
                   * right: '16px' = 16px from right
                   */
                }}
              >
                {project.clientLogos.map((client, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 + idx * 0.1 }}
                    className="relative"
                  >
                    {/* Optional Glass Badge - Toggle per logo */}
                    {client.hasGlassBadge !== false && (
                      <div
                        className="absolute inset-0 rounded-lg"
                        style={{
                          background: 'rgba(255, 255, 255, 0.1)',
                          backdropFilter: isMobile ? 'none' : 'blur(4px)',
                          border: '1px solid rgba(255, 255, 255, 0.15)',
                        }}
                      />
                    )}

                    {/* Client Logo Image */}
                    <div
                      className="relative p-2"
                      style={{
                        /* Adjust individual logo size:
                         * width/height: '48px' = small
                         * width/height: '64px' = medium
                         * width/height: '80px' = large
                         */
                        width: '75px',
                        height: '75px',
                      }}
                    >
                      <img
                        src={client.logo}
                        alt={client.name}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-contain"
                        style={{
                          filter: 'brightness(0) invert(1) drop-shadow(0 2px 8px rgba(0,0,0,0.3))',
                        }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Content Section */}
          <div
            className="p-6 relative rounded-b-2xl"
            style={{
              background: 'rgba(0, 0, 0, 0.3)',
              backdropFilter: isMobile ? 'none' : 'blur(6px)',
              borderTop: '1px solid rgba(255, 255, 255, 0.05)',
            }}
          >
            {/* Category & Year Tags */}
            <div className="flex items-center justify-between mb-3">
              <span
                className="metadata px-3 py-1.5 rounded-full text-white/85 text-xs"
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  backdropFilter: isMobile ? 'none' : 'blur(4px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                {project.category}
              </span>
              <span
                className="metadata px-3 py-1.5 rounded-full text-white/65 text-xs"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: isMobile ? 'none' : 'blur(4px)',
                }}
              >
                {project.year}
              </span>
            </div>

            {/* Film Title */}
            <h3 className="film-title mb-3 text-white tracking-wide">
              {project.title}
            </h3>

            {/* Description */}
            <p className="body-text text-white/70 text-sm mb-4 leading-relaxed line-clamp-2">
              {project.description}
            </p>

            {/* Roles */}
            <div className="flex flex-wrap gap-2">
              {project.roles.map((role, idx) => (
                <span
                  key={idx}
                  className="metadata px-3 py-1 text-white/55 text-xs rounded-full"
                  style={{
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                  }}
                >
                  {role}
                </span>
              ))}
            </div>
          </div>

          {/* Soft inner highlight (top edge glow) */}
          <div
            className="absolute top-0 left-0 right-0 h-px opacity-60 pointer-events-none"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
            }}
          />

          {/* Delicate edge glow - adapts to dominant color */}
          <motion.div
            className="absolute inset-0 rounded-2xl pointer-events-none"
            animate={{
              opacity: isHovered ? 0.8 : 0,
            }}
            transition={{ duration: 0.5 }}
            style={{
              boxShadow: `inset 0 0 24px rgba(${dominantColor.r}, ${dominantColor.g}, ${dominantColor.b}, 0.2), inset 0 0 44px rgba(${dominantColor.r}, ${dominantColor.g}, ${dominantColor.b}, 0.08)`,
            }}
          />
        </motion.div>
      </motion.div>

      {/* Video Modal */}
      {project.videoUrl && (
        <VideoModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          videoUrl={project.videoUrl}
          title={project.title}
          year={project.year}
          description={project.description}
          roles={project.roles}
        />
      )}
    </>
  );
}