import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    ABI: process.env.ABI,
    SUPRA_RPC_URL: process.env.SUPRA_RPC_URL,
    MONGO_URL: process.env.MONGO_URL,
    SITE_URL: process.env.SITE_URL,
  },
  eslint: {
    ignoreDuringBuilds: true
  }
};

export default nextConfig;
