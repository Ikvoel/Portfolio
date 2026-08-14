import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { useInView } from 'motion/react';
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
  id?: number;
  title: string; subtitle: string; description: string; image: string;
  category: string; year: string; status: string; statusColor?: string;
  watermarkLogo?: string; videoUrl?: string; previewVideoUrl?: string;
  titleImage?: string; credits?: Credit[];
}
interface FeaturedProjectProps { project: FeaturedProjectData; }

export function FeaturedProject({ project }: FeaturedProjectProps) {
  const navigate = useNavigate();
  const ref = useRef<HTMLElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const videoRefDesktop = useRef<HTMLVideoElement>(null);
  const videoRefMobile = useRef<HTMLVideoElement>(null);

  // Cek apakah video ini yang lagi di-scroll lewat
  const isCurrentlyVisible = useInView(ref, { once: false, amount: 0.5 });

  const rawPreviewUrl = MOVING_POSTER_CONFIG.manualOverrides[project.title] || project.previewVideoUrl;
  const previewVideoUrl = normalizeVideoUrl(rawPreviewUrl);
  const isPosterEnabled = MOVING_POSTER_CONFIG.enabled && !!previewVideoUrl;
  const hasVideo = !!project.videoUrl;

  // Title image buat Short Film, Short MV Film, dan category lain yang punya titleImage
  const showTitleImage = !!project.titleImage && (
    project.category === 'Short Film' ||
    project.category === 'Short MV Film' ||
    project.category === 'Music Video'
  );

  const categorySlug = project.category.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  const handleWatchClick = () => {
    if (project.id) {
      navigate(`/project/${categorySlug}/${project.id}`);
    }
  };

  // Cuma play video yang lagi visible (Netflix-style)
  useEffect(() => {
    if (!isPosterEnabled) return;

    if (isCurrentlyVisible) {
      const timer = setTimeout(() => setShowVideo(true), MOVING_POSTER_CONFIG.transitionDelayMs);
      return () => clearTimeout(timer);
    } else {
      setShowVideo(false);
    }
  }, [isCurrentlyVisible, isPosterEnabled]);

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
  }, [showVideo]);

  const statusColorMap: Record<string, string> = {
    yellow: 'bg-yellow-400', red: 'bg-red-400', green: 'bg-green-400',
    blue: 'bg-blue-400', purple: 'bg-purple-400', orange: 'bg-orange-400',
  };
  const badgeColor = statusColorMap[project.statusColor || 'yellow'] || 'bg-yellow-400';

  return (
    <section ref={ref} className="relative w-full min-h-screen flex items-center overflow-hidden">
      <div className="absolute inset-0 md:block hidden">
        <div className="absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out" style={{ opacity: showVideo ? 0 : 1 }}>
          <OptimizedImage src={project.image} alt={project.title} className="w-full h-full" />
        </div>
        {isPosterEnabled && (
          <div className="absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out" style={{ opacity: showVideo ? 1 : 0 }}>
            <video
              ref={videoRefDesktop}
              src={previewVideoUrl}
              loop
              muted
              playsInline
              preload="metadata"
              className="w-full h-full object-cover bg-black"
            />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-black/25 to-black/50 z-10 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent z-10 pointer-events-none" />
        {project.watermarkLogo && (
          <div className="absolute top-4 right-4 md:top-8 md:right-8 z-20 opacity-50 pointer-events-none">
            <img src={project.watermarkLogo} alt="Watermark" loading="lazy" decoding="async" className='w-auto h-[17px] sm:h-[22px] md:h-[34px] lg:h-[45px] drop-shadow-2xl object-contain' style={{ filter: 'brightness(0) invert(1)' }} />
          </div>
        )}
      </div>

      <div className="md:hidden w-full py-12 px-4">
        <div className="mb-8">
          <div className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden">
            <div className="absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out" style={{ opacity: showVideo ? 0 : 1 }}>
              <OptimizedImage src={project.image} alt={project.title} className="w-full h-full" />
            </div>
            {isPosterEnabled && (
              <div className="absolute inset-0 w-full h-full transition-opacity duration-500 ease-in-out" style={{ opacity: showVideo ? 1 : 0 }}>
                <video
                  ref={videoRefMobile}
                  src={previewVideoUrl}
                  loop
                  muted
                  playsInline
                  preload="metadata"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
        </div>
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 liquid-glass-badge px-3 py-1.5 rounded-full">
            <div className={`w-2 h-2 ${badgeColor} rounded-full animate-pulse`} />
            <span className="metadata text-white/90 text-xs">{project.status}</span>
          </div>
          <h1 className="flex items-center gap-4 flex-wrap">
            {showTitleImage ? (
              <img src={project.titleImage} alt={project.title} className="h-10 sm:h-12 md:h-16 lg:h-20 w-auto object-contain drop-shadow-lg" style={{ filter: 'brightness(0) invert(1)' }} />
            ) : (
              <h3 className="film-title mb-0 text-white tracking-wide text-3xl">{project.title}</h3>
            )}
            {project.watermarkLogo && (
              <img src={project.watermarkLogo} alt="Watermark" loading="lazy" decoding="async" className="h-[22px] w-auto object-contain drop-shadow-lg opacity-50" style={{ filter: 'brightness(0) invert(1)' }} />
            )}
          </h1>
          <div className="flex gap-3">
            <span className="metadata liquid-glass-badge px-2.5 py-1 rounded-full text-white/80 text-xs">{project.category}</span>
            <span className="metadata liquid-glass-badge px-2.5 py-1 rounded-full text-white/80 text-xs">{project.year}</span>
          </div>
          <div className="liquid-glass-card p-4 rounded-xl">
            <p className="body-text text-white/85 leading-relaxed text-sm">{project.description}</p>
          </div>
          {hasVideo && (
            <button
              type="button"
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsModalOpen(true); }}
              className="liquid-glass-button px-6 py-3 rounded-full flex items-center gap-3 group active:scale-95 transition-transform"
            >
              <div className="liquid-glass-floating w-8 h-8 rounded-full flex items-center justify-center">
                <Play className="w-4 h-4 text-white ml-0.5" fill="white" />
              </div>
              <span className="metadata text-white text-xs">Watch Film</span>
            </button>
          )}
        </div>
      </div>

      <div className="relative z-20 w-full max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-24 hidden md:block">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 mb-4 md:mb-6 liquid-glass-badge px-3 md:px-4 py-1.5 md:py-2 rounded-full">
            <div className={`w-2 h-2 ${badgeColor} rounded-full animate-pulse`} />
            <span className="metadata text-white/90 text-xs">{project.status}</span>
          </div>
          <h1 className="film-title text-white mb-3 md:mb-6" style={{ fontSize: 'clamp(2rem, 7vw, 5rem)' }}>
            {showTitleImage ? (
              <img src={project.titleImage} alt={project.title} className="h-10 sm:h-12 md:h-16 lg:h-20 w-auto object-contain drop-shadow-lg" style={{ filter: 'brightness(0) invert(1)' }} />
            ) : project.title}
          </h1>
          <div className="flex gap-3 md:gap-4 mb-4 md:mb-6">
            <span className="metadata liquid-glass-badge px-2.5 md:px-3 py-1 md:py-1.5 rounded-full text-white/80 text-xs">{project.category}</span>
            <span className="metadata liquid-glass-badge px-2.5 md:px-3 py-1 md:py-1.5 rounded-full text-white/80 text-xs">{project.year}</span>
          </div>
          <div className="liquid-glass-card p-4 md:p-6 mb-6 md:mb-8">
            <p className="body-text text-white/85 leading-relaxed text-sm md:text-base">{project.description}</p>
          </div>
          {hasVideo && (
            <button
              type="button"
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsModalOpen(true); }}
              className="liquid-glass-button px-8 py-4 rounded-full flex items-center gap-3 group transition-all hover:scale-105 hover:-translate-y-0.5 active:scale-95"
            >
              <div className="liquid-glass-floating w-10 h-10 rounded-full flex items-center justify-center">
                <Play className="w-4 h-4 text-white ml-0.5" fill="white" />
              </div>
              <span className="metadata text-white">Watch Film</span>
            </button>
          )}
        </div>
      </div>

      {hasVideo && project.id && (
        <button
          type="button"
          onClick={handleWatchClick}
          aria-label={`Open ${project.title}`}
          className="absolute inset-0 opacity-0"
          style={{ zIndex: 5 }}
        />
      )}

      {hasVideo && (
        <VideoModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          videoUrl={normalizeVideoUrl(project.videoUrl) || ''}
          title={project.title}
          titleImage={showTitleImage ? project.titleImage : undefined}
          year={project.year}
          description={project.description}
          credits={project.credits || []}
          image={project.image}
          watermarkLogo={project.watermarkLogo}
          cinematicStills={[]}
          category={project.category}
          status={project.status}
        />
      )}
    </section>
  );
}