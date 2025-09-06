/**
 * Next.js Configuration for Stealth Coder
 *
 * This configuration file sets up the Next.js application with specific settings
 * optimized for the Stealth Coder desktop application, including server actions
 * for GitHub Codespaces compatibility and development optimizations.
 */

import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /**
   * Experimental Features Configuration
   * Enables cutting-edge Next.js features for enhanced functionality
   */
  experimental: {
    /**
     * Server Actions Configuration
     * Server Actions allow client components to call server-side functions
     * This is crucial for the AI code generation flow in Stealth Coder
     */
    serverActions: {
      /**
       * Allowed Origins for Server Actions
       * Specifies which domains can invoke server actions
       * Critical for GitHub Codespaces deployment where the domain changes dynamically
       */
      allowedOrigins: [
        // Specific GitHub Codespaces URL for this workspace
        "upgraded-meme-qg64xr974rx29gjp-9002.app.github.dev",
        // Local development server
        "localhost:9002",
        // Wildcard pattern for all GitHub Codespaces domains
        // Allows deployment on any GitHub Codespaces instance
        "*.app.github.dev"
      ],
    },
  },

  /**
   * TypeScript Configuration
   * Build-time settings for TypeScript compilation
   */
  typescript: {
    // Ignore TypeScript errors during build process
    // Useful for development but should be false in production
    ignoreBuildErrors: true,
  },

  /**
   * ESLint Configuration
   * Linting settings for code quality enforcement
   */
  eslint: {
    // Skip ESLint checks during build
    // Speeds up development builds
    ignoreDuringBuilds: true,
  },

  /**
   * Image Optimization Configuration
   * Defines allowed external image sources for Next.js Image component
   */
  images: {
    /**
     * Remote Patterns for External Images
     * Whitelist of allowed image domains for security
     */
    remotePatterns: [
      {
        // Allow placeholder images from placehold.co
        // Used for UI mockups and development placeholders
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

/**
 * Export Configuration
 * Makes the configuration available to Next.js build system
 */
export default nextConfig;
