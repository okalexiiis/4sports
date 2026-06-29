"use client";

/* LIBS */
import { motion } from "framer-motion";

export function DinamicTableHeader({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <motion.div
      className="w-full h-fit"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
}
