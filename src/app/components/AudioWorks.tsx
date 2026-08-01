import { motion, useInView } from 'motion/react';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Play, Pause, SkipBack, SkipForward, Shuffle, Repeat, Repeat1,
  Plus, Check, Music2, MoreHorizontal,
} from 'lucide-react';
import bom from '@/assets/artwork/bomskor.webp';
import mhhsskor from '@/assets/artwork/mhhsskor.webp';
import presenttoyou from '@/assets/bgmusic/presenttoyou.mp3';
import returnbom from '@/assets/bgmusic/return.mp3';
import ghost from '@/assets/bgmusic/ghost.wav'

/* =====================================================================
   AUDIO WORKS — hard-referenced ke mockup music-app (struktur 1:1),
   dipalet pakai bahasa site (biru frosted + aksen per-track).
   Self-contained. Gak nyentuh globals / file lain.
   ===================================================================== */
interface Track {
  title: string;
  film: string;
  year: string;
  role: string;
  audio: string;
  artwork: string;
  accent: string;
}

const TRACKS: Track[] = [
  {
    title: 'Present to you',
    film: 'My Hand, Her Signature', year: '2026', role: 'Composer',
    audio: presenttoyou, artwork: mhhsskor, accent: '#14b8a6',
  },
  {
    title: 'Return',
    film: 'Bounce of Memories', year: '2025', role: 'Composer',
    audio: returnbom, artwork: bom, accent: '#3b82f6',
  },
  {
    title: 'Laberinto de Illusione — Theme',
    film: 'Laberinto de Illusione', year: '2024', role: 'Composer & Sound Design',
    audio: ghost, artwork: mhhsskor, accent: '#ec4899',
  },
];

type RepeatMode = 'off' | 'all' | 'one';

