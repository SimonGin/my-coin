import { Block } from "@/models/block";
import { Buffer } from "buffer";
import crypto from "crypto";
import { ec as EC } from "elliptic";
const ec = new EC("p256");

type TXInput = {
  txid: Buffer;
  vout: number;
  scriptSig: {
    pubKey: string;
    signature: string;
  };
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
    scriptSig: {
      pubKey: "",
      signature: data,
    },
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
        : (tx.id as unknown as string);

      for (const input of tx.vin) {
        try {
          const pubKey = input.scriptSig?.pubKey;
          const derivedAddress = crypto
            .createHash("sha256")
            .update(Buffer.from(pubKey, "hex"))
            .digest("hex")
            .slice(0, 40);

          if (derivedAddress === address) {
            const spentKey = `${Buffer.from(input.txid).toString("hex")}:${
              input.vout
            }`;
            spentOutpoints.add(spentKey);
          }
        } catch (_) {
          continue;
        }
      }

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
  const { used: usedUTXOs, accumulated: total } = await findSpendableOutputs(
    fromAddress,
    amount
  );

  const key = ec.keyFromPrivate(privateKeyHex, "hex");
  const pubKeyHex = key.getPublic("hex");

  const vin: TXInput[] = usedUTXOs.map((utxo) => {
    const dataToSign = Buffer.concat([
      Buffer.from(utxo.txid, "hex"),
      Buffer.from(utxo.index.toString()),
      Buffer.from(fromAddress),
    ]);

    const hash = crypto.createHash("sha256").update(dataToSign).digest();
    const signature = key.sign(hash);
    const signatureHex = signature.toDER("hex");

    return {
      txid: Buffer.from(utxo.txid, "hex"),
      vout: utxo.index,
      scriptSig: {
        pubKey: pubKeyHex,
        signature: signatureHex,
      },
    };
  });

  const vout: TXOutput[] = [{ value: amount, scriptPubKey: toAddress }];

  if (total > amount) {
    vout.push({
      value: total - amount,
      scriptPubKey: fromAddress,
    });
  }

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
