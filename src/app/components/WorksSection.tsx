import { useMemo, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { BentoSelector } from './works/ui';
import { shortFilms } from './works/shortFilms';
import { commercials } from './works/commercials';
import { personalProjects } from './works/personalProjects';
import { photos } from './works/photos';
import { audioTracks } from './works/audioTracks';
import type { Project, Photo, FilterId } from './works/types';
import { FILTERS, FILTER_SLUG } from './works/types';
import { getList, uniqImgs } from './works/data';

const allFilms: Project[] = [...shortFilms, ...commercials, ...personalProjects];
const photosWithImage: Photo[] = photos.filter((p) => p.image && p.image.trim() !== '');

export function WorksSection() {
	const navigate = useNavigate();
	const [nonce, setNonce] = useState(0);

	useEffect(() => {
		setNonce((Math.random() * 1e9) | 0);
	}, []);

	const countFor = (id: FilterId) => {
		const l = getList(id);
		return l.films.length + l.credits.length + l.photos.length + l.audio.length;
	};

	const pools = useMemo<Partial<Record<FilterId, string[]>>>(
		() => ({
			all: Array.from(
				new Set([
					...uniqImgs(allFilms),
					...uniqImgs(photosWithImage),
					...audioTracks.map((a) => a.artwork).filter(Boolean),
				])
			),
			featured: uniqImgs(allFilms.filter((p) => p.isFeatured)),
			'Short Film': uniqImgs(shortFilms),
			commercial: uniqImgs(commercials),
			photography: uniqImgs(photosWithImage),
			audio: Array.from(new Set(audioTracks.map((a) => a.artwork).filter(Boolean))),
			'Personal Projects': uniqImgs(personalProjects),
		}),
		[]
	);

	return (
		<section id="filmography-section" className="py-24 px-4 relative overflow-hidden">
			<div className="max-w-7xl mx-auto relative z-10">
				<div className="text-center mb-10">
					<h2 className="section-title mb-4 text-white">Selected Works</h2>
					<p className="body-text text-white/50 max-w-2xl mx-auto text-sm">
						Tap a world to explore — {countFor('all')} works across {FILTERS.length - 1} categories
					</p>
				</div>
				<BentoSelector
					onSelect={(id: FilterId) => navigate(`/works/${FILTER_SLUG[id]}`)}
					countFor={countFor}
					pools={pools}
					nonce={nonce}
				/>
			</div>
		</section>
	);
}