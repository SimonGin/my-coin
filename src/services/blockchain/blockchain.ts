import { Block, createBlock, createGenesisBlock } from "./block";

export type BlockChain = {
  blocks: Block[];
};

export const addBlock = (chain: BlockChain, data: string) => {
  const prevBlock = chain.blocks[chain.blocks.length - 1];
  const newBlock = createBlock(data, prevBlock.hash);

  chain.blocks.push(newBlock);
};

export const initBlockchain = () => {
  const newChain: BlockChain = {
    blocks: [createGenesisBlock()],
  };

  return newChain;
};
