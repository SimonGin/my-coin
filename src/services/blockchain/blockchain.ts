import crypto from "crypto";
import { connectToDatabase } from "@/lib/mongoose";
import { Block } from "@/models/block";
import { createProofOfWork, runProofOfWork } from "./proof_of_work";
import { createCoinbaseTransaction } from "./transaction"; // you must have this helper

export const insertBlock = async (
  minerAddress: string,
  otherTransactions: any[] = []
) => {
  await connectToDatabase();

  const count = await Block.countDocuments();

  if (count === 0) {
    const timestamp = Date.now();
    const prevHash = "";
    const index = 0;

    // Only coinbase transaction in genesis
    const coinbaseTx = createCoinbaseTransaction(minerAddress, "Genesis Block");
    const transactions = [coinbaseTx];

    // Create hash based on serialized transactions
    const headers =
      prevHash + JSON.stringify(transactions) + timestamp.toString();
    const hash = crypto.createHash("sha256").update(headers).digest("hex");

    const genesisBlock = {
      index,
      timestamp,
      transactions,
      prevHash,
      hash,
      nonce: 0,
    };

    const savedGenesis = await Block.create(genesisBlock);
    return savedGenesis;
  }

  const prevBlock = await Block.findOne().sort({ index: -1 });

  const index = prevBlock!.index + 1;
  const timestamp = Date.now();
  const prevHash = prevBlock!.hash;

  const coinbaseTx = createCoinbaseTransaction(minerAddress);
  const transactions = [coinbaseTx, ...otherTransactions];

  const newBlock = {
    index,
    timestamp,
    transactions,
    prevHash,
    hash: "",
    nonce: 0,
  };

  // Run proof of work
  const pow = createProofOfWork(newBlock);
  const { nonce, hash } = runProofOfWork(pow);

  newBlock.hash = hash;
  newBlock.nonce = nonce;

  const savedBlock = await Block.create(newBlock);
  return savedBlock;
};
