import { NextRequest, NextResponse } from "next/server";
import { getBalance, findUTXOs } from "@/services/blockchain/transaction";
import { connectToDatabase } from "@/lib/mongoose";
import { verifyToken } from "@/utils/auth";

export async function GET(req: NextRequest) {
  await connectToDatabase();

  try {
    // ✅ Get wallet address from JWT
    const payload = verifyToken(req);
    const address = payload.address;

    const balance = await getBalance(address);
    const utxos = await findUTXOs(address);

    return NextResponse.json({ address, balance, utxos });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Unauthorized" },
      { status: 401 }
    );
  }
}
