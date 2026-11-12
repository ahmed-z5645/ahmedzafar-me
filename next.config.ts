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
      {
        source: '/knee-rehab-phone',
        destination: '/knee-rehab-phone/index.html',
      },
      {
        source: '/gait-demo',
        destination: '/gait-demo/index.html',
      },
      {
        source: '/knee-rehab-demo',
        destination: '/knee-rehab-demo/index.html',
      },
      {
        source: '/knee-rehab-demo/plan',
        destination: '/knee-rehab-demo/plan.html',
      },
      {
        source: '/knee-rehab-demo/session',
        destination: '/knee-rehab-demo/session.html',
      },
      {
        source: '/knee-rehab-demo/history',
        destination: '/knee-rehab-demo/history.html',
      },
      {
        source: '/knee-rehab-demo/profile',
        destination: '/knee-rehab-demo/profile.html',
      },
      {
        source: '/knee-rehab-demo/reports',
        destination: '/knee-rehab-demo/reports.html',
      },
      {
        source: '/knee-rehab-demo/debug',
        destination: '/knee-rehab-demo/debug.html',
      },
      {
        source: '/knee-rehab-demo/live-session',
        destination: '/knee-rehab-demo/live-session.html',
      },
    ]
  },
}

export default nextConfig;
