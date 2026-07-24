import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect, useRef } from 'react';
import { VideoModal } from './VideoModal';
import { OptimizedImage } from './ui/OptimizedImage';

/* ROLE FILTER — card hanya tampilkan role yang LU pegang. VideoModal tetap full. */
const MY_IDENTITIES = ['Nur Husein', 'Seno'];
const isMyCredit = (name: string) =>
  MY_IDENTITIES.some((id) => name.toLowerCase().includes(id.toLowerCase()));

function normalizeVideoUrl(url: string | undefined): string | undefined {
  if (!url || url === 'Not available' || url === 'Not Available') return undefined;
  if (url.includes('drive.google.com')) {
    const m = url.match(/[-\w]{25,}/);
    if (m) return `https://drive.google.com/uc?export=download&id=${m[0]}`;
  }
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

export function FilmProject({ project, index, isInView }: FilmProjectProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentStillIndex, setCurrentStillIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const hasStills = !!(project.cinematicStills && project.cinematicStills.length > 0);
  const hasVideo = !!project.videoUrl;
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const isShortFilm = project.category === 'Short Film';

  const myCredits = (project.credits || []).filter((c) => isMyCredit(c.name));

  const dockImage = (isHovered && hasStills && !project.previewVideoUrl)
    ? project.cinematicStills![currentStillIndex]
    : project.image;

  useEffect(() => {
    if (isHovered && hasStills && !project.previewVideoUrl) {
      const id = setInterval(() => setCurrentStillIndex((p) => (p + 1) % project.cinematicStills!.length), 1800);
      return () => clearInterval(id);
    } else {
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

  // ---- Media (di dalam frame) ----
  const Media = (
    <div className="absolute inset-0 bg-black">
      <motion.div className="absolute inset-0" animate={{ opacity: (isHovered && (hasStills || project.previewVideoUrl)) ? 0 : 1 }} transition={{ duration: 0.6 }}>
        <OptimizedImage src={project.image} alt={project.title} className="w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105" />
      </motion.div>
      {project.previewVideoUrl && (
        <motion.div className="absolute inset-0 pointer-events-none" initial={{ opacity: 0 }} animate={{ opacity: isHovered ? 1 : 0 }} transition={{ duration: 0.6 }}>
          <video ref={videoRef} src={normalizeVideoUrl(project.previewVideoUrl)} loop muted playsInline preload="auto" className="w-full h-full object-cover" />
        </motion.div>
      )}
      {!project.previewVideoUrl && hasStills && (
        <motion.div className="absolute inset-0 pointer-events-none" initial={{ opacity: 0 }} animate={{ opacity: isHovered ? 1 : 0 }} transition={{ duration: 0.6 }}>
          <AnimatePresence>
            {isHovered && (
              <motion.img key={currentStillIndex} src={project.cinematicStills![currentStillIndex]} alt={`${project.title} still`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8 }} className="absolute inset-0 w-full h-full object-cover" />
            )}
          </AnimatePresence>
        </motion.div>
      )}
      {hasStills && isHovered && !project.previewVideoUrl && (
        <div className="absolute top-3 left-3 flex gap-1 z-20">
          {project.cinematicStills!.map((_, i) => (
            <div key={i} className="h-0.5 w-6 bg-white/25 rounded-full overflow-hidden">
              <motion.div className="h-full bg-white" initial={{ width: '0%' }} animate={{ width: i === currentStillIndex ? '100%' : '0%' }} transition={{ duration: 1.8, ease: 'linear' }} />
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // STILL di BELAKANG dock: di-DISPLACE (lensa) + di-blur jadi medan warna ter-bias.
  // Frame opaque nutupin ini di area gambar; dock bening → ini kelihatan "ter-lensa" di dock.
  const StillBackdrop = (
    <AnimatePresence>
      <motion.img
        key={dockImage}
        src={dockImage}
        alt=""
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6 }}
        className="absolute -inset-16 w-[calc(100%+8rem)] h-[calc(100%+8rem)] object-cover pointer-events-none -z-10"
        style={{ filter: 'url(#liquid-glass-disp) blur(14px) saturate(1.35) brightness(1.12)' }} // ← OFF-SWITCH lens: hapus 'url(#liquid-glass-disp) '
      />
    </AnimatePresence>
  );

  // Watermark di FRAME — HANYA non-short-film
  const Watermark = (sizeCls: string) =>
    project.clientLogos && project.clientLogos.length > 0 ? (
      <div className="absolute top-4 right-4 md:top-5 md:right-5 z-20 opacity-60 pointer-events-none">
        <img src={project.clientLogos[0].logo} alt="logo" className={`w-auto object-contain ${sizeCls}`} style={{ filter: 'brightness(0) invert(1)' }} />
      </div>
    ) : (
      <div className="absolute top-4 right-4 md:top-5 md:right-5 z-20 opacity-25 pointer-events-none">
        <img src="https://i.ibb.co.com/MD6xpWds/hsno-mark-f.png" alt="watermark" className={`w-auto object-contain ${sizeCls}`} style={{ filter: 'brightness(0) invert(1)' }} />
      </div>
    );

  // Logo di DOCK (sejajar category+year) — HANYA short film
  const DockLogo = () => {
    const src = project.clientLogos && project.clientLogos.length > 0
      ? project.clientLogos[0].logo
      : 'https://i.ibb.co.com/MD6xpWds/hsno-mark-f.png';
    return (
      <img src={src} alt="" aria-hidden
        className="h-4 sm:h-5 md:h-6 w-auto max-w-[45%] object-contain object-right opacity-90 shrink-0 drop-shadow-[0_1px_6px_rgba(0,0,0,0.85)]"
        style={{ filter: 'brightness(0) invert(1)' }} />
    );
  };

  // JUDUL di frame (kiri-bawah) — +50%
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

  // pill kaca-GELAP (legibility tanpa veil seluruh dock)
  const pillStyle = { background: 'rgba(0,0,0,0.42)', border: '1px solid rgba(255,255,255,0.18)', backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)' } as const;
  const descShadow = { textShadow: '0 1px 3px rgba(0,0,0,0.95), 0 0 14px rgba(0,0,0,0.8)' } as const;

  // ---- DOCK = TRUE LIQUID GLASS: BENING (blur kecil) + refraksi still + rim/specular. TANPA veil. ----
  const Dock = (v: 'lg' | 'md') => {
    const pad = v === 'lg' ? 'p-5 sm:p-6 md:p-8' : 'p-4 md:p-5';
    const descCls = v === 'lg' ? 'text-sm md:text-base' : 'text-xs md:text-sm';
    return (
      <div
        className={`${pad} relative`}
        style={{
          background: 'rgba(255,255,255,0.04)',                       // tint super tipis (biar refraksi dominan)
          backdropFilter: 'blur(4px) saturate(1.5) contrast(1.25)',    // ← BENING + kontras (kaca, bukan susu)
          WebkitBackdropFilter: 'blur(4px) saturate(1.5) contrast(1.25)',
          borderTop: '5px solid rgba(255,255,255,0.22)',              // seam specular antara frame & dock
          boxShadow:
            'inset 0 1px 0 rgba(255,255,255,0.55), ' +                 // specular edge atas
            'inset 0 0 0 1px rgba(255,255,255,0.10), ' +               // hairline rim sekeliling
            'inset 0 -12px 26px -10px rgba(0,0,0,0.6), ' +             // caustic / depth dalam bawah
            '0 12px 30px -12px rgba(0,0,0,0.6)',                       // drop melayang
        }}
      >
        {/* specular sheen atas (kilap kaca) — additive, BUKAN veil */}
        <div className="absolute inset-x-0 top-0 h-1/2 pointer-events-none"
          style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.20) 0%, rgba(255,255,255,0.04) 45%, transparent 100%)' }} />

        <div className="relative z-10">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="metadata rounded-full px-2.5 py-1 text-[10px] md:text-xs font-medium uppercase tracking-wider text-white/95" style={pillStyle}>{project.category}</span>
              <span className="metadata rounded-full px-2.5 py-1 text-[10px] md:text-xs font-medium text-white/90" style={pillStyle}>{project.year}</span>
            </div>
            {isShortFilm && <DockLogo />}
          </div>

          <div className="grid grid-rows-[0fr] opacity-0 group-hover:grid-rows-[1fr] group-hover:opacity-100 transition-all duration-500 ease-out">
            <div className="overflow-hidden">
              <p className={`body-text ${descCls} leading-relaxed mt-3 line-clamp-3 text-white/95`} style={descShadow}>{project.description}</p>
              {myCredits.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {myCredits.slice(0, 4).map((c, i) => (
                    <span key={i} className="metadata rounded-full px-2.5 py-0.5 text-[10px] md:text-xs font-medium text-white/95" style={pillStyle}>{c.role}</span>
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
    <>
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: isMobile ? 0 : 0.7, delay: isMobile ? 0 : index * 0.08, ease: [0.22, 1, 0.36, 1] }}
        className={`relative group ${hasVideo ? 'cursor-pointer' : 'cursor-default'} w-full`}
        onMouseEnter={() => !isMobile && setIsHovered(true)}
        onMouseLeave={() => !isMobile && setIsHovered(false)}
        onClick={() => hasVideo && setIsModalOpen(true)}
      >
        {isShortFilm ? (
          <div className="relative z-10 isolate rounded-3xl overflow-hidden border border-white/10 shadow-[0_24px_70px_-20px_rgba(0,0,0,0.9)] w-full">
            {StillBackdrop}
            <div className="relative aspect-[16/10] md:aspect-[21/9] w-full bg-neutral-950">
              {Media}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-transparent pointer-events-none" />
              {TitleOverlay('lg')}
            </div>
            {Dock('lg')}
          </div>
        ) : (
          <div className="relative z-10 isolate rounded-2xl overflow-hidden border border-white/10 shadow-[0_18px_50px_-18px_rgba(0,0,0,0.85)] w-full">
            {StillBackdrop}
            <div className="relative aspect-video w-full bg-neutral-950">
              {Media}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-transparent pointer-events-none" />
              {Watermark('h-6 md:h-9')}
              {TitleOverlay('md')}
            </div>
            {Dock('md')}
          </div>
        )}
      </motion.div>

      {hasVideo && (
        <VideoModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          videoUrl={normalizeVideoUrl(project.videoUrl) || ''}
          title={project.title}
          titleImage={project.titleImage}
          year={project.year}
          description={project.description}
          credits={project.credits}
          image={project.image}
          watermarkLogo={project.clientLogos?.[0]?.logo}
          cinematicStills={project.cinematicStills || []}
          category={project.category}
        />
      )}
    </>
  );
}