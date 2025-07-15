"use client";

import { useWallet } from "@/states/wallet";
import { useWalletCreate } from "@/states/wallet_creation";
import { maskedAddress, timeAgo } from "@/utils";
import { Button, Card, CardBody, Typography } from "@material-tailwind/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FaWallet } from "react-icons/fa";
import { TbCopy, TbCopyCheckFilled } from "react-icons/tb";
import { FaArrowDown, FaArrowUp } from "react-icons/fa6";
import { FaCoins } from "react-icons/fa";
import { RiCoinsLine } from "react-icons/ri";
import axios from "axios";
import Pagination from "@/components/pagination";

const TABLE_HEAD = ["Transaction", "Amount", "Type", "From/To", "Time"];

const ITEMS_PER_PAGE = 1;

const MyWalletPage = () => {
  const { walletAddress, setWalletAddress } = useWallet();
  const router = useRouter();
  const [balance, setBalance] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);
  const [transactions, setTransactions] = useState<any[]>([]);
  const { resetWalletCreation } = useWalletCreate();

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setWalletAddress("71cf87eb4e5232d92e3a5296c1ff78e949e27cf7");
    resetWalletCreation();
    setCurrentPage(1);
    // if (!walletAddress) {
    //   router.replace("/wallet/new");
    // }
  }, [walletAddress]);

  useEffect(() => {
    if (!walletAddress) return;
    fetchHistory();
  }, [walletAddress, currentPage]);

  const fetchHistory = async () => {
    try {
      const response = await axios.get(
        `/api/wallet/history?address=${walletAddress}&page=${currentPage}&limit=${ITEMS_PER_PAGE}`
      );
      if (response.status === 200) {
        const total_pages = Math.ceil(response.data.total / ITEMS_PER_PAGE);
        setTotalPages(total_pages);
        setTransactions(response.data.history);
        setBalance(response.data.balance);
      }
    } catch (error) {
      console.error("Failed to fetch wallet history:", error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FaWallet size={30} />
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

      <div className="container mx-auto px-4 py-8">
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
      <div className="container mx-auto px-4 py-5">
        <Card className="border border-gray-300 shadow-sm" {...({} as any)}>
          <CardBody className="p-6" {...({} as any)}>
            <div className="flex items-center justify-between gap-2">
              <div className="flex gap-2 items-center">
                <FaCoins size={40} />
                <h1 className="text-3xl font-black">Current Balance</h1>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-3xl font-black">{balance}</div>
                <RiCoinsLine size={50} />
              </div>
            </div>
          </CardBody>
        </Card>
        <div className="mt-3 flex justify-end">
          <Button size="sm" color={"gray"} {...({} as any)} onClick={() => {}}>
            Send Coin
          </Button>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8">
        <Card className="border shadow-sm" {...({} as any)}>
          <CardBody className="p-6" {...({} as any)}>
            <div>
              <div className="text-3xl font-black">Transaction History</div>
              <div className="text-md">
                Recent blockchain transactions from your wallet
              </div>
            </div>
            <Card
              className="h-full w-full overflow-scroll mt-6"
              {...({} as any)}
            >
              <table className="w-full min-w-max table-auto text-left">
                <thead>
                  <tr>
                    {TABLE_HEAD.map((head) => (
                      <th
                        key={head}
                        className="border-b border-blue-gray-100 bg-blue-gray-50 p-4"
                      >
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="font-normal leading-none opacity-70"
                          {...({} as any)}
                        >
                          {head}
                        </Typography>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {transactions?.map(
                    ({ id, timestamp, type, from, to, amount }, index) => {
                      const isLast = index === transactions.length - 1;
                      const classes = isLast
                        ? "p-4"
                        : "p-4 border-b border-blue-gray-50";

                      return (
                        <tr key={`${id}-${index}`}>
                          <td className={classes}>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal"
                              {...({} as any)}
                            >
                              {id}
                            </Typography>
                          </td>
                          <td className={classes}>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal"
                              {...({} as any)}
                            >
                              {type === "sent" ? `- ${amount}` : `+ ${amount}`}
                            </Typography>
                          </td>
                          <td className={classes}>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal"
                              {...({} as any)}
                            >
                              <span className="flex items-center gap-1">
                                {type === "sent" ? (
                                  <>
                                    <FaArrowUp color="red" />
                                    Send
                                  </>
                                ) : (
                                  <>
                                    <FaArrowDown color="green" />
                                    Receive
                                  </>
                                )}
                              </span>
                            </Typography>
                          </td>
                          <td className={classes}>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal"
                              {...({} as any)}
                            >
                              {type === "sent"
                                ? maskedAddress(to)
                                : maskedAddress(from)}
                            </Typography>
                          </td>
                          <td className={classes}>
                            <Typography
                              variant="small"
                              color="blue-gray"
                              className="font-normal"
                              {...({} as any)}
                            >
                              {timeAgo(timestamp)}
                            </Typography>
                          </td>
                        </tr>
                      );
                    }
                  )}
                </tbody>
              </table>
              <div className="flex justify-end"></div>
            </Card>
            <div className="flex justify-end">
              <Pagination
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                totalPages={totalPages}
              />
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default MyWalletPage;
