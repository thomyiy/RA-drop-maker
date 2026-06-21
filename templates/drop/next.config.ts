import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@thomyiy/config",
    "@thomyiy/themes",
    "@thomyiy/ui",
    "@thomyiy/core",
    "@thomyiy/commerce",
  ],
};

export default nextConfig;
