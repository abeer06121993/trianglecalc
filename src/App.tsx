import { useEffect, useRef, useState } from 'react';
import { Menu, Triangle as TriangleIcon, X } from 'lucide-react';
import { getTranslation, faqData } from '@/lib/i18n';
import TriangleCalculator from '@/components/TriangleCalculator';
import { EducationalContent } from '@/components/EducationalContent';
import { AdSlot } from '@/components/AdSlot';
import { LegalPage } from '@/components/LegalPage';
import {
  getPageMetadata,
  normalizeRoutePath,
  routeMetadata,
  socialPreviewAlt,
  socialPreviewUrl,
  type PageMetadata,
} from '@/lib/seo';

function setMetaContent(selector: string, attribute: string, key: string, value: string) {
  let meta = document.head.querySelector<HTMLMetaElement>(selector);
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute(attribute, key);
    document.head.appendChild(meta);
  }
  meta.content = value;
}

function RouteMetadata({ metadata }: { metadata: PageMetadata }) {
  useEffect(() => {
    document.title = metadata.title;
    setMetaContent('meta[name="description"]', 'name', 'description', metadata.description);
    setMetaContent('meta[name="robots"]', 'name', 'robots', metadata.robots);
    setMetaContent('meta[property="og:title"]', 'property', 'og:title', metadata.title);
    setMetaContent('meta[property="og:description"]', 'property', 'og:description', metadata.description);
    setMetaContent('meta[property="og:type"]', 'property', 'og:type', 'website');
    setMetaContent('meta[property="og:site_name"]', 'property', 'og:site_name', 'TriangleCalc');
    setMetaContent('meta[property="og:image"]', 'property', 'og:image', socialPreviewUrl);
    setMetaContent('meta[property="og:image:type"]', 'property', 'og:image:type', 'image/png');
    setMetaContent('meta[property="og:image:width"]', 'property', 'og:image:width', '1200');
    setMetaContent('meta[property="og:image:height"]', 'property', 'og:image:height', '630');
    setMetaContent('meta[property="og:image:alt"]', 'property', 'og:image:alt', socialPreviewAlt);
    setMetaContent('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image');
    setMetaContent('meta[name="twitter:title"]', 'name', 'twitter:title', metadata.title);
    setMetaContent('meta[name="twitter:description"]', 'name', 'twitter:description', metadata.description);
    setMetaContent('meta[name="twitter:image"]', 'name', 'twitter:image', socialPreviewUrl);

    const canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (metadata.canonical) {
      if (canonical) canonical.href = metadata.canonical;
      else {
        const link = document.createElement('link');
        link.rel = 'canonical';
        link.href = metadata.canonical;
        document.head.appendChild(link);
      }
      setMetaContent('meta[property="og:url"]', 'property', 'og:url', metadata.canonical);
    } else {
      canonical?.remove();
      document.head.querySelector('meta[property="og:url"]')?.remove();
    }
  }, [metadata]);

  return null;
}

function StructuredData() {
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Triangle Calculator',
    description: routeMetadata['/'].description,
    url: 'https://trianglecalc.com/',
    applicationCategory: 'MathematicsApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    featureList: [
      'Calculate missing sides of a triangle',
      'Calculate missing angles of a triangle',
      'Support for SSS, SAS, ASA, AAS, and SSA cases',
      'Handles ambiguous triangles with two solutions',
      'Dynamic triangle visualization',
      'Centimeter and inch unit support',
    ],
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqData.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  );
}

