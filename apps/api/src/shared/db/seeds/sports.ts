import { db } from '@/shared/db/client'
import { sports } from '@/shared/db/schemas'

export async function seedSports() {
  await db
    .insert(sports)
    .values([
      {
        name: 'Fútbol',
        slug: 'futbol',
        metadata: {
          scoring_type: 'points',
          points_win: 3,
          points_draw: 1,
          points_loss: 0,
          tiebreaker: ['points', 'goal_difference', 'goals_for', 'head_to_head', 'fair_play'],
        },
      },
      {
        name: 'Básquetbol',
        slug: 'basquetbol',
        metadata: {
          scoring_type: 'pct',
          points_win: 1,
          points_draw: 0,
          points_loss: 0,
          tiebreaker: ['pct', 'head_to_head', 'point_differential'],
        },
      },
      {
        name: 'Béisbol',
        slug: 'beisbol',
        metadata: {
          scoring_type: 'pct',
          points_win: 1,
          points_draw: 0,
          points_loss: 0,
          tiebreaker: ['pct', 'head_to_head', 'run_differential'],
        },
      },
      {
        name: 'Voleibol',
        slug: 'voleibol',
        metadata: {
          scoring_type: 'set_ratio',
          points_win: 1,
          points_draw: 0,
          points_loss: 0,
          tiebreaker: ['set_ratio', 'point_ratio'],
        },
      },
    ])
    .onConflictDoNothing()
}
