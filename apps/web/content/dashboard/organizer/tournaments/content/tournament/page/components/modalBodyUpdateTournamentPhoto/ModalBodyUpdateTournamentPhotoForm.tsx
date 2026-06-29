"use client";

/* COMPONENTS */
import { DinamicButton } from "@/content/shared/form/dinamicButton/DinamicButton";
import { DinamicInputFile } from "@/content/shared/form/dinamicInputFile/DinamicInputFile";

/* HOOKS */
import { FormProvider, useForm } from "react-hook-form";
import { useState } from "react";

/* STORES */
import { useModal } from "@/content/shared/ui/modal/stores/modalStore";
import { useAnnouncement } from "@/content/shared/ui/annoucement/stores/announcementStore";

/* TYPES */
import { UpdateTournamentPhotoFormType } from "./types/updateTournamentPhotoFormType";

export function ModalBodyUpdateTournamentPhotoForm({ id }: { id: string }) {
  const { setModal, modal } = useModal();

  const { setAnnouncement } = useAnnouncement();
  const [saving, setSaving] = useState(false);

  const methods = useForm<UpdateTournamentPhotoFormType>();

  const onSubmit = async (data: UpdateTournamentPhotoFormType) => {
    try {
      setSaving(true);

      console.log(data);

      setTimeout(() => {
        setSaving(false);
        setAnnouncement({
          isActivated: true,
          announceType: "ok",
          message: "Foto de perfil de torneo cambiada correctamente",
        });
        setModal({
          isActivated: false,
          title: modal.title ?? "",
          body: modal.body,
        });
      }, 1000);
    } catch (error) {
      setSaving(false);
      console.log("Error", error);
    }
  };

  return (
    <FormProvider {...methods}>
      <div className="w-full h-fit flex flex-col gap-6 p-6">
        <DinamicInputFile<UpdateTournamentPhotoFormType>
          variant="select-photo"
          name="image"
        />

        <div className="flex gap-6">
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
          <DinamicButton
            action={methods.handleSubmit(onSubmit)}
            type={saving ? "disabled" : "filled"}
            disabled={saving}
            disabledSpinner={true}
            spinFromText={true}
            label="Cambiar"
          />
        </div>
      </div>
    </FormProvider>
  );
}
