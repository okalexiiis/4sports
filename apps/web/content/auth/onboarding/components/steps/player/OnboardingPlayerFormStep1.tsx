"use client";

/* COMPONENTS */
import { DinamicInputText } from "@/content/shared/form/dinamicInputText/DinamicInputText";
import { DinamicCheckboxOptions } from "@/content/shared/form/dinamicCheckboxOptions/DinamicCheckboxOptions";
import { DinamicCheckboxBoolean } from "@/content/shared/form/dinamicCheckboxBoolean/DinamicCheckboxBoolean";

/* TYPES */
import { OnboardingForm } from "@/content/auth/onboarding/types/onboardingForm";

export function OnboardingPlayerStep1() {
  return (
    <div className="w-full h-fit flex flex-col gap-2">
      {/* DEPORTES */}
      <DinamicCheckboxOptions<OnboardingForm>
        name="deportes"
        options={[
          { value: "basquetbol", label: "Básquetbol" },
          { value: "futbol", label: "Fútbol" },
          { value: "tochito", label: "Tochito" },
        ]}
        label="Me gustaría jugar"
        rules={{}}
      />

      {/* POSICIÓN */}
      <DinamicInputText<OnboardingForm>
        name="posicion"
        label="Posición favorita (Si aplica, opcional)"
        type="text"
        placeholder="Ingresa tu posición"
        rules={{}}
      />

      <div className="w-full h-fit flex justify-center">
        {/* BUSCANDO EQUIPO */}
        <DinamicCheckboxBoolean<OnboardingForm>
          name="buscandoEquipo"
          label="¿Estás buscando equipo?"
        />
      </div>
    </div>
  );
}
