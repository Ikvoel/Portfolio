import { Hero } from './components/Hero';
import { About } from './components/About';
import { FeaturedProjects } from './components/FeaturedProjects';
import { Filmography } from './components/Filmography';
import { Photography } from './components/Photography';
import { Clients } from './components/Clients';
import { Contact } from './components/Contact';
import { AnimatedBackground } from './components/AnimatedBackground';
import { CursorParallax } from './components/CursorParallax';
import { BackgroundMusic } from './components/BackgroundMusic';
import seasons from "/@assets/bgmusic/seasons.wav"

export default function App() {
  return (
    <div className="min-h-screen text-white relative">
      {/* Background layer - z-0 */}
      <AnimatedBackground />

      {/* Cursor parallax - z-40 */}
      <CursorParallax />

      {/* Background Music Player - z-50 */}
      <BackgroundMusic audioUrl="https://www.dropbox.com/scl/fi/2mt7pcgmwuefjnezl8ovy/Little-Light.wav?rlkey=4ecsjho636fjxrkv5u4p1y15m&st=w8wkv0gc&raw=1" />

      {/* Content - z-10 */}
      <div className="relative z-10">
        <Hero />
        <About />
        <FeaturedProjects />
        <Filmography />
        <Photography />
        <Clients />
        <Contact />
      </div>
    </div>
  );
}