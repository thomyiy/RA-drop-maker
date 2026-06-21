import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@ras/config", "@ras/themes"],
};

export default nextConfig;
