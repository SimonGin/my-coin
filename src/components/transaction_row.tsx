import React from "react";

import { Chip, Tooltip } from "@material-tailwind/react";
import { FaMoneyBillTransfer } from "react-icons/fa6";
import { Transaction } from "@/types/transaction";
import { maskedAddress, timeAgo } from "@/utils";

const TransactionRow = ({ transaction }: { transaction: Transaction }) => {
  return (
    <div
      className="py-3 flex flex-row items-center border-y border-gray-300 justify-between hover:bg-blue-gray-50"
      {...({} as any)}
    >
      <div className="flex flex-row items-center">
        <div className="bg-blue-gray-100 rounded-md p-3">
          <FaMoneyBillTransfer size={50} />
        </div>
        <div className="ml-4 flex flex-col">
          <h2 className="text-xl text-cyan-600 font-bold">
            {maskedAddress(transaction.txid)}
          </h2>
          <h2 className="text-blue-gray-600">
            {timeAgo(transaction.timestamp)}
          </h2>
        </div>
      </div>
      <div className="flex flex-col">
        <h2>
          From:{" "}
          <span className="font-bold text-indigo-500">
            {maskedAddress(transaction.from)}
          </span>{" "}
        </h2>
        <h2>
          To:{" "}
          <span className="font-bold text-indigo-500">
            {maskedAddress(transaction.to)}
          </span>{" "}
        </h2>
      </div>
      <Tooltip content="Amount">
        <Chip value={`${transaction.amount} MyC`} color="yellow" />
      </Tooltip>
    </div>
  );
};

export default TransactionRow;
