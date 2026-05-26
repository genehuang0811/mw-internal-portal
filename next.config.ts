import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    "/api/generate-refund": ["./public/templates/**/*"],
  },
};

export default nextConfig;
