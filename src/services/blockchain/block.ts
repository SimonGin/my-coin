import crypto from "crypto";

export type Block = {
  timestamp: number;
  data: string;
  prevHash: string;
  hash: string;
};

const setHash = (block: Block): Block => {
  const timestamp = block.timestamp.toString();
  const headers = block.prevHash + block.data + timestamp;
  const hash = crypto.createHash("sha256").update(headers).digest("hex");
  return { ...block, hash };
};

export const createBlock = (data: string, prevHash: string): Block => {
  const newBlock: Block = {
    timestamp: Date.now(),
    data,
    prevHash,
    hash: "",
  };

  return setHash(newBlock); // ← Fix
};

export const createGenesisBlock = () => {
  const genesisBlock: Block = {
    timestamp: Date.now(),
    data: "Genesis Block",
    prevHash: "",
    hash: "",
  };
  return setHash(genesisBlock);
};
