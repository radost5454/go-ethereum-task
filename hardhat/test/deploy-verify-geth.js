const { expect } = require("chai");
const hre = require("hardhat");

describe("Lock - Geth Verification", function () {
  it("Should read unlockTime from already deployed Lock contract", async function () {
    const address = process.env.CONTRACT_ADDRESS;
    expect(address).to.match(/^0x[a-fA-F0-9]{40}$/);

    const lock = await hre.ethers.getContractAt("Lock", address);
    const unlockTime = await lock.unlockTime();

    console.log("Unlock time:", unlockTime.toString());
    expect(unlockTime).to.be.a("bigint");
  });
});
