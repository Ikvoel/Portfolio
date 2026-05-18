import { motion } from 'motion/react';
import { useEffect, useState } from 'react';

/**
 * ENHANCED SPECTRAL ANIMATED BACKGROUND
 * 
 * Features:
 * - Slow animated spectral gradients with hue drifting
 * - Gentle noise texture movement
 * - Long-duration transitions (40-60s cycles)
 * - Performance-optimized with limited blur layers
 * - Environmental mood without distraction
 */

export function AnimatedBackground() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {/* Base layer - Deep black foundation */}
      <div className="absolute inset-0 bg-black" />
      
      {/* Spectral Gradient Orb 1 - Purple to Violet (Top-Left) */}
      <motion.div
        className="absolute rounded-full opacity-50"
        style={{
          width: '70vw',
          height: '70vw',
          maxWidth: '900px',
          maxHeight: '900px',
          background: 'radial-gradient(circle at center, rgba(147, 51, 234, 0.35) 0%, rgba(139, 92, 246, 0.22) 30%, rgba(168, 85, 247, 0.12) 50%, transparent 70%)',
          filter: 'blur(80px)',
          top: '-15%',
          left: '-15%',
        }}
        animate={{
          x: [0, 80, -40, 60, 0],
          y: [0, 100, -50, 80, 0],
          scale: [1, 1.15, 0.9, 1.08, 1],
          opacity: [0.4, 0.5, 0.35, 0.45, 0.4],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: [0.45, 0.05, 0.55, 0.95], // Smooth in-out easing
        }}
      />

      {/* Spectral Gradient Orb 2 - Blue to Cyan (Top-Right) */}
      <motion.div
        className="absolute rounded-full opacity-50"
        style={{
          width: '65vw',
          height: '65vw',
          maxWidth: '850px',
          maxHeight: '850px',
          background: 'radial-gradient(circle at center, rgba(59, 130, 246, 0.32) 0%, rgba(6, 182, 212, 0.20) 30%, rgba(56, 189, 248, 0.10) 50%, transparent 70%)',
          filter: 'blur(80px)',
          top: '5%',
          right: '-10%',
        }}
        animate={{
          x: [0, -60, 50, -40, 0],
          y: [0, 120, -70, 90, 0],
          scale: [1, 1.2, 0.85, 1.12, 1],
          opacity: [0.35, 0.45, 0.28, 0.38, 0.35],
        }}
        transition={{
          duration: 13,
          repeat: Infinity,
          ease: [0.45, 0.05, 0.55, 0.95],
        }}
      />

      {/* Spectral Gradient Orb 3 - Amber to Orange (Bottom-Left) */}
      <motion.div
        className="absolute rounded-full opacity-50"
        style={{
          width: '60vw',
          height: '60vw',
          maxWidth: '800px',
          maxHeight: '800px',
          background: 'radial-gradient(circle at center, rgba(245, 158, 11, 0.28) 0%, rgba(249, 115, 22, 0.18) 30%, rgba(251, 146, 60, 0.08) 50%, transparent 70%)',
          filter: 'blur(80px)',
          bottom: '0%',
          left: '15%',
        }}
        animate={{
          x: [0, 90, -60, 70, 0],
          y: [0, -100, 60, -80, 0],
          scale: [1, 1.1, 1.15, 0.98, 1],
          opacity: [0.3, 0.4, 0.25, 0.35, 0.3],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: [0.45, 0.05, 0.55, 0.95],
        }}
      />

      {/* Spectral Gradient Orb 4 - Emerald to Teal (Bottom-Right) */}
      <motion.div
        className="absolute rounded-full opacity-32"
        style={{
          width: '55vw',
          height: '55vw',
          maxWidth: '750px',
          maxHeight: '750px',
          background: 'radial-gradient(circle at center, rgba(16, 185, 129, 0.3) 0%, rgba(20, 184, 166, 0.20) 30%, rgba(34, 197, 94, 0.10) 50%, transparent 70%)',
          filter: 'blur(80px)',
          bottom: '15%',
          right: '5%',
        }}
        animate={{
          x: [0, -50, 70, -35, 0],
          y: [0, -90, 50, -70, 0],
          scale: [1, 1.18, 0.95, 1.1, 1],
          opacity: [0.32, 0.42, 0.26, 0.36, 0.32],
        }}
        transition={{
          duration: 48,
          repeat: Infinity,
          ease: [0.45, 0.05, 0.55, 0.95],
        }}
      />

      {/* Spectral Gradient Orb 5 - Pink to Fuchsia (Center) */}
      <motion.div
        className="absolute rounded-full opacity-28"
        style={{
          width: '50vw',
          height: '50vw',
          maxWidth: '700px',
          maxHeight: '700px',
          background: 'radial-gradient(circle at center, rgba(236, 72, 153, 0.28) 0%, rgba(217, 70, 239, 0.18) 30%, rgba(244, 114, 182, 0.08) 50%, transparent 70%)',
          filter: 'blur(80px)',
          top: '35%',
          left: '40%',
        }}
        animate={{
          x: [0, -70, 60, -50, 0],
          y: [0, 110, -80, 95, 0],
          scale: [1, 1.12, 1.05, 0.96, 1],
          opacity: [0.28, 0.38, 0.22, 0.32, 0.28],
        }}
        transition={{
          duration: 52,
          repeat: Infinity,
          ease: [0.45, 0.05, 0.55, 0.95],
        }}
      />

      {/* Soft blending layer - creates color harmony */}
      <div 
        className="absolute inset-0 opacity-40"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(88, 28, 135, 0.08) 0%, transparent 50%)',
          mixBlendMode: 'soft-light',
        }}
      />

      {/* Animated film grain texture overlay with gentle movement */}
      <motion.div 
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='3.5' numOctaves='5' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '400px 400px',
        }}
        animate={{
          backgroundPosition: ['0px 0px', '400px 400px', '0px 0px'],
        }}
        transition={{
          duration: 120,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      {/* Subtle vignette for depth */}
      <div 
        className="absolute inset-0 opacity-60"
        style={{
          background: 'radial-gradient(circle at center, transparent 0%, rgba(0, 0, 0, 0.4) 100%)',
        }}
      />
    </div>
  );
}