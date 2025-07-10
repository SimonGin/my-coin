import { NextRequest, NextResponse } from "next/server";
import { Wallet as WalletClass } from "@/services/wallet/wallet";
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
    const wallet = new WalletClass(mnemonic);
    const privateKeyHex = wallet.privateKey
      .export({ format: "der", type: "pkcs8" })
      .toString("hex");

    const { encryptedData, iv, salt } = encryptPrivateKey(
      privateKeyHex,
      password
    );

    const toCreate = {
      address: wallet.getAddress(),
      publicKey: wallet.publicKey.toString("hex"),
      encryptedPrivateKey: encryptedData,
      iv,
      salt,
    };

    await WalletModel.create(toCreate);

    return NextResponse.json({
      success: true,
      address: wallet.getAddress(),
      mnemonic: wallet.mnemonic,
      publicKey: wallet.publicKey.toString("hex"),
      privateKey: privateKeyHex,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
