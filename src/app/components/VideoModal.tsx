import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { useEffect } from 'react';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string;
  title: string;
  year?: string;
  description?: string;
  roles?: string[];
}

export function VideoModal({ isOpen, onClose, videoUrl, title, year, description, roles }: VideoModalProps) {
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

          {/* Modal - PERFECTLY CENTERED AND SCALED FOR MOBILE */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-2 md:p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.3 }}
              className="relative w-full max-w-6xl overflow-hidden rounded-xl md:rounded-2xl"
              style={{
                background: 'rgba(0, 0, 0, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button floating over video */}
              <motion.button
                onClick={onClose}
                className="absolute top-2 right-2 md:top-4 md:right-4 z-50 w-10 h-10 flex items-center justify-center rounded-full transition-colors shadow-xl"
                style={{
                  background: 'rgba(205, 92, 92, 0.9)',
                  border: '1px solid rgba(205, 92, 92, 1)',
                }}
                whileHover={{ scale: 1.1, background: 'rgba(205, 92, 92, 1)' }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-5 h-5 text-white" />
              </motion.button>

              {/* Video Container - 16:9 ASPECT RATIO ENFORCED */}
              <div className="relative w-full aspect-video bg-black">
                <iframe
                  src={videoUrl}
                  className="absolute top-0 left-0 w-full h-full"
                  style={{
                    border: 'none',
                    objectFit: 'contain',
                  }}
                  allow="autoplay"
                  allowFullScreen
                />
              </div>

              {/* Metadata below video - Minimal blur on mobile */}
              <div className="p-4 md:p-6 lg:p-8 bg-black/60 md:backdrop-blur-xl">
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