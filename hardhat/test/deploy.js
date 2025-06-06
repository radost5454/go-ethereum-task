const hre = require("hardhat");
const fs = require("fs");

async function main() {
  const unlockTime = Math.floor(new Date("2030-01-01").getTime() / 1000);
  const lockedAmount = hre.ethers.parseUnits("1", "gwei");

  const Lock = await hre.ethers.getContractFactory("Lock");
  const lock = await Lock.deploy(unlockTime, { value: lockedAmount });
  await lock.waitForDeployment();

  const address = await lock.getAddress();
  console.log(`✅ Deployed to ${address}`);
  fs.writeFileSync("../lock-address.txt", address);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
