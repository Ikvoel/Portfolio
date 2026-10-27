import { Hero } from './components/Hero';
import { About } from './components/About';
import { FeaturedProjects } from './components/FeaturedProjects';
import { WorksSection } from './components/WorksSection';
import { Clients } from './components/Clients';
import { Contact } from './components/Contact';
import { AnimatedBackground } from './components/AnimatedBackground';
import { CursorParallax } from './components/CursorParallax';
import { BackgroundMusic } from './components/BackgroundMusic';
import ghost from '../assets/bgmusic/ghost.wav';
import { useEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router';

/**
 * Restores the scroll position when navigating back to the home page.
 * The previous scroll Y position is stored in sessionStorage under the key
 * 'portfolio_home_scrollY' by the project cards when navigating away.
 */
function ScrollManager() {
  const location = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    // Only restore scroll when navigating back (POP) to the root path
    if (navigationType === 'POP' && location.pathname === '/') {
      const stored = sessionStorage.getItem('portfolio_home_scrollY');
      if (stored) {
        const y = parseInt(stored, 10);
        if (!isNaN(y)) {
          window.scrollTo({ top: y, behavior: 'auto' });
        }
        sessionStorage.removeItem('portfolio_home_scrollY');
      }
    }
  }, [navigationType, location.pathname]);

  return null;
}

export default function App() {
  return (
    <div className="min-h-screen text-white relative">
      <AnimatedBackground />
      <CursorParallax />
      <BackgroundMusic audioUrl={ghost} />
      <ScrollManager />
      <div className="relative z-10">
        <Hero />
        <About />
        <FeaturedProjects />
        <WorksSection />
        <Clients />
        <Contact />
      </div>
    </div>
  );
}