function Header() {
  const t = getTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const firstMenuLinkRef = useRef<HTMLAnchorElement>(null);
  const navItems = [
    { label: t.siteName, href: '#top' },
    { label: t.navHowItWorks, href: '#how-it-works' },
    { label: t.navFormulas, href: '#formulas' },
    { label: t.navFaq, href: '#faq' },
  ];

  useEffect(() => {
    if (!mobileMenuOpen) return;

    firstMenuLinkRef.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMobileMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    requestAnimationFrame(() => menuButtonRef.current?.focus());
  };

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-slate-200">
      <nav className="max-w-6xl mx-auto px-4 sm:px-6" aria-label="Main navigation">
        <div className="h-14 flex items-center justify-between gap-3">
          <a href="#top" className="flex min-w-0 items-center gap-2 font-semibold text-slate-900">
            <TriangleIcon className="w-5 h-5 flex-shrink-0 text-blue-600" aria-hidden="true" />
            <span className="truncate text-sm sm:text-base">{t.siteName}</span>
          </a>
          <ul className="hidden md:flex items-center gap-1 sm:gap-4">
            {navItems.slice(1).map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="text-xs sm:text-sm text-slate-600 hover:text-slate-900 px-2 sm:px-3 py-1.5 rounded-md hover:bg-slate-100 transition-colors"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <button
            ref={menuButtonRef}
            type="button"
            className="md:hidden inline-flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMobileMenuOpen((open) => !open)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
          </button>
        </div>
        {mobileMenuOpen && (
          <ul id="mobile-navigation" className="md:hidden -mx-4 sm:-mx-6 border-t border-slate-200 bg-white px-2 py-2 shadow-lg">
            {navItems.slice(1).map((item, index) => (
              <li key={item.href}>
                <a
                  ref={index === 0 ? firstMenuLinkRef : undefined}
                  href={item.href}
                  onClick={closeMobileMenu}
                  className="block rounded-lg px-4 py-3 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        )}
      </nav>
    </header>
  );
}

function Hero() {
  const t = getTranslation();

  return (
    <section className="pt-6 sm:pt-10 pb-4" id="top">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 leading-tight mb-3">
          {t.heroTitle}
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">
          {t.heroIntro}
        </p>
      </div>
    </section>
  );
}

function CalculatorSection() {
  return (
    <section className="pb-8" aria-label="Triangle calculator">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <TriangleCalculator />
        <AdSlot className="mt-6" />
      </div>
    </section>
  );
}

function ContentSection() {
  return (
    <section id="how-it-works" className="py-12 sm:py-16 border-t border-slate-100">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <AdSlot className="mb-10" />
        <EducationalContent />
      </div>
    </section>
  );
}

function Footer({ year }: { year: number }) {
  const t = getTranslation();

  return (
    <footer className="border-t border-slate-200 py-8 bg-slate-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <p className="text-sm text-slate-500 leading-relaxed mb-2">
          {t.footerNote}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-slate-400 mb-3">
          <a href="/privacy" className="hover:text-slate-600">Privacy Policy</a>
          <a href="/imprint" className="hover:text-slate-600">Imprint</a>
          <a href="/contact" className="hover:text-slate-600">Contact</a>
        </div>
        <p className="text-xs text-slate-400">© {year} {t.footerRights}</p>
      </div>
    </footer>
  );
}

export interface AppProps {
  pathname?: string;
  prerenderedYear?: number;
}

function App({ pathname, prerenderedYear }: AppProps = {}) {
  const path = normalizeRoutePath(pathname ?? (typeof window === 'undefined' ? '/' : window.location.pathname));
  const metadata = getPageMetadata(path);

  if (path === '/privacy') return <><RouteMetadata metadata={metadata} /><LegalPage type="privacy" /></>;
  if (path === '/imprint') return <><RouteMetadata metadata={metadata} /><LegalPage type="imprint" /></>;
  if (path === '/contact') return <><RouteMetadata metadata={metadata} /><LegalPage type="contact" /></>;

  if (path !== '/') {
    return (
      <>
        <RouteMetadata metadata={metadata} />
        <main className="min-h-screen flex flex-col items-center justify-center px-4 text-center bg-white text-slate-900">
          <a href="/" className="mb-8 flex items-center gap-2 font-semibold text-slate-900">
            <TriangleIcon className="h-5 w-5 text-blue-600" aria-hidden="true" />
            <span>Triangle Calculator</span>
          </a>
          <h1 className="text-2xl sm:text-3xl font-bold">Page not found</h1>
          <p className="mt-3 text-slate-600">The page you’re looking for doesn’t exist or may have moved.</p>
          <a href="/" className="mt-6 rounded-lg bg-blue-600 px-5 py-3 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500/20">
            Back to Triangle Calculator
          </a>
        </main>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <RouteMetadata metadata={metadata} />
      <StructuredData />
      <Header />
      <main>
        <Hero />
        <CalculatorSection />
        <ContentSection />
      </main>
      <Footer year={prerenderedYear ?? new Date().getFullYear()} />
    </div>
  );
}

export default App;
