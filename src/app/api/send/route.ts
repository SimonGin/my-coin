import { NextRequest, NextResponse } from "next/server";
import { sendCoinAndMine } from "@/services/blockchain/blockchain";
import { connectToDatabase } from "@/lib/mongoose";
import { verifyToken } from "@/utils/auth";

export async function POST(req: NextRequest) {
  await connectToDatabase();

  try {
    const { to, amount, privateKey } = await req.json();

    if (!to || typeof amount !== "number" || !privateKey) {
      return NextResponse.json(
        { error: "Invalid parameters" },
        { status: 400 }
      );
    }

    const from = verifyToken(req);

    const block = await sendCoinAndMine(from.address, to, amount, privateKey);
    return NextResponse.json({ success: true, block });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Server error" },
      { status: 400 }
    );
  }
}
