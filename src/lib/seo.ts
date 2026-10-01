import { appRoutes } from './routes.ts';

export interface PageMetadata {
  title: string;
  description: string;
  canonical: string | null;
  robots: string;
}

export const routeMetadata: Record<string, PageMetadata> = {
  [appRoutes.calculator]: {
    title: 'Triangle Calculator – Calculate Missing Sides & Angles',
    description: 'Free triangle calculator to find missing sides and angles. Enter the values you know and calculate a triangle using the sine rule, cosine rule, Pythagorean theorem and more.',
    canonical: 'https://trianglecalc.com/',
    robots: 'index, follow, max-image-preview:large',
  },
  [appRoutes.privacy]: {
    title: 'Privacy Policy | Triangle Calculator',
    description: 'Information about website operation, hosting, advertising and contact details for TriangleCalc.',
    canonical: 'https://trianglecalc.com/privacy',
    robots: 'index, follow',
  },
  [appRoutes.imprint]: {
    title: 'Imprint | Triangle Calculator',
    description: 'Imprint information for TriangleCalc, including operator, contact and editorial responsibility details.',
    canonical: 'https://trianglecalc.com/imprint',
    robots: 'index, follow',
  },
  [appRoutes.contact]: {
    title: 'Contact | Triangle Calculator',
    description: 'Contact page for questions, corrections or feedback about TriangleCalc.',
    canonical: 'https://trianglecalc.com/contact',
    robots: 'index, follow',
  },
  [appRoutes.learnTriangleBasics]: {
    title: 'Triangle Basics – Sides, Angles & Types of Triangles',
    description: 'Learn what triangles are, how their sides and angles relate, where they appear in everyday life, and how to recognize common triangle types.',
    canonical: 'https://trianglecalc.com/learn/triangle-basics',
    robots: 'index, follow',
  },
};

export const notFoundMetadata: PageMetadata = {
  title: 'Page not found | Triangle Calculator',
  description: 'The requested page could not be found.',
  canonical: null,
  robots: 'noindex, nofollow',
};

export const socialPreviewUrl = 'https://trianglecalc.com/social-preview.png';
export const socialPreviewAlt = 'Triangle Calculator with a labeled triangle and the sine rule, cosine rule, and Pythagorean theorem.';

export function normalizeRoutePath(pathname: string): string {
  return pathname.replace(/\/$/, '') || '/';
}

export function getPageMetadata(pathname: string): PageMetadata {
  return routeMetadata[normalizeRoutePath(pathname)] ?? notFoundMetadata;
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  })[character]!);
}

export function renderSeoMetadata(metadata: PageMetadata): string {
  const canonicalTags = metadata.canonical
    ? '<link rel="canonical" href="' + escapeHtml(metadata.canonical) + '" />\n<meta property="og:url" content="' + escapeHtml(metadata.canonical) + '" />'
    : '';

  return [
    '<!-- page-seo:start -->',
    '<title>' + escapeHtml(metadata.title) + '</title>',
    '<meta name="description" content="' + escapeHtml(metadata.description) + '" />',
    canonicalTags,
    '<meta name="robots" content="' + escapeHtml(metadata.robots) + '" />',
    '<meta property="og:type" content="website" />',
    '<meta property="og:title" content="' + escapeHtml(metadata.title) + '" />',
    '<meta property="og:description" content="' + escapeHtml(metadata.description) + '" />',
    '<meta property="og:site_name" content="TriangleCalc" />',
    '<meta property="og:locale" content="en_US" />',
    '<meta property="og:image" content="' + socialPreviewUrl + '" />',
    '<meta property="og:image:type" content="image/png" />',
    '<meta property="og:image:width" content="1200" />',
    '<meta property="og:image:height" content="630" />',
    '<meta property="og:image:alt" content="' + escapeHtml(socialPreviewAlt) + '" />',
    '<meta name="twitter:card" content="summary_large_image" />',
    '<meta name="twitter:title" content="' + escapeHtml(metadata.title) + '" />',
    '<meta name="twitter:description" content="' + escapeHtml(metadata.description) + '" />',
    '<meta name="twitter:image" content="' + socialPreviewUrl + '" />',
    '<!-- page-seo:end -->',
  ].filter(Boolean).join('\n');
}
