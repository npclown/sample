import { create } from "zustand";

interface AdminState {
  reload: boolean;
}

interface AdminAction {
  toggleReload: () => void;
}

export const useAdminStore = create<AdminState & AdminAction>(
  // @ts-ignore
  (set) => ({
    reload: false,

    toggleReload: () =>
      set((state: AdminState) => ({
        reload: !state.reload,
      })),
  }),
);
