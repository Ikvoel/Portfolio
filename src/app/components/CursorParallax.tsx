import { useEffect, useState } from "react"
import { motion, useMotionValue } from "motion/react"

/**
 * CURSOR PARALLAX EFFECT
 *
 * Creates subtle light parallax movement and lighting responses
 * that follow cursor motion naturally to enhance depth perception.
 */

export function CursorParallax() {
	const [isEnabled, setIsEnabled] = useState(false)
	const primaryX = useMotionValue(0)
	const primaryY = useMotionValue(0)
	const secondaryX = useMotionValue(0)
	const secondaryY = useMotionValue(0)
	const primaryOpacity = useMotionValue(0)
	const secondaryOpacity = useMotionValue(0)

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
			primaryX.set(e.clientX - 210)
			primaryY.set(e.clientY - 210)
			secondaryX.set(e.clientX - 90)
			secondaryY.set(e.clientY - 90)
			primaryOpacity.set(0.12)
			secondaryOpacity.set(0.08)
		}

		const handleMouseLeave = () => {
			primaryOpacity.set(0)
			secondaryOpacity.set(0)
		}

		window.addEventListener("mousemove", handleMouseMove)
		document.addEventListener("mouseleave", handleMouseLeave)

		return () => {
			window.removeEventListener("mousemove", handleMouseMove)
			document.removeEventListener("mouseleave", handleMouseLeave)
		}
	}, [isEnabled, primaryOpacity, primaryX, primaryY, secondaryOpacity, secondaryX, secondaryY])

	if (!isEnabled) return null

	return (
		<>
			{/* Primary cursor spotlight - soft radial gradient */}
			<motion.div
				className="fixed pointer-events-none z-40 mix-blend-soft-light"
				style={{
					x: primaryX,
					y: primaryY,
					opacity: primaryOpacity,
					transition: "opacity 180ms ease-out",
					width: "420px",
					height: "420px",
					background: "radial-gradient(circle, rgba(255, 255, 255, 0.32) 0%, rgba(200, 180, 255, 0.16) 42%, transparent 70%)",
					filter: "blur(32px)",
				}}
			/>

			{/* Secondary glow - color-shifting */}
			<motion.div
				className="fixed pointer-events-none z-40 mix-blend-screen"
				style={{
					x: secondaryX,
					y: secondaryY,
					opacity: secondaryOpacity,
					transition: "opacity 180ms ease-out",
					width: "180px",
					height: "180px",
					background: "radial-gradient(circle, rgba(168, 85, 247, 0.34) 0%, rgba(59, 130, 246, 0.2) 50%, transparent 72%)",
					filter: "blur(24px)",
				}}
			/>
		</>
	)
}