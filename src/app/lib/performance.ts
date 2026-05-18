/**
 * PERFORMANCE & RESPONSIVE OPTIMIZATIONS
 * 
 * This utility provides hooks and helpers for:
 * - Detecting device capabilities
 * - Adjusting blur intensity based on device
 * - Responsive animation configurations
 */

import { useEffect, useState } from 'react';

export function useDeviceCapabilities() {
  const [capabilities, setCapabilities] = useState({
    isMobile: false,
    isLowPower: false,
    prefersReducedMotion: false,
    blurIntensity: 24,
  });

  useEffect(() => {
    const checkCapabilities = () => {
      const isMobile = window.innerWidth < 768;
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      
      // Adjust blur intensity based on device
      let blurIntensity = 24; // Desktop default
      if (isMobile) {
        blurIntensity = 12; // Reduced for mobile
      }
      if (prefersReducedMotion) {
        blurIntensity = 8; // Minimal for accessibility
      }

      setCapabilities({
        isMobile,
        isLowPower: isMobile, // Assume mobile is lower power
        prefersReducedMotion,
        blurIntensity,
      });
    };

    checkCapabilities();
    window.addEventListener('resize', checkCapabilities);
    
    return () => window.removeEventListener('resize', checkCapabilities);
  }, []);

  return capabilities;
}

// Animation duration multiplier based on device
export function getAnimationDuration(baseDuration: number, isMobile: boolean, prefersReducedMotion: boolean) {
  if (prefersReducedMotion) return 0.01; // Nearly instant
  if (isMobile) return baseDuration * 0.7; // 30% faster on mobile
  return baseDuration;
}

// Responsive blur values
export function getBlurValue(device: 'mobile' | 'tablet' | 'desktop') {
  const blurValues = {
    mobile: 12,
    tablet: 16,
    desktop: 24,
  };
  return blurValues[device];
}
