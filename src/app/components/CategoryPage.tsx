'use client';
import { motion, AnimatePresence } from 'motion/react';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import { ArrowLeft } from 'lucide-react';
import { FilmProject } from './FilmProject';
import { AnimatedBackground } from './AnimatedBackground';
import { SortControl, CreditCard, EmptyState, PhotoCard, AudioList } from './works/cards';
import { categoryPalette } from './works/palette';
import { getList, byYear, normCat, PHOTO_ORDER } from './works/data';
import { FILTERS, SLUG_FILTER } from './works/types';
import type { FilterId, SortMode, Photo } from './works/types';

export function CategoryPage() {
    const navigate = useNavigate();
    const params = useParams<{ cat: string }>();
    const filterId: FilterId | undefined = params.cat ? SLUG_FILTER[params.cat] : undefined;

    // kalau slug gak valid, redirect ke home
    useEffect(() => {
        if (!filterId) navigate('/', { replace: true });
    }, [filterId, navigate]);

    const [sort, setSort] = useState<SortMode>('newest');
    const { films, credits, photos, audio } = filterId ? getList(filterId) : { films: [], credits: [], photos: [], audio: [] };
    const sortedFilms = byYear(films, sort);
    const sortedCredits = byYear(credits, sort);
    const sortedAudio = byYear(audio, sort);
    const isAll = filterId === 'all';

    const photoGroups = useMemo(() => {
        const map = new Map<string, Photo[]>();
        for (const p of photos) { const name = normCat(p.category); if (!map.has(name)) map.set(name, []); map.get(name)!.push(p); }
        const names = Array.from(map.keys()).sort((a, b) => {
            const ia = PHOTO_ORDER.indexOf(a), ib = PHOTO_ORDER.indexOf(b);
            const sa = ia === -1 ? 999 : ia, sb = ib === -1 ? 999 : ib;
            if (sa !== sb) return sa - sb; return a.localeCompare(b);
        });
        return names.map((name) => ({ name, items: byYear(map.get(name)!, sort) }));
    }, [photos, sort]);

    // ESC = balik
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') navigate(-1 as any); };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [navigate]);

    const pal = filterId ? categoryPalette[filterId] : categoryPalette.all;
    const label = filterId ? (FILTERS.find((f) => f.id === filterId)?.label ?? '') : '';
    const total = sortedFilms.length + sortedCredits.length + photos.length + sortedAudio.length;
    const showVideo = sortedFilms.length + sortedCredits.length > 0;
    const SectionHead = ({ title }: { title: string }) => (
        <div className="mb-6 flex items-center gap-4"><h3 className="film-title text-2xl md:text-3xl text-white shrink-0">{title}</h3><div className="h-[1px] flex-grow bg-gradient-to-r from-white/20 to-transparent" /></div>
    );

    // kalau filterId gak valid, render kosong sambil nunggu redirect
    if (!filterId) return null;

    return (
        <section className="relative min-h-screen overflow-hidden">
            <div aria-hidden className="fixed inset-0 z-0 pointer-events-none">
                <AnimatedBackground />
                <div className="absolute inset-0" style={{ background: 'rgba(2,13,47,0.42)' }} />
                <div className="absolute inset-0" style={{
                    background: `radial-gradient(120% 80% at 50% -10%, ${pal.accent}33, transparent 60%), radial-gradient(120% 80% at 50% 110%, ${pal.accent}22, transparent 60%)`,
                }} />
            </div>

            <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
                className="sticky top-0 z-20 px-4 md:px-8 py-4 md:py-5"
                style={{ background: 'linear-gradient(180deg, rgba(5,7,16,0.85), rgba(5,7,16,0.55))', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderBottom: `1px solid ${pal.accent}44` }}>
                <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                        <button type="button" onClick={() => navigate(-1 as any)} aria-label="Back"
                            className="w-10 h-10 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 transition-colors shrink-0"
                            style={{ border: '1px solid rgba(255,255,255,0.2)' }}>
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <span className="w-2.5 h-8 rounded-full shrink-0" style={{ background: pal.accent, boxShadow: `0 0 16px ${pal.accent}` }} />
                        <div className="min-w-0">
                            <h1 className="film-title text-white text-xl md:text-2xl leading-tight truncate">{label}</h1>
                            <p className="metadata text-white/55 text-[10px] md:text-[11px] tabular-nums">{total} karya</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                        <SortControl sort={sort} onChange={setSort} />
                    </div>
                </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.05 }}
                className="relative z-10 max-w-6xl mx-auto px-4 md:px-8 py-8 md:py-12 space-y-16">
                {total === 0 ? <EmptyState filter={filterId} /> : (
                    <>
                        {showVideo && (
                            <section>
                                {isAll && <SectionHead title="Films & Music Videos" />}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                                    <AnimatePresence mode="popLayout">
                                        {sortedFilms.map((p, i) => (
                                            <motion.div key={`film-${p.category}-${p.id}`} layout initial={{ opacity: 0, scale: 0.96, y: 12 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.35, delay: Math.min(i * 0.03, 0.18) }} className={p.category === 'Short Film' ? 'md:col-span-2' : ''}>
                                                <FilmProject project={p} index={i} isInView={true} />
                                            </motion.div>
                                        ))}
                                        {sortedCredits.map((w, i) => (
                                            <motion.div key={`mv-${w.category}-${w.id}`} layout initial={{ opacity: 0, scale: 0.96, y: 12 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.35, delay: Math.min((sortedFilms.length + i) * 0.03, 0.18) }}>
                                                <CreditCard work={w} />
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>
                            </section>
                        )}
                        {photos.length > 0 && (
                            <section>
                                {isAll && <SectionHead title="Photography" />}
                                {photoGroups.map((g) => (
                                    <div key={g.name} className="mb-12 last:mb-0">
                                        {!isAll && photoGroups.length > 1 && (
                                            <div className="mb-5 flex items-center gap-4"><h4 className="film-title text-lg md:text-xl text-white/90 shrink-0">{g.name}</h4><span className="metadata text-white/40 text-[10px] tabular-nums">{g.items.length}</span><div className="h-[1px] flex-grow bg-gradient-to-r from-white/15 to-transparent" /></div>
                                        )}
                                        <ResponsiveMasonry columnsCountBreakPoints={{ 350: 2, 900: 3, 1200: 4 }}>
                                            <Masonry gutter="1rem">
                                                {g.items.map((photo, i) => (
                                                    <div key={`photo-${g.name}-${photo.id}-${i}`}>
                                                        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: Math.min(i * 0.03, 0.2) }}><PhotoCard photo={photo} /></motion.div>
                                                    </div>
                                                ))}
                                            </Masonry>
                                        </ResponsiveMasonry>
                                    </div>
                                ))}
                            </section>
                        )}
                        {sortedAudio.length > 0 && (
                            <section>
                                {isAll && <SectionHead title="Audio Works" />}
                                <AudioList tracks={sortedAudio} />
                            </section>
                        )}
                    </>
                )}
            </motion.div>
        </section>
    );
}