"use client";

/* COMPONENTS */
import { SectionContainer } from "@/content/shared/ui/sectionContainer/SectionContainer";
import EliminationBracket from "../components/eliminationBracket/EliminationBracket";

/* STORES */
import { useModal } from "@/content/shared/ui/modal/stores/modalStore";
import { Team } from "../types/types";

export function OrganizerMatchesContent() {
  const { setModal } = useModal();

  const teams: Team[] = [
    {
      id: "1",
      name: "Equipo 1",
    },
    {
      id: "2",
      name: "Equipo 2",
    },
    {
      id: "3",
      name: "Equipo 3",
    },
    {
      id: "4",
      name: "Equipo 4",
    },
    {
      id: "5",
      name: "Equipo 5",
    },
    {
      id: "6",
      name: "Equipo 6",
    },
    {
      id: "7",
      name: "Equipo 7",
    },
    {
      id: "8",
      name: "Equipo 8",
    },
  ];

  return (
    <SectionContainer>
      <div className="p-6 flex flex-col h-full">
        <EliminationBracket
          teams={teams}
          mode="setup"
          onRegister={(rounds) => console.log("Bracket registrado", rounds)}
          onOpenResultModal={(match, roundId) =>
            setModal({
              isActivated: true,
              title: "Registrar resultado",
              body: <></>,
            })
          }
          onFinish={() => {}}
        />
      </div>
    </SectionContainer>
  );
}
