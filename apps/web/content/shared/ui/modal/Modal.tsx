"use client";

/* ICONS */
import { X } from "lucide-react";

/* STORES */
import { useModal } from "./stores/modalStore";

/* LIBS */
import { motion } from "framer-motion";

export function Modal() {
  const { modal, setModal } = useModal();

  const setModalClosed = () => {
    setModal({
      isActivated: false,
      title: modal.title ?? "",
      body: modal.body,
    });
  };

  return (
    <div
      className={`fixed top-0 left-0 z-70 flex items-center justify-center w-full h-full ${
        modal.isActivated ? "pointer-events-auto" : "pointer-events-none"
      }`}
    >
      {/* Modal Blanco con animación de rebote */}
      <motion.div
        className="z-70 bg-background rounded-xl shadow-lg lg:w-150 md:w-125 w-[calc(100%-2rem)] border border-line"
        initial={{ opacity: 0, y: 30 }} // Comienza un poco abajo
        animate={{
          opacity: modal.isActivated ? 1 : 0,
          y: modal.isActivated ? [30, -10, 0] : 30, // Rebote de arriba a abajo
        }}
        exit={{ opacity: 0, y: 30 }}
        transition={{
          duration: 0.4, // Duración más larga para permitir el rebote
          type: "tween",
          stiffness: 300, // Controla la rigidez de la animación
          damping: 25, // Controla el rebote
        }}
        style={{
          position: "absolute",
          transform: "translate(-50%, -50%)", // Esto centra el modal
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 text-ink border-b border-line">
          <h2 className="text-xl font-extralight">{modal.title}</h2>
          <button
            onClick={setModalClosed}
            className={`p-1 hover:bg-surface hover:border-line border-transparent border rounded transition-all duration-300 cursor-pointer`}
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="scrollbar-custom">{modal.body}</div>
      </motion.div>

      {/* Fondo negro con animación */}
      <motion.div
        className={`absolute top-0 left-0 w-full h-full bg-black/50 z-60`}
        initial={{ opacity: 0 }}
        animate={{ opacity: modal.isActivated ? 1 : 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        style={{
          backdropFilter: "blur(1px)",
          pointerEvents: modal.isActivated ? "auto" : "none",
        }}
        onClick={setModalClosed}
      ></motion.div>
    </div>
  );
}
