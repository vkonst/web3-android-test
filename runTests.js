console.log("[*] runTest");

let keccakTest = require('./modules/keccakTest');
console.log("[*] keccakTest");
keccakTest.fire();

let txTest = require('./modules/txTest');
console.log("[*] txTest");
txTest.fire();

let ipfsTest = require('./modules/ipfsTest');
console.log("[*] ipfsTest");
ipfsTest.fire();
