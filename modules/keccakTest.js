const fs = require('fs');
const secp256k1 = require('secp256k1');

const keyFile = require('../conf/conf').keyFile;

module.exports = {
  fire: () => getKey(keyFile)
    .then( privKey => {
      const keyVerif = secp256k1.privateKeyVerify(privKey);
      console.log("*** DEBUG: privateKeyVerify %s", keyVerif);

      const pubKey = secp256k1.publicKeyCreate(privKey);
      console.log("*** DEBUG: publicKeyCreate %s", pubKey.toString('hex'));

      const msg = new Buffer('this string length must be 32 !!');
      const sigObj = secp256k1.sign(msg, privKey)
      console.log("*** DEBUG: sign %s", sigObj.signature.toString('hex'));

      const msgVerif = secp256k1.verify(msg, sigObj.signature, pubKey);
      console.log("*** DEBUG: verify %s", msgVerif);
    })
    .catch(console.error)
}

function getKey(fname) {
  return  new Promise( (resolve, reject) =>
    fs.readFile(fname, (err, buf) => {
      if (!err) {
        let privateKey = Buffer.from(buf.toString().replace(/^\s+|\s+$/g, ''), 'hex');
        console.log("*** DEBUG: privateKey.length: %s", privateKey.length);
        resolve(privateKey);
      }
      else reject(err);
    })
  );
}

