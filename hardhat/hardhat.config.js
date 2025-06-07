require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: "0.8.24",
  networks: {
    geth: {
      url: "http://localhost:8545",
      accounts: [
        "0x59c6995e998f97a5a004497e5da0da3eb20c29e0cde8c3c2d20c3eab366d8e84"
      ]
    }
  }
};
