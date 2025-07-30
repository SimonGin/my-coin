import { NextRequest, NextResponse } from "next/server";
import { Wallet as WalletClass } from "@/services/wallet/wallet"; // elliptic-based wallet
import { Wallet as WalletModel } from "@/models/wallet";
import { connectToDatabase } from "@/lib/mongoose";
import jwt from "jsonwebtoken";

const JWT_SECRET = "my-coin-jwt-secret";

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
    const wallet = new WalletClass(mnemonic, password);
    const derivedAddress = wallet.getAddress();

    const dbWallet = await WalletModel.findOne({ address: derivedAddress });

    if (!dbWallet) {
      return NextResponse.json(
        { success: false, error: "Wallet not found" },
        { status: 404 }
      );
    }

    const token = jwt.sign({ address: dbWallet.address }, JWT_SECRET, {
      expiresIn: "7d",
    });

    return NextResponse.json({
      success: true,
      token,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Server error" },
      { status: 500 }
    );
  }
}
