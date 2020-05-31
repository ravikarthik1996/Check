const keccak256 = require('keccak256')
var Web3 = require('web3');
var web3 = new Web3();
console.log(keccak256(1234567890).toString('hex'));
console.log(keccak256('1234567890').toString('hex'));