const fmt = (s: number) => {
  if (!isFinite(s) || s < 0) return '0:00';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, '0')}`;
};

// equalizer mini (3 bar)
function Eq({ active, color }: { active: boolean; color?: string }) {
  return (
    <span className="inline-flex items-end gap-[2px] h-3.5" aria-hidden>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-[2px] rounded-full origin-bottom"
          style={{
            height: '100%',
            background: color || 'currentColor',
            animation: 'aw-eq 0.9s ease-in-out infinite',
            animationDelay: `${i * 0.18}s`,
            animationPlayState: active ? 'running' : 'paused',
            transform: active ? undefined : 'scaleY(0.3)',
          }}
        />
      ))}
    </span>
  );
}

// segitiga play kecil yang NEMPEL di pojok artwork (kayak referensi)
function CornerPlay({ state, accent }: { state: 'play' | 'pause' | 'eq'; accent: string }) {
  return (
    <span
      className="absolute -right-1.5 -bottom-1.5 w-7 h-7 rounded-full flex items-center justify-center border border-white/40 backdrop-blur-md"
      style={{ background: state === 'eq' ? accent : 'rgba(0,0,0,0.55)' }}
    >
      {state === 'eq' ? <Eq active color="#fff" /> : state === 'pause'
        ? <Pause className="w-3 h-3 text-white" fill="white" />
        : <Play className="w-3 h-3 text-white ml-0.5" fill="white" />}
    </span>
  );
}

export function AudioWorks() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.12 });

  const [index, setIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState<RepeatMode>('off');
  const [liked, setLiked] = useState<Set<number>>(() => new Set());
  const [dragging, setDragging] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const autoplayRef = useRef(false);

  const track = TRACKS[index];
  const films = useMemo(() => new Set(TRACKS.map((t) => t.film)).size, []);

  const isLiked = (i: number) => liked.has(i);
  const toggleLike = (i: number) =>
    setLiked((prev) => { const n = new Set(prev); n.has(i) ? n.delete(i) : n.add(i); return n; });

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    setProgress(0); setCurrent(0); setDuration(0);
    if (autoplayRef.current) a.play().catch(() => { });
  }, [index]);

  const togglePlay = () => {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) { a.play().catch(() => { }); setIsPlaying(true); }
    else { a.pause(); setIsPlaying(false); }
  };

  const nextIndex = (forEnded: boolean): number | null => {
    const len = TRACKS.length;
    if (forEnded && repeat === 'off' && index === len - 1 && !shuffle) return null;
    if (shuffle) {
      if (len < 2) return 0;
      let r = index; while (r === index) r = Math.floor(Math.random() * len);
      return r;
    }
    return (index + 1) % len;
  };
  const goNext = () => {
    const n = nextIndex(false);
    if (n == null) { setIsPlaying(false); return; }
    autoplayRef.current = isPlaying; setIndex(n);
  };
  const goPrev = () => {
    autoplayRef.current = isPlaying;
    setIndex((i) => (i - 1 + TRACKS.length) % TRACKS.length);
  };
  const onEnded = () => {
    if (repeat === 'one') {
      const a = audioRef.current; if (a) { a.currentTime = 0; a.play().catch(() => { }); }
      return;
    }
    const n = nextIndex(true);
    if (n == null) { setIsPlaying(false); setProgress(0); return; }
    autoplayRef.current = true; setIndex(n);
  };
  const selectTrack = (i: number) => {
    if (i === index) { togglePlay(); return; }
    autoplayRef.current = true; setIndex(i); setIsPlaying(true);
  };

  // seek dari pointer di progress bar
  const seekFromClientX = (clientX: number) => {
    const a = audioRef.current, el = barRef.current;
    if (!a || !el || !duration) return;
    const rect = el.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    a.currentTime = ratio * duration; setProgress(ratio); setCurrent(ratio * duration);
  };
  const cycleRepeat = () => setRepeat((r) => (r === 'off' ? 'all' : r === 'all' ? 'one' : 'off'));

  const ctrlGhost = 'w-11 h-11 flex items-center justify-center rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors';

  return (
    <section ref={ref} className="relative py-24 px-4 overflow-hidden">
      <style>{`
        @keyframes aw-eq{0%,100%{transform:scaleY(.3)}50%{transform:scaleY(1)}}
        .aw-scroll{scrollbar-width:none;-ms-overflow-style:none}
        .aw-scroll::-webkit-scrollbar{display:none}
      `}</style>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-6 lg:gap-8 items-start">

          {/* ================= KOLOM KIRI = SATU PANEL APP ================= */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="order-1 liquid-glass-card rounded-3xl p-4 md:p-6"
          >
            {/* header ala "Today / Playlists" */}
            <div className="flex items-start justify-between gap-4 mb-5">
              <div>
                <div className="flex items-center gap-2.5 mb-2">
                  <span className="w-6 h-px" style={{ background: track.accent }} />
                  <span className="metadata text-white/50 text-[10px]">Original Scores & Composition</span>
                </div>
                <h2 className="section-title text-white text-3xl md:text-4xl leading-none">Audio Works</h2>
                <p className="body-text text-white/50 text-xs md:text-sm mt-2 max-w-sm">
                  Scoring & komposisi orisinal di balik gambar.
                </p>
              </div>
              <span className="liquid-glass-floating w-10 h-10 shrink-0 flex items-center justify-center text-white/80">
                <Music2 className="w-4 h-4" />
              </span>
            </div>

            {/* carousel kartu besar horizontal */}
            <div className="aw-scroll flex gap-3 overflow-x-auto pb-1 -mx-1 px-1 snap-x snap-mandatory">
              {TRACKS.map((t, i) => {
                const active = i === index;
                return (
                  <button
                    key={t.title}
                    type="button"
                    onClick={() => selectTrack(i)}
                    className="group/card snap-start shrink-0 w-36 sm:w-40 text-left"
                  >
                    <div
                      className="relative aspect-square rounded-2xl overflow-hidden transition-transform duration-300 group-hover/card:scale-[1.03]"
                      style={{
                        boxShadow: active
                          ? `0 0 0 1.5px ${t.accent}, 0 16px 34px -12px ${t.accent}`
                          : '0 10px 26px -14px rgba(0,0,0,0.7)',
                      }}
                    >
                      <img src={t.artwork} alt={t.title} loading="lazy" decoding="async" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
                      <div className="absolute left-2.5 right-2.5 bottom-2.5">
                        <div className="body-text text-white text-[13px] font-semibold leading-tight line-clamp-2 drop-shadow">{t.title}</div>
                      </div>
                      <span
                        onClick={(e) => { e.stopPropagation(); selectTrack(i); }}
                        className="absolute right-2 bottom-2 w-8 h-8 rounded-full flex items-center justify-center border border-white/40 backdrop-blur-md transition-colors"
                        style={{ background: active && isPlaying ? t.accent : 'rgba(0,0,0,0.5)' }}
                      >
                        {active && isPlaying ? <Eq active color="#fff" /> : <Play className="w-3.5 h-3.5 text-white ml-0.5" fill="white" />}
                      </span>
                    </div>
                    <div className="metadata text-white/45 text-[9px] mt-2 truncate">{t.film} • {t.role}</div>
                  </button>
                );
              })}
            </div>

            {/* sub-head + stats */}
            <div className="flex items-center justify-between mt-6 mb-1 px-1">
              <span className="metadata text-white/55 text-[11px]">All Tracks</span>
              <span className="metadata text-white/35 text-[10px]">{TRACKS.length} Tracks • {films} Films</span>
            </div>

            {/* list FLAT */}
            <div className="mt-1">
              {TRACKS.map((t, i) => {
                const active = i === index;
                const corner = active ? (isPlaying ? 'eq' : 'pause') : 'play';
                return (
                  <button
                    key={t.title}
                    type="button"
                    onClick={() => selectTrack(i)}
                    className="group/row w-full flex items-center gap-3 py-2.5 px-2 rounded-xl transition-colors text-left hover:bg-white/[0.05]"
                    style={{ background: active ? `${t.accent}1f` : undefined }}
                  >
                    {/* artwork + play nempel */}
                    <div className="relative w-12 h-12 shrink-0 rounded-lg overflow-visible">
                      <div className="w-12 h-12 rounded-lg overflow-hidden">
                        <img src={t.artwork} alt={t.title} loading="lazy" decoding="async" className="w-full h-full object-cover" />
                      </div>
                      <CornerPlay state={corner} accent={t.accent} />
                    </div>

                    {/* teks */}
                    <div className="min-w-0 flex-1">
                      <div className="body-text text-[14px] font-medium truncate" style={{ color: active ? '#fff' : 'rgba(255,255,255,0.85)' }}>{t.title}</div>
                      <div className="metadata text-white/40 text-[10px] mt-0.5 truncate">{t.film} • {t.role}</div>
                    </div>

                    {/* tombol bulat kanan = add per-track (fungsional) */}
                    <span
                      onClick={(e) => { e.stopPropagation(); toggleLike(i); }}
                      className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center border transition-colors"
                      style={{
                        borderColor: isLiked(i) ? t.accent : 'rgba(255,255,255,0.18)',
                        color: isLiked(i) ? t.accent : 'rgba(255,255,255,0.55)',
                        background: isLiked(i) ? `${t.accent}1f` : 'transparent',
                      }}
                    >
                      {isLiked(i) ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                    </span>
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* ================= KOLOM KANAN = NOW PLAYING ================= */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="order-2 lg:sticky lg:top-24"
          >
            <div className="liquid-glass-card relative rounded-3xl p-5 md:p-7 overflow-hidden">
              {/* tint aksen tipis (surface berwarna, flat — bukan glow blur) */}
              <div aria-hidden className="absolute inset-0 pointer-events-none"
                style={{ background: `radial-gradient(120% 80% at 82% 0%, ${track.accent}26, transparent 60%)`, transition: 'background 0.6s ease' }} />

              <div className="relative z-10">
                {/* artwork bersih */}
                <div className="relative aspect-square rounded-2xl overflow-hidden">
                  <motion.img
                    src={track.artwork} alt={track.title} className="w-full h-full object-cover"
                    animate={isPlaying ? { scale: [1, 1.04, 1] } : { scale: 1 }}
                    transition={isPlaying ? { duration: 8, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.6 }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                </div>

                {/* judul + more */}
                <div className="flex items-start justify-between gap-3 mt-5">
                  <div className="min-w-0">
                    <h3 className="film-title text-white text-xl md:text-2xl leading-tight truncate">{track.title}</h3>
                    <div className="metadata text-white/50 text-[11px] mt-1 truncate">{track.film} • {track.role}</div>
                  </div>
                  <button type="button" aria-label="More options" title="More"
                    className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-colors">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </div>

                {/* progress bar GARIS + knob (seekable) */}
                <div
                  ref={barRef}
                  className="relative py-3 mt-3 cursor-pointer select-none touch-none"
                  onPointerDown={(e) => { setDragging(true); (e.target as HTMLElement).setPointerCapture?.(e.pointerId); seekFromClientX(e.clientX); }}
                  onPointerMove={(e) => { if (dragging) seekFromClientX(e.clientX); }}
                  onPointerUp={() => setDragging(false)}
                  onPointerCancel={() => setDragging(false)}
                >
                  <div className="relative h-1.5 rounded-full bg-white/15">
                    <div className="absolute inset-y-0 left-0 rounded-full" style={{ width: `${progress * 100}%`, background: track.accent, transition: dragging ? 'none' : 'width 0.1s linear' }} />
                    <div className="absolute top-1/2 w-3.5 h-3.5 rounded-full bg-white shadow-[0_2px_8px_rgba(0,0,0,0.5)] -translate-y-1/2 -translate-x-1/2"
                      style={{ left: `${progress * 100}%`, boxShadow: `0 0 10px ${track.accent}` }} />
                  </div>
                </div>
                <div className="flex justify-between metadata text-white/45 text-[10px] tabular-nums -mt-1">
                  <span>{fmt(current)}</span>
                  <span>{fmt(duration)}</span>
                </div>

                {/* kontrol OUTLINE */}
                <div className="flex items-center justify-center gap-4 md:gap-5 mt-5">
                  <button type="button" aria-label="Shuffle" onClick={() => setShuffle((s) => !s)}
                    className={ctrlGhost} style={{ color: shuffle ? track.accent : undefined }}>
                    <Shuffle className="w-[18px] h-[18px]" />
                  </button>
                  <button type="button" aria-label="Previous" onClick={goPrev} className={ctrlGhost}>
                    <SkipBack className="w-5 h-5" fill="currentColor" />
                  </button>
                  <button type="button" aria-label={isPlaying ? 'Pause' : 'Play'} onClick={togglePlay}
                    className="w-16 h-16 rounded-full border flex items-center justify-center text-white hover:bg-white/10 transition-all"
                    style={{ borderColor: 'rgba(255,255,255,0.35)', boxShadow: `0 0 26px -8px ${track.accent}` }}>
                    {isPlaying ? <Pause className="w-6 h-6" fill="white" /> : <Play className="w-6 h-6 ml-1" fill="white" />}
                  </button>
                  <button type="button" aria-label="Next" onClick={goNext} className={ctrlGhost}>
                    <SkipForward className="w-5 h-5" fill="currentColor" />
                  </button>
                  <button type="button" aria-label="Repeat" onClick={cycleRepeat}
                    className={ctrlGhost} style={{ color: repeat !== 'off' ? track.accent : undefined }}>
                    {repeat === 'one' ? <Repeat1 className="w-[18px] h-[18px]" /> : <Repeat className="w-[18px] h-[18px]" />}
                  </button>
                </div>

                {/* add to list */}
                <div className="flex justify-center mt-6">
                  <button type="button" onClick={() => toggleLike(index)}
                    className="liquid-glass-badge metadata flex items-center gap-2 px-4 py-2 rounded-full text-[11px] transition-colors"
                    style={{ color: isLiked(index) ? track.accent : 'rgba(255,255,255,0.8)' }}>
                    {isLiked(index) ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                    {isLiked(index) ? 'Added to List' : 'Add to List'}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>

      {/* audio engine */}
      <audio
        ref={audioRef}
        src={track.audio}
        preload="metadata"
        onTimeUpdate={(e) => { const a = e.currentTarget; setCurrent(a.currentTime); if (a.duration) setProgress(a.currentTime / a.duration); }}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={onEnded}
        onError={() => console.warn('[AudioWorks] gagal muat audio:', track.audio)}
      />
    </section>
  );
}