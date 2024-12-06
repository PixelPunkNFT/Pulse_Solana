import type { Configuration as WebpackConfig } from 'webpack';
import type { NextConfig } from 'next';

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  webpack: (config: WebpackConfig) => {
    if (!config.resolve) {
      config.resolve = {};
    }
    if (!config.resolve.fallback) {
      config.resolve.fallback = {};
    }
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      crypto: false,
    };
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'harlequin-informal-hawk-522.mypinata.cloud',
        port: '',
        pathname: '/ipfs/**',
      },
    ],
  },
};

export default nextConfig;
