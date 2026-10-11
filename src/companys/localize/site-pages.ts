import sections from './home-sections.json'

export const localizePages = [
  {
    key: 'localize-home',
    company: 'localize',
    slug: 'home',
    route: '/',
    name: 'Página inicial',
    sections: sections.map((s) => s.variant),
  },
] as const
