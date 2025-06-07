const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("Lock Contract (Live Devnet)", function () {
  let lock;

  before(async function () {
    const contractAddress = "0xYourDeployedLockAddress"; // Use actual deployed address
    const Lock = await ethers.getContractFactory("Lock");
    lock = Lock.attach(contractAddress);
  });

  it("Should return unlockTime", async function () {
    const unlockTime = await lock.unlockTime();
    console.log("Unlock time:", unlockTime.toString());
    expect(unlockTime).to.be.a("bigint");
  });
});
