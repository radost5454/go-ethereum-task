const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Lock - Geth Verification", function () {
  it("Should read unlockTime from already deployed Lock contract", async function () {
    const contractAddress = process.env.CONTRACT_ADDRESS;
    console.log("🔍 CONTRACT_ADDRESS from env:", contractAddress);
    expect(contractAddress).to.match(/^0x[a-fA-F0-9]{40}$/);

    // Get the contract factory to ensure we have the correct ABI
    const Lock = await ethers.getContractFactory("Lock");
    const lock = await Lock.attach(contractAddress);
    
    // Verify the contract exists
    const code = await ethers.provider.getCode(contractAddress);
    expect(code).to.not.equal("0x", "Contract does not exist at the specified address");
    
    // Try to read the unlockTime
    const unlockTime = await lock.unlockTime();
    console.log("📆 Unlock time:", unlockTime.toString());

    expect(typeof unlockTime).to.equal("bigint");
  });
});
