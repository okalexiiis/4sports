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
import { UpdateStatusFormType } from "./types/updateStatusFormType";

export function ModalBodyUpdateStatus({
  id,
  actualStatus,
  complete_name,
}: {
  id: number;
  actualStatus: "active" | "inactive";
  complete_name: string;
}) {
  const { setAnnouncement } = useAnnouncement();
  const { modal, setModal } = useModal();
  const { setFilter, filter } = useMembersFilter();

  const [changingStatus, setChangingStatus] = useState(false);

  const methods = useForm<UpdateStatusFormType>({
    defaultValues: {
      id: id,
      status: actualStatus,
    },
  });

  const onSubmit = (data: UpdateStatusFormType) => {
    try {
      setChangingStatus(true);

      setFilter({
        page: 0,
        perPage: filter?.perPage ?? 25,
        order: filter?.order ?? "asc",
        orderBy: filter?.orderBy ?? "id",
      });

      setAnnouncement({
        isActivated: true,
        announceType: "ok",
        message: "Estatus cambiado correctamente",
      });

      setModal({
        isActivated: false,
        title: modal.title ?? "",
        body: modal.body,
      });

      setChangingStatus(false);
    } catch (error) {
      console.log("Error: ", error);

      setChangingStatus(false);

      setAnnouncement({
        isActivated: true,
        announceType: "error",
        message:
          "Error interno al cambiar el estatus, intente nuevamente más tarde",
      });
    }
  };

  return (
    <FormProvider {...methods}>
      <div className="p-6 overflow-y-auto lg:max-h-3/4 max-h-40">
        {actualStatus === "active" ? (
          <>
            <p>
              Al dar clic en{" "}
              <span className="text-danger font-bold">Suspender</span>, el
              estatus del miembro {complete_name}, será cambiado a{" "}
              <span className="text-danger font-bold">Suspendido</span>
            </p>
            <p>
              ¿Desea Continuar? (Puede cambiar el estatus nuevamente más tarde)
            </p>
          </>
        ) : (
          <>
            <p>
              Al dar clic en{" "}
              <span className="text-primary font-bold">Activar</span>, el
              estatus del miembro {complete_name}, será cambiado a{" "}
              <span className="text-primary font-bold">Activado</span>
            </p>
            <p>
              ¿Desea Continuar? (Puede cambiar el estatus nuevamente más tarde)
            </p>
          </>
        )}
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

        {/* FILTRAR */}
        <DinamicButton
          action={methods.handleSubmit(onSubmit)}
          type={
            changingStatus
              ? "disabled"
              : actualStatus === "active"
                ? "destructive"
                : "filled"
          }
          disabled={changingStatus}
          disabledSpinner={true}
          spinFromText={true}
          label={actualStatus === "active" ? "Suspender" : "Activar"}
        />
      </div>
    </FormProvider>
  );
}
