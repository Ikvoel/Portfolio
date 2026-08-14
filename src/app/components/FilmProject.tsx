import { useState, useEffect, useRef, useCallback, memo } from 'react';
import { useNavigate } from 'react-router';
import { OptimizedImage } from './ui/OptimizedImage';
import hsno from "@/assets/images/logo/hsno.png"

const MY_IDENTITIES = ['Nur Husein', 'Seno'];
const isMyCredit = (name: string) => MY_IDENTITIES.some((id) => name.toLowerCase().includes(id.toLowerCase()));

function normalizeVideoUrl(url: string | undefined): string | undefined {
  if (!url || url === 'Not available' || url === 'Not Available') return undefined;
  if (url.includes('drive.google.com')) { const m = url.match(/[-\w]{25,}/); if (m) return `https://drive.google.com/uc?export=download&id=${m[0]}`; }
  if (url.includes('dropbox.com')) {
    let n = url;
    if (n.includes('dl=raw1')) n = n.replace('dl=raw1', 'raw=1');
    else if (n.includes('dl=0')) n = n.replace('dl=0', 'raw=1');
    else if (n.includes('dl=1')) n = n.replace('dl=1', 'raw=1');
    else if (!n.includes('raw=1')) n += (n.includes('?') ? '&' : '?') + 'raw=1';
    return n;
  }
  return url;
}

interface Credit { role: string; name: string; }
interface ClientLogo { name: string; logo: string; hasGlassBadge?: boolean; }
interface Project {
  id: number; title: string; category: string; year: string; description: string; image: string;
  videoUrl?: string; previewVideoUrl?: string; credits: Credit[]; cinematicStills?: string[];
  clientLogos?: ClientLogo[]; titleImage?: string;
}
interface FilmProjectProps { project: Project; index: number; isInView: boolean; }

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < breakpoint : false
  );
  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    setIsMobile(mql.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, [breakpoint]);
  return isMobile;
}

