import { useEffect } from 'react';
import { Triangle as TriangleIcon } from 'lucide-react';
import { getTranslation, faqData } from '@/lib/i18n';
import TriangleCalculator from '@/components/TriangleCalculator';
import { EducationalContent } from '@/components/EducationalContent';
import { AdSlot } from '@/components/AdSlot';
import { LegalPage } from '@/components/LegalPage';
import { TriangleBasicsPage } from '@/components/TriangleBasicsPage';
import { PageContainer, PageSection } from '@/components/PageContainer';
import { SectionNavigation } from '@/components/SectionNavigation';
import { SiteFooter } from '@/components/SiteFooter';
import { SiteHeader } from '@/components/SiteHeader';
import { appRoutes, legalPageRoutes } from '@/lib/routes';
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

function StructuredData({ pathname }: { pathname: string }) {
  if (pathname === appRoutes.learnTriangleBasics) {
    const learningResourceSchema = {
      '@context': 'https://schema.org',
      '@type': 'LearningResource',
      name: 'Triangle Basics: Sides, Angles & Types of Triangles',
      description: routeMetadata[appRoutes.learnTriangleBasics].description,
      url: routeMetadata[appRoutes.learnTriangleBasics].canonical,
      inLanguage: 'en',
      learningResourceType: 'Interactive lesson',
      educationalLevel: 'Beginner',
      about: ['Triangles', 'Triangle sides', 'Triangle angles', 'Types of triangles'],
    };
    const breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Triangle Calculator', item: routeMetadata[appRoutes.calculator].canonical },
        { '@type': 'ListItem', position: 2, name: 'Learn: Triangle Basics', item: routeMetadata[appRoutes.learnTriangleBasics].canonical },
      ],
    };

    return (
      <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(learningResourceSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      </>
    );
  }

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Triangle Calculator',
    description: routeMetadata[appRoutes.calculator].description,
    url: routeMetadata[appRoutes.calculator].canonical,
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

function Hero() {
  const t = getTranslation();

  return (
    <PageSection id="top" className="pb-4 pt-6 sm:pt-10">
      <PageContainer>
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 leading-tight mb-3">
          {t.heroTitle}
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">
          {t.heroIntro}
        </p>
      </PageContainer>
    </PageSection>
  );
}

function CalculatorSection() {
  return (
    <PageSection className="pb-8" ariaLabel="Triangle calculator">
      <PageContainer>
        <TriangleCalculator />
        <AdSlot className="mt-6" />
      </PageContainer>
    </PageSection>
  );
}

function ContentSection() {
  return (
    <PageSection id="how-it-works" className="border-t border-slate-100 py-12 sm:py-16">
      <PageContainer size="content">
        <SectionNavigation />
        <AdSlot className="mb-10" />
        <EducationalContent />
      </PageContainer>
    </PageSection>
  );
}

export interface AppProps {
  pathname?: string;
  prerenderedYear?: number;
}

function App({ pathname, prerenderedYear }: AppProps = {}) {
  const path = normalizeRoutePath(pathname ?? (typeof window === 'undefined' ? '/' : window.location.pathname));
  const metadata = getPageMetadata(path);

  const legalPageType = legalPageRoutes[path as keyof typeof legalPageRoutes];
  if (legalPageType) return <><RouteMetadata metadata={metadata} /><LegalPage type={legalPageType} /></>;

  if (path === appRoutes.learnTriangleBasics) {
    return (
      <div className="min-h-screen bg-white text-slate-900">
        <RouteMetadata metadata={metadata} />
        <StructuredData pathname={path} />
        <SiteHeader activeRoute={path} />
        <TriangleBasicsPage />
        <SiteFooter year={prerenderedYear ?? new Date().getFullYear()} />
      </div>
    );
  }

  if (path !== appRoutes.calculator) {
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
      <StructuredData pathname={path} />
      <SiteHeader />
      <main>
        <Hero />
        <CalculatorSection />
        <ContentSection />
      </main>
      <SiteFooter year={prerenderedYear ?? new Date().getFullYear()} />
    </div>
  );
}

export default App;
