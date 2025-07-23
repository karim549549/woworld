/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#e02525",
        accent: "#0f56d7",
        warm: "#ffe5e0",
        chic: "#f5f5f5",
        relaxed: "#eaf6fb",
        black: "#000",
        white: "#fff",
      },
    },
  },
  plugins: [],
};