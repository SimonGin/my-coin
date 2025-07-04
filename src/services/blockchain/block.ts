import crypto from "crypto";
import { createProofOfWork, runProofOfWork } from "./proof_of_work";

export type Block = {
  timestamp: number;
  data: string;
  prevHash: string;
  hash: string;
  nonce: number;
};

export const createBlock = (data: string, prevHash: string): Block => {
  const newBlock: Block = {
    timestamp: Date.now(),
    data,
    prevHash,
    hash: "",
    nonce: 0,
  };

  let pow = createProofOfWork(newBlock);
  const { nonce, hash } = runProofOfWork(pow);

  newBlock.nonce = nonce;
  newBlock.hash = hash;

  return newBlock;
};

export const createGenesisBlock = () => {
  const genesisBlock: Block = {
    timestamp: Date.now(),
    data: "Genesis Block",
    prevHash: "",
    hash: "",
    nonce: 0,
  };
  const headers =
    genesisBlock.prevHash +
    genesisBlock.data +
    genesisBlock.timestamp.toString();
  const hash = crypto.createHash("sha256").update(headers).digest("hex");

  return { ...genesisBlock, hash };
};
