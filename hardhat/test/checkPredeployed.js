const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Lock (Predeployed)", function () {
  it("Should read state from predeployed contract", async function () {
    const address = process.env.LOCK_ADDRESS;

    console.log("Loaded LOCK_ADDRESS:", address);
    expect(address).to.match(/^0x[a-fA-F0-9]{40}$/);

    const Lock = await ethers.getContractFactory("Lock");
    const lock = await Lock.attach(address);

    const unlockTime = await lock.unlockTime();
    expect(unlockTime).to.be.a("bigint");
  });
});
