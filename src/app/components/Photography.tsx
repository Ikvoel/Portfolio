import { motion } from "motion/react"
import { useInView } from "motion/react"
import { useRef, useState } from "react"
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry"
import { ImageModal } from "./ImageModal"

const photoGallery = [
	{
		id: 1,
		title: "Boiling Point",
		category: "Commercial",
		year: "2024",
		image: "https://i.ibb.co.com/bgDKXMjp/S3-N0-LOG-8.jpg",
		description: "Capturing raw emotion and authentic moments.",
	},
	{
		id: 5,
		title: "Ravina On Pose",
		category: "Potrait",
		year: "2023",
		image: "https://i.ibb.co.com/bj1VjhX4/S3-N0-LOG-12.jpg",
		description: "High-end portrait and fashion campaign.",
	},
	{
		id: 6,
		title: "Las Flores Pink Bourbon Beans Promo",
		category: "Commercial",
		year: "2023",
		image: "https://i.ibb.co.com/M53Q4YH3/S3-N0-LOG-23.jpg",
		description: "Minimalist product shots with dramatic lighting.",
	},
	{
		id: 7,
		title: "Brand Story",
		category: "Commercial",
		year: "2023",
		image: "https://i.ibb.co.com/93qzCY2N/snolog-5.jpg",
		description: "Expansive landscape for automotive commercial.",
	},
	{
		id: 8,
		title: "Studio Portrait",
		category: "Commercial",
		year: "2024",
		image: "https://i.ibb.co.com/1JfWkQYV/DSC00495.jpg",
		description: "Clean studio lighting for beauty campaign.",
	},
	{
		id: 2,
		title: "Urban Landscapes",
		category: "Potrait",
		year: "2024",
		image: "https://i.ibb.co.com/0R8vVq6g/S3-N0-LOG-2.jpg",
		description: "Exploring natural and urban landscapes.",
	},
	{
		id: 3,
		title: "Capturing Bernadya on stage.",
		category: "Street",
		year: "2024",
		image: "https://i.ibb.co.com/G48sf2NH/S3-N0-LOG-382.jpg",
		description: "Documenting everyday life and candid moments.",
	},
	{
		id: 4,
		title: "Wedding Moments",
		category: "Potrait",
		year: "2024",
		image: "https://i.ibb.co.com/Q3R5QZFM/S3-N0-LOG-2.jpg",
		description: "Preserving precious memories of special events.",
	},
	{
		id: 7,
		title: "",
		category: "Commercial",
		year: "2023",
		image: "https://i.ibb.co.com/RF2ShDQ/S3-N0-LOG-62.png",
		description: "Minimalist product shots with dramatic lighting.",
	},
	{
		id: 8,
		title: "",
		category: "Potrait",
		year: "2024",
		image: "https://i.ibb.co.com/V0RhGpnq/S3-N0-LOG-20.jpg",
		description: "Minimalist product shots with dramatic lighting.",
	},
	{
		id: 9,
		title: "",
		category: "Potrait",
		year: "2023",
		image: "https://i.ibb.co.com/xtCBGTFD/S3-N0-LOG-26.png",
		description: "Minimalist product shots with dramatic lighting.",
	},
	{
		id: 10,
		title: "",
		category: "Potrait",
		year: "2023",
		image: "https://i.ibb.co.com/Q7cV6RB2/S3-N0-LOG-333.png",
		description: "Minimalist product shots with dramatic lighting.",
	},
	{
		id: 11,
		title: "",
		category: "Potrait",
		year: "2023",
		image: "https://i.ibb.co.com/9kD7Z3ww/DSC07487.jpg",
		description: "Minimalist product shots with dramatic lighting.",
	},
	{
		id: 12,
		title: "",
		category: "Potrait",
		year: "2023",
		image: "https://i.ibb.co.com/dNTHVrc/DSC02462.jpg",
		description: "Minimalist product shots with dramatic lighting.",
	},
	{
		id: 13,
		title: "",
		category: "Commercial",
		year: "2023",
		image: "https://i.ibb.co.com/zVDp0Vw0/S3-N0-LOG-19.jpg",
		description: "Minimalist product shots with dramatic lighting.",
	},
	{
		id: 14,
		title: "",
		category: "Potrait",
		year: "2023",
		image: "https://i.ibb.co.com/B2x1jj5t/DSC09230.jpg",
		description: "Minimalist product shots with dramatic lighting.",
	},
	{
		id: 15,
		title: "",
		category: "Commercial",
		year: "2023",
		image: "https://i.ibb.co.com/j9FSjz8x/S3-N0-LOG-7.jpg",
		description: "Minimalist product shots with dramatic lighting.",
	},
	{
		id: 16,
		title: "Latte Art",
		category: "Commercial",
		year: "2023",
		image: "https://i.ibb.co.com/9HpST4jD/LRM-20230609-143215.jpg",
		description: "Minimalist product shots with dramatic lighting.",
	},
	{
		id: 17,
		title: "",
		category: "Commercial",
		year: "2024",
		image: "https://i.ibb.co.com/23JsYKKB/S3-N0-LOG-14-of-14.jpg",
		description: "Minimalist product shots with dramatic lighting.",
	},
	{
		id: 17,
		title: "",
		category: "Potrait",
		year: "2023",
		image: "",
		description: "Minimalist product shots with dramatic lighting.",
	},
	{
		id: 17,
		title: "",
		category: "Potrait",
		year: "2023",
		image: "",
		description: "Minimalist product shots with dramatic lighting.",
	},
]

