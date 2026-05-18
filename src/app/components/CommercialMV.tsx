import { motion } from 'motion/react';
import { useInView } from 'motion/react';
import { useRef } from 'react';

/**
 * COMMERCIAL & MUSIC VIDEO SECTION
 *
 * Compact, professional layout - intentionally less flashy than narrative works.
 * Features: Client name, Role, Year only.
 */

interface CommercialItem {
  id: number;
  client: string; // Client or Artist name
  role: string; // Your role
  year: string;
  category: 'Commercial' | 'Music Video' | 'SLT'; // SLT = Set Lighting Technician
}

const commercialWorks: CommercialItem[] = [
  {
    id: 1,
    client: 'SonicFlo - Rayu Membiru',
    role: 'Set Lighting Technician',
    year: '2026',
    category: 'Set Lighting Technician',
  },
  {
    id: 2,
    client: 'Ekhsan - Resign',
    role: '2nd Assistant Camera',
    year: '2025',
    category: '2nd Assistant Camera',
  },
  // Add more commercial & MV works here
];

export function CommercialMV() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <section ref={ref} className="py-16 md:py-20 px-4 relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mb-12 flex items-center gap-4"
        >
          <div className="w-8 h-px bg-[var(--accent-red)]" />
          <h2 className="section-title text-white text-2xl md:text-3xl">Commercial & Music Video</h2>
          <div className="h-px flex-grow bg-white/10" />
        </motion.div>

        {/* Compact Grid Layout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4"
        >
          {commercialWorks.map((work, index) => {
            const isSLT = work.category === 'SLT';

            return (
              <motion.div
                key={work.id}
                initial={{ opacity: 0, y: 10 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.05 }}
                className={`relative group ${
                  isSLT ? 'sm:col-span-2 lg:col-span-1' : ''
                }`}
              >
                {/* Card Container */}
                <div
                  className={`p-4 md:p-5 rounded-lg border transition-all duration-300 ${
                    isSLT
                      ? 'bg-[var(--accent-red-faint)] border-[var(--accent-red-subtle)] hover:border-[var(--accent-red)]'
                      : 'bg-white/[0.02] border-white/[0.08] hover:border-white/20'
                  }`}
                >
                  {/* Client/Artist Name */}
                  <h3 className="text-white font-medium text-base md:text-lg mb-2 line-clamp-1">
                    {work.client}
                  </h3>

                  {/* Role & Year */}
                  <div className="flex items-center gap-2 text-xs md:text-sm">
                    <span className="metadata text-white/60">{work.role}</span>
                    <div className={`w-1 h-1 rounded-full ${isSLT ? 'bg-[var(--accent-red)]' : 'bg-white/30'}`} />
                    <span className="metadata text-white/40">{work.year}</span>
                  </div>

                  {/* SLT Indicator */}
                  {isSLT && (
                    <div className="mt-3 inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-[var(--accent-red-subtle)] text-white/90 text-xs font-medium">
                      <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                      Set Lighting Technician
                    </div>
                  )}
                </div>

                {/* Subtle hover indicator line */}
                {!isSLT && (
                  <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-[var(--accent-red)] group-hover:w-full transition-all duration-500" />
                )}
              </motion.div>
            );
          })}
        </motion.div>

        {/* Optional: Horizontal Reel Version (Comment out grid above and uncomment this for horizontal scroll) */}
        {false && (
          <div className="overflow-x-auto pb-4 -mx-4 px-4" style={{
            scrollbarWidth: 'thin',
            scrollbarColor: 'rgba(205, 92, 92, 0.3) transparent'
          }}>
            <div className="flex gap-4 w-max">
              {commercialWorks.map((work, index) => (
                <motion.div
                  key={work.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.05 }}
                  className="flex-shrink-0 w-64"
                >
                  <div className="p-5 rounded-lg bg-white/[0.02] border border-white/[0.08] hover:border-white/20 transition-all duration-300">
                    <h3 className="text-white font-medium text-lg mb-2">{work.client}</h3>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="metadata text-white/60">{work.role}</span>
                      <div className="w-1 h-1 rounded-full bg-white/30" />
                      <span className="metadata text-white/40">{work.year}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Custom scrollbar for horizontal version */}
      <style jsx>{`
        div::-webkit-scrollbar {
          height: 4px;
        }
        div::-webkit-scrollbar-track {
          background: transparent;
        }
        div::-webkit-scrollbar-thumb {
          background: var(--accent-red-subtle);
          border-radius: 2px;
        }
        div::-webkit-scrollbar-thumb:hover {
          background: var(--accent-red-soft);
        }
      `}</style>
    </section>
  );
}
