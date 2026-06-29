/* TYPES */
import { DateRange } from "react-day-picker";

export type UpdateTournamentFormType = {
  name: string;
  description: string;
  tags: string[];
  rules?: File;
  registrationInterval: DateRange;
  gameInterval: DateRange;
};
