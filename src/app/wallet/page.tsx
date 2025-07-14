"use client";

import { useWalletCreate } from "@/states/wallet_creation";
import { Button, Card, CardBody } from "@material-tailwind/react";
import React, { useEffect, useState } from "react";
import { FaWallet } from "react-icons/fa";
import { TbCopy, TbCopyCheckFilled } from "react-icons/tb";

const MyWalletPage = () => {
  const [walletAddress, setWalletAddress] = useState<string>(
    "0x742d35Cc6634C0532925a3b8D4C9db96590b5c8e"
  );
  const [balance, setBalance] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);
  const { resetWalletCreation } = useWalletCreate();
  useEffect(() => {
    resetWalletCreation();
  }, []);
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <FaWallet size={30} />
              </div>
              <div>
                <h1 className="text-xl font-semibold">Blockchain Dashboard</h1>
                <p className="text-sm text-muted-foreground">
                  Manage your crypto portfolio
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 rounded-lg bg-muted px-3 py-2">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span className="text-sm font-medium">Connected</span>
              </div>
              <Button {...({} as any)}>Disconnect</Button>
            </div>
          </div>
        </div>
      </header>

      <div className="containter mx-auto px-4 py-8"></div>

      <div className="container mx-auto px-4 py-8">
        <Card className="border border-gray-300 shadow-sm" {...({} as any)}>
          <CardBody className="p-6" {...({} as any)}>
            <div className="flex items-center justify-between gap-2">
              <div className="flex gap-2 items-center">
                <FaWallet size={40} />
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
      <div className="container mx-auto px-4 py-8">
        <Card className="border shadow-sm" {...({} as any)}>
          <CardBody className="p-6" {...({} as any)}>
            <div className="text-3xl font-black">Transaction History</div>
            <div className="text-md">
              Recent blockchain transactions from your wallet
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default MyWalletPage;
