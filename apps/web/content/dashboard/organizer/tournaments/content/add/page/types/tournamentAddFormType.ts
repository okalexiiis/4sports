/* TYPES */
import { DateRange } from "react-day-picker";

export type TournamentAddFormType = {
  /* STEP 1 */
  name: string;
  banner_url: File;
  description: string;
  sport_id: string
  tags: string[];
  registrationInterval: DateRange;
  gameInterval: DateRange;

  /* STEP 2 */
  format_id: "round_robin" | "single_elimination" | "double_elimination" | "world_cup";

  /* STEP 3 -> ROUND-ROBIN */
  teamsQuantityRoundRobin?: number;
  laps?: string;

  /* STEP 3 -> DIRECT-ELIMINATION */
  teamsQuantityDirectElimination?: number;
  thirdPlaceMatch?: boolean;
  bestOfX?: string;

  /* STEP 4 */
  gender_restriction: string;
  validation_mode: string;
  eligibility_mode: string;
  is_public: boolean
  total_players_team: {min: number; max: number}
  total_teams: {min: number; max: number}

  /* STEP 5 */
  sexVR: { visible: boolean; required: boolean };
  birthdayVR: { visible: boolean; required: boolean };
  emailVR: { visible: boolean; required: boolean };
  telphoneVR: { visible: boolean; required: boolean };
  jerseyVR: { visible: boolean; required: boolean };
};
