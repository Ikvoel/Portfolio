import type { Project } from './types';
import logoLaberintoDeIllusione from '@/assets/logo_laberinto_de_illusione.svg';
import aftone from '@/assets/images/logo/aftone.png';
import wawayu from '@/assets/images/logo/wawayu.png';
import mhhsTle from '@/assets/images/cstm-title/mhhsTle.png';
import bamTitle from '@/assets/images/cstm-title/bamTitle.png';
import hsno from '@/assets/images/logo/hsno.png';
import matchaTle from '@/assets/images/cstm-title/matchaTle.png';
import bomTle from '@/assets/images/cstm-title/bomTle.png';
import mhhs3 from '@/assets/images/mhhs/mhhs3.webp';
import mhhs4 from '@/assets/images/mhhs/mhhs4.webp';
import mhhs5 from '@/assets/images/mhhs/mhhs5.webp';
import mhhs6 from '@/assets/images/mhhs/mhhs6.webp';
import mtc1 from '@/assets/images/matcha/mtc1.webp';
import mtc2 from '@/assets/images/matcha/mtc2.webp';
import mtc3 from '@/assets/images/matcha/mtc3.webp';
import mtc4 from '@/assets/images/matcha/mtc4.webp';
import mtc5 from '@/assets/images/matcha/mtc5.webp';
import mtc6 from '@/assets/images/matcha/mtc6.webp';
import bom1 from '@/assets/images/bom/bom1.webp';
import bom2 from '@/assets/images/bom/bom2.webp';
import bom3 from '@/assets/images/bom/bom3.webp';
import bom4 from '@/assets/images/bom/bom4.webp';
import bom5 from '@/assets/images/bom/bom5.webp';
import bam1 from '@/assets/images/bam/bam1.webp';
import bam2 from '@/assets/images/bam/bam2.webp';
import bam3 from '@/assets/images/bam/bam3.webp';
import bam4 from '@/assets/images/bam/bam4.webp';
import bam5 from '@/assets/images/bam/bam5.webp';
import bam6 from '@/assets/images/bam/bam6.webp';
import lale1 from '@/assets/images/laberinto/lale1.webp';
import lale2 from '@/assets/images/laberinto/lale2.webp';
import lale3 from '@/assets/images/laberinto/lale3.webp';
import lale4 from '@/assets/images/laberinto/lale4.webp';
import lale5 from '@/assets/images/laberinto/lale5.webp';
import lale6 from '@/assets/images/laberinto/lale6.webp';
import lale7 from '@/assets/images/laberinto/lale7.webp';

