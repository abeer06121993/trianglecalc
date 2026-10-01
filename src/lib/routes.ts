export const appRoutes = {
  calculator: '/',
  privacy: '/privacy',
  imprint: '/imprint',
  contact: '/contact',
  learnTriangleBasics: '/learn/triangle-basics',
} as const;

export const legalPageRoutes = {
  [appRoutes.privacy]: 'privacy',
  [appRoutes.imprint]: 'imprint',
  [appRoutes.contact]: 'contact',
} as const;

export const prerenderedRoutes = [
  appRoutes.calculator,
  appRoutes.privacy,
  appRoutes.imprint,
  appRoutes.contact,
  appRoutes.learnTriangleBasics,
] as const;

export const productNavigation = [
  { key: 'calculator', labelKey: 'navCalculator', href: appRoutes.calculator, state: 'available' },
  { key: 'learn', labelKey: 'navLearn', href: appRoutes.learnTriangleBasics, state: 'available' },
  { key: 'practice', labelKey: 'navPractice', state: 'coming-soon' },
  { key: 'kids', labelKey: 'navKids', state: 'coming-soon' },
] as const;

export const learnInformationArchitecture = [
  {
    key: 'triangle-basics',
    title: 'Triangle Basics',
    items: [
      'What Is a Triangle?',
      'Where Are Triangles Used?',
      'Why Do We Calculate Triangles?',
      'Sides and Angles',
      'Types of Triangles',
      'How Are Triangles Described?',
      'Try It Yourself',
    ],
  },
  {
    key: 'calculate-triangles',
    title: 'Calculate Triangles',
    items: ['Missing angles', 'Missing sides', 'Sine Rule', 'Cosine Rule', 'Pythagorean Theorem'],
  },
  {
    key: 'triangle-geometry',
    title: 'Triangle Geometry',
    items: ['Area', 'Perimeter', 'Height', 'Median', 'Inradius', 'Circumradius'],
  },
] as const;

export const educationalSectionNavigation = [
  { labelKey: 'navHowItWorks', href: '#how-it-works' },
  { labelKey: 'navFormulas', href: '#formulas' },
  { labelKey: 'navFaq', href: '#faq' },
] as const;
