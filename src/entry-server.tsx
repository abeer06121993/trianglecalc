import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import App from './App';
import { getPageMetadata, normalizeRoutePath, renderSeoMetadata, routeMetadata } from './lib/seo';

const prerenderPaths = ['/', '/privacy', '/imprint', '/contact'] as const;

export { prerenderPaths };

export function renderPrerenderedDocument(template: string, pathname: string): string {
  const path = normalizeRoutePath(pathname);
  if (!(prerenderPaths as readonly string[]).includes(path)) {
    throw new Error('Cannot prerender an unapproved route: ' + path);
  }

  const year = new Date().getFullYear();
  const renderedApp = renderToString(
    <StrictMode>
      <App pathname={path} prerenderedYear={year} />
    </StrictMode>,
  );
  const pageMetadata = getPageMetadata(path);
  const seoMarkup = path === '/'
    ? renderSeoMetadata(routeMetadata['/'])
    : renderSeoMetadata(pageMetadata);
  const rootMarkup = '<div id="root" data-prerendered-year="' + year + '">' + renderedApp + '</div>';

  if (!template.includes('<!-- page-seo:start -->') || !template.includes('<!-- page-seo:end -->')) {
    throw new Error('Vite HTML is missing the page SEO markers.');
  }
  if (!/<div id="root"><\/div>/.test(template)) {
    throw new Error('Vite HTML is missing the empty React root.');
  }

  return template
    .replace(/<!-- page-seo:start -->[\s\S]*?<!-- page-seo:end -->/, seoMarkup)
    .replace('<div id="root"></div>', rootMarkup);
}
