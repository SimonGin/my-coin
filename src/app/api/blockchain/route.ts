import { NextResponse } from "next/server";
import {
  createGenesisBlock,
  createBlock,
  Block,
} from "@/services/blockchain/block";
import { addBlock, initBlockchain } from "@/services/blockchain/blockchain";

export async function GET() {
  const newChain = initBlockchain();

  addBlock(newChain, "Second Block");

  return NextResponse.json({ newChain });
}
