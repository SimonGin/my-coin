"use client";

import { useWalletCreate } from "@/states/wallet_creation";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const NewWalletPage = () => {
  const { step, setStep } = useWalletCreate();
  const router = useRouter();
  useEffect(() => {
    if (step === 0) {
      console.log(step);
      setStep(1);
      router.replace("/wallet/new/pick-pw");
    }
  }, []);
  return <></>;
};

export default NewWalletPage;
