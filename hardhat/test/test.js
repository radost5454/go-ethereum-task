const { expect } = require("chai");

describe("Greeter", function () {
  it("Should return the new greeting once it's changed", async function () {
    const Greeter = await ethers.getContractFactory("Greeter");
    const greeter = await Greeter.deploy("Hello, world!");

    expect(await greeter.greet()).to.equal("Hello, world!");

    const tx = await greeter.setGreeting("Hola, mundo!");
    await tx.wait();

    expect(await greeter.greet()).to.equal("Hola, mundo!");
  });
});