export function Photography() {
	const ref = useRef(null)
	const isInView = useInView(ref, { once: true, amount: 0.1 })

	const [selectedImage, setSelectedImage] = useState<(typeof photoGallery)[0] | null>(null)
	const [hoveredId, setHoveredId] = useState<number | null>(null)

	const groupedPhotos = {
		Commercial: photoGallery.filter((p) => p.category === "Commercial"),
		Potrait: photoGallery.filter((p) => p.category === "Potrait"),
		Street: photoGallery.filter((p) => p.category === "Street"),
		Event: photoGallery.filter((p) => p.category === "Event"),
	}

	return (
		<section ref={ref} className="py-24 px-4 relative overflow-hidden">
			<div className="max-w-7xl mx-auto relative z-10">
				{/* HEADER */}
				<motion.div initial={{ opacity: 0, y: 40 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7 }} className="text-center mb-16">
					<h2 className="section-title mb-4 text-white">Photography</h2>
					<p className="body-text text-white/50 text-sm mb-8">Selected still imagery</p>
				</motion.div>

				{Object.entries(groupedPhotos).map(([category, photos]) => {
					if (photos.length === 0) return null

					return (
						<div key={category} className="mb-24 last:mb-0">
							<motion.div
								initial={{ opacity: 0, x: -20 }}
								whileInView={{ opacity: 1, x: 0 }}
								viewport={{ once: true, margin: "-100px" }}
								transition={{ duration: 0.5 }}
								className="mb-8 flex items-center gap-4"
							>
								<h3 className="film-title text-2xl md:text-3xl text-white">{category}</h3>
								<div className="h-[1px] flex-grow bg-gradient-to-r from-white/20 to-transparent" />
							</motion.div>

							{/* ALL CATEGORIES NOW USE MASONRY GRID */}
							<ResponsiveMasonry columnsCountBreakPoints={{ 350: 2, 900: 3, 1200: 4 }}>
								<Masonry gutter="1rem">
									{photos
										.filter((p) => p.image)
										.map((photo, index) => (
											<motion.div
												key={photo.id + "-" + index}
												initial={{ opacity: 0, y: 20 }}
												animate={isInView ? { opacity: 1, y: 0 } : {}}
												transition={{ duration: 0.5, delay: index * 0.05 }}
												className="relative group cursor-pointer"
												onMouseEnter={() => setHoveredId(photo.id)}
												onMouseLeave={() => setHoveredId(null)}
												onClick={() => setSelectedImage(photo)}
											>
												{/* CARD */}
												<motion.div whileHover={{ scale: 1.015 }} transition={{ type: "spring", stiffness: 260, damping: 22 }} className="relative overflow-hidden rounded-xl bg-black/20">
													<img src={photo.image} alt={photo.title} loading="lazy" decoding="async" className="w-full h-auto object-cover" style={{ display: "block" }} />

													{/* Hover Overlay with red accent */}
													<motion.div
														className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3"
														initial={{ opacity: 0 }}
														animate={{ opacity: hoveredId === photo.id ? 1 : 0 }}
													>
														{photo.title && <p className="text-white/90 text-sm font-medium mb-1">{photo.title}</p>}
														<div className="flex items-center gap-2 text-xs">
															<p className="metadata text-white/70">{photo.year}</p>
															{photo.title && (
																<>
																	<div className="w-1 h-1 rounded-full bg-[var(--accent-red)]" />
																	<p className="metadata text-white/50">{photo.category}</p>
																</>
															)}
														</div>
													</motion.div>

													{/* Red accent border on hover */}
													<div className="absolute inset-0 border border-transparent group-hover:border-[var(--accent-red-subtle)] transition-all duration-300 rounded-xl pointer-events-none" />
												</motion.div>
											</motion.div>
										))}
								</Masonry>
							</ResponsiveMasonry>
						</div>
					)
				})}
			</div>

			{/* MODAL */}
			{selectedImage && <ImageModal isOpen={!!selectedImage} onClose={() => setSelectedImage(null)} image={selectedImage} />}
		</section>
	)
}
