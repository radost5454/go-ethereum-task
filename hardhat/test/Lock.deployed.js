const { expect } = require("chai");
const { ethers } = require("hardhat");
const fs = require("fs");

describe("Lock contract on predeployed Geth", function () {
  let lock;

  before(async () => {
    const { Lock } = JSON.parse(fs.readFileSync("./deployed.json", "utf8"));
    lock = await ethers.getContractAt("Lock", Lock);
  });

  it("should have a valid owner", async () => {
    const owner = await lock.owner();
    expect(owner).to.be.properAddress;
  });

  it("should have a valid unlock time", async () => {
    const unlockTime = await lock.unlockTime();
    expect(unlockTime).to.be.a("bigint");
  });
});
