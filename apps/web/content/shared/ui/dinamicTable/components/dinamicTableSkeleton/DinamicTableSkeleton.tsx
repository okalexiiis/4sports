"use client"

/* LIBS */
import { motion } from "framer-motion";

export function DinamicTableSkeleton() {
  const rowCount = 4;
  return (
    <motion.div
      key="tableSkeleton"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="w-full"
    >
      {/* HEADER */}
      <div className="w-full py-4 bg-linear-to-r from-surface/50 via-surface to-surface/50 bg-skeleton-gradient" />

      {/* BODY */}
      {Array.from({ length: rowCount }).map((_, i) => (
        <div
          className={`w-full py-4 ${i % 2 !== 0 ? "bg-linear-to-r from-surface/50 via-surface to-surface/50 bg-skeleton-gradient" : "bg-background"}`}
          key={i}
        />
      ))}
    </motion.div>
  );
}
