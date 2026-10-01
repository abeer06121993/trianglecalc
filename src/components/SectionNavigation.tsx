import { getTranslation } from '@/lib/i18n';
import { educationalSectionNavigation } from '@/lib/routes';

export function SectionNavigation() {
  const t = getTranslation();

  return (
    <nav aria-label={t.educationalSectionNavigation} className="mb-8 flex flex-wrap gap-2">
      {educationalSectionNavigation.map((item) => (
        <a
          key={item.href}
          href={item.href}
          className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          {t[item.labelKey]}
        </a>
      ))}
    </nav>
  );
}
