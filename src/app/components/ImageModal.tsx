import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { useEffect } from 'react';

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  image: {
    title: string;
    category: string;
    year: string;
    image: string;
    description: string;
  };
}

export function ImageModal({ isOpen, onClose, image }: ImageModalProps) {
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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/90 md:backdrop-blur-md z-50 cursor-pointer"
          />

          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="relative max-w-6xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.button
                onClick={onClose}
                className="absolute -top-12 right-0 liquid-glass-floating w-10 h-10 flex items-center justify-center rounded-full z-10"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-5 h-5 text-white" />
              </motion.button>

              <div className="relative liquid-glass-card overflow-hidden">
                <img
                  src={image.image}
                  alt={image.title}
                  loading="eager"
                  decoding="async"
                  className="w-full h-auto max-h-[85vh] object-contain"
                />

                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-6">
                  <div className="flex items-center gap-3 mb-2">
                    {/* FIXED: Changed 'glass-subtle' to 'liquid-glass-badge' */}
                    <span className="metadata liquid-glass-badge px-3 py-1.5 rounded-full text-white/80 text-xs">
                      {image.category}
                    </span>
                    <span className="metadata text-white/60 text-xs">{image.year}</span>
                  </div>
                  <h3 className="film-title text-white mb-2 text-xl">{image.title}</h3>
                  <p className="body-text text-white/70 text-sm">{image.description}</p>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}