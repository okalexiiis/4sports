"use client";

/* COMPONENTS */
import { DinamicButton } from "@/content/shared/form/dinamicButton/DinamicButton";

/* ICONS */
import { Loader, ChevronRight, ChevronLeft } from "lucide-react";

/* LIBS */
import { motion, AnimatePresence } from "framer-motion";

export function DinamicTableFooter({
  loading,
  count,
  type,
  actualPage,
  totalPages,
  goBackAction,
  goNextAction,
  goBack,
  goNext,
  paginationContent,
}: {
  loading: boolean;
  count: number;
  type: string;
  actualPage: React.ReactNode;
  totalPages: React.ReactNode;
  goBackAction: () => void;
  goNextAction: () => void;
  goBack: boolean;
  goNext: boolean;
  paginationContent: React.ReactNode;
}) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={loading ? "cargando" : "completado"}
        className="flex flex-col justify-center items-center p-6 lg:justify-between md:justify-between lg:flex-row md:flex-row border-t border-line"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        <div className="flex gap-2 items-center">
          <p>Total:</p>
          {loading ? (
            <Loader className="size-4 animate-spin text-primary" />
          ) : (
            <p>
              <span className="text-primary font-semibold mr-2">{count}</span>
              <span>{type}</span>
              <span>{(count >= 1 || count === 0) && "s"}</span>
            </p>
          )}
        </div>

        {loading ? (
          <Loader className="size-4 animate-spin text-primary" />
        ) : (
          <div className="flex gap-3">
            <DinamicButton
              action={goBackAction}
              type={goBack ? "filled" : "disabled"}
              disabled={goBack ? false : true}
              twClassName="w-fit py-1 px-2 h-auto"
              icon={<ChevronLeft className="size-4 min-w-4 min-h-4" />}
            />

            {paginationContent}

            <DinamicButton
              action={goNextAction}
              type={goNext ? "filled" : "disabled"}
              disabled={goNext ? false : true}
              twClassName="w-fit py-1 px-2 h-auto"
              icon={<ChevronRight className="size-4 min-w-4 min-h-4" />}
            />
          </div>
        )}

        <div className="flex items-center gap-2">
          <p>Página:</p>
          {loading ? (
            <Loader className="size-4 animate-spin text-primary" />
          ) : (
            <p>{actualPage}</p>
          )}
          <p>de</p>
          {loading ? (
            <Loader className="size-4 animate-spin text-primary" />
          ) : (
            <p>{totalPages}</p>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
