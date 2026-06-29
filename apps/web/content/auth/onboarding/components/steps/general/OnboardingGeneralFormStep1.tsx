"use client";

/* COMPONENTS */
import { DinamicInputText } from "@/content/shared/form/dinamicInputText/DinamicInputText";
import { DinamicInputFile } from "@/content/shared/form/dinamicInputFile/DinamicInputFile";

/* TYPES */
import { OnboardingForm } from "@/content/auth/onboarding/types/onboardingForm";

export function OnboardingGeneralFormStep1() {
  return (
    <div className="w-full h-fit flex md:flex-row flex-col md:gap-6 gap-2 md:items-center">
      {/* FOTO DE PERFIL */}
      <DinamicInputFile<OnboardingForm>
        name="fotoPerfil"
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

      <div className="flex flex-col w-full">
        {/* USERNAME */}
        <DinamicInputText<OnboardingForm>
          name="username"
          label="Apodo de usuario"
          type="text"
          placeholder="Apodo cool"
          rules={{}}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-6 w-full h-fit">
          {/* NOMBRES */}
          <DinamicInputText<OnboardingForm>
            name="nombres"
            label="Nombres"
            type="text"
            placeholder="Ingresa tus nombres"
            rules={{}}
          />

          {/* APELLIDOS */}
          <DinamicInputText<OnboardingForm>
            name="apellidos"
            label="Apellidos"
            type="text"
            placeholder="Ingresa tus apellidos"
            rules={{}}
          />
        </div>
      </div>
    </div>
  );
}
