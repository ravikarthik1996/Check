//install keyethereum:npm install keythereum
//install ethereumjs-tx: npm install ethereumjs-tx
//update your node default account in addr_list.json and change the node_10 to your name 

// Interaction with Ethereum
var Web3 = require('web3');
var web3 = new Web3();
//var Accounts = require('web3-eth-accounts');
var keythereum = require("keythereum");
var fs=require('fs');
//var Wallet = require('ethereumjs-wallet');
//var EthUtil = require('ethereumjs-util');

// connect to the local node
web3.setProvider(new web3.providers.HttpProvider('http://localhost:8042'));
//var accounts = new Accounts('http://localhost:8042');

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

//datadir is the directory where you installed your node. change this if you have installed in a different directory
var datadir ="/home/pi/Desktop/Github/Blockchain_dev/MyChains/node";
web3.eth.defaultAccount=web3.eth.coinbase;

//get password of default account
var pwd=fs.readFileSync(datadir+"/password.sec",'utf8');
pwd=JSON.stringify(pwd);
pwd=pwd.substr(1,pwd.length-4);

//get private key of default account
var keyObject = keythereum.importFromFile(web3.eth.coinbase.toString(), datadir);
var privateKey = keythereum.recover(pwd, keyObject);
privateKey=privateKey.toString('hex');
console.log('Private key: '+privateKey + "\n");

// testing
var test_node="node_82";
var test_node1="node_82_1";
var input1=09973573883;
var input=1234567890;
var [result,hash]=checkImage(input, getAddress(test_node));
var [result1,hash1]=checkImage(input, getAddress(test_node1));

//printing the outputs if input is correct
console.log("Result: "+result);
hash=hash.toString('hex');
hash=hash.substr(2);
console.log("hash: "+hash+ "\n");

//printing the outputs if input is incorrect
console.log("Result: "+result1);
hash1=hash1.toString('hex');
hash1=hash1.substr(2);
console.log("hash1: "+ hash1+ "\n");

//send the signed transaction
if (result.toString()=='true'){
        send_signed_transaction(privateKey,hash,getAddress(test_node),getAddress("node_10"),contractAddress);
}
else{
	console.log("No transaction receipt");
}

if (result1.toString()=='true'){
        send_signed_transaction(privateKey,hash,getAddress(test_node),getAddress("node_10"),contractAddress);
}
else{
        console.log("No transaction receipt");
}

//============function===========================================================================================

function send_signed_transaction(privkey, hashval, receiver, sender, contractAddr){
        console.log("Private key of "+sender +" : " + privkey);
        console.log("Hash value of "+receiver+ " : "+ hashval);
        var Tx = require('ethereumjs-tx').Transaction;
	// Changing hex value to buffer value
        var priv_key= Buffer.from(privkey,'hex');
        var hash_val= Buffer.from(hashval,'hex');
	//accountNonce and gasprice is to create a new transaction  and avoid known transaction error
	const accountNonce = '0x' + (web3.eth.getTransactionCount(sender) + 1).toString(16);
	const gasprice = '0x' + (web3.eth.gasPrice.toNumber() * 1.50).toString(16) ;
	console.log('nonce: '+ accountNonce);
	console.log('gasPrice: '+ gasprice);
	//raw transaction is created
        var rawtx={
		nonce: accountNonce,
                from: sender,
                to: contractAddr,
                gas: 0x5210, //21008
		gasPrice: gasprice,
                value: '0x'+web3.toWei(0.001, "ether"),
//		data: contract.methods.transfer(receiver, 1).encodeABI()
		chainId: 0x2A //network id 42
        };
        var tx= new Tx(rawtx, { chain: 'kovan'});
        tx.sign(new Buffer(priv_key,'hex')); //transaction is signed with private key
//        tx.sign(new Buffer(hash_val,'hex'));
//	console.log("hash key worked");
        var serializedTx = tx.serialize();
//        web3.eth.sendRawTransaction('0x' + serializedTx.toString('hex')).on('receipt', console.log);
	web3.eth.sendRawTransaction('0x' + serializedTx.toString('hex'), function(err, h1) {
		if (!err)
        		console.log(h1+ "\n"); //print transaction receipt
		else
        		console.log(err);
	});
}

//getAddress function is to get the address of a node
function getAddress(node_name){ 
        var addrlist = require('./addr_list.json');
        return addrlist[node_name];
}

//list_all function is used to print all accounts
function list_all() {
        for (i = 0; i < web3.eth.accounts.length; i++) {
                console.log(web3.eth.accounts[i]);
        }
}

//checkImage function is used to interact with smart contract
function checkImage(value, receiver){
        var cret=contract.Checkimage(value, receiver); 
//        console.log(cret);
        var valret=contract.checkimage(receiver); //get bool of checkimage variable
        console.log(receiver+"\t"+valret);
        var hash_val=contract.signimage(receiver); //get hash value of signed image
        console.log('hash: '+hash_val+ "\n");
        return [valret,hash_val];

}
