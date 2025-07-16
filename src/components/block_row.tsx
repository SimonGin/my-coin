import React from "react";

import { Chip, Tooltip } from "@material-tailwind/react";
import { HiCube } from "react-icons/hi2";

const BlockRow = () => {
  return (
    <div
      className="py-3 flex flex-row items-center border-y border-gray-300 justify-between"
      {...({} as any)}
    >
      <div className="flex flex-row items-center">
        <div className="bg-blue-gray-100 rounded-md p-3">
          <HiCube size={50} />
        </div>
        <div className="ml-4 flex flex-col">
          <h2 className="text-xl text-cyan-600 font-bold">Block 1</h2>
          <h2 className="text-blue-gray-600">14 seconds ago</h2>
        </div>
      </div>
      <div className="flex flex-col">
        <h2>Miner 1</h2>
        <h2>225 txns in 12 seconds</h2>
      </div>
      <Tooltip content="Reward">
        <Chip value="1 MyCoin" color="teal" />
      </Tooltip>
    </div>
  );
};

export default BlockRow;
