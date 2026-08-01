import { motion, AnimatePresence, useInView } from 'motion/react';
import { useEffect, useMemo, useRef, useState } from 'react';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import { X } from 'lucide-react';
import { FilmProject } from './FilmProject';
import { AnimatedBackground } from './AnimatedBackground';
import { BentoSelector, CreditCard, EmptyState, SortControl, PhotoCard, AudioList } from './works/ui';
import { categoryPalette } from './works/palette';
import { shortFilms } from './works/shortFilms';
import { commercials } from './works/commercials';
import { personalProjects } from './works/personalProjects';
import { musicVideos } from './works/musicVideos';
import { photos } from './works/photos';
import { audioTracks } from './works/audioTracks';
import type { Project, MVWork, Photo, AudioTrack, FilterId, SortMode } from './works/types';
import { FILTERS } from './works/types';

const allFilms: Project[] = [...shortFilms, ...commercials, ...personalProjects];
const photosWithImage: Photo[] = photos.filter((p) => p.image && p.image.trim() !== '');

const PHOTO_ORDER = ['Commercial', 'Portrait', 'Event', 'Landscape'];
const normCat = (c: string) => (c.trim().toLowerCase() === 'potrait' ? 'Portrait' : c.trim());

interface List { films: Project[]; credits: MVWork[]; photos: Photo[]; audio: AudioTrack[]; }
const EMPTY_LIST: List = { films: [], credits: [], photos: [], audio: [] };
function getList(filter: FilterId): List {
	switch (filter) {
		case 'all': return { films: allFilms, credits: musicVideos, photos: photosWithImage, audio: audioTracks };
		case 'featured': return { ...EMPTY_LIST, films: allFilms.filter((p) => p.isFeatured) };
		case 'Short Film': return { ...EMPTY_LIST, films: shortFilms };
		case 'commercial': return { films: commercials, credits: musicVideos, photos: [], audio: [] };
		case 'photography': return { ...EMPTY_LIST, photos: photosWithImage };
		case 'audio': return { ...EMPTY_LIST, audio: audioTracks };
		case 'Personal Projects': return { ...EMPTY_LIST, films: personalProjects };
		default: return EMPTY_LIST;
	}
}
const byYear = <T extends { year: string }>(arr: T[], mode: SortMode): T[] =>
	[...arr].sort((a, b) => (mode === 'newest' ? b.year.localeCompare(a.year) : a.year.localeCompare(b.year)));

const uniqImgs = (arr: { image?: string }[]) => Array.from(new Set(arr.map((x) => x.image).filter((s): s is string => !!s && s.trim() !== '')));

