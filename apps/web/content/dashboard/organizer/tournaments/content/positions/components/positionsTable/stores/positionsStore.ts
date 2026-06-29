import { create } from "zustand";

interface PositionsFilterStore {
  filter: {
    page: number;
    perPage: number;
    order: "asc" | "desc";
    orderBy: "pts";
  } | null;
  setFilter: (data: {
    page: number;
    perPage: number;
    order: "asc" | "desc";
    orderBy: "pts";
  }) => void;
}

export const usePositionsFilter = create<PositionsFilterStore>((set) => ({
  filter: {
    page: 0,
    perPage: 25,
    order: "asc",
    orderBy: "pts",
  },
  setFilter: (data: {
    page: number;
    perPage: number;
    order: "asc" | "desc";
    orderBy: "pts";
  }) => set({ filter: data }),
}));
