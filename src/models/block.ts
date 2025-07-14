import mongoose, { InferSchemaType, Schema } from "mongoose";

const TXInputSchema = new Schema({
  txid: Buffer,
  vout: Number,
  scriptSig: {
    type: {
      pubKey: String,
      signature: String,
    },
    required: true,
  },
});

const TXOutputSchema = new Schema({
  value: Number,
  scriptPubKey: String,
});

const TransactionSchema = new Schema({
  id: Buffer,
  vin: [TXInputSchema],
  vout: [TXOutputSchema],
});

const BlockSchema = new Schema({
  index: { type: Number, required: true },
  timestamp: Number,
  transactions: [TransactionSchema],
  prevHash: String,
  hash: { type: String, unique: true },
  nonce: Number,
});

export type BlockType = InferSchemaType<typeof BlockSchema>;

export const Block =
  mongoose.models.Block || mongoose.model("Block", BlockSchema);
