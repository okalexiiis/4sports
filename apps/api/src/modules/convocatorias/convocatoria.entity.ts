export type ConvocatoriaResponse = 'pending' | 'va' | 'no_va' | 'duda'

export interface Convocatoria {
  id: string
  match_id: string
  player_id: string
  team_id: string
  response: ConvocatoriaResponse
  responded_at: Date | null
  created_at: Date
}

export interface UpsertConvocatoriaInput {
  match_id: string
  player_id: string
  team_id: string
  sent_by: string
}
