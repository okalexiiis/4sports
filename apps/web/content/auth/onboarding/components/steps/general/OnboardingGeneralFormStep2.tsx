"use client";

/* COMPONENTS */
import { ChoiceCard } from "@/content/auth/onboarding/components/choiceCard/ChoiceCard";

/* HOOKS */
import { useFormContext } from "react-hook-form";

/* TYPES */
import { OnboardingForm } from "@/content/auth/onboarding/types/onboardingForm";

export function OnboardingGeneralFormStep2() {
  const { watch, setValue } = useFormContext<OnboardingForm>();

  const role = watch("role");

  return (
    <div className="flex flex-col w-full h-full gap-4 p-4 md:flex-row">
      <ChoiceCard
        active={role === "player"}
        title="¡Seré un jugador!"
        dots={[
          "Me uniré a equipos",
          "Participaré en torneos",
          "Miraré mis estadísticas",
          "Creceré como deportista"
        ]}
        action={() => {
          setValue("role", "player");
        }}
        wantCheck
      />

      <ChoiceCard
        active={role === "organizer"}
        title="¡Seré un organizador!"
        dots={[
          "Organizaré ligas y torneos",
          "Gestionaré estadísticas",
          "Controlaré jugadores y equipos",
          "Proporcionaré pagos"
        ]}
        action={() => {
          setValue("role", "organizer");
        }}
        wantCheck
      />
    </div>
  );
}
