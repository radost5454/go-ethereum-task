async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying with account:", deployer.address);
    console.log("Account balance:", (await deployer.getBalance()).toString());
  
    const Greeter = await ethers.getContractFactory("Greeter");
    const greeter = await Greeter.deploy("Hello from Geth!");
    await greeter.deployed();
  
    console.log("Greeter deployed to:", greeter.address);
  }
  
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
  