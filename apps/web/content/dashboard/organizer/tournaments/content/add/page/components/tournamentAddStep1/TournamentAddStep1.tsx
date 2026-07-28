'use client'

/* COMPONENTS */
import { DinamicInputText } from '@/content/shared/form/dinamicInputText/DinamicInputText'
import { DinamicTextArea } from '@/content/shared/form/dinamicTextArea/DinamicTextArea'
import { DinamicCheckboxOptions } from '@/content/shared/form/dinamicCheckboxOptions/DinamicCheckboxOptions'
import { DinamicTagsGroup } from '@/content/shared/form/dinamicTagsGroup/DinamicTagsGroup'
import { DinamicInputDate } from '@/content/shared/form/dinamicInputDate/DinamicInputDate'
import { SpecificInputFileImage } from '../specificInputFileImage/SpecificInputFileImage'

/* TYPES */
import { TournamentAddFormType } from '../../types/tournamentAddFormType'
import { CheckboxOption } from '@/content/shared/form/dinamicCheckboxOptions/types/dinamicCheckboxOptionsProps'

export function TournamentAddStep1({
  preview,
  sports,
}: {
  preview: string | null
  sports: CheckboxOption[] | null
}) {
  return (
    <div className="w-full p-10 h-fit">
      <div className="flex flex-col w-full gap-2 h-fit md:flex-row md:gap-6 md:items-center">
        {/* FOTO */}
        <SpecificInputFileImage<TournamentAddFormType>
          name="banner_url"
          preview={preview}
          rules={{
            validate: (file) => {
              if (!(file instanceof File)) return true

              if (file.size > 5_000_000) {
                return 'El archivo debe pesar menos de 5MB'
              }

              return true
            },
            required: { message: 'El banner del torneo es requerido', value: true },
          }}
        />

        <div className="flex flex-col w-full">
          {/* NAME */}
          <DinamicInputText<TournamentAddFormType>
            name="name"
            label="Nombre del torneo"
            type="text"
            placeholder="Ingrese el nombre"
            rules={{ required: { message: 'El nombre del torneo es requerido', value: true } }}
          />

          {/* DESCRIPTION */}
          <DinamicTextArea<TournamentAddFormType>
            name="description"
            label="Descripción"
            placeholder="Ingrese la descripción"
            rules={{ required: { message: 'La descripción del torneo es requerida', value: true } }}
            twHeight="h-24"
          />
        </div>
      </div>

      {sports !== null && (
        <DinamicCheckboxOptions<TournamentAddFormType>
          name="sport_id"
          label="Deporte"
          multiple={false}
          options={sports}
          rules={{ required: { message: 'El deporte es requerido', value: true } }}
        />
      )}

      <DinamicTagsGroup<TournamentAddFormType>
        name="tags"
        label="Agregar etiquetas"
        placeholder="Presione Enter/+ para agregar una etiqueta"
        rules={{}}
      />

      <DinamicInputDate<TournamentAddFormType>
        name="registrationInterval"
        label="Intervalo de registro"
        placeholder="Seleccione dos fechas"
        rules={{ required: { message: 'El intervalo de registro es requerido', value: true } }}
        mode="range"
      />

      <DinamicInputDate<TournamentAddFormType>
        name="gameInterval"
        label="Intervalo de juego"
        placeholder="Seleccione dos fechas"
        rules={{ required: { message: 'El intervalo de juego es requerido', value: true } }}
        mode="range"
      />
    </div>
  )
}
