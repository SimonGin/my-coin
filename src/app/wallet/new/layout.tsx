"use client";

import React, { useState } from "react";
import * as bip39 from "bip39";

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
