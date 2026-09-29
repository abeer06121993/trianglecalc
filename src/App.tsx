import { Triangle as TriangleIcon } from 'lucide-react';
import { getTranslation, faqData } from '@/lib/i18n';
import TriangleCalculator from '@/components/TriangleCalculator';
import { EducationalContent } from '@/components/EducationalContent';
import { AdSlot } from '@/components/AdSlot';
import { LegalPage } from '@/components/LegalPage';

function StructuredData() {
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Triangle Calculator',
    description: 'Free triangle calculator to find missing sides and angles. Enter the values you know and calculate a triangle using the sine rule, cosine rule, Pythagorean theorem and more.',
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
  const navItems = [
    { label: t.siteName, href: '#top' },
    { label: t.navHowItWorks, href: '#how-it-works' },
    { label: t.navFormulas, href: '#formulas' },
    { label: t.navFaq, href: '#faq' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-slate-200">
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between" aria-label="Main navigation">
        <a href="#top" className="flex items-center gap-2 font-semibold text-slate-900">
          <TriangleIcon className="w-5 h-5 text-blue-600" aria-hidden="true" />
          <span className="text-sm sm:text-base">{t.siteName}</span>
        </a>
        <ul className="flex items-center gap-1 sm:gap-4">
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
        <span id="formulas" className="sr-only">Triangle Formulas</span>
        <AdSlot className="mb-10" />
        <EducationalContent />
        <span id="faq" className="sr-only">FAQ</span>
      </div>
    </section>
  );
}

function Footer() {
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
        <p className="text-xs text-slate-400">© {new Date().getFullYear()} {t.footerRights}</p>
      </div>
    </footer>
  );
}

function App() {
  const path = window.location.pathname.replace(/\/$/, '') || '/';

  if (path === '/privacy') return <LegalPage type="privacy" />;
  if (path === '/imprint') return <LegalPage type="imprint" />;
  if (path === '/contact') return <LegalPage type="contact" />;

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <StructuredData />
      <Header />
      <main>
        <Hero />
        <CalculatorSection />
        <ContentSection />
      </main>
      <Footer />
    </div>
  );
}

export default App;
