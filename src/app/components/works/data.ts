import { shortFilms } from './shortFilms';
import { commercials } from './commercials';
import { personalProjects } from './personalProjects';
import { musicVideos } from './musicVideos';
import { photos } from './photos';
import { audioTracks } from './audioTracks';
import type { Project, MVWork, Photo, AudioTrack, FilterId, SortMode } from './types';
import { slugifyCategory, slugifyProject, normalizeSlug } from './types';

import bbd from '@/assets/images/bbd/bbdhorz.webp';
import bbdTle from '@/assets/images/cstm-title/bbdTle.webp';
import kaiv from '@/assets/images/logo/kaiv.png';

export const featuredFilms: Project[] = [
    {
        id: 6,
        title: 'Blue Before Dawn',
        category: 'Short Film',
        year: 'TBA',
        isFeatured: true,
        status: 'On Development',
        statusColor: 'red',
        description: 'On a quiet beach before sunrise, Julie allows herself to feel something she had long lost.',
        image: bbd,
        videoUrl: 'Not Available',
        credits: [
            { role: 'Director & Writer', name: 'Muhammad Nur Husein' },
            { role: 'Producer', name: 'Nico Bethaven' },
            { role: 'Project Supervisor', name: 'Mia Wong' },
        ],
        cinematicStills: [],
        clientLogos: [{ name: 'Kaiv', logo: kaiv, hasGlassBadge: false }],
        titleImage: bbdTle,
    },
];

export const allFilms: Project[] = [...shortFilms, ...commercials, ...personalProjects];
export const photosWithImage: Photo[] = photos.filter((p) => p.image && p.image.trim() !== '');

export function getProjectById(idOrSlug: number | string, categorySlug?: string): Project | undefined {
    const list = [...featuredFilms, ...allFilms];
    const rawStr = String(idOrSlug).trim();
    const isNum = typeof idOrSlug === 'number' || (/^\d+$/.test(rawStr) && !isNaN(Number(rawStr)));
    const numId = isNum ? Number(rawStr) : NaN;
    const querySlug = rawStr.toLowerCase();
    const cleanQuery = normalizeSlug(querySlug);

    const found = list.find((p) => {
        const matchesCat = !categorySlug || slugifyCategory(p.category) === categorySlug;
        if (!matchesCat) return false;

        if (isNum && p.id === numId) return true;
        if (slugifyProject(p.title) === querySlug) return true;
        if (normalizeSlug(p.title) === cleanQuery) return true;

        return false;
    });

    if (found) return found;

    // Check music videos
    const mv = musicVideos.find((m) => {
        const catSlug = slugifyCategory(m.category);
        const matchesCat = !categorySlug || catSlug === categorySlug || categorySlug === 'commercial';
        if (!matchesCat) return false;
        if (isNum && m.id === numId) return true;
        if (slugifyProject(m.client) === querySlug) return true;
        if (normalizeSlug(m.client) === cleanQuery) return true;
        return false;
    });

    if (mv) {
        return {
            id: mv.id,
            title: mv.client,
            category: mv.category,
            year: mv.year,
            description: `Music Video project: ${mv.client}. Working as ${mv.role}.`,
            image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=1080',
            credits: [{ role: mv.role, name: 'Muhammad Nur Husein' }],
        };
    }

    return undefined;
}

export const PHOTO_ORDER = ['Commercial', 'Portrait', 'Event', 'Landscape'];
export const normCat = (c: string) => (c.trim().toLowerCase() === 'potrait' ? 'Portrait' : c.trim());

interface List { films: Project[]; credits: MVWork[]; photos: Photo[]; audio: AudioTrack[]; }
const EMPTY_LIST: List = { films: [], credits: [], photos: [], audio: [] };

export function getList(filter: FilterId): List {
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

export const byYear = <T extends { year: string }>(arr: T[], mode: SortMode): T[] =>
    [...arr].sort((a, b) => (mode === 'newest' ? b.year.localeCompare(a.year) : a.year.localeCompare(b.year)));

export const uniqImgs = (arr: { image?: string }[]) =>
    Array.from(new Set(arr.map((x) => x.image).filter((s): s is string => !!s && s.trim() !== '')));

export const countFor = (id: FilterId) => {
    const l = getList(id);
    return l.films.length + l.credits.length + l.photos.length + l.audio.length;
};

export const pools: Partial<Record<FilterId, string[]>> = {
    all: Array.from(new Set([...uniqImgs(allFilms), ...uniqImgs(photosWithImage), ...audioTracks.map((a) => a.artwork).filter(Boolean)])),
    featured: uniqImgs(allFilms.filter((p) => p.isFeatured)),
    'Short Film': uniqImgs(shortFilms),
    commercial: uniqImgs(commercials),
    photography: uniqImgs(photosWithImage),
    audio: Array.from(new Set(audioTracks.map((a) => a.artwork).filter(Boolean))),
    'Personal Projects': uniqImgs(personalProjects),
};