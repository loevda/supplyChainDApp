require('dotenv').config();
require('babel-register');
require('babel-polyfill');
const HDWalletProvider = require('truffle-hdwallet-provider');
const fs = require('fs');

//add your infura key in .env file
const infuraKey = process.env.INFURA_KEY;
//add your seed in .secret file
const mnemonic = fs.readFileSync(".secret").toString().trim();

module.exports = {
    networks: {
        /*development: {
            host: '127.0.0.1',
            port: 9545,
            network_id: '*', // Match any network id
        },*/
        ganache: {
            host: '127.0.0.1',
            port: 7545,
            network_id: '*', // Match any network id
        },
        rinkeby: {
            provider: () => new HDWalletProvider(mnemonic, `https://rinkeby.infura.io/v3/${infuraKey}`),
            network_id: '4'
        },
    },
    solc: {
        optimizer: {
            enabled: true,
            runs: 200
        }
    }
}