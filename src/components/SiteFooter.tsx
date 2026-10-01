import { getTranslation } from '@/lib/i18n';
import { appRoutes } from '@/lib/routes';
import { PageContainer } from './PageContainer';

export function SiteFooter({ year }: { year: number }) {
  const t = getTranslation();

  return (
    <footer className="border-t border-slate-200 bg-slate-50 py-8">
      <PageContainer size="content" className="text-center">
        <p className="mb-2 text-sm leading-relaxed text-slate-500">{t.footerNote}</p>
        <div className="mb-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-slate-400">
          <a href={appRoutes.privacy} className="hover:text-slate-600">Privacy Policy</a>
          <a href={appRoutes.imprint} className="hover:text-slate-600">Imprint</a>
          <a href={appRoutes.contact} className="hover:text-slate-600">Contact</a>
        </div>
        <p className="text-xs text-slate-400">© {year} {t.footerRights}</p>
      </PageContainer>
    </footer>
  );
}
