import type { LucideIcon } from 'lucide-react';
import { LayoutGrid, Sparkles, Clapperboard, Megaphone, Camera, Heart, Headphones } from 'lucide-react';
import { FILTERS } from './types';
import type { FilterId } from './types';

export interface TilePalette {
    base: string;
    glow: string;
    texture: string;
    textureSize: string;
    accent: string;
    icon: LucideIcon;
    spanClass: string;
}

const FALLBACK: TilePalette = {
    base: 'linear-gradient(135deg, #2a3a6a 0%, #14203f 100%)',
    glow: 'radial-gradient(circle at 50% 40%, rgba(255,255,255,0.3), transparent 60%)',
    texture: 'radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1.6px)',
    textureSize: '13px 13px',
    accent: '#9fb4ff',
    icon: LayoutGrid,
    spanClass: 'col-span-2 md:col-span-3',
};

const MAP: Partial<Record<FilterId, TilePalette>> = {
    all: {
        base: 'conic-gradient(from 120deg at 32% 30%, #ff5fa2, #ff9d4d, #2bd4c4, #4d7cff, #6d5dfc, #ff5fa2)',
        glow: 'radial-gradient(circle at 50% 40%, rgba(255,255,255,0.55), transparent 62%)',
        texture: 'radial-gradient(rgba(255,255,255,0.10) 1px, transparent 1.6px)',
        textureSize: '13px 13px',
        accent: '#ffffff',
        icon: LayoutGrid,
        spanClass: 'col-span-2 md:col-span-4',
    },
    featured: {
        base: 'linear-gradient(135deg, #ffe9a8 0%, #f4b740 45%, #8a5a12 100%)',
        glow: 'radial-gradient(circle at 30% 25%, rgba(255,255,255,0.7), transparent 60%)',
        texture: 'radial-gradient(rgba(255,255,255,0.55) 1px, transparent 1.8px)',
        textureSize: '15px 15px',
        accent: '#fff3c4',
        icon: Sparkles,
        spanClass: 'col-span-1 md:col-span-2',
    },
    'Short Film': {
        base: 'linear-gradient(135deg, #1d97f1 0%, #0a3d91 60%, #06204f 100%)',
        glow: 'radial-gradient(circle at 70% 30%, rgba(120,210,255,0.6), transparent 60%)',
        texture: 'repeating-linear-gradient(90deg, transparent 0 9px, rgba(255,255,255,0.07) 9px 10px)',
        textureSize: 'auto',
        accent: '#7fd4ff',
        icon: Clapperboard,
        spanClass: 'col-span-1 md:col-span-2',
    },
    commercial: {
        base: 'linear-gradient(135deg, #ffb347 0%, #ff7a18 50%, #7a2e00 100%)',
        glow: 'radial-gradient(circle at 30% 70%, rgba(255,220,150,0.6), transparent 60%)',
        texture:
            'repeating-linear-gradient(90deg, transparent 0 15px, rgba(255,255,255,0.06) 15px 16px), repeating-linear-gradient(0deg, transparent 0 15px, rgba(255,255,255,0.06) 15px 16px)',
        textureSize: 'auto',
        accent: '#ffd9a0',
        icon: Megaphone,
        spanClass: 'col-span-2 md:col-span-4',
    },
    photography: {
        base: 'linear-gradient(135deg, #ff5fa2 0%, #c026d3 55%, #5b1166 100%)',
        glow: 'radial-gradient(circle at 65% 35%, rgba(255,180,230,0.6), transparent 60%)',
        texture: 'radial-gradient(rgba(255,255,255,0.10) 1.5px, transparent 2px)',
        textureSize: '16px 16px',
        accent: '#ffb3e0',
        icon: Camera,
        spanClass: 'col-span-1 md:col-span-2',
    },
    audio: {
        base: 'linear-gradient(135deg, #14b8a6 0%, #06b6d4 45%, #1e3a8a 100%)',
        glow: 'radial-gradient(circle at 30% 30%, rgba(120,255,225,0.55), transparent 60%)',
        texture: 'repeating-linear-gradient(90deg, transparent 0 4px, rgba(255,255,255,0.10) 4px 6px)',
        textureSize: 'auto',
        accent: '#5eead4',
        icon: Headphones,
        spanClass: 'col-span-1 md:col-span-2',
    },
    'Personal Projects': {
        base: 'linear-gradient(135deg, #a855f7 0%, #6d28d9 55%, #2e1065 100%)',
        glow: 'radial-gradient(circle at 35% 65%, rgba(210,170,255,0.6), transparent 60%)',
        texture: 'repeating-linear-gradient(45deg, transparent 0 11px, rgba(255,255,255,0.07) 11px 12px)',
        textureSize: 'auto',
        accent: '#d8b4fe',
        icon: Heart,
        spanClass: 'col-span-2 md:col-span-2',
    },
};

export const categoryPalette: Record<FilterId, TilePalette> = FILTERS.reduce(
    (acc, f) => {
        acc[f.id] = MAP[f.id] ?? FALLBACK;
        return acc;
    },
    {} as Record<FilterId, TilePalette>,
);