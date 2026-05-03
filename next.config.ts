import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 외부 이미지 호스트 허용 (Unsplash, Agoda CDN)
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'pix8.agoda.net' },
      { protocol: 'https', hostname: 'pix2.agoda.net' },
      { protocol: 'https', hostname: 'pix4.agoda.net' },
      { protocol: 'https', hostname: 'pix6.agoda.net' },
      { protocol: 'https', hostname: 'pix10.agoda.net' },
      { protocol: 'https', hostname: '**.agoda.net' },
      { protocol: 'https', hostname: '**.unsplash.com' },
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 86400, // 1일 캐시
  },
};

export default nextConfig;
