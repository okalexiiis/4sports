/* TYPES */
import { Role } from "@/content/auth/onboarding/types/role";

export type OnboardingForm = {
  /* Común */
  fotoPerfil?: File;
  username: string;
  nombres: string;
  apellidos: string;

  lada: string;
  telefono: number;
  pais: string;
  estado: string;
  ciudad: string;

  role: Role;

  /* Jugador */
  deportes?: string[];
  posicion?: string;
  buscandoEquipo?: boolean;

  /* Organizador */
  fotoOrganizacion?: File;
  nombreOrganizacion?: string;
  descripcionOrganizacion?: string;
};
