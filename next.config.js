/** @type {import('next').NextConfig} */

// GitHub Pages serves this project under /<repo-name>. The deploy workflow sets
// NEXT_PUBLIC_BASE_PATH to that prefix; local dev and the default build leave it
// empty so the app runs at the root.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig = {
  reactStrictMode: true,
  // Emit a static HTML/JS bundle (out/) so the app can be hosted on GitHub
  // Pages with no server. The app is entirely client side, so nothing is lost.
  output: "export",
  basePath,
  assetPrefix: basePath || undefined,
  // Pages has no Next image optimizer; serve images as plain files.
  images: { unoptimized: true },
};

module.exports = nextConfig;
