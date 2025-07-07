import { intToBuffer } from "@/utils";
import crypto from "crypto";
import type { BlockType } from "@/models/block";

const targetBits = 16;
const maxNonce = BigInt("9223372036854775807");

export type ProofOfWork = {
  block: BlockType;
  target: bigint;
};

export const createProofOfWork = (block: BlockType): ProofOfWork => {
  const target = BigInt(1) << BigInt(256 - targetBits);
  return { block, target };
};

export const prepareData = (block: BlockType, nonce: number): Buffer => {
  const encoder = new TextEncoder();

  const prevHashBytes = Buffer.from(block.prevHash ?? "", "hex"); // assuming hash is hex string
  const dataBytes = encoder.encode(block.data ?? ""); // converts string to Uint8Array

  const timestampBytes = intToBuffer(block.timestamp ?? 0);
  const targetBitsBytes = intToBuffer(targetBits);
  const nonceBytes = intToBuffer(nonce);

  const allParts = Buffer.concat([
    prevHashBytes,
    Buffer.from(dataBytes),
    timestampBytes,
    targetBitsBytes,
    nonceBytes,
  ]);

  return allParts;
};

export const runProofOfWork = (pow: ProofOfWork) => {
  let nonce = BigInt(0);
  let hashInt: bigint;
  let finalHash: string = "";

  console.log(`Mining the block containing: "${pow.block.data}"`);

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

  console.log("\n\n");

  return { nonce: Number(nonce), hash: finalHash };
};

export const validateProofOfWork = (pow: ProofOfWork): boolean => {
  const data = prepareData(pow.block, pow.block.nonce ?? 0);
  const hashHex = crypto.createHash("sha256").update(data).digest("hex");

  const hashInt = BigInt(`0x${hashHex}`);
  return hashInt < pow.target;
};
