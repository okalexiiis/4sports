"use client";

/* COMPONENTS */
import { DinamicButton } from "@/content/shared/form/dinamicButton/DinamicButton";
import { DinamicInputText } from "@/content/shared/form/dinamicInputText/DinamicInputText";
import { DinamicTextArea } from "@/content/shared/form/dinamicTextArea/DinamicTextArea";

/* HOOKS */
import { FormProvider, useForm } from "react-hook-form";
import { useState } from "react";

/* STORES */
import { useModal } from "@/content/shared/ui/modal/stores/modalStore";
import { useAnnouncement } from "@/content/shared/ui/annoucement/stores/announcementStore";

/* TYPES */
import { UpdateOrganizationInfoFormType } from "./types/updateOrganizationInfoFormType";

export function ModalBodyUpdateOrganizationInfoForm({
  slug,
}: {
  slug: string;
}) {
  const { setModal, modal } = useModal();

  const { setAnnouncement } = useAnnouncement();
  const [saving, setSaving] = useState(false);

  const methods = useForm<UpdateOrganizationInfoFormType>();

  const onSubmit = async (data: UpdateOrganizationInfoFormType) => {
    try {
      setSaving(true);

      console.log(data);

      setTimeout(() => {
        setSaving(false);
        setAnnouncement({
          isActivated: true,
          announceType: "ok",
          message: "Información de la organización actualizada correctamente",
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
        <div className="flex flex-col">
          <DinamicInputText<UpdateOrganizationInfoFormType>
            name="name"
            label="Nombre"
            placeholder="Ingrese el nombre de la organización"
            rules={{}}
          />

          <DinamicTextArea<UpdateOrganizationInfoFormType>
            name="description"
            label="Descripción"
            placeholder="Ingrese la descripción de la organización"
            rules={{}}
            twMarginBottom="mb-0"
          />
        </div>

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
            label="Actualizar"
          />
        </div>
      </div>
    </FormProvider>
  );
}
