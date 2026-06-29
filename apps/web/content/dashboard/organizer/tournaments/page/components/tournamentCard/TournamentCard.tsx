"use client";

/* COMPONENTS */
import Image from "next/image";

/* ICONS */
import {
  Merge,
  Grid2x2,
  LoaderPinwheel,
  Venus,
  Mars,
  VenusAndMars,
  ChartNoAxesGantt,
  MapPin,
} from "lucide-react";

/* LIBS */
import { motion } from "framer-motion";

/* NAVIGATION */
import { useRouter } from "next/navigation";

/* TYPES */
import { TournamentCardType } from "./types/TournamentCardType";

export function TournamentCard({
  slug,
  image,
  name,
  state,
  sex,
  sport,
  teams,
  teamsQuantity,
  type,
  banner,
  location,
}: TournamentCardType) {
  const router = useRouter();

  const getBgColor = (state: "Inscribiendo" | "Jugando" | "Finalizado") => {
    switch (state) {
      case "Inscribiendo":
        return "bg-green-600";

      case "Jugando":
        return "bg-danger";

      case "Finalizado":
        return "bg-blue-600";
    }
  };

  return (
    <motion.button
      onClick={() => router.push(`/organizer/tournaments/${slug}`)}
      className="flex flex-col rounded-xl border-2 cursor-pointer"
      style={{
        backgroundColor: "var(--background)",
        borderColor: "var(--line)",
      }}
      whileHover={{
        scale: 1.03,
        backgroundColor: "var(--surface)",
        borderColor: "var(--primary)",
      }}
      whileTap={{ scale: 0.95 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 20,
        scale: { duration: 0.3 },
        backgroundColor: { duration: 0.3 },
        borderColor: { duration: 0.3 },
      }}
    >
      <div className="w-full h-28 min-h-28 rounded-t-xl relative">
        <div className="absolute inset-0 bg-linear-to-b from-black/50 to-transparent rounded-t-xl z-10" />

        <div
          className={`py-1 px-3 rounded-full absolute top-4 right-4 shadow-md z-10 ${getBgColor(state)}`}
        >
          <p className="font-bold text-white text-sm">{state}</p>
        </div>

        <Image
          alt="Equipo"
          src={banner}
          quality={70}
          className="w-full h-28 min-h-28 rounded-t-xl object-cover object-center z-0"
        />
      </div>

      <div className="flex flex-col p-6 gap-6">
        <div className="flex gap-6 items-center w-full">
          <Image
            alt="Equipo"
            src={image}
            quality={70}
            className="w-16 h-16 min-w-16 min-h-16 rounded-xl object-cover object-center border border-line"
          />

          <div className="w-full h-fit">
            <p className="text-lg font-bold truncate text-left">{name}</p>

            <div className="flex gap-2 items-center">
              {type === "Eliminatoria directa" ? (
                <Merge className="size-4 min-w-4 min-h-4" />
              ) : (
                <Grid2x2 className="size-4 min-w-4 min-h-4" />
              )}
              <p className="truncate text-muted">{type}</p>
            </div>
          </div>
        </div>

        <div className="flex w-full justify-between items-center">
          <div className="flex gap-2 items-center">
            {sex === "Femenino" ? (
              <Venus className="size-4 min-w-4 min-h-4" />
            ) : sex === "Masculino" ? (
              <Mars className="size-4 min-w-4 min-h-4" />
            ) : (
              <VenusAndMars className="size-4 min-w-4 min-h-4" />
            )}
            <p className="truncate text-muted text-center">{sex}</p>
          </div>

          <div className="flex gap-2 items-center">
            <LoaderPinwheel className="size-4 min-w-4 min-h-4" />
            <p className="truncate text-muted text-center">{sport}</p>
          </div>
        </div>

        <div className="flex items-center justify-between w-full">
          <div className="flex gap-2 items-center">
            <ChartNoAxesGantt className="size-4 min-w-4 min-h-4" />
            <p className="text-muted">Equipos</p>
          </div>

          <div className="flex items-center">
            {teams.slice(0, 4).map((t, i) => (
              <div
                key={i}
                className={`relative ${i > 0 ? "-ml-3" : ""}`}
                style={{ zIndex: 10 + i }}
              >
                <Image
                  alt="Equipo"
                  src={t.image}
                  quality={70}
                  className="w-8 h-8 rounded-full border-2 border-background object-cover"
                />
              </div>
            ))}

            {teamsQuantity >= 5 && (
              <div className="w-8 h-8 min-w-8 min-h-8 rounded-full bg-primary flex items-center justify-center border-2 border-background -ml-3 z-15">
                <p className="text-primary-text text-sm font-semibold">
                  +{teamsQuantity - 4}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-2 items-center justify-center w-full">
          <MapPin className="size-4 min-w-4 min-h-4" />
          <p className="text-muted">{location}</p>
        </div>
      </div>
    </motion.button>
  );
}
