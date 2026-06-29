import { create } from "zustand";

interface TeamsFilterStore {
  filter: {
    page: number;
    perPage: number;
    order: "asc" | "desc";
    orderBy: "teamName";
  } | null;
  setFilter: (data: {
    page: number;
    perPage: number;
    order: "asc" | "desc";
    orderBy: "teamName";
  }) => void;
}

export const useTeamsFilter = create<TeamsFilterStore>((set) => ({
  filter: {
    page: 0,
    perPage: 25,
    order: "asc",
    orderBy: "teamName",
  },
  setFilter: (data: {
    page: number;
    perPage: number;
    order: "asc" | "desc";
    orderBy: "teamName";
  }) => set({ filter: data }),
}));
