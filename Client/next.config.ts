import type { NextConfig } from "next";
//ts-expect-error - Wrapper for PWA support
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  disable: process.env.NODE_ENV === "development",
  workboxOptions: {
    disableDevLogs: true,
    importScripts: ["/push-worker.js"], // Import custom push worker logic
  },
});

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  // Silence Turbopack warning as we rely on Webpack for PWA
  turbopack: {},
};

export default withPWA(nextConfig);
