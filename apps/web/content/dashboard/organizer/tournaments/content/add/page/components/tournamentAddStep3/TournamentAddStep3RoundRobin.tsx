"use client";

/* COMPONENTS */
import { DinamicInputNumber } from "@/content/shared/form/dinamicInputNumber/DinamicInputNumber";
import { DinamicCheckboxOptions } from "@/content/shared/form/dinamicCheckboxOptions/DinamicCheckboxOptions";

/* TYPES */
import { TournamentAddFormType } from "../../types/tournamentAddFormType";

export function TournamentAddStep3RoundRobin() {
  return (
    <div className="w-full h-fit p-10">
      <DinamicInputNumber<TournamentAddFormType>
        name="teamsQuantityRoundRobin"
        label="¿Cuántos equipos participan?"
        placeholder="Ingrese la cantidad de equipos"
        min={0}
        max={99}
        rules={{}}
      />

      <DinamicCheckboxOptions<TournamentAddFormType>
        name="laps"
        options={[
          { label: "1 (Cada par juega una vez)", value: "1" },
          { label: "2 (Ida y vuelta)", value: "2" },
        ]}
        label="¿Cuántas vueltas?"
        multiple={false}
        rules={{}}
      />
    </div>
  );
}
