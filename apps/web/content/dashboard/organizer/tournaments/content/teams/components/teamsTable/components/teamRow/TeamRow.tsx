"use client";

/* COMPONENTS */
import { DinamicRow } from "@/content/shared/ui/dinamicTable/components/dinamicRow/DinamicRow";
import { DinamicTd } from "@/content/shared/ui/dinamicTable/components/dinamicTd/DinamicTd";
import { DinamicButton } from "@/content/shared/form/dinamicButton/DinamicButton";
import Image from "next/image";
import { ModalBodyRemoveTeam } from "../../../modalBodyRemoveTeam/ModalBodyRemoveTeam";

/* ICONS */
import { Trash2 } from "lucide-react";

/* STORES */
import { useModal } from "@/content/shared/ui/modal/stores/modalStore";

/* TYPES */
import { TeamType } from "../../types/teamType";

export function TeamRow({
  team,
  twBgColor,
}: {
  team: TeamType;
  twBgColor: string;
}) {
  const { setModal } = useModal();

  return (
    <DinamicRow twBgColor={twBgColor}>
      <DinamicTd twClassName="text-nowrap">
        <div className="flex items-center gap-4">
          <Image
            alt="Equipo"
            src={team.teamPhoto}
            quality={70}
            loading="lazy"
            className="w-10 h-10 min-w-10 min-h-10 rounded-full"
          />

          <p>{team.teamName}</p>
        </div>
      </DinamicTd>

      <DinamicTd twClassName="text-nowrap">
        <p>{team.players}</p>
      </DinamicTd>

      <DinamicTd twClassName="text-nowrap">
        <DinamicButton
          action={() =>
            setModal({
              isActivated: true,
              title: "Dar de baja",
              body: <ModalBodyRemoveTeam id={0} teamName={team.teamName} />,
            })
          }
          type="destructive"
          label="Dar de baja"
          twClassName="w-fit py-1 text-sm"
          icon={<Trash2 className="size-4 min-w-4 min-h-4" />}
        />
      </DinamicTd>
    </DinamicRow>
  );
}
