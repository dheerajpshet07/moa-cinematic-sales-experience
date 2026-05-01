/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ["framer-motion", "lucide-react", "three"]
  },
  images: {
    formats: ["image/avif", "image/webp"]
  }
};

export default nextConfig;
