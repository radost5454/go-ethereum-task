const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Lock", function () {
  let lock;
  let unlockTime;

  beforeEach(async function () {
    const contractAddress = process.env.CONTRACT_ADDRESS;
    console.log("🔍 CONTRACT_ADDRESS from env:", contractAddress);
    expect(contractAddress).to.match(/^0x[a-fA-F0-9]{40}$/);

    // Get the contract factory to ensure we have the correct ABI
    const Lock = await ethers.getContractFactory("Lock");
    lock = await Lock.attach(contractAddress);
    
    // Verify the contract exists
    const code = await ethers.provider.getCode(contractAddress);
    expect(code).to.not.equal("0x", "Contract does not exist at the specified address");
    
    unlockTime = await lock.unlockTime();
    console.log("📆 Unlock time:", unlockTime.toString());
  });

  it("Should set the right unlockTime", async function () {
    expect(await lock.unlockTime()).to.equal(unlockTime);
  });

  it("Should have the correct owner", async function () {
    const owner = await lock.owner();
    expect(owner).to.be.a("string");
    expect(owner).to.match(/^0x[a-fA-F0-9]{40}$/);
  });

  it("Should have a balance", async function () {
    const balance = await ethers.provider.getBalance(lock.target);
    expect(balance).to.be.gt(0);
  });
});
