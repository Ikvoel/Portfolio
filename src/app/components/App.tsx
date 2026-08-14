import { Routes, Route, useLocation, useNavigationType } from 'react-router';
import { useEffect, useRef, lazy, Suspense } from 'react';
import { Hero } from './Hero';
import { About } from './About';
import { FeaturedProjects } from './FeaturedProjects';
import { WorksSection } from './WorksSection';
import { Clients } from './Clients';
import { Contact } from './Contact';
import { AnimatedBackground } from './AnimatedBackground';
import { CursorParallax } from './CursorParallax';
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
  const restorers = useRef<Record<string, number>>({});

  useEffect(() => {
    const handleScroll = () => {
      scrollPositions.current[pathname] = window.scrollY;
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);

  useEffect(() => {
    if (restorers.current[pathname]) {
      window.clearTimeout(restorers.current[pathname]);
      delete restorers.current[pathname];
    }

    if (navType === 'POP' && scrollPositions.current[pathname] !== undefined) {
      const target = scrollPositions.current[pathname];
      let tries = 0;
      const maxTries = 20;

      const restore = () => {
        window.scrollTo({ top: target, behavior: 'instant' as ScrollBehavior });
        tries++;
        if (Math.abs(window.scrollY - target) > 5 && tries < maxTries) {
          restorers.current[pathname] = window.setTimeout(restore, 100);
        } else {
          delete restorers.current[pathname];
        }
      };

      restorers.current[pathname] = window.setTimeout(restore, 50);
    } else if (navType === 'PUSH') {
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    }

    return () => {
      if (restorers.current[pathname]) {
        window.clearTimeout(restorers.current[pathname]);
        delete restorers.current[pathname];
      }
    };
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
      <CursorParallax />
      <BackgroundMusic audioUrl={ghost} />
      <Routes>
        <Route path="/" element={<HomePage />} />
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