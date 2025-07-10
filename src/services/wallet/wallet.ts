import crypto from "crypto";
import * as bip39 from "bip39";

export class Wallet {
  mnemonic: string;
  seed: Buffer;
  privateKey: Buffer; // changed from KeyObject to Buffer
  publicKey: Buffer;
  address: string;

  constructor(mnemonic?: string) {
    this.mnemonic = mnemonic || bip39.generateMnemonic();
    this.seed = bip39.mnemonicToSeedSync(this.mnemonic);

    const derivedKey = crypto.createHash("sha256").update(this.seed).digest();
    console.log("Derived key:", derivedKey.toString("hex"));
    const ecdh = crypto.createECDH("prime256v1");
    ecdh.setPrivateKey(derivedKey);

    this.privateKey = ecdh.getPrivateKey(); // 👈 raw EC private key buffer
    this.publicKey = ecdh.getPublicKey();
    this.address = Wallet.publicKeyToAddress(this.publicKey);
  }

  static publicKeyToAddress(pubKey: Buffer): string {
    const hash = crypto.createHash("sha256").update(pubKey).digest();
    return hash.toString("hex").slice(0, 40);
  }

  getAddress(): string {
    return this.address;
  }

  sign(data: Buffer): Buffer {
    const sign = crypto.createSign("SHA256");
    sign.update(data);
    sign.end();
    return sign.sign({
      key: this.privateKey,
      format: "der", // You can change this to "pem" if you export as pem later
      type: "pkcs8",
    });
  }

  export(): {
    address: string;
    mnemonic: string;
    publicKey: string;
    privateKey: string;
  } {
    return {
      address: this.address,
      mnemonic: this.mnemonic,
      publicKey: this.publicKey.toString("hex"),
      privateKey: this.privateKey.toString("hex"), // 👈 just raw hex
    };
  }
}
