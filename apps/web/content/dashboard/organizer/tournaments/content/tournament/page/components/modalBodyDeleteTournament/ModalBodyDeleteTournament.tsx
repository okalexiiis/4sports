"use client";

/* COMPONENTS */
import { DinamicButton } from "@/content/shared/form/dinamicButton/DinamicButton";

/* HOOKS */
import { FormProvider, useForm } from "react-hook-form";
import { useState } from "react";

/* STORES */
import { useAnnouncement } from "@/content/shared/ui/annoucement/stores/announcementStore";
import { useModal } from "@/content/shared/ui/modal/stores/modalStore";

/* TYPES */
import { DeleteTournamentFormType } from "./types/deleteTournamentFormType";

export function ModalBodyDeleteTournament({ id }: { id: number }) {
  const { setAnnouncement } = useAnnouncement();
  const { modal, setModal } = useModal();

  const [removing, setRemoving] = useState(false);

  const methods = useForm<DeleteTournamentFormType>({
    defaultValues: {
      id: id,
    },
  });

  const onSubmit = (data: DeleteTournamentFormType) => {
    try {
      setRemoving(true);

      setAnnouncement({
        isActivated: true,
        announceType: "ok",
        message: "Torneo eliminado correctamente",
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
          "Error interno al eliminar el torneo, intente nuevamente más tarde",
      });
    }
  };

  return (
    <FormProvider {...methods}>
      <div className="p-6 overflow-y-auto lg:max-h-3/4 max-h-40">
        <p>
          Al dar clic en <span className="text-danger font-bold">Eliminar</span>
          , el torneo será eliminado permanentemente
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

        {/* ELIMINAR */}
        <DinamicButton
          action={methods.handleSubmit(onSubmit)}
          type={removing ? "disabled" : "destructive"}
          disabled={removing}
          disabledSpinner={true}
          spinFromText={true}
          label={"Eliminar"}
        />
      </div>
    </FormProvider>
  );
}
