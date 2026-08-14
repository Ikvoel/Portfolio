import { OptimizedImage } from "./ui/OptimizedImage"

import bts1 from "@/assets/images/bts/1.webp"
import bts2 from "@/assets/images/bts/2.webp"
import bts3 from "@/assets/images/bts/3.webp"
import bts4 from "@/assets/images/bts/4.webp"
import bts5 from "@/assets/images/bts/5.webp"

const btsPhotos = [
	{ id: 1, src: bts1, alt: "On set moment" },
	{ id: 2, src: bts2, alt: "Assistant Camera Work" },
	{ id: 3, src: bts3, alt: "Behind the scenes" },
	{ id: 4, src: bts4, alt: "On set moment" },
	{ id: 5, src: bts5, alt: "Set work" },
]

export function About() {
	return (
		<section className="py-24 px-4 md:px-6 relative overflow-hidden">
			<div className="max-w-7xl mx-auto relative z-10">
				<div className="mb-16">
					<h2 className="section-title mb-16 text-white text-center">About</h2>

					<div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 max-w-6xl mx-auto">
						{/* Left: Main Profile Photo */}
						<div className="lg:col-span-5">
							<div className="relative aspect-[3/4] rounded-2xl overflow-hidden group">
								<OptimizedImage
									src="https://res.cloudinary.com/asfa6j6o/image/upload/v1783534787/20251009_124714_tvbntb.jpg"
									alt="Seno - Filmmaker"
									className="w-full h-full grayscale opacity-90 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
								/>
								<div className="absolute inset-0 border-2 border-transparent group-hover:border-[var(--accent-red-subtle)] transition-all duration-500 rounded-2xl pointer-events-none" />

								<div className="absolute bottom-4 left-4 z-10">
									<div className="flex items-center gap-2 liquid-glass-badge px-3 py-2 rounded-full">
										<div className="w-1.5 h-1.5 rounded-full bg-[var(--accent-red)] animate-pulse" />
										<span className="metadata text-white/90 text-xs">Jakarta, ID</span>
									</div>
								</div>
							</div>
						</div>

						{/* Right: Bio + Horizontal BTS Scroll */}
						<div className="lg:col-span-7 flex flex-col justify-between gap-6 lg:gap-8">
							<div className="space-y-6">
								<p className="body-text text-white/90 leading-relaxed text-base md:text-lg">
									Based in Jakarta, <span className="text-white font-medium">Muhammad Nur Husein (aka.Seno)</span> is a multidisciplinary filmmaker focusing on emotionally-driven narratives, intimate visuals, and atmospheric
									storytelling.
								</p>
								<p className="body-text text-white/80 leading-relaxed text-base">
									Currently exploring themes of identity, isolation, and psychological tension through narrative and experimental film.
								</p>
							</div>

							<div className="relative">
								<div className="flex items-center gap-3 mb-4">
									<div className="w-8 h-px bg-[var(--accent-red)]" />
									<span className="metadata text-white/50 text-xs uppercase tracking-wider">On-Set / Behind The Scenes</span>
									<div className="h-px flex-grow bg-white/10" />
								</div>

								<div
									className="overflow-x-auto overflow-y-hidden pb-3 -mx-4 px-4 md:mx-0 md:px-0"
									style={{
										scrollbarWidth: "thin",
										scrollbarColor: "rgba(205, 92, 92, 0.3) transparent",
									}}
								>
									<div className="flex gap-3 md:gap-4" style={{ height: "clamp(180px, 45vw, 280px)" }}>
										{btsPhotos.map((photo) => (
											<div
												key={photo.id}
												className="flex-shrink-0 relative rounded-xl overflow-hidden group cursor-pointer"
												style={{ width: "clamp(140px, 35vw, 210px)", height: "100%" }}
											>
												<OptimizedImage src={photo.src} alt={photo.alt} className="w-full h-full grayscale group-hover:grayscale-0 transition-all duration-500" />
												<div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-all duration-500" />
												<div className="absolute inset-0 border border-transparent group-hover:border-[var(--accent-red-subtle)] transition-all duration-300 rounded-xl" />
											</div>
										))}
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<style>{`
        div::-webkit-scrollbar {
          height: 4px;
        }
        div::-webkit-scrollbar-track {
          background: transparent;
        }
        div::-webkit-scrollbar-thumb {
          background: var(--accent-red-subtle);
          border-radius: 2px;
        }
        div::-webkit-scrollbar-thumb:hover {
          background: var(--accent-red-soft);
        }
      `}</style>
		</section>
	)
}