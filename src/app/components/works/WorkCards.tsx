'use client';
import { motion } from 'motion/react';
import { useState, useRef, useEffect, useCallback, memo } from 'react';
import {
    Film, Camera, ArrowDown, ArrowUp, Play, Pause,
    Shuffle, Repeat, Repeat1, SkipBack, SkipForward, Plus, Check,
} from 'lucide-react';
import type { MVWork, Photo, AudioTrack, SortMode, FilterId } from './types';
import { ImageModal } from '../ImageModal';

function makeWave(seed: string, n = 44): number[] {
    let h = 0;
    for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
    const o: number[] = [];
    for (let i = 0; i < n; i++) {
        h = (h * 9301 + 49297) % 233280;
        const r = h / 233280;
        const v = 0.25 + 0.75 * Math.abs(Math.sin(i * 0.55) * 0.6 + r);
        o.push(Math.max(0.18, Math.min(1, v)));
    }
    return o;
}

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
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }}>
            {btn('newest', 'Newest', ArrowDown)}{btn('oldest', 'Oldest', ArrowUp)}
        </div>
    );
});

const AudioRow = memo(function AudioRow({ track, active, playing, onRowClick, onPlayClick }: { track: AudioTrack; active: boolean; playing: boolean; onRowClick: () => void; onPlayClick: () => void }) {
    return (
        <div className="liquid-glass-card relative overflow-hidden rounded-2xl p-3 flex items-center gap-3 cursor-pointer"
            onClick={onRowClick}
            style={{ boxShadow: active ? `inset 0 1px 0 rgba(255,255,255,0.14), 0 0 0 1px ${track.accent}66, 0 12px 30px -16px ${track.accent}` : 'inset 0 1px 0 rgba(255,255,255,0.10)' }}>
            <div className="relative w-12 h-12 shrink-0 rounded-lg overflow-hidden">
                <img src={track.artwork} alt={track.title} loading="lazy" decoding="async" className="w-full h-full object-cover" />
            </div>
            <div className="min-w-0 flex-1">
                <div className="body-text text-white text-sm font-semibold truncate">{track.title}</div>
                <div className="metadata text-white/50 text-[10px] mt-0.5 truncate">{track.film} • {track.role}</div>
            </div>
            <button type="button" onClick={(e) => { e.stopPropagation(); onPlayClick(); }} aria-label={active && playing ? 'Pause' : 'Play'}
                className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-white transition-transform hover:scale-105"
                style={{ background: active ? track.accent : 'rgba(255,255,255,0.12)' }}>
                {active && playing ? <Pause className="w-3.5 h-3.5" fill="white" /> : <Play className="w-3.5 h-3.5 ml-0.5" fill="white" />}
            </button>
        </div>
    );
});

const AudioPlayer = memo(function AudioPlayer({ track, playing, prog, wave, onToggle, onPrev, onNext, shuffle, onShuffle, repeat, onRepeat, onSeek, onClose }: {
    track: AudioTrack; playing: boolean; prog: number; wave: number[];
    onToggle: () => void; onPrev: () => void; onNext: () => void;
    shuffle: boolean; onShuffle: () => void; repeat: 'off' | 'all' | 'one'; onRepeat: () => void;
    onSeek: (ratio: number) => void; onClose: () => void;
}) {
    const [liked, setLiked] = useState(false);
    const [drag, setDrag] = useState(false);
    const barRef = useRef<HTMLDivElement>(null);
    const seekX = (clientX: number) => {
        const el = barRef.current; if (!el) return;
        const r = el.getBoundingClientRect();
        onSeek(Math.max(0, Math.min(1, (clientX - r.left) / r.width)));
    };
    const ghost = 'w-10 h-10 rounded-full flex items-center justify-center text-white/75 hover:text-white hover:bg-white/10 transition-colors';
    return (
        <div className="liquid-glass-card relative overflow-hidden rounded-2xl p-4 md:p-5 flex flex-col md:flex-row gap-4 md:gap-5"
            style={{ boxShadow: `inset 0 1px 0 rgba(255,255,255,0.14), 0 0 0 1px ${track.accent}55, 0 18px 44px -18px ${track.accent}` }}>
            <div aria-hidden className="absolute -top-12 -right-12 w-48 h-48 rounded-full pointer-events-none"
                style={{ background: `radial-gradient(circle, ${track.accent}40, transparent 70%)`, filter: 'blur(30px)', mixBlendMode: 'screen' }} />
            <div className="relative w-full md:w-40 aspect-square md:aspect-square shrink-0 rounded-xl overflow-hidden">
                <img src={track.artwork} alt={track.title} className="w-full h-full object-cover" />
            </div>
            <div className="relative z-10 flex-1 min-w-0 flex flex-col">
                <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                        <div className="body-text text-white text-base md:text-lg font-semibold truncate">{track.title}</div>
                        <div className="metadata text-white/50 text-[10px] mt-0.5 truncate">{track.film} • {track.role}</div>
                    </div>
                    <button type="button" onClick={onClose} aria-label="Collapse" className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10">
                        <ArrowUp className="w-4 h-4" />
                    </button>
                </div>

                <div ref={barRef} className="relative mt-4 h-10 flex items-end gap-[2px] cursor-pointer select-none touch-none"
                    onPointerDown={(e) => { setDrag(true); (e.target as HTMLElement).setPointerCapture?.(e.pointerId); seekX(e.clientX); }}
                    onPointerMove={(e) => { if (drag) seekX(e.clientX); }}
                    onPointerUp={() => setDrag(false)} onPointerCancel={() => setDrag(false)}>
                    {wave.map((h, i) => {
                        const on = (i + 0.5) / wave.length <= prog;
                        return <span key={i} className="flex-1 rounded-full transition-colors duration-150" style={{ height: `${Math.round(h * 100)}%`, background: on ? track.accent : 'rgba(255,255,255,0.16)' }} />;
                    })}
                </div>

                <div className="flex items-center justify-center gap-3 md:gap-4 mt-3">
                    <button type="button" aria-label="Shuffle" onClick={onShuffle} className={ghost} style={{ color: shuffle ? track.accent : undefined }}><Shuffle className="w-4 h-4" /></button>
                    <button type="button" aria-label="Previous" onClick={onPrev} className={ghost}><SkipBack className="w-5 h-5" fill="currentColor" /></button>
                    <button type="button" aria-label={playing ? 'Pause' : 'Play'} onClick={onToggle}
                        className="w-14 h-14 rounded-full flex items-center justify-center text-white" style={{ background: track.accent, boxShadow: `0 8px 22px -8px ${track.accent}` }}>
                        {playing ? <Pause className="w-5 h-5" fill="white" /> : <Play className="w-5 h-5 ml-0.5" fill="white" />}
                    </button>
                    <button type="button" aria-label="Next" onClick={onNext} className={ghost}><SkipForward className="w-5 h-5" fill="currentColor" /></button>
                    <button type="button" aria-label="Repeat" onClick={onRepeat} className={ghost} style={{ color: repeat !== 'off' ? track.accent : undefined }}>
                        {repeat === 'one' ? <Repeat1 className="w-4 h-4" /> : <Repeat className="w-4 h-4" />}
                    </button>
                </div>

                <div className="flex justify-center mt-3">
                    <button type="button" onClick={() => setLiked((v) => !v)}
                        className="metadata flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[10px] transition-colors"
                        style={{ background: 'rgba(255,255,255,0.08)', color: liked ? track.accent : 'rgba(255,255,255,0.8)' }}>
                        {liked ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}{liked ? 'Added' : 'Add to List'}
                    </button>
                </div>
            </div>
        </div>
    );
});

