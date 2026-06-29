"use client";

/* COMPONENTS */
import { DinamicCheckboxBoolean } from "@/content/shared/form/dinamicCheckboxBoolean/DinamicCheckboxBoolean";

/* TYPES */
import { TournamentAddFormType } from "../../types/tournamentAddFormType";

export function TournamentAddStep5() {
  return (
    <div className="w-full h-fit p-10 grid grid-cols-3">
      <div className="grid grid-rows-6 gap-4">
        <p className="text-ink font-bold">Campo</p>
        <p>Género</p>
        <p>Fecha de nacimiento</p>
        <p>Correo</p>
        <p>Teléfono</p>
        <p>Número de Jersey</p>
      </div>

      <div className="grid grid-rows-6 gap-4">
        <p className="text-ink font-bold text-center">Visible</p>

        <DinamicCheckboxBoolean<TournamentAddFormType>
          name="sexVR.visible"
          rules={{}}
          wantCustomCheck
          twClassName="m-auto"
        />

        <DinamicCheckboxBoolean<TournamentAddFormType>
          name="birthdayVR.visible"
          rules={{}}
          wantCustomCheck
          twClassName="m-auto"
        />

        <DinamicCheckboxBoolean<TournamentAddFormType>
          name="emailVR.visible"
          rules={{}}
          wantCustomCheck
          twClassName="m-auto"
        />

        <DinamicCheckboxBoolean<TournamentAddFormType>
          name="telphoneVR.visible"
          rules={{}}
          wantCustomCheck
          twClassName="m-auto"
        />

        <DinamicCheckboxBoolean<TournamentAddFormType>
          name="jerseyVR.visible"
          rules={{}}
          wantCustomCheck
          twClassName="m-auto"
        />
      </div>

      <div className="grid grid-rows-6 gap-4 justify-center">
        <p className="text-ink font-bold">Requerido</p>

        <DinamicCheckboxBoolean<TournamentAddFormType>
          name="sexVR.required"
          rules={{}}
          wantCustomCheck
          twClassName="m-auto"
        />

        <DinamicCheckboxBoolean<TournamentAddFormType>
          name="birthdayVR.required"
          rules={{}}
          wantCustomCheck
          twClassName="m-auto"
        />

        <DinamicCheckboxBoolean<TournamentAddFormType>
          name="emailVR.required"
          rules={{}}
          wantCustomCheck
          twClassName="m-auto"
        />

        <DinamicCheckboxBoolean<TournamentAddFormType>
          name="telphoneVR.required"
          rules={{}}
          wantCustomCheck
          twClassName="m-auto"
        />

        <DinamicCheckboxBoolean<TournamentAddFormType>
          name="jerseyVR.required"
          rules={{}}
          wantCustomCheck
          twClassName="m-auto"
        />
      </div>
    </div>
  );
}
