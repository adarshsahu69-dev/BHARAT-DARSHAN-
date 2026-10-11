/**
 * Next.js configuration.
 *
 * A `.mjs` file, not `.ts`, and that is deliberate. CI only needs to patch a
 * config that is written in JavaScript: `actions/configure-pages`, the action
 * that used to inject the GitHub Pages `basePath`, recognised only `.js`,
 * `.cjs` and `.mjs`. With a `next.config.ts` present it silently created a blank
 * `next.config.js` instead — and since Next loads `.js` before `.ts`, every
 * setting in this file would be ignored in CI while working perfectly locally.
 * `.mjs` is the extension that stays loadable everywhere, so this file is the
 * one that builds the deployed site.
 *
 * The app now runs on a Node server (Prisma, NextAuth and route handlers need
 * one), so there is no static export: `output: 'export'`, `trailingSlash` and
 * `images.unoptimized` are all gone.
 *
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  basePath: '',
  assetPrefix: '',
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: 'upload.wikimedia.org' },
      { protocol: 'https', hostname: 'thumb.wikimedia.org' },
      { protocol: 'https', hostname: 'commons.wikimedia.org' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: '**.supabase.co' },
    ],
  },
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  /**
   * Honoured because a server exists. The Node host that runs the app sets
   * these response headers, and `npm run dev` serves them locally too.
   */
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(self)',
          },
        ],
      },
    ];
  },
};

export default nextConfig;