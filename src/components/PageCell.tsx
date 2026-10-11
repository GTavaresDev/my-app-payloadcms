/** Display page names in Portuguese without changing the API identifiers. */
export function PageCell({ cellData }: { cellData?: string }) {
  return <span>{cellData === 'home' ? 'Página inicial' : cellData}</span>
}
