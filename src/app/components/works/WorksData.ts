import { shortFilms } from './shortFilms';
import { commercials } from './commercials';
import { personalProjects } from './personalProjects';
import { musicVideos } from './musicVideos';
import { photos } from './photos';
import { audioTracks } from './audioTracks';
import type { Project, MVWork, Photo, AudioTrack, FilterId, SortMode } from './types';

export const allFilms: Project[] = [...shortFilms, ...commercials, ...personalProjects];
export const photosWithImage: Photo[] = photos.filter((p) => p.image && p.image.trim() !== '');

export function getProjectById(id: number): Project | undefined {
    return allFilms.find((p) => p.id === id);
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