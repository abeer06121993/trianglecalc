import { useEffect, useRef, useState } from 'react';
import { Menu, Triangle as TriangleIcon, X } from 'lucide-react';
import { getTranslation } from '@/lib/i18n';
import { appRoutes, productNavigation } from '@/lib/routes';
import { PageContainer } from './PageContainer';

export function SiteHeader({ activeRoute = appRoutes.calculator }: { activeRoute?: string }) {
  const t = getTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const firstMenuLinkRef = useRef<HTMLAnchorElement>(null);

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
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-sm">
      <nav aria-label={t.primaryNavigation}>
        <PageContainer>
          <div className="flex h-14 items-center justify-between gap-3">
            <a href={appRoutes.calculator} className="flex min-w-0 items-center gap-2 font-semibold text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-md">
              <TriangleIcon className="h-5 w-5 flex-shrink-0 text-blue-600" aria-hidden="true" />
              <span className="truncate text-sm sm:text-base">{t.siteName}</span>
            </a>
            <ul className="hidden items-center gap-1 md:flex sm:gap-2">
              {productNavigation.map((item) => (
                <li key={item.key}>
                  {item.state === 'available' ? (
                    <a
                      href={item.href}
                      aria-current={item.href === activeRoute ? 'page' : undefined}
                      className="rounded-md bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                    >
                      {t[item.labelKey]}
                    </a>
                  ) : (
                    <span aria-disabled="true" className="inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-sm text-slate-400">
                      {t[item.labelKey]}
                      <span className="text-[10px] text-slate-400">{t.comingSoon}</span>
                    </span>
                  )}
                </li>
              ))}
            </ul>
            <button
              ref={menuButtonRef}
              type="button"
              className="inline-flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 md:hidden"
              aria-label={mobileMenuOpen ? t.closeNavigationMenu : t.openNavigationMenu}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation"
              onClick={() => setMobileMenuOpen((open) => !open)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
            </button>
          </div>
          {mobileMenuOpen && (
            <ul id="mobile-navigation" className="-mx-4 border-t border-slate-200 bg-white px-2 py-2 shadow-lg sm:-mx-6 md:hidden">
              {productNavigation.map((item, index) => (
                <li key={item.key}>
                  {item.state === 'available' ? (
                    <a
                      ref={index === 0 ? firstMenuLinkRef : undefined}
                      href={item.href}
                      aria-current={item.href === activeRoute ? 'page' : undefined}
                      onClick={closeMobileMenu}
                      className="block rounded-lg bg-blue-50 px-4 py-3 text-sm font-medium text-blue-700 hover:bg-blue-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                    >
                      {t[item.labelKey]}
                    </a>
                  ) : (
                    <span aria-disabled="true" className="flex items-center justify-between rounded-lg px-4 py-3 text-sm text-slate-400">
                      <span>{t[item.labelKey]}</span>
                      <span className="text-xs">{t.comingSoon}</span>
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </PageContainer>
      </nav>
    </header>
  );
}
