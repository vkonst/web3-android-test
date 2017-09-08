const fs = require('fs');
const Web3 = require('web3');
const ethUtils = require('ethereumjs-util');
const BN = ethUtils.BN;
const EthereumTx = require('ethereumjs-tx');

const conf = require('../conf/conf');

const web3 = new Web3(
  new Web3.providers.HttpProvider(conf.provider)
);

const oneWei = 1;

module.exports = {
  web3: web3,

  from: conf.from,
  to: conf.to,
  thirdAddr: conf.thirdAddr,
  
  sendTx: sendTx,
  signTx: signTx,
  createTx: createTx,
  Tx: Tx,

  fire: (data, weis) => (new Tx(data, weis))
                          .then(signTx)
                          .then(sendTx)
                          .then(console.log)
                          .catch(console.error)
}

function Tx(data, weis) {
    return createTx(
        conf.from,
        conf.to,
        weis ? weis : oneWei,
        ethUtils.fromAscii(data ? data : (new Date()).toString() + ': sent by web3@Android via Infura'));
}

function sendTx(serializedTx) {
  return new Promise( (resolve, reject) =>
    web3.eth.sendSignedTransaction(
      serializedTx,
      (err, res) => err ? reject(err) : resolve(res)
    )
  );
}

function signTx(tx) {
  console.log("*** DEBUG: Tx = ", JSON.stringify(tx, null, 2));
  const fname = conf.keyFile;
  return new Promise( (resolve, reject) =>
    fs.readFile(fname, (err, buf) => {
      if (!err) {
        let privateKey = Buffer.from(buf.toString().replace(/^\s+|\s+$/g, ''), 'hex');
        console.log("*** DEBUG: privateKey.length: %s", privateKey.length);
        //resolve({tx: tx, key: privateKey});
        tx.sign(privateKey);
        console.log("*** DEBUG: Tx signed");
        resolve('0x' + tx.serialize().toString('hex'));
      }
      else reject(err);
    })
  );
}

let data = (new Date()).toString() + ': sent from web3@Android via Infura';

function createTx(from, to, value=0, data, gasLimit, gasPrice=20000000000, chainId = 3) {
  if (!gasLimit) gasLimit = 21000 + data.length * 68;
  return new Promise( (resolve, reject) =>
    web3.eth.getTransactionCount(from, (err, txCount) => {
      if (!err) {
        console.log("*** DEBUG: txCount, from = %s, %s", txCount, from);
        resolve(new EthereumTx({
          nonce: web3.utils.toHex(txCount),
          gasLimit: web3.utils.toHex(gasLimit),
          gasPrice: web3.utils.toHex(gasPrice),
          to: to,
          from: from,
          value: web3.utils.toHex(new BN(value)),
          data: data,
          chainId: chainId
        }));
      }
      else { reject(err);}
    })
  )
}
