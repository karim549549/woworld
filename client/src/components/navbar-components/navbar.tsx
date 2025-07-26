"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useCallback, useState } from "react"
import Logo from "./logo"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { motion, useScroll } from "framer-motion"

const navItems = [
	{ label: "Home", path: "/" },
	{ label: "About", path: "/about" },
	{ label: "News", path: "/news" },
	{ label: "Books", path: "/books" },
	{ label: "Wow Battle", path: "/wow-battle" },
	{ label: "Open Call", path: "/open-call" },
	{ label: "Contact", path: "/contact" },
]

export default function Navbar() {
	const pathname = usePathname()
	const [scrolled, setScrolled] = useState(false)

	// Use framer-motion's useScroll for scroll detection
	const { scrollY } = useScroll()

	useEffect(() => {
		return scrollY.on("change", (y) => setScrolled(y > 10))
	}, [scrollY])

	// Memoized handler for closing the drawer
	const handleCloseDrawer = useCallback(
		(setOpen: (open: boolean) => void) => () => setOpen(false),
		[]
	)

	return (
		<motion.header
			className="fixed w-full z-50 transition-all duration-500"
			style={{
				backgroundColor: scrolled ? "var(--background)" : "transparent",
				boxShadow: scrolled ? "0 2px 24px 0 rgba(15,86,215,0.08)" : "none",
				backdropFilter: !scrolled ? "none" : "blur(8px)",
			}}
			initial={false}
			animate={{
				backgroundColor: scrolled ? "var(--background)" : "rgba(0,0,0,0)",
			}}
			transition={{ duration: 0.3 }}
		>
			<div
				className={`relative flex items-center justify-between w-full max-w-[1320px] mx-auto px-4 sm:px-6 lg:px-10 transition-all duration-500 ${
					scrolled ? "top-0 py-2" : "top-4 py-6 sm:py-8 lg:py-2"
				}`}
			>
				{/* Logo */}
				<div className="w-[60px] sm:w-[72px] md:w-[84px] pt-1.5 pb-1.5 sm:pt-3 sm:pb-3 lg:pt-1 lg:pb-1 transition-all duration-300">
					<Logo />
				</div>

				{/* Desktop Nav */}
				<nav className="hidden md:flex gap-8 uppercase text-[14px] tracking-wider">
					{navItems.map(({ label, path }) => {
						const isActive = pathname === path
						const isOpenCall = label.toLowerCase() === "open call"
						return (
							<Link
								key={label}
								href={path}
								className="relative flex flex-col items-center group transition-colors duration-200"
								style={{
									color: isActive
										? "var(--brand-blue)"
										: scrolled
										? "var(--brand-dark)"
										: "#fff",
								}}
							>
								{/* Animated vertical line */}
								<span className="absolute top-[-32px] flex justify-center overflow-hidden h-8 w-[12px]">
									<span
										className={`w-[2px] transition-all duration-300 ${
											isActive
												? "h-full"
												: "h-0 group-hover:h-full"
										}`}
										style={{
											background: isActive
												? "var(--brand-blue)"
												: scrolled
												? "var(--brand-dark)"
												: "#fff",
										}}
									></span>
								</span>
								<span className="flex items-center gap-1">
									<span
										className={`transition-all duration-300 leading-[1.8] ${
											isActive
												? "font-semibold"
												: "font-medium group-hover:font-semibold"
										} ${isOpenCall ? "font-bold" : ""}`}
									>
										{label}
									</span>
									{isOpenCall && (
										<span className="relative flex h-2 w-2">
											<span className="absolute inline-flex h-full w-full rounded-full bg-[color:var(--brand-blue)] opacity-75 animate-ping"></span>
											<span className="relative inline-flex rounded-full h-2 w-2 bg-[color:var(--brand-blue)]"></span>
										</span>
									)}
								</span>
							</Link>
						)
					})}
				</nav>

				{/* Mobile Nav (Sheet/Drawer) */}
				<div className="md:hidden">
					<Sheet>
						<SheetTrigger asChild>
							<Button
								variant="ghost"
								className="z-50 relative p-2 transition-colors duration-500"
								style={{
									color: scrolled ? "var(--brand-dark)" : "#fff",
								}}
								aria-label="Open menu"
							>
								<div className="flex flex-col justify-center gap-[6px] w-[38px] h-[32px] transition-all duration-300">
									<span className="block w-full h-[2px] bg-current"></span>
									<span className="block h-[2px] bg-current ml-3 w-[calc(100%-12px)]"></span>
									<span className="block w-full h-[2px] bg-current"></span>
								</div>
							</Button>
						</SheetTrigger>
						<SheetContent
							side="right"
							className="w-full sm:w-[85%] max-w-sm p-0"
							style={{
								background: "var(--background)",
								color: "var(--brand-dark)",
							}}
							aria-labelledby="mobile-nav-title"
							aria-describedby="mobile-nav-desc"
						>
							{/* Visually hidden title and description for accessibility */}
							<span id="mobile-nav-title" className="sr-only">Mobile Navigation</span>
							<span id="mobile-nav-desc" className="sr-only">Main navigation drawer for mobile users</span>
							<div className="flex flex-col justify-between h-full relative">
								<div className="flex flex-col justify-center h-full px-6">
									<nav className="mt-16 text-lg uppercase tracking-wide font-medium w-full">
										{navItems.map(({ label, path }) => {
											const isActive = pathname === path
											const isOpenCall = label.toLowerCase() === "open call"
											return (
												<Link
													key={label}
													href={path}
													onClick={handleCloseDrawer(() => {})}
													className="relative block px-6 py-4 w-full transition-colors duration-200"
													style={{
														color: isActive
															? "var(--brand-blue)"
															: "var(--brand-dark)",
													}}
												>
													<span className="flex items-center gap-1">
														{label}
														{isOpenCall && (
															<span className="relative flex h-2 w-2 ml-1">
																<span className="absolute inline-flex h-full w-full rounded-full bg-[color:var(--brand-blue)] opacity-75 animate-ping"></span>
																<span className="relative inline-flex rounded-full h-2 w-2 bg-[color:var(--brand-blue)]"></span>
															</span>
														)}
													</span>
												</Link>
											)
										})}
									</nav>
								</div>
								<div
									className="border-t px-6 py-4 space-y-3"
									style={{ background: "var(--background)" }}
								>
									<div className="flex justify-between items-center">
										<a
											href="tel:+20222661712"
											className="text-xl"
											style={{ color: "var(--brand-blue)" }}
										>
											📞
										</a>
										<a
											href="mailto:info@masterpiece-eg.com"
											className="text-xl"
											style={{ color: "var(--brand-red)" }}
										>
											✉️
										</a>
									</div>
									<Link
										href="/contact"
										className="block w-full text-center font-bold py-2 uppercase tracking-wider text-sm rounded"
										style={{
											background: "var(--brand-blue)",
											color: "#fff",
										}}
									>
										Open Call
									</Link>
								</div>
							</div>
						</SheetContent>
					</Sheet>
				</div>
			</div>
		</motion.header>
	)
}