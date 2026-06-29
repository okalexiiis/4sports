"use client";

/* COMPONENTS */
import Image from "next/image";

/* ICONS */
import { Clock, LandPlot, MapPin } from "lucide-react";

/* LIBS */
import { motion } from "framer-motion";

/* TYPES */
import { MatchCardType } from "./types/matchCardType";

export function MatchCard({
  team1Img,
  team1Name,
  team2Img,
  team2Name,
  hora,
  cancha,
  tournament,
  tournament_image,
  tournament_location,
}: MatchCardType) {
  return (
    <motion.div
      className="border-2 p-6 rounded-xl flex flex-col items-center gap-4 w-full cursor-pointer"
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
      <div className="flex gap-4 items-center w-full">
        <div className="flex flex-col gap-4 items-center w-full min-w-0">
          <Image
            alt="Equipo"
            src={team1Img}
            quality={70}
            className="w-24 h-24 min-w-24 min-h-24 rounded-full"
          />

          <p className="w-full truncate text-center font-bold text-lg">
            {team1Name}
          </p>
        </div>

        <p className="text-primary italic font-bebas text-2xl">vs</p>

        <div className="flex flex-col gap-4 items-center w-full min-w-0">
          <Image
            alt="Equipo"
            src={team2Img}
            quality={70}
            className="w-24 h-24 min-w-24 min-h-24 rounded-full"
          />

          <p className="w-full truncate text-center font-bold text-lg">
            {team2Name}
          </p>
        </div>
      </div>

      <div className="flex justify-center gap-4 min-w-0 w-full px-4">
        <div className="flex gap-2 items-center min-w-fit">
          <Clock className="size-4 min-w-4 min-h-4" />
          <p className="text-muted">{hora}</p>
        </div>

        <div className="flex gap-2 items-center min-w-0">
          <LandPlot className="size-4 min-w-4 min-h-4" />
          <p className="text-muted truncate">{cancha}</p>
        </div>
      </div>

      <div className="flex gap-2 items-center min-w-fit">
        <Image
          alt="Equipo"
          src={tournament_image}
          quality={70}
          className="w-6 h-6 min-w-6 min-h-6 rounded-full"
        />
        <p>{tournament}</p>
      </div>

      <div className="flex gap-2 items-center justify-center w-full">
        <MapPin className="size-4 min-w-4 min-h-4" />
        <p className="text-muted">{tournament_location}</p>
      </div>
    </motion.div>
  );
}