function CategoryModal({ filterId, sort, setSort, onClose }: { filterId: FilterId; sort: SortMode; setSort: (s: SortMode) => void; onClose: () => void }) {
	const { films, credits, photos, audio } = getList(filterId);
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

	// scroll-lock save/restore (aman nesting sama VideoModal) + ESC
	useEffect(() => {
		const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
		const prevOverflow = document.body.style.overflow;
		document.body.style.overflow = 'hidden';
		document.addEventListener('keydown', onKey);
		return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = prevOverflow; };
	}, [onClose]);

	const pal = categoryPalette[filterId];
	const label = FILTERS.find((f) => f.id === filterId)?.label ?? '';
	const total = sortedFilms.length + sortedCredits.length + photos.length + sortedAudio.length;
	const showVideo = sortedFilms.length + sortedCredits.length > 0;
	const SectionHead = ({ title }: { title: string }) => (
		<div className="mb-6 flex items-center gap-4"><h3 className="film-title text-2xl md:text-3xl text-white shrink-0">{title}</h3><div className="h-[1px] flex-grow bg-gradient-to-r from-white/20 to-transparent" /></div>
	);

	return (
		<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}
			className="fixed inset-0 z-[9999] overflow-y-auto overscroll-contain">
			{/* background biru yang SAMA + tint accent MURAH (tanpa hue-rotate → gak glitch/berat) */}
			<div aria-hidden className="fixed inset-0 z-0 pointer-events-none">
				<AnimatedBackground />
				<div className="absolute inset-0" style={{ background: 'rgba(2,13,47,0.42)' }} />
				<div className="absolute inset-0" style={{
					background: `radial-gradient(120% 80% at 50% -10%, ${pal.accent}33, transparent 60%), radial-gradient(120% 80% at 50% 110%, ${pal.accent}22, transparent 60%)`,
				}} />
			</div>

			<div className="sticky top-0 z-20 px-4 md:px-8 py-4 md:py-5"
				style={{ background: 'linear-gradient(180deg, rgba(5,7,16,0.85), rgba(5,7,16,0.55))', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderBottom: `1px solid ${pal.accent}44` }}>
				<div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
					<div className="flex items-center gap-3 min-w-0">
						<span className="w-2.5 h-8 rounded-full shrink-0" style={{ background: pal.accent, boxShadow: `0 0 16px ${pal.accent}` }} />
						<div className="min-w-0">
							<h2 className="film-title text-white text-xl md:text-2xl leading-tight truncate">{label}</h2>
							<p className="metadata text-white/55 text-[10px] md:text-[11px] tabular-nums">{total} karya</p>
						</div>
					</div>
					<div className="flex items-center gap-2 shrink-0">
						<SortControl sort={sort} onChange={setSort} />
						<button type="button" onClick={onClose} aria-label="Close" className="w-10 h-10 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 transition-colors" style={{ border: '1px solid rgba(255,255,255,0.2)' }}><X className="w-5 h-5" /></button>
					</div>
				</div>
			</div>

			<div className="relative z-10 max-w-6xl mx-auto px-4 md:px-8 py-8 md:py-12 space-y-16">
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
								{photoGroups.map((g, gi) => (
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
			</div>
		</motion.div>
	);
}

export function Filmography() {
	const ref = useRef<HTMLElement>(null);
	const isInView = useInView(ref, { once: true, amount: 0.1 });
	const [openCat, setOpenCat] = useState<FilterId | null>(null);
	const [sort, setSort] = useState<SortMode>('newest');
	// nonce = "round" foto tile. Di-acak pas load, naik +1 tiap modal ditutup
	// → tiap balik ke selector, semua tile dapet foto baru.
	const [nonce, setNonce] = useState(0);
	useEffect(() => { setNonce((Math.random() * 1e9) | 0); }, []);

	const countFor = (id: FilterId) => { const l = getList(id); return l.films.length + l.credits.length + l.photos.length + l.audio.length; };

	// pool foto per kategori (dedupe) → thumbnail tile; all = gabungan
	const pools = useMemo<Partial<Record<FilterId, string[]>>>(() => ({
		all: Array.from(new Set([...uniqImgs(allFilms), ...uniqImgs(photosWithImage), ...audioTracks.map((a) => a.artwork).filter(Boolean)])),
		featured: uniqImgs(allFilms.filter((p) => p.isFeatured)),
		'Short Film': uniqImgs(shortFilms),
		commercial: uniqImgs(commercials),
		photography: uniqImgs(photosWithImage),
		audio: Array.from(new Set(audioTracks.map((a) => a.artwork).filter(Boolean))),
		'Personal Projects': uniqImgs(personalProjects),
	}), []);

	return (
		<section ref={ref} className="py-24 px-4 relative overflow-hidden">
			<div className="max-w-7xl mx-auto relative z-10">
				<motion.div initial={{ opacity: 0, y: 40 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7 }} className="text-center mb-10">
					<h2 className="section-title mb-4 text-white">Selected Works</h2>
					<p className="body-text text-white/50 max-w-2xl mx-auto text-sm">Tap a world to explore — {countFor('all')} works across {FILTERS.length - 1} categories</p>
				</motion.div>
				<motion.div initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.1 }}>
					<BentoSelector onSelect={setOpenCat} countFor={countFor} pools={pools} nonce={nonce} />
				</motion.div>
			</div>
			<AnimatePresence>
				{openCat && (
					<CategoryModal
						key={openCat}
						filterId={openCat}
						sort={sort}
						setSort={setSort}
						onClose={() => { setOpenCat(null); setNonce((n) => (n + 1) | 0); }}
					/>
				)}
			</AnimatePresence>
		</section>
	);
}