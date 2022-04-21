import * as conf from "../config";
import { task } from "hardhat/config";

let deployer, alice, bob, carl
let tokenA, tokenB, myWETH, factory, router

task("liquidity", "Add liquidity")
    .setAction(async (taskArgs, { ethers }) => {

      [deployer, alice, bob, carl] = await ethers.getSigners()
      const UniswapV2Factory = await ethers.getContractAt('UniswapV2Factory', conf.UNI_FABRIC_ADDR) //как получать - по адресу?
      const UniswapV2Router02 = await ethers.getContractAt('UniswapV2Router02',conf.UNI_ROUTER_ADDR)
      const ERC20 = await ethers.getContractFactory('m63')
//      const tokenA = await ethers.getContractAt('m63', "0xE758b0E2d06C456c83AF9f41A2fE850257C8c431")
//      const tokenB = await ethers.getContractAt('m63', "0x914eC54857d668F30F84A79aEC9080aF7b24e935")      
      tokenA = await ERC20.deploy("TokenA", "TKA", 18, ethers.utils.parseEther('500'))
      tokenB = await ERC20.deploy("TokenB", "TKB", 18, ethers.utils.parseEther('500'))
      
//      factory = await UniswapV2Factory.deploy(deployer.address)
//      router = await UniswapV2Router02.deploy(factory.address, myWETH.address)

      const pair_addr = await UniswapV2Factory.createPair(tokenA.address, tokenB.address);

      await tokenA.approve(UniswapV2Router02.address, ethers.constants.MaxUint256)
      await tokenB.approve(UniswapV2Router02.address, ethers.constants.MaxUint256)

      const res = await UniswapV2Router02.addLiquidity(
          tokenA.address,
          tokenB.address,
          ethers.utils.parseEther('100'),
          ethers.utils.parseEther('50'),
          0,
          0,
          deployer.address,
          ethers.constants.MaxUint256
      )
      console.log('Pair addr: ' + pair_addr);
  });

  
export default {
  solidity: "0.8.4"
};
