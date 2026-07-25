import { motion } from 'motion/react';
import { useEffect, useState } from 'react';

/* =====================================================================
   PALET (tetap, sesuai referensi lu):
   Catalina #032C7D · Absolute #0841C9 · Button #1D97F1 ·
   Cetacean #020D2F (base) · Vodka #C7C7F2 (cahaya)
   + aksen hangat SAMAR (peach) → set WARM 0 kalau mau murni biru.
   ===================================================================== */
const WARM = 0.20;

const baseStyle = { background: 'linear-gradient(160deg, #020D2F 0%, #031a4d 48%, #020D2F 100%)' } as const;

// Medan warna RAKSASA (inset -70% = 240% viewport) → saat drift+rotate, tepinya
// MENYAPU melintasi layar = rasa "mengalir fullscreen", bukan wobble di pojok.
const fieldA = `radial-gradient(58% 54% at 30% 32%, rgba(3,44,125,0.95), transparent 62%),
                radial-gradient(54% 50% at 72% 70%, rgba(8,65,201,0.9), transparent 62%)`;
const fieldB = `radial-gradient(56% 52% at 74% 26%, rgba(29,151,241,0.85), transparent 60%),
                radial-gradient(50% 46% at 26% 76%, rgba(199,199,242,0.52), transparent 58%)`;
const fieldC = `radial-gradient(42% 40% at 54% 48%, rgba(255,150,90,${WARM}), transparent 60%),
                radial-gradient(38% 36% at 84% 84%, rgba(255,170,110,${WARM * 0.7}), transparent 60%)`;

// ARUS KONSTAN — pita biru↔vodka yang jalan SEARAH terus (linear, bukan mirror) =
// rasa aliran yang gak pernah "balik". Periodik (stop 0 == stop 100) → seamless.
const FLOW = `linear-gradient(95deg,
  transparent 0%, rgba(29,151,241,0.42) 18%, transparent 36%,
  rgba(199,199,242,0.40) 54%, transparent 72%, rgba(8,65,201,0.40) 90%, transparent 100%)`;

// VODKA light lintas (3, jalur & durasi beda, coverage luas → gak "mentok tengah")
const vodkaLights = [
  { w: '92vw', h: '70vw', rot: -14, blur: 72, x: ['-60%', '150%'], y: ['-10%', '22%'], dur: 13, delay: 0 },
  { w: '72vw', h: '94vw', rot: 18, blur: 86, x: ['140%', '-60%'], y: ['12%', '-16%'], dur: 17, delay: -6 },
  { w: '60vw', h: '60vw', rot: -30, blur: 64, x: ['-50%', '130%'], y: ['40%', '-26%'], dur: 11, delay: -3 },
];
const VODKA = `radial-gradient(circle at 50% 50%, rgba(199,199,242,0.6) 0%, rgba(150,170,242,0.26) 42%, transparent 70%)`;

const GRAIN =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";

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
  const activeLights = isMobile ? vodkaLights.slice(0, 2) : vodkaLights;

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {/* keyframes arus konstan (self-contained, gak nyentuh globals) */}
      <style>{`@keyframes lg-flow{0%{background-position:0% 50%}100%{background-position:200% 50%}}`}</style>

      {/* base dalam */}
      <div className="absolute inset-0" style={baseStyle} />

      {/* Medan A — biru dalam, drift JAUH + rotate pelan (arah 1) */}
      <motion.div
        className="absolute"
        style={{ inset: '-70%', background: fieldA, filter: 'blur(56px)', mixBlendMode: 'screen' }}
        animate={{ x: ['-32%', '34%', '-32%'], y: ['-24%', '28%', '-24%'], rotate: [-9, 9, -9], scale: [1, 1.16, 1] }}
        transition={{ duration: 30, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
      />

      {/* Medan B — biru terang + Vodka, drift lawan + rotate lawan (arah 2) = tabrakan mengalir */}
      <motion.div
        className="absolute"
        style={{ inset: '-70%', background: fieldB, filter: 'blur(62px)', mixBlendMode: 'screen' }}
        animate={{ x: ['36%', '-30%', '36%'], y: ['26%', '-26%', '26%'], rotate: [11, -11, 11], scale: [1.14, 1, 1.14] }}
        transition={{ duration: 36, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
      />

      {/* Medan C — aksen hangat samar, drift diagonal + rotate (arah 3, desktop) */}
      {!isMobile && (
        <motion.div
          className="absolute"
          style={{ inset: '-70%', background: fieldC, filter: 'blur(66px)', mixBlendMode: 'screen' }}
          animate={{ x: ['-28%', '32%', '-28%'], y: ['30%', '-28%', '30%'], rotate: [-7, 13, -7], scale: [1, 1.18, 1] }}
          transition={{ duration: 42, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
        />
      )}

      {/* ARUS KONSTAN — pita ngalir searah terus (linear infinite) = fullscreen flow */}
      <div
        className="absolute"
        style={{
          inset: '-30%',
          background: FLOW,
          backgroundSize: '200% 100%',
          filter: 'blur(54px)',
          mixBlendMode: 'screen',
          opacity: 0.7,
          transform: 'rotate(-8deg)',
          animation: 'lg-flow 22s linear infinite',
        }}
      />

      {/* VODKA light lintas — fade in/out saat lintas = cahaya "lewat" */}
      {activeLights.map((l, i) => (
        <div key={i} className="absolute pointer-events-none" style={{ width: l.w, height: l.h, maxWidth: '1200px', maxHeight: '1200px', top: '50%', left: '50%', transform: `translate(-50%,-50%) rotate(${l.rot}deg)` }}>
          <motion.div
            className="w-full h-full"
            style={{ background: VODKA, filter: `blur(${l.blur}px)`, mixBlendMode: 'screen' }}
            animate={{ x: l.x, y: l.y, opacity: [0, 0.95, 0.95, 0] }}
            transition={{ duration: l.dur, repeat: Infinity, ease: 'easeInOut', delay: l.delay }}
          />
        </div>
      ))}

      {/* grain filmik */}
      <div className="absolute inset-0" style={{ backgroundImage: GRAIN, backgroundSize: '180px 180px', opacity: 0.07, mixBlendMode: 'overlay' }} />

      {/* scrim sangat tipis + vignette lembut (jaga luminous, teks aman via text-shadow) */}
      <div className="absolute inset-0" style={{ background: 'rgba(2,13,47,0.10)' }} />
      <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 50% 45%, transparent 52%, rgba(2,13,47,0.30) 100%)' }} />
    </div>
  );
}