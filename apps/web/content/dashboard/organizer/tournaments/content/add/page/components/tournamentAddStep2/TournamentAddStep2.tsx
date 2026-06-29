"use client";

/* COMPONENTS */
import { ChoiceCard } from "@/content/auth/onboarding/components/choiceCard/ChoiceCard";

/* HOOKS */
import { useFormContext } from "react-hook-form";

/* TYPES */
import { TournamentAddFormType } from "../../types/tournamentAddFormType";

export function TournamentAddStep2() {
  const { watch, setValue } = useFormContext<TournamentAddFormType>();

  const type = watch("type");

  return (
    <div className="w-full h-fit p-10 grid grid-cols-2 gap-6">
      <ChoiceCard
        active={type === "round-robin"}
        title="Todos contra todos"
        dots={["Cada equipo juega contra todos los demás"]}
        action={() => {
          setValue("type", "round-robin");
        }}
        wantCheck={false}
      />

      <ChoiceCard
        active={type === "direct-elimination"}
        title="Eliminación directa"
        dots={["El que pierde queda fuera"]}
        action={() => {
          setValue("type", "direct-elimination");
        }}
        wantCheck={false}
      />
    </div>
  );
}