export const shortFilms: Project[] = [
    {
        id: 1, title: 'My Hand, Her Signature', category: 'Short Film', year: '2026', isFeatured: true,
        description: 'A young painter risks losing the most important exhibition of her career as another presence within herself continues to destroy her paintings.',
        image: mhhs3,
        videoUrl: 'https://res.cloudinary.com/asfa6j6o/video/upload/v1784634115/MyHandHerSignature_Trailer_lhj3ob.mp4',
        credits: [
            { role: 'Writer', name: 'Muhammad Nur Husein, Valerianus Alvin Tjuarsa' },
            { role: 'Director', name: 'Valerianus Alvin Tjuarsa' },
            { role: 'Producer', name: 'Daniella Nediva' },
            { role: 'Production Manager', name: 'Miracle Bernadette Louisa Tumion' },
            { role: 'Director of Photography', name: 'Muhammad Nur Husein' },
            { role: 'Production Designer', name: 'Mark Hector Jedidiah' },
            { role: 'Art Director', name: 'Muhammad Farhan Fidaputra' },
            { role: 'Assistant Director', name: 'Alodia Alfreda' },
            { role: 'Gaffer', name: 'Ilham Nouval' },
            { role: 'Sound Recordist', name: 'Farrel Goan Nessel' },
            { role: 'Editor', name: 'Lady Rahma Cantique Kusuma' },
            { role: 'Colorist', name: 'Marcello Hannan' },
            { role: 'Sound Designer', name: 'Frizello Nathanael' },
            { role: 'Composer', name: 'Muhammad Nur Husein' },
        ],
        cinematicStills: [mhhs6, mhhs5, mhhs4],
        clientLogos: [{ name: 'Aftrtone Pictures', logo: aftone, hasGlassBadge: false }],
        titleImage: mhhsTle,
    },
    {
        id: 2, title: 'Matcha', category: 'Short Film', year: '2025', isFeatured: true,
        description: 'In a calm, understated job interview, Gracia is asked about her favorite drink. Her answer, matcha, triggers a series of intimate memories moments, silent laughter, and a presence that once felt close.',
        image: mtc1,
        videoUrl: 'https://www.youtube.com/watch?v=Z9GuYM-cOiM',
        credits: [
            { role: 'Writer & Director', name: 'Muhammad Nur Husein' },
            { role: 'Production Support', name: 'Valerianus Alvin Tjuarsa' },
            { role: 'Talent Support', name: 'Lady Rahma Cantique Kusuma, Rachel Ratu Kiana' },
            { role: 'Cast', name: 'Maeluna Quinteva, Muhammad Farhan, Jose Richie' },
            { role: 'Editor & Colorist', name: 'Muhammad Nur Husein' },
        ],
        cinematicStills: [mtc2, mtc3, mtc4, mtc5, mtc6],
        clientLogos: [{ name: hsno, logo: hsno, hasGlassBadge: false }],
        titleImage: matchaTle,
    },
    {
        id: 3, title: 'Bounce Of Memories', category: 'Short Film', year: '2025', isFeatured: true,
        description: 'A teenager and her mother, trapped in a strained relationship, must confront their emotional distance and find a way to mend what has been broken.',
        image: bom1,
        videoUrl: 'https://drive.google.com/file/d/1I6hRukhDDjFUlhFn0mxOxigfkJa0_tHi/preview',
        credits: [
            { role: 'Writer', name: 'Willeam Hezekiah Gunawan, Allegro Bima Satria, Gianda Emirza Fatir' },
            { role: 'Director', name: 'Alodia Alfreda' },
            { role: 'Producer', name: 'Daniella Nediva' },
            { role: 'Production Manager', name: 'Mark Hector Jedidiah' },
            { role: 'Director of Photography', name: 'Muhammad Nur Husein' },
            { role: 'Art Director', name: 'Lady Rahma Cantique Kusuma' },
            { role: 'Assistant Director', name: 'Valerianus Alvin Tjuarsa' },
            { role: 'Gaffer', name: 'Yansen Jeonardo' },
            { role: 'Sound Recordist', name: 'Hamid' },
            { role: 'Editor', name: 'Miracle Bernadette Louisa Tumion' },
            { role: 'Colorist', name: 'Muhammad Nur Husein' },
            { role: 'Sound Designer', name: 'Muhammad Farhan Fidaputra' },
            { role: 'Composer', name: 'Muhammad Nur Husein' },
        ],
        cinematicStills: [bom2, bom3, bom4, bom1, bom5],
        clientLogos: [{ name: 'Aftertone Pictures', logo: aftone, hasGlassBadge: false }],
        titleImage: bomTle,
    },
    {
        id: 4, title: 'BAM!', category: 'Short Film', year: '2025', isFeatured: true,
        description: 'Left home alone while their parents are away, siblings Rani and Doni clash over an all-in-one universal remote capable of controlling everything in the house.',
        image: bam1,
        videoUrl: 'https://www.dropbox.com/scl/fi/d2agkqspjnpx94buge819/Trailer.mov?rlkey=9fclpkeuyb222an6py9l5krg0&st=0ncp0p0x&raw=1',
        credits: [
            { role: 'Writer', name: 'Valerianus Alvin Tjuarsa' },
            { role: 'Director', name: 'Valerianus Alvin Tjuarsa' },
            { role: 'Producer', name: 'Mark Hector Jedidiah' },
            { role: 'Director of Photography', name: 'Muhammad Nur Husein' },
            { role: 'Art Director', name: 'Lady Rahma Cantique Kusuma' },
            { role: 'Editor', name: 'Miracle Bernadette Louisa Tumion, Muhammad Nur Husein' },
            { role: 'Colorist', name: 'Muhammad Nur Husein' },
            { role: 'Sound Designer', name: 'Muhammad Nur Husein' },
            { role: 'VFX Artist', name: 'Arya Ranu Pani' },
        ],
        cinematicStills: [bam2, bam3, bam4, bam5, bam6],
        clientLogos: [{ name: 'Wawayu Pictures', logo: wawayu, hasGlassBadge: false }],
        titleImage: bamTitle,
    },
    {
        id: 5, title: 'Laberinto De Illusione', category: 'Short Film', year: '2024', isFeatured: true,
        description: 'Lale falls for a virtual girl, but every moment together is just his hallucination.',
        image: lale1,
        videoUrl: 'https://www.dropbox.com/scl/fi/1n5zei328qtahwgyk2p7n/LaberintoDeIllusiuonemp4.mp4?rlkey=0soj8wrgww0lhfh9aa0ceroz4&st=6d6ztjmz&raw=1',
        credits: [
            { role: 'Writer & Director', name: 'Muhammad Nur Husein' },
            { role: 'Director of Photography', name: 'Muhammad Nur Husein' },
            { role: 'Editor', name: 'Muhammad Nur Husein' },
            { role: 'Cast', name: 'Lady Rahma Cantique Kusuma, Bryan Dafaz Junior' },
            { role: 'Production Support', name: 'Valerianus Alvin Tjuarsa' },
        ],
        cinematicStills: [lale2, lale3, lale4, lale5, lale6, lale7],
        clientLogos: [{ name: hsno, logo: hsno, hasGlassBadge: true }],
        titleImage: logoLaberintoDeIllusione,
    },
];