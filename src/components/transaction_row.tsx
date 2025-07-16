import React from "react";

import { Chip, Tooltip } from "@material-tailwind/react";
import { FaMoneyBillTransfer } from "react-icons/fa6";

const TransactionRow = () => {
  return (
    <div
      className="py-3 flex flex-row items-center border-y border-gray-300 justify-between"
      {...({} as any)}
    >
      <div className="flex flex-row items-center">
        <div className="bg-blue-gray-100 rounded-md p-3">
          <FaMoneyBillTransfer size={50} />
        </div>
        <div className="ml-4 flex flex-col">
          <h2 className="text-xl text-cyan-600 font-bold">0xfbe...</h2>
          <h2 className="text-blue-gray-600">14 seconds ago</h2>
        </div>
      </div>
      <div className="flex flex-col">
        <h2>From: 0xfbe...</h2>
        <h2>To: 0xfbe...</h2>
      </div>
      <Tooltip content="Amount">
        <Chip value="2 MyCoin" color="yellow" />
      </Tooltip>
    </div>
  );
};

export default TransactionRow;
