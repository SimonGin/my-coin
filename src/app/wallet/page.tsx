"use client";

import { useWalletCreate } from "@/states/wallet_creation";
import React, { useEffect } from "react";

const MyWalletPage = () => {
  const { resetWalletCreation } = useWalletCreate();
  useEffect(() => {
    resetWalletCreation();
  }, []);
  return <div>MyWalletPage</div>;
};

export default MyWalletPage;
