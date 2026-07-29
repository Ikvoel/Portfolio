import { motion } from "motion/react"
import { useInView } from "motion/react"
import { useRef } from "react"
import React from "react"
import { FilmProject } from "./FilmProject"
import { CommercialMV } from "./CommercialMV"
import logoLaberintoDeIllusione from "../../assets/logo_laberinto_de_illusione.svg"
import aftone from "@/assets/images/logo/aftone.png"
import wawayu from "@/assets/images/logo/wawayu.png"
import mhhsTle from "@/assets/images/cstm-title/mhhsTle.png"
import bamTitle from "@/assets/images/cstm-title/bamTitle.png"
import hsno from "@/assets/images/logo/hsno.png"
import matchaTle from "@/assets/images/cstm-title/matchaTle.png"
import bomTle from "@/assets/images/cstm-title/bomTle.png"
import mhhs1 from "@/assets/images/mhhs/mhhs1.webp"
import mhhs2 from "@/assets/images/mhhs/mhhs2.webp"
import mhhs3 from "@/assets/images/mhhs/mhhs3.webp"
import mhhs4 from "@/assets/images/mhhs/mhhs4.webp"
import mhhs5 from "@/assets/images/mhhs/mhhs5.webp"
import mhhs6 from "@/assets/images/mhhs/mhhs6.webp"
import mtc1 from "@/assets/images/matcha/mtc1.webp"
import mtc2 from "@/assets/images/matcha/mtc2.webp"
import mtc3 from "@/assets/images/matcha/mtc3.webp"
import mtc4 from "@/assets/images/matcha/mtc4.webp"
import mtc5 from "@/assets/images/matcha/mtc5.webp"
import mtc6 from "@/assets/images/matcha/mtc6.webp"
import bom1 from "@/assets/images/bom/bom1.webp"
import bom2 from "@/assets/images/bom/bom2.webp"
import bom3 from "@/assets/images/bom/bom3.webp"
import bom4 from "@/assets/images/bom/bom4.webp"
import bom5 from "@/assets/images/bom/bom5.webp"
import bam1 from "@/assets/images/bam/bam1.webp"
import bam2 from "@/assets/images/bam/bam2.webp"
import bam3 from "@/assets/images/bam/bam3.webp"
import bam4 from "@/assets/images/bam/bam4.webp"
import bam5 from "@/assets/images/bam/bam5.webp"
import bam6 from "@/assets/images/bam/bam6.webp"
import lale1 from "@/assets/images/laberinto/lale1.webp"
import lale2 from "@/assets/images/laberinto/lale2.webp"
import lale3 from "@/assets/images/laberinto/lale3.webp"
import lale4 from "@/assets/images/laberinto/lale4.webp"
import lale5 from "@/assets/images/laberinto/lale5.webp"
import lale6 from "@/assets/images/laberinto/lale6.webp"
import lale7 from "@/assets/images/laberinto/lale7.webp"


