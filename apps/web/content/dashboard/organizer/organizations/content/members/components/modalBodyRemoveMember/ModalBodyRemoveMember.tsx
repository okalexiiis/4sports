"use client";

/* COMPONENTS */
import { DinamicButton } from "@/content/shared/form/dinamicButton/DinamicButton";

/* HOOKS */
import { FormProvider, useForm } from "react-hook-form";
import { useState } from "react";

/* STORES */
import { useAnnouncement } from "@/content/shared/ui/annoucement/stores/announcementStore";
import { useMembersFilter } from "../membersTable/stores/membersStore";
import { useModal } from "@/content/shared/ui/modal/stores/modalStore";

/* TYPES */
import { RemoveMemberFormType } from "./types/removeMemberFormType";

export function ModalBodyRemoveMember({
  id,
  complete_name,
}: {
  id: number;
  complete_name: string;
}) {
  const { setAnnouncement } = useAnnouncement();
  const { modal, setModal } = useModal();
  const { setFilter, filter } = useMembersFilter();

  const [removing, setRemoving] = useState(false);

  const methods = useForm<RemoveMemberFormType>({
    defaultValues: {
      id: id,
    },
  });

  const onSubmit = (data: RemoveMemberFormType) => {
    try {
      setRemoving(true);

      setFilter({
        page: 0,
        perPage: filter?.perPage ?? 25,
        order: filter?.order ?? "asc",
        orderBy: filter?.orderBy ?? "id",
      });

      setAnnouncement({
        isActivated: true,
        announceType: "ok",
        message: "Miembro removido de la organización correctamente",
      });

      setModal({
        isActivated: false,
        title: modal.title ?? "",
        body: modal.body,
      });

      setRemoving(false);
    } catch (error) {
      console.log("Error: ", error);

      setRemoving(false);

      setAnnouncement({
        isActivated: true,
        announceType: "error",
        message:
          "Error interno al remover el miembro de la organización, intente nuevamente más tarde",
      });
    }
  };

  return (
    <FormProvider {...methods}>
      <div className="p-6 overflow-y-auto lg:max-h-3/4 max-h-40">
        <p>
          Al dar clic en <span className="text-danger font-bold">Remover</span>,
          el miembro {complete_name}, será removido permanentemente de la
          organización
        </p>
        <p>¿Desea Continuar?</p>
      </div>

      {/* BOTONES DE ACCIÓN */}
      <div className="flex gap-6 px-6 pb-6">
        {/* CANCELAR */}
        <DinamicButton
          action={() =>
            setModal({
              isActivated: false,
              title: modal.title ?? "",
              body: modal.body,
            })
          }
          type="unfilled"
          label="Cancelar"
        />

        {/* REMOVER */}
        <DinamicButton
          action={methods.handleSubmit(onSubmit)}
          type={removing ? "disabled" : "destructive"}
          disabled={removing}
          disabledSpinner={true}
          spinFromText={true}
          label={"Remover"}
        />
      </div>
    </FormProvider>
  );
}
