import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import { Block } from "@/models/block";

export async function GET(req: NextRequest) {
  await connectToDatabase();

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const skip = (page - 1) * limit;

  const totalBlocks = await Block.countDocuments();

  const blocks = await Block.find()
    .sort({ index: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  const blockRewards = blocks.map((block: any) => {
    const coinbaseTx = block.transactions?.[0]; // assuming it's always first
    const rewardOutput = coinbaseTx?.vout?.[0];

    return {
      index: block.index,
      timestamp: block.timestamp,
      miner: rewardOutput?.scriptPubKey || "Unknown",
      reward: rewardOutput?.value || 0,
    };
  });

  return NextResponse.json({
    total: totalBlocks,
    page,
    totalPages: Math.ceil(totalBlocks / limit),
    blocks: blockRewards,
  });
}
