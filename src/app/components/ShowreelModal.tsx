import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { CinematicVideoPlayer } from './ui/CinematicVideoPlayer';

interface ShowreelModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string;
  title?: string;
}

export function ShowreelModal({ isOpen, onClose, videoUrl, title = "Cinematography Showreel" }: ShowreelModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-8 bg-black/92 backdrop-blur-2xl"
          onClick={onClose}
        >
          {/* Close button */}
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute top-4 right-4 md:top-6 md:right-6 w-12 h-12 rounded-full liquid-glass-floating text-white/90 flex items-center justify-center group z-50 hover:bg-white/20 transition-colors"
          >
            <X className="w-6 h-6 group-hover:scale-110 transition-transform" />
          </motion.button>

          {/* Cinematic Video Player Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            <CinematicVideoPlayer
              src={videoUrl}
              title={title}
              subtitle="Showreel"
              autoPlay={true}
              accentColor="#1d97f1"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : null;
}
