const sha256 = require("crypto-js/sha256");

// y = 算出一个口头 N 位是 0 的 hash
// y = y(x) 其他人只需要拿到 x 验算y，证明你的工作量
function proofOfWork(d = 1) {
  const data = 'leeywBlockChain';
  let x = 1;
  
  while(true) {
    if (sha256(data + x).toString().substring(0, d) !== ''.padStart(d, 0)) {
      x++;
    } else {
      console.log(x, sha256(data + x).toString());
      break;
    }
  }
}
proofOfWork(2);