import * as bip39 from "bip39";
import { ec as EC } from "elliptic";
import crypto from "crypto";

const ec = new EC("p256"); // Same as prime256v1

export class Wallet {
  mnemonic: string;
  seed: Buffer;
  privateKey: string;
  publicKey: string;
  address: string;

  constructor(mnemonic: string, password: string) {
    this.mnemonic = mnemonic;
    this.seed = bip39.mnemonicToSeedSync(mnemonic, password); // Password acts like passphrase

    // Derive 32-byte private key deterministically from the seed
    const hash = crypto.createHash("sha256").update(this.seed).digest("hex");

    // Generate EC key pair from derived private key
    const keyPair = ec.keyFromPrivate(hash);

    this.privateKey = keyPair.getPrivate("hex");
    this.publicKey = keyPair.getPublic("hex");

    // Derive address (simplified: first 40 hex chars of SHA-256 of public key)
    const pubKeyBuffer = Buffer.from(this.publicKey, "hex");
    const addressHash = crypto
      .createHash("sha256")
      .update(pubKeyBuffer)
      .digest("hex");
    this.address = addressHash.slice(0, 40); // Just an example — customize as needed
  }

  getAddress(): string {
    return this.address;
  }

  sign(data: Buffer): string {
    const keyPair = ec.keyFromPrivate(this.privateKey, "hex");
    const signature = keyPair.sign(data);
    return signature.toDER("hex"); // Compact hex format
  }

  export() {
    return {
      address: this.address,
      mnemonic: this.mnemonic,
      privateKey: this.privateKey,
      publicKey: this.publicKey,
    };
  }
}
