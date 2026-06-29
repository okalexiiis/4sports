/* ICONS */
import {
  Bell,
  Compass,
  Handshake,
  Home,
  SportShoe,
  Trophy,
  UsersRound,
} from "lucide-react";

/* TYPES */
import { LinkSidebar } from "@/content/shared/ui/sidebar/types/LinkSidebar";

export const playerSidebarLinks: LinkSidebar[] = [
  {
    label: "Inicio",
    href: "/player/home",
    icon: Home,
  },
  {
    label: "Notificaciones",
    href: "/player/notifications",
    icon: Bell,
  },
  {
    label: "Explorar",
    href: "/player/explore",
    icon: Compass,
  },
  {
    label: "Torneos",
    href: "/player/tournaments",
    icon: Trophy,
  },
  {
    label: "Equipos",
    href: "/player/teams",
    icon: UsersRound,
  },
  {
    label: "Entrenamientos",
    href: "/player/training",
    icon: SportShoe,
  },
  {
    label: "Match",
    href: "/player/match",
    icon: Handshake,
  },
];
