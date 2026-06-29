"use client";

/* COMPONENTS */
import { DinamicButton } from "@/content/shared/form/dinamicButton/DinamicButton";
import { DinamicInputText } from "@/content/shared/form/dinamicInputText/DinamicInputText";
import { DinamicInputNumber } from "@/content/shared/form/dinamicInputNumber/DinamicInputNumber";
import { DinamicCombobox } from "@/content/shared/form/dinamicComboBox/DinamicCombobox";

/* DATA */
import { phoneCountries } from "@/content/shared/utils/phoneCountries";

/* HOOKS */
import { FormProvider, useForm, useWatch } from "react-hook-form";
import { useState, useEffect, useMemo } from "react";

/* STORES */
import { useModal } from "@/content/shared/ui/modal/stores/modalStore";
import { useAnnouncement } from "@/content/shared/ui/annoucement/stores/announcementStore";

/* TYPES */
import { UpdateProfileInfoFormType } from "./types/updateProfileInfoFormType";
import { ComboboxItem } from "@/content/shared/form/dinamicComboBox/types/comboboxItem";

/* UTILS */
import { Country, State, City } from "country-state-city";

export function ModalBodyUpdateProfileInfoForm({ id }: { id: string }) {
  const { setModal, modal } = useModal();

  const { setAnnouncement } = useAnnouncement();
  const [saving, setSaving] = useState(false);

  const methods = useForm<UpdateProfileInfoFormType>({
    defaultValues: {
      username: "",
      name: "",
      lastname: "",
      sex: "",
      birthday: "",
      lada: "",
      telphone: "",
      state: "",
      country: "",
      city: "",
    },
  });

  const { setValue } = methods;

  const ladas: ComboboxItem[] = phoneCountries.map((p) => {
    return { value: p.iso2, label: p.label };
  });

  const selectedCountry = useWatch({
    control: methods.control,
    name: "country",
  });
  const selectedState = useWatch({
    control: methods.control,
    name: "state",
  });

  // Obtener países
  const countries = useMemo(() => {
    return Country.getAllCountries();
  }, []);

  // Obtener estados según país
  const states = useMemo(() => {
    if (!selectedCountry) return [];

    return State.getStatesOfCountry(selectedCountry);
  }, [selectedCountry]);

  // Obtener ciudades según estado
  const cities = useMemo(() => {
    if (!selectedCountry || !selectedState) return [];

    return City.getCitiesOfState(selectedCountry, selectedState);
  }, [selectedCountry, selectedState]);

  // Reiniciar estado y ciudad cuando cambia país
  useEffect(() => {
    setValue("state", "");
    setValue("city", "");
  }, [selectedCountry, setValue]);

  // Reiniciar ciudad cuando cambia estado
  useEffect(() => {
    setValue("city", "");
  }, [selectedState, setValue]);

  const onSubmit = async (data: UpdateProfileInfoFormType) => {
    try {
      setSaving(true);

      console.log(data);

      setTimeout(() => {
        setSaving(false);
        setAnnouncement({
          isActivated: true,
          announceType: "ok",
          message: "Perfil actualizado correctamente",
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
      <div className="w-full h-fit flex flex-col">
        <div className="w-full max-h-96 overflow-y-auto p-6">
          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* USERNAME */}
            <DinamicInputText<UpdateProfileInfoFormType>
              name="username"
              label="Apodo de usuario"
              type="text"
              placeholder="Apodo cool"
              rules={{}}
            />

            {/* NOMBRES */}
            <DinamicInputText<UpdateProfileInfoFormType>
              name="name"
              label="Nombre"
              placeholder="Ingrese su nombre"
              rules={{}}
            />

            {/* APELLIDOS */}
            <DinamicInputText<UpdateProfileInfoFormType>
              name="lastname"
              label="Apellidos"
              type="text"
              placeholder="Ingresa tus apellidos"
              rules={{}}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 md:gap-4 w-full h-fit">
            {/* LADAS */}
            <DinamicCombobox<UpdateProfileInfoFormType>
              name="lada"
              items={ladas}
              label="Lada"
              placeholder="Seleccionar lada"
              rules={{}}
            />

            {/* TELÉFONO */}
            <DinamicInputNumber<UpdateProfileInfoFormType>
              name="telphone"
              placeholder="0000000000"
              label="Teléfono"
              min={1}
              max={99}
              rules={{}}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 md:gap-4 w-full h-fit">
            {/* PAÍS */}
            <DinamicCombobox<UpdateProfileInfoFormType>
              name="country"
              items={countries.map((c) => {
                return { value: c.isoCode, label: c.name };
              })}
              label="País"
              placeholder="Seleccionar país"
              rules={{}}
              twMarginBottom="mb-0"
            />

            {/* ESTADO */}
            <DinamicCombobox<UpdateProfileInfoFormType>
              name="state"
              items={states.map((s) => {
                return { value: s.isoCode, label: s.name };
              })}
              label="Estado"
              placeholder="Seleccionar estado"
              rules={{}}
              twMarginBottom="mb-0"
            />

            {/* CIUDAD */}
            <DinamicCombobox<UpdateProfileInfoFormType>
              name="city"
              items={cities.map((c) => {
                return { value: c.name, label: c.name };
              })}
              label="Ciudad"
              placeholder="Seleccionar ciudad"
              rules={{}}
              twMarginBottom="mb-0"
            />
          </div>
        </div>

        <div className="flex gap-6 px-6 pb-6">
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