export const FilmProject = memo(function FilmProject({ project, index, isInView }: FilmProjectProps) {
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);
  const [currentStillIndex, setCurrentStillIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const preloadedRef = useRef(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const hasStills = !!(project.cinematicStills && project.cinematicStills.length > 0);
  const hasVideo = !!project.videoUrl;
  const isMobile = useIsMobile();
  const isShortFilm = project.category === 'Short Film';
  const myCredits = (project.credits || []).filter((c) => isMyCredit(c.name));

  useEffect(() => {
    if (hasStills && !preloadedRef.current) {
      preloadedRef.current = true;
      project.cinematicStills!.forEach((url) => {
        const img = new Image();
        img.decoding = 'async';
        img.src = url;
      });
    }
  }, [hasStills, project.cinematicStills]);

  useEffect(() => {
    if (isHovered && hasStills && !project.previewVideoUrl) {
      setCurrentStillIndex(0);
      const id = setInterval(() => {
        setCurrentStillIndex((p) => (p + 1) % project.cinematicStills!.length);
      }, 1800);
      intervalRef.current = id;
      return () => {
        clearInterval(id);
        intervalRef.current = null;
      };
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setCurrentStillIndex(0);
    }
  }, [isHovered, hasStills, project.cinematicStills, project.previewVideoUrl]);

  useEffect(() => {
    if (!videoRef.current) return;
    if (isHovered && project.previewVideoUrl) {
      videoRef.current.muted = true;
      videoRef.current.play().catch((e) => console.warn('[FilmProject] preview play failed', e));
    } else {
      videoRef.current.pause();
      if (videoRef.current.readyState >= 1) videoRef.current.currentTime = 0;
    }
  }, [isHovered, project.previewVideoUrl]);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  const handleClick = useCallback(() => {
    if (hasVideo) {
      const catSlug = project.category.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      navigate(`/project/${catSlug}/${project.id}`);
    }
  }, [hasVideo, navigate, project.id, project.category]);

  const Media = (
    <div className="absolute inset-0">
      <div
        className="absolute inset-0 transition-opacity duration-600"
        style={{ opacity: (isHovered && (hasStills || project.previewVideoUrl)) ? 0 : 1 }}
      >
        <OptimizedImage
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover opacity-[0.84] transition-transform duration-[1200ms] ease-out will-change-transform group-hover:scale-105"
        />
      </div>
      {project.previewVideoUrl && (
        <div className="absolute inset-0 pointer-events-none transition-opacity duration-600" style={{ opacity: isHovered ? 1 : 0 }}>
          <video ref={videoRef} src={normalizeVideoUrl(project.previewVideoUrl)} loop muted playsInline preload="none" className="w-full h-full object-cover" />
        </div>
      )}
      {!project.previewVideoUrl && hasStills && (
        <div className={`absolute inset-0 pointer-events-none transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          {project.cinematicStills!.map((stillUrl, i) => (
            <img
              key={i}
              src={stillUrl}
              alt={`${project.title} still ${i + 1}`}
              loading="eager"
              decoding="async"
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out will-change-[opacity] ${isHovered && currentStillIndex === i ? 'opacity-100' : 'opacity-0'
                }`}
            />
          ))}
        </div>
      )}
      {hasStills && isHovered && !project.previewVideoUrl && (
        <div className="absolute top-3 left-3 flex gap-1 z-20">
          {project.cinematicStills!.map((_, i) => (
            <div key={i} className="h-0.5 w-6 bg-white/25 rounded-full overflow-hidden">
              <div className="h-full bg-white transition-all duration-[1800ms] ease-linear" style={{ width: i === currentStillIndex ? '100%' : '0%' }} />
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const Watermark = (sizeCls: string) =>
    project.clientLogos && project.clientLogos.length > 0 ? (
      <div className="absolute top-4 right-4 md:top-5 md:right-5 z-20 opacity-60 pointer-events-none">
        <img src={project.clientLogos[0].logo} alt="logo" className={`w-auto object-contain ${sizeCls}`} style={{ filter: 'brightness(0) invert(1)' }} />
      </div>
    ) : (
      <div className="absolute top-4 right-4 md:top-5 md:right-5 z-20 opacity-25 pointer-events-none">
        <img src={hsno} alt="watermark" className={`w-auto object-contain ${sizeCls}`} style={{ filter: 'brightness(0) invert(1)' }} />
      </div>
    );

  const DockLogo = () => {
    const src = project.clientLogos && project.clientLogos.length > 0 ? project.clientLogos[0].logo : 'https://i.ibb.co.com/MD6xpWds/hsno-mark-f.png';
    return <img src={src} alt="" aria-hidden className="h-4 sm:h-5 md:h-6 w-auto max-w-[45%] object-contain object-right opacity-90 shrink-0 drop-shadow-[0_1px_0_rgba(255,255,255,0.6)]" style={{ filter: 'brightness(0)' }} />;
  };

  const TitleOverlay = (v: 'lg' | 'md') => {
    const pad = v === 'lg' ? 'p-5 sm:p-7 md:p-9' : 'p-4 md:p-5';
    const imgCls = v === 'lg' ? 'h-12 sm:h-[4.1rem] md:h-[5.25rem] lg:h-24' : 'h-9 md:h-[3.4rem]';
    const titleCls = v === 'lg' ? 'text-4xl sm:text-[2.8rem] md:text-[3.4rem]' : 'text-[1.7rem] md:text-3xl';
    return (
      <div className={`absolute inset-x-0 bottom-0 ${pad} z-20 flex flex-col items-start`}>
        {project.titleImage ? (
          <img src={project.titleImage} alt={project.title} className={`${imgCls} w-auto object-contain drop-shadow-[0_4px_14px_rgba(0,0,0,0.95)]`} />
        ) : (
          <h3 className={`film-title text-white ${titleCls} font-semibold tracking-wide leading-tight text-left drop-shadow-[0_3px_12px_rgba(0,0,0,0.95)]`}>{project.title}</h3>
        )}
      </div>
    );
  };

  const pillStyle = {
    background: 'rgba(255,255,255,0.22)',
    border: '1px solid rgba(255,255,255,0.5)',
    boxShadow: '0 1px 2px rgba(20,40,90,0.18), inset 0 1px 0 rgba(255,255,255,0.5)',
    backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)',
  } as const;

  const Dock = (v: 'lg' | 'md') => {
    const pad = v === 'lg' ? 'p-5 sm:p-6 md:p-8' : 'p-4 md:p-5';
    const descCls = v === 'lg' ? 'text-sm md:text-base' : 'text-xs md:text-sm';
    return (
      <div className={`${pad} liquid-glass-dock`}>
        <div className="relative z-10">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="metadata rounded-full px-2.5 py-1 text-[10px] md:text-xs font-medium uppercase tracking-wider" style={pillStyle}>{project.category}</span>
              <span className="metadata rounded-full px-2.5 py-1 text-[10px] md:text-xs font-medium" style={pillStyle}>{project.year}</span>
            </div>
            {isShortFilm && <DockLogo />}
          </div>
          <div className="grid grid-rows-[0fr] opacity-0 group-hover:grid-rows-[1fr] group-hover:opacity-100 transition-all duration-500 ease-out">
            <div className="overflow-hidden">
              <p className={`body-text ${descCls} leading-relaxed mt-3 line-clamp-3 font-medium`}>{project.description}</p>
              {myCredits.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {myCredits.slice(0, 4).map((c, i) => (
                    <span key={i} className="metadata rounded-full px-2.5 py-0.5 text-[10px] md:text-xs font-medium" style={pillStyle}>{c.role}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      className={`relative group ${hasVideo ? 'cursor-pointer' : 'cursor-default'} w-full`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      {isShortFilm ? (
        <div className="relative z-10 rounded-3xl overflow-hidden border border-white/10 shadow-[0_24px_70px_-20px_rgba(0,0,0,0.9)] w-full">
          <div className="relative aspect-[16/10] md:aspect-[21/9] w-full overflow-hidden">
            {Media}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent pointer-events-none" />
            {TitleOverlay('lg')}
          </div>
          {Dock('lg')}
        </div>
      ) : (
        <div className="relative z-10 rounded-2xl overflow-hidden border border-white/10 shadow-[0_18px_50px_-18px_rgba(0,0,0,0.85)] w-full">
          <div className="relative aspect-video w-full overflow-hidden">
            {Media}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent pointer-events-none" />
            {Watermark('h-6 md:h-9')}
            {TitleOverlay('md')}
          </div>
          {Dock('md')}
        </div>
      )}
    </div>
  );
});