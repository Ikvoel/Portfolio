import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string;
  title: string;
  year?: string;
  description?: string;
  roles?: string[];
  image?: string;
  cinematicStills?: string[];
}

export function VideoModal({
  isOpen,
  onClose,
  videoUrl,
  title,
  year,
  description,
  roles,
  image,
  cinematicStills
}: VideoModalProps) {
  const [activeStillIndex, setActiveStillIndex] = useState(0);

  // Reset active index when the modal opens
  useEffect(() => {
    if (isOpen) {
      setActiveStillIndex(0);
    }
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // A clean, simple switch to determine if the video is available.
  // If you add a real URL later, this switches automatically back to the video iframe player.
  const isVideoAvailable = !!(
    videoUrl &&
    videoUrl.trim() !== '' &&
    videoUrl.toLowerCase() !== 'not available' &&
    videoUrl.toLowerCase() !== 'notavailable' &&
    videoUrl.toLowerCase() !== 'not-available'
  );

  // Collect all unique still images to show statically (no autoplay)
  const stillsList: string[] = [];
  if (image) {
    stillsList.push(image);
  }
  if (cinematicStills && cinematicStills.length > 0) {
    cinematicStills.forEach((still) => {
      if (still !== image && !stillsList.includes(still)) {
        stillsList.push(still);
      }
    });
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop with blur - Lighter on mobile for performance */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/95 md:backdrop-blur-md z-50 cursor-pointer"
          />

          {/* Modal - COMPACT AND PADDED FOR MOBILE */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.3 }}
              className="relative w-full h-auto max-w-6xl max-h-[90vh] md:max-h-[95vh] flex flex-col overflow-hidden rounded-xl md:rounded-2xl shadow-2xl bg-black/95 md:bg-black/90"
              style={{
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button floating over video */}
              <motion.button
                onClick={onClose}
                className="absolute top-2 right-2 md:top-4 md:right-4 z-50 w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full transition-colors shadow-xl"
                style={{
                  background: 'rgba(205, 92, 92, 0.9)',
                  border: '1px solid rgba(205, 92, 92, 1)',
                }}
                whileHover={{ scale: 1.1, background: 'rgba(205, 92, 92, 1)' }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-4 h-4 md:w-5 md:h-5 text-white" />
              </motion.button>

              {/* Video Container - STRICT 16:9 WITHIN BOUNDS */}
              <div className="relative w-full bg-black flex-shrink-0" style={{ aspectRatio: '16/9' }}>
                {isVideoAvailable ? (
                  <iframe
                    src={videoUrl}
                    className="absolute inset-0 w-full h-full"
                    style={{
                      border: 'none',
                    }}
                    allow="autoplay; fullscreen"
                    allowFullScreen
                  />
                ) : (
                  <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-neutral-950 select-none overflow-hidden">
                    {/* The Still Image */}
                    {stillsList.length > 0 ? (
                      <img
                        src={stillsList[activeStillIndex]}
                        alt={`${title} still`}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="text-white/40 text-sm">No preview available</div>
                    )}

                    {/* Navigation controls (only if there are multiple stills) */}
                    {stillsList.length > 1 && (
                      <>
                        {/* Left/Right arrow overlay buttons */}
                        <button
                          onClick={() => setActiveStillIndex((prev) => (prev - 1 + stillsList.length) % stillsList.length)}
                          className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/60 border border-white/10 flex items-center justify-center text-white hover:bg-black/90 hover:scale-105 active:scale-95 transition-all z-20 cursor-pointer"
                          aria-label="Previous image"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => setActiveStillIndex((prev) => (prev + 1) % stillsList.length)}
                          className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/60 border border-white/10 flex items-center justify-center text-white hover:bg-black/90 hover:scale-105 active:scale-95 transition-all z-20 cursor-pointer"
                          aria-label="Next image"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>

                        {/* Dot indicators at the bottom */}
                        <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
                          {stillsList.map((_, idx) => (
                            <button
                              key={idx}
                              onClick={() => setActiveStillIndex(idx)}
                              className={`h-1.5 rounded-full transition-all duration-300 ${
                                idx === activeStillIndex ? 'w-5 bg-white' : 'w-1.5 bg-white/40 hover:bg-white/60'
                              }`}
                              aria-label={`Go to slide ${idx + 1}`}
                            />
                          ))}
                        </div>
                      </>
                    )}

                    {/* Elegant Cinematic Stills Badge */}
                    <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-20">
                      <span className="metadata px-2.5 py-1 rounded bg-black/75 text-white/90 border border-white/15 text-[10px] md:text-xs font-medium tracking-wider uppercase backdrop-blur-sm">
                        Cinematic Stills
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Metadata below video - Scrollable on mobile if needed */}
              <div className="w-full flex-shrink-1 overflow-y-auto p-4 md:p-6 lg:p-8 bg-transparent border-t border-white/10 md:border-t-0">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="film-title text-white text-2xl md:text-3xl">{title}</h3>
                      {year && (
                        <span className="metadata px-2.5 py-1 rounded-md text-white/70 text-xs bg-white/10 border border-white/10">
                          {year}
                        </span>
                      )}
                    </div>
                    {description && (
                      <p className="body-text text-white/70 text-sm md:text-base leading-relaxed max-w-3xl mt-4">
                        {description}
                      </p>
                    )}
                  </div>
                  
                  {roles && roles.length > 0 && (
                    <div className="flex flex-col gap-2 min-w-[200px]">
                      <span className="metadata text-white/40 text-xs uppercase tracking-wider">Roles</span>
                      <div className="flex flex-wrap gap-2">
                        {roles.map((role, idx) => (
                          <span
                            key={idx}
                            className="metadata px-3 py-1.5 text-white/80 text-xs rounded-full bg-white/5 border border-white/10"
                          >
                            {role}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}