import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Packages partagés du monorepo compilés à la volée (TS source).
  transpilePackages: ["@ras/config", "@ras/themes"],
};

export default nextConfig;
