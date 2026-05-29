import type {
  Convocatoria,
  ConvocatoriaResponse,
  UpsertConvocatoriaInput,
} from './convocatoria.entity'

export interface IConvocatoriaRepository {
  upsertMany(inputs: UpsertConvocatoriaInput[]): Promise<Convocatoria[]>
  findById(id: string): Promise<Convocatoria | null>
  findByMatchAndPlayer(matchId: string, playerId: string): Promise<Convocatoria | null>
  listByMatch(matchId: string): Promise<Convocatoria[]>
  updateResponse(
    id: string,
    response: ConvocatoriaResponse,
    respondedAt: Date,
  ): Promise<Convocatoria>
}
