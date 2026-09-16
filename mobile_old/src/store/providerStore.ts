import { create } from "zustand";
import type { Provider } from "../types";

interface ProviderState {
  provider: Provider | null;
  isOnline: boolean;
  eligibilityBlockers: string[];
  setProvider: (p: Provider) => void;
  setOnline: (online: boolean) => void;
  setEligibilityBlockers: (blockers: string[]) => void;
}

export const useProviderStore = create<ProviderState>((set) => ({
  provider: null,
  isOnline: false,
  eligibilityBlockers: [],
  setProvider: (provider) => set({ provider, isOnline: provider.is_online }),
  setOnline: (isOnline) => set({ isOnline }),
  setEligibilityBlockers: (eligibilityBlockers) => set({ eligibilityBlockers }),
}));