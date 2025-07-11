import { NextRequest, NextResponse } from "next/server";
import { Wallet as WalletClass } from "@/services/wallet/wallet"; // updated elliptic version
import { Wallet as WalletModel } from "@/models/wallet";
import { encryptPrivateKey } from "@/utils/crypto";
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
    // Generate deterministic wallet from mnemonic + password
    const wallet = new WalletClass(mnemonic, password);

    // Encrypt the raw private key (already hex string)
    const { encryptedData, iv, salt } = encryptPrivateKey(
      wallet.privateKey,
      password
    );

    const toCreate = {
      address: wallet.getAddress(),
      publicKey: wallet.publicKey,
      encryptedPrivateKey: encryptedData,
      iv,
      salt,
    };

    // Store or update wallet in database
    await WalletModel.findOneAndUpdate(
      { address: wallet.getAddress() },
      toCreate,
      { upsert: true, new: true }
    );

    return NextResponse.json({
      success: true,
      address: wallet.getAddress(),
      mnemonic: wallet.mnemonic,
      publicKey: wallet.publicKey,
      privateKey: wallet.privateKey, // Optional: consider removing in prod
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}
