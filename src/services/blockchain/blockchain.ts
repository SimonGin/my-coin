import { connectToDatabase } from "@/lib/mongoose";
import { createBlock, createGenesisBlock } from "./block";
import { Block } from "@/models/block";

export const insertBlock = async (data: string) => {
  await connectToDatabase();

  const count = await Block.countDocuments();
  if (count === 0) {
    await createGenesisBlock();
  }

  const newBlock = await createBlock(data);
  return newBlock;
};
