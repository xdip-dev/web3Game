require("@nomicfoundation/hardhat-toolbox");

const secrets = require("./.secret.json");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  networks: {
    hardhat: {
      chainId: 1337,
    },
    mumbai:{
      url:'https://polygon-mumbai.g.alchemy.com/v2/' + secrets.alchemyURL,
      accounts:[secrets.seed]
    }
  },
  etherscan: {
    apiKey: secrets.scan_polygone,
 }
};
