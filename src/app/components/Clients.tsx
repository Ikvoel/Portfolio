import type { CSSProperties } from 'react';

/**
 * CONTROL PER LOGO — atur sesuka lo:
 *
 * tile        : 'glass' (default, kaca gelap) | 'white' (kartu putih) | 'none' (tanpa tile)
 * logoFilter  : CSS filter bebas, misal 'brightness(0) invert(1)' buat jadiin putih
 * logoBlend   : mix-blend-mode bebas, misal 'screen' / 'multiply'
 * logoOpacity : 0–1
 *
 * Tips:
 * - Logo PNG transparan teks gelap  → tile 'glass' + logoFilter 'brightness(0) invert(1)'
 * - Logo JPG background putih      → tile 'white' (background nyatu, nggak jadi blok)
 * - Logo warna asli                → tanpa filter apa-apa
 */
interface ClientConfig {
  id: number;
  name: string;
  logo: string;
  tile?: 'glass' | 'white' | 'none';
  logoFilter?: string;
  logoBlend?: CSSProperties['mixBlendMode'];
  logoOpacity?: number;
}

const clients: ClientConfig[] = [
  {
    id: 1,
    name: 'Titik Nyeduh Coffee Roaster',
    logo: 'https://i.ibb.co.com/zWtyqvY8/LOGO-TN-PANJANG.png',
    tile: 'glass',
    logoFilter: 'brightness(0) invert(1)', // PNG transparan → putih bersih
    logoOpacity: 0.92,
  },
  {
    id: 2,
    name: 'Saling Isi',
    logo: 'https://i.ibb.co.com/hF2PG6Gc/413330395-1008333826926655-86655255232090012-n.jpg',
    tile: 'glass', // JPG bg putih → nyatu ke kartu putih
  },
  {
    id: 3,
    name: 'Boiling Point',
    logo: 'https://i.ibb.co.com/L7bvY5M/boiling-point-text-only.png',
    tile: 'glass',
    logoOpacity: 0.92,
  },
  {
    id: 4,
    name: 'Pojok Literacy',
    logo: 'https://i.ibb.co.com/bjFvFG8g/359069562-840759537472164-1015251557489643779-n.jpg',
    tile: 'glass',
  },
  {
    id: 5,
    name: 'Barudi Kopi',
    logo: 'https://i.ibb.co.com/j9jkg7mc/398356684-869857444729875-8285982511605298589-n.jpg',
    tile: 'glass',
  },
  {
    id: 6,
    name: 'Nyala Creative Space',
    logo: 'https://i.ibb.co.com/4wTwGFXM/285585428-3228664694043171-7124190617216898503-n.jpg',
    tile: 'glass',
  },
];

const TILE_STYLES: Record<NonNullable<ClientConfig['tile']>, CSSProperties> = {
  glass: {
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.12)',
    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.15)',
  },
  white: {
    background: '#ffffff',
  },
  none: {
    background: 'transparent',
    border: '1px solid rgba(255,255,255,0.10)',
  },
};

export function Clients() {
  return (
    <section className="py-24 px-4 relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="section-title mb-4 text-white">Collaborations</h2>
          <p className="body-text text-white/50 text-sm">Trusted partners and brands</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-5 max-w-6xl mx-auto">
          {clients.map((c) => (
            <div
              key={c.id}
              title={c.name}
              className="rounded-xl h-32 md:h-36 flex items-center justify-center p-5 md:p-6 transition-transform duration-300 hover:scale-[1.04] cursor-default"
              style={TILE_STYLES[c.tile ?? 'glass']}
            >
              <img
                src={c.logo}
                alt={c.name}
                loading="lazy"
                decoding="async"
                className="max-w-full max-h-14 md:max-h-16 object-contain"
                style={{
                  filter: c.logoFilter,
                  mixBlendMode: c.logoBlend,
                  opacity: c.logoOpacity ?? 1,
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}