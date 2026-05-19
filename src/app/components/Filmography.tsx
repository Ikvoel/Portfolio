import { motion } from "motion/react"
import { useInView } from "motion/react"
import { useRef, useState } from "react"
import React from "react"
import { FilmProject } from "./FilmProject"
import { CommercialMV } from "./CommercialMV"

const projects = [
	{
		id: 1,
		title: "My Hand, Her Signature",
		category: "Short Film",
		year: "2026",
		description: "A young painter is in danger of losing the most important exhibition of his career because another figure within him keeps destroying his paintings.",
		image: "https://i.ibb.co.com/xqZk5hdm/Still-2026-05-07-172137-1-53-2.jpg",
		videoUrl: "Not available",
		roles: ["Writter", "Director of Photography", "Music Score"],
		cinematicStills: [],
		clientLogos: [{ name: "Aftertone Pictures", logo: "https://i.ibb.co.com/B5dk6Z9Q/logo-aftertone-white-color.png", hasGlassBadge: false }],
	},
	{
		id: 3,
		title: "Bounce Of Memories",
		category: "Short Film",
		year: "2025",
		description: "A teenager and her mother, trapped in a strained relationship, must confront their emotional distance and find a way to mend what has been broken.",
		image: "https://i.ibb.co.com/rKMxyV5N/Still-2025-12-31-165429-1-23-6.jpg",
		videoUrl: "https://drive.google.com/file/d/1I6hRukhDDjFUlhFn0mxOxigfkJa0_tHi/preview",
		roles: ["Director of Photography", "Colorist", "Music Score"],
		cinematicStills: [
			"https://i.ibb.co.com/dwkgZPpF/Still-2025-12-31-165429-1-1-2.jpg",
			"https://i.ibb.co.com/qLny5zM7/Still-2025-12-31-165429-1-4-2.jpg",
			"https://i.ibb.co.com/DDmXj9yx/Still-2025-12-31-165429-1-9-4.jpg",
			"https://i.ibb.co.com/ZzsNLsHK/Still-2025-12-31-165429-1-22-4.jpg",
		],
		clientLogos: [{ name: "Aftertone Pictures", logo: "https://i.ibb.co.com/B5dk6Z9Q/logo-aftertone-white-color.png", hasGlassBadge: false }],
	},
	{
		id: 2,
		title: "Matcha",
		category: "Short Film",
		year: "2025",
		description:
			"In a calm, understated job interview, Gracia is asked about her favorite drink. Her answer, matcha, triggers a series of intimate memories moments, silent laughter, and a presence that once felt close.",
		image: "https://i.ibb.co.com/YTZD58vL/still-kedua-1-48-1.jpg",
		videoUrl: "https://drive.google.com/file/d/1ZyzkPKSyEyvtr7JRHftPhSDk6jhsnL0w/preview",
		roles: ["Writter", "Director", "Cinematographer", "Editor"],
		cinematicStills: [
			"https://i.ibb.co.com/4w0dMb8S/Still-2025-12-23-074938-1-2-1.jpg",
			"https://i.ibb.co.com/bj6Zf0hW/Still-2025-12-23-074938-1-12-1.jpg",
			"https://i.ibb.co.com/jv4Nqb1h/Still-2025-12-23-074938-1-48-1.jpg",
			"https://i.ibb.co.com/HpXY8XPZ/Still-2025-12-23-074938-1-49-1.jpg",
		],
	},
	{
		id: 4,
		title: "BAM!",
		category: "Short Film",
		year: "2025",
		description: "Left home alone while their parents are away, siblings Rani and Doni clash over an all-in-one universal remote capable of controlling everything in the house.",
		image: "https://i.ibb.co.com/BV7SLvV2/Still-2025-12-31-174333-1-58-50.jpg",
		videoUrl: "https://drive.google.com/file/d/1Hh24i0VKjqOhgNKBqJWmgKc-0rjkcUzy/preview",
		roles: ["Director of Photography", "Editor", "Colorist"],
		cinematicStills: [
			"https://i.ibb.co.com/FNLrkJy/Still-2025-12-31-174333-1-58-4.jpg",
			"https://i.ibb.co.com/DHMcJ6PK/Still-2025-12-31-174333-1-58-32.jpg",
			"https://i.ibb.co.com/DdK5gL1/Still-2025-12-31-174333-1-58-43.jpg",
			"https://i.ibb.co.com/CKjW5MZN/Still-2025-12-31-174333-1-58-62.jpg",
		],
		clientLogos: [{ name: "Wawayu Pictures", logo: "https://i.ibb.co.com/qYfk4ZbZ/logo.png", hasGlassBadge: false }],
	},
	{
		id: 5,
		title: "Laberinto De Illusione",
		category: "Short Film",
		year: "2024",
		description: "Lale falls for a virtual girl, but every moment together is just his hallucination.",
		image: "https://i.ibb.co.com/V05BdGpv/C0140-00-05-13-13-Still002.png",
		videoUrl: "https://drive.google.com/file/d/1s1T09HFmuxt9tloOWAlwPfdPaOP4-8Ek/preview",
		roles: ["Writter", "Director", "Editor"],
		cinematicStills: [
			"https://i.ibb.co.com/LjdPLvg/C0140-00-01-28-02-Still008.png",
			"https://i.ibb.co.com/Gv9wVTBP/C0140-00-02-52-06-Still026.png",
			"https://i.ibb.co.com/TZgWDVt/C0140-00-03-30-07-Still001.png",
			"https://i.ibb.co.com/ynJHfnf6/C0140-00-03-48-21-Still004.png",
		],
	},
	{
		id: 6,
		title: "TNCR Kerinci Beans Promotion",
		category: "Commercial",
		year: "2024",
		description: "",
		image: "https://i.ibb.co.com/Jw55CwfL/Still-2025-12-31-190923-1-59-1.jpg",
		videoUrl: "https://drive.google.com/file/d/1LtqPetNNoQMukXisUFIZArnO2CEUbScd/preview",
		roles: ["Cinematographer"],
	},
	{
		id: 7,
		title: "TNCR 7th Anniversary",
		category: "Commercial",
		year: "2023",
		description: "",
		image:
			"https://images.unsplash.com/photo-1552694062-ccf53289a8da?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3ZpZSUyMHByb2R1Y3Rpb24lMjBzZXR8ZW58MXx8fHwxNzY1NDM5NzU3fDA&ixlib=rb-4.1.0&q=80&w=1080",
		videoUrl: "https://drive.google.com/file/d/1npPLWyIgdwmkK88ev5txpccc2Q-cQkuC/preview",
		roles: ["Director of Photography", "Editor"],
	},
	{
		id: 8,
		title: "Lama - Lama",
		category: "Personal Projects",
		year: "2024",
		description: "",
		image: "https://i.ibb.co.com/WWHvWR9v/Still-2025-12-31-183048-1-58-70.jpg",
		videoUrl: "https://drive.google.com/file/d/17x8tTFdwFE_L67_aY6noOlgaaXIEV4RJ/preview",
		roles: ["Director", "Writer", "Editor"],
	},
	{
		id: 9,
		title: "Barudi Kopi Ethiophia Beans",
		category: "Commercial",
		year: "2024",
		description: "",
		image: "https://i.ibb.co.com/RpbF3DVP/Still-2025-12-31-190923-1-60-2.jpg",
		videoUrl: "https://drive.google.com/file/d/1t8ZiPYwQ4M2zogcuWy31OEgMDqgi0wGk/preview",
		roles: ["Cinematographer"],
	},
	{
		id: 10,
		title: "TNCR Operational Hour",
		category: "Commercial",
		year: "2024",
		description: "",
		image: "https://i.ibb.co.com/m5bRMvqB/Still-2025-12-31-190923-1-58-2.jpg",
		videoUrl: "https://drive.google.com/file/d/1WznTJfABJzIajt8JATS8rbTMiCYHWhpR/preview",
		roles: ["Director", "Writer", "Editor"],
	},
	{
		id: 11,
		title: "School Company Profile - Assignment",
		category: "Personal Projects",
		year: "2024",
		description: "",
		image: "https://i.ibb.co.com/CKzFH3Tc/Still-2025-12-31-190923-1-62-1.jpg",
		videoUrl: "https://drive.google.com/file/d/1wmBcC16ZXpw7o4ZrGSCAqN1vqcz6vXwh/preview",
		roles: ["Writter", "Director", "Cinematographer", "Editor"],
	},
	{
		id: 12,
		title: "TNCR -  Making Greypresso Machiato",
		category: "Commercial",
		year: "2024",
		description: "",
		image: "https://i.ibb.co.com/m5bRMvqB/Still-2025-12-31-190923-1-58-2.jpg",
		videoUrl: "https://drive.google.com/file/d/1l5M6AzNBiHOYa4nX1UrIQYjoXH97P9Ze/preview",
		roles: ["Director", "Writer", "Editor"],
	},
	{
		id: 13,
		title: "Saling Isi Opening Promo",
		category: "Commercial",
		year: "2023",
		description: "",
		image: "https://i.ibb.co.com/m5bRMvqB/Still-2025-12-31-190923-1-58-2.jpg",
		videoUrl: "https://drive.google.com/file/d/13id_Khu7FP9zYmGkP2oaezXyx9s3m7dl/preview",
		roles: ["Director", "Writer", "Editor"],
	},
	{
		id: 14,
		title: "Boiling Point Opening Promotion",
		category: "Commercial",
		year: "2024",
		description: "",
		image: "https://i.ibb.co.com/vCD0WKhP/S3-N0-LOG-7.jpg",
		videoUrl: "https://drive.google.com/file/d/1Y0nOnm0NIWr07XfLt0B2vInuf9VIOeQu/preview",
		roles: ["Director", "Writer", "Editor"],
	},
	{
		id: 15,
		title: "Boiling Point Drink Promo",
		category: "Commercial",
		year: "2024",
		description: "",
		image: "https://i.ibb.co.com/TB6YvmR4/S3-N0-LOG-50.jpg",
		videoUrl: "https://drive.google.com/file/d/1jPRE0gPU45_dPYEAbrrKm0Lng-t3xWtz/preview",
		roles: ["Director", "Writer", "Editor"],
	},
	{
		id: 16,
		title: "Boiling Point Opening Promo",
		category: "Commercial",
		year: "2024",
		description: "",
		image: "https://i.ibb.co.com/m5bRMvqB/Still-2025-12-31-190923-1-58-2.jpg",
		videoUrl: "https://drive.google.com/file/d/1WznTJfABJzIajt8JATS8rbTMiCYHWhpR/preview",
		roles: ["Director", "Writer", "Editor"],
	},
	{
		id: 17,
		title: "Enjoing the sunrise",
		category: "Personal Projects",
		year: "2024",
		description: "",
		image: "https://i.ibb.co.com/m5bRMvqB/Still-2025-12-31-190923-1-58-2.jpg",
		videoUrl: "https://drive.google.com/file/d/1oU7CyDyzLufDJckvhAvY6F3kU5XsA_bM/preview",
		roles: ["Director", "Editor"],
	},
	{
		id: 18,
		title: "Lets make Sour Candy - TNCR",
		category: "Commercial",
		year: "2023",
		description: "",
		image: "https://i.ibb.co.com/m5bRMvqB/Still-2025-12-31-190923-1-58-2.jpg",
		videoUrl: "https://drive.google.com/file/d/1oU7CyDyzLufDJckvhAvY6F3kU5XsA_bM/preview",
		roles: ["Titik Nyeduh Coffee Roaster"],
	},
	{
		id: 19,
		title: "Enjoing the sunrise",
		category: "Personal Projects",
		year: "2024",
		description: "",
		image: "https://i.ibb.co.com/m5bRMvqB/Still-2025-12-31-190923-1-58-2.jpg",
		videoUrl: "https://drive.google.com/file/d/1oU7CyDyzLufDJckvhAvY6F3kU5XsA_bM/preview",
		roles: ["Director", "Editor"],
	},

]

