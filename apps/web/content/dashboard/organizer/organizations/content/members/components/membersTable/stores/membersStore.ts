import { create } from "zustand";

interface MembersFilterStore {
  filter: {
    page: number;
    perPage: number;
    order: "asc" | "desc";
    orderBy: "id" | "name";
  } | null;
  setFilter: (data: {
    page: number;
    perPage: number;
    order: "asc" | "desc";
    orderBy: "id" | "name";
  }) => void;
}

export const useMembersFilter = create<MembersFilterStore>((set) => ({
  filter: {
    page: 0,
    perPage: 25,
    order: "asc",
    orderBy: "id",
  },
  setFilter: (data: {
    page: number;
    perPage: number;
    order: "asc" | "desc";
    orderBy: "id" | "name";
  }) => set({ filter: data }),
}));
