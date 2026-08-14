'use client';
import { useState, useRef, useEffect, memo } from 'react';
import { useNavigate } from 'react-router';
import {
    Film, Camera, ArrowDown, ArrowUp, Play, Pause,
    Shuffle, Repeat, Repeat1, SkipBack, SkipForward, Plus, Check,
} from 'lucide-react';
import type { MVWork, Photo, AudioTrack, SortMode, FilterId } from './types';
import { ImageModal } from '../ImageModal';

function hexToRgba(hex: string, a: number): string {
    const h = hex.replace('#', '');
    const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
    const num = parseInt(full, 16);
    const r = (num >> 16) & 255;
    const g = (num >> 8) & 255;
    const b = num & 255;
    return `rgba(${r}, ${g}, ${b}, ${a})`;
}

/* Equalizer mini — transform doang, ringan */
const AUDIO_CSS = `
@keyframes eq-bounce{0%,100%{transform:scaleY(0.3)}50%{transform:scaleY(1)}}
.eq-bar{width:3px;height:100%;border-radius:2px;transform-origin:bottom;animation:eq-bounce 1s ease-in-out infinite}
.eq-bar:nth-child(2){animation-delay:0.2s}
.eq-bar:nth-child(3){animation-delay:0.4s}
@media (prefers-reduced-motion:reduce){.eq-bar{animation:none!important}}
`;

export const SortControl = memo(function SortControl({ sort, onChange }: { sort: SortMode; onChange: (s: SortMode) => void }) {
    const btn = (mode: SortMode, label: string, Icon: typeof ArrowDown) => {
        const on = sort === mode;
        return (
            <button type="button" onClick={() => onChange(mode)}
                className="metadata flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] md:text-[11px] transition-all duration-300"
                style={{ background: on ? 'rgba(255,255,255,0.16)' : 'transparent', color: on ? '#fff' : 'rgba(255,255,255,0.5)', boxShadow: on ? 'inset 0 1px 0 rgba(255,255,255,0.4)' : 'none' }}>
                <Icon className="w-3.5 h-3.5" />{label}
            </button>
        );
    };
    return (
        <div className="inline-flex items-center gap-1 rounded-full p-1 shrink-0"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)' }}>
            {btn('newest', 'Newest', ArrowDown)}{btn('oldest', 'Oldest', ArrowUp)}
        </div>
    );
});

