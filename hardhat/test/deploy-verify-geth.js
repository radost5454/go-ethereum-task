const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Lock", function () {
  let lock;
  let unlockTime;
  let owner;
  let otherAccount;

  beforeEach(async function () {
    const contractAddress = process.env.CONTRACT_ADDRESS;
    console.log("🔍 CONTRACT_ADDRESS from env:", contractAddress);
    expect(contractAddress).to.match(/^0x[a-fA-F0-9]{40}$/);

    // Get signers
    [owner, otherAccount] = await ethers.getSigners();

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

  it("Should not allow withdrawals before unlock time", async function () {
    await expect(lock.connect(owner).withdraw()).to.be.revertedWith(
      "You can't withdraw yet"
    );
  });

  it("Should not allow withdrawals by non-owner", async function () {
    await expect(lock.connect(otherAccount).withdraw()).to.be.revertedWith(
      "You aren't the owner"
    );
  });
});
