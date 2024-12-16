import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000", // Include port if necessary
        pathname: "/uploads/dataset/**", // Match your dataset path
      },
    ],
  },
  reactStrictMode: false,
};

export default nextConfig;
