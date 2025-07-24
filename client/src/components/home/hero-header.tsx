"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const issues = [
	{
		title: "Issue #1",
		cover: "/covers/issue1.jpg",
		link: "/issues/1",
		desc: "The debut issue: Art, culture, and more.",
	},
	{
		title: "Issue #2",
		cover: "/covers/issue2.jpg",
		link: "/issues/2",
		desc: "Exploring new voices and visions.",
	},
	// Add more issues as needed
];

export default function HeroHeader() {
	const [current, setCurrent] = useState(0);

	const prev = () => setCurrent((c) => (c === 0 ? issues.length - 1 : c - 1));
	const next = () => setCurrent((c) => (c === issues.length - 1 ? 0 : c + 1));

	const issue = issues[current];
	// Extract number from title (e.g., "Issue #6" -> "06")
	const issueNumber = issue.title.match(/\d+/)?.[0]?.padStart(2, "0") ?? "";

	return (
		<header className="relative min-h-screen flex flex-col justify-center items-center overflow-hidden">
			{/* Background image with overlay */}
			<AnimatePresence mode="wait">
				<motion.div
					key={issue.cover}
					initial={{ opacity: 0, scale: 1.05 }}
					animate={{ opacity: 1, scale: 1 }}
					exit={{ opacity: 0, scale: 0.98 }}
					transition={{ duration: 0.7 }}
					className="absolute inset-0 z-0"
					style={{
						backgroundImage: `url(${issue.cover})`,
						backgroundSize: "cover",
						backgroundPosition: "center",
						filter: "brightness(0.7) blur(1.5px)",
					}}
				/>
			</AnimatePresence>
			{/* Artistic overlay */}
			<div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-transparent z-10 pointer-events-none" />
			{/* Artistic Issue Label - top left */}
			<div className="absolute top-8 left-8 z-20 flex flex-col items-start select-none">
				<span className="text-[2.5rem] md:text-[3.5rem] font-extrabold tracking-tight leading-none flex items-center gap-2 text-black/80 dark:text-white/90">
					<span className="font-sans tracking-widest">ISSUE</span>
				</span>
				<span
					className="text-[5rem] md:text-[7rem] font-black -mt-4 text-black/10 dark:text-white/20"
					style={{
						WebkitTextStroke: "2px #111",
						color: "transparent",
						fontFamily: "monospace",
						lineHeight: 1,
						letterSpacing: "-0.05em",
					}}
				>
					/{issueNumber}
				</span>
			</div>
			{/* Hero Content */}
			<div className="relative z-20 flex flex-col items-center text-center px-4">
				<motion.div
					key={issue.desc}
					initial={{ opacity: 0, y: 40 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: -40 }}
					transition={{ duration: 0.7 }}
					className="flex flex-col items-center"
				>
					<h1
						className="text-5xl md:text-7xl font-extrabold mb-4 tracking-tight drop-shadow-lg"
						style={{ fontFamily: "serif" }}
					>
						WOWorld Magazine
					</h1>
					<p className="text-xl md:text-2xl text-gray-100 mb-8 max-w-2xl drop-shadow">
						{issue.desc}
					</p>
				</motion.div>
				{/* Slideshow Controls */}
				<div className="flex items-center gap-6 mt-4">
					<Button
						variant="ghost"
						size="icon"
						aria-label="Previous Issue"
						onClick={prev}
						className="rounded-full bg-black/40 hover:bg-black/70 text-white"
					>
						<ChevronLeft className="w-7 h-7" />
					</Button>
					<div className="flex gap-2">
						{issues.map((_, idx) => (
							<button
								key={idx}
								onClick={() => setCurrent(idx)}
								className={`w-3 h-3 rounded-full border-2 border-white transition-all duration-300 ${
									idx === current
										? "bg-[color:var(--brand-blue)] scale-125 shadow"
										: "bg-white/40"
								}`}
								aria-label={`Go to issue ${idx + 1}`}
							/>
						))}
					</div>
					<Button
						variant="ghost"
						size="icon"
						aria-label="Next Issue"
						onClick={next}
						className="rounded-full bg-black/40 hover:bg-black/70 text-white"
					>
						<ChevronRight className="w-7 h-7" />
					</Button>
				</div>
			</div>
		</header>
	);
}