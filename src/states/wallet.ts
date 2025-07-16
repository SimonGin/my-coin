import { create } from "zustand";

interface WalletState {
  walletAddress: string;
  setWalletAddress: (password: string) => void;
  walletBalance: number;
  setWalletBalance: (balance: number) => void;
}

export const useWallet = create<WalletState>((set) => ({
  walletAddress: "",
  walletBalance: 0,
  setWalletAddress: (address) => set({ walletAddress: address }),
  setWalletBalance: (balance) => set({ walletBalance: balance }),
}));
