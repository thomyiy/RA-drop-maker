import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Packages partagés du monorepo compilés à la volée (TS source).
  transpilePackages: ["@thomyiy/config", "@thomyiy/themes", "@thomyiy/commerce", "@thomyiy/core"],
};

export default nextConfig;
