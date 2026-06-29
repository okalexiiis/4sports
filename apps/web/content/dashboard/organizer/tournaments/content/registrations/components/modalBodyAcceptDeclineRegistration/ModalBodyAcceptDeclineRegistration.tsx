"use client";

/* COMPONENTS */
import { DinamicButton } from "@/content/shared/form/dinamicButton/DinamicButton";

/* HOOKS */
import { FormProvider, useForm } from "react-hook-form";
import { useState } from "react";

/* STORES */
import { useAnnouncement } from "@/content/shared/ui/annoucement/stores/announcementStore";
import { useRegistrationsFilter } from "../registrationsTable/stores/registrationsStore";
import { useModal } from "@/content/shared/ui/modal/stores/modalStore";

/* TYPES */
import { AcceptDeclineRegistrationFormType } from "./types/acceptDeclineRegistrationFormType";

export function ModalBodyAcceptDeclineRegistration({
  id,
  wantTo,
  teamName,
}: {
  id: string;
  wantTo: "accept" | "decline";
  teamName: string;
}) {
  const { setAnnouncement } = useAnnouncement();
  const { modal, setModal } = useModal();
  const { setFilter, filter } = useRegistrationsFilter();

  const [changingStatus, setChangingStatus] = useState(false);

  const methods = useForm<AcceptDeclineRegistrationFormType>({
    defaultValues: {
      id: id,
    },
  });

  const onSubmit = (data: AcceptDeclineRegistrationFormType) => {
    try {
      setChangingStatus(true);

      setFilter({
        page: 0,
        perPage: filter?.perPage ?? 25,
        order: filter?.order ?? "asc",
        orderBy: filter?.orderBy ?? "date",
      });

      setAnnouncement({
        isActivated: true,
        announceType: "ok",
        message: wantTo === "accept" ? "Equipo aceptado" : "Equipo rechazado",
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
          "Error interno al procesar la solicitud, intente nuevamente más tarde",
      });
    }
  };

  return (
    <FormProvider {...methods}>
      <div className="p-6 overflow-y-auto lg:max-h-3/4 max-h-40">
        {wantTo === "decline" ? (
          <>
            <p>
              Al dar clic en{" "}
              <span className="text-danger font-bold">Rechazar</span>, el equipo{" "}
              {teamName} será{" "}
              <span className="text-danger font-bold">Rechazado</span> del
              torneo
            </p>
            <p>¿Desea Continuar?</p>
          </>
        ) : (
          <>
            <p>
              Al dar clic en{" "}
              <span className="text-primary font-bold">Aceptar</span>, el el
              equipo será{" "}
              <span className="text-primary font-bold">Aceptado</span> en el
              torneo
            </p>
            <p>¿Desea Continuar?</p>
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
              : wantTo === "decline"
                ? "destructive"
                : "filled"
          }
          disabled={changingStatus}
          disabledSpinner={true}
          spinFromText={true}
          label={wantTo === "decline" ? "Rechazar" : "Aceptar"}
        />
      </div>
    </FormProvider>
  );
}
