import { create } from "zustand";

interface RegistrationsFilterStore {
  filter: {
    page: number;
    perPage: number;
    order: "asc" | "desc";
    orderBy: "teamName" | "date";
  } | null;
  setFilter: (data: {
    page: number;
    perPage: number;
    order: "asc" | "desc";
    orderBy: "teamName" | "date";
  }) => void;
}

export const useRegistrationsFilter = create<RegistrationsFilterStore>(
  (set) => ({
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
      orderBy: "teamName" | "date";
    }) => set({ filter: data }),
  }),
);
