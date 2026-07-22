import { useRef, useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

/**
 * BACKGROUND MUSIC PLAYER
 *
 * How to add your theme song:
 * 1. Upload your audio file (MP3 recommended) to a hosting service:
 *    - Google Drive: Upload → Share → Get link → Use file ID
 *    - SoundCloud: Upload and get the direct MP3 link
 *    - Or use a direct link from your server
 *
 * 2. For Google Drive:
 *    - Upload your MP3 to Google Drive
 *    - Right-click → Share → Anyone with the link
 *    - Copy the file ID from the URL
 *    - Format: https://drive.google.com/uc?export=download&id=YOUR_FILE_ID
 *
 * 3. Replace the audioUrl below with your link
 */

interface BackgroundMusicProps {
  audioUrl?: string; 
}

export function BackgroundMusic({ audioUrl }: BackgroundMusicProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(true);

  useEffect(() => {
    // Hide controls after 5 seconds
    const timer = setTimeout(() => setShowControls(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
    setShowControls(true);

    // Auto-hide controls after toggling
    setTimeout(() => setShowControls(false), 3000);
  };

  // Don't render if no audio URL provided
  if (!audioUrl) return null;

  return (
    <>
      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        src={audioUrl}
        loop
        preload="none"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      {/* Floating Music Control Button */}
      <motion.button
        onClick={togglePlay}
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setTimeout(() => setShowControls(false), 2000)}
        className="fixed bottom-8 right-8 z-50 liquid-glass-floating w-14 h-14 rounded-full flex items-center justify-center group"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 2, duration: 0.5 }}
      >
        {isPlaying ? (
          <Volume2 className="w-6 h-6 text-white" />
        ) : (
          <VolumeX className="w-6 h-6 text-white/60" />
        )}

        {/* Ripple effect when playing */}
        {isPlaying && (
          <motion.div
            className="absolute inset-0 rounded-full border border-white/30"
            animate={{
              scale: [1, 1.4, 1],
              opacity: [0.5, 0, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        )}
      </motion.button>

      {/* Tooltip */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            className="fixed bottom-8 right-24 z-50 liquid-glass-badge px-3 py-2 rounded-lg pointer-events-none"
          >
            <span className="metadata text-white/90 text-xs whitespace-nowrap">
              {isPlaying ? 'Playing Theme' : 'Click to Play Music'}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
