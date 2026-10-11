import localizeSections from './localize/home-sections.json'
import rastrearSections from './rastrear/home-sections.json'

export const sections = [
  ...localizeSections,
  ...rastrearSections,
]

export { localizeSections, rastrearSections }
export default sections
