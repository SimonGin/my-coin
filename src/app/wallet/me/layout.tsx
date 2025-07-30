"use client";

import Cookies from "js-cookie";
import { useWalletCreate } from "@/states/wallet_creation";
import { CiCoinInsert } from "react-icons/ci";
import React, { useEffect, useState } from "react";
import { Button, Card, CardBody } from "@material-tailwind/react";
import { useWallet } from "@/states/wallet";
import { useRouter } from "next/navigation";
import { FaWallet } from "react-icons/fa";
import { FaCoins } from "react-icons/fa";
import { RiCoinsLine } from "react-icons/ri";
import { TbCopy, TbCopyCheckFilled } from "react-icons/tb";
import axios from "axios";

interface Props {
  children: React.ReactNode;
}

const myWalletLayout = ({ children }: Props) => {
  const { setWalletBalance, walletBalance, walletAddress, setWalletAddress } =
    useWallet();
  const { resetWalletCreation } = useWalletCreate();
  const router = useRouter();
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    resetWalletCreation();
    fetchBalance();
  }, [walletAddress]);

  const fetchBalance = async () => {
    const accessToken = Cookies.get("accessToken");
    try {
      const response = await axios.get(`/api/wallet/balance`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (response.status === 200) {
        setWalletAddress(response.data.address);
        setWalletBalance(response.data.balance);
      }
    } catch (error) {
      console.error("Failed to fetch wallet balance:", error);
      Cookies.remove("accessToken");
      router.replace("/wallet/login");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div
              className="flex items-center gap-3"
              onClick={() => {
                router.replace("/");
              }}
            >
              <CiCoinInsert size={50} />
              <h1 className="text-xl font-semibold">MyCoin Blockchain</h1>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 rounded-lg bg-muted px-3 py-2">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span className="text-sm font-medium">Connected</span>
              </div>
              <Button
                onClick={() => {
                  setWalletAddress("");
                  Cookies.remove("accessToken");
                  router.replace("/wallet/login");
                }}
                {...({} as any)}
              >
                Disconnect
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto">
        <div className="py-8">
          <Card className="border border-gray-300 shadow-sm" {...({} as any)}>
            <CardBody className="p-6" {...({} as any)}>
              <div className="flex items-center justify-between gap-2">
                <div className="flex gap-2 items-center">
                  <FaWallet size={40} />
                  <h1 className="text-3xl font-black">Wallet Address</h1>
                </div>
                <div className="flex items-center gap-2">
                  <code className="rounded bg-gray-200 px-2 py-1 text-md font-mono">
                    {walletAddress}
                  </code>
                  <Button
                    size="sm"
                    color={"gray"}
                    {...({} as any)}
                    onClick={() => {
                      navigator.clipboard
                        .writeText(walletAddress)
                        .then(() => {
                          setCopied(true);
                          setTimeout(() => {
                            setCopied(false);
                          }, 3000);
                        })
                        .catch((err) => {
                          console.error("Failed to copy!", err);
                        });
                    }}
                  >
                    {copied ? (
                      <TbCopyCheckFilled size={20} />
                    ) : (
                      <TbCopy size={20} />
                    )}
                  </Button>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
        <Card className="border border-gray-300 shadow-sm" {...({} as any)}>
          <CardBody className="p-6" {...({} as any)}>
            <div className="flex items-center justify-between gap-2">
              <div className="flex gap-2 items-center">
                <FaCoins size={40} />
                <h1 className="text-3xl font-black">Current Balance</h1>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-3xl font-black">{walletBalance}</div>
                <RiCoinsLine size={50} />
              </div>
            </div>
          </CardBody>
        </Card>
        {children}
      </div>
    </div>
  );
};

export default myWalletLayout;
