"use client";

/* COMPONENTS */
import { DinamicButton } from "@/content/shared/form/dinamicButton/DinamicButton";
import { DinamicInputFile } from "@/content/shared/form/dinamicInputFile/DinamicInputFile";
import { DinamicInputText } from "@/content/shared/form/dinamicInputText/DinamicInputText";
import { DinamicColorPicker } from "@/content/shared/form/dinamicColorPicker/DinamicColorPicker";
import { DinamicCombobox } from "@/content/shared/form/dinamicComboBox/DinamicCombobox";

/* HOOKS */
import { FormProvider, useForm } from "react-hook-form";
import { useState } from "react";

/* STORES */
import { useModal } from "@/content/shared/ui/modal/stores/modalStore";
import { useAnnouncement } from "@/content/shared/ui/annoucement/stores/announcementStore";

/* TYPES */
import { CreateTeamFormType } from "./types/createTeamFormType";

export function ModalBodyCreateTeam() {
  const { setModal, modal } = useModal();

  const { setAnnouncement } = useAnnouncement();
  const [saving, setSaving] = useState(false);

  const methods = useForm<CreateTeamFormType>({
    defaultValues: {
      name: "",
      city: "",
      mainColor: "",
      secondaryColor: "",
      sex: "",
    },
  });

  const onSubmit = async (data: CreateTeamFormType) => {
    try {
      setSaving(true);

      console.log(data);

      setTimeout(() => {
        setSaving(false);
        setAnnouncement({
          isActivated: true,
          announceType: "ok",
          message: "Equipo interno creado correctamente",
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
      <div className="w-full h-fit flex flex-col gap-6 p-6 max-h-96 overflow-y-auto">
        <div className="flex gap-6 items-center w-full">
          <DinamicInputFile<CreateTeamFormType>
            variant="avatar"
            name="image"
            rules={{}}
          />

          <div className="w-full h-fit">
            <DinamicInputText<CreateTeamFormType>
              name="name"
              label="Nombre"
              placeholder="Ingresar nombre"
              rules={{}}
            />
            <DinamicInputText<CreateTeamFormType>
              name="city"
              label="Ciudad"
              placeholder="Ingresar ciudad"
              rules={{}}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 w-full h-fit">
          <DinamicColorPicker<CreateTeamFormType>
            name="mainColor"
            label="Color principal"
            placeholder="Seleccione el color principal"
            rules={{}}
          />

          <DinamicColorPicker<CreateTeamFormType>
            name="secondaryColor"
            label="Color secundario"
            placeholder="Seleccione el color secundario"
            rules={{}}
          />
        </div>

        <DinamicCombobox<CreateTeamFormType>
          name="sex"
          label="Género"
          twMarginBottom="mb-0"
          placeholder="Seleccione el género"
          rules={{}}
          items={[
            { label: "Masculino", value: "m" },
            { label: "Femenino", value: "f" },
            { label: "Mixto", value: "mix" },
          ]}
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
          label="Crear"
        />
      </div>
    </FormProvider>
  );
}
