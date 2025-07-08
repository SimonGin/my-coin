import { Block } from "@/models/block";
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

export const findUTXOs = async (address: string) => {
  const blocks = await Block.find().sort({ index: 1 }).lean();

  const spentOutpoints = new Set<string>();
  const utxos: {
    txid: string;
    index: number;
    output: TXOutput;
  }[] = [];

  for (const block of blocks) {
    for (const tx of block.transactions as Transaction[]) {
      const txid = Buffer.isBuffer(tx.id)
        ? tx.id.toString("hex")
        : (tx.id as unknown as string); // fallback in case it's not a buffer

      // Mark all inputs as spent
      for (const input of tx.vin) {
        if (input.scriptSig === address) {
          const spentKey = `${Buffer.from(input.txid).toString("hex")}:${
            input.vout
          }`;
          spentOutpoints.add(spentKey);
        }
      }

      // Add unspent outputs for this address
      tx.vout.forEach((out, index) => {
        if (out.scriptPubKey === address) {
          const outpoint = `${txid}:${index}`;
          if (!spentOutpoints.has(outpoint)) {
            utxos.push({ txid, index, output: out });
          }
        }
      });
    }
  }

  return utxos;
};

/**
 * Get the total balance for a given address
 */
export const getBalance = async (address: string): Promise<number> => {
  const utxos = await findUTXOs(address);
  return utxos.reduce((sum, utxo) => sum + utxo.output.value, 0);
};

export const findSpendableOutputs = async (address: string, amount: number) => {
  const utxos = await findUTXOs(address);
  let accumulated = 0;
  const used: typeof utxos = [];

  for (const utxo of utxos) {
    used.push(utxo);
    accumulated += utxo.output.value;
    if (accumulated >= amount) break;
  }

  if (accumulated < amount) {
    throw new Error("Insufficient funds");
  }

  return { accumulated, used };
};

export const createUTXOTransaction = async (
  from: string,
  to: string,
  amount: number
): Promise<Transaction> => {
  const { accumulated, used } = await findSpendableOutputs(from, amount);

  const inputs: TXInput[] = used.map(({ txid, index }) => ({
    txid: Buffer.from(txid, "hex"),
    vout: index,
    scriptSig: from,
  }));

  const outputs: TXOutput[] = [{ value: amount, scriptPubKey: to }];

  // Return change if any
  if (accumulated > amount) {
    outputs.push({
      value: accumulated - amount,
      scriptPubKey: from,
    });
  }

  const tx: Transaction = {
    id: Buffer.alloc(0),
    vin: inputs,
    vout: outputs,
  };

  const txData = JSON.stringify({
    vin: inputs.map((i) => ({
      txid: i.txid.toString("hex"),
      vout: i.vout,
      scriptSig: i.scriptSig,
    })),
    vout: outputs,
  });

  tx.id = crypto.createHash("sha256").update(txData).digest();
  return tx;
};
