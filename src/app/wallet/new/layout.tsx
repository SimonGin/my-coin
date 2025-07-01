"use client";

import React from "react";

interface Props {
  children: React.ReactNode;
}

const createWalletLayout = ({ children }: Props) => {
  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <div className="max-w-xl">{children}</div>
    </div>
  );
};

export default createWalletLayout;