/* ================= AUDIO PLAYER — VERSI GEDE ================= */
export function AudioList({ tracks }: { tracks: AudioTrack[] }) {
    const [idx, setIdx] = useState(0);
    const [playing, setPlaying] = useState(false);
    const [prog, setProg] = useState(0);
    const [shuffle, setShuffle] = useState(false);
    const [repeat, setRepeat] = useState<'off' | 'all' | 'one'>('off');
    const [liked, setLiked] = useState(false);
    const [drag, setDrag] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);
    const barRef = useRef<HTMLDivElement>(null);
    const autoPlayRef = useRef(false);

    const cur = tracks[idx];

    useEffect(() => {
        const a = audioRef.current; if (!a) return;
        setProg(0);
        if (autoPlayRef.current) a.play().catch(() => { });
    }, [idx]);

    const toggle = () => { const a = audioRef.current; if (!a) return; if (a.paused) a.play().catch(() => { }); else a.pause(); };
    const nextIdx = (ended: boolean): number | null => {
        const n = tracks.length;
        if (ended && repeat === 'off' && idx === n - 1 && !shuffle) return null;
        if (shuffle) { if (n < 2) return 0; let r = idx; while (r === idx) r = Math.floor(Math.random() * n); return r; }
        return (idx + 1) % n;
    };
    const goNext = () => { const n = nextIdx(false); if (n == null) { setPlaying(false); return; } autoPlayRef.current = playing; setIdx(n); };
    const goPrev = () => { autoPlayRef.current = playing; setIdx((i) => (i - 1 + tracks.length) % tracks.length); };
    const onEnded = () => {
        if (repeat === 'one') { const a = audioRef.current; if (a) { a.currentTime = 0; a.play().catch(() => { }); } return; }
        const n = nextIdx(true); if (n == null) { setPlaying(false); setProg(0); return; } autoPlayRef.current = true; setIdx(n);
    };
    const switchTo = (i: number) => { if (i === idx) { toggle(); return; } autoPlayRef.current = true; setIdx(i); };

    const seekX = (clientX: number) => {
        const el = barRef.current; const a = audioRef.current;
        if (!el || !a || !a.duration) return;
        const r = el.getBoundingClientRect();
        const ratio = Math.max(0, Math.min(1, (clientX - r.left) / r.width));
        a.currentTime = ratio * a.duration;
        setProg(ratio);
    };

    if (!cur) return null;
    const accent = cur.accent;

    const circle = 'w-11 h-11 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95';
    const glassCircle = { background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' } as const;

    return (
        <div className="relative">
            <style>{AUDIO_CSS}</style>

            {/* Player card — LEBAR: max-w-4xl */}
            <div className="relative max-w-4xl mx-auto rounded-[32px] p-7 md:p-10"
                style={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.04) 100%)',
                    border: '1px solid rgba(255,255,255,0.14)',
                    boxShadow: '0 30px 70px -30px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.15)',
                }}>
                <div className="flex items-start gap-6 md:gap-8">
                    {/* Cover art GEDE */}
                    <img
                        src={cur.artwork}
                        alt={cur.title}
                        className="w-32 h-32 md:w-44 md:h-44 rounded-2xl md:rounded-3xl object-cover shrink-0"
                        style={{ boxShadow: `0 16px 40px -14px ${hexToRgba(accent, 0.55)}` }}
                    />
                    <div className="flex-1 min-w-0">
                        <div className="body-text text-white text-xl md:text-2xl font-semibold truncate">{cur.title}</div>
                        <div className="metadata text-white/50 text-xs md:text-sm mt-1.5 truncate uppercase tracking-wider">{cur.film} • {cur.role}</div>
                        <p className="body-text text-white/40 text-xs md:text-sm leading-relaxed mt-3 md:mt-4 line-clamp-2">
                            Original audio untuk “{cur.film}” — {cur.year}.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={() => setLiked((v) => !v)}
                        aria-label={liked ? 'Added' : 'Add to List'}
                        className="shrink-0 w-10 h-10 md:w-11 md:h-11 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95"
                        style={liked
                            ? { background: '#22c55e', color: '#06240f' }
                            : { background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.14)', color: 'rgba(255,255,255,0.75)' }}>
                        {liked ? <Check className="w-4 h-4 md:w-5 md:h-5" /> : <Plus className="w-4 h-4 md:w-5 md:h-5" />}
                    </button>
                </div>

                {/* Seek bar */}
                <div
                    ref={barRef}
                    className="mt-7 md:mt-8 h-2 rounded-full bg-white/10 cursor-pointer relative overflow-hidden touch-none"
                    onPointerDown={(e) => { setDrag(true); (e.target as HTMLElement).setPointerCapture?.(e.pointerId); seekX(e.clientX); }}
                    onPointerMove={(e) => { if (drag) seekX(e.clientX); }}
                    onPointerUp={() => setDrag(false)}
                    onPointerCancel={() => setDrag(false)}>
                    <div
                        className="absolute inset-y-0 left-0 rounded-full"
                        style={{ width: `${Math.round(prog * 100)}%`, background: accent, boxShadow: `0 0 12px ${hexToRgba(accent, 0.8)}` }}
                    />
                </div>

                {/* Controls */}
                <div className="mt-6 md:mt-7 flex items-center justify-center gap-2.5 md:gap-3">
                    <button type="button" aria-label="Shuffle" onClick={() => setShuffle((s) => !s)} className={circle}
                        style={{ ...glassCircle, color: shuffle ? accent : 'rgba(255,255,255,0.7)' }}>
                        <Shuffle className="w-4 h-4 md:w-5 md:h-5" />
                    </button>
                    <button type="button" aria-label="Previous" onClick={goPrev} className={circle}
                        style={{ ...glassCircle, color: 'rgba(255,255,255,0.8)' }}>
                        <SkipBack className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" />
                    </button>
                    <button type="button" aria-label={playing ? 'Pause' : 'Play'} onClick={toggle}
                        className="w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95"
                        style={{ background: '#fff', color: '#0b1020', boxShadow: '0 10px 28px -8px rgba(255,255,255,0.5)' }}>
                        {playing ? <Pause className="w-5 h-5 md:w-6 md:h-6" fill="currentColor" /> : <Play className="w-5 h-5 md:w-6 md:h-6 ml-0.5" fill="currentColor" />}
                    </button>
                    <button type="button" aria-label="Next" onClick={goNext} className={circle}
                        style={{ ...glassCircle, color: 'rgba(255,255,255,0.8)' }}>
                        <SkipForward className="w-4 h-4 md:w-5 md:h-5" fill="currentColor" />
                    </button>
                    <button type="button" aria-label="Repeat" onClick={() => setRepeat((r) => (r === 'off' ? 'all' : r === 'all' ? 'one' : 'off'))} className={circle}
                        style={{ ...glassCircle, color: repeat !== 'off' ? accent : 'rgba(255,255,255,0.7)' }}>
                        {repeat === 'one' ? <Repeat1 className="w-4 h-4 md:w-5 md:h-5" /> : <Repeat className="w-4 h-4 md:w-5 md:h-5" />}
                    </button>
                </div>
            </div>

            {/* PLAYLIST — rows lebih gede */}
            {tracks.length > 1 && (
                <div className="relative mt-7 md:mt-8 max-w-4xl mx-auto space-y-2.5 md:space-y-3">
                    {tracks.map((t, i) => {
                        const active = i === idx;
                        return (
                            <button
                                key={`track-${t.id}`}
                                type="button"
                                onClick={() => switchTo(i)}
                                className="w-full flex items-center gap-4 md:gap-5 rounded-2xl md:rounded-3xl px-5 py-4 md:px-6 md:py-5 text-left transition-all duration-300 hover:bg-white/[0.06]"
                                style={active
                                    ? { background: 'rgba(255,255,255,0.07)', border: `1px solid ${hexToRgba(t.accent, 0.45)}`, boxShadow: `0 0 24px -12px ${hexToRgba(t.accent, 0.6)}` }
                                    : { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                                <img src={t.artwork} alt={t.title} loading="lazy" decoding="async" className="w-14 h-14 md:w-16 md:h-16 rounded-xl object-cover shrink-0" />
                                <div className="flex-1 min-w-0">
                                    <div className="body-text text-base md:text-lg font-semibold truncate" style={{ color: active ? '#fff' : 'rgba(255,255,255,0.78)' }}>
                                        {t.title}
                                    </div>
                                    <div className="metadata text-[11px] md:text-xs text-white/45 truncate mt-1">{t.film} • {t.role}</div>
                                </div>
                                <span className="metadata text-[11px] md:text-xs text-white/40 tabular-nums shrink-0">{t.year}</span>
                                {active && playing ? (
                                    <span className="flex items-end gap-[2.5px] h-4 md:h-5 shrink-0" aria-hidden>
                                        <span className="eq-bar" style={{ background: t.accent }} />
                                        <span className="eq-bar" style={{ background: t.accent }} />
                                        <span className="eq-bar" style={{ background: t.accent }} />
                                    </span>
                                ) : (
                                    <Play className="w-4 h-4 md:w-5 md:h-5 text-white/40 shrink-0" fill="currentColor" />
                                )}
                            </button>
                        );
                    })}
                </div>
            )}

            <audio ref={audioRef} src={cur.audio} preload="metadata"
                onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)}
                onTimeUpdate={(e) => { const a = e.currentTarget; if (a.duration) setProg(a.currentTime / a.duration); }}
                onEnded={onEnded} />
        </div>
    );
}

