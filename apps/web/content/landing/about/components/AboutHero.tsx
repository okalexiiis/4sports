"use client";

/* COMPONENTS */
import { TitleWithDescription } from "@/content/shared/ui/titleWithDescription/TitleWithDescription";

/* ICONS */
import { FourSportsIcon } from "@/content/shared/icons/fourSports/FourSportsIcon";

export function AboutHero() {
  return (
    <div className="relative overflow-hidden py-32">
      <div className="mx-auto max-w-7xl px-6 relative z-10">
        <div className="w-24 m-auto mb-4">
          <FourSportsIcon />
        </div>
        <TitleWithDescription
          title="Objetivo"
          description="Brindar una plataforma deportiva moderna e intuitiva que facilite la gestión de torneos, equipos y estadísticas, permitiendo que organizadores, jugadores y aficionados disfruten una experiencia más conectada, organizada y dinámica"
        />
      </div>
    </div>
  );
}
