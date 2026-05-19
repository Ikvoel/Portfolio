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

export default function App() {
  return (
    <div className="min-h-screen text-white relative">
      {/* Background layer - z-0 */}
      <AnimatedBackground />

      {/* Cursor parallax - z-40 */}
      <CursorParallax />

      {/* Background Music Player - z-50 */}
      <BackgroundMusic audioUrl="https://www.dropbox.com/scl/fi/zuerv3ywjjdgwuxjlp0cb/Galdive-Teach-Me-How-To-Love-Official-Lyric-Video-music-vocals.mp3?rlkey=f9donfz10tow2ky1eusbm5pp2&st=xmv817nm&raw=1" />

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