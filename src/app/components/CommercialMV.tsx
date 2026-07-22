import { motion } from 'motion/react';
import { useInView } from 'motion/react';
import { useRef } from 'react';

interface CommercialItem {
  id: number;
  client: string;
  role: string;
  year: string;
  category: 'Commercial' | 'Music Video';
  indicator?: boolean;
}

const commercialWorks: CommercialItem[] = [
  { id: 1, client: 'SonicFlo - Rayu Membiru', role: 'Set Lighting Technician', year: '2026', category: 'Music Video', indicator: true },
  { id: 2, client: 'Ekhsan - Resign', role: '2nd Assistant Camera', year: '2025', category: 'Music Video', indicator: true },
];

export function CommercialMV() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <section ref={ref} className="py-16 md:py-20 px-4 relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7 }} className="mb-12 flex items-center gap-4">
          <div className="w-8 h-px bg-[var(--accent-red)]" />
          <h2 className="section-title text-white text-2xl md:text-3xl">Commercial & Music Video</h2>
          <div className="h-px flex-grow bg-white/10" />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, delay: 0.2 }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {commercialWorks.map((work, index) => {
            const isHighlighted = !!work.indicator;
            return (
              <motion.div key={work.id} initial={{ opacity: 0, y: 10 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.3 + index * 0.05 }} className={`relative group ${isHighlighted ? 'sm:col-span-2 lg:col-span-1' : ''}`}>
                <div className={`p-4 md:p-5 rounded-lg border transition-all duration-300 ${isHighlighted ? 'bg-[var(--accent-red-faint)] border-[var(--accent-red-subtle)] hover:border-[var(--accent-red)]' : 'liquid-glass-card'}`}>
                  <h3 className="text-white font-medium text-base md:text-lg mb-2 line-clamp-1">{work.client}</h3>
                  <div className="flex items-center gap-2 text-xs md:text-sm">
                    <span className="metadata text-white/60">{work.role}</span>
                    <div className={`w-1 h-1 rounded-full ${isHighlighted ? 'bg-[var(--accent-red)]' : 'bg-white/30'}`} />
                    <span className="metadata text-white/40">{work.year}</span>
                  </div>
                  {isHighlighted && (
                    <div className="mt-3 inline-flex items-center gap-1.5 px-2 py-1 rounded-md liquid-glass-badge text-white/90 text-xs font-medium bg-[var(--accent-red-subtle)] border-[var(--accent-red-subtle)]">
                      <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                      {work.role}
                    </div>
                  )}
                </div>
                {!isHighlighted && <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-[var(--accent-red)] group-hover:w-full transition-all duration-500" />}
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}