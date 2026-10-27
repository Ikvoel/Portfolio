import { memo } from 'react';
import { useNavigate } from 'react-router';
import { ArrowRight, Layers, Sparkles } from 'lucide-react';
import type { PhotographyClient } from './photographyClients';

interface PhotographyClientBarProps {
  client: PhotographyClient;
}

export const PhotographyClientBar = memo(function PhotographyClientBar({
  client,
}: PhotographyClientBarProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('portfolio_home_scrollY', String(window.scrollY));
      sessionStorage.setItem('portfolio_return_to_bento', 'true');
    }
    navigate(`/works/photography/${client.slug}`);
  };

  const previewPhotos = client.photos.slice(0, 4);

  return (
    <div
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
      className="group relative w-full rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.008] active:scale-[0.99] select-none"
      style={{
        background: 'rgba(5, 10, 24, 0.72)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        boxShadow: `0 14px 40px -12px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.06)`,
      }}
    >
      {/* 1. VIBRANT BLUR COLOR GLOW BEHIND LOGO/TITLE */}
      <div
        aria-hidden
        className="absolute -left-20 -top-28 w-96 md:w-[500px] h-96 md:h-[500px] rounded-full pointer-events-none filter blur-[80px] md:blur-[110px] opacity-65 group-hover:opacity-90 group-hover:scale-125 transition-all duration-700"
        style={{ background: client.glowColor }}
      />

      {/* 2. GRADASI WARNA BLUR MESH: Spreads smoothly across towards the photo thumbnails */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none transition-opacity duration-500"
        style={{
          background: `linear-gradient(90deg, ${client.accentColor}38 0%, ${client.accentColor}18 35%, rgba(6, 12, 28, 0.85) 65%, rgba(4, 8, 20, 0.96) 100%)`,
        }}
      />

      {/* 3. Subtle Liquid Glass Shimmer Highlight */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 70% 60% at 25% 50%, ${client.accentColor}25, transparent 75%)`,
        }}
      />

      {/* MAIN WIDE CONTENT LAYOUT: Full-width spanning without strict cramping */}
      <div className="relative z-10 p-6 md:p-8 lg:p-9 flex flex-col lg:flex-row lg:items-center justify-between gap-6 lg:gap-10 min-h-[170px] md:min-h-[200px]">
        
        {/* LEFT: Client Logo + Expanded Narrative Info */}
        <div className="flex items-start sm:items-center gap-5 md:gap-7 flex-1 min-w-0">
          {/* Logo Tile / Box */}
          <div
            className="w-18 h-18 sm:w-22 sm:h-22 md:w-24 md:h-24 rounded-[10px] flex items-center justify-center p-3.5 sm:p-4 shrink-0 relative overflow-hidden backdrop-blur-md transition-transform duration-500 group-hover:scale-105"
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: `1px solid rgba(255, 255, 255, 0.20)`,
              boxShadow: `0 10px 30px -8px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.25)`,
            }}
          >
            {/* Ambient glow inside logo tile */}
            <div
              className="absolute inset-0 opacity-40 group-hover:opacity-70 transition-opacity duration-500"
              style={{ background: `radial-gradient(circle, ${client.accentColor}, transparent 70%)` }}
            />
            <img
              src={client.logo}
              alt={client.name}
              draggable={false}
              onContextMenu={(e) => e.preventDefault()}
              loading="lazy"
              decoding="async"
              className="max-h-full max-w-full object-contain relative z-10 transition-transform duration-500 group-hover:scale-105 pointer-events-none"
              style={{
                filter: client.logoFilter || 'drop-shadow(0 4px 12px rgba(0,0,0,0.5))',
              }}
            />
          </div>

          {/* Texts & Full Metadata */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2.5 mb-2 flex-wrap">
              <span
                className="text-[10px] md:text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full flex items-center gap-1.5"
                style={{
                  background: `${client.accentColor}25`,
                  color: '#ffffff',
                  border: `1px solid ${client.accentColor}70`,
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full animate-pulse"
                  style={{ background: client.accentColor }}
                />
                {client.category} Photography
              </span>

              <span className="text-white/40 text-xs">•</span>
              <span className="metadata text-white/70 text-xs font-mono">{client.year}</span>
              <span className="text-white/40 text-xs">•</span>
              <span className="metadata text-white/70 text-xs font-mono flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-white/50" />
                {client.photos.length} stills
              </span>
            </div>

            <h3 className="film-title text-2xl sm:text-3xl lg:text-4xl text-white font-black tracking-tight group-hover:text-white transition-colors duration-300">
              {client.name}
            </h3>

            <p className="body-text text-white/75 text-sm md:text-base line-clamp-2 mt-1.5 max-w-2xl lg:max-w-3xl leading-relaxed">
              {client.description}
            </p>

            {/* Quick Roles Badges */}
            <div className="flex items-center gap-2 mt-3 flex-wrap">
              {client.roles.slice(0, 3).map((role, idx) => (
                <span
                  key={idx}
                  className="text-[10px] md:text-[11px] text-white/60 px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10"
                >
                  {role}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT: Wide Panoramic Photo Fan Stack */}
        <div className="flex items-center justify-between lg:justify-end gap-5 shrink-0 pt-2 lg:pt-0">
          <div className="relative flex items-center -space-x-8 sm:-space-x-12 md:-space-x-16 lg:-space-x-20 pr-2">
            {previewPhotos.map((photo, idx) => (
              <div
                key={photo.id}
                className="relative w-22 h-28 sm:w-28 sm:h-36 md:w-36 md:h-44 lg:w-44 lg:h-52 rounded-[8px] overflow-hidden shadow-2xl transition-all duration-500 ease-out group-hover:translate-x-0"
                style={{
                  transform: `rotate(${(idx - 1.5) * 3}deg) translateY(${idx % 2 === 0 ? '0px' : '-6px'})`,
                  border: '1px solid rgba(255, 255, 255, 0.22)',
                  boxShadow: '0 16px 36px -8px rgba(0, 0, 0, 0.8)',
                  zIndex: 10 + idx,
                }}
              >
                <img
                  src={photo.image}
                  alt={photo.title}
                  draggable={false}
                  onContextMenu={(e) => e.preventDefault()}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 pointer-events-none"
                />
                {/* Dark bottom gradient on card */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
                
                {/* Index tag on top corner of thumbnail */}
                <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-black/60 backdrop-blur-sm text-[9px] md:text-[10px] font-mono text-white/80">
                  {photo.indexStr}
                </div>
              </div>
            ))}
          </div>

          {/* Action Explore Button Pill */}
          <div className="flex items-center gap-2 pl-2">
            <div
              className="flex items-center gap-2 px-4 py-2.5 rounded-full text-white font-medium text-xs md:text-sm transition-all duration-300 group-hover:scale-105 shrink-0 backdrop-blur-md"
              style={{
                background: 'rgba(255, 255, 255, 0.12)',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                boxShadow: `0 6px 20px rgba(0, 0, 0, 0.3)`,
              }}
            >
              <span className="hidden sm:inline">Explore Gallery</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </div>
          </div>
        </div>

      </div>

      {/* Border highlight on hover */}
      <div
        className="absolute inset-0 rounded-xl border border-transparent group-hover:border-white/30 transition-colors duration-300 pointer-events-none"
      />
    </div>
  );
});
