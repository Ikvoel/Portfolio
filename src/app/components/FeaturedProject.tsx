import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import { useInView } from 'motion/react';
import { Play } from 'lucide-react';
import { OptimizedImage } from './ui/OptimizedImage';
import { slugifyProject } from './works/types';

export const MOVING_POSTER_CONFIG = {
  enabled: true,
  transitionDelayMs: 3000,
  manualOverrides: {
    'My Hand, Her Signature': '',
    'Blue Before Dawn': '',
    'The Mute Room': '',
  } as Record<string, string>,
};

export function isAvailableVideoUrl(url: string | undefined | null): boolean {
  if (!url || typeof url !== 'string') return false;
  const trimmed = url.trim().toLowerCase();
  if (
    !trimmed ||
    trimmed === 'none' ||
    trimmed === 'tba' ||
    trimmed.includes('not available') ||
    trimmed.includes('not availabe') ||
    trimmed.includes('currently not available') ||
    trimmed.includes('unavailable') ||
    trimmed.includes('coming soon')
  ) {
    return false;
  }
  return (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('/') ||
    trimmed.startsWith('./') ||
    trimmed.startsWith('data:') ||
    trimmed.startsWith('blob:')
  );
}

export function normalizeVideoUrl(url: string | undefined | null): string | undefined {
  if (!isAvailableVideoUrl(url)) return undefined;
  let normalized = url!.trim();
  if (normalized.includes('dropbox.com')) {
    if (normalized.includes('dl=raw1')) normalized = normalized.replace('dl=raw1', 'raw=1');
    else if (normalized.includes('dl=0')) normalized = normalized.replace('dl=0', 'raw=1');
    else if (normalized.includes('dl=1')) normalized = normalized.replace('dl=1', 'raw=1');
    else if (!normalized.includes('raw=1')) normalized += (normalized.includes('?') ? '&' : '?') + 'raw=1';
  }
  return normalized;
}

interface Credit { role: string; name: string; }

export interface FeaturedProjectData {
  id?: number;
  title: string;
  subtitle?: string;
  description: string;
  image: string;
  category: string;
  year: string;
  status: string;
  statusColor?: string;
  watermarkLogo?: string;
  videoUrl?: string;
  previewVideoUrl?: string;
  titleImage?: string;
  credits?: Credit[];
  align?: 'left' | 'center' | 'right';
  vAlign?: 'top' | 'center' | 'bottom';
  scale?: number;
  marginX?: number;
  marginY?: number;
  maxWidth?: string;
}

interface FeaturedProjectProps { project: FeaturedProjectData; }

