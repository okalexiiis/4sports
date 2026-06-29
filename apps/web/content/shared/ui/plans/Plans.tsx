"use client";

/* COMPONENTS */
import { TitleWithDescription } from "../titleWithDescription/TitleWithDescription";
import { PlanCard } from "./components/PlanCard";

/* DATA */
import { plans } from "./data/plans";

/* HOOKS */
import { useState, useEffect } from "react";

/* ICONS */
import { FourSportsIcon } from "@/content/shared/icons/fourSports/FourSportsIcon";

/* LIBS */
import { motion } from "framer-motion";

export function Plans({
  wantWait,
  onSelectArray,
}: {
  wantWait: boolean;
  onSelectArray: (() => void)[];
}) {
  const [finish, setFinish] = useState(wantWait ? false : true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFinish(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      className="w-full overflow-x-hidden md:overflow-y-hidden overflow-y-auto h-full flex flex-col md:justify-center"
      initial={{ opacity: 0 }}
      animate={{
        opacity: finish ? 1 : 0,
        transition: {
          duration: 0.3,
          ease: "easeInOut",
        },
      }}
    >
      <div>
        <div className="w-24 m-auto mb-4">
          <FourSportsIcon />
        </div>

        {/* Cabecera compactada */}
        <div className="text-center mb-8">
          <TitleWithDescription
            title="Tu plan ideal"
            description="Elige entre opciones diseñadas para principiantes, clubes activos y organizadores profesionales"
          />
        </div>

        {/* Grilla responsiva adaptada al viewport */}
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4 items-stretch w-full">
          {plans.map((plan, index) => (
            <PlanCard key={index} {...plan} onSelect={onSelectArray[index]} />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
