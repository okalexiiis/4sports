import { create } from "zustand";

type UIState = {
  expanded: boolean;
  toggleSidebar: () => void;
  setSidebar: (value: boolean) => void;
};

export const useSidebarStore = create<UIState>((set) => ({
  expanded: true,
  toggleSidebar: () => set((state) => ({ expanded: !state.expanded })),
  setSidebar: (value) => set({ expanded: value }),
}));
