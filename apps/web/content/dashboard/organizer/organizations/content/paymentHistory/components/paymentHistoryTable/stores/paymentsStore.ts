import { create } from "zustand";

interface PaymentsFilterStore {
  filter: {
    page: number;
    perPage: number;
    order: "asc" | "desc";
    orderBy: "date";
  } | null;
  setFilter: (data: {
    page: number;
    perPage: number;
    order: "asc" | "desc";
    orderBy: "date";
  }) => void;
}

export const usePaymentsFilter = create<PaymentsFilterStore>((set) => ({
  filter: {
    page: 0,
    perPage: 25,
    order: "asc",
    orderBy: "date",
  },
  setFilter: (data: {
    page: number;
    perPage: number;
    order: "asc" | "desc";
    orderBy: "date";
  }) => set({ filter: data }),
}));
