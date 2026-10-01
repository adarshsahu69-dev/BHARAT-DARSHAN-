import type { Metadata, Viewport } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/lib/auth/session-provider';
import { ToastProvider } from '@/components/ui/toast';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';
import { MobileBottomNav } from '@/components/layout/mobile-bottom-nav';
import { DemoModeBanner } from '@/components/layout/demo-mode-banner';
import { appConfig } from '@/lib/config';

/**
 * Playfair Display for historical display type, Inter for everything else.
 * `display: swap` keeps text readable while the webfont loads, and the CSS
 * variables are referenced by the Tailwind `font-display` / `font-sans` families.
 */
const display = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-display',
  weight: ['500', '600', '700'],
});

const sans = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

export const metadata: Metadata = {
  metadataBase: new URL(appConfig.url),
  title: {
    default: `${appConfig.name} — ${appConfig.tagline}`,
    template: `%s | ${appConfig.name}`,
  },
  description: appConfig.description,
  applicationName: appConfig.name,
  keywords: [
    'India heritage',
    'historical places India',
    'UNESCO World Heritage India',
    'Indian monuments',
    'heritage travel India',
    'temple architecture',
    'forts and palaces India',
    'trip planner India',
  ],
  authors: [{ name: appConfig.name }],
  openGraph: {
    type: 'website',
    siteName: appConfig.name,
    title: `${appConfig.name} — ${appConfig.tagline}`,
    description: appConfig.description,
    url: appConfig.url,
    locale: appConfig.locale,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${appConfig.name} — ${appConfig.tagline}`,
    description: appConfig.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  category: 'travel',
  alternates: { canonical: appConfig.url },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fbf7f0' },
  ],
  colorScheme: 'light',
  width: 'device-width',
  initialScale: 1,
  // Zoom is left enabled: disabling it fails WCAG 1.4.4.
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={`${display.variable} ${sans.variable}`}>
      <body className="min-h-dvh">
        <ToastProvider>
          <AuthProvider>
            <DemoModeBanner />
            <Navbar />
            {/*
              Bottom padding on md+ would be dead space; on mobile it clears the
              fixed bottom navigation bar.
            */}
            <main id="main" className="pb-[4.25rem] md:pb-0">
              {children}
            </main>
            <Footer />
            <MobileBottomNav />
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
