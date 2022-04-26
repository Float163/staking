import { ethers } from "hardhat";
import * as conf from "../config";

async function main() {
  const aM63 = await ethers.getContractFactory("stakingLP");
  const am63 = await aM63.deploy(conf.CONTRACT_ADDRESS, conf.RW_ADDRESS, 10, 10, 10);

  await am63.deployed();

  console.log("Staking deployed to:", am63.address);
  
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
