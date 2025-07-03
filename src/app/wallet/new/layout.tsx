"use client";

import { useWalletCreate } from "@/states/wallet_creation";
import { Progress } from "@material-tailwind/react";

import React from "react";

interface Props {
  children: React.ReactNode;
}

const createWalletLayout = ({ children }: Props) => {
  const { step } = useWalletCreate();

  return (
    <div className="h-screen flex flex-col gap-10 items-center justify-center">
      <div className="w-full max-w-sm flex flex-col">
        <Progress
          value={(step / 4) * 100}
          color="teal"
          {...({} as any)}
          className="transition"
        />
      </div>
      <div className="max-w-xl">{children}</div>
    </div>
  );
};

export default createWalletLayout;
