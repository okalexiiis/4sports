/* ICONS */
import { Home, Trophy, Building2, Bell } from "lucide-react";

/* TYPES */
import { LinkSidebar } from "@/content/shared/ui/sidebar/types/LinkSidebar";

export const organizerSidebarLinks: LinkSidebar[] = [
  {
    label: "Inicio",
    href: "/organizer/home",
    icon: Home,
  },
  {
    label: "Organizaciones",
    href: "/organizer/organizations",
    icon: Building2,
  },
  {
    label: "Torneos",
    href: "/organizer/tournaments",
    icon: Trophy,
  },
  {
    label: "Notificaciones",
    href: "",
    icon: Bell,
  },
];