const projects = [
	{
		id: 1,
		title: "My Hand, Her Signature",
		category: "Short Film",
		year: "2026",
		description: "A young painter risks losing the most important exhibition of her career as another presence within herself continues to destroy her paintings.",
		image: mhhs3,
		videoUrl: "https://res.cloudinary.com/asfa6j6o/video/upload/v1784634115/MyHandHerSignature_Trailer_lhj3ob.mp4",
		credits: [
			{ role: 'Writer', name: 'Muhammad Nur Husein, Valerianus Alvin Tjuarsa' },
			{ role: 'Director', name: 'Valerianus Alvin Tjuarsa' },
			{ role: 'Producer', name: 'Daniella Nediva' },
			{ role: 'Production Manager', name: 'Miracle Bernadette Louisa Tumion' },
			{ role: 'Director of Photography', name: 'Muhammad Nur Husein' },
			{ role: 'Production Designer', name: 'Mark Hector Jedidiah' },
			{ role: 'Art Director', name: 'Muhammad Farhan Fidaputra' },
			{ role: 'Assistant Director', name: 'Alodia Alfreda' },
			{ role: 'Gaffer', name: 'Ilham Nouval' },
			{ role: 'Sound Recordist', name: 'Farrel Goan Nessel' },
			{ role: 'Editor', name: 'Lady Rahma Cantique Kusuma' },
			{ role: 'Colorist', name: 'Marcello Hannan' },
			{ role: 'Sound Designer', name: 'Frizello Nathanael' },
			{ role: 'Composer', name: 'Muhammad Nur Husein' },
		],
		cinematicStills: [
			mhhs6,
			mhhs5,
			mhhs4,
		],
		clientLogos: [{ name: "Aftrtone Pictures", logo: aftone, hasGlassBadge: false }],
		titleImage: mhhsTle,
	},
	{
		id: 2,
		title: "Matcha",
		category: "Short Film",
		year: "2025",
		description: "In a calm, understated job interview, Gracia is asked about her favorite drink. Her answer, matcha, triggers a series of intimate memories moments, silent laughter, and a presence that once felt close.",
		image: mtc1,
		videoUrl: "https://www.youtube.com/watch?v=Z9GuYM-cOiM",
		credits: [
			{ role: 'Writer & Director', name: 'Muhammad Nur Husein' },
			{ role: 'Production Support', name: 'Valerianus Alvin Tjuarsa' },
			{ role: 'Talent Support', name: 'Lady Rahma Cantique Kusuma, Rachel Ratu Kiana' },
			{ role: 'Cast', name: 'Maeluna Quinteva, Muhammad Farhan, Jose Richie' },
			{ role: 'Editor & Colorist', name: 'Muhammad Nur Husein' },
		],
		cinematicStills: [
			mtc2,
			mtc3,
			mtc4,
			mtc5,
			mtc6,
		],
		clientLogos: [{ name: hsno, logo: hsno, hasGlassBadge: false }],
		titleImage: matchaTle,
	},
	{
		id: 3,
		title: "Bounce Of Memories",
		category: "Short Film",
		year: "2025",
		description: "A teenager and her mother, trapped in a strained relationship, must confront their emotional distance and find a way to mend what has been broken.",
		image: bom1,
		videoUrl: "https://drive.google.com/file/d/1I6hRukhDDjFUlhFn0mxOxigfkJa0_tHi/preview",
		credits: [
			{ role: 'Writer', name: 'Willeam Hezekiah Gunawan, Allegro Bima Satria, Gianda Emirza Fatir' },
			{ role: 'Director', name: 'Alodia Alfreda' },
			{ role: 'Producer', name: 'Daniella Nediva' },
			{ role: 'Production Manager', name: 'Mark Hector Jedidiah' },
			{ role: 'Director of Photography', name: 'Muhammad Nur Husein' },
			{ role: 'Art Director', name: 'Lady Rahma Cantique Kusuma' },
			{ role: 'Assistant Director', name: 'Valerianus Alvin Tjuarsa' },
			{ role: 'Gaffer', name: 'Yansen Jeonardo' },
			{ role: 'Sound Recordist', name: 'Hamid' },
			{ role: 'Editor', name: 'Miracle Bernadette Louisa Tumion' },
			{ role: 'Colorist', name: 'Muhammad Nur Husein' },
			{ role: 'Sound Designer', name: 'Muhammad Farhan Fidaputra' },
			{ role: 'Composer', name: 'Muhammad Nur Husein' },
		],
		cinematicStills: [
			bom2,
			bom3,
			bom4,
			bom1,
			bom5,
		],
		clientLogos: [{ name: "Aftertone Pictures", logo: aftone, hasGlassBadge: false }],
		titleImage: bomTle,
	},
	{
		id: 4,
		title: "BAM!",
		category: "Short Film",
		year: "2025",
		description: "Left home alone while their parents are away, siblings Rani and Doni clash over an all-in-one universal remote capable of controlling everything in the house.",
		image: bam1,
		videoUrl: "https://www.dropbox.com/scl/fi/d2agkqspjnpx94buge819/Trailer.mov?rlkey=9fclpkeuyb222an6py9l5krg0&st=0ncp0p0x&raw=1",
		credits: [
			{ role: 'Writer', name: 'Valerianus Alvin Tjuarsa' },
			{ role: 'Director', name: 'Valerianus Alvin Tjuarsa' },
			{ role: 'Producer', name: 'Mark Hector Jedidiah' },
			{ role: 'Director of Photography', name: 'Muhammad Nur Husein' },
			{ role: 'Art Director', name: 'Lady Rahma Cantique Kusuma' },
			{ role: 'Editor', name: 'Miracle Bernadette Louisa Tumion, Muhammad Nur Husein' },
			{ role: 'Colorist', name: 'Muhammad Nur Husein' },
			{ role: 'Sound Designer', name: 'Muhammad Nur Husein' },
			{ role: 'VFX Artist', name: 'Arya Ranu Pani' }
		],
		cinematicStills: [
			bam2,
			bam3,
			bam4,
			bam5,
			bam6
		],
		clientLogos: [{ name: "Wawayu Pictures", logo: wawayu, hasGlassBadge: false }],
		titleImage: bamTitle,
	},
	{
		id: 5,
		title: "Laberinto De Illusione",
		category: "Short Film",
		year: "2024",
		description: "Lale falls for a virtual girl, but every moment together is just his hallucination.",
		image: lale1,
		videoUrl: "https://www.dropbox.com/scl/fi/1n5zei328qtahwgyk2p7n/LaberintoDeIllusiuonemp4.mp4?rlkey=0soj8wrgww0lhfh9aa0ceroz4&st=6d6ztjmz&raw=1",
		credits: [
			{ role: "Writer & Director", name: "Muhammad Nur Husein" },
			{ role: "Director of Photography", name: "Muhammad Nur Husein" },
			{ role: "Editor", name: "Muhammad Nur Husein" },
			{ role: 'Cast', name: 'Lady Rahma Cantique Kusuma, Bryan Dafaz Junior' },
			{ role: 'Production Support', name: 'Valerianus Alvin Tjuarsa' },
		],
		cinematicStills: [
			lale2,
			lale3,
			lale4,
			lale5,
			lale6,
			lale7,
		],
		clientLogos: [{ name: hsno, logo: hsno, hasGlassBadge: true }],
		titleImage: logoLaberintoDeIllusione,
	},
	{
		id: 6,
		title: "TNCR Kerinci Beans Promotion",
		category: "Commercial",
		year: "2024",
		description: "",
		image: "https://i.ibb.co.com/Jw55CwfL/Still-2025-12-31-190923-1-59-1.jpg",
		videoUrl: "https://drive.google.com/file/d/1LtqPetNNoQMukXisUFIZArnO2CEUbScd/preview",
		credits: [{ role: "Cinematographer", name: "Seno" }],
	},
	{
		id: 7,
		title: "TNCR 7th Anniversary",
		category: "Commercial",
		year: "2023",
		description: "",
		image: "https://images.unsplash.com/photo-1552694062-ccf53289a8da?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb3ZpZSUyMHByb2R1Y3Rpb24lMjBzZXR8ZW58MXx8fHwxNzY1NDM5NzU3fDA&ixlib=rb-4.1.0&q=80&w=1080",
		videoUrl: "https://drive.google.com/file/d/1npPLWyIgdwmkK88ev5txpccc2Q-cQkuC/preview",
		credits: [
			{ role: "Director of Photography", name: "Seno" },
			{ role: "Editor", name: "Seno" }
		],
	},
	{
		id: 8,
		title: "Lama - Lama",
		category: "Personal Projects",
		year: "2024",
		description: "",
		image: "https://i.ibb.co.com/WWHvWR9v/Still-2025-12-31-183048-1-58-70.jpg",
		videoUrl: "https://drive.google.com/file/d/17x8tTFdwFE_L67_aY6noOlgaaXIEV4RJ/preview",
		credits: [
			{ role: "Director", name: "Seno" },
			{ role: "Writer", name: "Seno" },
			{ role: "Editor", name: "Seno" }
		],
	},
	{
		id: 9,
		title: "Barudi Kopi Ethiophia Beans",
		category: "Commercial",
		year: "2024",
		description: "",
		image: "https://i.ibb.co.com/RpbF3DVP/Still-2025-12-31-190923-1-60-2.jpg",
		videoUrl: "https://drive.google.com/file/d/1t8ZiPYwQ4M2zogcuWy31OEgMDqgi0wGk/preview",
		credits: [{ role: "Cinematographer", name: "Seno" }],
	},
	{
		id: 10,
		title: "TNCR Operational Hour",
		category: "Commercial",
		year: "2024",
		description: "",
		image: "https://i.ibb.co.com/m5bRMvqB/Still-2025-12-31-190923-1-58-2.jpg",
		videoUrl: "https://drive.google.com/file/d/1WznTJfABJzIajt8JATS8rbTMiCYHWhpR/preview",
		credits: [
			{ role: "Director", name: "Seno" },
			{ role: "Writer", name: "Seno" },
			{ role: "Editor", name: "Seno" }
		],
	},
	{
		id: 11,
		title: "School Company Profile - Assignment",
		category: "Personal Projects",
		year: "2024",
		description: "",
		image: "https://i.ibb.co.com/CKzFH3Tc/Still-2025-12-31-190923-1-62-1.jpg",
		videoUrl: "https://drive.google.com/file/d/1wmBcC16ZXpw7o4ZrGSCAqN1vqcz6vXwh/preview",
		credits: [
			{ role: "Writer", name: "Seno" },
			{ role: "Director", name: "Seno" },
			{ role: "Cinematographer", name: "Seno" },
			{ role: "Editor", name: "Seno" }
		],
	},
	{
		id: 12,
		title: "TNCR -  Making Greypresso Machiato",
		category: "Commercial",
		year: "2024",
		description: "",
		image: "https://i.ibb.co.com/m5bRMvqB/Still-2025-12-31-190923-1-58-2.jpg",
		videoUrl: "https://drive.google.com/file/d/1l5M6AzNBiHOYa4nX1UrIQYjoXH97P9Ze/preview",
		credits: [
			{ role: "Director", name: "Seno" },
			{ role: "Writer", name: "Seno" },
			{ role: "Editor", name: "Seno" }
		],
	},
	{
		id: 13,
		title: "Saling Isi Opening Promo",
		category: "Commercial",
		year: "2023",
		description: "",
		image: "https://i.ibb.co.com/m5bRMvqB/Still-2025-12-31-190923-1-58-2.jpg",
		videoUrl: "https://drive.google.com/file/d/13id_Khu7FP9zYmGkP2oaezXyx9s3m7dl/preview",
		credits: [
			{ role: "Director", name: "Seno" },
			{ role: "Writer", name: "Seno" },
			{ role: "Editor", name: "Seno" }
		],
	},
	{
		id: 14,
		title: "Boiling Point Opening Promotion",
		category: "Commercial",
		year: "2024",
		description: "",
		image: "https://i.ibb.co.com/vCD0WKhP/S3-N0-LOG-7.jpg",
		videoUrl: "https://drive.google.com/file/d/1Y0nOnm0NIWr07XfLt0B2vInuf9VIOeQu/preview",
		credits: [
			{ role: "Director", name: "Seno" },
			{ role: "Writer", name: "Seno" },
			{ role: "Editor", name: "Seno" }
		],
	},
	{
		id: 15,
		title: "Boiling Point Drink Promo",
		category: "Commercial",
		year: "2024",
		description: "",
		image: "https://i.ibb.co.com/TB6YvmR4/S3-N0-LOG-50.jpg",
		videoUrl: "https://drive.google.com/file/d/1jPRE0gPU45_dPYEAbrrKm0Lng-t3xWtz/preview",
		credits: [
			{ role: "Director", name: "Seno" },
			{ role: "Writer", name: "Seno" },
			{ role: "Editor", name: "Seno" }
		],
	},
	{
		id: 16,
		title: "Boiling Point Opening Promo",
		category: "Commercial",
		year: "2024",
		description: "",
		image: "https://i.ibb.co.com/m5bRMvqB/Still-2025-12-31-190923-1-58-2.jpg",
		videoUrl: "https://drive.google.com/file/d/1WznTJfABJzIajt8JATS8rbTMiCYHWhpR/preview",
		credits: [
			{ role: "Director", name: "Seno" },
			{ role: "Writer", name: "Seno" },
			{ role: "Editor", name: "Seno" }
		],
	},
	{
		id: 17,
		title: "Enjoing the sunrise",
		category: "Personal Projects",
		year: "2024",
		description: "",
		image: "https://i.ibb.co.com/m5bRMvqB/Still-2025-12-31-190923-1-58-2.jpg",
		videoUrl: "https://drive.google.com/file/d/1oU7CyDyzLufDJckvhAvY6F3kU5XsA_bM/preview",
		credits: [
			{ role: "Director", name: "Seno" },
			{ role: "Editor", name: "Seno" }
		],
	},
	{
		id: 18,
		title: "Lets make Sour Candy - TNCR",
		category: "Commercial",
		year: "2023",
		description: "",
		image: "https://i.ibb.co.com/m5bRMvqB/Still-2025-12-31-190923-1-58-2.jpg",
		videoUrl: "https://drive.google.com/file/d/1oU7CyDyzLufDJckvhAvY6F3kU5XsA_bM/preview",
		credits: [{ role: "Titik Nyeduh Coffee Roaster", name: "Creative Team" }],
	},
	{
		id: 19,
		title: "Enjoing the sunrise",
		category: "Personal Projects",
		year: "2024",
		description: "",
		image: "https://i.ibb.co.com/m5bRMvqB/Still-2025-12-31-190923-1-58-2.jpg",
		videoUrl: "https://drive.google.com/file/d/1oU7CyDyzLufDJckvhAvY6F3kU5XsA_bM/preview",
		credits: [
			{ role: "Director", name: "Seno" },
			{ role: "Editor", name: "Seno" }
		],
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
					<h2 className="section-title mb-4 text-white">Selected Works</h2>
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

								{category === "Short Film" ? (
									<motion.div className="flex flex-col gap-12">
										{categoryProjects.map((project, index) => (
											<FilmProject key={project.id} project={project} index={index} isInView={isInView} />
										))}
									</motion.div>
								) : (
									<motion.div className="grid grid-cols-1 md:grid-cols-2 gap-8">
										{categoryProjects.map((project, index) => (
											<FilmProject key={project.id} project={project} index={index} isInView={isInView} />
										))}
									</motion.div>
								)}
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