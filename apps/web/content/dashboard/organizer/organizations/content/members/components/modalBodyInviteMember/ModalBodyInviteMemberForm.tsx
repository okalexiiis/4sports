"use client";

/* COMPONENTS */
import { DinamicButton } from "@/content/shared/form/dinamicButton/DinamicButton";
import { DinamicCombobox } from "@/content/shared/form/dinamicComboBox/DinamicCombobox";
import { DinamicInputText } from "@/content/shared/form/dinamicInputText/DinamicInputText";
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
import { InviteMemberFormType } from "./types/inviteMemberFormType";
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

export function ModalBodyInviteMemberForm({ slug }: { slug: string }) {
  const { setAnnouncement } = useAnnouncement();
  const { modal, setModal } = useModal();

  const [filtering, setFiltering] = useState(false);

  const methods = useForm<InviteMemberFormType>({
    defaultValues: {
      email: "",
      role: "",
      tournaments: [],
    },
  });

  const role = useWatch({
    control: methods.control,
    name: "role",
  });

  const onSubmit = (data: InviteMemberFormType) => {
    try {
      setFiltering(true);

      methods.reset();

      setAnnouncement({
        isActivated: true,
        announceType: "ok",
        message: "Invitación envíada",
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
          "Error interno al envíar la invitación, intente nuevamente más tarde",
      });
    } finally {
      setFiltering(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <div className="p-6 w-full max-h-96 overflow-y-auto">
        <div className="grid lg:grid-cols-2 lg:gap-6 gap-0 w-full h-fit grid-cols-1">
          {/* CORREO */}
          <DinamicInputText<InviteMemberFormType>
            name="email"
            label="Correo"
            placeholder="Ingrese el correo"
            rules={{}}
          />

          {/* Rol */}
          <DinamicCombobox<InviteMemberFormType>
            name="role"
            items={roles}
            label="Rol"
            placeholder="Seleccionar rol"
            rules={{
              required: "El rol es necesario",
            }}
            twMarginBottom="mb-2 md:mb-0"
          />
        </div>

        {role === "organizer" && (
          <div>
            <DinamicCheckboxOptions<InviteMemberFormType>
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

        {/* FILTRAR */}
        <DinamicButton
          action={methods.handleSubmit(onSubmit)}
          type={filtering ? "disabled" : "filled"}
          disabled={filtering}
          disabledSpinner={true}
          spinFromText={true}
          label="Invitar"
        />
      </div>
    </FormProvider>
  );
}
