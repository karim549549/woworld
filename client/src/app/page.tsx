"use client";

import  { motion } from "framer-motion";
import { Loader2 } from "lucide-react"; // Using Loader2 for a spinning animation

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-8">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-6xl md:text-8xl font-extrabold mb-4 tracking-tight"
      >
Mango world       </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="text-2xl md:text-4xl font-semibold text-gray-300 mb-8"
      >
        Coming Soon
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        className="flex items-center space-x-3 text-gray-400"
      >
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <span className="text-lg">Preparing an epic experience...</span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.2 }}
        className="mt-12 text-sm text-gray-500 text-center"
      >
        &copy; {new Date().getFullYear()} woworld. All rights reserved.
      </motion.div>
    </div>
  );
}