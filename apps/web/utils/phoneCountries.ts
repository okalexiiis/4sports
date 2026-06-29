import metadata from "libphonenumber-js/metadata.full.json";

export interface PhoneCountry {
  iso2: string;
  dialCode: string;
  label: string;
}

const REGION_NAMES = new Intl.DisplayNames(["es"], { type: "region" });

export const phoneCountries: PhoneCountry[] = Object.entries(metadata.countries)
  .map(([iso2, data]) => ({
    iso2,
    dialCode: `+${data[0]}`,
    label: `${REGION_NAMES.of(iso2)} (${`+${data[0]}`})`,
  }))
  .filter((c) => c.label && c.dialCode)
  .sort((a, b) => a.label.localeCompare(b.label));
