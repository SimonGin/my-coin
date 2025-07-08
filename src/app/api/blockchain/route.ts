import { NextResponse } from "next/server";
import { Block } from "@/models/block";
import { insertBlock } from "@/services/blockchain/blockchain";
import { findUTXOs, getBalance } from "@/services/blockchain/transaction";

export async function GET() {
  // await insertBlock("Zacki", []);
  // const chain = await Block.find().sort({ index: 1 }).lean();
  // return NextResponse.json({ chain });
  const address = "Zacki";
  const balance = await getBalance(address);
  const utxos = await findUTXOs(address);
  return NextResponse.json({ address, balance, utxos });
}
