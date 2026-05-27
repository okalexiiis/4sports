export interface SportPosition {
  id: string
  name: string
  slug: string
  abbreviation: string | null
}

export interface Sport {
  id: string
  name: string
  slug: string
  icon_url: string | null
  metadata: Record<string, unknown>
  positions: SportPosition[]
}
