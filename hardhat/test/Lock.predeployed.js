const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Lock (pre-deployed)", function () {
  let lock;

  before(async function () {
    const contractAddress = process.env.CONTRACT_ADDRESS;
    console.log("📍 CONTRACT_ADDRESS:", contractAddress);
    expect(contractAddress).to.match(/^0x[a-fA-F0-9]{40}$/);

    const Lock = await ethers.getContractFactory("Lock");
    lock = await Lock.attach(contractAddress);
  });

  it("Should return the right unlockTime", async function () {
    const unlockTime = await lock.unlockTime();
    expect(unlockTime).to.be.a("bigint");
  });

  it("Should have a valid owner", async function () {
    const owner = await lock.owner();
    expect(owner).to.match(/^0x[a-fA-F0-9]{40}$/);
  });

  it("Should have code at address", async function () {
    const code = await ethers.provider.getCode(lock.target);
    expect(code).to.not.equal("0x");
  });
});
