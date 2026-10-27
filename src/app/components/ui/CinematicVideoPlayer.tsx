import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  RotateCcw,
  RotateCw,
  Sparkles,
  Film,
  Lock,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';

interface CinematicVideoPlayerProps {
  src: string;
  title?: string;
  subtitle?: string;
  poster?: string;
  autoPlay?: boolean;
  accentColor?: string;
  className?: string;
  onEnded?: () => void;
}

function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '00:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  const h = Math.floor(m / 60);
  if (h > 0) {
    const remM = m % 60;
    return `${h}:${remM < 10 ? '0' : ''}${remM}:${s < 10 ? '0' : ''}${s}`;
  }
  return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
}

function getYoutubeEmbed(url: string | undefined): string | null {
  if (!url) return null;
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, '');
    let id = '';
    if (host === 'youtu.be') id = u.pathname.replace(/^\//, '').split('/')[0];
    else if (host.endsWith('youtube.com') || host.endsWith('youtube-nocookie.com')) {
      if (u.pathname.startsWith('/watch')) id = u.searchParams.get('v') || '';
      else if (u.pathname.startsWith('/embed/')) id = u.pathname.split('/')[2] || '';
      else if (u.pathname.startsWith('/shorts/')) id = u.pathname.split('/')[2] || '';
    }
    if (!id) return null;
    let start = u.searchParams.get('start') || '';
    const t = u.searchParams.get('t');
    if (!start && t) start = t.replace(/s$/i, '');
    const p = new URLSearchParams({ autoplay: '1', rel: '0', modestbranding: '1', playsinline: '1' });
    if (start) p.set('start', start);
    return `https://www.youtube.com/embed/${id}?${p.toString()}`;
  } catch {
    return null;
  }
}

function getDriveEmbed(url: string | undefined): string | null {
  if (!url) return null;
  try {
    const u = new URL(url);
    if (!/drive\.google\.com/.test(u.hostname)) return null;
    let id = u.searchParams.get('id') || '';
    if (!id) {
      const m = u.pathname.match(/\/d\/([A-Za-z0-9_-]{10,})/);
      if (m) id = m[1];
    }
    if (!id) return null;
    return `https://drive.google.com/file/d/${id}/preview`;
  } catch {
    return null;
  }
}

