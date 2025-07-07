import { intToBuffer } from "@/utils";
import crypto from "crypto";

const targetBits = 16;
const maxNonce = BigInt("9223372036854775807");

export interface RawBlock {
  index: number;
  timestamp: number;
  transactions: any[];
  prevHash: string;
  hash: string;
  nonce: number;
}

export type ProofOfWork = {
  block: RawBlock;
  target: bigint;
};

export const createProofOfWork = (block: RawBlock): ProofOfWork => {
  const target = BigInt(1) << BigInt(256 - targetBits);
  return { block, target };
};

const hashTransactions = (transactions: any[]): Buffer => {
  const hashes: Buffer[] = transactions.map((tx) => {
    if (typeof tx.id === "string") {
      return Buffer.from(tx.id, "hex");
    }
    return tx.id;
  });

  const joined = Buffer.concat(hashes);
  const hash = crypto.createHash("sha256").update(joined).digest();
  return hash;
};

export const prepareData = (block: RawBlock, nonce: number): Buffer => {
  const txHash = hashTransactions(block.transactions);
  const prevHashBytes = Buffer.from(block.prevHash ?? "", "hex");
  const timestampBytes = intToBuffer(block.timestamp ?? 0);
  const targetBitsBytes = intToBuffer(targetBits);
  const nonceBytes = intToBuffer(nonce);

  return Buffer.concat([
    prevHashBytes,
    txHash,
    timestampBytes,
    targetBitsBytes,
    nonceBytes,
  ]);
};

export const runProofOfWork = (pow: ProofOfWork) => {
  let nonce = BigInt(0);
  let hashInt: bigint;
  let finalHash: string = "";

  console.log(`Mining the block at index ${pow.block.index}...`);

  while (nonce < maxNonce) {
    const data = prepareData(pow.block, Number(nonce));
    const hash = crypto.createHash("sha256").update(data).digest("hex");

    process.stdout.write(`\r${hash}`);

    hashInt = BigInt(`0x${hash}`);
    if (hashInt < pow.target) {
      finalHash = hash;
      break;
    } else {
      nonce += BigInt(1);
    }
  }

  console.log(`\nBlock mined! Hash: ${finalHash}\n`);

  return { nonce: Number(nonce), hash: finalHash };
};

export const validateProofOfWork = (pow: ProofOfWork): boolean => {
  const data = prepareData(pow.block, pow.block.nonce ?? 0);
  const hashHex = crypto.createHash("sha256").update(data).digest("hex");

  const hashInt = BigInt(`0x${hashHex}`);
  return hashInt < pow.target;
};
