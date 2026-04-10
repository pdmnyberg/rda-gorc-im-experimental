import type { NextConfig } from "next";

const basePath = process.env.BASE_PATH || '';
const assetPrefix = process.env.ASSET_PREFIX || basePath;

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  basePath,
  assetPrefix,
  images: {
    unoptimized: true,
  }
};

export default nextConfig;