export function Filmography() {
	const ref = useRef(null)
	const isInView = useInView(ref, { once: true, amount: 0.1 })

	const groupedProjects = {
		"Short Film": projects.filter((p) => p.category === "Short Film"),
		Commercial: projects.filter((p) => p.category === "Commercial"),
		"Personal Projects": projects.filter((p) => p.category === "Personal Projects"),
		"Music Video": projects.filter((p) => p.category === "Music Video"),
	}

	return (
		<section ref={ref} className="py-24 px-4 relative overflow-hidden">
			<div className="max-w-7xl mx-auto relative z-10">
				<motion.div initial={{ opacity: 0, y: 40 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7 }} className="text-center mb-16">
					{/* Section title - Glamour Absolute font */}
					<h2 className="section-title mb-4 text-white">Selected Works</h2>

					{/* Minimal secondary text */}
					<p className="body-text text-white/50 max-w-2xl mx-auto text-sm">A curated selection of recent work</p>
				</motion.div>

				{Object.entries(groupedProjects).map(([category, categoryProjects]) => {
					if (categoryProjects.length === 0) return null

					return (
						<React.Fragment key={category}>
							<div className="mb-24 last:mb-0">
								<motion.div
									initial={{ opacity: 0, x: -20 }}
									whileInView={{ opacity: 1, x: 0 }}
									viewport={{ once: true, margin: "-100px" }}
									transition={{ duration: 0.5 }}
									className="mb-8 flex items-center gap-4"
								>
									<h3 className="film-title text-2xl md:text-3xl text-white">{category === "Short Film" ? "Short Film" : category}</h3>
									<div className="h-[1px] flex-grow bg-gradient-to-r from-white/20 to-transparent" />
								</motion.div>

								{/* Projects Grid */}
								<motion.div className="grid grid-cols-1 md:grid-cols-2 gap-8">
									{categoryProjects.map((project, index) => (
										<FilmProject key={project.id} project={project} index={index} isInView={isInView} />
									))}
								</motion.div>
							</div>

							{category === "Short Film" && (
								<div className="-mx-4 md:-mx-8 lg:-mx-16 my-8">
									<CommercialMV />
								</div>
							)}
						</React.Fragment>
					)
				})}
			</div>
		</section>
	)
}