import type { NextConfig } from "next";

const repositoryBasePath =
  process.env.GITHUB_REPOSITORY === "Goprogabriel/flower" ? "/flower" : "";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? repositoryBasePath;

const nextConfig: NextConfig = {
  distDir: process.env.NODE_ENV === "development" ? ".next-dev" : ".next",
  output: "export",
  reactStrictMode: true,
  trailingSlash: true,
  basePath,
  assetPrefix: basePath || undefined,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath
  },
  images: {
    unoptimized: true
  },
  experimental: {
    devtoolSegmentExplorer: false
  }
};

export default nextConfig;
