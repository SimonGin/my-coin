// app/api/faucet/route.ts
import { NextRequest, NextResponse } from "next/server";
import { faucet } from "@/services/blockchain/blockchain";
import { connectToDatabase } from "@/lib/mongoose";

export async function POST(req: NextRequest) {
  await connectToDatabase();

  const { address, amount } = await req.json();

  if (!address) {
    return NextResponse.json(
      { success: false, error: "Address is required" },
      { status: 400 }
    );
  }

  try {
    const block = await faucet(address, amount || 10);
    return NextResponse.json({ success: true, block });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
