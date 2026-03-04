import { network } from "hardhat";

const { ethers, networkName } = await network.connect();

console.log(`Deploying Counter to ${networkName}...`);
const counter = await ethers.deployContract("Counter");
await counter.waitForDeployment();

const address = await counter.getAddress();
console.log("Counter deployed to:", address);
