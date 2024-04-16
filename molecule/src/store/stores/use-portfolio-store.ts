import { create } from "zustand";

interface PortfolioState {
  loading: boolean;
}

interface PortfoliAction {
  setLoading: (loading: boolean) => void;
}

export const usePortfolioStore = create<PortfolioState & PortfoliAction>(
  // @ts-ignore
  (set) => ({
    loading: false,

    setLoading: (loading: boolean) =>
      set(() => ({
        loading: loading,
      })),
  }),
);
