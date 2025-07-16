"use client";

import { CiCoinInsert } from "react-icons/ci";
import { Button, Card, CardBody, Chip } from "@material-tailwind/react";
import { useRouter } from "next/navigation";
import { useWallet } from "@/states/wallet";
import BlockRow from "@/components/block_row";
import TransactionRow from "@/components/transaction_row";

const App = () => {
  const { setWalletAddress } = useWallet();

  const router = useRouter();
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
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
                  router.replace("/wallet/new");
                }}
                {...({} as any)}
              >
                Disconnect
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto py-3 flex flex-col md:flex-row w-full md:gap-x-4 gap-y-4">
        <Card
          className="border border-gray-300 shadow-sm text-black w-full md:w-1/2"
          {...({} as any)}
        >
          <CardBody className="flex flex-col gap-3" {...({} as any)}>
            <h1 className="text-3xl font-black">Recent Blocks</h1>
            <div>
              <BlockRow />
              <BlockRow />
              <BlockRow />
              <BlockRow />
            </div>
          </CardBody>
        </Card>
        <Card
          className="border border-gray-300 shadow-sm text-black w-full md:w-1/2"
          {...({} as any)}
        >
          <CardBody className="flex flex-col gap-3" {...({} as any)}>
            <h1 className="text-3xl font-black">Recent Transactions</h1>
            <div>
              <TransactionRow />
              <TransactionRow />
              <TransactionRow />
              <TransactionRow />
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default App;
