import type { Sport } from './sports.entity'

export interface ISportsRepository {
  listAll(): Promise<Sport[]>
  findById(id: string): Promise<Sport | null>
}
