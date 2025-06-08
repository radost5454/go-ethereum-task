const { expect } = require("chai");
const hre = require("hardhat");

describe("Lock - Geth Verification", function () {
  it("Should read unlockTime from already deployed Lock contract", async function () {
    const contractAddress = process.env.CONTRACT_ADDRESS;

    const lock = await hre.ethers.getContractAt("Lock", contractAddress);

    const unlockTime = await lock.unlockTime();
    expect(unlockTime).to.be.a("bigint");
  });
});
