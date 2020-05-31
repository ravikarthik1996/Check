//install keyethereum:npm install keythereum
// Interaction with Ethereum
var Web3 = require('web3');
var web3 = new Web3();
var Accounts = require('web3-eth-accounts');
var keythereum = require("keythereum");
var fs=require('fs');
//var Wallet = require('ethereumjs-wallet');
//var EthUtil = require('ethereumjs-util');

// connect to the local node
web3.setProvider(new web3.providers.HttpProvider('http://localhost:8042'));
var accounts = new Accounts('http://localhost:8042');

// The contract that we are going to interact with
var contractAddress ='0xBD7b7e18Fb4B5A289a72589cF1eae8463B4c0B30' ;

// Load config data from SmartToken.json
var config = require('../build/contracts/Check.json');

//load keystore
var keystore1=require('./keystore.json');

// Read ABI
var ABI = config.abi;

// contract object
var contract = web3.eth.contract(ABI).at(contractAddress);

//*********test**************************************************************************************************
var datadir ="/home/pi/Desktop/Github/Blockchain_dev/MyChains/node";
web3.eth.defaultAccount=web3.eth.coinbase;

//get password
var pwd=fs.readFileSync(datadir+"/password.sec",'utf8');
pwd=JSON.stringify(pwd);
pwd=pwd.substr(1,pwd.length-4);
var keyObject = keythereum.importFromFile(web3.eth.coinbase.toString(), datadir);
var privateKey = keythereum.recover(pwd, keyObject);
privateKey=privateKey.toString('hex');
console.log('Private key: '+privateKey);

var test_node="node_82";
var input=1234567890;
var [result,hash]=checkImage(input, getAddress(test_node));
console.log("\n"+result);
hash=hash.toString('hex');
hash=hash.substr(2);

//raw transaction
//sign the transaction
//var signedtx=accounts_sign_transaction(rawtx, h);
//var sign=sign_transaction(rawtx, getAddress(test_node));

//send the signed transaction
if (result.toString()=='true'){
	console.log('hi');
	send_signed_transaction(privateKey,hash,getAddress(test_node),getAddress("node_10"));
}

//============function===========================================================================================

function send_signed_transaction(privkey, hashval, receiver, sender){
	console.log(privkey);
	console.log(hashval);
	var Tx = require('ethereumjs-tx').Transaction;
	var priv_key= Buffer.from(privkey,'hex');
	var hash_val= Buffer.from(hashval,'hex');
	var rawtx={
		from: sender,
		to: receiver,
		gas: 2000,
		value: '0x'+web3.toWei(0.001, "ether")
	}
	var tx= new Tx(rawtx);
	tx.sign(new Buffer(priv_key,'hex'));
	console.log('private key worked');
//	tx.sign(new Buffer(hash_val,'hex'));
	var serializedTx = tx.serialize();
	web3.eth.sendRawTransaction('0x' + serializedTx.toString('hex')).on('receipt', console.log);
}

function sign_transaction(rawtx, receiver){
	return web3.eth.signTransaction(rawtx, receiver);
}

function accounts_sign_transaction(rtx, private_key){
	return web3.eth.accounts.signTransaction({rtx},private_key);
}

function getAddress(node_name){
	var addrlist = require('./addr_list.json');
	return addrlist[node_name];
}

function list_all() {
	for (i = 0; i < web3.eth.accounts.length; i++) {
		console.log(web3.eth.accounts[i]);
	}
}

function checkImage(value, receiver){
	var cret=contract.Checkimage(value, receiver);
	console.log(cret);
	var valret=contract.checkimage(receiver);
	console.log(receiver+"\t"+valret);
	var hash_val=contract.signimage(receiver);
	console.log('hash: '+hash_val);
	return [valret,hash_val];
}
