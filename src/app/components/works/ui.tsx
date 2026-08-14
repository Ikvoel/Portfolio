import type { CSSProperties } from 'react';
import {
    LayoutGrid, Sparkles, Clapperboard, Megaphone, Camera, Headphones, Heart,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { FILTERS } from './types';
import type { FilterId } from './types';
import { categoryPalette } from './palette';

interface BentoSelectorProps {
    onSelect: (id: FilterId) => void;
    countFor: (id: FilterId) => number;
    pools: Partial<Record<FilterId, string[]>>;
    nonce: number;
}

function hexToRgba(hex: string, a: number): string {
    const h = hex.replace('#', '');
    const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
    const num = parseInt(full, 16);
    const r = (num >> 16) & 255;
    const g = (num >> 8) & 255;
    const b = num & 255;
    return `rgba(${r}, ${g}, ${b}, ${a})`;
}

/* Glow pakai box-shadow (statis, GPU-friendly). NO blur filter, NO keyframes. */
const CSS = `
.bento-glow{
  position:relative; overflow:hidden; border-radius:26px; text-align:left; cursor:pointer;
  transition: transform .35s ease, box-shadow .35s ease;
  box-shadow:
    0 0 0 1px var(--g1),
    0 0 18px var(--g2),
    0 0 55px var(--g3),
    inset 0 0 26px var(--g2),
    inset 0 0 5px var(--g4);
}
.bento-glow:hover{
  transform: translateY(-3px);
  box-shadow:
    0 0 0 1px var(--g4),
    0 0 26px var(--g3),
    0 0 80px var(--g2),
    inset 0 0 34px var(--g3),
    inset 0 0 7px var(--g4);
}
.bento-glow:active{ transform: translateY(-1px) scale(.99); }
.bento-vert{ writing-mode: vertical-rl; transform: rotate(180deg); }
`;

/* BENTO SPANS:
   MOBILE  = grid 2 kolom: full / half+half / full / half+half / full
   DESKTOP = grid 3 kolom: (2+1) / (1+2) / (1+1+1) seperti semula        */
const TILES: { id: FilterId; icon: LucideIcon; span: string; h: string }[] = [
    { id: 'all', icon: LayoutGrid, span: 'col-span-2', h: 'h-36 md:h-52' },
    { id: 'featured', icon: Sparkles, span: 'col-span-1', h: 'h-44 md:h-52' },
    { id: 'Short Film', icon: Clapperboard, span: 'col-span-1', h: 'h-44 md:h-52' },
    { id: 'commercial', icon: Megaphone, span: 'col-span-2', h: 'h-36 md:h-52' },
    { id: 'photography', icon: Camera, span: 'col-span-1', h: 'h-44 md:h-52' },
    { id: 'audio', icon: Headphones, span: 'col-span-1', h: 'h-44 md:h-52' },
    { id: 'Personal Projects', icon: Heart, span: 'col-span-2 md:col-span-1', h: 'h-36 md:h-52' },
];

export function BentoSelector({ onSelect, countFor, pools, nonce }: BentoSelectorProps) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-5">
            <style>{CSS}</style>
            {TILES.map((t, i) => {
                const meta = FILTERS.find((f) => f.id === t.id);
                const accent = categoryPalette[t.id]?.accent ?? '#1d97f1';
                const pool = pools[t.id] ?? [];
                const image = pool.length ? pool[(nonce + i) % pool.length] : undefined;
                const count = countFor(t.id);
                const Icon = t.icon;

                const style = {
                    '--g1': hexToRgba(accent, 0.35),
                    '--g2': hexToRgba(accent, 0.22),
                    '--g3': hexToRgba(accent, 0.14),
                    '--g4': hexToRgba(accent, 0.5),
                    background: `radial-gradient(130% 150% at 18% 0%, ${hexToRgba(accent, 0.3)} 0%, rgba(4,16,48,0.92) 48%, rgba(2,8,28,0.96) 100%)`,
                    border: `1px solid ${hexToRgba(accent, 0.5)}`,
                } as CSSProperties;

                return (
                    <button
                        key={t.id}
                        type="button"
                        onClick={() => onSelect(t.id)}
                        style={style}
                        className={`bento-glow group w-full ${t.h} ${t.span}`}
                    >
                        {/* Thumbnail blend SCREEN — terang ngambang "di atas kaca" */}
                        {image && (
                            <img
                                src={image}
                                alt=""
                                aria-hidden="true"
                                loading="lazy"
                                decoding="async"
                                className="absolute inset-0 h-full w-full object-cover mix-blend-screen opacity-[0.45] saturate-[0.9] pointer-events-none transition-transform duration-700 group-hover:scale-[1.04]"
                            />
                        )}

                        {/* Gradient bawah tipis biar label tetep kebaca */}
                        <div
                            aria-hidden="true"
                            className="absolute inset-0 rounded-[26px] pointer-events-none bg-gradient-to-t from-[#02081c]/70 via-transparent to-transparent"
                        />

                        {/* Rim light atas + vignette sudut */}
                        <div
                            aria-hidden="true"
                            className="absolute inset-0 rounded-[26px] pointer-events-none"
                            style={{
                                background: `linear-gradient(180deg, rgba(255,255,255,0.14) 0%, transparent 22%), linear-gradient(135deg, ${hexToRgba(accent, 0.28)} 0%, transparent 32%, transparent 70%, ${hexToRgba(accent, 0.12)} 100%)`,
                            }}
                        />

                        {/* Vertical count */}
                        <div
                            className="bento-vert absolute left-3 top-3 md:left-4 md:top-4 metadata text-[9px] md:text-[10px] tracking-[0.22em] uppercase"
                            style={{ color: 'rgba(255,255,255,0.6)' }}
                        >
                            {count} KARYA
                        </div>

                        {/* Label bawah */}
                        <div className="absolute left-3 bottom-3 right-3 md:left-4 md:bottom-4 md:right-4 flex items-center gap-2 md:gap-2.5">
                            <Icon className="w-3.5 h-3.5 md:w-4 md:h-4 shrink-0" style={{ color: accent }} />
                            <span className="film-title text-white text-base md:text-xl tracking-wide truncate drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                                {meta?.label ?? t.id}
                            </span>
                        </div>
                    </button>
                );
            })}
        </div>
    );
}