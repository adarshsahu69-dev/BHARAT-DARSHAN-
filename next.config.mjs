/**
 * Next.js configuration.
 *
 * A `.mjs` file, not `.ts`, and that is deliberate. `actions/configure-pages`
 * patches the config to inject the Pages `basePath`, and it only recognises
 * `.js`, `.cjs` and `.mjs`. With a `next.config.ts` present it silently creates a
 * blank `next.config.js` instead — and since Next loads `.js` before `.ts`, every
 * setting in this file would be ignored in CI while working perfectly locally.
 * `.mjs` is the extension the action can actually patch, so this file is the one
 * that builds the deployed site.
 *
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  /**
   * GitHub Pages serves files only — there is no Node runtime, no middleware
   * and no server actions. `output: 'export'` makes that contract explicit
   * locally too, so a build that cannot be exported fails on your machine
   * instead of only in CI. `actions/configure-pages` injects the same value.
   *
   * Consequences, all deliberate:
   * - every route must be prerenderable, so no `force-dynamic` segments and no
   *   route handlers that read the request;
   * - `trailingSlash` emits `<route>/index.html`, which is what Pages needs to
   *   resolve extensionless URLs;
   * - `images.unoptimized` replaces the absent image optimiser. The original
   *   image URL is used instead, so `next/image` still lays out and lazy-loads,
   *   it just does not resize.
   */
  output: 'export',
  trailingSlash: true,
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  images: {
    unoptimized: true,
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
   * Only honoured where a server exists. `next build` warns that these are
   * dropped by `output: 'export'`, and GitHub Pages has no header configuration
   * at all, so the deployed site does not receive them. They are kept because
   * `npm run dev` still serves them, and because the same config keeps working
   * unchanged if the site later moves to a host that can set response headers.
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