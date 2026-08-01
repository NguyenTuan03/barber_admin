import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "t99-barbershop-images.s3.us-east-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "*.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "s3.us-east-1.amazonaws.com",
      },
    ],
  },
};

export default nextConfig;
