'use client'

/* COMPONENTS */
import { DinamicCombobox } from '@/content/shared/form/dinamicComboBox/DinamicCombobox'
import { DinamicNumberRangeSelect } from '@/content/shared/form/dinamicNumberRangeSelect/DinamicNumberRangeSelect'
import { DinamicCheckboxBoolean } from '@/content/shared/form/dinamicCheckboxBoolean/DinamicCheckboxBoolean'

/* TYPES */
import { TournamentAddFormType } from '../../types/tournamentAddFormType'

export function TournamentAddStep4() {
  return (
    <div className="w-full p-10 h-fit">
      <DinamicCombobox<TournamentAddFormType>
        name="gender_restriction"
        items={[
          { label: 'Femenino', value: 'female' },
          { label: 'Masculino', value: 'male' },
          { label: 'Mixto', value: 'mixed' },
          { label: 'Ninguno', value: 'none' },
        ]}
        label="Restricción de género"
        placeholder="Seleccionar restricción de género"
        rules={{ required: { message: 'La restricción de género es requerida', value: true } }}
      />

      <DinamicCombobox<TournamentAddFormType>
        name="validation_mode"
        items={[
          { label: 'Estricto', value: 'strict' },
          { label: 'Flexible', value: 'flexible' },
          { label: 'Híbrido', value: 'hybrid' },
        ]}
        label="Validación de plantilla"
        placeholder="Seleccionar validación de plantilla"
        rules={{ required: { message: 'La validación de plantilla es requerida', value: true } }}
      />

      <DinamicCombobox<TournamentAddFormType>
        name="eligibility_mode"
        items={[
          { label: 'Estricto', value: 'strict' },
          { label: 'Flexible', value: 'flexible' },
        ]}
        label="Motor de elegibilidad"
        placeholder="Seleccionar motor de elegibilidad"
        rules={{ required: { message: 'El motor de elegibilidad es requerido', value: true } }}
      />

      <DinamicCheckboxBoolean<TournamentAddFormType>
        name="is_public"
        label="Deseo que el torneo sea público"
        wantCustomCheck
      />

      <DinamicNumberRangeSelect<TournamentAddFormType>
        name="total_players_team"
        min={1}
        max={100}
        label="Número de jugadores por equipo"
        rules={{}}
      />

      <DinamicNumberRangeSelect<TournamentAddFormType>
        name="total_teams"
        min={2}
        max={100}
        label="Número de equipos"
        rules={{}}
      />
    </div>
  )
}
