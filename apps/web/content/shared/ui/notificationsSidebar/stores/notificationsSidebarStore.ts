import { create } from "zustand";

type UIState = {
  expanded: boolean;
  toggleNotificationsSidebar: () => void;
  setNotificationsSidebar: (value: boolean) => void;
};

export const useNotificationsSidebarStore = create<UIState>((set) => ({
  expanded: false,
  toggleNotificationsSidebar: () => set((state) => ({ expanded: !state.expanded })),
  setNotificationsSidebar: (value) => set({ expanded: value }),
}));