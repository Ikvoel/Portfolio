import { motion } from "motion/react"
import { useInView } from "motion/react"
import { useRef } from "react"
import { OptimizedImage } from "./ui/OptimizedImage"

const btsPhotos = [
	{ id: 1, src: "https://res.cloudinary.com/asfa6j6o/image/upload/v1783534427/SEN-10_etoyce.jpg", alt: "On set moment" },
	{ id: 2, src: "https://res.cloudinary.com/asfa6j6o/image/upload/v1783534717/Resigned-330_c0seiq.jpg", alt: "Assistant Camera Work" },
	{ id: 3, src: "https://res.cloudinary.com/asfa6j6o/image/upload/v1783534448/SEN-8_sns9t1.jpg", alt: "Behind the scenes" },
	{ id: 4, src: "https://res.cloudinary.com/asfa6j6o/image/upload/v1783534423/SEN-3_qchht3.jpg", alt: "On set moment" },
	{ id: 5, src: "https://res.cloudinary.com/asfa6j6o/image/upload/v1783535471/SEN-6_tdyd6u.jpg", alt: "Set work" },
	// Add more BTS photos here
]

export function About() {
	const ref = useRef(null)
	const isInView = useInView(ref, { once: true, amount: 0.3 })

	return (
		<section ref={ref} className="py-24 px-4 md:px-6 relative overflow-hidden">
			<div className="max-w-7xl mx-auto relative z-10">
				<motion.div initial={{ opacity: 0, y: 40 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7 }} className="mb-16">
					{/* Section title - Glamour Absolute font */}
					<h2 className="section-title mb-16 text-white text-center">About</h2>

					{/* Cinematic About Layout */}
					<div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 max-w-6xl mx-auto">
						{/* Left: Main Profile Photo */}
						<div className="lg:col-span-5">
							<motion.div
								initial={{ opacity: 0, x: -20 }}
								animate={isInView ? { opacity: 1, x: 0 } : {}}
								transition={{ duration: 0.8 }}
								className="relative aspect-[3/4] rounded-2xl overflow-hidden group"
							>
								<OptimizedImage
									src="https://res.cloudinary.com/asfa6j6o/image/upload/v1783534787/20251009_124714_tvbntb.jpg"
									alt="Seno - Filmmaker"
									className="w-full h-full grayscale opacity-90 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
								/>
								{/* Subtle red accent border on hover */}
								<div className="absolute inset-0 border-2 border-transparent group-hover:border-[var(--accent-red-subtle)] transition-all duration-500 rounded-2xl pointer-events-none" />

								{/* Location indicator with red accent */}
								<div className="absolute bottom-4 left-4 z-10">
									<div className="flex items-center gap-2 glass-card px-3 py-2 rounded-full">
										<div className="w-1.5 h-1.5 rounded-full bg-[var(--accent-red)] animate-pulse" />
										<span className="metadata text-white/80 text-xs">Jakarta, ID</span>
									</div>
								</div>
							</motion.div>
						</div>

						{/* Right: Bio + Horizontal BTS Scroll */}
						<div className="lg:col-span-7 flex flex-col justify-between gap-6 lg:gap-8">
							{/* Bio Text */}
							<motion.div initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, delay: 0.2 }} className="space-y-6">
								<p className="body-text text-white/90 leading-relaxed text-base md:text-lg">
									Based in Jakarta, <span className="text-white font-medium">Seno</span> is a multidisciplinary filmmaker focusing on emotionally-driven narratives, intimate visuals, and atmospheric
									storytelling.
								</p>
								<p className="body-text text-white/80 leading-relaxed text-base">
									Currently exploring themes of identity, isolation, and psychological tension through narrative and experimental film.
								</p>
							</motion.div>

							{/* Horizontal Scrolling BTS Photos Panel (60% height of main photo) */}
							<motion.div initial={{ opacity: 0, x: 20 }} animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.8, delay: 0.4 }} className="relative">
								{/* Label with red accent line */}
								<div className="flex items-center gap-3 mb-4">
									<div className="w-8 h-px bg-[var(--accent-red)]" />
									<span className="metadata text-white/50 text-xs uppercase tracking-wider">On-Set / Behind The Scenes</span>
									<div className="h-px flex-grow bg-white/10" />
								</div>

								{/* Horizontal Scroll Container - 60% height of main photo aspect */}
								<div
									className="overflow-x-auto overflow-y-hidden pb-3 -mx-4 px-4 md:mx-0 md:px-0"
									style={{
										scrollbarWidth: "thin",
										scrollbarColor: "rgba(205, 92, 92, 0.3) transparent",
									}}
								>
									<div className="flex gap-3 md:gap-4" style={{ height: "clamp(180px, 45vw, 280px)" }}>
										{btsPhotos.map((photo, index) => (
											<motion.div
												key={photo.id}
												initial={{ opacity: 0, x: 20 }}
												animate={isInView ? { opacity: 1, x: 0 } : {}}
												transition={{ duration: 0.5, delay: 0.5 + index * 0.08 }}
												className="flex-shrink-0 relative rounded-xl overflow-hidden group cursor-pointer"
												style={{ width: "clamp(140px, 35vw, 210px)", height: "100%" }}
											>
												<OptimizedImage
													src={photo.src}
													alt={photo.alt}
													className="w-full h-full grayscale group-hover:grayscale-0 transition-all duration-500"
												/>
												{/* Subtle overlay */}
												<div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-all duration-500" />
												{/* Red accent border on hover */}
												<div className="absolute inset-0 border border-transparent group-hover:border-[var(--accent-red-subtle)] transition-all duration-300 rounded-xl" />
											</motion.div>
										))}
									</div>
								</div>
							</motion.div>
						</div>
					</div>
				</motion.div>
			</div>

			{/* Custom scrollbar styles for WebKit browsers */}
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
