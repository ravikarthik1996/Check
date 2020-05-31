module.exports = {

  // See <http://truffleframework.com/docs/advanced/configuration>

  // to customize your Truffle configuration

	networks: {

			development: {

			host: "localhost",

			port: 8042,

			network_id: "42", // Match any network id

			gas: 4712388,

			networkCheckTimeout: 10000000

		}

	},

 	compilers: {

			solc: {

     		        version: "^0.4.18", // A version or constraint - Ex. "^0.5.0"



    		}

        },

	mocha: {

    	enableTimeouts: false,

	before_timeout: 120000 // Here is 2min but can be whatever timeout is suitable for you.



	}

};


