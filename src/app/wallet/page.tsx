"use client";

import { Button } from "@material-tailwind/react";
import { useRouter } from "next/navigation";
import React from "react";
import { FaWallet } from "react-icons/fa";

const WalletPage = () => {
  const router = useRouter();
  return (
    <div className="h-screen flex flex-col gap-10 items-center justify-center">
      <div className="w-full flex flex-col items-center gap-4">
        <div className="bg-blue-gray-100 rounded-full p-5">
          <FaWallet size={50} />
        </div>
        <h1 className="text-4xl font-bold">My Coin Wallet</h1>
        <h2 className="text-blue-gray-600 text-2xl text-center">
          Your gateway to the future of digital currency. Secure, fast and
          easy-to-use blockchain technology at your fingertips.
        </h2>
        <h2 className="text-blue-gray-600 text-2xl text-center">
          Create a new wallet is free and takes less than 2 minutes or access
          your existing one to start your blockchain journey
        </h2>
        <div className="flex flex-row gap-4 my-5">
          <Button
            color="blue"
            {...({} as any)}
            onClick={() => router.push("/wallet/new")}
          >
            Create New Wallet
          </Button>
          <Button
            color="blue"
            {...({} as any)}
            onClick={() => router.push("/wallet/login")}
          >
            Access My Wallet
          </Button>
        </div>
        <Button color="gray" {...({} as any)} onClick={() => router.push("/")}>
          Back
        </Button>
      </div>
    </div>
  );
};

export default WalletPage;
