import { motion } from 'motion/react';
import { useInView } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { Play } from 'lucide-react';
import { VideoModal } from './VideoModal';
import { OptimizedImage } from './ui/OptimizedImage';

export const MOVING_POSTER_CONFIG = {
  enabled: true,
  transitionDelayMs: 3000,
  manualOverrides: {
    'My Hand, Her Signature': '',
    'Blue Before Dawn': '',
    'The Mute Room': '',
  } as Record<string, string>,
};

function normalizeVideoUrl(url: string | undefined): string | undefined {
  if (!url) return url;
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

interface Credit { role: string; name: string; }
interface FeaturedProjectData {
  title: string; subtitle: string; description: string; image: string;
  category: string; year: string; status: string; statusColor?: string;
  watermarkLogo?: string; videoUrl?: string; previewVideoUrl?: string;
  titleImage?: string; credits?: Credit[];
}
interface FeaturedProjectProps { project: FeaturedProjectData; }

export function FeaturedProject({ project }: FeaturedProjectProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const isCurrentlyVisible = useInView(ref, { once: false, amount: 0.3 });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const videoRefDesktop = useRef<HTMLVideoElement>(null);
  const videoRefMobile = useRef<HTMLVideoElement>(null);

  const rawPreviewUrl = MOVING_POSTER_CONFIG.manualOverrides[project.title] || project.previewVideoUrl;
  const previewVideoUrl = normalizeVideoUrl(rawPreviewUrl);
  const isPosterEnabled = MOVING_POSTER_CONFIG.enabled && !!previewVideoUrl;
  const hasVideo = !!project.videoUrl;

  useEffect(() => {
    if (!isPosterEnabled) return;
    if (isCurrentlyVisible) {
      const timer = setTimeout(() => setShowVideo(true), MOVING_POSTER_CONFIG.transitionDelayMs);
      return () => clearTimeout(timer);
    } else {
      setShowVideo(false);
    }
  }, [isCurrentlyVisible, isPosterEnabled, previewVideoUrl, project.title]);

  useEffect(() => {
    if (showVideo) {
      const playVideo = async () => {
        try { if (videoRefDesktop.current) { videoRefDesktop.current.muted = true; await videoRefDesktop.current.play(); } } catch (err) { console.warn(err); }
        try { if (videoRefMobile.current) { videoRefMobile.current.muted = true; await videoRefMobile.current.play(); } } catch (err) { console.warn(err); }
      };
      playVideo();
    } else {
      if (videoRefDesktop.current) { try { videoRefDesktop.current.pause(); videoRefDesktop.current.currentTime = 0; } catch (e) { } }
      if (videoRefMobile.current) { try { videoRefMobile.current.pause(); videoRefMobile.current.currentTime = 0; } catch (e) { } }
    }
  }, [showVideo, project.title]);

  const statusColorMap: Record<string, string> = {
    yellow: 'bg-yellow-400', red: 'bg-red-400', green: 'bg-green-400',
    blue: 'bg-blue-400', purple: 'bg-purple-400', orange: 'bg-orange-400',
  };
  const badgeColor = statusColorMap[project.statusColor || 'yellow'] || 'bg-yellow-400';

  return (
    <section ref={ref} className="relative w-full min-h-screen flex items-center overflow-hidden">
      <motion.div initial={{ opacity: 0, scale: 1.05 }} animate={isInView ? { opacity: 1, scale: 1 } : {}} transition={{ duration: 1.0 }} className="absolute inset-0 md:block hidden">
        <motion.div className="absolute inset-0 w-full h-full" animate={{ opacity: showVideo ? 0 : 1 }} transition={{ duration: 1.0, ease: 'easeInOut' }}>
          <OptimizedImage src={project.image} alt={project.title} className="w-full h-full" />
        </motion.div>
        {isPosterEnabled && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: showVideo ? 1 : 0 }} transition={{ duration: 1.0, ease: 'easeInOut' }} className="absolute inset-0 w-full h-full">
            <video ref={videoRefDesktop} src={previewVideoUrl} autoPlay loop muted playsInline preload="auto" className="w-full h-full object-cover bg-black" />
          </motion.div>
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-black/25 to-black/50 z-10 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent z-10 pointer-events-none" />
        {project.watermarkLogo && (
          <div className="absolute top-4 right-4 md:top-8 md:right-8 z-20 opacity-50 pointer-events-none">
            <img src={project.watermarkLogo} alt="Watermark" loading="lazy" decoding="async" className='w-auto h-[17px] sm:h-[22px] md:h-[34px] lg:h-[45px] drop-shadow-2xl object-contain' style={{ filter: 'brightness(0) invert(1)' }} />
          </div>
        )}
      </motion.div>

      <div className="md:hidden w-full py-12 px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7 }} className="mb-8">
          <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden">
            <motion.div className="absolute inset-0 w-full h-full" animate={{ opacity: showVideo ? 0 : 1 }} transition={{ duration: 1.0, ease: 'easeInOut' }}>
              <OptimizedImage src={project.image} alt={project.title} className="w-full h-full" />
            </motion.div>
            {isPosterEnabled && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: showVideo ? 1 : 0 }} transition={{ duration: 0.5, ease: 'easeInOut' }} className="absolute inset-0 w-full h-full">
                <video ref={videoRefMobile} src={previewVideoUrl} autoPlay loop muted playsInline preload="auto" className="w-full h-full object-cover" />
              </motion.div>
            )}
          </div>
        </motion.div>
        <div className="space-y-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.2 }} className="inline-flex items-center gap-2 liquid-glass-badge px-3 py-1.5 rounded-full">
            <div className={`w-2 h-2 ${badgeColor} rounded-full animate-pulse`} />
            <span className="metadata text-white/90 text-xs">{project.status}</span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.3 }} className="flex items-center gap-4 flex-wrap">
            {project.titleImage ? (
              <img src={project.titleImage} alt={project.title} className="h-10 sm:h-12 md:h-16 lg:h-20 w-auto object-contain drop-shadow-lg" style={{ filter: 'brightness(0) invert(1)' }} />
            ) : (
              <h3 className="film-title mb-0 text-white tracking-wide text-3xl">{project.title}</h3>
            )}
            {project.watermarkLogo && (
              <img src={project.watermarkLogo} alt="Watermark" loading="lazy" decoding="async" className="h-[22px] w-auto object-contain drop-shadow-lg opacity-50" style={{ filter: 'brightness(0) invert(1)' }} />
            )}
          </motion.h1>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.4 }} className="flex gap-3">
            <span className="metadata liquid-glass-badge px-2.5 py-1 rounded-full text-white/80 text-xs">{project.category}</span>
            <span className="metadata liquid-glass-badge px-2.5 py-1 rounded-full text-white/80 text-xs">{project.year}</span>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.5 }} className="liquid-glass-card p-4 rounded-xl">
            <p className="body-text text-white/85 leading-relaxed text-sm">{project.description}</p>
          </motion.div>
          {hasVideo && (
            <motion.button type="button" initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.6 }} onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsModalOpen(true); }} className="liquid-glass-button px-6 py-3 rounded-full flex items-center gap-3 group">
              <div className="liquid-glass-floating w-8 h-8 rounded-full flex items-center justify-center">
                <Play className="w-4 h-4 text-white ml-0.5" fill="white" />
              </div>
              <span className="metadata text-white text-xs">Watch Film</span>
            </motion.button>
          )}
        </div>
      </div>

      <div className="relative z-20 w-full max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-24 hidden md:block">
        <div className="max-w-2xl">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.2 }} className="inline-flex items-center gap-2 mb-4 md:mb-6 liquid-glass-badge px-3 md:px-4 py-1.5 md:py-2 rounded-full">
            <div className={`w-2 h-2 ${badgeColor} rounded-full animate-pulse`} />
            <span className="metadata text-white/90 text-xs">{project.status}</span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, delay: 0.3 }} className="film-title text-white mb-3 md:mb-6" style={{ fontSize: 'clamp(2rem, 7vw, 5rem)' }}>
            {project.titleImage ? (
              <img src={project.titleImage} alt={project.title} className="h-10 sm:h-12 md:h-16 lg:h-20 w-auto object-contain drop-shadow-lg" style={{ filter: 'brightness(0) invert(1)' }} />
            ) : project.title}
          </motion.h1>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.4 }} className="flex gap-3 md:gap-4 mb-4 md:mb-6">
            <span className="metadata liquid-glass-badge px-2.5 md:px-3 py-1 md:py-1.5 rounded-full text-white/80 text-xs">{project.category}</span>
            <span className="metadata liquid-glass-badge px-2.5 md:px-3 py-1 md:py-1.5 rounded-full text-white/80 text-xs">{project.year}</span>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.5 }} className="liquid-glass-card p-4 md:p-6 mb-6 md:mb-8">
            <p className="body-text text-white/85 leading-relaxed text-sm md:text-base">{project.description}</p>
          </motion.div>
          {hasVideo && (
            <motion.button type="button" initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.6 }} onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsModalOpen(true); }} className="liquid-glass-button px-8 py-4 rounded-full flex items-center gap-3 group" whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
              <div className="liquid-glass-floating w-10 h-10 rounded-full flex items-center justify-center">
                <Play className="w-4 h-4 text-white ml-0.5" fill="white" />
              </div>
              <span className="metadata text-white">Watch Film</span>
            </motion.button>
          )}
        </div>
      </div>

      {hasVideo && (
        <VideoModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} videoUrl={normalizeVideoUrl(project.videoUrl) || ''} title={project.title} titleImage={project.titleImage} year={project.year} description={project.description} credits={project.credits || []} image={project.image} watermarkLogo={project.watermarkLogo} cinematicStills={[]} category={project.category} status={project.status} />
      )}
    </section>
  );
}