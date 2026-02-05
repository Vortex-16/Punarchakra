import type { NextConfig } from "next";
//ts-expect-error - Wrapper for PWA support
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  // disable: process.env.NODE_ENV === "development", // Commented out to enable PWA in dev for testing
  disable: false,
  workboxOptions: {
    disableDevLogs: true,
    importScripts: ["/push-worker.js"], // Import custom push worker logic
  },
  fallbacks: {
    document: "/offline",
  },
});

const nextConfig: NextConfig = {
  reactCompiler: true,
};

export default nextConfig;
