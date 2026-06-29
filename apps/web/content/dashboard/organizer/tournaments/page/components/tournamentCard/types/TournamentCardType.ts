/* TYPES */
import { StaticImport } from "next/dist/shared/lib/get-img-props";

export type TournamentCardType = {
  slug: string,
  image: StaticImport;
  name: string;
  description: string;
  state: "Inscribiendo" | "Jugando" | "Finalizado";
  sport: "Fútbol" | "Básquetbol" | "Tochito";
  sex: "Masculino" | "Femenino" | "Mixto";
  teams: { image: StaticImport }[];
  teamsQuantity: number,
  type: "Todos contra todos" | "Eliminatoria directa",
  banner: StaticImport,
  location: string
};
