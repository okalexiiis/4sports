"use client";

/* COMPONENTS */
import { DinamicTableSkeleton } from "../dinamicTableSkeleton/DinamicTableSkeleton";

/* LIBS */
import { AnimatePresence, motion } from "framer-motion";

export function DinamicTableBody({
  theadColumns,
  tbodyRows,
  loading,
  count,
  type,
}: {
  theadColumns: React.ReactNode;
  tbodyRows: React.ReactNode;
  loading: boolean;
  count: number;
  type: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="md:flex-1 md:min-h-0 md:overflow-auto"
    >
      <div className="relative w-full flex-1 min-h-0">
        <AnimatePresence mode="wait">
          {loading ? (
            <DinamicTableSkeleton />
          ) : count === 0 ? (
            <motion.p
              key="noItems"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              No se encontraron {type}s
            </motion.p>
          ) : (
            <motion.div
              key="table"
              exit={{ opacity: 0 }}
              className="w-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <table className="w-full table-auto">
                <thead className="sticky top-0 z-20">
                  <tr className="bg-surface relative">
                    {theadColumns}
                  </tr>
                </thead>
                <tbody className="bg-background">{tbodyRows}</tbody>
              </table>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
