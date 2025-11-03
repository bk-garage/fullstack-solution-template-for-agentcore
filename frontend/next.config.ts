import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  distDir: "build",
  output: "export",
  // ESLint configuration for builds
  eslint: {
    // Keep ESLint enabled during builds (warnings won't fail the build)
    ignoreDuringBuilds: false,
  },
  typescript: {
    // Keep TypeScript checking enabled
    ignoreBuildErrors: false,
  },
}

export default nextConfig
