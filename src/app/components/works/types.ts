export interface Credit { role: string; name: string; }
export interface ClientLogo { name: string; logo: string; hasGlassBadge?: boolean; }

export interface Project {
    id: number;
    title: string;
    category: string;
    year: string;
    description: string;
    image: string;
    videoUrl?: string;
    previewVideoUrl?: string;
    credits: Credit[];
    cinematicStills?: string[];
    clientLogos?: ClientLogo[];
    titleImage?: string;
    isFeatured?: boolean;
}

export interface MVWork {
    id: number;
    client: string;
    role: string;
    year: string;
    category: 'Commercial' | 'Music Video';
    indicator?: boolean;
}

export interface Photo {
    id: number;
    title: string;
    category: string;
    year: string;
    image: string;
    description: string;
}

export interface AudioTrack {
    id: number;
    title: string;
    film: string;
    year: string;
    role: string;
    audio: string;
    artwork: string;
    accent: string;
}

export type SortMode = 'newest' | 'oldest';

export type FilterId =
    | 'all'
    | 'featured'
    | 'Short Film'
    | 'commercial'
    | 'photography'
    | 'audio'
    | 'Personal Projects';

export const FILTERS: { id: FilterId; label: string }[] = [
    { id: 'all', label: 'All Works' },
    { id: 'featured', label: 'Best Works' },
    { id: 'Short Film', label: 'Short Film' },
    { id: 'commercial', label: 'Commercial & MV' },
    { id: 'photography', label: 'Photography' },
    { id: 'audio', label: 'Audio Works' },
    { id: 'Personal Projects', label: 'Personal Projects' },
];

/* ===== slug buat URL route /works/[cat] ===== */
export const FILTER_SLUG: Record<FilterId, string> = {
    all: 'all',
    featured: 'featured',
    'Short Film': 'short-film',
    commercial: 'commercial',
    photography: 'photography',
    audio: 'audio',
    'Personal Projects': 'personal-projects',
};

export const SLUG_FILTER: Record<string, FilterId> = {
    'all': 'all',
    'featured': 'featured',
    'short-film': 'Short Film',
    'commercial': 'commercial',
    'photography': 'photography',
    'audio': 'audio',
    'personal-projects': 'Personal Projects',
};