const Hre = require("hardhat");

async function main() {

    await Hre.run("verify:verify", {
      //Deployed contract USDT address
      address: "0x78A15406D295F461d0970Cda8032B9cF4a2796dd",
      //Path of your main contract.
      contract: "contracts/USDT.sol:Usd",
    });

    // await Hre.run("verify:verify", {
    //   //Deployed contract TemplateNFT address
    //   address: "0x086FF591e5902fFBB55DeE052AF58A8B0Ca61105",
    //   //Path of your main contract.
    //   contract: "contracts/NFTTemplate.sol:Template",
    // });

    await Hre.run("verify:verify", {
      //Deployed contract Factory address
      address: "0xab252592f0DDa4067c45da19bce574Bda10e3652",
      //Path of your main contract.
      contract: "contracts/Factory.sol:TokenFactory",
    });

    await Hre.run("verify:verify", {
      //Deployed contract Temp1155 address
      address: "0x000",
      //Path of your main contract.
      contract: "contracts/Template1155.sol:Template1155",
    });
}
main()
.then(() => process.exit(0))
.catch((error) => {
  console.error(error);
  process.exit(1);
});