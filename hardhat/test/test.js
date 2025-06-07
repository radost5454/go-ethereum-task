const { JsonRpcProvider, Wallet, Contract } = require("ethers");
const { expect } = require("chai");
const LockArtifact = require("../artifacts/contracts/Lock.sol/Lock.json"); // adjust if needed

describe("Lock Contract (Live Devnet)", function () {
  let lock;

  before(async function () {
    const provider = new JsonRpcProvider("http://localhost:8545");
    const signer = new Wallet(
      "0x59c6995e998f97a5a004497e5da0da3eb20c29e0cde8c3c2d20c3eab366d8e84",
      provider
    );

    const deployedAddress = "0xYourDeployedLockAddress"; // update this!
    lock = new Contract(deployedAddress, LockArtifact.abi, signer);
  });

  it("Should return unlockTime", async function () {
    const unlockTime = await lock.unlockTime();
    console.log("🔓 Unlock time:", unlockTime.toString());
    expect(unlockTime).to.be.a("bigint");
  });
});
