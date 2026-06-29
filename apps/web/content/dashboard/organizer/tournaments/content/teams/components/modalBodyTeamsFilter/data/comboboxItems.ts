/* TYPES */
import { ComboboxItem } from "@/content/shared/form/dinamicComboBox/types/comboboxItem";

export const teamsPerPage: ComboboxItem[] = [
  { label: "25", value: "25" },
  { label: "50", value: "50" },
  { label: "75", value: "75" },
  { label: "100", value: "100" },
];

export const teamsOrder: ComboboxItem[] = [
  { label: "Ascendente", value: "asc" },
  { label: "Descendente", value: "desc" },
];

export const teamsOrderBy: ComboboxItem[] = [
  { label: "Nombre de equipo", value: "teamName" },
];
