// We import Chai to use its asserting functions here.
import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract } from "ethers";
import { ContractFactory } from "ethers";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";

describe("Token contract", function () {

  let Token, Contr : ContractFactory;
  let stToken : Contract;
  let rwToken : Contract;
  let contr : Contract;    
  let owner : SignerWithAddress;
  let addr1 : SignerWithAddress;
  let addr2 : SignerWithAddress;
  let addrs : SignerWithAddress[];

  beforeEach(async function () {
    Token = await ethers.getContractFactory("m63");
    Contr = await ethers.getContractFactory("stakingLP");
    [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
    stToken = await Token.deploy('platinum', 'PL', 18, ethers.utils.parseEther('500'));
    rwToken = stToken;    
    contr = await Contr.deploy(stToken.address, rwToken.address, 10, 10, 10);
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await stToken.owner()).to.equal(owner.address);
    });

    it("Should assign the total supply of tokens to the owner", async function () {
      const ownerBalance = await stToken.balanceOf(owner.address);
      expect(await stToken.totalSupply()).to.equal(ownerBalance);
    });

  }); 

  describe("Transactions", function () {
    it("Should stake", async function () {
      await stToken.approve(contr.address, ethers.utils.parseEther('100'));
      await contr.stake(ethers.utils.parseEther('50'));
      const addr1Balance = await stToken.balanceOf(owner.address);
      const contrBalance = await stToken.balanceOf(contr.address);
      expect(addr1Balance).to.equal(ethers.utils.parseEther('450'));
      expect(contrBalance).to.equal(ethers.utils.parseEther('50'));      
    });

    it("Should unstake", async function () {
      await stToken.approve(contr.address, ethers.utils.parseEther('100'));
      await contr.stake(ethers.utils.parseEther('50'));
      const addr1Balance = await stToken.balanceOf(owner.address);
      const contrBalance = await stToken.balanceOf(contr.address);
      expect(addr1Balance).to.equal(ethers.utils.parseEther('450'));
      expect(contrBalance).to.equal(ethers.utils.parseEther('50'));      
      await contr.unstake();
      const addr1Balance1 = await stToken.balanceOf(owner.address);
      const contrBalance1 = await stToken.balanceOf(contr.address);
      expect(addr1Balance1).to.equal(ethers.utils.parseEther('500'));
      expect(contrBalance1).to.equal(ethers.utils.parseEther('0'));
    });

    it("Should claim", async function () {
      await stToken.approve(contr.address, ethers.utils.parseEther('100'));
      await contr.stake(ethers.utils.parseEther('50'));
      await contr.connect(owner).claim();
      const addr1Balance1 = await rwToken.balanceOf(owner.address);
      expect(addr1Balance1).to.equal(ethers.utils.parseEther('455'));
      });

      it("Should fail unstake", async function () {
        await expect(
          contr.connect(addr1).unstake()
        ).to.be.revertedWith("No enough token");
      });

      it("Should fail claim", async function () {
        await expect(
          contr.connect(addr1).unstake()
        ).to.be.revertedWith("No enough token");
      });

    });

  });