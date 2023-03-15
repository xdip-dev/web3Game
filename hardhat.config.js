require("@nomicfoundation/hardhat-toolbox");

const fs = require('fs')
let APIKey = fs.readFileSync('.alchemyURL').toString().trim()
let PrivateKey = fs.readFileSync('.secret').toString().trim()
const scans = require("./scanNetwork.json")

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  networks: {
    hardhat: {
      chainId: 1337,
    },
    mumbai:{
      url:'https://polygon-mumbai.g.alchemy.com/v2/' + APIKey,
      accounts:[PrivateKey]
    }
  },
  etherscan: {
    apiKey: scans.polygone,
 }
};
