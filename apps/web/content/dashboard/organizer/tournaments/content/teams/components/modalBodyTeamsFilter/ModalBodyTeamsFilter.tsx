"use client";

/* COMPONENTS */
import { DinamicButton } from "@/content/shared/form/dinamicButton/DinamicButton";
import { DinamicCombobox } from "@/content/shared/form/dinamicComboBox/DinamicCombobox";

/* DATA */
import { teamsOrder, teamsOrderBy, teamsPerPage } from "./data/comboboxItems";

/* HOOKS */
import { FormProvider, useForm } from "react-hook-form";
import { useState } from "react";

/* STORES */
import { useAnnouncement } from "@/content/shared/ui/annoucement/stores/announcementStore";
import { useTeamsFilter } from "../teamsTable/stores/teamsStore";
import { useModal } from "@/content/shared/ui/modal/stores/modalStore";

/* TYPES */
import { TeamsFilterFormType } from "./types/teamsFilterFormType";

export function ModalBodyTeamsFilter() {
  const { setAnnouncement } = useAnnouncement();
  const { modal, setModal } = useModal();
  const { setFilter } = useTeamsFilter();

  const [filtering, setFiltering] = useState(false);

  const methods = useForm<TeamsFilterFormType>({
    defaultValues: {
      perPage: undefined,
      order: undefined,
      orderBy: undefined,
    },
  });

  const onSubmit = (data: TeamsFilterFormType) => {
    try {
      setFiltering(true);

      // PERPAGE
      let perPage: number = 50;

      switch (data.perPage) {
        case "25":
          perPage = 25;
          break;

        case "50":
          perPage = 50;
          break;

        case "100":
          perPage = 100;
          break;

        case "250":
          perPage = 250;
          break;
      }

      // ORDER
      const order: "asc" | "desc" =
        data.order === "Ascendente" ? "asc" : "desc";

      // ORDER BY
      const orderBy = "teamName";

      setFilter({
        page: 0,
        perPage,
        order,
        orderBy,
      });
      methods.reset();

      setAnnouncement({
        isActivated: true,
        announceType: "ok",
        message: "Filtro aplicado",
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
          "Error interno al aplicar el filtro, intente nuevamente más tarde",
      });
    } finally {
      setFiltering(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <div className="p-6 overflow-y-auto lg:max-h-3/4 max-h-40">
        <div className="grid lg:grid-cols-3 lg:gap-4 gap-0 w-full h-fit grid-cols-1">
          {/* PER PAGE */}
          <DinamicCombobox<TeamsFilterFormType>
            name="perPage"
            items={teamsPerPage}
            label="Mostrar"
            placeholder="Seleccionar mostrar"
            rules={{
              required: "La cantidad a mostrar es necesaria",
            }}
            twMarginBottom="mb-2 md:mb-0"
          />

          {/* ORDER */}
          <DinamicCombobox<TeamsFilterFormType>
            name="order"
            items={teamsOrder}
            label="Orden"
            placeholder="Seleccionar orden"
            rules={{
              required: "El orden es necesario",
            }}
            twMarginBottom="mb-2 md:mb-0"
          />

          {/* ORDER BY */}
          <DinamicCombobox<TeamsFilterFormType>
            name="orderBy"
            items={teamsOrderBy}
            label="Ordenar por"
            placeholder="Seleccionar ordenar por"
            rules={{
              required: "El ordenar por es necesario",
            }}
            twMarginBottom="mb-2 md:mb-0"
          />
        </div>
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
          label="Filtrar"
        />
      </div>
    </FormProvider>
  );
}
