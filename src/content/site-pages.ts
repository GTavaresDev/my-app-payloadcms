import sections from './home-sections.json'

export const sitePages = [
  {
    key: 'localize-home',
    company: 'localize',
    slug: 'home',
    route: '/',
    name: 'Página inicial',
    sections: sections
      .filter((s) => s.company === 'localize')
      .map((s) => s.variant),
  },
  {
    key: 'rastrear-home',
    company: 'rastrear',
    slug: 'home',
    route: '/',
    name: 'Página inicial',
    sections: ['rasHero', 'rasFeatures', 'rasTestimonial', 'rasFaq'],
  },
  {
    key: 'rastrear-logistica',
    company: 'rastrear',
    slug: 'logistica',
    route: '/logistica',
    name: 'Logística',
    sections: ['rasTower', 'rasGallery'],
  },
] as const
