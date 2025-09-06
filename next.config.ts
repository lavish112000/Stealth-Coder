import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverActions: {
      allowedOrigins: [
        // Add your GitHub Codespaces URL
        "upgraded-meme-qg64xr974rx29gjp-9002.app.github.dev",
        "localhost:9002", // Also good practice to explicitly allow localhost
        "*.app.github.dev" // Wildcard for all GitHub Codespaces
      ],
    },
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
