import { NextResponse } from "next/server";
import { Block } from "@/models/block";
import { insertBlock } from "@/services/blockchain/blockchain";

export async function GET() {
  await insertBlock("Send 2 BTC to Zacki", []);

  const chain = await Block.find().sort({ index: 1 }).lean();
  return NextResponse.json({ chain });
}
