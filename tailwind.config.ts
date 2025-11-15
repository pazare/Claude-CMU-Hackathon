import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // CMU-inspired colors
        cmu: {
          red: "#A6192E", // CMU red/burgundy
        },
      },
    },
  },
  plugins: [],
};
export default config;

