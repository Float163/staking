import * as conf from "../config";
import { task } from "hardhat/config";

let tokenA, tokenB, factory, router

task("liquidity", "Add liquidity")
    .setAction(async (taskArgs, { ethers }) => {

      const UniswapV2Factory = await ethers.getContractAt('UniswapV2Factory', conf.UNI_FABRIC_ADDR) //как получать - по адресу?
      const UniswapV2Router02 = await ethers.getContractAt('UniswapV2Router02',conf.UNI_ROUTER_ADDR)
      const tokenA = await ethers.getContractAt('m63', conf.TKA_ADDR);
      const tokenB = await ethers.getContractAt('m63', conf.TKB_ADDR);
      
      const pair_addr = await UniswapV2Factory.createPair(tokenA.address, tokenB.address);

      await tokenA.approve(pair_addr, ethers.constants.MaxUint256)
      await tokenB.approve(pair_addr, ethers.constants.MaxUint256)

      const res = await UniswapV2Router02.addLiquidity(
          tokenA.address,
          tokenB.address,
          ethers.utils.parseEther('100'),
          ethers.utils.parseEther('50'),
          ethers.utils.parseEther('1'),
          ethers.utils.parseEther('1'),
          conf.RW_ADDRESS,
          Date.now() + 200 * 1000
      )
  });
  
export default {
  solidity: "0.8.4"
};
