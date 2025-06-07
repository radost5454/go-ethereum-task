async function main() {
    const [deployer] = await ethers.getSigners();
  
    console.log("Deploying with account:", deployer.address);
  
    // Get balance using the provider
    const balance = await ethers.provider.getBalance(deployer.address);
    console.log("Account balance:", balance.toString());
  
    const Greeter = await ethers.getContractFactory("Greeter");
    const greeter = await Greeter.deploy("Hello from Geth!");
  
    console.log("Greeter deployed to:", greeter.target); // .target is the address in Ethers v6
  }
  
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
  