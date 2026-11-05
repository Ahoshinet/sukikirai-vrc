import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  serverExternalPackages: ["@libsql/client", "libsql"],
  experimental: {
    cpus: 1,
  },
};

export default nextConfig;
