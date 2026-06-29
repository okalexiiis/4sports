"use client";

/* ICONS */
import { Check } from "lucide-react";

/* LIBS */
import { motion } from "framer-motion";

export function ChoiceCard({
  title,
  dots,
  action,
  active,
  wantCheck,
}: {
  title: string;
  dots: string[];
  action: () => void;
  active: boolean;
  wantCheck: boolean;
}) {
  return (
    <motion.button
      className="w-full h-full rounded-2xl p-4 border-2 flex flex-col"
      animate={
        active
          ? {
              backgroundColor: "var(--primary-background)",
              color: "var(--primary)",
              borderColor: "var(--primary)",
            }
          : {
              backgroundColor: "var(--background)",
              color: "var(--ink)",
              borderColor: "var(--lucide)",
            }
      }
      whileHover={{
        cursor: "pointer",
        scale: 1.02,
      }}
      whileTap={{ scale: 0.95 }}
      transition={{
        type: "tween",
        backgroundColor: { duration: 0.3 },
        color: { duration: 0.3 },
        borderColor: { duration: 0.3 },
      }}
      onClick={action}
    >
      <p className="text-lg font-bold mb-3 text-center">{title}</p>

      <div className="flex flex-col gap-1 items-center">
        {dots.map((dot, index) => (
          <div key={index} className="flex gap-2 items-center">
            {wantCheck && <Check className="size-4" />}
            <p className="text-sm">{dot}</p>
          </div>
        ))}
      </div>
    </motion.button>
  );
}
