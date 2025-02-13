/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      os: false,
      path: false,
      crypto: false,
      stream: false,
      http: false,
      https: false,
      zlib: false,
      "crypto-browserify": require.resolve('crypto-browserify'),
    };
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  env: {
    DB_LINK: process.env.DB_LINK,
  },
  serverRuntimeConfig: {
    DB_LINK: process.env.DB_LINK,
  },
  publicRuntimeConfig: {
    apiUrl: process.env.NODE_ENV === 'development' 
      ? 'http://localhost:3000/api'
      : '/api',
  }
};

module.exports = nextConfig;
