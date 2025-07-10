import { NextRequest, NextResponse } from "next/server";
import { getBalance, findUTXOs } from "@/services/blockchain/transaction";
import { connectToDatabase } from "@/lib/mongoose";

export async function GET(req: NextRequest) {
  await connectToDatabase();

  const address = req.nextUrl.searchParams.get("address");
  if (!address) {
    return NextResponse.json({ error: "Address is required" }, { status: 400 });
  }

  try {
    const balance = await getBalance(address);
    const utxos = await findUTXOs(address);

    return NextResponse.json({ address, balance, utxos });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
