import { motion } from 'motion/react';
import { useEffect, useState } from 'react';

const mobileBackground =
  'radial-gradient(circle at 20% 10%, rgba(147, 51, 234, 0.18), transparent 36%), radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.14), transparent 34%), radial-gradient(circle at 50% 90%, rgba(245, 158, 11, 0.10), transparent 38%)';

const desktopOrbs = [
  {
    style: {
      width: '58vw',
      height: '58vw',
      maxWidth: '720px',
      maxHeight: '720px',
      background:
        'radial-gradient(circle at center, rgba(147, 51, 234, 0.24) 0%, rgba(139, 92, 246, 0.14) 36%, transparent 68%)',
      filter: 'blur(36px)',
      top: '-14%',
      left: '-12%',
    },
    animate: {
      x: [0, 36, -18, 0],
      y: [0, 48, -20, 0],
      scale: [1, 1.08, 0.96, 1],
      opacity: [0.36, 0.46, 0.32, 0.36],
    },
    duration: 34,
  },
  {
    style: {
      width: '54vw',
      height: '54vw',
      maxWidth: '680px',
      maxHeight: '680px',
      background:
        'radial-gradient(circle at center, rgba(59, 130, 246, 0.22) 0%, rgba(6, 182, 212, 0.13) 34%, transparent 68%)',
      filter: 'blur(36px)',
      top: '8%',
      right: '-12%',
    },
    animate: {
      x: [0, -30, 24, 0],
      y: [0, 42, -26, 0],
      scale: [1, 1.1, 0.95, 1],
      opacity: [0.3, 0.4, 0.26, 0.3],
    },
    duration: 42,
  },
  {
    style: {
      width: '52vw',
      height: '52vw',
      maxWidth: '660px',
      maxHeight: '660px',
      background:
        'radial-gradient(circle at center, rgba(245, 158, 11, 0.18) 0%, rgba(249, 115, 22, 0.10) 34%, transparent 68%)',
      filter: 'blur(34px)',
      bottom: '-8%',
      left: '22%',
    },
    animate: {
      x: [0, 38, -28, 0],
      y: [0, -36, 24, 0],
      scale: [1, 1.06, 1.12, 1],
      opacity: [0.24, 0.32, 0.22, 0.24],
    },
    duration: 50,
  },
];

export function AnimatedBackground() {
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setMounted(true);

    const mediaQuery = window.matchMedia('(max-width: 767px)');
    const updateIsMobile = () => setIsMobile(mediaQuery.matches);

    updateIsMobile();
    mediaQuery.addEventListener('change', updateIsMobile);

    return () => mediaQuery.removeEventListener('change', updateIsMobile);
  }, []);

  if (!mounted) return null;

  if (isMobile) {
    return (
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-black" />
        <div className="absolute inset-0 opacity-70" style={{ background: mobileBackground }} />
        <div
          className="absolute inset-0 opacity-70"
          style={{
            background: 'radial-gradient(circle at center, transparent 0%, rgba(0, 0, 0, 0.45) 100%)',
          }}
        />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-black" />

      {desktopOrbs.map((orb, index) => (
        <motion.div
          key={index}
          className="absolute rounded-full"
          style={orb.style}
          animate={orb.animate}
          transition={{
            duration: orb.duration,
            repeat: Infinity,
            ease: [0.45, 0.05, 0.55, 0.95],
          }}
        />
      ))}

      <div
        className="absolute inset-0 opacity-30"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(88, 28, 135, 0.08) 0%, transparent 50%)',
          mixBlendMode: 'soft-light',
        }}
      />

      <div
        className="absolute inset-0 opacity-60"
        style={{
          background: 'radial-gradient(circle at center, transparent 0%, rgba(0, 0, 0, 0.42) 100%)',
        }}
      />
    </div>
  );
}