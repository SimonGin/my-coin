import { NextResponse } from "next/server";
import { addBlock, initBlockchain } from "@/services/blockchain/blockchain";
import {
  createProofOfWork,
  validateProofOfWork,
} from "@/services/blockchain/proof_of_work";

export async function GET() {
  const newChain = initBlockchain();

  addBlock(newChain, "Send 1 BTC to Sa");
  addBlock(newChain, "Send 2 BTC to Zacki");
  addBlock(newChain, "Send 3 BTC to Simon");

  for (const block of newChain.blocks) {
    console.log("Prev Hash: ", block.prevHash);
    console.log("Data: ", block.data);
    console.log("Hash: ", block.hash);
    let pow = createProofOfWork(block);
    console.log("POW: ", validateProofOfWork(pow));
    console.log("\n");
  }

  return NextResponse.json({ newChain });
}
