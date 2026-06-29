import { create } from "zustand";
import { ReactNode } from "react";

// Tipado del estado global
interface Modal {
  modal: {
    isActivated: boolean | null;
    title: string | null;
    body: ReactNode | null;
  };
  setModal: (modal: {
    isActivated: boolean;
    title: string;
    body: ReactNode;
  }) => void;
}

// Crear el store
export const useModal = create<Modal>((set) => ({
  modal: {
    isActivated: null,
    title: null,
    body: null,
  },
  setModal: (modal) => set({ modal }),
}));
