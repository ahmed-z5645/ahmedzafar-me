import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    qualities: [75, 90],
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
