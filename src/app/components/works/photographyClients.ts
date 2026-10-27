import masnoLogo from '@/assets/images/logo/masno.png';
import bplogo from '@/assets/images/logo/bplogo.png';

export interface PhotographyPhoto {
  id: string | number;
  indexStr: string;
  title: string;
  caption?: string;
  image: string;
  aspectRatio?: 'landscape' | 'portrait' | 'square' | 'wide';
  year?: string;
}

export interface PhotographyClient {
  id: string;
  slug: string;
  name: string;
  client: string;
  category: 'Commercial' | 'Event';
  year: string;
  description: string;
  location?: string;
  roles: string[];
  logo: string;
  logoFilter?: string;
  logoTile?: 'glass' | 'white' | 'none';
  accentColor: string;
  glowColor: string;
  photos: PhotographyPhoto[];
}

export const photographyClients: PhotographyClient[] = [
  {
    id: 'boiling-point',
    slug: 'boiling-point',
    name: 'Boiling Point',
    client: 'Boiling Point Specialty Coffee',
    category: 'Commercial',
    year: '2024',
    description: 'Specialty coffee roasting, espresso extraction, and raw atmospheric moments captured with rich dark cinematic tones.',
    location: 'Jakarta, Indonesia',
    roles: ['Commercial Photography', 'Visual Direction', 'Color Grading'],
    logo: bplogo,
    logoTile: 'glass',
    accentColor: '#E03E3E',
    glowColor: 'rgba(224, 62, 62, 0.55)',
    photos: [
      {
        id: 'bp-01',
        indexStr: '[01]',
        title: 'TAP & TASTE',
        caption: 'Capturing raw texture and crema depth at the espresso bar.',
        image: 'https://i.ibb.co.com/bgDKXMjp/S3-N0-LOG-8.jpg',
        year: '2024',
      },
      {
        id: 'bp-02',
        indexStr: '[02]',
        title: 'ESPRESSO EXTRACTION',
        caption: 'High-speed capture of single origin espresso extraction.',
        image: 'https://i.ibb.co.com/RF2ShDQ/S3-N0-LOG-62.png',
        year: '2024',
      },
      {
        id: 'bp-03',
        indexStr: '[03]',
        title: 'BAR COUNTER LIGHTS',
        caption: 'Moody amber highlights across stainless steel counters.',
        image: 'https://i.ibb.co.com/zVDp0Vw0/S3-N0-LOG-19.jpg',
        year: '2024',
      },
      {
        id: 'bp-04',
        indexStr: '[04]',
        title: 'ROAST PROFILE STUDY',
        caption: 'Minimalist product framing emphasizing roast character.',
        image: 'https://i.ibb.co.com/j9FSjz8x/S3-N0-LOG-7.jpg',
        year: '2024',
      },
      {
        id: 'bp-05',
        indexStr: '[05]',
        title: 'STEAM & TEXTURE',
        caption: 'Steam wand detail and micro-foam velocity.',
        image: 'https://i.ibb.co.com/23JsYKKB/S3-N0-LOG-14-of-14.jpg',
        year: '2024',
      },
      {
        id: 'bp-06',
        indexStr: '[06]',
        title: 'SIGNATURE CRAFT',
        caption: 'Signature pour and glass service presentation.',
        image: 'https://i.ibb.co.com/TB6YvmR4/S3-N0-LOG-50.jpg',
        year: '2024',
      },
      {
        id: 'bp-07',
        indexStr: '[07]',
        title: 'OPENING ATMOSPHERE',
        caption: 'Warm customer welcome and roastery ambiance.',
        image: 'https://i.ibb.co.com/vCD0WKhP/S3-N0-LOG-7.jpg',
        year: '2024',
      },
    ],
  },
  {
    id: 'titik-nyeduh',
    slug: 'titik-nyeduh',
    name: 'Titik Nyeduh Coffee Roaster',
    client: 'TNCR Roastery',
    category: 'Commercial',
    year: '2023 - 2024',
    description: 'Editorial and commercial campaign highlighting single origin beans, manual brew rituals, and precision packaging.',
    location: 'Bandung, Indonesia',
    roles: ['Commercial Photography', 'Product Stills', 'Art Direction'],
    logo: 'https://i.ibb.co.com/zWtyqvY8/LOGO-TN-PANJANG.png',
    logoFilter: 'brightness(0) invert(1)',
    logoTile: 'glass',
    accentColor: '#D97706',
    glowColor: 'rgba(217, 119, 6, 0.55)',
    photos: [
      {
        id: 'tn-01',
        indexStr: '[01]',
        title: 'PINK BOURBON PROMO',
        caption: 'Las Flores Pink Bourbon single origin feature packaging.',
        image: 'https://i.ibb.co.com/M53Q4YH3/S3-N0-LOG-23.jpg',
        year: '2023',
      },
      {
        id: 'tn-02',
        indexStr: '[02]',
        title: 'LATTE ART PRECISION',
        caption: 'Free-pour tulip definition in fine porcelain.',
        image: 'https://i.ibb.co.com/9HpST4jD/LRM-20230609-143215.jpg',
        year: '2023',
      },
      {
        id: 'tn-03',
        indexStr: '[03]',
        title: 'LAS FLORES PACKAGING',
        caption: 'Clean studio framing with vibrant typographic identity.',
        image: 'https://i.ibb.co.com/m5NdKsXJ/las-flores.png',
        year: '2024',
      },
      {
        id: 'tn-04',
        indexStr: '[04]',
        title: 'KERINCI BEANS STILL',
        caption: 'Sunlit bean inspection and tactile roast evaluation.',
        image: 'https://i.ibb.co.com/Jw55CwfL/Still-2025-12-31-190923-1-59-1.jpg',
        year: '2024',
      },
      {
        id: 'tn-05',
        indexStr: '[05]',
        title: 'BREW DETAIL & FOCUS',
        caption: 'V60 spiral pour capture with high shutter clarity.',
        image: 'https://i.ibb.co.com/m5bRMvqB/Still-2025-12-31-190923-1-58-2.jpg',
        year: '2024',
      },
      {
        id: 'tn-06',
        indexStr: '[06]',
        title: 'ROASTERY SELECTION',
        caption: 'Cupping table layout and green bean curation.',
        image: 'https://i.ibb.co.com/RF2ShDQ/S3-N0-LOG-62.png',
        year: '2024',
      },
    ],
  },
  {
    id: 'masno',
    slug: 'masno',
    name: 'Masno Milk & Coffee',
    client: 'Masno',
    category: 'Commercial',
    year: '2024',
    description: 'Vibrant modern product photography and lifestyle series crafted for bottled milk & espresso blends.',
    location: 'Jakarta, Indonesia',
    roles: ['Commercial Photography', 'Styling', 'Color Grading'],
    logo: masnoLogo,
    logoTile: 'glass',
    accentColor: '#38BDF8',
    glowColor: 'rgba(56, 189, 248, 0.55)',
    photos: [
      {
        id: 'mas-01',
        indexStr: '[01]',
        title: 'HERO BOTTLE CAMPAIGN',
        caption: 'Minimalist brand presentation with high contrast pastel palettes.',
        image: 'https://i.ibb.co.com/WWByV8dr/Artboard-3-6.png',
        year: '2024',
      },
      {
        id: 'mas-02',
        indexStr: '[02]',
        title: 'STUDIO LIGHTING STUDY',
        caption: 'Controlled studio gradients and reflective product highlights.',
        image: 'https://i.ibb.co.com/1JfWkQYV/DSC00495.jpg',
        year: '2024',
      },
      {
        id: 'mas-03',
        indexStr: '[03]',
        title: 'MORNING COMPANION',
        caption: 'Lifestyle composition exploring everyday coffee culture.',
        image: 'https://i.ibb.co.com/93qzCY2N/snolog-5.jpg',
        year: '2024',
      },
      {
        id: 'mas-04',
        indexStr: '[04]',
        title: 'COLD BREW TEXTURE',
        caption: 'Micro bubbles and chilled glass condensation.',
        image: 'https://i.ibb.co.com/bgDKXMjp/S3-N0-LOG-8.jpg',
        year: '2024',
      },
      {
        id: 'mas-05',
        indexStr: '[05]',
        title: 'PORTRAIT PROFILE',
        caption: 'Lifestyle portrait integrated into the brand lookbook.',
        image: 'https://i.ibb.co.com/V0RhGpnq/S3-N0-LOG-20.jpg',
        year: '2024',
      },
    ],
  },
  {
    id: 'barudi-kopi',
    slug: 'barudi-kopi',
    name: 'Barudi Kopi',
    client: 'Barudi Kopi Roastery',
    category: 'Commercial',
    year: '2024',
    description: 'Visual storytelling highlighting Ethiopia bean origins, cupping sessions, and warm roastery ambiance.',
    location: 'Bandung, Indonesia',
    roles: ['Product Photography', 'Visual Documentation'],
    logo: 'https://i.ibb.co.com/j9jkg7mc/398356684-869857444729875-8285982511605298589-n.jpg',
    logoTile: 'glass',
    accentColor: '#EAB308',
    glowColor: 'rgba(234, 179, 8, 0.55)',
    photos: [
      {
        id: 'bar-01',
        indexStr: '[01]',
        title: 'ETHIOPIA SINGLE ORIGIN',
        caption: 'Natural processed Ethiopian bean profile promotional still.',
        image: 'https://i.ibb.co.com/RpbF3DVP/Still-2025-12-31-190923-1-60-2.jpg',
        year: '2024',
      },
      {
        id: 'bar-02',
        indexStr: '[02]',
        title: 'ROASTERY SHADOWS',
        caption: 'Architectural geometry and atmospheric afternoon beams.',
        image: 'https://i.ibb.co.com/93qzCY2N/snolog-5.jpg',
        year: '2024',
      },
      {
        id: 'bar-03',
        indexStr: '[03]',
        title: 'CUPPING EVALUATION',
        caption: 'Aroma assessment and sensory protocol still.',
        image: 'https://i.ibb.co.com/1JfWkQYV/DSC00495.jpg',
        year: '2024',
      },
      {
        id: 'bar-04',
        indexStr: '[04]',
        title: 'ARTISAN EXTRACTION',
        caption: 'Barista focus and flow control on custom gear.',
        image: 'https://i.ibb.co.com/zVDp0Vw0/S3-N0-LOG-19.jpg',
        year: '2024',
      },
      {
        id: 'bar-05',
        indexStr: '[05]',
        title: 'ROAST PROFILE STUDY',
        caption: 'Color analysis and tactile bean evaluation.',
        image: 'https://i.ibb.co.com/j9FSjz8x/S3-N0-LOG-7.jpg',
        year: '2024',
      },
    ],
  },
  {
    id: 'cotta-haus',
    slug: 'cotta-haus',
    name: 'Cotta Haus Live Sessions',
    client: 'Cotta Haus',
    category: 'Event',
    year: '2023',
    description: 'Intimate concert documentation featuring live acoustic sets by Kadapi Fadli and Geisha under stage glow.',
    location: 'Jakarta, Indonesia',
    roles: ['Event Photography', 'Concert Documentation', 'Low-Light Specialist'],
    logo: 'https://i.ibb.co.com/4wTwGFXM/285585428-3228664694043171-7124190617216898503-n.jpg',
    logoTile: 'glass',
    accentColor: '#8B5CF6',
    glowColor: 'rgba(139, 92, 246, 0.55)',
    photos: [
      {
        id: 'cot-01',
        indexStr: '[01]',
        title: 'KADAPI FADLI ON STAGE',
        caption: 'Solo acoustic performance capturing acoustic guitar harmonics.',
        image: 'https://i.ibb.co.com/DDtnS1Xr/S3-N0-LOG-27.jpg',
        year: '2023',
      },
      {
        id: 'cot-02',
        indexStr: '[02]',
        title: 'GEISHA ACOUSTIC SET',
        caption: 'Vocal warmth under filtered stage gels.',
        image: 'https://i.ibb.co.com/ZR6fDRG0/S3-N0-LOG-69.jpg',
        year: '2023',
      },
      {
        id: 'cot-03',
        indexStr: '[03]',
        title: 'AUDIENCE VIBES',
        caption: 'Packed house immersed in acoustic melodies.',
        image: 'https://i.ibb.co.com/bRqchrDx/S3-N0-LOG-287.jpg',
        year: '2023',
      },
      {
        id: 'cot-04',
        indexStr: '[04]',
        title: 'INTIMATE RESONANCE',
        caption: 'Candid musician interaction between songs.',
        image: 'https://i.ibb.co.com/rKc2SJBF/S3-N0-LOG-33.jpg',
        year: '2023',
      },
      {
        id: 'cot-05',
        indexStr: '[05]',
        title: 'STAGE HIGHLIGHT',
        caption: 'Dramatic rim-light against acoustic strings.',
        image: 'https://i.ibb.co.com/bj1VjhX4/S3-N0-LOG-12.jpg',
        year: '2023',
      },
    ],
  },
  {
    id: 'bernadya',
    slug: 'bernadya',
    name: 'Bernadya Live Concert',
    client: 'Bernadya Live Archive',
    category: 'Event',
    year: '2024',
    description: 'Stage and festival photography capturing poignant, raw emotional moments during Bernadya live performances.',
    location: 'Jakarta, Indonesia',
    roles: ['Concert Photographer', 'Festival Coverage'],
    logo: 'https://i.ibb.co.com/G48sf2NH/S3-N0-LOG-382.jpg',
    logoTile: 'glass',
    accentColor: '#F43F5E',
    glowColor: 'rgba(244, 63, 94, 0.55)',
    photos: [
      {
        id: 'ber-01',
        indexStr: '[01]',
        title: 'CAPTURING BERNADYA',
        caption: 'Center-stage vocal delivery with dramatic rear keylight.',
        image: 'https://i.ibb.co.com/G48sf2NH/S3-N0-LOG-382.jpg',
        year: '2024',
      },
      {
        id: 'ber-02',
        indexStr: '[02]',
        title: 'STAGE SPOTLIGHT',
        caption: 'Monochromatic beam slicing through festival haze.',
        image: 'https://i.ibb.co.com/0R8vVq6g/S3-N0-LOG-2.jpg',
        year: '2024',
      },
      {
        id: 'ber-03',
        indexStr: '[03]',
        title: 'CHORUS MOMENTUM',
        caption: 'Peak emotional chorus and microphone technique.',
        image: 'https://i.ibb.co.com/Q3R5QZFM/S3-N0-LOG-2.jpg',
        year: '2024',
      },
      {
        id: 'ber-04',
        indexStr: '[04]',
        title: 'BACKSTAGE ATMOSPHERE',
        caption: 'Quiet pre-show tuning moments in the green room.',
        image: 'https://i.ibb.co.com/bj1VjhX4/S3-N0-LOG-12.jpg',
        year: '2024',
      },
    ],
  },
];

export function getPhotographyClient(slug: string): PhotographyClient | undefined {
  const cleanSlug = slug.toLowerCase().trim();
  return photographyClients.find(
    (c) => c.slug.toLowerCase() === cleanSlug || c.id.toLowerCase() === cleanSlug
  );
}

export function getPhotographyClientsByCategory(category: 'Commercial' | 'Event'): PhotographyClient[] {
  return photographyClients.filter((c) => c.category === category);
}
