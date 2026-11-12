import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    qualities: [75, 90],
    // Apple's catalogue artwork (iTunes Search API) — used on /camping
    remotePatterns: [{ protocol: "https", hostname: "*.mzstatic.com" }],
  },
};

module.exports = {
  async rewrites() {
    return [
      {
        // This catches any sub-route under /old-portfolio
        source: '/old-portfolio/:path*',
        // And sends it to the static index.html of your old app
        destination: '/old-portfolio/index.html',
      },
    ]
  },
}

export default nextConfig;