export function FeaturedProject({ project }: FeaturedProjectProps) {
  const navigate = useNavigate();
  const ref = useRef<HTMLElement>(null);
  const [showVideo, setShowVideo] = useState(false);
  const videoRefDesktop = useRef<HTMLVideoElement>(null);
  const videoRefMobile = useRef<HTMLVideoElement>(null);

  const align = project.align || 'left';
  const vAlign = project.vAlign || 'center';
  const scale = project.scale ?? 1.5;
  const marginX = project.marginX ?? 48;
  const marginY = project.marginY ?? 0;

  const isRight = align === 'right';
  const isCenter = align === 'center';

  const justifyClass = isCenter ? 'justify-center' : isRight ? 'justify-end' : 'justify-start';
  const itemsClass = isCenter ? 'items-center text-center' : isRight ? 'items-end text-right' : 'items-start text-left';
  const selfClass = isCenter ? 'self-center' : isRight ? 'self-end' : 'self-start';
  // vAlign cuma berlaku di desktop; mobile selalu flow natural biar nggak ada ruang kosong
  const vAlignClass = vAlign === 'top' ? 'md:items-start md:pt-16' : vAlign === 'bottom' ? 'md:items-end md:pb-16' : 'md:items-center';

  const isCurrentlyVisible = useInView(ref, { once: false, amount: 0.5 });

  const rawPreviewUrl = MOVING_POSTER_CONFIG.manualOverrides[project.title] || project.previewVideoUrl;
  const previewVideoUrl = normalizeVideoUrl(rawPreviewUrl);
  const isPosterEnabled = MOVING_POSTER_CONFIG.enabled && !!previewVideoUrl;
  const validVideoUrl = normalizeVideoUrl(project.videoUrl);
  const hasVideo = !!validVideoUrl;

  const titleImageSrc = project.titleImage || (project as any).titleimage;
  const showTitleImage = !!titleImageSrc && (
    project.category === 'Short Film' ||
    project.category === 'Short MV Film' ||
    project.category === 'Music Video'
  );

  const categorySlug = project.category.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const projectSlug = slugifyProject(project.title);

  const handleWatchClick = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('portfolio_home_scrollY', String(window.scrollY));
    }
    navigate(`/project/${categorySlug}/${projectSlug}`);
  };

  useEffect(() => {
    if (!isPosterEnabled) {
      setShowVideo(false);
      return;
    }

    if (isCurrentlyVisible) {
      const timer = setTimeout(() => setShowVideo(true), MOVING_POSTER_CONFIG.transitionDelayMs);
      return () => clearTimeout(timer);
    } else {
      setShowVideo(false);
    }
  }, [isCurrentlyVisible, isPosterEnabled]);

  useEffect(() => {
    if (showVideo && isPosterEnabled) {
      const playVideo = async () => {
        try { if (videoRefDesktop.current) { videoRefDesktop.current.muted = true; await videoRefDesktop.current.play(); } } catch (err) { console.warn(err); }
        try { if (videoRefMobile.current) { videoRefMobile.current.muted = true; await videoRefMobile.current.play(); } } catch (err) { console.warn(err); }
      };
      playVideo();
    } else {
      if (videoRefDesktop.current) { try { videoRefDesktop.current.pause(); videoRefDesktop.current.currentTime = 0; } catch (e) { } }
      if (videoRefMobile.current) { try { videoRefMobile.current.pause(); videoRefMobile.current.currentTime = 0; } catch (e) { } }
    }
  }, [showVideo, isPosterEnabled]);

  const statusColorMap: Record<string, string> = {
    yellow: 'bg-yellow-400', red: 'bg-red-400', green: 'bg-green-400',
    blue: 'bg-blue-400', purple: 'bg-purple-400', orange: 'bg-orange-400',
  };
  const badgeColor = statusColorMap[project.statusColor || 'yellow'] || 'bg-yellow-400';

  const desktopContainerStyle: React.CSSProperties = {
    paddingLeft: isCenter ? undefined : isRight ? undefined : `${marginX}px`,
    paddingRight: isCenter ? undefined : isRight ? `${marginX}px` : undefined,
    transform: marginY !== 0 ? `translateY(${marginY}px)` : undefined,
  };

  return (
    <section ref={ref} className={`relative w-full md:min-h-screen flex ${vAlignClass} overflow-hidden`}>
      {/* ===== Desktop background (full-bleed) ===== */}
      <div className="absolute inset-0 hidden md:block">
        <div
          className="absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out"
          style={{ opacity: isPosterEnabled && showVideo ? 0 : 1 }}
        >
          <OptimizedImage src={project.image} alt={project.title} className="w-full h-full object-cover" />
        </div>

        {isPosterEnabled && (
          <div
            className="absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out"
            style={{ opacity: showVideo ? 1 : 0 }}
          >
            <video
              ref={videoRefDesktop}
              src={previewVideoUrl}
              loop
              muted
              playsInline
              preload="metadata"
              // @ts-ignore
              controlsList="nodownload noplaybackrate nofullscreen"
              disablePictureInPicture
              onContextMenu={(e) => e.preventDefault()}
              className="w-full h-full object-cover bg-black pointer-events-none select-none"
            />
          </div>
        )}

        <div
          className={`absolute inset-0 z-10 pointer-events-none ${isRight
            ? 'bg-gradient-to-l from-black/60 via-black/25 to-black/10'
            : isCenter
              ? 'bg-black/35'
              : 'bg-gradient-to-r from-black/60 via-black/25 to-black/10'
            }`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent z-10 pointer-events-none" />

        {project.watermarkLogo && (
          <div className={`absolute top-4 ${isRight ? 'left-4 md:left-8' : 'right-4 md:right-8'} md:top-8 z-20 opacity-50 pointer-events-none select-none`}>
            <img
              src={project.watermarkLogo}
              alt="Watermark"
              draggable={false}
              onContextMenu={(e) => e.preventDefault()}
              loading="lazy"
              decoding="async"
              className="w-auto h-[17px] sm:h-[22px] md:h-[34px] lg:h-[45px] drop-shadow-2xl object-contain select-none pointer-events-none"
              style={{ filter: 'brightness(0) invert(1)' }}
            />
          </div>
        )}
      </div>

      {/* ===== Mobile view: stills full-bleed rapet kiri-kanan + panel info margin ngepas (efek hollow) ===== */}
      <div className="relative z-20 md:hidden w-full pt-8 pb-8">
        {/* Stills 16:9, RAPET kiri-kanan (nggak ada margin), tetap tidak di-crop */}
        <div
          onClick={handleWatchClick}
          className="relative w-full aspect-video bg-black overflow-hidden cursor-pointer select-none"
        >
          <div
            className="absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out"
            style={{ opacity: isPosterEnabled && showVideo ? 0 : 1 }}
          >
            <OptimizedImage src={project.image} alt={project.title} className="w-full h-full object-contain" />
          </div>

          {isPosterEnabled && (
            <div
              className="absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out"
              style={{ opacity: showVideo ? 1 : 0 }}
            >
              <video
                ref={videoRefMobile}
                src={previewVideoUrl}
                loop
                muted
                playsInline
                preload="metadata"
                // @ts-ignore
                controlsList="nodownload noplaybackrate nofullscreen"
                disablePictureInPicture
                onContextMenu={(e) => e.preventDefault()}
                className="w-full h-full object-contain bg-black pointer-events-none"
              />
            </div>
          )}
        </div>

        {/* Panel info: margin kiri-kanan ngepas (mx-4) => bikin efek hollow/step di bawah gambar,
      dan hollow atas dari pt-8 di wrapper */}
        <div className="liquid-glass-card relative z-10 mx-4 mt-3 rounded-2xl p-4 sm:p-5 shadow-2xl">
          <div className={`flex flex-col gap-3 ${itemsClass}`}>
            <div className={`inline-flex items-center gap-2 liquid-glass-badge px-3.5 py-1.5 rounded-full ${selfClass}`}>
              <div className={`w-2 h-2 ${badgeColor} rounded-full animate-pulse shrink-0`} />
              <span className="metadata text-white/95 text-[11px] sm:text-xs font-medium whitespace-nowrap">{project.status}</span>
            </div>

            <div className={`flex items-center gap-3 flex-wrap w-full ${justifyClass}`}>
              <div
                onClick={handleWatchClick}
                className="cursor-pointer transition-opacity hover:opacity-85"
                title={`View ${project.title}`}
              >
                {showTitleImage ? (
                  <img
                    src={titleImageSrc}
                    alt={project.title}
                    draggable={false}
                    onContextMenu={(e) => e.preventDefault()}
                    className="h-12 sm:h-16 max-w-[78vw] w-auto object-contain drop-shadow-lg select-none"
                    style={{ filter: 'brightness(0) invert(1)' }}
                  />
                ) : (
                  <h3 className="film-title mb-0 text-white tracking-wide text-[1.9rem] leading-[1.05] sm:text-4xl">
                    {project.title}
                  </h3>
                )}
              </div>
              {project.watermarkLogo && (
                <img
                  src={project.watermarkLogo}
                  alt="Watermark"
                  draggable={false}
                  onContextMenu={(e) => e.preventDefault()}
                  loading="lazy"
                  decoding="async"
                  className="h-[22px] sm:h-[26px] w-auto object-contain drop-shadow-lg opacity-50 select-none pointer-events-none"
                  style={{ filter: 'brightness(0) invert(1)' }}
                />
              )}
            </div>

            <div className={`flex gap-2.5 flex-wrap ${justifyClass}`}>
              <span className="metadata liquid-glass-badge px-3 py-1.5 rounded-full text-white/90 text-[11px] sm:text-xs whitespace-nowrap">
                {project.category}
              </span>
              <span className="metadata liquid-glass-badge px-3 py-1.5 rounded-full text-white/90 text-[11px] sm:text-xs whitespace-nowrap">
                {project.year}
              </span>
            </div>

            <p className={`body-text text-white/85 leading-relaxed text-[13px] sm:text-sm w-full ${isCenter ? 'text-center' : isRight ? 'text-right' : 'text-left'}`}>
              {project.description}
            </p>

            {hasVideo ? (
              <button
                type="button"
                onClick={handleWatchClick}
                className={`liquid-glass-button mt-1 px-5 py-3 rounded-full flex items-center gap-3 group active:scale-95 transition-transform cursor-pointer ${selfClass}`}
              >
                <div className="liquid-glass-floating w-8 h-8 rounded-full flex items-center justify-center">
                  <Play className="w-3.5 h-3.5 text-white ml-0.5" fill="white" />
                </div>
                <span className="metadata text-white text-xs font-medium">Watch</span>
              </button>
            ) : (
              <div className={`pt-1 ${selfClass}`}>
                <span className="metadata text-white/45 text-[10px] tracking-wider uppercase font-medium">
                  Video Not Available
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ===== Desktop view: configurable via Layout Tuner ===== */}
      <div
        style={desktopContainerStyle}
        className={`relative z-20 w-full py-12 md:py-24 hidden md:flex ${justifyClass}`}
      >
        <div className={`max-w-2xl flex flex-col ${itemsClass}`}>
          <div className={`inline-flex items-center gap-2.5 mb-4 md:mb-6 liquid-glass-badge px-4 py-2 rounded-full ${selfClass}`}>
            <div className={`w-2.5 h-2.5 ${badgeColor} rounded-full animate-pulse`} />
            <span className="metadata text-white/95 text-xs sm:text-sm font-medium">{project.status}</span>
          </div>

          <div
            onClick={handleWatchClick}
            className={`mb-3 md:mb-6 flex ${justifyClass} w-full cursor-pointer transition-opacity hover:opacity-85`}
            title={`View ${project.title}`}
          >
            {showTitleImage ? (
              <img
                src={titleImageSrc}
                alt={project.title}
                draggable={false}
                onContextMenu={(e) => e.preventDefault()}
                className="max-w-full w-auto object-contain drop-shadow-2xl transition-all duration-300 select-none"
                style={{
                  height: `${Math.round(24 * scale)}px`,
                  minHeight: '48px',
                  maxHeight: '180px',
                  filter: 'brightness(0) invert(1)',
                }}
              />
            ) : (
              <h1
                className="film-title text-white leading-none transition-all duration-300"
                style={{ fontSize: `clamp(${1.8 * scale}rem, ${5.5 * scale}vw, ${4.2 * scale}rem)` }}
              >
                {project.title}
              </h1>
            )}
          </div>

          <div className={`flex gap-3 md:gap-4 mb-4 md:mb-6 flex-wrap ${justifyClass}`}>
            <span className="metadata liquid-glass-badge px-3.5 md:px-4 py-1.5 md:py-2 rounded-full text-white/90 text-xs sm:text-sm">{project.category}</span>
            <span className="metadata liquid-glass-badge px-3.5 md:px-4 py-1.5 md:py-2 rounded-full text-white/90 text-xs sm:text-sm">{project.year}</span>
          </div>

          <div className={`liquid-glass-card p-4 md:p-6 mb-6 md:mb-8 w-full ${isCenter ? 'text-center' : isRight ? 'text-right' : 'text-left'}`}>
            <p className="body-text text-white/90 leading-relaxed text-sm md:text-base font-normal">{project.description}</p>
          </div>

          {hasVideo ? (
            <button
              type="button"
              onClick={handleWatchClick}
              className={`liquid-glass-button px-10 py-5 rounded-full flex items-center gap-4 group transition-all hover:scale-105 hover:-translate-y-0.5 active:scale-95 cursor-pointer ${selfClass}`}
            >
              <div className="liquid-glass-floating w-12 h-12 rounded-full flex items-center justify-center">
                <Play className="w-5 h-5 text-white ml-0.5" fill="white" />
              </div>
              <span className="metadata text-white text-base md:text-lg font-medium">Watch Film</span>
            </button>
          ) : (
            <div className={`pt-2 ${selfClass}`}>
              <span className="metadata text-white/40 text-xs md:text-sm tracking-wider uppercase font-medium">
                Video Not Available
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Invisible click-catcher: zIndex 1 biar nggak ngeblok content (z-20) */}
      <button
        type="button"
        onClick={handleWatchClick}
        aria-label={`Open ${project.title}`}
        className="absolute inset-0 opacity-0 cursor-pointer"
        style={{ zIndex: 1 }}
      />
    </section>
  );
}