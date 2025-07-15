import { create } from "zustand";

interface WalletState {
  walletAddress: string;
  setWalletAddress: (password: string) => void;
}

export const useWallet = create<WalletState>((set) => ({
  walletAddress: "",
  setWalletAddress: (address) => set({ walletAddress: address }),
}));
