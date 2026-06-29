"use client";

/* LIBS */
import { motion } from "framer-motion";

export function SectionContainer({ children }: { children: React.ReactNode }) {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{
        opacity: 1,
        transition: {
          duration: 0.3,
          ease: "easeInOut",
        },
      }}
      className="w-full h-full overflow-y-auto"
    >
      {children}
    </motion.section>
  );
}
