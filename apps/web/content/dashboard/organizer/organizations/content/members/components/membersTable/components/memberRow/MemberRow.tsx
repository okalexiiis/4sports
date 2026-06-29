"use client";

/* COMPONENTS */
import { DinamicRow } from "@/content/shared/ui/dinamicTable/components/dinamicRow/DinamicRow";
import { DinamicTd } from "@/content/shared/ui/dinamicTable/components/dinamicTd/DinamicTd";
import { ModalBodyUpdateStatus } from "../../../modalBodyUpdateStatus/ModalBodyUpdateStatus";
import { ModalBodyRemoveMember } from "../../../modalBodyRemoveMember/ModalBodyRemoveMember";
import { ModalBodyUpdateMemberForm } from "../../../modalBodyUpdateMember/ModalBodyUpdateMemberForm";

/* ICONS */
import { Power, PowerOff, SquarePen, Trash2 } from "lucide-react";

/* STORES */
import { useModal } from "@/content/shared/ui/modal/stores/modalStore";

/* TYPES */
import { MemberType } from "../../types/memberType";
import { DinamicButton } from "@/content/shared/form/dinamicButton/DinamicButton";

export function MemberRow({
  member,
  twBgColor,
}: {
  member: MemberType;
  twBgColor: string;
}) {
  const { setModal } = useModal();

  const getRole = (role: "owner" | "admin" | "viewer" | "organizer") => {
    switch (role) {
      case "owner":
        return "Dueño";

      case "admin":
        return "Administrador";

      case "viewer":
        return "Solo ver";

      case "organizer":
        return "Organizador";
    }
  };

  return (
    <DinamicRow twBgColor={twBgColor}>
      <DinamicTd twClassName="text-nowrap">
        <DinamicButton
          action={() =>
            setModal({
              isActivated: true,
              title: "Cambiar estatus",
              body: (
                <ModalBodyUpdateStatus
                  actualStatus={member.status}
                  complete_name={member.name + member.lastname}
                  id={member.id}
                />
              ),
            })
          }
          type={member.status === "active" ? "filled" : "destructive"}
          icon={
            member.status === "active" ? (
              <Power className="size-4 min-w-4 min-h-4" />
            ) : (
              <PowerOff className="size-4 min-w-4 min-h-4" />
            )
          }
          twClassName="w-fit rounded-full p-1"
        />
      </DinamicTd>

      <DinamicTd twClassName="text-nowrap">
        <p>{member.slug}</p>
      </DinamicTd>

      <DinamicTd twClassName="text-nowrap">
        <p>
          {member.name} {member.lastname}
        </p>
      </DinamicTd>

      <DinamicTd twClassName="text-nowrap">
        <p>{getRole(member.role)}</p>
      </DinamicTd>

      <DinamicTd twClassName="text-nowrap">
        <p>{member.email}</p>
      </DinamicTd>

      <DinamicTd twClassName="text-nowrap">
        <p>{member.phone}</p>
      </DinamicTd>

      <DinamicTd twClassName="text-nowrap">
        <DinamicButton
          action={() =>
            setModal({
              isActivated: true,
              title: "Actualizar miembro",
              body: <ModalBodyUpdateMemberForm slug="" />,
            })
          }
          type={"filled"}
          icon={<SquarePen className="size-4 min-w-4 min-h-4" />}
          twClassName="w-fit rounded-full p-1"
        />
      </DinamicTd>

      <DinamicTd twClassName="text-nowrap">
        <DinamicButton
          action={() =>
            setModal({
              isActivated: true,
              title: "Remover miembro",
              body: (
                <ModalBodyRemoveMember
                  complete_name={member.name + member.lastname}
                  id={member.id}
                />
              ),
            })
          }
          type={"destructive"}
          icon={<Trash2 className="size-4 min-w-4 min-h-4" />}
          twClassName="w-fit rounded-full p-1"
        />
      </DinamicTd>
    </DinamicRow>
  );
}
