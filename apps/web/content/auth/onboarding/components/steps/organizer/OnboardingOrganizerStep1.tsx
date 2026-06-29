"use client";

/* COMPONENTS */
import { DinamicInputText } from "@/content/shared/form/dinamicInputText/DinamicInputText";
import { DinamicInputFile } from "@/content/shared/form/dinamicInputFile/DinamicInputFile";
import { DinamicTextArea } from "@/content/shared/form/dinamicTextArea/DinamicTextArea";

/* TYPES */
import { OnboardingForm } from "@/content/auth/onboarding/types/onboardingForm";

export function OnboardingOrganizerFormStep1() {
  return (
    <div className="w-full h-fit flex md:flex-row flex-col md:gap-6 gap-2 items-center">
      {/* FOTO DE ORGANIZACIÓN */}
      <DinamicInputFile<OnboardingForm>
        name="fotoOrganizacion"
        variant="avatar"
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

      <div className="flex flex-col w-full h-fit">
        {/* NOMBRE */}
        <DinamicInputText<OnboardingForm>
          name="nombreOrganizacion"
          label="Nombre de organización"
          type="text"
          placeholder="Ingresa el nombre de la organización"
          rules={{}}
        />

        {/* DESCRIPCIÓN */}
        <DinamicTextArea<OnboardingForm>
          name="descripcionOrganizacion"
          placeholder="Ingrese la descripción de la organización"
          label="Descripción"
          twHeight="h-20"
          rules={{}}
        />
      </div>
    </div>
  );
}
