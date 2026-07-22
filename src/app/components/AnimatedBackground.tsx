import { motion } from 'motion/react';
import { useEffect, useState } from 'react';

// Mobile: 4 softer bubbles to save battery, but still vibrant
const mobileBubbles = [
  { color: 'rgba(168, 85, 247, 0.45)', size: '60vw', top: '-10%', left: '-10%', blur: 60 },
  { color: 'rgba(6, 182, 212, 0.40)', size: '50vw', top: '40%', right: '-15%', blur: 70 },
  { color: 'rgba(236, 72, 153, 0.40)', size: '55vw', bottom: '-10%', left: '20%', blur: 65 },
  { color: 'rgba(245, 158, 11, 0.35)', size: '45vw', top: '20%', left: '30%', blur: 50 },
];

// Desktop: 6 distinct, highly blurred bubbles that melt into a mesh gradient
const desktopBubbles = [
  {
    // Bubble 1: Vivid Magenta/Pink
    color: 'rgba(236, 72, 153, 0.45)',
    size: '45vw',
    initial: { top: '-10%', left: '-10%' },
    animate: { x: ['0vw', '80vw', '30vw', '0vw'], y: ['0vh', '60vh', '90vh', '0vh'], scale: [1, 1.15, 0.9, 1.05, 1] },
    duration: 26,
    blur: 120,
  },
  {
    // Bubble 2: Electric Cyan/Teal
    color: 'rgba(6, 182, 212, 0.45)',
    size: '50vw',
    initial: { top: '60%', right: '-15%' },
    animate: { x: ['0vw', '-70vw', '-30vw', '0vw'], y: ['0vh', '-50vh', '20vh', '0vh'], scale: [1, 0.9, 1.2, 0.95, 1] },
    duration: 32,
    blur: 140,
  },
  {
    // Bubble 3: Deep Violet/Purple
    color: 'rgba(168, 85, 247, 0.50)',
    size: '55vw',
    initial: { top: '30%', left: '40%' },
    animate: { x: ['0vw', '40vw', '-40vw', '-10vw', '0vw'], y: ['0vh', '-40vh', '30vh', '-20vh', '0vh'], scale: [1, 1.1, 0.85, 1.15, 1] },
    duration: 38,
    blur: 130,
  },
  {
    // Bubble 4: Warm Amber/Orange
    color: 'rgba(245, 158, 11, 0.40)',
    size: '40vw',
    initial: { bottom: '-10%', left: '20%' },
    animate: { x: ['0vw', '50vw', '-20vw', '30vw', '0vw'], y: ['0vh', '-60vh', '-30vh', '20vh', '0vh'], scale: [1, 1.05, 1.2, 0.9, 1] },
    duration: 29,
    blur: 110,
  },
  {
    // Bubble 5: Neon Emerald/Green
    color: 'rgba(16, 185, 129, 0.35)',
    size: '35vw',
    initial: { top: '10%', right: '20%' },
    animate: { x: ['0vw', '-40vw', '20vw', '-10vw', '0vw'], y: ['0vh', '50vh', '20vh', '70vh', '0vh'], scale: [1, 0.95, 1.1, 0.9, 1] },
    duration: 35,
    blur: 100,
  },
  {
    // Bubble 6: Bright Indigo/Blue
    color: 'rgba(99, 102, 241, 0.45)',
    size: '48vw',
    initial: { bottom: '10%', right: '30%' },
    animate: { x: ['0vw', '-50vw', '30vw', '60vw', '0vw'], y: ['0vh', '-30vh', '-60vh', '10vh', '0vh'], scale: [1, 1.1, 0.95, 1.05, 1] },
    duration: 42,
    blur: 125,
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
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-[#050505]">
        {mobileBubbles.map((bubble, index) => (
          <motion.div
            key={index}
            className="absolute rounded-full"
            style={{
              width: bubble.size,
              height: bubble.size,
              background: `radial-gradient(circle at center, ${bubble.color} 0%, transparent 70%)`,
              filter: `blur(${bubble.blur}px)`,
              mixBlendMode: 'screen',
              ...bubble,
            }}
            animate={{
              x: [0, 30, -20, 0],
              y: [0, -20, 30, 0],
              scale: [1, 1.1, 0.95, 1],
            }}
            transition={{
              duration: 15 + index * 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
        {/* Soft vignette */}
        <div className="absolute inset-0 opacity-60" style={{ background: 'radial-gradient(circle at center, transparent 0%, rgba(0, 0, 0, 0.7) 100%)' }} />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none bg-[#050505]">
      {/* The Bubble Mesh Gradient Layer */}
      {desktopBubbles.map((bubble, index) => (
        <motion.div
          key={index}
          className="absolute rounded-full"
          style={{
            width: bubble.size,
            height: bubble.size,
            background: `radial-gradient(circle at center, ${bubble.color} 0%, transparent 70%)`,
            filter: `blur(${bubble.blur}px)`,
            mixBlendMode: 'screen', // Crucial for melting the colors together
            ...bubble.initial,
          }}
          animate={bubble.animate}
          transition={{
            duration: bubble.duration,
            repeat: Infinity,
            ease: 'easeInOut', // Smooth, organic floating motion
          }}
        />
      ))}

      {/* Ambient global glow to tie the mesh together */}
      <motion.div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(168, 85, 247, 0.3) 0%, transparent 60%)',
          mixBlendMode: 'screen',
        }}
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Dark vignette to frame the vibrant center */}
      <div
        className="absolute inset-0 opacity-70 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at center, transparent 20%, rgba(5, 5, 5, 0.8) 100%)',
        }}
      />
    </div>
  );
}