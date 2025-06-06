require("@nomicfoundation/hardhat-toolbox");

const DEPLOYER_KEY = process.env.HARDHAT_DEPLOYER_KEY;

module.exports = {
  solidity: "0.8.28",
  networks: {
    localhost: {
      url: "http://localhost:8545",
    },
  },
};
