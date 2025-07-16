import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import { Block } from "@/models/block";

export async function GET() {
  await connectToDatabase();

  const blocks = await Block.find().sort({ index: -1 }).lean();

  const blockRewards = blocks.map((block: any) => {
    const coinbaseTx = block.transactions[0]; // assuming it's always first
    const rewardOutput = coinbaseTx?.vout?.[0];

    return {
      index: block.index,
      timestamp: block.timestamp,
      miner: rewardOutput?.scriptPubKey || "Unknown",
      reward: rewardOutput?.value || 0,
    };
  });

  return NextResponse.json({
    count: blockRewards.length,
    blocks: blockRewards,
  });
}
