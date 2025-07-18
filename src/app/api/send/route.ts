import { NextRequest, NextResponse } from "next/server";
import { sendCoinAndMine } from "@/services/blockchain/blockchain";
import { connectToDatabase } from "@/lib/mongoose";

export async function POST(req: NextRequest) {
  await connectToDatabase();

  const { from, to, amount, privateKey } = await req.json();

  if (!from || !to || typeof amount !== "number" || !privateKey) {
    return NextResponse.json({ error: "Invalid parameters" }, { status: 400 });
  }

  try {
    const block = await sendCoinAndMine(from, to, amount, privateKey);
    return NextResponse.json({ success: true, block });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 400 }
    );
  }
}
