import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        pathname: "/uploads/dataset/**", 
      },
      {
        protocol: "https",
        hostname: "algeo02-23054-production.up.railway.app",
        pathname: "/uploads/dataset/**",
      },
    ],
  },
  reactStrictMode: false,
};

export default nextConfig;
