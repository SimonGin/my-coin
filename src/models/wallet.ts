import mongoose, { Schema, InferSchemaType } from "mongoose";

const WalletSchema = new Schema({
  address: { type: String, unique: true },
  publicKey: String,
  encryptedPrivateKey: String,
  iv: String,
  salt: String,
});

export type WalletDoc = InferSchemaType<typeof WalletSchema>;

export const Wallet =
  mongoose.models.Wallet || mongoose.model("Wallet", WalletSchema);
