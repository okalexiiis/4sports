/* TYPES */
import { StaticImport } from "next/dist/shared/lib/get-img-props";

export type OrganizationCardType = {
  isSelected: boolean;
  image: StaticImport;
  banner: StaticImport;
  name: string;
  description: string;
  slug: string;
  role: "owner" | "admin" | "viewer" | "organizer";
};
