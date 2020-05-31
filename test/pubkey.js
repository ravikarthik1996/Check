var Web3 = require('web3');
var web3 = new Web3();
var Accounts = require('web3-eth-accounts');
web3.setProvider(new web3.providers.HttpProvider('http://localhost:8042'));
var accounts = new Accounts('http://localhost:8042');
var Wallet = require('ethereumjs-wallet');
var EthUtil = require('ethereumjs-util');

//get private key

var key=web3.eth.accounts.decrypt({
        "address":"adff829b43c9e8c7f04906657dac2d2d8d6d8016",
        "crypto":{
                "cipher":"aes-128-ctr",
                "ciphertext":"0a613c26e6fae050182c99208342af6b80c2ba255fec84eb72c950b33e501390",
                "cipherparams":{"iv":"7091d2112e40c076a011fa745a25ccc7"},
                "kdf":"scrypt",
                "kdfparams":{
                        "dklen":32,
                        "n":262144,
                        "p":1,
                        "r":8,
                        "salt":"40c7150ea24fc22278faff972755902b5897e373b1047153c7d9181f99a20223"
                },
                "mac":"c4ac475c587a1f7432391788a311a22503c8615414e711e0e00adc2b066cfced"
                },
        "id":"025ef408-df1f-4412-8516-25cef54e5c6d",
        "version":3
}, 'ipadsony2014');

// Get a wallet instance from a private key
const privateKeyBuffer = EthUtil.toBuffer(key.privateKey);
const wallet = Wallet.fromPrivateKey(privateKeyBuffer);

// Get a public key
const publicKey = wallet.getPublicKeyString();
console.log(publicKey);

//get ethereum address
const ethaddr=web3.utils.sha3(publicKey);
console.log('\n'+ethaddr);

//get public key
const pkey=web3.utils.sha3(ethaddr);
console.log('\n'+pkey);
