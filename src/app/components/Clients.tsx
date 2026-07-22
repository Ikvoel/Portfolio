import { motion } from 'motion/react';
import { useInView } from 'motion/react';
import { useRef, useState } from 'react';

/**
 * CLIENT LOGO CONFIGURATION
 * 
 * Each client logo can be configured with:
 * - name: Client name (used for alt text)
 * - logo: Direct link to logo image (SVG or PNG recommended)
 * - hasGlassBadge: Enable/disable glassmorphism background (true/false)
 * 
 * Logo positioning is controlled by Tailwind classes in the component below.
 */

const clients = [
  {
    id: 1,
    name: 'Titik Nyeduh Coffee Roaster',
    logo: 'https://i.ibb.co.com/zWtyqvY8/LOGO-TN-PANJANG.png',
    hasGlassBadge: true, // ← Toggle glass background on/off
  },
  {
    id: 2,
    name: 'Saling Isi',
    logo: 'https://i.ibb.co.com/hF2PG6Gc/413330395-1008333826926655-86655255232090012-n.jpg',
    hasGlassBadge: true,
  },
  {
    id: 3,
    name: 'Boiling Point',
    logo: 'https://i.ibb.co.com/L7bvY5M/boiling-point-text-only.png',
    hasGlassBadge: true,
  },
  {
    id: 4,
    name: 'Pojok Literacy',
    logo: 'https://i.ibb.co.com/bjFvFG8g/359069562-840759537472164-1015251557489643779-n.jpg',
    hasGlassBadge: true, // No glass background for this logo
  },
  {
    id: 5,
    name: 'Barudi Kopi',
    logo: 'https://i.ibb.co.com/j9jkg7mc/398356684-869857444729875-8285982511605298589-n.jpg',
    hasGlassBadge: true,
  },
  {
    id: 6,
    name: 'Nyala Creative Space',
    logo: 'https://i.ibb.co.com/4wTwGFXM/285585428-3228664694043171-7124190617216898503-n.jpg',
    hasGlassBadge: true,
  },
];

export function Clients() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  return (
    <section ref={ref} className="py-24 px-4 relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9 }}
          className="text-center mb-16"
        >
          {/* Section title - Glamour Absolute font */}
          <h2 className="section-title mb-4 text-white">Collaborations</h2>
          
          {/* Minimal secondary text */}
          <p className="body-text text-white/50 text-sm">
            Trusted partners and brands
          </p>
        </motion.div>

        {/* Horizontal Logo Carousel / Row */}
        <div className="w-full overflow-x-auto pb-8 cursor-grab active:cursor-grabbing" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <div className="flex items-center gap-8 md:gap-16 px-4 md:px-8 w-max mx-auto min-w-full justify-start md:justify-center">
            {clients.map((client, index) => (
              <motion.div
                key={client.id}
                initial={{ opacity: 0, x: 20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="flex-shrink-0"
                onMouseEnter={() => setHoveredId(client.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <motion.div
                  className={`relative w-40 md:w-56 h-24 flex items-center justify-center p-4 rounded-xl transition-all duration-300 ${
                    client.hasGlassBadge ? 'liquid-glass-card' : ''
                  }`}
                  whileHover={{ scale: 1.05, y: -2 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <div className="w-full h-full flex items-center justify-center p-2">
                    <img
                      src={client.logo}
                      alt={client.name}
                      loading="lazy"
                      decoding="async"
                      className="max-w-full max-h-full object-contain transition-all duration-500"
                      style={{
                        filter: hoveredId === client.id 
                          ? 'brightness(1.1) contrast(1.1)' 
                          : 'brightness(0.7) contrast(0.9) grayscale(100%)',
                        opacity: hoveredId === client.id ? 1 : 0.6,
                      }}
                    />
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Optional CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-16"
        >
          <p className="body-text text-white/50 text-sm">
            Want to collaborate?{' '}
            <a
              href="#contact"
              className="text-white/90 hover:text-white underline underline-offset-4 transition-colors"
            >
              Get in touch
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
