import { motion, useMotionValue, useTransform } from 'motion/react';
import { useState, useEffect, useRef } from 'react';
import { Play } from 'lucide-react';
import { VideoModal } from './VideoModal';

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

  const isShortMovie = project.category.toLowerCase().includes('short movie');
  const hasStills = isShortMovie && project.cinematicStills && project.cinematicStills.length > 0;

  // Cycle through cinematic stills
  useEffect(() => {
    if (isHovered && hasStills) {
      const interval = setInterval(() => {
        setCurrentStillIndex((prev) => 
          (prev + 1) % project.cinematicStills!.length
        );
      }, 1800);
      return () => clearInterval(interval);
    } else {
      setCurrentStillIndex(0);
    }
  }, [isHovered, hasStills, project.cinematicStills]);

  // Extract dominant color from current image
  useEffect(() => {
    if (hasStills && isHovered) {
      // Pre-sampled color data per image for performance
      const colors = [
        { r: 168, g: 85, b: 247 },   // purple - cool tones
        { r: 59, g: 130, b: 246 },   // blue - night scenes
        { r: 249, g: 115, b: 22 },   // orange - warm/sunset
        { r: 16, g: 185, b: 129 },   // emerald - nature/green
        { r: 236, g: 72, b: 153 },   // pink - vibrant/emotional
        { r: 245, g: 158, b: 11 },   // amber - golden hour
      ];
      setDominantColor(colors[currentStillIndex % colors.length]);
    } else {
      setDominantColor({ r: 168, g: 85, b: 247 });
    }
  }, [currentStillIndex, isHovered, hasStills]);

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

  const currentImage = hasStills && isHovered 
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
          padding: isMobile ? '0' : '48px', // Disable glow padding on mobile
          margin: isMobile ? '0' : '-48px',
        }}
      >
        {/* TRUE 360-DEGREE AMBIENT GLOW - Environmental Light Layer */}
        {/* Primary Glow Ring - Evenly distributed around all sides */}
        {/* ADVANCED GLASSMORPHISM CARD */}
        <motion.div
          className="relative overflow-hidden rounded-2xl"
          style={{
            background: 'rgba(255, 255, 255, 0.04)',
            backdropFilter: isMobile ? 'none' : 'blur(16px)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow: `0 8px 32px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.1)`,
            rotateX: (isHovered && !isMobile) ? rotateX : 0,
            rotateY: (isHovered && !isMobile) ? rotateY : 0,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {/* Image Container */}
          <div className="relative aspect-video overflow-hidden">
            {/* Image with smooth transition */}
            <motion.div
              className="relative w-full h-full overflow-hidden"
              key={currentImage}
              initial={{ opacity: 0, x: hasStills && isHovered ? 20 : 0 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: "easeInOut" }}
            >
              <img
                src={currentImage}
                alt={project.title}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
            </motion.div>

            {/* Watermark Logo - Top Right (Responsive Constraints) */}
            <div className="absolute top-3 right-4 md:top- -1 md:right-4 z-10 opacity-20 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none">
              <img 
                src="https://i.ibb.co.com/MD6xpWds/hsno-mark-f.png" 
                alt="Watermark" 
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
            {hasStills && isHovered && (
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
                className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center"
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
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
                    background: isMobile ? 'rgba(205, 92, 92, 0.9)' : 'rgba(255, 255, 255, 0.15)',
                    backdropFilter: isMobile ? 'blur(8px)' : 'blur(12px)',
                    border: `1px solid ${isMobile ? 'rgba(205, 92, 92, 1)' : 'rgba(255, 255, 255, 0.2)'}`,
                    boxShadow: isMobile ? '0 4px 16px rgba(0,0,0,0.4)' : `0 8px 32px ${glowColor}`,
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
                          backdropFilter: 'blur(8px)',
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
            className="p-6 relative"
            style={{
              background: 'rgba(0, 0, 0, 0.3)',
              backdropFilter: isMobile ? 'none' : 'blur(12px)',
              borderTop: '1px solid rgba(255, 255, 255, 0.05)',
            }}
          >
            {/* Category & Year Tags */}
            <div className="flex items-center justify-between mb-3">
              <span 
                className="metadata px-3 py-1.5 rounded-full text-white/85 text-xs"
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                {project.category}
              </span>
              <span 
                className="metadata px-3 py-1.5 rounded-full text-white/65 text-xs"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(8px)',
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
              boxShadow: `inset 0 0 40px rgba(${dominantColor.r}, ${dominantColor.g}, ${dominantColor.b}, 0.25), inset 0 0 80px rgba(${dominantColor.r}, ${dominantColor.g}, ${dominantColor.b}, 0.1)`,
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