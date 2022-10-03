const sha256 = require('crypto-js/sha256');

class Transaction {
  constructor(from, to, amount) {
    this.from = from;
    this.to = to;
    this.amount = amount;
  }
}

// 块
class Block {
  // transactions <-> array of objects
  constructor(transactions, prevHash) {
    this.transactions = transactions;
    this.prevHash = prevHash;
    this.nonce = 1;
    this.timestamp = Date.now();
    this.hash = Block.genHash(
      {transactions: this.transactions, prevHash: this.prevHash, nonce: this.nonce, timestamp: this.timestamp}
    );
  }
  // hash模块
  static genHash(block) {
    return sha256(
      JSON.stringify(block.transactions) + block.prevHash + block.nonce + block.timestamp
    ).toString();
  }

  getAnswer(difficulty) {
    // 开头前 n 位为 0 的 hash
    const ans = ''.padStart(difficulty, '0');
    return ans;
  }

  // 计算符合区块链难度要求的 hash
  // proof of work
  mine(difficulty) {
    while(true) {
      if(!this.hash.startsWith(this.getAnswer(difficulty))) {
        this.timestamp = Date.now();
        this.hash = Block.genHash({transactions: this.transactions, prevHash: this.prevHash, nonce: this.nonce++, timestamp: this.timestamp});
      } else {
        break;
      }
    }
    console.log('mine done!', this.hash)
  }
  
}

// 链
class Chain {
  constructor() {
    this.difficulty = 3;
    this.chain = [this.bigBang()];
    this.transactionsPool = [];
    this.minerReward = 50;
  }

  // 祖先区块儿的生成
  bigBang() {
    const ancestryBlock = new Block('祖先区块', null);
    ancestryBlock.hash = Block.genHash(ancestryBlock);
    return ancestryBlock;
  }

  // 尾插法
  getLastBlock() {
    return this.chain.slice(-1)[0];
  }
  
  // 添加区块到尾部
  addBlock2Chain(block) {
    block.prevHash = this.getLastBlock().hash;
    block.mine(this.difficulty);
    this.chain.push(block);
  }

  // 添加 transaction 到 transactionPoll 里
  addTransaction2Poll(transaction) {
    this.transactionsPool.push(transaction);
  }

  mineTransactionPool(mineRewardAddress) {
    // 发放矿工奖励
    const minerRewardTransaction = new Transaction(
      '',
      mineRewardAddress,
      this.minerReward
    );
    this.transactionsPool.push(minerRewardTransaction);
    // 挖矿
    const newBlock = new Block(this.transactionsPool, this.getLastBlock().hash);
    newBlock.mine(this.difficulty);
    // 添加区块到链
    // 清空 transactionPool
    this.chain.push(newBlock);
    this.transactionsPool = [];
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

const leeywCoin = new Chain();
const t1 = new Transaction('addr1', 'addr2', 10);
const t2 = new Transaction('addr2', 'addr1', 5);
leeywCoin.addTransaction2Poll(t1);
leeywCoin.addTransaction2Poll(t2);
leeywCoin.mineTransactionPool('addr3');
console.log(leeywCoin);
console.log(leeywCoin.chain[1].transactions);