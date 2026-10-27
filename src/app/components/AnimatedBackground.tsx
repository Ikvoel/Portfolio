import { memo } from 'react';

/**
 * STATIC HIGH-PERFORMANCE AESTHETIC BACKDROP
 *
 * 100% Static, 0 animation loops, 0 SVG filter recalculations.
 * Uses GPU-cached layered radial gradients & micro-dither texture
 * for an ultra-premium, cinematic film-look that scrolls at 120fps.
 */
export const AnimatedBackground = memo(function AnimatedBackground({ hue = 0 }: { hue?: number } = {}) {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-0 overflow-hidden pointer-events-none select-none"
      style={hue ? { filter: `hue-rotate(${hue}deg)` } : undefined}
    >
      {/* 1. Deep Midnight Obsidian Base */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(175deg, #020719 0%, #031138 35%, #020A24 70%, #010410 100%)',
        }}
      />

      {/* 2. Top Hero Azure Light Cone */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 90% 60% at 50% -10%, rgba(29, 151, 241, 0.22) 0%, transparent 68%)',
        }}
      />

      {/* 3. Deep Sapphire Resonance Orb (Left Center) */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle 850px at 12% 52%, rgba(8, 65, 201, 0.18) 0%, transparent 65%)',
        }}
      />

      {/* 4. Warm Ruby / Amber Ember Glow (Upper Right) */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle 700px at 88% 22%, rgba(205, 92, 92, 0.13) 0%, transparent 60%)',
        }}
      />

      {/* 5. Violet Twilight Horizon (Lower Right) */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle 800px at 82% 82%, rgba(139, 92, 246, 0.15) 0%, transparent 65%)',
        }}
      />

      {/* 6. Subtle Static Film Texture (Pure CSS dither - 0ms GPU cost, NO SVG filter) */}
      <div
        className="absolute inset-0 opacity-[0.035] mix-blend-overlay"
        style={{
          backgroundImage: `
            radial-gradient(rgba(255, 255, 255, 0.8) 1px, transparent 0),
            radial-gradient(rgba(255, 255, 255, 0.8) 1px, transparent 0)
          `,
          backgroundPosition: '0 0, 2px 2px',
          backgroundSize: '4px 4px',
        }}
      />

      {/* 7. Cinematic Optical Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 100% 100% at 50% 50%, transparent 58%, rgba(1, 4, 14, 0.75) 100%)',
        }}
      />
    </div>
  );
});