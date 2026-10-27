import { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router';
import { motion } from 'motion/react';
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import { ArrowLeft, Share2, Check, Calendar, Layers, ExternalLink } from 'lucide-react';
import { getPhotographyClient, photographyClients } from './works/photographyClients';
import hsno from '@/assets/images/logo/hsno.png';
import { ImageModal } from './ImageModal';

export function PhotographyClientPage() {
  const { clientSlug } = useParams<{ clientSlug: string }>();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<any | null>(null);

  const client = useMemo(() => {
    return clientSlug ? getPhotographyClient(clientSlug) : undefined;
  }, [clientSlug]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [clientSlug]);

  if (!client) {
    return (
      <div className="min-h-screen bg-[#020719] text-white flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-2xl font-bold mb-3">Client Project Not Found</h2>
        <p className="text-white/60 mb-5 text-sm">The requested photography project series could not be found.</p>
        <button
          onClick={() => navigate('/works/photography')}
          className="px-5 py-2 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs transition-all"
        >
          Back to Photography
        </button>
      </div>
    );
  }

  const handleBack = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('portfolio_return_to_bento', 'true');
    }
    navigate('/works/photography');
  };

  const handleShare = () => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const otherClients = photographyClients.filter((c) => c.slug !== client.slug);

  return (
    <div className="relative min-h-screen bg-[#020719] text-white overflow-x-hidden selection:bg-white selection:text-black">
      {/* STATIC AMBIENT ACCENT GLOW (Zero animation loops, GPU-cached) */}
      <div aria-hidden className="fixed inset-0 z-0 pointer-events-none select-none">
        <div
          className="absolute -top-[10%] left-1/4 w-[70vw] max-w-[1000px] h-[500px] rounded-full filter blur-[140px] opacity-35"
          style={{ background: client.glowColor }}
        />
        <div
          className="absolute top-[60%] -right-[10%] w-[50vw] max-w-[800px] h-[450px] rounded-full filter blur-[150px] opacity-20"
          style={{ background: client.glowColor }}
        />
        <div className="absolute inset-0 bg-[#020719]/75 backdrop-blur-[60px]" />
      </div>

      {/* COMPACT TOP NAVIGATION BAR */}
      <header className="sticky top-0 z-40 px-4 sm:px-6 md:px-10 py-3 bg-[#020719]/90 backdrop-blur-md border-b border-white/10">
        <div className="max-w-[1720px] mx-auto flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={handleBack}
            aria-label="Back to Photography"
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-md text-white/90 bg-white/5 hover:bg-white/15 transition-all border border-white/15 text-xs font-medium cursor-pointer shrink-0"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Photography
          </button>

          {/* Centered HSNO Logo */}
          <button
            type="button"
            onClick={() => navigate('/')}
            className="transition-transform hover:scale-105 active:scale-95 cursor-pointer"
            title="Home"
          >
            <img
              src={hsno}
              alt="HSNO"
              draggable={false}
              className="h-5 md:h-6 w-auto object-contain select-none pointer-events-none"
            />
          </button>

          {/* Share Button */}
          <button
            type="button"
            onClick={handleShare}
            className="w-8 h-8 rounded-md flex items-center justify-center text-white bg-white/5 hover:bg-white/15 border border-white/15 transition-all cursor-pointer shrink-0"
            title="Share Collection"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </header>

      {/* COMPACT HERO HEADER: Minimal liminal space, maximum punch */}
      <section className="relative z-10 max-w-[1720px] mx-auto px-4 sm:px-6 md:px-10 pt-5 pb-4 md:pt-7 md:pb-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
          
          {/* Left Title & Info */}
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span
                className="px-2.5 py-0.5 rounded-[4px] text-[10px] font-semibold tracking-wider uppercase flex items-center gap-1.5"
                style={{
                  background: `${client.accentColor}25`,
                  border: `1px solid ${client.accentColor}70`,
                  color: '#ffffff',
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: client.accentColor }} />
                {client.category} Series
              </span>

              <span className="text-white/30 text-xs">•</span>
              <span className="text-white/60 text-xs font-mono flex items-center gap-1">
                <Calendar className="w-3 h-3 text-white/40" />
                {client.year}
              </span>

              <span className="text-white/30 text-xs">•</span>
              <span className="text-white/60 text-xs font-mono flex items-center gap-1">
                <Layers className="w-3 h-3 text-white/40" />
                {client.photos.length} stills
              </span>

              {client.location && (
                <>
                  <span className="text-white/30 text-xs">•</span>
                  <span className="text-white/60 text-xs">{client.location}</span>
                </>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white leading-tight">
              {client.name}
            </h1>

            <p className="text-xs sm:text-sm text-white/65 font-light leading-snug max-w-2xl mt-1 line-clamp-2">
              {client.description}
            </p>
          </div>

          {/* Right Logo & Roles: Sleek, compact */}
          <div className="flex items-center gap-3 shrink-0 self-start md:self-center">
            <div className="flex flex-col items-start md:items-end gap-1.5">
              <div className="flex items-center gap-1.5 flex-wrap md:justify-end">
                {client.roles.map((role, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] text-white/60 px-2 py-0.5 rounded-[4px] bg-white/5 border border-white/10"
                  >
                    {role}
                  </span>
                ))}
              </div>
            </div>

            <div
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-[8px] flex items-center justify-center p-2.5 backdrop-blur-sm shrink-0"
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.18)',
                boxShadow: `0 8px 24px -6px ${client.glowColor}`,
              }}
            >
              <img
                src={client.logo}
                alt={client.name}
                className="max-h-full max-w-full object-contain pointer-events-none select-none"
                style={{ filter: client.logoFilter }}
              />
            </div>
          </div>

        </div>
      </section>

      {/* COMPACT ASYMMETRICAL MASONRY GRID (10-14px spacing, crisp 6-8px corners, dense & aesthetically stunning) */}
      <main className="relative z-10 max-w-[1720px] mx-auto px-4 sm:px-6 md:px-10 pb-16">
        <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 640: 2, 1024: 3, 1440: 4 }}>
          <Masonry gutter="12px">
            {client.photos.map((photo, index) => (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.04 }}
                className="group relative flex flex-col cursor-pointer select-none"
                onClick={() =>
                  setSelectedPhoto({
                    title: photo.title,
                    category: `${client.category} • ${client.name}`,
                    year: photo.year || client.year,
                    image: photo.image,
                    description: photo.caption || client.description,
                  })
                }
              >
                {/* Photo Frame: Crisp rounded-[6px] / rounded-[8px], 12px gap, zero dead space */}
                <div
                  className="relative w-full overflow-hidden rounded-[8px] bg-black/50 border border-white/12 group-hover:border-white/35 transition-all duration-300 shadow-xl"
                  style={{
                    boxShadow: '0 8px 24px -6px rgba(0, 0, 0, 0.65)',
                  }}
                >
                  <img
                    src={photo.image}
                    alt={photo.title}
                    draggable={false}
                    onContextMenu={(e) => e.preventDefault()}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-auto block object-cover transition-transform duration-500 ease-out group-hover:scale-[1.018] select-none pointer-events-none"
                  />

                  {/* Subtle hover gradient and expand pill */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                  <div className="absolute top-2.5 right-2.5 w-7 h-7 rounded-[4px] bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200">
                    <ExternalLink className="w-3.5 h-3.5 text-white" />
                  </div>
                </div>

                {/* Compact Minimalist Caption Bar Directly Below Photo */}
                <div className="flex items-baseline justify-between gap-2 mt-1.5 px-0.5 select-none">
                  <span className="font-mono text-white/45 text-[10px] font-semibold tracking-wider">
                    {photo.indexStr}
                  </span>
                  <span className="text-white/80 text-[11px] font-semibold tracking-wider uppercase truncate">
                    {photo.title}
                  </span>
                </div>
              </motion.div>
            ))}
          </Masonry>
        </ResponsiveMasonry>

        {/* COMPACT BOTTOM EXPLORATION */}
        <div className="mt-14 pt-8 border-t border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="film-title text-lg md:text-xl text-white">More Photography Series</h3>
            <button
              onClick={handleBack}
              className="text-xs text-white/60 hover:text-white flex items-center gap-1 transition-colors font-medium"
            >
              All Works <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {otherClients.map((item) => (
              <div
                key={item.id}
                onClick={() => navigate(`/works/photography/${item.slug}`)}
                className="group relative rounded-[8px] p-3 overflow-hidden border border-white/10 hover:border-white/30 transition-all duration-200 cursor-pointer bg-white/5 hover:bg-white/10 flex items-center gap-3"
              >
                <div
                  className="w-10 h-10 rounded-[6px] flex items-center justify-center p-1.5 shrink-0 backdrop-blur-sm"
                  style={{
                    background: `${item.accentColor}20`,
                    border: `1px solid ${item.accentColor}40`,
                  }}
                >
                  <img
                    src={item.logo}
                    alt={item.name}
                    className="max-h-full max-w-full object-contain pointer-events-none select-none"
                    style={{ filter: item.logoFilter }}
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-[9px] uppercase font-semibold text-white/45 tracking-wider truncate">
                    {item.category} • {item.year}
                  </p>
                  <h4 className="text-white font-bold text-xs truncate group-hover:text-white transition-colors">
                    {item.name}
                  </h4>
                  <p className="text-[10px] text-white/55 font-mono">{item.photos.length} stills</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* FULLSCREEN LIGHTBOX MODAL */}
      {selectedPhoto && (
        <ImageModal
          isOpen={!!selectedPhoto}
          onClose={() => setSelectedPhoto(null)}
          image={selectedPhoto}
        />
      )}
    </div>
  );
}
