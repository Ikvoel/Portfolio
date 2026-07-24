import { motion } from 'motion/react';
import { useEffect, useState } from 'react';

// Base spectral — dalam & jenuh (biar blob terang = kontras tinggi = kaca kebaca)
const MESH = `
  radial-gradient(60% 50% at 20% 25%, rgba(124,58,237,0.9), transparent 60%),
  radial-gradient(55% 45% at 80% 20%, rgba(236,72,153,0.82), transparent 60%),
  radial-gradient(60% 55% at 75% 80%, rgba(6,182,212,0.82), transparent 62%),
  radial-gradient(55% 50% at 25% 85%, rgba(249,115,22,0.72), transparent 60%),
  radial-gradient(50% 40% at 50% 50%, rgba(16,185,129,0.4), transparent 60%),
  linear-gradient(135deg, #160c30 0%, #06141f 50%, #220a29 100%)
`;

// Blob warna — blur SEDANG (bukan raksasa) biar ada "edge" yang bisa dibiaskan kaca; GERAK CEPET
const blobs = [
  { pos: { top: '-18%', left: '-12%' }, size: '70vw', bg: 'radial-gradient(circle at 40% 40%, rgba(236,72,153,0.7), transparent 62%)', blur: 70, x: ['-10%', '26%', '-20%', '10%', '-10%'], y: ['-6%', '18%', '-14%', '10%', '-6%'], s: [1, 1.25, 0.9, 1.1, 1], hue: [0, 45, 0], dur: 15 },
  { pos: { top: '-8%', right: '-14%' }, size: '66vw', bg: 'radial-gradient(circle at 60% 30%, rgba(6,182,212,0.65), transparent 62%)', blur: 80, x: ['8%', '-26%', '16%', '-12%', '8%'], y: ['6%', '-20%', '14%', '-10%', '6%'], s: [1, 0.85, 1.2, 0.95, 1], hue: [0, -40, 0], dur: 18 },
  { pos: { bottom: '-20%', left: '-8%' }, size: '68vw', bg: 'radial-gradient(circle at 30% 70%, rgba(124,58,237,0.7), transparent 62%)', blur: 75, x: ['-8%', '20%', '-16%', '14%', '-8%'], y: ['8%', '-22%', '10%', '-16%', '8%'], s: [1, 1.15, 0.92, 1.1, 1], hue: [0, 35, 0], dur: 16 },
  { pos: { bottom: '-12%', right: '-10%' }, size: '62vw', bg: 'radial-gradient(circle at 70% 60%, rgba(249,115,22,0.6), transparent 62%)', blur: 70, x: ['8%', '-18%', '22%', '-14%', '8%'], y: ['-10%', '16%', '-18%', '10%', '-10%'], s: [1, 0.9, 1.18, 0.95, 1], hue: [0, -30, 0], dur: 20 },
];

// "CAHAYA TERANG" yang lewat = kunci biar refraksi kaca KELIHATAN (kayak blob putih di video)
const lights = [
  { pos: { top: '-25%', left: '-20%' }, size: '55vw', x: ['-15%', '70%', '-10%'], y: ['0%', '40%', '10%'], dur: 11 },
  { pos: { bottom: '-25%', right: '-20%' }, size: '50vw', x: ['15%', '-65%', '10%'], y: ['0%', '-35%', '-5%'], dur: 13 },
];
const lightBg = 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.5) 0%, rgba(225,232,255,0.2) 38%, transparent 68%)';

const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

export function AnimatedBackground() {
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setMounted(true);
    const mq = window.matchMedia('(max-width: 767px)');
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  if (!mounted) return null;
  const activeBlobs = isMobile ? blobs.slice(0, 2) : blobs;
  const activeLights = isMobile ? lights.slice(0, 1) : lights;

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {/* SVG LENS FILTER — dipakai dock FilmProject via filter: url(#liquid-glass-disp) */}
      <svg width="0" height="0" className="absolute" aria-hidden>
        <defs>
          <filter id="liquid-glass-disp" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.012 0.016" numOctaves={2} seed={11} result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale={28} xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>

      {/* 1) spectral mesh — mengalir + hue-shift */}
      <motion.div
        className="absolute"
        style={{ inset: '-25%', background: MESH, filter: 'blur(20px)' }}
        animate={{
          x: ['-6%', '9%', '-6%'], y: ['-5%', '8%', '-5%'], scale: [1, 1.12, 1],
          filter: ['blur(20px) hue-rotate(0deg)', 'blur(20px) hue-rotate(30deg)', 'blur(20px) hue-rotate(0deg)'],
        }}
        transition={{ duration: 22, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
      />

      {/* 2) blob warna (blur sedang, gerak cepet) */}
      {activeBlobs.map((b, i) => (
        <div key={`b${i}`} className="absolute pointer-events-none" style={{ width: b.size, height: b.size, maxWidth: '1000px', maxHeight: '1000px', ...b.pos }}>
          <motion.div
            className="w-full h-full"
            style={{ background: b.bg, filter: `blur(${b.blur}px)`, mixBlendMode: 'screen' }}
            animate={{ x: b.x, y: b.y, scale: b.s, filter: b.hue.map((h) => `blur(${b.blur}px) hue-rotate(${h}deg)`) }}
            transition={{ duration: b.dur, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut', delay: i * -3 }}
          />
        </div>
      ))}

      {/* 3) CAHAYA TERANG lewat (screen) — bikin refraksi kaca "nyala" */}
      {activeLights.map((l, i) => (
        <div key={`l${i}`} className="absolute pointer-events-none" style={{ width: l.size, height: l.size, maxWidth: '800px', maxHeight: '800px', ...l.pos }}>
          <motion.div
            className="w-full h-full"
            style={{ background: lightBg, filter: 'blur(60px)', mixBlendMode: 'screen' }}
            animate={{ x: l.x, y: l.y, opacity: [0.5, 0.95, 0.5] }}
            transition={{ duration: l.dur, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut', delay: i * -5 }}
          />
        </div>
      ))}

      {/* 4) grain filmik */}
      <div className="absolute inset-0" style={{ backgroundImage: GRAIN, backgroundSize: '160px 160px', opacity: 0.06, mixBlendMode: 'overlay' }} />

      {/* 5) scrim TIPIS (jaga teks putih) + vignette lembut */}
      <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.16)' }} />
      <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 50% 45%, transparent 42%, rgba(8,5,16,0.42) 100%)' }} />
    </div>
  );
}