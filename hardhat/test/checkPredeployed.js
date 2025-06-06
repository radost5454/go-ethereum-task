const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Lock (Predeployed)", function () {
  it("Should read state from predeployed contract", async function () {
    const lockAddress = process.env.LOCK_ADDRESS;
    expect(lockAddress).to.match(/^0x[a-fA-F0-9]{40}$/); // basic sanity check

    const Lock = await ethers.getContractFactory("Lock");
    const lock = await Lock.attach(lockAddress);

    const unlockTime = await lock.unlockTime();
    const owner = await lock.owner();

    expect(unlockTime).to.be.a("bigint");
    expect(owner).to.properAddress;
  });
});
