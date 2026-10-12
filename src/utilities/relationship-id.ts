/** Payload relations may be populated documents or scalar IDs. */
export function relationshipID<T extends string | number>(value: T | { id?: T } | null | undefined): T | undefined {
  return value && typeof value === 'object' ? value.id : value ?? undefined
}
