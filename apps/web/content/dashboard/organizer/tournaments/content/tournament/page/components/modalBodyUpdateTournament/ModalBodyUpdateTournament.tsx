"use client";

/* COMPONENTS */
import { DinamicButton } from "@/content/shared/form/dinamicButton/DinamicButton";
import { DinamicInputFile } from "@/content/shared/form/dinamicInputFile/DinamicInputFile";
import { DinamicInputText } from "@/content/shared/form/dinamicInputText/DinamicInputText";
import { DinamicTextArea } from "@/content/shared/form/dinamicTextArea/DinamicTextArea";
import { DinamicTagsGroup } from "@/content/shared/form/dinamicTagsGroup/DinamicTagsGroup";
import { DinamicInputDate } from "@/content/shared/form/dinamicInputDate/DinamicInputDate";

/* HOOKS */
import { FormProvider, useForm } from "react-hook-form";
import { useState } from "react";

/* STORES */
import { useModal } from "@/content/shared/ui/modal/stores/modalStore";
import { useAnnouncement } from "@/content/shared/ui/annoucement/stores/announcementStore";

/* TYPES */
import { UpdateTournamentFormType } from "./types/updateTournamentFormType";

export function ModalBodyUpdateTournament() {
  const { setModal, modal } = useModal();

  const { setAnnouncement } = useAnnouncement();
  const [saving, setSaving] = useState(false);

  const methods = useForm<UpdateTournamentFormType>({
    defaultValues: {
      name: "",
      description: "",
      tags: [],
      registrationInterval: undefined,
      gameInterval: undefined,
    },
  });

  const onSubmit = async (data: UpdateTournamentFormType) => {
    try {
      setSaving(true);

      console.log(data);

      setTimeout(() => {
        setSaving(false);
        setAnnouncement({
          isActivated: true,
          announceType: "ok",
          message: "Torneo actualizado correctamente",
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
      <div className="w-full h-fit flex flex-col px-6 pt-6 max-h-96 overflow-y-auto">
        <DinamicInputText<UpdateTournamentFormType>
          name="name"
          label="Nombre"
          placeholder="Ingresar nombre"
          rules={{}}
        />

        <DinamicTextArea<UpdateTournamentFormType>
          name="description"
          label="Descripción"
          placeholder="Ingresar descripción"
          rules={{}}
        />

        <DinamicTagsGroup<UpdateTournamentFormType>
          name="tags"
          label="Agregar etiquetas"
          placeholder="Presione Enter/+ para agregar una etiqueta"
          rules={{}}
        />

        <DinamicInputFile<UpdateTournamentFormType>
          name="rules"
          variant="default"
          label="Reglamento (Opcional)"
          placeholder="Agregar reglamento"
          rules={{}}
        />

        <DinamicInputDate<UpdateTournamentFormType>
          name="registrationInterval"
          label="Intervalo de registro"
          placeholder="Seleccione dos fechas"
          rules={{}}
          mode="range"
        />

        <DinamicInputDate<UpdateTournamentFormType>
          name="gameInterval"
          label="Intervalo de juego"
          placeholder="Seleccione dos fechas"
          rules={{}}
          mode="range"
        />
      </div>

      <div className="flex gap-6 p-6">
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
          label="Actualizar"
        />
      </div>
    </FormProvider>
  );
}
