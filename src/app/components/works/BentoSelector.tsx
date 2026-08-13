'use client';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import { FILTERS, FILTER_SLUG } from './types';
import type { FilterId } from './types';
import { categoryPalette } from './palette';

export { SortControl, CreditCard, EmptyState, PhotoCard, AudioList } from './cards';

interface BentoSelectorProps {
    onSelect?: (id: FilterId) => void;
    countFor: (id: FilterId) => number;
    pools: Partial<Record<FilterId, string[]>>;
    nonce: number;
}

export function BentoSelector({ onSelect, countFor, pools, nonce }: BentoSelectorProps) {
    const navigate = useNavigate();
    return (
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 md:gap-5 max-w-6xl mx-auto">
            {FILTERS.map((f, i) => {
                const pal = categoryPalette[f.id];
                const count = countFor(f.id);
                const Icon = pal.icon;
                const pool = pools[f.id] || [];
                const bgImg = pool.length > 0 ? pool[(nonce + i) % pool.length] : undefined;

                return (
                    <motion.button
                        key={f.id}
                        type="button"
                        onClick={() => {
                            if (onSelect) onSelect(f.id);
                            navigate(`/works/${FILTER_SLUG[f.id]}`);
                        }}
                        whileHover={{ scale: 1.02, y: -4 }}
                        whileTap={{ scale: 0.98 }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: i * 0.05 }}
                        className={`group relative overflow-hidden rounded-3xl p-6 text-left flex flex-col justify-between min-h-[180px] md:min-h-[220px] cursor-pointer ${pal.spanClass}`}
                        style={{
                            background: pal.base,
                            boxShadow: `0 10px 30px -10px ${pal.accent}33, inset 0 1px 0 rgba(255,255,255,0.25)`,
                        }}
                    >
                        {/* Background Image / Texture overlay */}
                        {bgImg ? (
                            <div aria-hidden className="absolute inset-0 z-0">
                                <img src={bgImg} alt="" className="w-full h-full object-cover opacity-25 group-hover:opacity-40 transition-opacity duration-500 group-hover:scale-105" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                            </div>
                        ) : (
                            <div aria-hidden className="absolute inset-0 z-0 opacity-20" style={{ backgroundImage: pal.texture, backgroundSize: pal.textureSize }} />
                        )}

                        {/* Glow effect */}
                        <div aria-hidden className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ background: pal.glow }} />

                        {/* Header icon & badge */}
                        <div className="relative z-10 flex items-center justify-between">
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl flex items-center justify-center text-white" style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.2)' }}>
                                <Icon className="w-5 h-5 md:w-6 md:h-6" />
                            </div>
                            <span className="metadata text-xs px-3 py-1 rounded-full text-white/80" style={{ background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(6px)', border: '1px solid rgba(255,255,255,0.15)' }}>
                                {count} karya
                            </span>
                        </div>

                        {/* Bottom Label */}
                        <div className="relative z-10 mt-auto">
                            <h3 className="film-title text-white text-lg md:text-2xl font-bold group-hover:translate-x-1 transition-transform duration-300">
                                {f.label}
                            </h3>
                        </div>
                    </motion.button>
                );
            })}
        </div>
    );
}