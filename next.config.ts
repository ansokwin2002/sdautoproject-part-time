/** @type {import('next').NextConfig} */

// Extract hostname and port from NEXT_PUBLIC_API_BASE_URL for image optimization
function getApiHostnameConfig() {
  const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';
  try {
    const url = new URL(apiUrl);
    return {
      protocol: url.protocol.replace(':', ''),
      hostname: url.hostname,
      port: url.port || (url.protocol === 'https:' ? '443' : '80'),
    };
  } catch {
    return { protocol: 'http', hostname: 'localhost', port: '8000' };
  }
}

const apiConfig = getApiHostnameConfig();

const nextConfig = {
  experimental: {
    workerThreads: false,
    cpus: 1
  },
  
  // ✅ Allow build even if TS or ESLint errors occur
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },

  // ✅ Image optimization setup (works for static export)
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'placehold.co', pathname: '/**' },
      { protocol: 'https', hostname: 'picsum.photos', pathname: '/**' },
      { protocol: 'https', hostname: 'images.unsplash.com', pathname: '/**' },
      { protocol: 'https', hostname: 'media.cnn.com', pathname: '/**' },
      { protocol: 'https', hostname: 'imgcdn.oto.com', pathname: '/**' },
      { protocol: 'https', hostname: 'www.toyota.com.la', pathname: '/**' },
      { protocol: 'https', hostname: 'www.topgear.com', pathname: '/**' },
      { protocol: 'https', hostname: 'res.cloudinary.com', pathname: '/**' },
      { protocol: 'https', hostname: 'media.ed.edmunds-media.com', pathname: '/**' },
      { protocol: 'https', hostname: 'seo-cms.autoscout24.ch', pathname: '/**' },
      { protocol: 'https', hostname: 'sdmntpraustraliaeast.oaiusercontent.com', pathname: '/**' },
      // Dynamically configured from NEXT_PUBLIC_API_BASE_URL
      { protocol: apiConfig.protocol, hostname: apiConfig.hostname, port: apiConfig.port, pathname: '/storage/**' },
      // Fallback for localhost
      { protocol: 'http', hostname: 'localhost', port: '8000', pathname: '/storage/**' },
    ],
  },
};

module.exports = nextConfig;