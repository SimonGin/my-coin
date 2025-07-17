import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import { Block } from "@/models/block";
import crypto from "crypto";

export async function GET(req: NextRequest) {
  await connectToDatabase();

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const skip = (page - 1) * limit;

  const filterAddress = searchParams.get("address")?.toLowerCase();

  const blocks = await Block.find().sort({ index: -1 }).lean();

  const allTxs: any[] = [];

  for (const block of blocks) {
    const blockTimestamp = block.timestamp;

    for (const tx of block.transactions) {
      const txid = Buffer.isBuffer(tx.id)
        ? tx.id.toString("base64")
        : tx.id || "unknown";

      const isCoinbase = tx.vin?.[0]?.vout === -1;
      if (isCoinbase) continue;

      const fromAddresses = (tx.vin as any[]).map((input: any) => {
        try {
          const pubKeyHex = input.scriptSig?.pubKey;
          const derivedAddress = crypto
            .createHash("sha256")
            .update(Buffer.from(pubKeyHex, "hex"))
            .digest("hex")
            .slice(0, 40);
          return derivedAddress;
        } catch {
          return "Unknown";
        }
      });

      const fromAddress = fromAddresses[0] || "Unknown";

      for (const out of tx.vout as any[]) {
        const toAddress = out.scriptPubKey;
        const amount = out.value;

        if (toAddress === fromAddress) continue;

        const txObj = {
          txid,
          from: fromAddress,
          to: toAddress,
          amount,
          timestamp: blockTimestamp,
        };

        // Apply filtering here
        if (
          !filterAddress ||
          txObj.from.toLowerCase() === filterAddress ||
          txObj.to.toLowerCase() === filterAddress
        ) {
          allTxs.push(txObj);
        }
      }
    }
  }

  const paginatedTxs = allTxs.slice(skip, skip + limit);

  return NextResponse.json({
    total: allTxs.length,
    page,
    totalPages: Math.ceil(allTxs.length / limit),
    transactions: paginatedTxs,
  });
}
