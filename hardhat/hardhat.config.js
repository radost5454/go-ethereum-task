require("@nomicfoundation/hardhat-toolbox");

module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.28",
      },
      {
        version: "0.8.24",
      },
      {
        version: "0.8.0",
      }
    ]
  },
  networks: {
    geth: {
      url: "http://localhost:8545",
      accounts: [
        // Replace with real key in secure settings for production
        "0x59c6995e998f97a5a004497e5da0da3eb20c29e0cde8c3c2d20c3eab366d8e84"
      ]
    }
  }
};
