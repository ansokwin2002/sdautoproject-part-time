import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // 👇 build as static site (creates `out/` folder)
  output: 'export',

  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true, // 👈 important for static export
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'media.cnn.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'imgcdn.oto.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.toyota.com.la',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.topgear.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'media.ed.edmunds-media.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'seo-cms.autoscout24.ch',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'sdmntpraustraliaeast.oaiusercontent.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
