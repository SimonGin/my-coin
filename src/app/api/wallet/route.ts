import { NextResponse } from "next/server";
import { HDNodeWallet, Mnemonic } from "ethers";
import * as bip39 from "bip39";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { mnemonic, password } = body;

    if (!mnemonic || !password) {
      return NextResponse.json(
        { error: "Mnemonic and password are required." },
        { status: 400 }
      );
    }

    // 1. Validate mnemonic
    if (!bip39.validateMnemonic(mnemonic)) {
      return NextResponse.json({ error: "Invalid mnemonic." }, { status: 400 });
    }

    // 2. Derive wallet from mnemonic
    const mnemonicObj = Mnemonic.fromPhrase(mnemonic);
    const wallet = HDNodeWallet.fromMnemonic(mnemonicObj);
    const publicAddress = wallet.address;
    const privateKey = wallet.privateKey;

    // 3. Encrypt mnemonic
    const iv = crypto.randomBytes(16);
    const salt = crypto.randomBytes(16);
    const key = crypto.scryptSync(password, salt, 32);
    const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
    let encrypted = cipher.update(mnemonic, "utf8", "hex");
    encrypted += cipher.final("hex");

    // 4. Return to client (you may also store this securely)
    return NextResponse.json({
      publicAddress,
      privateKey,
      encryptedMnemonic: encrypted,
      iv: iv.toString("hex"),
      salt: salt.toString("hex"),
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