export function CinematicVideoPlayer({
  src,
  title = '',
  subtitle = '',
  poster,
  autoPlay = true,
  accentColor = '#1d97f1',
  className = '',
  onEnded,
}: CinematicVideoPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const hideControlsTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isHoveringVolume, setIsHoveringVolume] = useState(false);
  const [isDraggingProgress, setIsDraggingProgress] = useState(false);
  const [hoverTime, setHoverTime] = useState<number | null>(null);
  const [hoverPosition, setHoverPosition] = useState<number>(0);
  const [ambientGlow, setAmbientGlow] = useState(true);
  const [showCenterIcon, setShowCenterIcon] = useState(false);
  const [centerIconType, setCenterIconType] = useState<'play' | 'pause'>('play');
  const [hasError, setHasError] = useState(false);

  const ytEmbed = getYoutubeEmbed(src);
  const driveEmbed = getDriveEmbed(src);

  // Auto-hide controls logic
  const resetHideTimer = useCallback(() => {
    setShowControls(true);
    if (hideControlsTimer.current) clearTimeout(hideControlsTimer.current);
    if (isPlaying) {
      hideControlsTimer.current = setTimeout(() => {
        if (!isDraggingProgress && !isHoveringVolume) {
          setShowControls(false);
        }
      }, 2500);
    }
  }, [isPlaying, isDraggingProgress, isHoveringVolume]);

  const handleMouseMove = () => {
    resetHideTimer();
  };

  useEffect(() => {
    resetHideTimer();
    return () => {
      if (hideControlsTimer.current) clearTimeout(hideControlsTimer.current);
    };
  }, [isPlaying, resetHideTimer]);

  // Video element events
  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play().then(() => {
        setIsPlaying(true);
        setCenterIconType('play');
        setShowCenterIcon(true);
        setTimeout(() => setShowCenterIcon(false), 600);
      }).catch((e) => {
        console.warn('Playback error, retrying muted:', e);
        // Modern browser policy fallback: play muted if unmuted is blocked
        video.muted = true;
        setIsMuted(true);
        video.play().then(() => {
          setIsPlaying(true);
        }).catch((err) => {
          console.error('Final playback attempt failed:', err);
          setIsPlaying(false);
        });
      });
    } else {
      video.pause();
      setIsPlaying(false);
      setCenterIconType('pause');
      setShowCenterIcon(true);
      setTimeout(() => setShowCenterIcon(false), 600);
    }
  }, []);

  const handleTimeUpdate = () => {
    if (!videoRef.current || isDraggingProgress) return;
    setCurrentTime(videoRef.current.currentTime);

    // Calculate buffered percentage
    if (videoRef.current.buffered.length > 0) {
      const bufferedEnd = videoRef.current.buffered.end(videoRef.current.buffered.length - 1);
      setBuffered(duration > 0 ? (bufferedEnd / duration) * 100 : 0);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
      setHasError(false);
      if (autoPlay) {
        videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {
          // If browser blocks unmuted autoplay, retry muted
          if (videoRef.current) {
            videoRef.current.muted = true;
            setIsMuted(true);
            videoRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
          }
        });
      }
    }
  };

  const skipTime = (amount: number) => {
    if (!videoRef.current) return;
    const newTime = Math.max(0, Math.min(duration, videoRef.current.currentTime + amount));
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  // Volume control
  const toggleMute = () => {
    if (!videoRef.current) return;
    if (isMuted) {
      videoRef.current.muted = false;
      videoRef.current.volume = volume || 0.5;
      setIsMuted(false);
    } else {
      videoRef.current.muted = true;
      setIsMuted(true);
    }
  };

  const handleVolumeChange = (newVol: number) => {
    if (!videoRef.current) return;
    const clamped = Math.max(0, Math.min(1, newVol));
    videoRef.current.volume = clamped;
    setVolume(clamped);
    if (clamped === 0) {
      videoRef.current.muted = true;
      setIsMuted(true);
    } else if (isMuted) {
      videoRef.current.muted = false;
      setIsMuted(false);
    }
  };

  // Progress scrubbing
  const calculateProgressFromEvent = (e: React.MouseEvent<HTMLDivElement> | MouseEvent) => {
    if (!progressBarRef.current) return 0;
    const rect = progressBarRef.current.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    return Math.max(0, Math.min(1, pos));
  };

  const handleProgressMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDraggingProgress(true);
    const progress = calculateProgressFromEvent(e);
    if (videoRef.current && duration > 0) {
      videoRef.current.currentTime = progress * duration;
      setCurrentTime(progress * duration);
    }

    const handleMouseMoveDoc = (moveEvent: MouseEvent) => {
      const p = calculateProgressFromEvent(moveEvent);
      if (videoRef.current && duration > 0) {
        videoRef.current.currentTime = p * duration;
        setCurrentTime(p * duration);
      }
    };

    const handleMouseUpDoc = () => {
      setIsDraggingProgress(false);
      window.removeEventListener('mousemove', handleMouseMoveDoc);
      window.removeEventListener('mouseup', handleMouseUpDoc);
    };

    window.addEventListener('mousemove', handleMouseMoveDoc);
    window.addEventListener('mouseup', handleMouseUpDoc);
  };

  const handleProgressHover = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current || duration <= 0) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    const clampedPos = Math.max(0, Math.min(1, pos));
    setHoverPosition(clampedPos * 100);
    setHoverTime(clampedPos * duration);
  };

  // Fullscreen container
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        skipTime(-5);
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        skipTime(5);
      } else if (e.code === 'KeyM') {
        e.preventDefault();
        toggleMute();
      } else if (e.code === 'KeyF') {
        e.preventDefault();
        toggleFullscreen();
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('keydown', handleKeyDown);
      return () => container.removeEventListener('keydown', handleKeyDown);
    }
  }, [togglePlay]);

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  // Render YouTube or Google Drive embed with cinematic bezel & anti-download protection
  if (ytEmbed || driveEmbed) {
    return (
      <div
        ref={containerRef}
        className={`relative w-full aspect-video max-w-6xl mx-auto rounded-xl md:rounded-2xl overflow-hidden bg-black select-none shadow-[0_24px_80px_rgba(0,0,0,0.9)] border border-white/10 ${className}`}
        onContextMenu={(e) => e.preventDefault()}
      >
        {/* Ambient projection glow behind the embed */}
        {ambientGlow && (
          <div
            className="absolute -inset-4 opacity-40 blur-3xl pointer-events-none transition-opacity duration-700 -z-10"
            style={{
              background: `radial-gradient(circle at 50% 50%, ${accentColor} 0%, transparent 70%)`,
            }}
          />
        )}

        {/* Cinematic top bar with dark gradient */}
        <div
          className="absolute top-0 inset-x-0 h-14 z-30 flex items-center justify-between px-6 pointer-events-auto"
          style={{
            background: 'linear-gradient(180deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.45) 60%, transparent 100%)',
          }}
          onContextMenu={(e) => e.preventDefault()}
        >
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: accentColor }} />
            {title && (
              <span className="film-title text-sm md:text-base text-white font-medium tracking-wide truncate max-w-xs md:max-w-md">
                {title}
              </span>
            )}
            {subtitle && (
              <span className="hidden sm:inline-block metadata text-[10px] text-white/60 border border-white/15 px-2 py-0.5 rounded-full uppercase tracking-widest">
                {subtitle}
              </span>
            )}
          </div>

          {/* Protected Badge, Ambient Toggle & Fullscreen */}
          <div className="flex items-center gap-2 md:gap-3">
            <div className="flex items-center gap-1.5 px-2.5 md:px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[10px] text-white/80 border border-white/15">
              <Lock className="w-3 h-3 text-white/60" />
              <span className="metadata tracking-wider uppercase">Cinematic Stream</span>
            </div>
            <button
              type="button"
              onClick={() => setAmbientGlow(!ambientGlow)}
              className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white/80 transition-colors cursor-pointer"
              title="Toggle Ambient Glow"
            >
              <Sparkles className="w-3.5 h-3.5" style={{ color: ambientGlow ? accentColor : undefined }} />
            </button>
            <button
              type="button"
              onClick={toggleFullscreen}
              className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white/80 transition-colors cursor-pointer"
              title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            >
              {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Top-Right Shield Layer: Block Google Drive popout / download */}
        {driveEmbed && (
          <div
            className="absolute top-0 right-0 w-36 h-16 z-40 cursor-default"
            onContextMenu={(e) => e.preventDefault()}
            onClick={(e) => { e.stopPropagation(); e.preventDefault(); }}
          />
        )}

        <iframe
          src={ytEmbed || driveEmbed || ''}
          title={title || 'Cinematic Player'}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          allowFullScreen
          className="w-full h-full border-0 object-contain relative z-10"
        />

        {/* Subtle cinematic edge vignette overlay */}
        <div
          className="absolute inset-0 pointer-events-none z-20"
          style={{
            boxShadow: 'inset 0 0 80px rgba(0,0,0,0.7), inset 0 0 20px rgba(0,0,0,0.9)',
          }}
        />
      </div>
    );
  }

  // Native Cinematic Player with Full Custom Controls & Anti-Download Protection
  return (
    <div
      ref={containerRef}
      tabIndex={0}
      className={`group relative w-full aspect-video max-w-6xl mx-auto rounded-xl md:rounded-2xl overflow-hidden bg-black select-none shadow-[0_24px_80px_rgba(0,0,0,0.85)] border border-white/15 ${
        isPlaying && !showControls ? 'cursor-none' : 'cursor-default'
      } ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* Dynamic Ambient Projection Glow */}
      {ambientGlow && (
        <div
          className="absolute -inset-6 opacity-35 blur-3xl pointer-events-none transition-opacity duration-700 -z-10"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${accentColor} 0%, transparent 75%)`,
          }}
        />
      )}

      {/* Main Video Element: download blocked, right-click blocked, no native context */}
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        playsInline
        preload="metadata"
        // @ts-ignore
        controlsList="nodownload noplaybackrate nofullscreen"
        disablePictureInPicture
        onContextMenu={(e) => e.preventDefault()}
        onDragStart={(e) => e.preventDefault()}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onError={() => {
          setHasError(true);
          setIsPlaying(false);
        }}
        onEnded={() => {
          setIsPlaying(false);
          if (onEnded) onEnded();
        }}
        onClick={togglePlay}
        onDoubleClick={toggleFullscreen}
        className="w-full h-full object-contain cursor-pointer relative z-10"
      />

      {/* Error Fallback Overlay if direct stream is blocked */}
      {hasError && (
        <div className="absolute inset-0 z-30 bg-black/85 flex flex-col items-center justify-center p-6 text-center">
          <AlertCircle className="w-10 h-10 text-amber-400 mb-3" />
          <h4 className="film-title text-lg text-white mb-1">Direct Stream Unavailable</h4>
          <p className="text-white/60 text-xs max-w-md mb-4">
            The media host requires external authentication or cross-origin headers to stream directly in-browser.
          </p>
          <div className="flex items-center gap-3">
            <a
              href={src}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white text-black text-xs font-semibold hover:bg-white/90 transition-all cursor-pointer"
            >
              Open External Source <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <button
              onClick={() => {
                setHasError(false);
                videoRef.current?.load();
              }}
              className="px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs border border-white/20 transition-all cursor-pointer"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Transparent Click Shield & Interaction Layer */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          boxShadow: 'inset 0 0 90px rgba(0,0,0,0.65), inset 0 0 25px rgba(0,0,0,0.85)',
        }}
      />

      {/* Big Center Play/Pause Ripple Feedback Animation */}
      {showCenterIcon && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-black/60 backdrop-blur-md border border-white/25 flex items-center justify-center text-white scale-110 animate-ping">
            {centerIconType === 'play' ? (
              <Play className="w-10 h-10 ml-1 text-white fill-white" />
            ) : (
              <Pause className="w-10 h-10 text-white fill-white" />
            )}
          </div>
        </div>
      )}

      {/* Top Info Bar: Dark cinematic gradient */}
      <div
        className={`absolute top-0 inset-x-0 h-16 z-30 flex items-center justify-between px-6 transition-opacity duration-300 pointer-events-none ${
          showControls ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          background: 'linear-gradient(180deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)',
        }}
      >
        <div className="flex items-center gap-3">
          <div className="liquid-glass-floating w-7 h-7 rounded-full flex items-center justify-center">
            <Film className="w-3.5 h-3.5 text-white/90" />
          </div>
          <div>
            <h4 className="film-title text-sm md:text-base text-white tracking-wide truncate max-w-xs md:max-w-md drop-shadow-md">
              {title || 'Cinematic Film'}
            </h4>
            {subtitle && (
              <p className="metadata text-[10px] text-white/50 tracking-widest uppercase">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/50 backdrop-blur-md text-[10px] text-white/70 border border-white/10">
            <Lock className="w-3 h-3 text-white/50" />
            <span className="metadata tracking-wider uppercase">Protected Content</span>
          </div>
          <button
            type="button"
            onClick={() => setAmbientGlow(!ambientGlow)}
            className="w-8 h-8 rounded-full bg-black/50 hover:bg-black/80 backdrop-blur-md border border-white/15 flex items-center justify-center text-white/80 transition-colors cursor-pointer"
            title="Toggle Cinema Ambient Glow"
          >
            <Sparkles className="w-4 h-4" style={{ color: ambientGlow ? accentColor : undefined }} />
          </button>
        </div>
      </div>

      {/* Floating Bottom Control Bar: Dark Glass Aesthetic */}
      <div
        className={`absolute bottom-4 left-4 right-4 md:bottom-6 md:left-8 md:right-8 z-30 rounded-xl md:rounded-2xl bg-[#070b1a]/85 backdrop-blur-md border border-white/15 px-4 md:px-6 py-3 md:py-3.5 shadow-[0_12px_40px_rgba(0,0,0,0.9)] transition-all duration-300 ${
          showControls ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3 pointer-events-none'
        }`}
      >
        {/* Timeline Scrubber */}
        <div
          ref={progressBarRef}
          onMouseDown={handleProgressMouseDown}
          onMouseMove={handleProgressHover}
          onMouseLeave={() => setHoverTime(null)}
          className="relative h-2 hover:h-3 rounded-full bg-white/15 cursor-pointer transition-all duration-200 group/bar mb-3"
        >
          {/* Buffered Progress */}
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-white/20 transition-all duration-300"
            style={{ width: `${buffered}%` }}
          />

          {/* Played Progress */}
          <div
            className="absolute inset-y-0 left-0 rounded-full transition-all"
            style={{
              width: `${progressPercent}%`,
              background: `linear-gradient(90deg, ${accentColor}cc 0%, ${accentColor} 100%)`,
              boxShadow: `0 0 12px ${accentColor}`,
            }}
          />

          {/* Scrubber Knob */}
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-white shadow-lg transition-transform group-hover/bar:scale-125"
            style={{
              left: `${progressPercent}%`,
              boxShadow: `0 0 8px ${accentColor}`,
            }}
          />

          {/* Hover Time Tooltip */}
          {hoverTime !== null && (
            <div
              className="absolute -top-8 -translate-x-1/2 px-2 py-0.5 rounded-md bg-black/90 border border-white/20 text-[10px] text-white metadata tabular-nums pointer-events-none"
              style={{ left: `${hoverPosition}%` }}
            >
              {formatTime(hoverTime)}
            </div>
          )}
        </div>

        {/* Controls Row */}
        <div className="flex items-center justify-between gap-3">
          {/* Left Controls: Play, Skips, Volume, Time */}
          <div className="flex items-center gap-2 md:gap-3.5">
            {/* Play/Pause Button */}
            <button
              type="button"
              onClick={togglePlay}
              aria-label={isPlaying ? 'Pause' : 'Play'}
              className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-white text-black hover:bg-white/90 flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-[0_4px_16px_rgba(255,255,255,0.3)] shrink-0 cursor-pointer"
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 md:w-5 md:h-5 fill-black" />
              ) : (
                <Play className="w-4 h-4 md:w-5 md:h-5 ml-0.5 fill-black" />
              )}
            </button>

            {/* Skip Backward 10s */}
            <button
              type="button"
              onClick={() => skipTime(-10)}
              title="Rewind 10s"
              aria-label="Rewind 10 seconds"
              className="w-8 h-8 rounded-full flex items-center justify-center text-white/75 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Skip Forward 10s */}
            <button
              type="button"
              onClick={() => skipTime(10)}
              title="Forward 10s"
              aria-label="Forward 10 seconds"
              className="w-8 h-8 rounded-full flex items-center justify-center text-white/75 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <RotateCw className="w-4 h-4" />
            </button>

            {/* Volume Control with hover slider */}
            <div
              className="relative flex items-center"
              onMouseEnter={() => setIsHoveringVolume(true)}
              onMouseLeave={() => setIsHoveringVolume(false)}
            >
              <button
                type="button"
                onClick={toggleMute}
                aria-label={isMuted ? 'Unmute' : 'Mute'}
                className="w-8 h-8 rounded-full flex items-center justify-center text-white/75 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-4 h-4 text-red-400" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </button>

              <div
                className={`transition-all duration-300 overflow-hidden flex items-center ${
                  isHoveringVolume ? 'w-20 md:w-24 opacity-100 ml-1.5' : 'w-0 opacity-0'
                }`}
              >
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                  className="w-full h-1.5 rounded-full appearance-none bg-white/20 accent-[#1d97f1] cursor-pointer"
                />
              </div>
            </div>

            {/* Time Readout */}
            <div className="metadata text-[11px] md:text-xs text-white/70 tabular-nums ml-1">
              <span>{formatTime(currentTime)}</span>
              <span className="text-white/30 mx-1">/</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Right Controls: Quality Badge, Fullscreen */}
          <div className="flex items-center gap-2 md:gap-3">
            <span className="hidden sm:inline-block metadata text-[10px] text-white/60 border border-white/20 px-2 py-0.5 rounded tracking-widest font-semibold uppercase">
              2.39:1 CINEMA
            </span>

            {/* Fullscreen Button */}
            <button
              type="button"
              onClick={toggleFullscreen}
              aria-label={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
              className="w-8 h-8 rounded-full flex items-center justify-center text-white/75 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              {isFullscreen ? (
                <Minimize2 className="w-4 h-4" />
              ) : (
                <Maximize2 className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
