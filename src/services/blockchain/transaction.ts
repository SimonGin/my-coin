import { Buffer } from "buffer";
import crypto from "crypto";

type TXInput = {
  txid: Buffer;
  vout: number;
  scriptSig: string;
};

type TXOutput = {
  value: number;
  scriptPubKey: string;
};

type Transaction = {
  id: Buffer;
  vin: TXInput[];
  vout: TXOutput[];
};

export const createCoinbaseTransaction = (
  to: string,
  data = ""
): Transaction => {
  if (!data) {
    data = `Reward to ${to}`;
  }

  const txin = {
    txid: Buffer.alloc(0),
    vout: -1,
    scriptSig: data,
  };

  const txout = {
    value: 10,
    scriptPubKey: to,
  };

  const tx: Transaction = {
    id: Buffer.alloc(0),
    vin: [txin],
    vout: [txout],
  };

  const vinData = JSON.stringify(tx.vin);
  const voutData = JSON.stringify(tx.vout);
  const txData = vinData + voutData;
  tx.id = crypto.createHash("sha256").update(txData).digest();

  return tx;
};
