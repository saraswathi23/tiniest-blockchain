const sha256 = require('sha256');

class Block {
  constructor(index, timestamp, data, prevHash) {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.prevHash = prevHash;
    this.thisHash = sha256(
      this.index + this.timestamp + this.data + this.prevHash
    );
  }
}

const createFirstBlock = () => new Block(0, Date.now(), 'First Block', '0');

const nextBlock = (previousBlock, data) =>
  new Block(previousBlock.index + 1, Date.now(), data, previousBlock.thisHash);

const createBlockchain = num => {
  const blockchain = [createFirstBlock()];
  let prevBlock = blockchain[0];

  for (let i = 1; i < num; i += 1) {
    const blockToAdd = nextBlock(prevBlock, `This is block ${i}`);
    blockchain.push(blockToAdd);
    prevBlock = blockToAdd;
    console.log(prevBlock);
  }
};

const lengthToCreate = 3;
createBlockchain(lengthToCreate);