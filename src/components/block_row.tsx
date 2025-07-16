import React from "react";

import { Chip, Tooltip } from "@material-tailwind/react";
import { HiCube } from "react-icons/hi2";
import { Block } from "@/types/block";
import { maskedAddress, timeAgo } from "@/utils";

const BlockRow = ({ block }: { block: Block }) => {
  return (
    <div
      className="py-3 flex flex-row items-center border-y border-gray-300 justify-between hover:bg-blue-gray-50"
      {...({} as any)}
    >
      <div className="flex flex-row items-center">
        <div className="bg-blue-gray-100 rounded-md p-3">
          <HiCube size={50} />
        </div>
        <div className="ml-4 flex flex-col">
          <h2 className="text-xl text-cyan-600 font-bold">
            Block {block.index}
          </h2>
          <h2 className="text-blue-gray-600">{timeAgo(block.timestamp)}</h2>
        </div>
      </div>

      <Tooltip content="Miner's address">
        <Chip value={maskedAddress(block.miner)} color="indigo" />
      </Tooltip>

      <Tooltip content="Reward">
        <Chip value={`${block.reward} MyC`} color="teal" />
      </Tooltip>
    </div>
  );
};

export default BlockRow;
