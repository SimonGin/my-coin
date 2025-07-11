import { NextRequest, NextResponse } from "next/server";
import { Wallet as WalletClass } from "@/services/wallet/wallet"; // elliptic-based wallet
import { Wallet as WalletModel } from "@/models/wallet";
import { connectToDatabase } from "@/lib/mongoose";

export async function POST(req: NextRequest) {
  await connectToDatabase();

  const { mnemonic, password } = await req.json();

  if (!mnemonic || !password) {
    return NextResponse.json(
      { success: false, error: "Mnemonic and password are required" },
      { status: 400 }
    );
  }

  try {
    // 1. Reconstruct wallet using mnemonic + password
    const wallet = new WalletClass(mnemonic, password);
    const derivedAddress = wallet.getAddress();

    // 2. Find wallet in DB
    const dbWallet = await WalletModel.findOne({ address: derivedAddress });

    if (!dbWallet) {
      return NextResponse.json(
        { success: false, error: "Wallet not found" },
        { status: 404 }
      );
    }

    // 3. Return wallet info
    return NextResponse.json({
      success: true,
      address: dbWallet.address,
      publicKey: dbWallet.publicKey,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Server error" },
      { status: 500 }
    );
  }
}
