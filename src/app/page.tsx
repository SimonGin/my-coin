"use client";

// Hooks
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useWallet } from "@/states/wallet";
import axios from "axios";
import { Block } from "@/types/block";
import Cookies from "js-cookie";
// Components
import { Button, Card, CardBody, Spinner } from "@material-tailwind/react";
import BlockRow from "@/components/block_row";
import TransactionRow from "@/components/transaction_row";
import Pagination from "@/components/pagination";
// Icons
import { GrPowerReset } from "react-icons/gr";
import { CiCoinInsert } from "react-icons/ci";
import { FaCubes } from "react-icons/fa";
import { GiMoneyStack } from "react-icons/gi";

const ITEMS_PER_PAGE = 8;

const App = () => {
  const [blockHistory, setBlockHistory] = useState<Block[]>([]);
  const [currentBlockPage, setCurrentBlockPage] = useState(1);
  const [totalBlockPages, setTotalBlockPages] = useState(1);
  const [refetchBlocks, setRefetchBlocks] = useState(false);
  const [loadingBlocks, setLoadingBlocks] = useState(false);
  const [txHistory, setTxHistory] = useState<[]>([]);
  const [currentTxPage, setCurrentTxPage] = useState(1);
  const [totalTxPages, setTotalTxPages] = useState(1);
  const [refetchTx, setRefetchTx] = useState(false);
  const [loadingTx, setLoadingTx] = useState(false);
  const { walletAddress, setWalletAddress } = useWallet();
  const [totalBlocks, setTotalBlocks] = useState(0);
  const [totalTxs, setTotalTxs] = useState(0);

  const router = useRouter();

  useEffect(() => {
    fetchBalance();
  }, []);

  const fetchBalance = async () => {
    const accessToken = Cookies.get("accessToken");
    try {
      const response = await axios.get(`/api/wallet/balance`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (response.status === 200) {
        setWalletAddress(response.data.address);
      }
    } catch (error) {
      console.error("Failed to fetch wallet balance:", error);
    }
  };

  useEffect(() => {
    fetchBlockHistory();
  }, [currentBlockPage, refetchBlocks]);

  useEffect(() => {
    fetchTransactionHistory();
  }, [currentTxPage, refetchTx]);

  const fetchBlockHistory = async () => {
    try {
      setLoadingBlocks(true);
      const response = await axios.get(
        `/api/history/blocks?page=${currentBlockPage}&limit=${ITEMS_PER_PAGE}`
      );
      if (response.status === 200) {
        setTotalBlocks(response.data.total);
        setBlockHistory(response.data.blocks);
        setTotalBlockPages(response.data.totalPages);
        setLoadingBlocks(false);
      }
    } catch (error) {
      setLoadingBlocks(false);
      console.error("Failed to fetch block history:", error);
    }
  };

  const fetchTransactionHistory = async () => {
    try {
      setLoadingTx(true);
      const response = await axios.get(
        `/api/history/transactions?page=${currentTxPage}&limit=${ITEMS_PER_PAGE}`
      );
      if (response.status === 200) {
        setTotalTxs(response.data.total);
        setTxHistory(response.data.transactions);
        setTotalTxPages(response.data.totalPages);
        setLoadingTx(false);
      }
    } catch (error) {
      setLoadingTx(false);
      console.error("Failed to fetch block history:", error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CiCoinInsert size={50} />
              <h1 className="text-xl font-semibold">MyCoin Blockchain</h1>
            </div>
            {walletAddress ? (
              <div className="flex items-center gap-3">
                <div
                  onClick={() => {
                    router.replace("/wallet/me");
                  }}
                  className="flex items-center gap-2 rounded-lg bg-muted px-3 py-2 cursor-pointer"
                >
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
            ) : (
              <>
                <Button
                  color="blue"
                  onClick={() => {
                    router.replace("/wallet/login");
                  }}
                  {...({} as any)}
                >
                  Login
                </Button>
              </>
            )}
          </div>
        </div>
      </header>
      <div>
        <div className="container mx-auto py-3 flex flex-col justify-evenly md:flex-row w-full md:gap-x-4 gap-y-4">
          <div className="p-5 flex flex-col items-center gap-4 border border-gray-300 shadow-sm rounded-md min-w-72">
            <FaCubes size={75} />
            <h1 className="text-3xl font-black">{totalBlocks}</h1>
            <h1>Total Blocks</h1>
          </div>
          <div className="p-5 flex flex-col items-center gap-4 border border-gray-300 shadow-sm rounded-md min-w-72">
            <GiMoneyStack size={75} />
            <h1 className="text-3xl font-black">{totalTxs}</h1>
            <h1>Total Transactions</h1>
          </div>
        </div>
        <div className="container mx-auto py-3 flex flex-col md:flex-row w-full md:gap-x-4 gap-y-4">
          <Card
            className="border border-gray-300 shadow-sm text-black w-full md:w-1/2"
            {...({} as any)}
          >
            <CardBody className="flex flex-col gap-3" {...({} as any)}>
              <div className="flex justify-between">
                <h1 className="text-3xl font-black">Recent Blocks</h1>
                {loadingBlocks ? (
                  <Spinner color="blue" {...({} as any)} />
                ) : (
                  <Button
                    {...({} as any)}
                    color="blue"
                    onClick={() => setRefetchBlocks(!refetchBlocks)}
                  >
                    <GrPowerReset />
                  </Button>
                )}
              </div>
              <div>
                {blockHistory.map((block, index) => (
                  <BlockRow key={index} block={block} />
                ))}
              </div>
            </CardBody>
            <div className="flex justify-center">
              <Pagination
                currentPage={currentBlockPage}
                setCurrentPage={setCurrentBlockPage}
                totalPages={totalBlockPages}
              />
            </div>
          </Card>
          <Card
            className="border border-gray-300 shadow-sm text-black w-full md:w-1/2"
            {...({} as any)}
          >
            <CardBody className="flex flex-col gap-3" {...({} as any)}>
              <div className="flex justify-between">
                <h1 className="text-3xl font-black">Recent Transactions</h1>
                {loadingTx ? (
                  <Spinner color="blue" {...({} as any)} />
                ) : (
                  <Button
                    {...({} as any)}
                    color="blue"
                    onClick={() => setRefetchTx(!refetchTx)}
                  >
                    <GrPowerReset />
                  </Button>
                )}
              </div>
              <div>
                {txHistory.map((transaction, index) => (
                  <TransactionRow key={index} transaction={transaction} />
                ))}
              </div>
            </CardBody>
            <div className="flex justify-center">
              <Pagination
                currentPage={currentTxPage}
                setCurrentPage={setCurrentTxPage}
                totalPages={totalTxPages}
              />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default App;
