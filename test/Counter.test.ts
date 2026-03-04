import { expect } from "chai";
import hre from "hardhat";

describe("Counter", function () {
  let ethers: Awaited<ReturnType<typeof hre.network.connect>>["ethers"];

  before(async function () {
    ({ ethers } = await hre.network.connect());
  });

  it("should start at 0, allow setNumber and increment", async function () {
    const counter = await ethers.deployContract("Counter");
    await counter.waitForDeployment();

    expect(await counter.number()).to.equal(0);

    await counter.setNumber(42);
    expect(await counter.number()).to.equal(42);

    await counter.increment();
    expect(await counter.number()).to.equal(43);
  });
});
