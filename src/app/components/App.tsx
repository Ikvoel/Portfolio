import { Routes, Route, useLocation, useNavigationType } from 'react-router';
import { useEffect, useRef, lazy, Suspense } from 'react';
import { Hero } from './Hero';
import { About } from './About';
import { FeaturedProjects } from './FeaturedProjects';
import { WorksSection } from './WorksSection';
import { Clients } from './Clients';
import { Contact } from './Contact';
import { AnimatedBackground } from './AnimatedBackground';
import { BackgroundMusic } from './BackgroundMusic';
import ghost from '../../assets/bgmusic/ghost.wav';

const CategoryPage = lazy(async () => {
  const module = await import('./CategoryPage');
  return { default: module.CategoryPage };
});

const ProjectPage = lazy(async () => {
  const module = await import('./ProjectPage');
  return { default: module.ProjectPage };
});

const PhotographyClientPage = lazy(async () => {
  const module = await import('./PhotographyClientPage');
  return { default: module.PhotographyClientPage };
});

function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
    </div>
  );
}

function ScrollManager() {
  const { pathname } = useLocation();
  const navType = useNavigationType();
  const scrollPositions = useRef<Record<string, number>>({});
  const activeLockRef = useRef<boolean>(false);

  // Global media protection against right-click copying & dragging
  useEffect(() => {
    // Disable native browser auto-scroll jumping
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    const handleContextMenu = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'IMG' ||
          target.tagName === 'VIDEO' ||
          target.closest('img') ||
          target.closest('video') ||
          target.closest('.media-protected') ||
          target.closest('.liquid-glass-card') ||
          target.closest('.bento-glow'))
      ) {
        e.preventDefault();
        return false;
      }
    };

    const handleDragStart = (e: DragEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'IMG' ||
          target.tagName === 'VIDEO' ||
          target.closest('img') ||
          target.closest('video'))
      ) {
        e.preventDefault();
        return false;
      }
    };

    document.addEventListener('contextmenu', handleContextMenu, { capture: true });
    document.addEventListener('dragstart', handleDragStart, { capture: true });

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu, { capture: true });
      document.removeEventListener('dragstart', handleDragStart, { capture: true });
    };
  }, []);

  // Track scroll position on current page
  useEffect(() => {
    const handleScroll = () => {
      // Don't overwrite home scroll if an active restoration lock is running
      if (activeLockRef.current) return;
      scrollPositions.current[pathname] = window.scrollY;
      if (pathname === '/') {
        sessionStorage.setItem('portfolio_home_scrollY', String(window.scrollY));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);

  // Handle page transitions & scroll restoration
  useEffect(() => {
    if (pathname === '/') {
      const savedStr = sessionStorage.getItem('portfolio_home_scrollY');
      const shouldReturnToBento = sessionStorage.getItem('portfolio_return_to_bento') === 'true';
      const savedY = savedStr ? parseFloat(savedStr) : scrollPositions.current['/'];

      if (savedY !== undefined && savedY > 0) {
        activeLockRef.current = true;

        // Unlock if user explicitly scrolls with wheel or touch
        const releaseLock = () => {
          activeLockRef.current = false;
          window.removeEventListener('wheel', releaseLock);
          window.removeEventListener('touchstart', releaseLock);
        };
        window.addEventListener('wheel', releaseLock, { passive: true, once: true });
        window.addEventListener('touchstart', releaseLock, { passive: true, once: true });

        // Enforce scroll position across frames while layout and images stabilize
        let frameCount = 0;
        const maxFrames = 30; // ~500ms of locking

        const lockScroll = () => {
          if (!activeLockRef.current) return;

          let targetY = savedY;
          if (shouldReturnToBento) {
            const bentoEl = document.getElementById('filmography-section');
            if (bentoEl) {
              const rect = bentoEl.getBoundingClientRect();
              const bentoAbsoluteY = rect.top + window.scrollY;
              // If target was near the bento section, lock directly to bento
              if (Math.abs(savedY - bentoAbsoluteY) < 300) {
                targetY = bentoAbsoluteY;
              }
            }
          }

          window.scrollTo({ top: targetY, behavior: 'instant' as ScrollBehavior });
          frameCount++;

          if (frameCount < maxFrames && activeLockRef.current) {
            requestAnimationFrame(lockScroll);
          } else {
            activeLockRef.current = false;
            sessionStorage.removeItem('portfolio_return_to_bento');
          }
        };

        requestAnimationFrame(lockScroll);
      }
    } else {
      // For subpages (CategoryPage, ProjectPage), start cleanly at top on PUSH
      if (navType === 'PUSH') {
        window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
      }
    }
  }, [pathname, navType]);

  return null;
}

function HomePage() {
  return (
    <div className="relative z-10">
      <Hero />
      <About />
      <FeaturedProjects />
      <WorksSection />
      <Clients />
      <Contact />
    </div>
  );
}

export default function App() {
  return (
    <div className="min-h-screen text-white relative">
      <ScrollManager />
      <AnimatedBackground />
      <BackgroundMusic audioUrl={ghost} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/works/photography/:clientSlug"
          element={
            <Suspense fallback={<LoadingSpinner />}>
              <PhotographyClientPage />
            </Suspense>
          }
        />
        <Route
          path="/works/:cat"
          element={
            <Suspense fallback={<LoadingSpinner />}>
              <CategoryPage />
            </Suspense>
          }
        />
        {/* HANYA 1 ROUTE buat project - hapus yang lama biar nggak double back */}
        <Route
          path="/project/:cat/:id"
          element={
            <Suspense fallback={<LoadingSpinner />}>
              <ProjectPage />
            </Suspense>
          }
        />
        <Route path="*" element={<HomePage />} />
      </Routes>
    </div>
  );
}