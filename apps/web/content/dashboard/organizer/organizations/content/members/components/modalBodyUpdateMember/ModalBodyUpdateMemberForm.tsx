"use client";

/* COMPONENTS */
import { DinamicButton } from "@/content/shared/form/dinamicButton/DinamicButton";
import { DinamicCombobox } from "@/content/shared/form/dinamicComboBox/DinamicCombobox";
import { DinamicCheckboxOptions } from "@/content/shared/form/dinamicCheckboxOptions/DinamicCheckboxOptions";

/* DATA */
import { roles } from "./data/comboboxItems";

/* HOOKS */
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { useState } from "react";

/* STORES */
import { useAnnouncement } from "@/content/shared/ui/annoucement/stores/announcementStore";
import { useModal } from "@/content/shared/ui/modal/stores/modalStore";

/* TYPES */
import { UpdateMemberFormType } from "./types/updateMemberFormType";
import { CheckboxOption } from "@/content/shared/form/dinamicCheckboxOptions/types/dinamicCheckboxOptionsProps";

const tournaments: CheckboxOption[] = [
  {
    value: "1",
    label: "Torneo Verano II",
  },
  {
    value: "2",
    label: "Casa de Plata",
  },
  {
    value: "3",
    label: "Tronos",
  },
];

export function ModalBodyUpdateMemberForm({ slug }: { slug: string }) {
  const { setAnnouncement } = useAnnouncement();
  const { modal, setModal } = useModal();

  const [filtering, setFiltering] = useState(false);

  const methods = useForm<UpdateMemberFormType>({
    defaultValues: {
      role: "",
      tournaments: [],
    },
  });

  const role = useWatch({
    control: methods.control,
    name: "role",
  });

  const onSubmit = (data: UpdateMemberFormType) => {
    try {
      setFiltering(true);

      methods.reset();

      setAnnouncement({
        isActivated: true,
        announceType: "ok",
        message: "Miembro de organización actualizado",
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
          "Error interno al actualizar miembro de organización, intente nuevamente más tarde",
      });
    } finally {
      setFiltering(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <div className="w-full p-6 overflow-y-auto max-h-96">
        {/* ROL */}
        <DinamicCombobox<UpdateMemberFormType>
          name="role"
          items={roles}
          label="Rol"
          placeholder="Seleccionar rol"
          rules={{
            required: "El rol es necesario",
          }}
        />

        {role === "organizer" && (
          <div>
            <DinamicCheckboxOptions<UpdateMemberFormType>
              name="tournaments"
              options={tournaments}
              label="Torneos asignados"
              rules={{}}
            />
            <DinamicButton
              action={() => {}}
              type="unfilled"
              label="Ver más"
              twClassName="w-fit text-sm py-1"
            />
          </div>
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

        {/* ACTUALIZAR */}
        <DinamicButton
          action={methods.handleSubmit(onSubmit)}
          type={filtering ? "disabled" : "filled"}
          disabled={filtering}
          disabledSpinner={true}
          spinFromText={true}
          label="Actualizar"
        />
      </div>
    </FormProvider>
  );
}
