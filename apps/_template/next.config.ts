import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@ras/config", "@ras/themes", "@ras/ui"],
};

export default nextConfig;
