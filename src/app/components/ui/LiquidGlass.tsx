import React, { useRef, useEffect, useState, useId } from 'react';

export interface LiquidGlassProps {
  children?: React.ReactNode;
  displacementScale?: number;
  blurAmount?: number;
  saturation?: number;
  aberrationIntensity?: number;
  elasticity?: number;
  cornerRadius?: number | string;
  className?: string;
  padding?: string;
  style?: React.CSSProperties;
  overLight?: boolean;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  mouseContainer?: React.RefObject<HTMLElement | null> | null;
  mode?: "standard" | "polar" | "prominent" | "shader";
  globalMousePos?: { x: number; y: number };
  mouseOffset?: { x: number; y: number };
}

export function LiquidGlass({
  children,
  displacementScale = 70,
  blurAmount = 0.0625,
  saturation = 140,
  aberrationIntensity = 2,
  elasticity = 0.15,
  cornerRadius = 999,
  className = "",
  padding,
  style = {},
  overLight = false,
  onClick,
  mouseContainer = null,
  mode = "standard",
  globalMousePos,
  mouseOffset = { x: 0, y: 0 },
}: LiquidGlassProps) {
  const glassRef = useRef<HTMLDivElement>(null);
  const filterId = useId().replace(/:/g, '');

  // Mouse position tracking with elastic lerp
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [targetPos, setTargetPos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  // Track mouse on container or glass component
  useEffect(() => {
    const targetElement = mouseContainer?.current || glassRef.current;
    if (!targetElement) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = targetElement.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      setTargetPos({ x: x + mouseOffset.x, y: y + mouseOffset.y });
    };

    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => {
      setIsHovered(false);
      setTargetPos({ x: 0, y: 0 });
    };

    targetElement.addEventListener('mousemove', handleMouseMove);
    targetElement.addEventListener('mouseenter', handleMouseEnter);
    targetElement.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      targetElement.removeEventListener('mousemove', handleMouseMove);
      targetElement.removeEventListener('mouseenter', handleMouseEnter);
      targetElement.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [mouseContainer, mouseOffset]);

  // Global mouse position override
  useEffect(() => {
    if (globalMousePos) {
      setTargetPos(globalMousePos);
    }
  }, [globalMousePos]);

  // Smooth elastic physics interpolation
  useEffect(() => {
    let animFrame: number;
    const lerpSpeed = Math.min(Math.max(elasticity, 0.01), 0.8);

    const animate = () => {
      setMousePos((prev) => ({
        x: prev.x + (targetPos.x - prev.x) * lerpSpeed,
        y: prev.y + (targetPos.y - prev.y) * lerpSpeed,
      }));
      animFrame = requestAnimationFrame(animate);
    };

    animFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animFrame);
  }, [targetPos, elasticity]);

  // Refraction mode multipliers
  let modeMultiplier = 1;
  if (mode === "polar") modeMultiplier = 1.4;
  if (mode === "prominent") modeMultiplier = 1.8;
  if (mode === "shader") modeMultiplier = 2.2;

  const currentDisplacement = displacementScale * modeMultiplier;
  const currentBlur = blurAmount * 400; // Map blurAmount (0.0625 -> ~25px blur)

  // Chromatic aberration split (RGB rim displacement)
  const redOffset = mousePos.x * aberrationIntensity * 2;
  const blueOffset = -mousePos.x * aberrationIntensity * 2;
  const chromaShadow = `${redOffset}px 0px ${aberrationIntensity * 3}px rgba(255, 0, 80, 0.25), ${blueOffset}px 0px ${aberrationIntensity * 3}px rgba(0, 200, 255, 0.25)`;

  // Light angle calculation based on mouse vector
  const highlightAngle = Math.atan2(mousePos.y, mousePos.x) * (180 / Math.PI) + 90;
  const lightGradient = overLight
    ? `linear-gradient(${highlightAngle}deg, rgba(0, 0, 0, 0.15) 0%, rgba(0, 0, 0, 0.03) 60%, rgba(255, 255, 255, 0.4) 100%)`
    : `linear-gradient(${highlightAngle}deg, rgba(255, 255, 255, 0.35) 0%, rgba(255, 255, 255, 0.05) 50%, rgba(255, 255, 255, 0.15) 100%)`;

  const borderStyle = overLight
    ? `1px solid rgba(0, 0, 0, 0.12)`
    : `1px solid rgba(255, 255, 255, 0.18)`;

  return (
    <div
      ref={glassRef}
      onClick={onClick}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      className={`relative inline-flex items-center justify-center transition-transform duration-300 ease-out select-none ${className}`}
      style={{
        padding,
        borderRadius: typeof cornerRadius === 'number' ? `${cornerRadius}px` : cornerRadius,
        transform: `perspective(1000px) rotateX(${-mousePos.y * 6}deg) rotateY(${mousePos.x * 6}deg) translateZ(0) ${
          isPressed ? 'scale(0.97)' : isHovered ? 'scale(1.02)' : 'scale(1)'
        }`,
        cursor: onClick ? 'pointer' : 'default',
        ...style,
      }}
    >
      {/* SVG Displacement Filter for realistic refraction & bending */}
      <svg className="absolute w-0 h-0 pointer-events-none" aria-hidden="true">
        <defs>
          <filter id={`liquid-glass-filter-${filterId}`}>
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.015"
              numOctaves="2"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale={currentDisplacement * 0.2}
              xChannelSelector="R"
              yChannelSelector="G"
              result="displaced"
            />
          </filter>
        </defs>
      </svg>

      {/* Main Translucent Glass Surface Layer */}
      <div
        className="absolute inset-0 rounded-[inherit] pointer-events-none overflow-hidden"
        style={{
          background: overLight
            ? 'linear-gradient(135deg, rgba(0, 0, 0, 0.05) 0%, rgba(0, 0, 0, 0.01) 100%)'
            : 'linear-gradient(135deg, rgba(255, 255, 255, 0.09) 0%, rgba(255, 255, 255, 0.02) 50%, rgba(255, 255, 255, 0.06) 100%)',
          backdropFilter: `blur(${currentBlur}px) saturate(${saturation}%)`,
          WebkitBackdropFilter: `blur(${currentBlur}px) saturate(${saturation}%)`,
          border: borderStyle,
          boxShadow: `
            inset 0 1px 1.5px 0 ${overLight ? 'rgba(255, 255, 255, 0.6)' : 'rgba(255, 255, 255, 0.35)'},
            inset 0 -1px 1px 0 rgba(0, 0, 0, 0.35),
            ${chromaShadow},
            0 16px 36px -10px rgba(0, 0, 0, 0.5)
          `,
          transition: 'box-shadow 0.3s ease, border-color 0.3s ease',
        }}
      />

      {/* Light Reflection Layer */}
      <div
        className="absolute inset-0 rounded-[inherit] pointer-events-none transition-opacity duration-500"
        style={{
          background: lightGradient,
          opacity: isHovered ? 0.9 : 0.5,
          mixBlendMode: 'overlay',
        }}
      />

      {/* Children Content */}
      <div className="relative z-10 w-full h-full flex items-center justify-center">
        {children}
      </div>
    </div>
  );
}

export default LiquidGlass;
