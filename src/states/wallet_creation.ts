import { create } from "zustand";

interface WalletCreationState {
  step: number;
  setStep: (step: number) => void;
  walletPw: string;
  setWalletPw: (password: string) => void;
  walletMnemonic: string[];
  setWalletMnemonic: (mnemonic: string[]) => void;
}

export const useWalletCreate = create<WalletCreationState>((set) => ({
  step: 0,
  setStep: (step) => set({ step }),
  walletPw: "",
  setWalletPw: (password) => set({ walletPw: password }),
  walletMnemonic: [],
  setWalletMnemonic: (mnemonic) => set({ walletMnemonic: mnemonic }),
}));
