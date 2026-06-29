/* TYPES */
import { StaticImport } from "next/dist/shared/lib/get-img-props";

export type MatchCardType = {
  team1Img: StaticImport;
  team1Name: string;
  team2Img: StaticImport;
  team2Name: string;
  hora: string;
  cancha: string;
  tournament: string;
  tournament_image: StaticImport;
  tournament_location: string;
};
