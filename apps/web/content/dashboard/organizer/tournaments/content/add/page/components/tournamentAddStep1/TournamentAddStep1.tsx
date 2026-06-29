"use client";

/* COMPONENTS */
import { DinamicInputText } from "@/content/shared/form/dinamicInputText/DinamicInputText";
import { DinamicInputFile } from "@/content/shared/form/dinamicInputFile/DinamicInputFile";
import { DinamicTextArea } from "@/content/shared/form/dinamicTextArea/DinamicTextArea";
import { DinamicCheckboxOptions } from "@/content/shared/form/dinamicCheckboxOptions/DinamicCheckboxOptions";
import { DinamicTagsGroup } from "@/content/shared/form/dinamicTagsGroup/DinamicTagsGroup";
import { DinamicInputDate } from "@/content/shared/form/dinamicInputDate/DinamicInputDate";
import { SpecificInputFileImage } from "../specificInputFileImage/SpecificInputFileImage";

/* TYPES */
import { TournamentAddFormType } from "../../types/tournamentAddFormType";

export function TournamentAddStep1({ preview }: { preview: string | null }) {
  return (
    <div className="w-full h-fit p-10">
      <div className="w-full h-fit flex md:flex-row flex-col md:gap-6 gap-2 md:items-center">
        {/* FOTO */}
        <SpecificInputFileImage<TournamentAddFormType>
          name="image"
          preview={preview}
          rules={{
            validate: (file) => {
              if (!(file instanceof File)) return true;

              if (file.size > 5_000_000) {
                return "El archivo debe pesar menos de 5MB";
              }

              return true;
            },
          }}
        />

        <div className="flex flex-col w-full">
          {/* NAME */}
          <DinamicInputText<TournamentAddFormType>
            name="name"
            label="Nombre del torneo"
            type="text"
            placeholder="Ingrese el nombre"
            rules={{}}
          />

          {/* DESCRIPTION */}
          <DinamicTextArea<TournamentAddFormType>
            name="description"
            label="Descripción"
            placeholder="Ingrese la descripción"
            rules={{}}
            twHeight="h-24"
          />
        </div>
      </div>

      <DinamicCheckboxOptions<TournamentAddFormType>
        name="sport"
        label="Deporte"
        multiple={false}
        options={[
          { label: "Básquetbol", value: "basketball" },
          { label: "Fútbol", value: "futball" },
          { label: "Tochito", value: "tochito" },
        ]}
      />

      <DinamicTagsGroup<TournamentAddFormType>
        name="tags"
        label="Agregar etiquetas"
        placeholder="Presione Enter/+ para agregar una etiqueta"
        rules={{}}
      />

      <DinamicInputFile<TournamentAddFormType>
        name="rules"
        variant="default"
        label="Reglamento (Opcional)"
        placeholder="Agregar reglamento"
        rules={{}}
      />

      <DinamicInputDate<TournamentAddFormType>
        name="registrationInterval"
        label="Intervalo de registro"
        placeholder="Seleccione dos fechas"
        rules={{}}
        mode="range"
      />

      <DinamicInputDate<TournamentAddFormType>
        name="gameInterval"
        label="Intervalo de juego"
        placeholder="Seleccione dos fechas"
        rules={{}}
        mode="range"
      />
    </div>
  );
}
