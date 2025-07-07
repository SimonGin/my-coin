import crypto from "crypto";
import { createProofOfWork, runProofOfWork } from "./proof_of_work";
import { connectToDatabase } from "@/lib/mongoose";
import { Block } from "@/models/block";

export const createBlock = async (data: string): Promise<any> => {
  await connectToDatabase();

  const prevBlock = await Block.findOne().sort({ index: -1 });

  const newBlock = {
    index: prevBlock ? prevBlock.index + 1 : 1,
    timestamp: Date.now(),
    data,
    prevHash: prevBlock?.hash || "",
    hash: "",
    nonce: 0,
  };

  const pow = createProofOfWork(newBlock);
  const { nonce, hash } = runProofOfWork(pow);

  newBlock.hash = hash;
  newBlock.nonce = nonce;

  const saved = await Block.create(newBlock);
  return saved;
};

export const createGenesisBlock = async () => {
  await connectToDatabase();
  const exists = await Block.exists({});
  if (exists) {
    return await Block.findOne().sort({ index: 1 }); // already exists
  }

  const timestamp = Date.now();
  const data = "Genesis Block";
  const prevHash = "";
  const index = 0;
  const headers = prevHash + data + timestamp.toString();
  const hash = crypto.createHash("sha256").update(headers).digest("hex");

  const genesisBlock = {
    index,
    timestamp,
    data,
    prevHash,
    hash,
    nonce: 0,
  };

  const saved = await Block.create(genesisBlock);
  return saved;
};
