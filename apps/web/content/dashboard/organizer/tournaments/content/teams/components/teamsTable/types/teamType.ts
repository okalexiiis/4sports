/* TYPES */
import { StaticImport } from "next/dist/shared/lib/get-img-props";

export type TeamType = {
  teamPhoto: StaticImport;
  teamName: string;
  players: number
};
