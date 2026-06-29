/* TYPES */
import { StaticImport } from "next/dist/shared/lib/get-img-props";

export type RegistrationType = {
  id: string;
  teamPhoto: StaticImport;
  teamName: string;
  date: string
};