/* ================= PHOTO CARD (tetap) ================= */
export const PhotoCard = memo(function PhotoCard({ photo }: { photo: Photo }) {
    const [open, setOpen] = useState(false);
    return (
        <>
            <button type="button" onClick={() => setOpen(true)} className="group relative w-full text-left rounded-xl overflow-hidden liquid-glass-card block">
                <img src={photo.image} alt={photo.title || 'Photography'} loading="lazy" decoding="async" className="w-full h-auto block transition-transform duration-700 group-hover:scale-[1.04]" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                <div className="absolute inset-x-0 bottom-0 p-3 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
                    {photo.title && <p className="text-white/90 text-sm font-medium">{photo.title}</p>}
                    <div className="flex items-center gap-2 text-[10px] metadata mt-1">
                        <span className="text-white/70">{photo.year}</span><span className="w-1 h-1 rounded-full bg-[var(--accent-red)]" /><span className="text-white/50">{photo.category}</span>
                    </div>
                </div>
                <div className="absolute inset-0 border border-transparent group-hover:border-[var(--accent-red-subtle)] rounded-xl pointer-events-none transition-colors duration-300" />
            </button>
            {open && <ImageModal isOpen={open} onClose={() => setOpen(false)} image={photo} />}
        </>
    );
});

/* ================= CREDIT CARD (tetap) ================= */
export const CreditCard = memo(function CreditCard({ work }: { work: MVWork }) {
    const navigate = useNavigate();
    const catSlug = work.category.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const handleClick = () => navigate(`/project/${catSlug}/${work.id}`);

    return (
        <div onClick={handleClick} className="liquid-glass-card relative h-full p-5 md:p-6 rounded-2xl flex flex-col justify-between gap-4 overflow-hidden cursor-pointer hover:scale-[1.02] transition-transform"
            style={work.indicator ? { boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.4), 0 0 0 1px rgba(205,92,92,0.35), 0 14px 36px -16px rgba(205,92,92,0.5)' } : undefined}>
            {work.indicator && <div aria-hidden className="absolute -top-10 -right-10 w-40 h-40 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(205,92,92,0.4), transparent 70%)' }} />}
            <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3">
                    <span className="metadata liquid-glass-badge text-white/85 px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider">{work.category}</span>
                    {work.indicator && <span className="metadata flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] text-white/90" style={{ background: 'rgba(205,92,92,0.22)', border: '1px solid rgba(205,92,92,0.4)' }}><span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" /> Highlight</span>}
                </div>
                <h3 className="body-text text-white text-base md:text-lg font-semibold leading-snug">{work.client}</h3>
            </div>
            <div className="relative z-10 flex items-center justify-between gap-3">
                <span className="metadata text-white/65 text-[11px] md:text-xs">{work.role}</span>
                <span className="metadata text-white/40 text-[11px] tabular-nums">{work.year}</span>
            </div>
        </div>
    );
});

/* ================= EMPTY STATE (tetap) ================= */
export const EmptyState = memo(function EmptyState({ filter }: { filter: FilterId }) {
    const isPhoto = filter === 'photography';
    const Icon = isPhoto ? Camera : Film;
    return (
        <div className="liquid-glass-card rounded-3xl py-20 px-6 flex flex-col items-center text-center">
            <div className="liquid-glass-floating w-16 h-16 rounded-full flex items-center justify-center mb-5"><Icon className="w-7 h-7 text-white/70" /></div>
            <h3 className="film-title text-white text-xl md:text-2xl mb-2">{isPhoto ? 'Galeri fotografi' : 'Belum ada karya'}</h3>
            <p className="body-text text-white/55 text-sm max-w-md">{isPhoto ? 'Karya fotografi ditampilkan di section terpisah. Mau disatukan ke filter ini? Tambahkan data foto ke sini.' : 'Belum ada karya untuk kategori ini. Cek kembali nanti atau pilih kategori lain.'}</p>
        </div>
    );
});