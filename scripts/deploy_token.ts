import { ethers } from "hardhat";

async function main() {
  const M63 = await ethers.getContractFactory("m63");
  const m63 = await M63.deploy('TokenA1', 'TKA1', 18, ethers.utils.parseEther('500'));

  await m63.deployed();

  const M631 = await ethers.getContractFactory("m63");
  const m631 = await M631.deploy('TokenB1', 'TKB1', 18, ethers.utils.parseEther('500'));

  await m631.deployed();

  console.log("TKA1 deployed to:", m63.address);  
  console.log("TKB1 deployed to:", m631.address);

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
