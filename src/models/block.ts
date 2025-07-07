import mongoose, { InferSchemaType, Schema } from "mongoose";

const BlockSchema = new Schema({
  index: { type: Number, required: true },
  timestamp: Number,
  data: String,
  prevHash: String,
  hash: { type: String, unique: true },
  nonce: Number,
});

export type BlockType = InferSchemaType<typeof BlockSchema>;

export const Block =
  mongoose.models.Block || mongoose.model("Block", BlockSchema);
