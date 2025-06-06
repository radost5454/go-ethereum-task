require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: "0.8.28",
  networks: {
    localhost: {
      url: "http://localhost:8545",
      accounts: [
        "0x4f3edf983ac636a65a842ce7c78d9aa706d3b113b37a2a85c6e4b8fdc5b8a7e6"
      ],
    },
  },
};