export function AudioList({ tracks }: { tracks: AudioTrack[] }) {
    const [idx, setIdx] = useState(0);
    const [playing, setPlaying] = useState(false);
    const [prog, setProg] = useState(0);
    const [shuffle, setShuffle] = useState(false);
    const [repeat, setRepeat] = useState<'off' | 'all' | 'one'>('off');
    const [expanded, setExpanded] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);
    const autoPlayRef = useRef(false);
    const cur = tracks[idx];
    const wave = makeWave(cur?.title ?? 'x');

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
    const rowClick = (i: number) => { if (i === idx) { setExpanded((e) => !e); } else { autoPlayRef.current = true; setIdx(i); setExpanded(true); } };
    const rowPlay = (i: number) => { if (i === idx) { toggle(); } else { autoPlayRef.current = true; setIdx(i); setExpanded(true); } };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            {tracks.map((t, i) => {
                const active = i === idx;
                const open = active && expanded;
                return (
                    <motion.div key={`audio-${t.id}`} layout className={open ? 'md:col-span-2' : ''}
                        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: Math.min(i * 0.04, 0.2) }}>
                        {open ? (
                            <AudioPlayer track={t} playing={playing} prog={prog} wave={wave}
                                onToggle={toggle} onPrev={goPrev} onNext={goNext}
                                shuffle={shuffle} onShuffle={() => setShuffle((s) => !s)} repeat={repeat} onRepeat={() => setRepeat((r) => (r === 'off' ? 'all' : r === 'all' ? 'one' : 'off'))}
                                onSeek={(ratio) => { const a = audioRef.current; if (!a || !a.duration) return; a.currentTime = ratio * a.duration; setProg(ratio); }}
                                onClose={() => setExpanded(false)} />
                        ) : (
                            <AudioRow track={t} active={active} playing={active && playing} onRowClick={() => rowClick(i)} onPlayClick={() => rowPlay(i)} />
                        )}
                    </motion.div>
                );
            })}
            <audio ref={audioRef} src={cur?.audio} preload="metadata"
                onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)}
                onTimeUpdate={(e) => { const a = e.currentTarget; if (a.duration) setProg(a.currentTime / a.duration); }}
                onEnded={onEnded} />
        </div>
    );
}

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

export const CreditCard = memo(function CreditCard({ work }: { work: MVWork }) {
    return (
        <div className="liquid-glass-card relative h-full p-5 md:p-6 rounded-2xl flex flex-col justify-between gap-4 overflow-hidden"
            style={work.indicator ? { boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.4), 0 0 0 1px rgba(205,92,92,0.35), 0 14px 36px -16px rgba(205,92,92,0.5)' } : undefined}>
            {work.indicator && <div aria-hidden className="absolute -top-10 -right-10 w-40 h-40 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(205,92,92,0.4), transparent 70%)', filter: 'blur(28px)', mixBlendMode: 'screen' }} />}
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

export const EmptyState = memo(function EmptyState({ filter }: { filter: FilterId }) {
    const isPhoto = filter === 'photography';
    const Icon = isPhoto ? Camera : Film;
    return (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }} className="liquid-glass-card rounded-3xl py-20 px-6 flex flex-col items-center text-center">
            <div className="liquid-glass-floating w-16 h-16 rounded-full flex items-center justify-center mb-5"><Icon className="w-7 h-7 text-white/70" /></div>
            <h3 className="film-title text-white text-xl md:text-2xl mb-2">{isPhoto ? 'Galeri fotografi' : 'Belum ada karya'}</h3>
            <p className="body-text text-white/55 text-sm max-w-md">{isPhoto ? 'Karya fotografi ditampilkan di section terpisah. Mau disatukan ke filter ini? Tambahkan data foto ke sini.' : 'Belum ada karya untuk kategori ini. Cek kembali nanti atau pilih kategori lain.'}</p>
        </motion.div>
    );
});