"use client";

/* COMPONENTS */
import { DinamicInputNumber } from "@/content/shared/form/dinamicInputNumber/DinamicInputNumber";
import { DinamicCheckboxOptions } from "@/content/shared/form/dinamicCheckboxOptions/DinamicCheckboxOptions";
import { DinamicCombobox } from "@/content/shared/form/dinamicComboBox/DinamicCombobox";

/* TYPES */
import { TournamentAddFormType } from "../../types/tournamentAddFormType";

export function TournamentAddStep3DirectElimination() {
  return (
    <div className="w-full h-fit p-10">
      <DinamicInputNumber<TournamentAddFormType>
        name="teamsQuantityDirectElimination"
        label="¿Cuántos equipos participan?"
        placeholder="Ingrese la cantidad de equipos"
        min={0}
        max={99}
        rules={{}}
      />

      <DinamicCheckboxOptions<TournamentAddFormType>
        name="laps"
        options={[
          { label: "Si", value: "y" },
          { label: "No", value: "n" },
        ]}
        label="¿Hay partido por tercer lugar?"
        multiple={false}
        rules={{}}
      />

      <DinamicCombobox<TournamentAddFormType>
        name="bestOfX"
        items={[
          { label: "1", value: "1" },
          { label: "3", value: "3" },
          { label: "5", value: "5" },
        ]}
        label="Mejor de cuantos partidos por cruce"
        placeholder="Seleccionar mejor de cuantos partidos por cruce"
        rules={{}}
      />
    </div>
  );
}
