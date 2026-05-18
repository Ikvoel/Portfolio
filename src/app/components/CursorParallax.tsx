import { useEffect, useState } from "react"
import { motion } from "motion/react"

/**
 * CURSOR PARALLAX EFFECT
 *
 * Creates subtle light parallax movement and lighting responses
 * that follow cursor motion naturally to enhance depth perception.
 */

export function CursorParallax() {
	const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
	const [isVisible, setIsVisible] = useState(false)
	const [isEnabled, setIsEnabled] = useState(false)

	useEffect(() => {
		const mobileQuery = window.matchMedia("(max-width: 767px)")
		const coarsePointerQuery = window.matchMedia("(pointer: coarse)")
		const updateEnabled = () => {
			setIsEnabled(!mobileQuery.matches && !coarsePointerQuery.matches)
		}

		updateEnabled()
		mobileQuery.addEventListener("change", updateEnabled)
		coarsePointerQuery.addEventListener("change", updateEnabled)

		return () => {
			mobileQuery.removeEventListener("change", updateEnabled)
			coarsePointerQuery.removeEventListener("change", updateEnabled)
		}
	}, [])

	useEffect(() => {
		if (!isEnabled) return

		const handleMouseMove = (e: MouseEvent) => {
			setMousePosition({ x: e.clientX, y: e.clientY })
			setIsVisible(true)
		}

		const handleMouseLeave = () => {
			setIsVisible(false)
		}

		window.addEventListener("mousemove", handleMouseMove)
		document.addEventListener("mouseleave", handleMouseLeave)

		return () => {
			window.removeEventListener("mousemove", handleMouseMove)
			document.removeEventListener("mouseleave", handleMouseLeave)
		}
	}, [isEnabled])

	if (!isEnabled) return null

	return (
		<>
			{/* Primary cursor spotlight - soft radial gradient */}
			<motion.div
				className="fixed pointer-events-none z-40 mix-blend-soft-light"
				animate={{
					x: mousePosition.x - 300,
					y: mousePosition.y - 300,
					opacity: isVisible ? 0.2 : 0,
				}}
				transition={{
					type: "spring",
					damping: 35,
					stiffness: 180,
					mass: 0.6,
				}}
				style={{
					width: "600px",
					height: "600px",
					background: "radial-gradient(circle, rgba(255, 255, 255, 0.4) 0%, rgba(200, 180, 255, 0.2) 40%, transparent 70%)",
					filter: "blur(60px)",
				}}
			/>

			{/* Secondary glow - color-shifting */}
			<motion.div
				className="fixed pointer-events-none z-40 mix-blend-screen"
				animate={{
					x: mousePosition.x - 120,
					y: mousePosition.y - 120,
					opacity: isVisible ? 0.12 : 0,
				}}
				transition={{
					type: "spring",
					damping: 25,
					stiffness: 250,
					mass: 0.4,
				}}
				style={{
					width: "240px",
					height: "240px",
					background: "radial-gradient(circle, rgba(168, 85, 247, 0.5) 0%, rgba(59, 130, 246, 0.3) 50%, transparent 70%)",
					filter: "blur(40px)",
				}}
			/>
		</>
	)
}
