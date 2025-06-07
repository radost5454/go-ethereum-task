task("accounts:get", "Prints the current signer and balance")
  .setAction(async (_, hre) => {
    const accounts = await hre.ethers.getSigners();

    for (const signer of accounts) {
      const balance = await hre.ethers.provider.getBalance(signer.address);
      console.log(`${signer.address} — ${hre.ethers.formatEther(balance)} ETH`);
    }
  });
