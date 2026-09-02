import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Silences a Turbopack workspace-root warning caused by an unrelated
  // package-lock.json in the parent user directory (outside this repo).
  turbopack: {
    root: path.resolve(__dirname),
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "oaztinevexlzbpyuizfx.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
