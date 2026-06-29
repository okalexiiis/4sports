"use client";

/* COMPONENTS */
import { DinamicCombobox } from "@/content/shared/form/dinamicComboBox/DinamicCombobox";

/* TYPES */
import { TournamentAddFormType } from "../../types/tournamentAddFormType";
import { DinamicNumberRangeSelect } from "@/content/shared/form/dinamicNumberRangeSelect/DinamicNumberRangeSelect";

export function TournamentAddStep4() {
  return (
    <div className="w-full h-fit p-10">
      <DinamicCombobox<TournamentAddFormType>
        name="sex"
        items={[
          { label: "Femenino", value: "f" },
          { label: "Masculino", value: "m" },
          { label: "Mixto", value: "mix" },
        ]}
        label="Restricción de género"
        placeholder="Seleccionar restricción de género"
        rules={{}}
      />

      <DinamicNumberRangeSelect<TournamentAddFormType>
        name="ageGap"
        min={0}
        max={100}
        label="Rango de edad"
        rules={{}}
      />

      <DinamicCombobox<TournamentAddFormType>
        name="templateValidation"
        items={[
          { label: "Estricto", value: "s" },
          { label: "Flexible", value: "f" },
          { label: "Híbrido", value: "h" },
        ]}
        label="Validación de plantilla"
        placeholder="Seleccionar validación de plantilla"
        rules={{}}
      />

      <DinamicCombobox<TournamentAddFormType>
        name="eligibility"
        items={[
          { label: "Estricto", value: "s" },
          { label: "Flexible", value: "f" },
        ]}
        label="Motor de elegibilidad"
        placeholder="Seleccionar motor de elegibilidad"
        rules={{}}
      />
    </div>
  );
}
