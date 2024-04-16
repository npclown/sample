import { User } from "@/lib/definitions";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface AuthState {
  user: User | undefined | null;
  reload: boolean;
}

interface AuthAction {
  login: (user: User) => void;
  logout: () => void;
  toggleReload: () => void;
}

export const useAuthStore = create<AuthState & AuthAction>(
  // @ts-ignore
  persist(
    (set) => ({
      user: null,
      reload: false,
      login: (user: User) => {
        set(() => ({
          user: user,
        }));
      },
      logout: () => {
        set(() => ({
          user: null,
        }));
        localStorage.removeItem("ion-auth");
      },
      toggleReload: () =>
        set((state: AuthState) => ({
          reload: !state.reload,
        })),
    }),
    {
      name: "ion-auth",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export const useAuthUser = () => useAuthStore((store) => store.user);
export const getAuthState = () => useAuthStore.getState();
