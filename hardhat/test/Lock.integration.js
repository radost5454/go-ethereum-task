const fs = require("fs");
const { expect } = require("chai");

describe("Lock (Predeployed on Geth)", function () {
  let lock;

  before(async () => {
    const address = fs.readFileSync("lock-address.txt", "utf8").trim();
    lock = await ethers.getContractAt("Lock", address);
  });

  it("should return unlockTime", async () => {
    const unlockTime = await lock.unlockTime();
    expect(unlockTime).to.be.a("BigNumber");
  });

  it("should revert withdraw too early", async () => {
    await expect(lock.withdraw()).to.be.revertedWith("You can't withdraw yet");
  });
});
