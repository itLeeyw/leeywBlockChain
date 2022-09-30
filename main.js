const sha256 = require('crypto-js/sha256');

// 块
class Block {
  constructor(data, prevHash) {
    this.data = data;
    this.prevHash = prevHash;
    this.hash = Block.genHash({data: this.data, prevHash: this.prevHash});
  }
  // hash模块
  static genHash(block) {
    return sha256(block.data + block.prevHash).toString();
  }
}

// 链
class Chain {
  constructor() {
    this.chain = [this.bigBang()];
  }

  // 祖先区块儿的生成
  bigBang() {
    return new Block('祖先区块', null);
  }

  // 尾插法
  getLastBlock() {
    return this.chain.slice(-1)[0];
  }
  
  // 添加区块到尾部
  addBlock2Chain(block) {
    block.prevHash = this.getLastBlock().hash;
    this.chain.push(block);
  }

  // 验证区块是否合法
  validateBlock(block) {
    if (block.hash !== Block.genHash(block)) {
      return false;
    }
    return true;
  }

  // 验证链是否合法
  validateChain() {
    if (this.chain.length === 1) {
      const ancestryBlock = this.chain[0];
      if (!this.validateBlock(ancestryBlock)) {
        console.error(ancestryBlock, '数据被篡改');
        return false;
      }
    }
    for (let i = 1, blockLen = this.chain.length; i < blockLen; i++) {
      const currBlock = this.chain[i];
      if (!this.validateBlock(currBlock)) {
        console.error(currBlock, '数据被篡改');
        return false;
      }
      const prevBlock = this.chain[i - 1];
      if (prevBlock.hash !== currBlock.prevHash) {
        console.error('链断开', prevBlock, currBlock);
        return false;
      }
    }
    return true;
  }
}

const leeywBlockChain = new Chain();
const block1 = new Block('send 1 leeywCoin', null);
leeywBlockChain.addBlock2Chain(block1);
block1.data = 'send 2 leeywCoin';
console.log(leeywBlockChain.validateChain());