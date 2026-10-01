'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CATEGORIES } from '@/lib/types';
import { appConfig } from '@/lib/config';
import { BrandMark } from '@/components/brand/brand-mark';

const RESOURCE_LINKS = [
  { href: '/destinations', label: 'All destinations' },
  { href: '/historical-places', label: 'Historical places' },
  { href: '/timeline', label: 'Historical timeline' },
  { href: '/map', label: 'Explore India map' },
  { href: '/trip-planner', label: 'Trip planner' },
  { href: '/search', label: 'Search' },
];

const COMPANY_LINKS = [
  { href: '/about', label: 'About' },
  { href: '/about#sources', label: 'How we source history' },
  { href: '/about#accuracy', label: 'Accuracy policy' },
  { href: '/about#contact', label: 'Contact' },
];

export function Footer() {
  const pathname = usePathname();
  const year = new Date().getFullYear();
  const featuredCategories = CATEGORIES.slice(0, 8);

  // The map page owns the full viewport, so the footer is suppressed there.
  if (pathname === '/map') return null;

  return (
    <footer className="mt-20 border-t border-sand-200 bg-sand-gradient">
      <div className="container-page py-14">
        <div className="grid gap-10 lg:grid-cols-[1.6fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" className="flex items-center gap-2.5">
              <BrandMark className="h-10 w-10" />
              <span className="font-display text-xl font-semibold text-maroon-800">
                Bharat<span className="text-saffron-600"> Darshan</span>
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-charcoal-soft">
              {appConfig.description}
            </p>
            <p className="mt-5 text-xs leading-relaxed text-charcoal-muted">
              Historical records on this site are editorial drafts. Each one links to the
              Archaeological Survey of India, UNESCO and other primary sources so you can
              check the claims yourself.
            </p>
          </div>

          <nav aria-labelledby="footer-explore">
            <h2 id="footer-explore" className="text-sm font-semibold text-charcoal">
              Explore
            </h2>
            <ul className="mt-4 space-y-2.5">
              {RESOURCE_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-charcoal-soft transition-colors hover:text-maroon-700"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-labelledby="footer-categories">
            <h2 id="footer-categories" className="text-sm font-semibold text-charcoal">
              Categories
            </h2>
            <ul className="mt-4 space-y-2.5">
              {featuredCategories.map((category) => (
                <li key={category}>
                  <Link
                    href={`/destinations?category=${encodeURIComponent(category)}`}
                    className="text-sm text-charcoal-soft transition-colors hover:text-maroon-700"
                  >
                    {category}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-labelledby="footer-company">
            <h2 id="footer-company" className="text-sm font-semibold text-charcoal">
              This project
            </h2>
            <ul className="mt-4 space-y-2.5">
              {COMPANY_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-charcoal-soft transition-colors hover:text-maroon-700"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-sand-300 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-charcoal-muted">
            © {year} Bharat Darshan. Built as a heritage discovery and trip-planning
            demonstration.
          </p>
          <ul className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-charcoal-muted">
            <li>
              <a
                href="https://asi.nic.in/"
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="transition-colors hover:text-maroon-700"
              >
                Archaeological Survey of India
              </a>
            </li>
            <li>
              <a
                href="https://whc.unesco.org/"
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="transition-colors hover:text-maroon-700"
              >
                UNESCO World Heritage
              </a>
            </li>
            <li>
              <a
                href="https://www.indiaculture.gov.in/"
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="transition-colors hover:text-maroon-700"
              >
                Ministry of Culture
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
