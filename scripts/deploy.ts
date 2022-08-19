const BN = require("ethers").BigNumber;
const { ethers } = require("hardhat");
const {
    time, // time
    constants,
  } = require("@openzeppelin/test-helpers");
const { factory } = require("typescript");
import { Signer } from "ethers";

const {ether} = require("@openzeppelin/test-helpers/src/ether");


async function fmain () {
    const [deployer] = await ethers.getSigners();
    const { chainId } = await ethers.provider.getNetwork();


    const owner = "0xdb76D742488691cE76c1B8bc326fb0C8d397a2F1";
    const s1 = "0xbBD6C04430FC6575BbdA709d434128D454668e41"; 
    const s2 = "0x3be330A47E886fAdA04F769E3d8bD07789CB8941";
    const marketPlace = "0xAbFe96009c70C1fb1c28b1C2539cD230d83eE887";


    const testnet = {
        usdt : "0x78A15406D295F461d0970Cda8032B9cF4a2796dd",
        templateContract : "0x086FF591e5902fFBB55DeE052AF58A8B0Ca61105",
        factory : "0xab252592f0DDa4067c45da19bce574Bda10e3652", 
        temp1155 : "",
    }

    let USDT = await ethers.getContractFactory("Usd");
    let TemplateContract = await ethers.getContractFactory("Template");
    let Factory = await ethers.getContractFactory("TokenFactory");
    let Temp1155 = await ethers.getContractFactory("Template1155");

    // let usdt = await USDT.deploy();
    let usdt = await USDT.attach(testnet.usdt);
    console.log("USDt",usdt.address);

    // let templateContract = await TemplateContract.deploy();
    let templateContract = await TemplateContract.attach(testnet.templateContract);
    console.log("TemplateContract",templateContract.address);
    // await templateContract.initialize("NFTMarketplace","NFT",s1,s2,usdt.address,marketPlace);

    // let factory = await Factory.deploy();
    let factory = await Factory.attach(testnet.factory);
    console.log("factory",factory.address);
    await factory.initialize(templateContract.address);
    // await factory.create721Token("HeftyVerse","ERC721",s1,s2,usdt.address,marketPlace);
    
    
    let temp1155 = await Temp1155.deploy();
    // let temp1155 = await Temp1155.attach(testnet.temp1155);
    console.log("Temp1155",temp1155.address);
    await temp1155.initialize(s1,s2,usdt.address,factory.address);
  }

fmain()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });


