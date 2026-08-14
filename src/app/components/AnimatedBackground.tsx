const WARM = 0.20;

const fieldA = `radial-gradient(58% 54% at 30% 32%, rgba(3,44,125,0.95), transparent 62%),
                radial-gradient(54% 50% at 72% 70%, rgba(8,65,201,0.9), transparent 62%)`;
const fieldB = `radial-gradient(56% 52% at 74% 26%, rgba(29,151,241,0.85), transparent 60%),
                radial-gradient(50% 46% at 26% 76%, rgba(199,199,242,0.52), transparent 58%)`;
const fieldC = `radial-gradient(42% 40% at 54% 48%, rgba(255,150,90,${WARM}), transparent 60%),
                radial-gradient(38% 36% at 84% 84%, rgba(255,170,110,${WARM * 0.7}), transparent 60%)`;
const VODKA = `radial-gradient(circle at 50% 50%, rgba(199,199,242,0.6) 0%, rgba(150,170,242,0.26) 42%, transparent 70%)`;

const CSS = `
.ab-base{position:absolute;inset:0}
.ab-fa,.ab-fb,.ab-fc{position:absolute;inset:-70%;mix-blend-mode:screen}
.ab-fa{animation:ab-fa 18s ease-in-out infinite alternate}
.ab-fb{animation:ab-fb 22s ease-in-out infinite alternate}
.ab-fc{animation:ab-fc 26s ease-in-out infinite alternate}
.ab-lw1,.ab-lw2{position:absolute;top:50%;left:50%;max-width:1200px;max-height:1200px}
.ab-lw1{width:92vw;height:70vw;transform:translate(-50%,-50%) rotate(-14deg)}
.ab-lw2{width:72vw;height:94vw;transform:translate(-50%,-50%) rotate(18deg)}
.ab-l1,.ab-l2{width:100%;height:100%;mix-blend-mode:screen}
.ab-l1{animation:ab-l1 9s ease-in-out infinite}
.ab-l2{animation:ab-l2 12s ease-in-out infinite}
.ab-grain{position:absolute;inset:0;opacity:.06;mix-blend-mode:overlay;background-size:180px 180px;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")}
.ab-scrim{position:absolute;inset:0;background:rgba(2,13,47,.10)}
.ab-vig{position:absolute;inset:0;background:radial-gradient(circle at 50% 45%,transparent 52%,rgba(2,13,47,.30) 100%)}
.ab-fa,.ab-fb{will-change:transform}
@keyframes ab-fa{0%{transform:translate(-30%,-22%) rotate(-8deg) scale(1)}100%{transform:translate(32%,26%) rotate(8deg) scale(1.14)}}
@keyframes ab-fb{0%{transform:translate(34%,24%) rotate(10deg) scale(1.12)}100%{transform:translate(-28%,-24%) rotate(-10deg) scale(1)}}
@keyframes ab-fc{0%{transform:translate(-26%,28%) rotate(-6deg) scale(1)}100%{transform:translate(30%,-26%) rotate(12deg) scale(1.16)}}
@keyframes ab-l1{0%{transform:translate(-60%,-10%);opacity:0}15%{opacity:.95}85%{opacity:.95}100%{transform:translate(150%,22%);opacity:0}}
@keyframes ab-l2{0%{transform:translate(140%,12%);opacity:0}15%{opacity:.9}85%{opacity:.9}100%{transform:translate(-60%,-16%);opacity:0}}
@media (max-width:768px){
  .ab-fb,.ab-fc,.ab-lw2{display:none}
}
@media (prefers-reduced-motion:reduce){.ab-fa,.ab-fb,.ab-fc,.ab-l1,.ab-l2{animation:none!important}}
`;

export function AnimatedBackground({ hue = 0 }: { hue?: number } = {}) {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none" style={hue ? { filter: `hue-rotate(${hue}deg)` } : undefined}>
      <style>{CSS}</style>
      <div className="ab-base" style={{ background: 'linear-gradient(160deg, #020D2F 0%, #031a4d 48%, #020D2F 100%)' }} />
      <div className="ab-fa" style={{ background: fieldA }} />
      <div className="ab-fb" style={{ background: fieldB }} />
      <div className="ab-fc" style={{ background: fieldC }} />
      <div className="ab-lw1"><div className="ab-l1" style={{ background: VODKA }} /></div>
      <div className="ab-lw2"><div className="ab-l2" style={{ background: VODKA }} /></div>
      <div className="ab-grain" />
      <div className="ab-scrim" />
      <div className="ab-vig" />
    </div>
  );
}