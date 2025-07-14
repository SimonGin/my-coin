// app/api/history/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongoose";
import { Block } from "@/models/block";
import crypto from "crypto";

// Helper to derive address from a hex‐encoded public key
function addressFromPubKey(pubKeyHex: string): string {
  const pubBuf = Buffer.from(pubKeyHex, "hex");
  const hash = crypto.createHash("sha256").update(pubBuf).digest("hex");
  return hash.slice(0, 40);
}

export async function GET(req: NextRequest) {
  const url = req.nextUrl;
  const target = url.searchParams.get("address");
  if (!target) {
    return NextResponse.json(
      { error: "Missing ?address= parameter" },
      { status: 400 }
    );
  }

  // 1) Connect and load all blocks in order
  await connectToDatabase();
  const blocks = await Block.find().sort({ index: 1 }).lean();

  const history: Array<{
    id: string;
    timestamp: number;
    type: "sent" | "received";
    from: string;
    to: string;
    amount: number;
  }> = [];

  for (const block of blocks) {
    const ts = block.timestamp;
    for (const tx of block.transactions as any[]) {
      const txidHex = Buffer.isBuffer(tx.id)
        ? tx.id.toString("hex")
        : (tx.id as string);

      // RECEIVED
      for (const out of tx.vout as any[]) {
        if (out.scriptPubKey === target) {
          const isCoinbase =
            tx.vin.length === 1 &&
            Buffer.isBuffer(tx.vin[0].txid) &&
            tx.vin[0].txid.length === 0;
          const fromAddr = isCoinbase
            ? "NETWORK"
            : (() => {
                try {
                  return addressFromPubKey(tx.vin[0].scriptSig.pubKey);
                } catch {
                  return "UNKNOWN";
                }
              })();

          history.push({
            id: txidHex,
            timestamp: ts,
            type: "received",
            from: fromAddr,
            to: target,
            amount: out.value,
          });
        }
      }

      // SENT
      for (const inp of tx.vin as any[]) {
        let fromAddr: string;
        try {
          fromAddr = addressFromPubKey(inp.scriptSig.pubKey);
        } catch {
          continue;
        }
        if (fromAddr === target) {
          for (const out of tx.vout as any[]) {
            history.push({
              id: txidHex,
              timestamp: ts,
              type: "sent",
              from: target,
              to: out.scriptPubKey,
              amount: out.value,
            });
          }
          break;
        }
      }
    }
  }

  history.sort((a, b) => a.timestamp - b.timestamp);
  return NextResponse.json({ address: target, history });
}
