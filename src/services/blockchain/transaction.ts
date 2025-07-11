import { Block } from "@/models/block";
import { Buffer } from "buffer";
import crypto from "crypto";
import { ec as EC } from "elliptic";
const ec = new EC("p256");

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
  data = "",
  amount = 10
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
    value: amount,
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

export const getBalance = async (address: string): Promise<number> => {
  const utxos = await findUTXOs(address);
  return utxos.reduce((sum, utxo) => sum + utxo.output.value, 0);
};

const findSpendableOutputs = async (address: string, amount: number) => {
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
  fromAddress: string,
  toAddress: string,
  amount: number,
  privateKeyHex: string
): Promise<Transaction> => {
  const chain = await Block.find().sort({ index: 1 }).lean();
  const utxos: { txid: Buffer; vout: number; value: number }[] = [];

  for (const block of chain) {
    for (const tx of block.transactions) {
      tx.vout.forEach((out: any, index: number) => {
        const txidHex = Buffer.isBuffer(tx.id)
          ? tx.id.toString("hex")
          : Buffer.from(tx.id).toString("hex");

        const spent = chain.some((blk) =>
          blk.transactions.some((tx2: any) =>
            tx2.vin.some((input: any) => {
              const inputTxidHex = Buffer.isBuffer(input.txid)
                ? input.txid.toString("hex")
                : Buffer.from(input.txid).toString("hex");

              return inputTxidHex === txidHex && input.vout === index;
            })
          )
        );

        if (!spent && out.scriptPubKey === fromAddress) {
          utxos.push({
            txid: Buffer.isBuffer(tx.id) ? tx.id : Buffer.from(tx.id, "hex"),
            vout: index,
            value: out.value,
          });
        }
      });
    }
  }

  // Select enough UTXOs
  let total = 0;
  const usedUTXOs = [];

  for (const utxo of utxos) {
    usedUTXOs.push(utxo);
    total += utxo.value;
    if (total >= amount) break;
  }

  if (total < amount) {
    throw new Error("Not enough balance");
  }

  // Build TX inputs using elliptic to sign
  const key = ec.keyFromPrivate(privateKeyHex, "hex");

  const vin: TXInput[] = usedUTXOs.map((utxo) => {
    const dataToSign = Buffer.concat([
      utxo.txid,
      Buffer.from(utxo.vout.toString()),
      Buffer.from(fromAddress),
    ]);

    const hash = crypto.createHash("sha256").update(dataToSign).digest();
    const signature = key.sign(hash);
    const signatureHex = signature.toDER("hex");

    return {
      txid: utxo.txid,
      vout: utxo.vout,
      scriptSig: signatureHex,
    };
  });

  // Build outputs
  const vout: TXOutput[] = [{ value: amount, scriptPubKey: toAddress }];

  if (total > amount) {
    vout.push({
      value: total - amount,
      scriptPubKey: fromAddress,
    });
  }

  // Final TX
  const tx: Transaction = {
    id: Buffer.alloc(0),
    vin,
    vout,
  };

  const vinData = JSON.stringify(vin);
  const voutData = JSON.stringify(vout);
  tx.id = crypto
    .createHash("sha256")
    .update(vinData + voutData)
    .digest();

  return tx;
};
