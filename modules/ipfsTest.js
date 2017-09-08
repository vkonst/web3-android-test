const IPFS = require('ipfs-mini');
const ipfsOps = require('../conf/conf').ipfsOps;

let ipfs = new IPFS(ipfsOps);

module.exports = {
  ipfs: ipfs,
  fire: () => {
    let ipfs = new IPFS({host: 'ipfs.infura.io', port:5001, protocol: 'https'});
    ipfs.cat('QmTp2hEo8eXRp6wg7jXv1BLCMh5a4F3B7buAUZNZUu772j', console.log);
  }
}
