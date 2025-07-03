import { create } from "zustand";

interface WalletCreationState {
  step: number;
  setStep: (step: number) => void;
  walletPw: string;
  setWalletPw: (password: string) => void;
  walletMnemonic: string[];
  setWalletMnemonic: (mnemonic: string[]) => void;
  resetWalletCreation: () => void;
}

const initialState = {
  step: 0,
  walletPw: "",
  walletMnemonic: [],
};

export const useWalletCreate = create<WalletCreationState>((set) => ({
  ...initialState,
  setStep: (step) => set({ step }),
  setWalletPw: (password) => set({ walletPw: password }),
  setWalletMnemonic: (mnemonic) => set({ walletMnemonic: mnemonic }),
  resetWalletCreation: () => set(initialState),
}));
