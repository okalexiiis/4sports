"use client";

/* COMPONENTS */
import Link from "next/link";
import Image from "next/image";

/* IMAGES */
import organization1 from "./images/organization1.png";
import tournament1 from './images/tournament1.png'

/* NAVIGATION */
import { usePathname } from "next/navigation";
import { useParams } from "next/navigation";

type LinkType = {
  label: string;
  href: string;
};

export function InternalNavbar({ to }: { to: "organization" | "tournament" }) {
  const pathname = usePathname();

  const params = useParams();

  const slug = params.slug as string;

  const organizationLinks: LinkType[] = [
    {
      label: "Gestionar",
      href: `/organizer/organizations/${slug}`,
    },
    {
      label: "Pagos",
      href: `/organizer/organizations/${slug}/payment-history`,
    },
    {
      label: "Miembros",
      href: `/organizer/organizations/${slug}/members`,
    },
  ];

  const tournamentsLinks: LinkType[] = [
    {
      label: "Gestionar",
      href: `/organizer/tournaments/${slug}`,
    },
    {
      label: "Solicitudes",
      href: `/organizer/tournaments/${slug}/registrations`,
    },
    {
      label: "Partidos",
      href: `/organizer/tournaments/${slug}/matches`,
    },
    {
      label: "Posiciones",
      href: `/organizer/tournaments/${slug}/positions`,
    },
    {
      label: "Equipos",
      href: `/organizer/tournaments/${slug}/teams`,
    },
  ];

  const finalLinks =
    to === "organization" ? organizationLinks : tournamentsLinks;

  return (
    <div className="border-b border-line px-10 pt-6 flex justify-between items-end">
      <div className="flex items-center gap-4 pb-6">
        {to === "organization" ? (
          <>
            <Image
              alt="Organización"
              src={organization1}
              quality={70}
              className="w-12 h-12 min-w-12 min-h-12 rounded-xl object-cover object-center border border-line"
            />
            <div>
              <p className="font-bold text-lg text-left text-ink">
                Sede Deportes
              </p>
              <p className="text-sm font-semibold text-primary">Dueño</p>
            </div>
          </>
        ) : (
          <>
            <Image
              alt="Torneo"
              src={tournament1}
              quality={70}
              className="w-12 h-12 min-w-12 min-h-12 rounded-xl object-cover object-center border border-line"
            />
            <div>
              <p className="font-bold text-lg text-left text-ink">
                Torneo Verano II
              </p>
              <p className="text-sm font-semibold text-primary">
                Todos contra todos
              </p>
            </div>
          </>
        )}
      </div>
      <nav className="flex justify-end gap-2 h-fit">
        {finalLinks.map((link) => {
          const active = pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`relative px-4 py-2 rounded-t-xl border text-sm transition-all duration-300 border-b-0 border-line ${active ? "border-line border-b-0 text-primary" : "border-transparent border-b-0 hover:bg-surface/70 text-ink"}`}
            >
              {link.label}

              {active && (
                <span className="absolute bottom-0 left-0 right-0 h-px bg-background translate-y-full" />
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
