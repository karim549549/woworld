"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

// Use test images from public for demonstration
const issues = [
	{
		title: "Issue #1",
		cover: "/testheader.png", // Place testheader.png in your /public folder
		link: "/issues/1",
		desc: "The debut issue: Art, culture, and more.",
	},
	{
		title: "Issue #2",
		cover: "/testheader.png",
		link: "/issues/2",
		desc: "Exploring new voices and visions.",
	},
	// Add more issues as needed
];

export default function HeroHeader() {
	const [current, setCurrent] = useState(0);
	const timeoutRef = useRef<NodeJS.Timeout | null>(null);

	const next = () => setCurrent((c) => (c === issues.length - 1 ? 0 : c + 1));
	const prev = () => setCurrent((c) => (c === 0 ? issues.length - 1 : c - 1));

	// Auto-switch every 5 seconds
	useEffect(() => {
		if (timeoutRef.current) clearTimeout(timeoutRef.current);
		timeoutRef.current = setTimeout(next, 5000);
		return () => {
			if (timeoutRef.current) clearTimeout(timeoutRef.current);
		};
	}, [current]);

	const issue = issues[current];
	const issueNumber = issue.title.match(/\d+/)?.[0]?.padStart(2, "0") ?? "";

	return (
		<header className="relative min-h-screen flex flex-col justify-center items-center overflow-hidden">
			{/* Animated background image with fade in/out */}
			<AnimatePresence mode="wait">
				<motion.div
					key={issue.cover + current}
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.8, ease: "easeInOut" }}
					className="absolute inset-0 z-0"
				>
					<Image
						src={issue.cover}
						alt={issue.title}
						fill
						priority
						className="object-cover object-center w-full h-full"
						style={{ filter: "brightness(0.7)" }} 
						sizes="100vw"
					/>
				</motion.div>
			</AnimatePresence>
			{/* Artistic overlay */}
			<div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-transparent z-10 pointer-events-none" />
			{/* Minimalist Issue Label - top left, outlined, no color fill */}
			<AnimatePresence mode="wait">
				<motion.div
					key={issue.title + current}
					initial={{ opacity: 0, x: -40 }}
					animate={{ opacity: 1, x: 0 }}
					exit={{ opacity: 0, x: -40 }}
					transition={{ duration: 0.7, ease: "easeInOut" }}
					className="absolute top-8 left-8 z-20 flex flex-col items-start select-none"
				>
					<span
						className="text-[4rem] md:text-[6rem] font-extrabold tracking-tight leading-none"
						style={{
							color: "transparent",
							WebkitTextStroke: "2px #111",
							fontFamily: "sans-serif",
							letterSpacing: "-0.03em",
							lineHeight: 1,
							textShadow: "0 4px 32px rgba(0,0,0,0.10)",
						}}
					>
						ISSUE
					</span>
					<span
						className="text-[7rem] md:text-[10rem] font-black -mt-6"
						style={{
							color: "transparent",
							WebkitTextStroke: "3px #111",
							fontFamily: "sans-serif",
							lineHeight: 1,
							letterSpacing: "-0.07em",
							textShadow: "0 4px 32px rgba(0,0,0,0.10)",
						}}
					>
						/{issueNumber}
					</span>
				</motion.div>
			</AnimatePresence>
			{/* Description */}
			<AnimatePresence mode="wait">
				<motion.div
					key={issue.desc + current}
					initial={{ opacity: 0, y: 40 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: -40 }}
					transition={{ duration: 0.7, ease: "easeInOut" }}
					className="relative z-20 flex flex-col items-center text-center px-4"
				>
					<p className="text-xl md:text-2xl mb-8 max-w-2xl drop-shadow text-white font-medium">
						{issue.desc}
					</p>
				</motion.div>
			</AnimatePresence>
			{/* Vertical lines for navigation (right side) */}
			<div className="hidden md:flex flex-col gap-3 absolute right-6 top-1/2 -translate-y-1/2 z-30 items-end">
				{issues.map((_, i) => (
					<button
						key={i}
						onClick={() => setCurrent(i)}
						className={`transition-all duration-300 cursor-pointer rounded-full
							${current === i
								? "w-14 h-[4px] bg-[color:var(--brand-blue)] shadow-lg"
								: "w-8 h-[3px] bg-white/40 opacity-60"
							}
						`}
						aria-label={`Go to issue ${i + 1}`}
					/>
				))}
			</div>
		</header>
	);
}