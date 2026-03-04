import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@react-native-async-storage/async-storage": path.join(__dirname, "stubs/async-storage.js"),
      "pino-pretty": path.join(__dirname, "stubs/pino-pretty.js"),
    };
    return config;
  },
};

export default nextConfig;
