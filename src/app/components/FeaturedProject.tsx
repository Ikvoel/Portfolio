import { motion } from 'motion/react';
import { useInView } from 'motion/react';
import { useRef, useState } from 'react';
import { Play } from 'lucide-react';
import { VideoModal } from './VideoModal';

interface FeaturedProjectData {
  title: string;
  subtitle: string;
  description: string;
  image: string;
  category: string;
  year: string;
  status: string;
  statusColor?: string; // Optional: color of status badge (e.g., 'yellow', 'red', 'green', 'blue')
  watermarkLogo?: string; // Optional: watermark logo URL
  videoUrl?: string;
}

interface FeaturedProjectProps {
  project: FeaturedProjectData;
}

export function FeaturedProject({ project }: FeaturedProjectProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Status badge color variants
  const statusColorMap: Record<string, string> = {
    yellow: 'bg-yellow-400',
    red: 'bg-red-400',
    green: 'bg-green-400',
    blue: 'bg-blue-400',
    purple: 'bg-purple-400',
    orange: 'bg-orange-400',
  };

  const badgeColor = statusColorMap[project.statusColor || 'yellow'] || 'bg-yellow-400';

  return (
    <section ref={ref} className="relative w-full min-h-screen flex items-center overflow-hidden">
      {/* Background Image - Desktop: cover, Mobile: contained with content below */}
      <motion.div
        initial={{ opacity: 0, scale: 1.05 }}
        animate={isInView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 1.0 }}
        className="absolute inset-0 md:block hidden"
      >
        <img
          src={project.image}
          alt={project.title}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover bg-black"
        />

        {/* Multi-layer gradient for readability - Desktop only */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-black/25 to-black/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

        {/* ===== WATERMARK LOGO - TOP RIGHT - Desktop ===== */}
        {project.watermarkLogo && (
          <div className="absolute top-4 right-4 md:top-8 md:right-8 z-20 opacity-50 pointer-events-none">
            <img
              src={project.watermarkLogo}
              alt="Watermark"
              loading="lazy"
              decoding="async"
              className="w-auto h-12 sm:h-20 md:h-32 lg:h-40 drop-shadow-2xl object-contain"
              style={{ filter: 'brightness(0) invert(1)' }}
            />
          </div>
        )}
      </motion.div>

      {/* Mobile Layout - Image and Content Stacked */}
      <div className="md:hidden w-full py-12 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mb-8"
        >
          {/* Mobile Image Container */}
          <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden">
            <img
              src={project.image}
              alt={project.title}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover"
            />
            {/* Mobile Watermark */}
            {project.watermarkLogo && (
              <div className="absolute top-3 right-3 z-10 opacity-30 pointer-events-none">
                <img
                  src={project.watermarkLogo}
                  alt="Watermark"
                  loading="lazy"
                  decoding="async"
                  className="w-auto h-10 drop-shadow-lg object-contain"
                  style={{ filter: 'brightness(0) invert(1)' }}
                />
              </div>
            )}
          </div>
        </motion.div>

        {/* Mobile Content */}
        <div className="space-y-4">
          {/* Status Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-2 glass-subtle px-3 py-1.5 rounded-full"
          >
            <div className={`w-2 h-2 ${badgeColor} rounded-full animate-pulse`} />
            <span className="metadata text-white/80 text-xs">
              {project.status}
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="film-title text-white text-3xl"
          >
            {project.title}
          </motion.h1>

          {/* Metadata */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex gap-3"
          >
            <span className="metadata glass-subtle px-2.5 py-1 rounded-full text-white/70 text-xs">
              {project.category}
            </span>
            <span className="metadata glass-subtle px-2.5 py-1 rounded-full text-white/70 text-xs">
              {project.year}
            </span>
          </motion.div>

          {/* Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="glass-card p-4 rounded-xl"
          >
            <p className="body-text text-white/80 leading-relaxed text-sm">
              {project.description}
            </p>
          </motion.div>

          {/* Watch CTA */}
          {project.videoUrl && (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.6 }}
              onClick={() => setIsModalOpen(true)}
              className="glass-card px-6 py-3 rounded-full flex items-center gap-3 hover:bg-white/20 transition-all duration-300 group"
            >
              <div className="glass-subtle w-8 h-8 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-all duration-300">
                <Play className="w-4 h-4 text-white ml-0.5" fill="white" />
              </div>
              <span className="metadata text-white text-xs">Not Available</span>
            </motion.button>
          )}
        </div>
      </div>

      {/* Desktop Content with glassmorphism */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-24 hidden md:block">
        <div className="max-w-2xl">
          {/* Status Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-2 mb-4 md:mb-6 glass-subtle px-3 md:px-4 py-1.5 md:py-2 rounded-full"
          >
            <div className={`w-2 h-2 ${badgeColor} rounded-full animate-pulse`} />
            <span className="metadata text-white/80 text-xs">
              {project.status}
            </span>
          </motion.div>

          {/* Title - Glamour Absolute font */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="film-title text-white mb-3 md:mb-6"
            style={{ fontSize: 'clamp(2rem, 7vw, 5rem)' }}
          >
            {project.title}
          </motion.h1>

          {/* Metadata */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex gap-3 md:gap-4 mb-4 md:mb-6"
          >
            <span className="metadata glass-subtle px-2.5 md:px-3 py-1 md:py-1.5 rounded-full text-white/70 text-xs">
              {project.category}
            </span>
            <span className="metadata glass-subtle px-2.5 md:px-3 py-1 md:py-1.5 rounded-full text-white/70 text-xs">
              {project.year}
            </span>
          </motion.div>

          {/* Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="glass-card p-4 md:p-6 mb-6 md:mb-8"
          >
            <p className="body-text text-white/80 leading-relaxed text-sm md:text-base">
              {project.description}
            </p>
          </motion.div>

          {/* Watch CTA */}
          {project.videoUrl && (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.6 }}
              onClick={() => setIsModalOpen(true)}
              className="glass-card px-8 py-4 rounded-full flex items-center gap-3 hover:bg-white/20 transition-all duration-300 group"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="glass-subtle w-10 h-10 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-all duration-300">
                <Play className="w-4 h-4 text-white ml-0.5" fill="white" />
              </div>
              <span className="metadata text-white">Not Available</span>
            </motion.button>
          )}
        </div>
      </div>


      {/* Video Modal */}
      {project.videoUrl && (
        <VideoModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          videoUrl={project.videoUrl}
          title={project.title}
          year={project.year}
          description={project.description}
          roles={['Director', 'Writer', 'Editor']}
        />
      )}
    </section>
  );
}
