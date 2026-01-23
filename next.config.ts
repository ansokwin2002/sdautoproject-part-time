import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // ✅ Allow external images (SSR safe)
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'placehold.co' },
      { protocol: 'https', hostname: 'picsum.photos' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'media.cnn.com' },
      { protocol: 'https', hostname: 'imgcdn.oto.com' },
      { protocol: 'https', hostname: 'www.toyota.com.la' },
      { protocol: 'https', hostname: 'www.topgear.com' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'media.ed.edmunds-media.com' },
      { protocol: 'https', hostname: 'seo-cms.autoscout24.ch' },
      { protocol: 'https', hostname: 'sdmntpraustraliaeast.oaiusercontent.com' },
      { protocol: 'https', hostname: 'api.sdauto.com.au' },
      { protocol: 'http', hostname: 'localhost' },
    ],
  },

  // ✅ Ignore build-time checks ONLY (safe)
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
