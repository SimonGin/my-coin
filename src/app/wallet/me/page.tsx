"use client";

import { useWallet } from "@/states/wallet";
import { maskedAddress, timeAgo } from "@/utils";
import { Button, Card, CardBody, Typography } from "@material-tailwind/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FaArrowDown, FaArrowUp } from "react-icons/fa6";
import axios from "axios";
import Pagination from "@/components/pagination";

const TABLE_HEAD = ["Transaction", "Amount", "Type", "From/To", "Time"];

const ITEMS_PER_PAGE = 5;

const MyWalletPage = () => {
  const { walletAddress } = useWallet();
  const router = useRouter();

  const [transactions, setTransactions] = useState<any[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    setCurrentPage(1);
  }, [walletAddress]);

  useEffect(() => {
    if (!walletAddress) return;
    fetchHistory();
  }, [walletAddress, currentPage]);

  const fetchHistory = async () => {
    try {
      const response = await axios.get(
        `/api/history/transactions?address=${walletAddress}&page=${currentPage}&limit=${ITEMS_PER_PAGE}`
      );
      if (response.status === 200) {
        const total_pages = Math.ceil(response.data.total / ITEMS_PER_PAGE);
        setTotalPages(total_pages);
        setTransactions(response.data.transactions);
      }
    } catch (error) {
      console.error("Failed to fetch wallet history:", error);
    }
  };

  return (
    <>
      <div className="mt-3 flex justify-end">
        <Button
          size="sm"
          color={"gray"}
          {...({} as any)}
          onClick={() => {
            router.push("/wallet/me/send");
          }}
        >
          Send Coin
        </Button>
      </div>

      <div className="p-4">
        <Card className="border shadow-sm" {...({} as any)}>
          <CardBody className="p-6" {...({} as any)}>
            <div>
              <div className="text-3xl font-black">Transaction History</div>
              <div className="text-md">
                Recent blockchain transactions from your wallet
              </div>
            </div>
            {transactions.length === 0 ? (
              <div className="m-6 text-md text-center font-bold">
                There's no transactions yet. Send your first coin!
              </div>
            ) : (
              <>
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
                        ({ txid, timestamp, from, to, amount }, index) => {
                          const isLast = index === transactions.length - 1;
                          const classes = isLast
                            ? "p-4"
                            : "p-4 border-b border-blue-gray-50";

                          return (
                            <tr
                              key={`${txid}-${index}`}
                              className="hover:bg-blue-gray-50"
                            >
                              <td className={classes}>
                                <Typography
                                  variant="small"
                                  color="blue-gray"
                                  className="font-normal"
                                  {...({} as any)}
                                >
                                  {txid}
                                </Typography>
                              </td>
                              <td className={classes}>
                                <Typography
                                  variant="small"
                                  color="blue-gray"
                                  className="font-normal"
                                  {...({} as any)}
                                >
                                  {from === walletAddress
                                    ? `- ${amount} MyC`
                                    : `+ ${amount} MyC`}
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
                                    {from === walletAddress ? (
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
                                  {from === walletAddress
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
                </Card>
                <div className="flex justify-end">
                  <Pagination
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    totalPages={totalPages}
                  />
                </div>
              </>
            )}
          </CardBody>
        </Card>
      </div>
    </>
  );
};

export default MyWalletPage;
