const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Lock - Geth Verification", function () {
  it("Should read unlockTime from already deployed Lock contract", async function () {
    const contractAddress = process.env.CONTRACT_ADDRESS;
    console.log("🔍 CONTRACT_ADDRESS from env:", contractAddress);

    expect(contractAddress).to.match(/^0x[a-fA-F0-9]{40}$/);

    const lock = await ethers.getContractAt("Lock", contractAddress);
    const unlockTime = await lock.unlockTime();
    console.log("🕒 Unlock time:", unlockTime.toString());

    expect(unlockTime).to.be.a("BigNumber");
  });
});
