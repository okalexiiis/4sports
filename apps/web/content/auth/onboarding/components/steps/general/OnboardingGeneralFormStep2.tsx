"use client";

/* COMPONENTS */
import { DinamicInputNumber } from "@/content/shared/form/dinamicInputNumber/DinamicInputNumber";
import { DinamicCombobox } from "@/content/shared/form/dinamicComboBox/DinamicCombobox";

/* DATA */
import { phoneCountries } from "@/content/shared/utils/phoneCountries";

/* HOOKS */
import { useEffect, useMemo } from "react";
import { useFormContext, useWatch } from "react-hook-form";

/* TYPES */
import { OnboardingForm } from "@/content/auth/onboarding/types/onboardingForm";
import { ComboboxItem } from "@/content/shared/form/dinamicComboBox/types/comboboxItem";

/* UTILS */
import { Country, State, City } from "country-state-city";

export function OnboardingGeneralFormStep2() {
  const { setValue, control } = useFormContext<OnboardingForm>();

  const ladas: ComboboxItem[] = phoneCountries.map((p) => {
    return { value: p.iso2, label: p.label };
  });

  const selectedCountry = useWatch({
    control: control,
    name: "pais",
  });
  const selectedState = useWatch({
    control: control,
    name: "estado",
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
    setValue("estado", "");
    setValue("ciudad", "");
  }, [selectedCountry, setValue]);

  // Reiniciar ciudad cuando cambia estado
  useEffect(() => {
    setValue("ciudad", "");
  }, [selectedState, setValue]);

  return (
    <div className="w-full h-fit flex md:items-center flex-col gap-2 md:gap-0">
      <div className="grid grid-cols-1 md:grid-cols-2 md:gap-4 w-full h-fit">
        {/* LADAS */}
        <DinamicCombobox<OnboardingForm>
          name="lada"
          items={ladas}
          label="Lada"
          placeholder="Seleccionar lada"
          rules={{}}
        />

        {/* TELÉFONO */}
        <DinamicInputNumber<OnboardingForm>
          name="telefono"
          placeholder="0000000000"
          label="Teléfono"
          min={1}
          max={99}
          rules={{}}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 md:gap-4 w-full h-fit">
        {/* PAÍS */}
        <DinamicCombobox<OnboardingForm>
          name="pais"
          items={countries.map((c) => {
            return { value: c.isoCode, label: c.name };
          })}
          label="País"
          placeholder="Seleccionar país"
          rules={{}}
        />

        {/* ESTADO */}
        <DinamicCombobox<OnboardingForm>
          name="estado"
          items={states.map((s) => {
            return { value: s.isoCode, label: s.name };
          })}
          label="Estado"
          placeholder="Seleccionar estado"
          rules={{}}
        />

        {/* CIUDAD */}
        <DinamicCombobox<OnboardingForm>
          name="ciudad"
          items={cities.map((c) => {
            return { value: c.name, label: c.name };
          })}
          label="Ciudad"
          placeholder="Seleccionar ciudad"
          rules={{}}
        />
      </div>
    </div>
  );
}
