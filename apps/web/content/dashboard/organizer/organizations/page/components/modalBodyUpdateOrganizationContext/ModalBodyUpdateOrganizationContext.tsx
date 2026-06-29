"use client";

/* COMPONENTS */
import { DinamicButton } from "@/content/shared/form/dinamicButton/DinamicButton";

/* STORES */
import { useAnnouncement } from "@/content/shared/ui/annoucement/stores/announcementStore";
import { useModal } from "@/content/shared/ui/modal/stores/modalStore";

export function ModalBodyUpdateOrganizationContext({
  slug,
  orgName,
}: {
  slug: string;
  orgName: string;
}) {
  const { setAnnouncement } = useAnnouncement();
  const { modal, setModal } = useModal();

  const onSubmit = () => {
    try {
      setAnnouncement({
        isActivated: true,
        announceType: "ok",
        message: "Ahora gestionarás los torneos de " + orgName,
      });

      setModal({
        isActivated: false,
        title: modal.title ?? "",
        body: modal.body,
      });
    } catch (error) {
      console.log("Error: ", error);

      setAnnouncement({
        isActivated: true,
        announceType: "error",
        message:
          "Error interno al cambiar contexto de organización, intente nuevamente más tarde",
      });
    }
  };

  return (
    <div className="p-6">
      <p>
        Al dar clic en{" "}
        <span className="text-primary font-bold">Seleccionar</span>, empezará a
        gestionar los torneos de la organización{" "}
        <span className="text-primary font-bold">{orgName}</span>
      </p>
      <p>¿Desea Continuar?</p>

      {/* BOTONES DE ACCIÓN */}
      <div className="flex gap-4 mt-6">
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

        {/* CAMBIAR */}
        <DinamicButton
          action={onSubmit}
          type={"filled"}
          disabledSpinner={true}
          spinFromText={true}
          label={"Seleccionar"}
        />
      </div>
    </div>
  );
}
