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

export default function App() {
  return (
    <div className="min-h-screen text-white relative">
      <AnimatedBackground />
      <CursorParallax />
      <BackgroundMusic audioUrl={ghost} />
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