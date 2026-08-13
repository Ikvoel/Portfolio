import { Routes, Route, useLocation, useNavigationType } from 'react-router';
import { useEffect, useRef } from 'react';
import { Hero } from './Hero';
import { About } from './About';
import { FeaturedProjects } from './FeaturedProjects';
import { WorksSection } from './WorksSection';
import { Clients } from './Clients';
import { Contact } from './Contact';
import { CategoryPage } from './CategoryPage';
import { ProjectPage } from './ProjectPage';
import { AnimatedBackground } from './AnimatedBackground';
import { CursorParallax } from './CursorParallax';
import { BackgroundMusic } from './BackgroundMusic';
import ghost from '../../assets/bgmusic/ghost.wav';

function ScrollToTop() {
  const { pathname } = useLocation();
  const navType = useNavigationType();
  const scrollPositions = useRef<Record<string, number>>({});

  useEffect(() => {
    const handleScroll = () => {
      scrollPositions.current[pathname] = window.scrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);

  useEffect(() => {
    if (navType === 'POP' && scrollPositions.current[pathname] !== undefined) {
      const savedY = scrollPositions.current[pathname];
      // Use rAF + timeout for reliable restoration after the DOM settles
      const raf = requestAnimationFrame(() => {
        const timer = setTimeout(() => {
          window.scrollTo({ top: savedY, behavior: 'instant' as ScrollBehavior });
        }, 60);
        return () => clearTimeout(timer);
      });
      return () => cancelAnimationFrame(raf);
    } else {
      window.scrollTo(0, 0);
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
      <ScrollToTop />
      <AnimatedBackground />
      <CursorParallax />
      <BackgroundMusic audioUrl={ghost} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/works/:cat" element={<CategoryPage />} />
        <Route path="/project/:id" element={<ProjectPage />} />
        <Route path="*" element={<HomePage />} />
      </Routes>
    </div>
  );
}