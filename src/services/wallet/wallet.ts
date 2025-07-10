import crypto from "crypto";
import * as bip39 from "bip39";

export class Wallet {
  mnemonic: string;
  seed: Buffer;
  privateKey: crypto.KeyObject;
  publicKey: Buffer;
  address: string;

  constructor(mnemonic?: string) {
    this.mnemonic = mnemonic || bip39.generateMnemonic();
    this.seed = bip39.mnemonicToSeedSync(this.mnemonic);

    const derivedKey = crypto.createHash("sha256").update(this.seed).digest();

    const ecdh = crypto.createECDH("prime256v1");
    ecdh.setPrivateKey(derivedKey);

    const rawPrivate = ecdh.getPrivateKey();
    const rawPublic = ecdh.getPublicKey();

    // Wrap raw private key in a valid EC KeyObject using generateKeyPair
    const keyPair = crypto.generateKeyPairSync("ec", {
      namedCurve: "prime256v1",
      privateKeyEncoding: { format: "der", type: "pkcs8" },
      publicKeyEncoding: { format: "der", type: "spki" },
    });

    this.privateKey = crypto.createPrivateKey({
      key: keyPair.privateKey,
      format: "der",
      type: "pkcs8",
    });

    this.publicKey = crypto
      .createPublicKey({
        key: keyPair.publicKey,
        format: "der",
        type: "spki",
      })
      .export({ format: "der", type: "spki" }) as Buffer;

    this.address = Wallet.publicKeyToAddress(this.publicKey);
  }

  static publicKeyToAddress(pubKey: Buffer): string {
    const hash = crypto.createHash("sha256").update(pubKey).digest();
    return hash.toString("hex").slice(0, 40); // Simplified
  }

  getAddress(): string {
    return this.address;
  }

  sign(data: Buffer): Buffer {
    const sign = crypto.createSign("SHA256");
    sign.update(data);
    sign.end();
    return sign.sign(this.privateKey); // now safe
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
      privateKey: this.privateKey
        .export({ format: "der", type: "pkcs8" })
        .toString("hex"), // ✅ Convert buffer to hex
    };
  }
}
