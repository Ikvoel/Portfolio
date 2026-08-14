import { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ArrowLeft, Play, Share2, Check } from 'lucide-react';
import { getProjectById } from './works/data';
import hsno from "@/assets/images/logo/hsno.png"

const MODAL_SPECTRAL = `
  radial-gradient(52% 44% at 20% 16%, rgba(29,151,241,0.5), transparent 62%),
  radial-gradient(48% 42% at 82% 20%, rgba(199,199,242,0.42), transparent 62%),
  radial-gradient(52% 46% at 78% 82%, rgba(8,65,201,0.5), transparent 64%),
  radial-gradient(48% 42% at 24% 84%, rgba(3,44,125,0.55), transparent 62%),
  radial-gradient(40% 38% at 50% 50%, rgba(255,150,90,0.16), transparent 64%),
  linear-gradient(135deg, #020D2F 0%, #032C7D 50%, #020D2F 100%)
`;

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

function getYoutubeEmbed(url: string | undefined): string | null {
    if (!url) return null;
    try {
        const u = new URL(url);
        const host = u.hostname.replace(/^www\./, '');
        let id = '';
        if (host === 'youtu.be') id = u.pathname.replace(/^\//, '').split('/')[0];
        else if (host.endsWith('youtube.com') || host.endsWith('youtube-nocookie.com')) {
            if (u.pathname.startsWith('/watch')) id = u.searchParams.get('v') || '';
            else if (u.pathname.startsWith('/embed/')) id = u.pathname.split('/')[2] || '';
            else if (u.pathname.startsWith('/shorts/')) id = u.pathname.split('/')[2] || '';
        }
        if (!id) return null;
        let start = u.searchParams.get('start') || '';
        const t = u.searchParams.get('t');
        if (!start && t) start = t.replace(/s$/i, '');
        const p = new URLSearchParams({ autoplay: '1', rel: '0', modestbranding: '1', playsinline: '1' });
        if (start) p.set('start', start);
        return `https://www.youtube.com/embed/${id}?${p.toString()}`;
    } catch {
        return null;
    }
}

function getDriveEmbed(url: string | undefined): string | null {
    if (!url) return null;
    try {
        const u = new URL(url);
        if (!/drive\.google\.com/.test(u.hostname)) return null;
        let id = u.searchParams.get('id') || '';
        if (!id) {
            const m = u.pathname.match(/\/d\/([A-Za-z0-9_-]{10,})/);
            if (m) id = m[1];
        }
        if (!id) return null;
        return `https://drive.google.com/file/d/${id}/preview`;
    } catch {
        return null;
    }
}

export function ProjectPage() {
    const { id, cat } = useParams<{ id: string; cat?: string }>();
    const navigate = useNavigate();
    const [isPlaying, setIsPlaying] = useState(false);
    const [copied, setCopied] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    const numericId = id ? parseInt(id, 10) : NaN;
    const project = getProjectById(numericId, cat);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    if (!project) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center text-white bg-[#070510]">
                <h1 className="film-title text-3xl mb-4">Project Not Found</h1>
                <button
                    type="button"
                    onClick={() => navigate('/')}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" /> Back to Home
                </button>
            </div>
        );
    }

    const videoUrl = normalizeVideoUrl(project.videoUrl) || '';
    const safeCredits = project.credits || [];
    const safeStills = project.cinematicStills || [];
    const watermarkLogo = project.clientLogos?.[0]?.logo;
    const ytEmbed = getYoutubeEmbed(videoUrl);
    const driveEmbed = getDriveEmbed(videoUrl);
    const showTitleImage = project.category === 'Short Film' && !!project.titleImage;

    const handlePlay = () => {
        if (videoUrl && videoUrl !== 'Not Available' && videoUrl !== 'Not available') {
            setIsPlaying(true);
        }
    };

    /* SHARE = AUTO COPY ke clipboard */
    const handleShare = async () => {
        const url = window.location.href;
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 2000);
        } catch {
            window.prompt('Copy link below:', url);
        }
    };

    const HeroContent = ({ isPlaying = false }) => (
        <div className="max-w-4xl [&_*]:drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)]">
            {showTitleImage ? (
                <img
                    src={project.titleImage}
                    alt={project.title}
                    className="h-12 md:h-24 lg:h-32 w-auto object-contain drop-shadow-2xl mb-4 md:mb-6"
                    style={{ filter: 'brightness(0) invert(1)' }}
                />
            ) : (
                <h1 className="text-4xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-white leading-[0.9] mb-4 md:mb-6 drop-shadow-2xl">
                    {project.title}
                </h1>
            )}
            <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-8 text-white/70 text-[10px] md:text-sm uppercase tracking-[0.2em] font-medium">
                <span>{project.year}</span>
                <span className="w-1 h-1 rounded-full bg-white/40" />
                <span>{project.category || 'Short Film'}</span>
            </div>
            <div className="flex items-center gap-3 md:gap-6">
                {!isPlaying && (
                    <button
                        type="button"
                        onClick={handlePlay}
                        className="flex items-center gap-2 md:gap-3 bg-white text-black px-6 md:px-8 py-3 md:py-3.5 rounded-full font-semibold hover:bg-white/90 transition-colors shadow-[0_8px_30px_rgba(255,255,255,0.2)] text-sm md:text-base cursor-pointer"
                    >
                        <Play className="w-4 h-4 md:w-5 md:h-5" fill="black" /> Watch
                    </button>
                )}
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={handleShare}
                        className="w-10 h-10 md:w-14 md:h-14 rounded-full liquid-glass-floating flex items-center justify-center text-white transition-transform hover:scale-105 active:scale-95"
                        title="Copy project link"
                        aria-label="Copy project link"
                    >
                        {copied ? <Check className="w-4 h-4 md:w-6 md:h-6" /> : <Share2 className="w-4 h-4 md:w-6 md:h-6" />}
                    </button>
                    {copied && (
                        <span className="metadata text-xs text-white/85">Link copied!</span>
                    )}
                </div>
            </div>
        </div>
    );

    const Player = ytEmbed ? (
        <div className="relative w-full aspect-video md:max-w-[1280px]">
            <iframe
                src={ytEmbed}
                title={project.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
                style={{ border: 0 }}
            />
        </div>
    ) : driveEmbed ? (
        <div className="relative w-full aspect-video md:max-w-[1280px]">
            <iframe
                src={driveEmbed}
                title={project.title}
                allow="autoplay; encrypted-media; fullscreen"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
                style={{ border: 0 }}
            />
        </div>
    ) : (
        <video ref={videoRef} src={videoUrl} controls className="w-full h-auto md:h-full object-contain block" playsInline>
            Your browser does not support the video tag.
        </video>
    );

    return (
        <div className="relative min-h-screen bg-[#070510] text-white overflow-x-hidden">
            <div aria-hidden className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute inset-0" style={{ background: MODAL_SPECTRAL }} />
            </div>

            {/* TOP BAR: Back kiri + LOGO HSNO di tengah (KLIK = balik ke home) */}
            <div className="sticky top-0 z-50 px-4 md:px-8 py-4 bg-gradient-to-b from-[#070510] to-[#070510]/85 border-b border-white/10">
                <div className="relative flex items-center">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        aria-label="Back"
                        className="flex items-center gap-2 px-4 py-2 rounded-full text-white/90 bg-white/10 hover:bg-white/20 transition-all border border-white/20 text-xs md:text-sm font-medium cursor-pointer"
                    >
                        <ArrowLeft className="w-4 h-4" /> Back
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate('/')}
                        aria-label="Back to home"
                        title="Back to home"
                        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-transform hover:scale-105 active:scale-95 cursor-pointer"
                    >
                        <img
                            src={hsno}
                            alt="hsno"
                            className="h-6 md:h-8 w-auto object-contain select-none"
                        />
                    </button>
                </div>
            </div>

            <div className="relative z-10 w-full">
                {!isPlaying ? (
                    <div className="relative w-full min-h-[60vh] md:h-[85vh] overflow-hidden flex flex-col justify-end">
                        <div className="absolute inset-0">
                            <img src={project.image} alt={project.title} className="w-full h-full object-cover block" />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#070510] via-[#070510]/40 to-transparent pointer-events-none" />
                        </div>

                        <button
                            type="button"
                            onClick={handlePlay}
                            className="absolute inset-0 flex items-center justify-center z-20 group cursor-pointer"
                        >
                            <div className="w-20 h-20 md:w-32 md:h-32 rounded-full liquid-glass-floating flex items-center justify-center transition-transform group-hover:scale-110">
                                <Play className="w-8 h-8 md:w-14 md:h-14 text-white ml-1" fill="white" />
                            </div>
                        </button>

                        <div className="relative z-20 p-6 md:p-16 lg:p-24">
                            <HeroContent />
                        </div>
                    </div>
                ) : (
                    <div className="relative w-full">
                        <div className="relative w-full md:h-[85vh] bg-black flex items-center justify-center overflow-hidden">
                            {Player}
                        </div>
                        <div className="w-full p-6 md:p-16 lg:p-24 bg-gradient-to-b from-black/30 to-transparent">
                            <HeroContent isPlaying={true} />
                        </div>
                    </div>
                )}
            </div>

            <div className="relative z-10 max-w-5xl mx-auto px-6 md:px-16 lg:px-24 py-12 md:py-20 space-y-16 md:space-y-24">
                <section>
                    <h2 className="text-[10px] md:text-xs uppercase tracking-[0.3em] text-white/55 font-semibold mb-4 md:mb-6">
                        Synopsis
                    </h2>
                    <p className="text-lg md:text-2xl lg:text-3xl text-white/90 leading-[1.6] font-light tracking-tight max-w-4xl">
                        {project.description || 'No synopsis available for this feature.'}
                    </p>
                </section>

                {safeCredits.length > 0 && (
                    <section>
                        <h2 className="text-[10px] md:text-xs uppercase tracking-[0.3em] text-white/55 font-semibold mb-6 md:mb-8">
                            Cast & Crew
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 md:gap-x-16 gap-y-4 md:gap-y-6">
                            {safeCredits.map((credit, idx) => (
                                <div key={idx} className="flex items-start justify-between gap-6 border-b border-white/[0.08] pb-4 md:pb-5">
                                    <span className="text-[10px] md:text-sm text-white/45 uppercase tracking-wider font-medium text-left shrink-0 max-w-[42%]">
                                        {credit.role}
                                    </span>
                                    <span className="text-base md:text-xl text-white font-light tracking-tight text-right">
                                        {credit.name}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {safeStills.length > 0 && (
                    <section>
                        <h2 className="text-[10px] md:text-xs uppercase tracking-[0.3em] text-white/55 font-semibold mb-6 md:mb-8">
                            Behind The Scenes
                        </h2>
                        <div className="columns-1 sm:columns-2 gap-4 md:gap-6">
                            {safeStills.map((still, idx) => (
                                <div
                                    key={idx}
                                    className="relative mb-4 md:mb-6 break-inside-avoid overflow-hidden rounded-xl bg-white/[0.02] border border-white/[0.06] group"
                                >
                                    <img
                                        src={still}
                                        alt={`Behind the scenes ${idx + 1}`}
                                        loading="lazy"
                                        decoding="async"
                                        className="w-full h-auto block transition-transform duration-1000 group-hover:scale-[1.03]"
                                    />
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                <section className="pt-8 md:pt-12 border-t border-white/[0.08]">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 md:gap-8">
                        <div>
                            <h2 className="text-[10px] md:text-xs uppercase tracking-[0.3em] text-white/55 font-semibold mb-2 md:mb-3">
                                Production
                            </h2>
                            <p className="text-white/85 text-base md:text-lg tracking-tight">
                                {project.category || 'Short Film'} • {project.year}
                            </p>
                        </div>
                        {watermarkLogo && (
                            <div className="flex flex-col items-start md:items-end">
                                <h2 className="text-[10px] md:text-xs uppercase tracking-[0.3em] text-white/55 font-semibold mb-2 md:mb-3">
                                    Studio
                                </h2>
                                <img
                                    src={watermarkLogo}
                                    alt="Production Studio"
                                    className="h-6 md:h-10 w-auto object-contain opacity-80"
                                    style={{ filter: 'brightness(0) invert(1)' }}
                                />
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
}