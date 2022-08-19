// import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
// import { ethers, } from "hardhat";
// import { 
//   Template, 
//   Template__factory, 
//   TokenFactory, 
//   TokenFactory__factory, 
//   Usd, 
//   Usd__factory,
//   Template1155,
//   Template1155__factory,
//   SingleMarket,
//   SingleMarket__factory} from "../typechain"
// import LazyMinting from "./utilities/LazyMinting";
// import SellerVoucher from "./utilities/SellerVoucher";
// import BuyerVoucher from "./utilities/BuyerVoucher";


// import { expandTo6Decimals } from "./utilities/utilities";
// import { expect } from "chai";
// // import { console } from "console";
// import template1155Voucher from "./utilities/SFTVoucher";


// describe("Template", async() => {
// let NFT : Template;
// let factory : TokenFactory;
// let owner : SignerWithAddress;
// let superOwner : SignerWithAddress;
// let signers : SignerWithAddress[];
// let usdt :Usd;
// let template1155 : Template1155;
// let singleMarketplace:SingleMarket;

// beforeEach(async() =>{
//     signers= await ethers.getSigners();
//     owner = signers[0];
//     superOwner = signers[1];
//     NFT = await new Template__factory(owner).deploy();
//     template1155 = await new Template1155__factory(owner).deploy();
//     usdt = await new Usd__factory(owner).deploy();
//     factory = await new TokenFactory__factory(owner).deploy();
//     singleMarketplace= await new SingleMarket__factory(owner).deploy(owner.address,owner.address,usdt.address,owner.address);
//     await NFT.initialize("testName","testSymbol", owner.address, superOwner.address,usdt.address,signers[2].address);
//     await template1155.initialize("testURI",owner.address,signers[1].address,usdt.address,factory.address);
//     await factory.initialize(NFT.address, template1155.address,singleMarketplace.address);
// });

// // describe("Primary buy", async () => {

// // it("Redeem Voucher : Using Factory",async () => {
// //   //create collection
// //   await factory.connect(owner).create721Token("T-series","TSR", owner.address, superOwner.address,usdt.address);
// //   const Tseries = await factory.connect(owner).userLastNFTContracts(owner.address,0);
// //   const TRS = await new Template__factory(owner).attach(Tseries);
// //   const lazyMinting = new LazyMinting({_contract:TRS , _signer:owner});
// //   const addressOfTemplate = Tseries;
// //   const voucher= await lazyMinting.createVoucher(addressOfTemplate,1,expandTo18Decimals(3),"testURI",signers[3].address,1);
// //   await factory.redeem(Tseries, voucher, signers[4].address);
// // });

// // it("Redeem Voucher: Using marketplace",async () => {
// //   await factory.connect(owner).create721Token("T-series","TSR", owner.address, superOwner.address,usdt.address);
// //   const Tseries = await factory.connect(owner).userLastNFTContracts(owner.address,0);
// //   const TRS = await new Template__factory(owner).attach(Tseries);
// //   const addressOfTemplate = Tseries;
// //   //creating vouchers
// //   const lazyMinting = new LazyMinting({_contract:TRS , _signer:owner});
// //   const voucher= await lazyMinting.createVoucher(addressOfTemplate,1,expandTo6Decimals(3),"testURI",signers[3].address,1);
// //   const sellerVoucher = new SellerVoucher({_contract:Marketplace , _signer:owner});
// //   const VoucherSell = await sellerVoucher.createVoucher(Tseries, owner.address,1, expandTo6Decimals(10),true,true);
// //   const buyerVoucher = new BuyerVoucher({_contract:Marketplace , _signer:signers[6]});
// //   const Voucherbuy = await buyerVoucher.createVoucher(Tseries, signers[6].address,1, expandTo6Decimals(10),true);
// //   //Primary Buy
// //   //console.log("treasury balance:",await usdt.balanceOf(owner.address))
// //   await usdt.connect(owner).transfer(signers[6].address,expandTo6Decimals(1000));
// //   //console.log("treasury balance:",await usdt.balanceOf(owner.address))
// //   await usdt.connect(owner).approve(Marketplace.address,expandTo6Decimals(1000));
// //   //console.log("NFT balance of first buyer before buy:",await TRS.balanceOf(signers[6].address));
// //   await Marketplace.Buy(Voucherbuy, VoucherSell, voucher);
// //   //console.log("NFT balance of first buyer after buy:",await TRS.balanceOf(signers[6].address));
  
// //  });

// //  it("redeem : Voucher already used", async() => {
// //   const lazyMinting = new LazyMinting({_contract:NFT, _signer:signers[1]});
// //   const voucher= await lazyMinting.createVoucher(NFT.address,1,expandTo18Decimals(2),"testURI",superOwner.address,100);
// //   await NFT.connect(signers[6]).redeem(voucher,signers[6].address);
// //   await expect(NFT.connect(signers[5]).redeem(voucher,signers[6].address)).to.be.revertedWith("ERC721: token already minted");
// // });

// // it("ERROR redeem :royalty fee = sale price", async() => {
// //   const lazyMinting = new LazyMinting({_contract:NFT, _signer:signers[1]});
// //   const voucher= await lazyMinting.createVoucher(NFT.address,1,expandTo18Decimals(2),"testURI",superOwner.address,expandTo18Decimals(2));
// //   await expect(NFT.connect(signers[6]).redeem(voucher,signers[6].address)).to.be.revertedWith("ERC2981: royalty fee will exceed salePrice");
// // });

// // it("ERROR redeem : royalty fee > sale price", async() => {
// //   const lazyMinting = new LazyMinting({_contract:NFT, _signer:signers[1]});
// //   const voucher= await lazyMinting.createVoucher(NFT.address,1,expandTo18Decimals(2),"testURI",superOwner.address,expandTo18Decimals(3));
// //   await expect(NFT.connect(signers[6]).redeem(voucher,signers[6].address)).to.be.revertedWith("ERC2981: royalty fee will exceed salePrice");
// // });

// // it("redeem : check mint",async () => {
// //   const lazyMinting = new LazyMinting({_contract:NFT, _signer:owner});
// //   const voucher= await lazyMinting.createVoucher(NFT.address,1,expandTo18Decimals(2),"testURI",superOwner.address,100);
// //   //console.log(voucher,"voucher");
// //   expect(await NFT.balanceOf(signers[3].address)).to.be.eq(0); // before minting
// //   await NFT.connect(signers[3]).redeem(voucher,signers[3].address);
// //   //console.log("owner", await NFT.ownerOf(1));
// //   expect(await NFT.balanceOf(signers[3].address)).to.be.eq(1); //after minting
// // });


// // // describe("template1155 testing", async () => {
// // //   it("creating clones from factory", async () => {
// // //     await factory
// // //       .connect(owner).create1155Token("testURI",owner.address,signers[1].address,usdt.address);
// // //     const Tseries = await factory
// // //       .connect(owner)
// // //       .userLastNFTContracts(owner.address,0);
// // //   const TRS = await new Template1155__factory(owner).attach(Tseries);
// // //   const addressOfTemplate = Tseries;
// // //   const Template1155Voucher = new template1155Voucher({_contract:TRS , _signer:owner});
// // //   const voucher= await Template1155Voucher.createVoucher(addressOfTemplate,1,expandTo6Decimals(3),2,1,"testURI",signers[3].address,signers[2].address,1);
// // //   //console.log("NFT balance before buy",await TRS.balanceOf(signers[4].address,1));
// // //   await TRS.connect(signers[4]).redeem(voucher,signers[4].address,2);
// // //   //console.log("NFT balance after buy",await TRS.balanceOf(signers[4].address,1));
// // //   });
// // // });

// // describe("Advanced marketplace secondary buy", async () => {
// //   it("custodial to custodial buy", async () => {
// //     //create collection
// //     await factory
// //       .connect(owner)
// //       .create721Token(
// //         "T-series",
// //         "TSR",
// //         owner.address,
// //         superOwner.address,
// //         usdt.address
// //       );
// //     const Tseries = await factory
// //       .connect(owner)
// //       .userLastNFTContracts(owner.address,0);
// //     const TRS = await new Template__factory(owner).attach(Tseries);
// //     const addressOfTemplate = Tseries;
// //     //creating vouchers
// //     const lazyMinting = new LazyMinting({ _contract: TRS, _signer: owner });
// //     const voucher = await lazyMinting.createVoucher(
// //       addressOfTemplate,
// //       1,
// //       expandTo6Decimals(3),
// //       "testURI",
// //       signers[3].address,
// //       1
// //     );
// //     const sellerVoucher = new SellerVoucher({
// //       _contract: Marketplace,
// //       _signer: owner,
// //     });
// //     const VoucherSell = await sellerVoucher.createVoucher(
// //       Tseries,
// //       owner.address,
// //       1,
// //       expandTo6Decimals(10),
// //       true,
// //       true
// //     );
// //     const buyerVoucher = new BuyerVoucher({
// //       _contract: Marketplace,
// //       _signer: signers[6],
// //     });
// //     const Voucherbuy = await buyerVoucher.createVoucher(
// //       Tseries,
// //       signers[6].address,
// //       1,
// //       expandTo6Decimals(10),
// //       true
// //     );
// //     //Primary Buy

// //     await usdt
// //       .connect(owner)
// //       .transfer(signers[6].address, expandTo6Decimals(1000));

// //     await usdt
// //       .connect(owner)
// //       .approve(Marketplace.address, expandTo6Decimals(1000));

// //     await Marketplace.Buy(Voucherbuy, VoucherSell, voucher);
// //     expect(await TRS.balanceOf(signers[6].address)).to.be.eq(1);
// //     //Secondary Buy
// //     const sellerVoucher2 = new SellerVoucher({
// //       _contract: Marketplace,
// //       _signer: signers[6],
// //     });
// //     const VoucherSell2 = await sellerVoucher2.createVoucher(
// //       Tseries,
// //       signers[6].address,
// //       1,
// //       expandTo6Decimals(10),
// //       true,
// //       true
// //     );
// //     const buyerVoucher2 = new BuyerVoucher({
// //       _contract: Marketplace,
// //       _signer: signers[7],
// //     });
// //     const Voucherbuy2 = await buyerVoucher2.createVoucher(
// //       Tseries,
// //       signers[7].address,
// //       1,
// //       expandTo6Decimals(10),
// //       true
// //     );
// //     await usdt
// //       .connect(owner)
// //       .transfer(signers[7].address, expandTo6Decimals(1000));
// //     await usdt
// //       .connect(signers[7])
// //       .approve(Marketplace.address, expandTo6Decimals(1000));
// //     await TRS.connect(signers[6]).approve(Marketplace.address, 1);

// //     await Marketplace.Buy(Voucherbuy2, VoucherSell2, voucher);
// //     expect(await TRS.balanceOf(signers[7].address)).to.be.eq(1);
// //   });

// //   it("custodial to non-custodial buy", async () => {
// //     //create collection
// //     await factory
// //       .connect(owner)
// //       .create721Token(
// //         "T-series",
// //         "TSR",
// //         owner.address,
// //         superOwner.address,
// //         usdt.address
// //       );
// //     const Tseries = await factory
// //       .connect(owner)
// //       .userLastNFTContracts(owner.address,0);
// //     const TRS = await new Template__factory(owner).attach(Tseries);
// //     const addressOfTemplate = Tseries;
// //     //creating vouchers
// //     const lazyMinting = new LazyMinting({ _contract: TRS, _signer: owner });
// //     const voucher = await lazyMinting.createVoucher(
// //       addressOfTemplate,
// //       1,
// //       expandTo6Decimals(3),
// //       "testURI",
// //       signers[3].address,
// //       1
// //     );
// //     const sellerVoucher = new SellerVoucher({
// //       _contract: Marketplace,
// //       _signer: owner,
// //     });
// //     const VoucherSell = await sellerVoucher.createVoucher(
// //       Tseries,
// //       owner.address,
// //       1,
// //       expandTo6Decimals(10),
// //       true,
// //       true
// //     );
// //     const buyerVoucher = new BuyerVoucher({
// //       _contract: Marketplace,
// //       _signer: signers[6],
// //     });
// //     const Voucherbuy = await buyerVoucher.createVoucher(
// //       Tseries,
// //       signers[6].address,
// //       1,
// //       expandTo6Decimals(10),
// //       false
// //     );
// //     //Primary Buy

// //     await usdt
// //       .connect(owner)
// //       .transfer(signers[6].address, expandTo6Decimals(1000));

// //     await usdt
// //       .connect(signers[6])
// //       .approve(Marketplace.address, expandTo6Decimals(1000));

// //     await Marketplace.Buy(Voucherbuy, VoucherSell, voucher);
// //     expect(await TRS.balanceOf(signers[6].address)).to.be.eq(1);
// //     //Secondary Buy
// //     const sellerVoucher2 = new SellerVoucher({
// //       _contract: Marketplace,
// //       _signer: signers[6],
// //     });
// //     const VoucherSell2 = await sellerVoucher2.createVoucher(
// //       Tseries,
// //       signers[6].address,
// //       1,
// //       expandTo6Decimals(10),
// //       true,
// //       true
// //     );
// //     const buyerVoucher2 = new BuyerVoucher({
// //       _contract: Marketplace,
// //       _signer: signers[7],
// //     });
// //     const Voucherbuy2 = await buyerVoucher2.createVoucher(
// //       Tseries,
// //       signers[7].address,
// //       1,
// //       expandTo6Decimals(10),
// //       false
// //     );
// //     await usdt
// //       .connect(owner)
// //       .transfer(signers[7].address, expandTo6Decimals(1000));
// //     await usdt
// //       .connect(signers[7])
// //       .approve(Marketplace.address, expandTo6Decimals(1000));
// //     await TRS.connect(signers[6]).approve(Marketplace.address, 1);

// //     await Marketplace.Buy(Voucherbuy2, VoucherSell2, voucher);
// //     expect(await TRS.balanceOf(signers[7].address)).to.be.eq(1);
// //   });

// //   it("noncustodial to custodial buy", async () => {
// //     //create collection
// //     await factory
// //       .connect(owner)
// //       .create721Token(
// //         "T-series",
// //         "TSR",
// //         owner.address,
// //         superOwner.address,
// //         usdt.address
// //       );
// //     const Tseries = await factory
// //       .connect(owner)
// //       .userLastNFTContracts(owner.address,0);
// //     const TRS = await new Template__factory(owner).attach(Tseries);
// //     const addressOfTemplate = Tseries;
// //     //creating vouchers
// //     const lazyMinting = new LazyMinting({ _contract: TRS, _signer: owner });
// //     const voucher = await lazyMinting.createVoucher(
// //       addressOfTemplate,
// //       1,
// //       expandTo6Decimals(3),
// //       "testURI",
// //       signers[3].address,
// //       1
// //     );
// //     const sellerVoucher = new SellerVoucher({
// //       _contract: Marketplace,
// //       _signer: owner,
// //     });
// //     const VoucherSell = await sellerVoucher.createVoucher(
// //       Tseries,
// //       owner.address,
// //       1,
// //       expandTo6Decimals(10),
// //       true,
// //       false
// //     );
// //     const buyerVoucher = new BuyerVoucher({
// //       _contract: Marketplace,
// //       _signer: signers[6],
// //     });
// //     const Voucherbuy = await buyerVoucher.createVoucher(
// //       Tseries,
// //       signers[6].address,
// //       1,
// //       expandTo6Decimals(10),
// //       true
// //     );
// //     //Primary Buy

// //     await usdt
// //       .connect(owner)
// //       .transfer(signers[6].address, expandTo6Decimals(1000));

// //     await usdt
// //       .connect(signers[6])
// //       .approve(singleMarketplace.address, expandTo6Decimals(1000));
// //     await expect(
// //       singleMarketplace.Buy(Voucherbuy, VoucherSell, voucher,true)
// //     ).to.be.revertedWith("Addresses invalid");
// //   });
// //   it("ERROR: Price paid and price of nft doesn't match", async () => {
// //     //create collection
// //     await factory
// //       .connect(owner)
// //       .create721Token(
// //         "T-series",
// //         "TSR",
// //         owner.address,
// //         superOwner.address,
// //         usdt.address
// //       );
// //     const Tseries = await factory
// //       .connect(owner)
// //       .userLastNFTContracts(owner.address,0);
// //     const TRS = await new Template__factory(owner).attach(Tseries);
// //     const addressOfTemplate = Tseries;
// //     //creating vouchers
// //     const lazyMinting = new LazyMinting({ _contract: TRS, _signer: owner });
// //     const voucher = await lazyMinting.createVoucher(
// //       addressOfTemplate,
// //       1,
// //       expandTo6Decimals(10),1,1,
// //       "testURI",true,
// //       signers[3].address,
// //       1
// //     );
// //     const sellerVoucher = new SellerVoucher({
// //       _contract: singleMarketplace,
// //       _signer: owner,
// //     });
// //     const VoucherSell = await sellerVoucher.createVoucher(
// //       Tseries,
// //       owner.address,
// //       1,1,
// //       expandTo6Decimals(10),1,
// //       true,
// //       false
// //     );
// //     const buyerVoucher = new BuyerVoucher({
// //       _contract: singleMarketplace,
// //       _signer: signers[6],
// //     });
// //     const Voucherbuy = await buyerVoucher.createVoucher(
// //       Tseries,
// //       signers[6].address,
// //       1,1,
// //       expandTo6Decimals(9),1,
// //       false
// //     );
// //     //Primary Buy

// //     await usdt
// //       .connect(owner)
// //       .transfer(signers[6].address, expandTo6Decimals(1000));

// //     await usdt
// //       .connect(signers[6])
// //       .approve(singleMarketplace.address, expandTo6Decimals(1000));
// //     await expect(
// //       singleMarketplace.Buy(Voucherbuy, VoucherSell, voucher,true)
// //     ).to.be.revertedWith("Prices invalid");
// //   });

// //   it("ERROR: Counters of vouchers doesn't match", async () => {
// //     //create collection
// //     await factory
// //       .connect(owner)
// //       .create721Token(
// //         "T-series",
// //         "TSR",
// //         owner.address,
// //         superOwner.address,
// //         usdt.address
// //       );
// //     const Tseries = await factory
// //       .connect(owner)
// //       .userLastNFTContracts(owner.address,0);
// //     const TRS = await new Template__factory(owner).attach(Tseries);
// //     const addressOfTemplate = Tseries;
// //     //creating vouchers
// //     const lazyMinting = new LazyMinting({ _contract: TRS, _signer: owner });
// //     const voucher = await lazyMinting.createVoucher(
// //       addressOfTemplate,
// //       1,
// //       expandTo6Decimals(10),1,1,
// //       "testURI",true,
// //       signers[3].address,
// //       1
// //     );
// //     const sellerVoucher = new SellerVoucher({
// //       _contract: singleMarketplace,
// //       _signer: owner,
// //     });
// //     const VoucherSell = await sellerVoucher.createVoucher(
// //       Tseries,
// //       owner.address,
// //       1,1,
// //       expandTo6Decimals(10),2,
// //       true,
// //       false
// //     );
// //     const buyerVoucher = new BuyerVoucher({
// //       _contract: singleMarketplace,
// //       _signer: signers[6],
// //     });
// //     const Voucherbuy = await buyerVoucher.createVoucher(
// //       Tseries,
// //       signers[6].address,
// //       1,1,
// //       expandTo6Decimals(9),1,
// //       false
// //     );
// //     //Primary Buy

// //     await usdt
// //       .connect(owner)
// //       .transfer(signers[6].address, expandTo6Decimals(1000));

// //     await usdt
// //       .connect(signers[6])
// //       .approve(singleMarketplace.address, expandTo6Decimals(1000));
// //     await expect(
// //       singleMarketplace.Buy(Voucherbuy, VoucherSell, voucher,true)
// //     ).to.be.revertedWith("Counters invalid");
// //   });

// //   it("ERROR: Amounts of vouchers doesn't match", async () => {
// //     //create collection
// //     await factory
// //       .connect(owner)
// //       .create721Token(
// //         "T-series",
// //         "TSR",
// //         owner.address,
// //         superOwner.address,
// //         usdt.address
// //       );
// //     const Tseries = await factory
// //       .connect(owner)
// //       .userLastNFTContracts(owner.address,0);
// //     const TRS = await new Template__factory(owner).attach(Tseries);
// //     const addressOfTemplate = Tseries;
// //     //creating vouchers
// //     const lazyMinting = new LazyMinting({ _contract: TRS, _signer: owner });
// //     const voucher = await lazyMinting.createVoucher(
// //       addressOfTemplate,
// //       1,
// //       expandTo6Decimals(10),1,1,
// //       "testURI",true,
// //       signers[3].address,
// //       1
// //     );
// //     const sellerVoucher = new SellerVoucher({
// //       _contract: singleMarketplace,
// //       _signer: owner,
// //     });
// //     const VoucherSell = await sellerVoucher.createVoucher(
// //       Tseries,
// //       owner.address,
// //       1,2,
// //       expandTo6Decimals(10),1,
// //       true,
// //       false
// //     );
// //     const buyerVoucher = new BuyerVoucher({
// //       _contract: singleMarketplace,
// //       _signer: signers[6],
// //     });
// //     const Voucherbuy = await buyerVoucher.createVoucher(
// //       Tseries,
// //       signers[6].address,
// //       1,1,
// //       expandTo6Decimals(9),1,
// //       false
// //     );
// //     //Primary Buy

// //     await usdt
// //       .connect(owner)
// //       .transfer(signers[6].address, expandTo6Decimals(1000));

// //     await usdt
// //       .connect(signers[6])
// //       .approve(singleMarketplace.address, expandTo6Decimals(1000));
// //     await expect(
// //       singleMarketplace.Buy(Voucherbuy, VoucherSell, voucher,true)
// //     ).to.be.revertedWith("Amounts invalid");
// //   });

// //   //Custodial to custodial
// //   it("ERROR: Signature of buyer not matching at primary buy(C2C)", async () => {
// //     //create collection
// //     await factory
// //       .connect(owner)
// //       .create721Token(
// //         "T-series",
// //         "TSR",
// //         owner.address,
// //         superOwner.address,
// //         usdt.address
// //       );
// //     const Tseries = await factory
// //       .connect(owner)
// //       .userLastNFTContracts(owner.address,0);
// //     const TRS = await new Template__factory(owner).attach(Tseries);
// //     const addressOfTemplate = Tseries;
// //     //creating vouchers
// //     const lazyMinting = new LazyMinting({ _contract: TRS, _signer: owner });
// //     const voucher = await lazyMinting.createVoucher(
// //       addressOfTemplate,
// //       1,
// //       expandTo6Decimals(10),1,1,
// //       "testURI",true,
// //       signers[3].address,
// //       1
// //     );
// //     const sellerVoucher = new SellerVoucher({
// //       _contract: singleMarketplace,
// //       _signer: owner,
// //     });
// //     const VoucherSell = await sellerVoucher.createVoucher(
// //       Tseries,
// //       owner.address,
// //       1,1,
// //       expandTo6Decimals(10),1,
// //       true,
// //       true
// //     );
// //     const buyerVoucher = new BuyerVoucher({
// //       _contract: singleMarketplace,
// //       _signer: signers[6],
// //     });
// //     const Voucherbuy = await buyerVoucher.createVoucher(
// //       Tseries,
// //       signers[5].address,
// //       1,1,
// //       expandTo6Decimals(10),1,
// //       true
// //     );
// //     //Primary Buy

// //     await usdt
// //       .connect(owner)
// //       .transfer(signers[6].address, expandTo6Decimals(1000));

// //     await usdt
// //       .connect(signers[6])
// //       .approve(singleMarketplace.address, expandTo6Decimals(1000));
// //     await expect(
// //       singleMarketplace.Buy(Voucherbuy, VoucherSell, voucher,true)
// //     ).to.be.revertedWith("invalid buyer");
// //   });

// //   it("ERROR: Signature of seller not matching at secondary buy(C2C)", async () => {
// //     await factory
// //       .connect(owner)
// //       .create721Token(
// //         "T-series",
// //         "TSR",
// //         owner.address,
// //         superOwner.address,
// //         usdt.address
// //       );
// //     const Tseries = await factory
// //       .connect(owner)
// //       .userLastNFTContracts(owner.address,0);
// //     const TRS = await new Template__factory(owner).attach(Tseries);
// //     const addressOfTemplate = Tseries;
// //     //creating vouchers
// //     const lazyMinting = new LazyMinting({ _contract: TRS, _signer: owner });
// //     const voucher = await lazyMinting.createVoucher(
// //       addressOfTemplate,
// //       1,
// //       expandTo6Decimals(3),
// //       "testURI",
// //       signers[3].address,
// //       1
// //     );
// //     const sellerVoucher = new SellerVoucher({
// //       _contract: Marketplace,
// //       _signer: owner,
// //     });
// //     const VoucherSell = await sellerVoucher.createVoucher(
// //       Tseries,
// //       owner.address,
// //       1,
// //       expandTo6Decimals(10),
// //       true,
// //       true
// //     );
// //     const buyerVoucher = new BuyerVoucher({
// //       _contract: Marketplace,
// //       _signer: signers[6],
// //     });
// //     const Voucherbuy = await buyerVoucher.createVoucher(
// //       Tseries,
// //       signers[6].address,
// //       1,
// //       expandTo6Decimals(10),
// //       true
// //     );
// //     //Primary Buy

// //     await usdt
// //       .connect(owner)
// //       .transfer(signers[6].address, expandTo6Decimals(1000));

// //     await usdt
// //       .connect(owner)
// //       .approve(Marketplace.address, expandTo6Decimals(1000));

// //     await Marketplace.Buy(Voucherbuy, VoucherSell, voucher);
// //     expect(await TRS.balanceOf(signers[6].address)).to.be.eq(1);
// //     //Secondary Buy
// //     const sellerVoucher2 = new SellerVoucher({
// //       _contract: Marketplace,
// //       _signer: signers[6],
// //     });
// //     const VoucherSell2 = await sellerVoucher2.createVoucher(
// //       Tseries,
// //       signers[5].address,
// //       1,
// //       expandTo6Decimals(10),
// //       true,
// //       true
// //     );
// //     const buyerVoucher2 = new BuyerVoucher({
// //       _contract: Marketplace,
// //       _signer: signers[7],
// //     });
// //     const Voucherbuy2 = await buyerVoucher2.createVoucher(
// //       Tseries,
// //       signers[7].address,
// //       1,
// //       expandTo6Decimals(10),
// //       true
// //     );
// //     await usdt
// //       .connect(owner)
// //       .transfer(signers[7].address, expandTo6Decimals(1000));
// //     await usdt
// //       .connect(signers[7])
// //       .approve(Marketplace.address, expandTo6Decimals(1000));
// //     await TRS.connect(signers[6]).approve(Marketplace.address, 1);

// //     await expect( Marketplace.Buy(Voucherbuy2, VoucherSell2, voucher)).to.be.revertedWith('invalid Seller');
    
// //   });

// //   it("ERROR: Signature of buyer not matching at secondary buy(C2C)", async () => {
// //     await factory.connect(owner).create721Token("TestName","TestSymbol",owner.address,signers[1].address,usdt.address);
// //     const Tseries = await factory.connect(owner).userLastNFTContracts(owner.address,0);
// //     const TRS = await new Template__factory(owner).attach(Tseries);
  
    
// //     //creating vouchers
// //     const TemplateVoucher= await new template1155Voucher({_contract:TRS, _signer:signers[1]});
// //     const voucher = await TemplateVoucher.createVoucher(Tseries,1,expandTo6Decimals(10),1,1,"TestURI",true,signers[2].address,expandTo6Decimals(0));
// //     const seller =  new SellerVoucher({_contract:singleMarketplace, _signer:signers[1]});
// //     const sellerVoucher = await seller.createVoucher(Tseries,signers[1].address,1,1,expandTo6Decimals(10),1,true,true);
// //     const buyer = await new BuyerVoucher({_contract:singleMarketplace,_signer: signers[6]});
// //     const buyerVoucher = await buyer.createVoucher(Tseries,signers[6].address,1,1,expandTo6Decimals(10),1,true);

// //     //Primary Buy
// //     await usdt.connect(owner).transfer(signers[6].address,expandTo6Decimals(10000));
// //     await usdt.connect(owner).approve(singleMarketplace.address,expandTo6Decimals(1000));
// //     await usdt.connect(signers[6]).approve(singleMarketplace.address,expandTo6Decimals(1000));

// //     await (singleMarketplace.Buy(buyerVoucher,sellerVoucher,voucher,true));
// //     expect(await TRS.balanceOf(signers[6].address)).to.be.eq(1);

// //     //Secondary buy
// //     const TemplateVoucher2= await new template1155Voucher({_contract:TRS, _signer:signers[1]});
// //     const voucher2 = await TemplateVoucher2.createVoucher(Tseries,1,expandTo6Decimals(10),1,1,"TestURI",false,signers[2].address,expandTo6Decimals(0));
// //     const seller2 =  new SellerVoucher({_contract:singleMarketplace, _signer:signers[6]});
// //     const sellerVoucher2 = await seller2.createVoucher(Tseries,signers[6].address,1,1,expandTo6Decimals(10),1,true,true);
// //     const buyer2 = await new BuyerVoucher({_contract:singleMarketplace,_signer: signers[7]});
// //     const buyerVoucher2 = await buyer2.createVoucher(Tseries,signers[5].address,1,1,expandTo6Decimals(10),1,true);

// //     await TRS.connect(signers[6]).approve(singleMarketplace.address,1);

// //     await expect(singleMarketplace.Buy(buyerVoucher2,sellerVoucher2,voucher2,true)).to.be.revertedWith("invalid buyer");
    
// //   });


// //   // //custodial to non-custodial

// //   it("ERROR: Signature of buyer not matching at primary buy(C2N)", async () => {
// //     //create collection
// //     await factory
// //       .connect(owner)
// //       .create721Token(
// //         "T-series",
// //         "TSR",
// //         owner.address,
// //         superOwner.address,
// //         usdt.address
// //       );
// //     const Tseries = await factory
// //       .connect(owner)
// //       .userLastNFTContracts(owner.address,0);
// //     const TRS = await new Template__factory(owner).attach(Tseries);
// //     const addressOfTemplate = Tseries;
// //     //creating vouchers
// //     const lazyMinting = new LazyMinting({ _contract: TRS, _signer: owner });
// //     const voucher = await lazyMinting.createVoucher(
// //       addressOfTemplate,
// //       1,
// //       expandTo6Decimals(10),1,1,
// //       "testURI",true,
// //       signers[3].address,
// //       1
// //     );
// //     const sellerVoucher = new SellerVoucher({
// //       _contract: singleMarketplace,
// //       _signer: owner,
// //     });
// //     const VoucherSell = await sellerVoucher.createVoucher(
// //       Tseries,
// //       owner.address,
// //       1,1,
// //       expandTo6Decimals(10),1,
// //       true,
// //       true
// //     );
// //     const buyerVoucher = new BuyerVoucher({
// //       _contract: singleMarketplace,
// //       _signer: signers[6],
// //     });
// //     const Voucherbuy = await buyerVoucher.createVoucher(
// //       Tseries,
// //       signers[5].address,
// //       1,1,
// //       expandTo6Decimals(10),1,
// //       false
// //     );
// //     //Primary Buy

// //     await usdt
// //       .connect(owner)
// //       .transfer(signers[6].address, expandTo6Decimals(1000));

// //     await usdt
// //       .connect(signers[6])
// //       .approve(Marketplace.address, expandTo6Decimals(1000));
// //     await expect(
// //       Marketplace.Buy(Voucherbuy, VoucherSell, voucher)
// //     ).to.be.revertedWith("invalid buyer");
// //   });

// //   it("ERROR: Signature of seller not matching at secondary buy(C2N)", async () => {
// //     await factory
// //       .connect(owner)
// //       .create721Token(
// //         "T-series",
// //         "TSR",
// //         owner.address,
// //         superOwner.address,
// //         usdt.address
// //       );
// //     const Tseries = await factory
// //       .connect(owner)
// //       .userLastNFTContracts(owner.address,0);
// //     const TRS = await new Template__factory(owner).attach(Tseries);
// //     const addressOfTemplate = Tseries;
// //     //creating vouchers
// //     const lazyMinting = new LazyMinting({ _contract: TRS, _signer: owner });
// //     const voucher = await lazyMinting.createVoucher(
// //       addressOfTemplate,
// //       1,
// //       expandTo6Decimals(3),
// //       "testURI",
// //       signers[3].address,
// //       1
// //     );
// //     const sellerVoucher = new SellerVoucher({
// //       _contract: Marketplace,
// //       _signer: owner,
// //     });
// //     const VoucherSell = await sellerVoucher.createVoucher(
// //       Tseries,
// //       owner.address,
// //       1,
// //       expandTo6Decimals(10),
// //       true,
// //       true
// //     );
// //     const buyerVoucher = new BuyerVoucher({
// //       _contract: Marketplace,
// //       _signer: signers[6],
// //     });
// //     const Voucherbuy = await buyerVoucher.createVoucher(
// //       Tseries,
// //       signers[6].address,
// //       1,
// //       expandTo6Decimals(10),
// //       false
// //     );
// //     //Primary Buy

// //     await usdt
// //       .connect(owner)
// //       .transfer(signers[6].address, expandTo6Decimals(1000));

// //     await usdt
// //       .connect(signers[6])
// //       .approve(Marketplace.address, expandTo6Decimals(1000));

// //     await Marketplace.Buy(Voucherbuy, VoucherSell, voucher);
// //     expect(await TRS.balanceOf(signers[6].address)).to.be.eq(1);
// //     //Secondary Buy
// //     const sellerVoucher2 = new SellerVoucher({
// //       _contract: Marketplace,
// //       _signer: signers[6],
// //     });
// //     const VoucherSell2 = await sellerVoucher2.createVoucher(
// //       Tseries,
// //       signers[5].address,
// //       1,
// //       expandTo6Decimals(10),
// //       true,
// //       true
// //     );
// //     const buyerVoucher2 = new BuyerVoucher({
// //       _contract: Marketplace,
// //       _signer: signers[7],
// //     });
// //     const Voucherbuy2 = await buyerVoucher2.createVoucher(
// //       Tseries,
// //       signers[7].address,
// //       1,
// //       expandTo6Decimals(10),
// //       false
// //     );
// //     await usdt
// //       .connect(owner)
// //       .transfer(signers[7].address, expandTo6Decimals(1000));
// //     await usdt
// //       .connect(signers[7])
// //       .approve(Marketplace.address, expandTo6Decimals(1000));
// //     await TRS.connect(signers[6]).approve(Marketplace.address, 1);

// //     await expect( Marketplace.Buy(Voucherbuy2, VoucherSell2, voucher)).to.be.revertedWith('invalid Seller');
    
// //   });

// //   it("ERROR: Signature of buyer not matching at secondary buy(C2N)", async () => {
// //     await factory
// //       .connect(owner)
// //       .create721Token(
// //         "T-series",
// //         "TSR",
// //         owner.address,
// //         superOwner.address,
// //         usdt.address
// //       );
// //     const Tseries = await factory
// //       .connect(owner)
// //       .userLastNFTContracts(owner.address,0);
// //     const TRS = await new Template__factory(owner).attach(Tseries);
// //     const addressOfTemplate = Tseries;
// //     //creating vouchers
// //     const lazyMinting = new LazyMinting({ _contract: TRS, _signer: owner });
// //     const voucher = await lazyMinting.createVoucher(
// //       addressOfTemplate,
// //       1,
// //       expandTo6Decimals(3),
// //       "testURI",
// //       signers[3].address,
// //       1
// //     );
// //     const sellerVoucher = new SellerVoucher({
// //       _contract: Marketplace,
// //       _signer: owner,
// //     });
// //     const VoucherSell = await sellerVoucher.createVoucher(
// //       Tseries,
// //       owner.address,
// //       1,
// //       expandTo6Decimals(10),
// //       true,
// //       true
// //     );
// //     const buyerVoucher = new BuyerVoucher({
// //       _contract: Marketplace,
// //       _signer: signers[6],
// //     });
// //     const Voucherbuy = await buyerVoucher.createVoucher(
// //       Tseries,
// //       signers[6].address,
// //       1,
// //       expandTo6Decimals(10),
// //       false
// //     );
// //     //Primary Buy

// //     await usdt
// //       .connect(owner)
// //       .transfer(signers[6].address, expandTo6Decimals(1000));

// //     await usdt
// //       .connect(signers[6])
// //       .approve(Marketplace.address, expandTo6Decimals(1000));

// //     await Marketplace.Buy(Voucherbuy, VoucherSell, voucher);
// //     expect(await TRS.balanceOf(signers[6].address)).to.be.eq(1);
// //     //Secondary Buy
// //     const sellerVoucher2 = new SellerVoucher({
// //       _contract: Marketplace,
// //       _signer: signers[6],
// //     });
// //     const VoucherSell2 = await sellerVoucher2.createVoucher(
// //       Tseries,
// //       signers[6].address,
// //       1,
// //       expandTo6Decimals(10),
// //       true,
// //       true
// //     );
// //     const buyerVoucher2 = new BuyerVoucher({
// //       _contract: Marketplace,
// //       _signer: signers[7],
// //     });
// //     const Voucherbuy2 = await buyerVoucher2.createVoucher(
// //       Tseries,
// //       signers[5].address,
// //       1,
// //       expandTo6Decimals(10),
// //       false
// //     );
// //     await usdt
// //       .connect(owner)
// //       .transfer(signers[7].address, expandTo6Decimals(1000));
// //     await usdt
// //       .connect(signers[7])
// //       .approve(Marketplace.address, expandTo6Decimals(1000));
// //     await TRS.connect(signers[6]).approve(Marketplace.address, 1);

// //     await expect( Marketplace.Buy(Voucherbuy2, VoucherSell2, voucher)).to.be.revertedWith('invalid buyer');
    
// //   });

// //   //non-custodial to custodial

// //   it("ERROR: Signature of buyer not matching at primary buy(N2C)", async () => {
// //     //create collection
// //     await factory
// //       .connect(owner)
// //       .create721Token(
// //         "T-series",
// //         "TSR",
// //         owner.address,
// //         superOwner.address,
// //         usdt.address
// //       );
// //     const Tseries = await factory
// //       .connect(owner)
// //       .userLastNFTContracts(owner.address,0);
// //     const TRS = await new Template__factory(owner).attach(Tseries);
// //     const addressOfTemplate = Tseries;
// //     //creating vouchers
// //     const lazyMinting = new LazyMinting({ _contract: TRS, _signer: owner });
// //     const voucher = await lazyMinting.createVoucher(
// //       addressOfTemplate,
// //       1,
// //       expandTo6Decimals(3),
// //       "testURI",
// //       signers[3].address,
// //       1
// //     );
// //     const sellerVoucher = new SellerVoucher({
// //       _contract: Marketplace,
// //       _signer: owner,
// //     });
// //     const VoucherSell = await sellerVoucher.createVoucher(
// //       Tseries,
// //       owner.address,
// //       1,
// //       expandTo6Decimals(10),
// //       true,
// //       false
// //     );
// //     const buyerVoucher = new BuyerVoucher({
// //       _contract: Marketplace,
// //       _signer: signers[6],
// //     });
// //     const Voucherbuy = await buyerVoucher.createVoucher(
// //       Tseries,
// //       signers[5].address,
// //       1,
// //       expandTo6Decimals(10),
// //       true
// //     );
// //     //Primary Buy

// //     await usdt
// //       .connect(owner)
// //       .transfer(signers[6].address, expandTo6Decimals(1000));

// //     await usdt
// //       .connect(signers[6])
// //       .approve(singleMarketplace.address, expandTo6Decimals(1000));
// //     await expect(
// //       singleMarketplace.Buy(Voucherbuy, VoucherSell, voucher,true)
// //     ).to.be.revertedWith("invalid buyer");
// //   });

// //   it("ERROR: Signature of seller not matching at secondary buy(N2C)", async () => {
// //   //  
// //   await factory.connect(owner).create721Token("TestName","TestSymbol",owner.address,signers[1].address,usdt.address);
// //   const Tseries = await factory.connect(owner).userLastNFTContracts(owner.address,0);
// //   const TRS = await new Template__factory(owner).attach(Tseries);

  
// //   //creating vouchers
// //   const TemplateVoucher= await new template1155Voucher({_contract:TRS, _signer:signers[1]});
// //   const voucher = await TemplateVoucher.createVoucher(Tseries,1,expandTo6Decimals(10),1,1,"TestURI",true,signers[2].address,expandTo6Decimals(0));
// //   const seller =  new SellerVoucher({_contract:singleMarketplace, _signer:signers[1]});
// //   const sellerVoucher = await seller.createVoucher(Tseries,signers[1].address,1,1,expandTo6Decimals(10),1,true,false);
// //   const buyer = await new BuyerVoucher({_contract:singleMarketplace,_signer: signers[6]});
// //   const buyerVoucher = await buyer.createVoucher(Tseries,signers[6].address,1,1,expandTo6Decimals(10),1,true);

// //   //Primary Buy
// //   await usdt.connect(owner).transfer(signers[6].address,expandTo6Decimals(10000));
// //   await usdt.connect(owner).approve(singleMarketplace.address,expandTo6Decimals(1000));
// //   await usdt.connect(signers[6]).approve(singleMarketplace.address,expandTo6Decimals(1000));

// //   await (singleMarketplace.Buy(buyerVoucher,sellerVoucher,voucher,true));
// //   expect(await TRS.balanceOf(signers[6].address)).to.be.eq(1);

// //   //Secondary buy
// //   const TemplateVoucher2= await new template1155Voucher({_contract:TRS, _signer:signers[1]});
// //   const voucher2 = await TemplateVoucher2.createVoucher(Tseries,1,expandTo6Decimals(10),1,1,"TestURI",false,signers[2].address,expandTo6Decimals(0));
// //   const seller2 =  new SellerVoucher({_contract:singleMarketplace, _signer:signers[6]});
// //   const sellerVoucher2 = await seller2.createVoucher(Tseries,signers[5].address,1,1,expandTo6Decimals(10),1,true,false);
// //   const buyer2 = await new BuyerVoucher({_contract:singleMarketplace,_signer: signers[7]});
// //   const buyerVoucher2 = await buyer2.createVoucher(Tseries,signers[7].address,1,1,expandTo6Decimals(10),1,true);

// //   await TRS.connect(signers[6]).approve(singleMarketplace.address,1);

// //   await expect(singleMarketplace.Buy(buyerVoucher2,sellerVoucher2,voucher2,true)).to.be.revertedWith("invalid Seller");
// //   });

// //   it("ERROR: Signature of buyer not matching at secondary buy(N2C)", async () => {
// //   //   
// //   await factory.connect(owner).create721Token("TestName","TestSymbol",owner.address,signers[1].address,usdt.address);
// //   const Tseries = await factory.connect(owner).userLastNFTContracts(owner.address,0);
// //   const TRS = await new Template__factory(owner).attach(Tseries);

  
// //   //creating vouchers
// //   const TemplateVoucher= await new template1155Voucher({_contract:TRS, _signer:signers[1]});
// //   const voucher = await TemplateVoucher.createVoucher(Tseries,1,expandTo6Decimals(10),1,1,"TestURI",true,signers[2].address,expandTo6Decimals(0));
// //   const seller =  new SellerVoucher({_contract:singleMarketplace, _signer:signers[1]});
// //   const sellerVoucher = await seller.createVoucher(Tseries,signers[1].address,1,1,expandTo6Decimals(10),1,true,false);
// //   const buyer = await new BuyerVoucher({_contract:singleMarketplace,_signer: signers[6]});
// //   const buyerVoucher = await buyer.createVoucher(Tseries,signers[6].address,1,1,expandTo6Decimals(10),1,true);

// //   //Primary Buy
// //   await usdt.connect(owner).transfer(signers[6].address,expandTo6Decimals(10000));
// //   await usdt.connect(owner).approve(singleMarketplace.address,expandTo6Decimals(1000));
// //   await usdt.connect(signers[6]).approve(singleMarketplace.address,expandTo6Decimals(1000));

// //   await (singleMarketplace.Buy(buyerVoucher,sellerVoucher,voucher,true));
// //   expect(await TRS.balanceOf(signers[6].address)).to.be.eq(1);

// //   //Secondary buy
// //   const TemplateVoucher2= await new template1155Voucher({_contract:TRS, _signer:signers[1]});
// //   const voucher2 = await TemplateVoucher2.createVoucher(Tseries,1,expandTo6Decimals(10),1,1,"TestURI",false,signers[2].address,expandTo6Decimals(0));
// //   const seller2 =  new SellerVoucher({_contract:singleMarketplace, _signer:signers[6]});
// //   const sellerVoucher2 = await seller2.createVoucher(Tseries,signers[6].address,1,1,expandTo6Decimals(10),1,true,false);
// //   const buyer2 = await new BuyerVoucher({_contract:singleMarketplace,_signer: signers[7]});
// //   const buyerVoucher2 = await buyer2.createVoucher(Tseries,signers[5].address,1,1,expandTo6Decimals(10),1,true);

// //   await TRS.connect(signers[6]).approve(singleMarketplace.address,1);

// //   await expect(singleMarketplace.Buy(buyerVoucher2,sellerVoucher2,voucher2,true)).to.be.revertedWith("invalid buyer");
// //   });

// //   // //non-custodial to non-custodial

// //   it("ERROR: Signature of buyer not matching at primary buy(N2N)", async () => {
// //     //create collection
// //     await factory
// //       .connect(owner)
// //       .create721Token(
// //         "T-series",
// //         "TSR",
// //         owner.address,
// //         superOwner.address,
// //         usdt.address
// //       );
// //     const Tseries = await factory
// //       .connect(owner)
// //       .userLastNFTContracts(owner.address,0);
// //     const TRS = await new Template__factory(owner).attach(Tseries);
// //     const addressOfTemplate = Tseries;
// //     //creating vouchers
// //     const lazyMinting = new LazyMinting({ _contract: TRS, _signer: owner });
// //     const voucher = await lazyMinting.createVoucher(
// //       addressOfTemplate,
// //       1,
// //       expandTo6Decimals(10),1,1,
// //       "testURI",true,
// //       signers[3].address,
// //       1
// //     );
// //     const sellerVoucher = new SellerVoucher({
// //       _contract: singleMarketplace,
// //       _signer: owner,
// //     });
// //     const VoucherSell = await sellerVoucher.createVoucher(
// //       Tseries,
// //       owner.address,
// //       1,1,
// //       expandTo6Decimals(10),1,
// //       true,
// //       false
// //     );
// //     const buyerVoucher = new BuyerVoucher({
// //       _contract: singleMarketplace,
// //       _signer: signers[6],
// //     });
// //     const Voucherbuy = await buyerVoucher.createVoucher(
// //       Tseries,
// //       signers[5].address,
// //       1,1,
// //       expandTo6Decimals(10),1,
// //       false
// //     );
// //     //Primary Buy

// //     await usdt
// //       .connect(owner)
// //       .transfer(signers[6].address, expandTo6Decimals(1000));

// //     await usdt
// //       .connect(signers[6])
// //       .approve(singleMarketplace.address, expandTo6Decimals(1000));
// //     await expect(
// //       singleMarketplace.Buy(Voucherbuy, VoucherSell, voucher,true)
// //     ).to.be.revertedWith("invalid buyer");
// //   });

// //   it("ERROR: Signature of seller not matching at secondary buy(N2N)", async () => {
// //     await factory
// //       .connect(owner)
// //       .create721Token(
// //         "T-series",
// //         "TSR",
// //         owner.address,
// //         superOwner.address,
// //         usdt.address
// //       );
// //     const Tseries = await factory
// //       .connect(owner)
// //       .userLastNFTContracts(owner.address,0);
// //     const TRS = await new Template__factory(owner).attach(Tseries);
// //     const addressOfTemplate = Tseries;
// //     //creating vouchers
// //     const lazyMinting = new LazyMinting({ _contract: TRS, _signer: owner });
// //     const voucher = await lazyMinting.createVoucher(
// //       addressOfTemplate,
// //       1,
// //       expandTo6Decimals(3),
// //       "testURI",
// //       signers[3].address,
// //       1
// //     );
// //     const sellerVoucher = new SellerVoucher({
// //       _contract: Marketplace,
// //       _signer: owner,
// //     });
// //     const VoucherSell = await sellerVoucher.createVoucher(
// //       Tseries,
// //       owner.address,
// //       1,
// //       expandTo6Decimals(10),
// //       true,
// //       false
// //     );
// //     const buyerVoucher = new BuyerVoucher({
// //       _contract: Marketplace,
// //       _signer: signers[6],
// //     });
// //     const Voucherbuy = await buyerVoucher.createVoucher(
// //       Tseries,
// //       signers[6].address,
// //       1,
// //       expandTo6Decimals(10),
// //       false
// //     );
// //     //Primary Buy

// //     await usdt
// //       .connect(owner)
// //       .transfer(signers[6].address, expandTo6Decimals(1000));

// //     await usdt
// //       .connect(signers[6])
// //       .approve(Marketplace.address, expandTo6Decimals(1000));

// //     await Marketplace.Buy(Voucherbuy, VoucherSell, voucher);
// //     expect(await TRS.balanceOf(signers[6].address)).to.be.eq(1);
// //     //Secondary Buy
// //     const sellerVoucher2 = new SellerVoucher({
// //       _contract: Marketplace,
// //       _signer: signers[6],
// //     });
// //     const VoucherSell2 = await sellerVoucher2.createVoucher(
// //       Tseries,
// //       signers[5].address,
// //       1,
// //       expandTo6Decimals(10),
// //       true,
// //       false
// //     );
// //     const buyerVoucher2 = new BuyerVoucher({
// //       _contract: Marketplace,
// //       _signer: signers[7],
// //     });
// //     const Voucherbuy2 = await buyerVoucher2.createVoucher(
// //       Tseries,
// //       signers[7].address,
// //       1,
// //       expandTo6Decimals(10),
// //       false
// //     );
// //     await usdt
// //       .connect(owner)
// //       .transfer(signers[7].address, expandTo6Decimals(1000));
// //     await usdt
// //       .connect(signers[7])
// //       .approve(Marketplace.address, expandTo6Decimals(1000));
// //     await TRS.connect(signers[6]).approve(Marketplace.address, 1);

// //     await expect( Marketplace.Buy(Voucherbuy2, VoucherSell2, voucher)).to.be.revertedWith('invalid Seller');
    
// //   });

// //   it("ERROR: Signature of buyer not matching at secondary buy(N2N)", async () => {
// //     await factory
// //       .connect(owner)
// //       .create721Token(
// //         "T-series",
// //         "TSR",
// //         owner.address,
// //         superOwner.address,
// //         usdt.address
// //       );
// //     const Tseries = await factory
// //       .connect(owner)
// //       .userLastNFTContracts(owner.address,0);
// //     const TRS = await new Template__factory(owner).attach(Tseries);
// //     const addressOfTemplate = Tseries;
// //     //creating vouchers
// //     const lazyMinting = new LazyMinting({ _contract: TRS, _signer: owner });
// //     const voucher = await lazyMinting.createVoucher(
// //       addressOfTemplate,
// //       1,
// //       expandTo6Decimals(3),
// //       "testURI",
// //       signers[3].address,
// //       1
// //     );
// //     const sellerVoucher = new SellerVoucher({
// //       _contract: Marketplace,
// //       _signer: owner,
// //     });
// //     const VoucherSell = await sellerVoucher.createVoucher(
// //       Tseries,
// //       owner.address,
// //       1,
// //       expandTo6Decimals(10),
// //       true,
// //       false
// //     );
// //     const buyerVoucher = new BuyerVoucher({
// //       _contract: Marketplace,
// //       _signer: signers[6],
// //     });
// //     const Voucherbuy = await buyerVoucher.createVoucher(
// //       Tseries,
// //       signers[6].address,
// //       1,
// //       expandTo6Decimals(10),
// //       false
// //     );
// //     //Primary Buy

// //     await usdt
// //       .connect(owner)
// //       .transfer(signers[6].address, expandTo6Decimals(1000));

// //     await usdt
// //       .connect(signers[6])
// //       .approve(Marketplace.address, expandTo6Decimals(1000));

// //     await Marketplace.Buy(Voucherbuy, VoucherSell, voucher);
// //     expect(await TRS.balanceOf(signers[6].address)).to.be.eq(1);
// //     //Secondary Buy
// //     const sellerVoucher2 = new SellerVoucher({
// //       _contract: Marketplace,
// //       _signer: signers[6],
// //     });
// //     const VoucherSell2 = await sellerVoucher2.createVoucher(
// //       Tseries,
// //       signers[6].address,
// //       1,
// //       expandTo6Decimals(10),
// //       true,
// //       false
// //     );
// //     const buyerVoucher2 = new BuyerVoucher({
// //       _contract: Marketplace,
// //       _signer: signers[7],
// //     });
// //     const Voucherbuy2 = await buyerVoucher2.createVoucher(
// //       Tseries,
// //       signers[5].address,
// //       1,
// //       expandTo6Decimals(10),
// //       false
// //     );
// //     await usdt
// //       .connect(owner)
// //       .transfer(signers[7].address, expandTo6Decimals(1000));
// //     await usdt
// //       .connect(signers[7])
// //       .approve(Marketplace.address, expandTo6Decimals(1000));
// //     await TRS.connect(signers[6]).approve(Marketplace.address, 1);

// //     await expect( Marketplace.Buy(Voucherbuy2, VoucherSell2, voucher)).to.be.revertedWith('invalid buyer');
    
// //   });
// // });



// // describe("Marketplace1155 secondary buy",async()=>{
 
// //   it("custodial to custodial buy", async () => {
// //     //create collection
// //     await factory
// //       .connect(owner)
// //       .create1155Token(
// //         "T-series",
// //         owner.address,
// //         superOwner.address,
// //         usdt.address
// //       );
// //     const Tseries = await factory
// //       .connect(owner)
// //       .userLastNFTContracts(owner.address,0);
// //     const TRS = await new Template1155__factory(owner).attach(Tseries);
// //     //creating vouchers
// //     const Template1155Voucher = new template1155Voucher({
// //       _contract: TRS,
// //       _signer: owner,
// //     });
// //     const voucher = await Template1155Voucher.createVoucher(
// //       Tseries,
// //       1,
// //       expandTo6Decimals(3),
// //       2,
// //       1,
// //       "testURI",
// //       true,
// //       signers[2].address,
// //       1
// //     );
// //     const sellerVoucher = new SellerVoucher({
// //       _contract: marketplace1155,
// //       _signer: owner,
// //     });
// //     const VoucherSell = await sellerVoucher.createVoucher1155(
// //       Tseries,
// //       owner.address,
// //       1,
// //       2,
// //       expandTo6Decimals(10),
// //       1,
// //       true,
// //       true
// //     );
// //     const buyerVoucher = new BuyerVoucher({
// //       _contract: marketplace1155,
// //       _signer: signers[6],
// //     });
// //     const Voucherbuy = await buyerVoucher.createVoucher1155(
// //       Tseries,
// //       signers[6].address,
// //       1,
// //       2,
// //       expandTo6Decimals(10),
// //       1,
// //       true
// //     );
// //     //Primary Buy
// //     await usdt
// //       .connect(owner)
// //       .transfer(signers[6].address, expandTo6Decimals(1000));
// //     await usdt
// //       .connect(owner)
// //       .approve(marketplace1155.address, expandTo6Decimals(1000));
// //     await marketplace1155.Buy(Voucherbuy, VoucherSell, voucher);
// //     expect(await TRS.balanceOf(signers[6].address, 1)).to.be.eq(2);
// //     //Secondary Buy
// //     const Template1155Voucher2 = new template1155Voucher({
// //       _contract: TRS,
// //       _signer: signers[6],
// //     });
// //     const voucher2 = await Template1155Voucher2.createVoucher(
// //       Tseries,
// //       1,
// //       expandTo6Decimals(3),
// //       2,
// //       2,
// //       "testURI",
// //       false,
// //       signers[2].address,
// //       1
// //     );
// //     const sellerVoucher2 = new SellerVoucher({
// //       _contract: marketplace1155,
// //       _signer: signers[6],
// //     });
// //     const VoucherSell2 = await sellerVoucher2.createVoucher1155(
// //       Tseries,
// //       signers[6].address,
// //       1,
// //       2,
// //       expandTo6Decimals(10),
// //       2,
// //       true,
// //       true
// //     );
// //     const buyerVoucher2 = new BuyerVoucher({
// //       _contract: marketplace1155,
// //       _signer: signers[7],
// //     });
// //     const Voucherbuy2 = await buyerVoucher2.createVoucher1155(
// //       Tseries,
// //       signers[7].address,
// //       1,
// //       2,
// //       expandTo6Decimals(10),
// //       2,
// //       true
// //     );
// //     await usdt
// //       .connect(owner)
// //       .transfer(signers[7].address, expandTo6Decimals(1000));
// //     await usdt
// //       .connect(signers[7])
// //       .approve(marketplace1155.address, expandTo6Decimals(1000));
// //     await TRS.connect(signers[6]).setApprovalForAll(marketplace1155.address,true);
// //     await marketplace1155.Buy(Voucherbuy2, VoucherSell2, voucher2);
// //     expect(await TRS.balanceOf(signers[7].address, 1)).to.be.eq(2);
// //   });

// //   it("ERROR custodial to custodial primary buy:invalid buyer", async () => {
// //     //create collection
// //     await factory
// //       .connect(owner)
// //       .create1155Token(
// //         "T-series",
// //         owner.address,
// //         superOwner.address,
// //         usdt.address
// //       );
// //     const Tseries = await factory
// //       .connect(owner)
// //       .userLastNFTContracts(owner.address,0);
// //     const TRS = await new Template1155__factory(owner).attach(Tseries);
// //     //creating vouchers
// //     const Template1155Voucher = new template1155Voucher({
// //       _contract: TRS,
// //       _signer: owner,
// //     });
// //     const voucher = await Template1155Voucher.createVoucher(
// //       Tseries,
// //       1,
// //       expandTo6Decimals(3),
// //       2,
// //       1,
// //       "testURI",
// //       true,
// //       signers[2].address,
// //       1
// //     );
// //     const sellerVoucher = new SellerVoucher({
// //       _contract: marketplace1155,
// //       _signer: owner,
// //     });
// //     const VoucherSell = await sellerVoucher.createVoucher1155(
// //       Tseries,
// //       owner.address,
// //       1,
// //       2,
// //       expandTo6Decimals(10),
// //       1,
// //       true,
// //       true
// //     );
// //     const buyerVoucher = new BuyerVoucher({
// //       _contract: marketplace1155,
// //       _signer: signers[6],
// //     });
// //     const Voucherbuy = await buyerVoucher.createVoucher1155(
// //       Tseries,
// //       signers[5].address,
// //       1,
// //       2,
// //       expandTo6Decimals(10),
// //       1,
// //       true
// //     );
// //     //Primary Buy
// //     await usdt
// //       .connect(owner)
// //       .transfer(signers[6].address, expandTo6Decimals(1000));
// //     await usdt
// //       .connect(owner)
// //       .approve(marketplace1155.address, expandTo6Decimals(1000));
// //     await expect(marketplace1155.Buy(Voucherbuy, VoucherSell, voucher)).to.be.revertedWith("invalid buyer");
// //     });



// //   it("ERROR custodial to custodial primary buy : buyer and nft mismatched addresses", async () => {
// //     //create collection
// //     await factory
// //       .connect(owner)
// //       .create1155Token(
// //         "T-series",
// //         owner.address,
// //         superOwner.address,
// //         usdt.address
// //       );
// //     const Tseries = await factory
// //       .connect(owner)
// //       .userLastNFTContracts(owner.address,0);
// //     const TRS = await new Template1155__factory(owner).attach(Tseries);
// //     //creating vouchers
// //     const Template1155Voucher = new template1155Voucher({
// //       _contract: TRS,
// //       _signer: owner,
// //     });
// //     const voucher = await Template1155Voucher.createVoucher(
// //       Tseries,
// //       1,
// //       expandTo6Decimals(3),
// //       2,
// //       1,
// //       "testURI",
// //       true,
// //       signers[2].address,
// //       1
// //     );
// //     const sellerVoucher = new SellerVoucher({
// //       _contract: marketplace1155,
// //       _signer: owner,
// //     });
// //     const VoucherSell = await sellerVoucher.createVoucher1155(
// //       Tseries,
// //       owner.address,
// //       1,
// //       2,
// //       expandTo6Decimals(10),
// //       1,
// //       true,
// //       true
// //     );
// //     const buyerVoucher = new BuyerVoucher({
// //       _contract: marketplace1155,
// //       _signer: signers[6],
// //     });
// //     const Voucherbuy = await buyerVoucher.createVoucher1155(
// //       signers[8].address,
// //       signers[6].address,
// //       1,
// //       2,
// //       expandTo6Decimals(10),
// //       1,
// //       true
// //     );
// //     //Primary Buy
// //     await usdt
// //       .connect(owner)
// //       .transfer(signers[6].address, expandTo6Decimals(1000));
// //     await usdt
// //       .connect(owner)
// //       .approve(marketplace1155.address, expandTo6Decimals(1000));
// //     await expect(marketplace1155.Buy(Voucherbuy, VoucherSell, voucher)).to.be.revertedWith("Addresses invalid");
// //     });

// //     it("ERROR custodial to custodial primary buy : invalid price", async () => {
// //       //create collection
// //       await factory
// //         .connect(owner)
// //         .create1155Token(
// //           "T-series",
// //           owner.address,
// //           superOwner.address,
// //           usdt.address
// //         );
// //       const Tseries = await factory
// //         .connect(owner)
// //         .userLastNFTContracts(owner.address,1);
// //       const TRS = await new Template1155__factory(owner).attach(Tseries);
// //       //creating vouchers
// //       const Template1155Voucher = new template1155Voucher({
// //         _contract: TRS,
// //         _signer: owner,
// //       });
// //       const voucher = await Template1155Voucher.createVoucher(
// //         Tseries,
// //         1,
// //         expandTo6Decimals(3),
// //         2,
// //         1,
// //         "testURI",
// //         true,
// //         signers[2].address,
// //         1
// //       );
// //       const sellerVoucher = new SellerVoucher({
// //         _contract: marketplace1155,
// //         _signer: owner,
// //       });
// //       const VoucherSell = await sellerVoucher.createVoucher1155(
// //         Tseries,
// //         owner.address,
// //         1,
// //         2,
// //         expandTo6Decimals(4),
// //         1,
// //         true,
// //         true
// //       );
// //       const buyerVoucher = new BuyerVoucher({
// //         _contract: marketplace1155,
// //         _signer: signers[6],
// //       });
// //       const Voucherbuy = await buyerVoucher.createVoucher1155(
// //         Tseries,
// //         signers[6].address,
// //         1,
// //         2,
// //         expandTo6Decimals(2),
// //         1,
// //         true
// //       );
// //       //Primary Buy
// //       await usdt
// //         .connect(owner)
// //         .transfer(signers[6].address, expandTo6Decimals(1000));
// //       await usdt
// //         .connect(owner)
// //         .approve(marketplace1155.address, expandTo6Decimals(1000));
// //       await expect(marketplace1155.Buy(Voucherbuy, VoucherSell, voucher)).to.be.revertedWith("Prices invalid");
// //       });  
// // //to do
// //       it("ERROR custodial to custodial secondary buy :invalid Seller", async () => {
// //         //create collection
// //         await factory
// //           .connect(owner)
// //           .create1155Token(
// //             "T-series",
// //             owner.address,
// //             superOwner.address,
// //             usdt.address
// //           );
// //         const Tseries = await factory
// //           .connect(owner)
// //           .userLastNFTContracts(owner.address,0);
// //         const TRS = await new Template1155__factory(owner).attach(Tseries);
// //         //creating vouchers
// //         const Template1155Voucher = new template1155Voucher({
// //           _contract: TRS,
// //           _signer: owner,
// //         });
// //         const voucher = await Template1155Voucher.createVoucher(
// //           Tseries,
// //           1,
// //           expandTo6Decimals(3),
// //           2,
// //           1,
// //           "testURI",
// //           true,
// //           signers[2].address,
// //           1
// //         );
// //         const sellerVoucher = new SellerVoucher({
// //           _contract: marketplace1155,
// //           _signer: owner,
// //         });
// //         const VoucherSell = await sellerVoucher.createVoucher1155(
// //           Tseries,
// //           owner.address,
// //           1,
// //           2,
// //           expandTo6Decimals(10),
// //           1,
// //           true,
// //           true
// //         );
// //         const buyerVoucher = new BuyerVoucher({
// //           _contract: marketplace1155,
// //           _signer: signers[6],
// //         });
// //         const Voucherbuy = await buyerVoucher.createVoucher1155(
// //           Tseries,
// //           signers[6].address,
// //           1,
// //           2,
// //           expandTo6Decimals(10),
// //           1,
// //           true
// //         );
// //         //Primary Buy
// //         await usdt
// //           .connect(owner)
// //           .transfer(signers[6].address, expandTo6Decimals(1000));
// //         await usdt
// //           .connect(owner)
// //           .approve(marketplace1155.address, expandTo6Decimals(1000));
// //         await marketplace1155.Buy(Voucherbuy, VoucherSell, voucher);
// //         expect(await TRS.balanceOf(signers[6].address, 1)).to.be.eq(2);
// //         //Secondary Buy
// //         const Template1155Voucher2 = new template1155Voucher({
// //           _contract: TRS,
// //           _signer: signers[6],
// //         });
// //         const voucher2 = await Template1155Voucher2.createVoucher(
// //           Tseries,
// //           1,
// //           expandTo6Decimals(3),
// //           2,
// //           2,
// //           "testURI",
// //           false,
// //           signers[2].address,
// //           1
// //         );
// //         const sellerVoucher2 = new SellerVoucher({
// //           _contract: marketplace1155,
// //           _signer: signers[6],
// //         });
// //         const VoucherSell2 = await sellerVoucher2.createVoucher1155(
// //           Tseries,
// //           signers[3].address,
// //           1,
// //           2,
// //           expandTo6Decimals(10),
// //           2,
// //           true,
// //           true
// //         );
// //         const buyerVoucher2 = new BuyerVoucher({
// //           _contract: marketplace1155,
// //           _signer: signers[7],
// //         });
// //         const Voucherbuy2 = await buyerVoucher2.createVoucher1155(
// //           Tseries,
// //           signers[7].address,
// //           1,
// //           2,
// //           expandTo6Decimals(10),
// //           2,
// //           true
// //         );
// //         await usdt
// //           .connect(owner)
// //           .transfer(signers[7].address, expandTo6Decimals(1000));
// //         await usdt
// //           .connect(signers[7])
// //           .approve(marketplace1155.address, expandTo6Decimals(1000));
// //         await TRS.connect(signers[6]).setApprovalForAll(marketplace1155.address,true);
// //         await expect(marketplace1155.Buy(Voucherbuy2, VoucherSell2, voucher2)).to.be.revertedWith("invalid Seller");
// //       });

// //       it("custodial to custodial secondary buy errror: invalid buyer", async () => {
// //         //create collection
// //         await factory
// //           .connect(owner)
// //           .create1155Token(
// //             "T-series",
// //             owner.address,
// //             superOwner.address,
// //             usdt.address
// //           );
// //         const Tseries = await factory
// //           .connect(owner)
// //           .userLastNFTContracts(owner.address,0);
// //         const TRS = await new Template1155__factory(owner).attach(Tseries);
// //         //creating vouchers
// //         const Template1155Voucher = new template1155Voucher({
// //           _contract: TRS,
// //           _signer: owner,
// //         });
// //         const voucher = await Template1155Voucher.createVoucher(
// //           Tseries,
// //           1,
// //           expandTo6Decimals(3),
// //           2,
// //           1,
// //           "testURI",
// //           true,
// //           signers[2].address,
// //           1
// //         );
// //         const sellerVoucher = new SellerVoucher({
// //           _contract: marketplace1155,
// //           _signer: owner,
// //         });
// //         const VoucherSell = await sellerVoucher.createVoucher1155(
// //           Tseries,
// //           owner.address,
// //           1,
// //           2,
// //           expandTo6Decimals(10),
// //           1,
// //           true,
// //           true
// //         );
// //         const buyerVoucher = new BuyerVoucher({
// //           _contract: marketplace1155,
// //           _signer: signers[6],
// //         });
// //         const Voucherbuy = await buyerVoucher.createVoucher1155(
// //           Tseries,
// //           signers[6].address,
// //           1,
// //           2,
// //           expandTo6Decimals(10),
// //           1,
// //           true
// //         );
// //         //Primary Buy
// //         await usdt
// //           .connect(owner)
// //           .transfer(signers[6].address, expandTo6Decimals(1000));
// //         await usdt
// //           .connect(owner)
// //           .approve(marketplace1155.address, expandTo6Decimals(1000));
// //         await marketplace1155.Buy(Voucherbuy, VoucherSell, voucher);
// //         expect(await TRS.balanceOf(signers[6].address, 1)).to.be.eq(2);
// //         //Secondary Buy
// //         const Template1155Voucher2 = new template1155Voucher({
// //           _contract: TRS,
// //           _signer: signers[6],
// //         });
// //         const voucher2 = await Template1155Voucher2.createVoucher(
// //           Tseries,
// //           1,
// //           expandTo6Decimals(3),
// //           2,
// //           2,
// //           "testURI",
// //           false,
// //           signers[2].address,
// //           1
// //         );
// //         const sellerVoucher2 = new SellerVoucher({
// //           _contract: marketplace1155,
// //           _signer: signers[6],
// //         });
// //         const VoucherSell2 = await sellerVoucher2.createVoucher1155(
// //           Tseries,
// //           signers[6].address,
// //           1,
// //           2,
// //           expandTo6Decimals(10),
// //           2,
// //           true,
// //           true
// //         );
// //         const buyerVoucher2 = new BuyerVoucher({
// //           _contract: marketplace1155,
// //           _signer: signers[7],
// //         });
// //         const Voucherbuy2 = await buyerVoucher2.createVoucher1155(
// //           Tseries,
// //           signers[3].address,
// //           1,
// //           2,
// //           expandTo6Decimals(10),
// //           2,
// //           true
// //         );
// //         await usdt
// //           .connect(owner)
// //           .transfer(signers[7].address, expandTo6Decimals(1000));
// //         await usdt
// //           .connect(signers[7])
// //           .approve(marketplace1155.address, expandTo6Decimals(1000));
// //         await TRS.connect(signers[6]).setApprovalForAll(marketplace1155.address,true);
// //         await expect(marketplace1155.Buy(Voucherbuy2, VoucherSell2, voucher2)).to.be.revertedWith("invalid buyer");
// //       });

// //       // it("custodial to custodial secondary buy error: not enough balance for token", async () => {
// //       //   //create collection
// //       //   await factory
// //       //     .connect(owner)
// //       //     .create1155Token(
// //       //       "T-series",
// //       //       owner.address,
// //       //       superOwner.address,
// //       //       usdt.address
// //       //     );
// //       //   const Tseries = await factory
// //       //     .connect(owner)
// //       //     .userLastNFTContracts(owner.address,0);
// //       //   const TRS = await new Template1155__factory(owner).attach(Tseries);
// //       //   const addressOfTemplate = Tseries;
// //       //   //creating vouchers
// //       //   const Template1155Voucher = new template1155Voucher({
// //       //     _contract: TRS,
// //       //     _signer: owner,
// //       //   });
// //       //   const voucher = await Template1155Voucher.createVoucher(
// //       //     Tseries,
// //       //     1,
// //       //     expandTo6Decimals(3),
// //       //     2,
// //       //     1,
// //       //     "testURI",
// //       //     true,
// //       //     signers[2].address,
// //       //     1
// //       //   );
// //       //   const sellerVoucher = new SellerVoucher({
// //       //     _contract: marketplace1155,
// //       //     _signer: owner,
// //       //   });
// //       //   const VoucherSell = await sellerVoucher.createVoucher1155(
// //       //     Tseries,
// //       //     owner.address,
// //       //     1,
// //       //     2,
// //       //     expandTo6Decimals(10),
// //       //     1,
// //       //     true,
// //       //     true
// //       //   );
// //       //   const buyerVoucher = new BuyerVoucher({
// //       //     _contract: marketplace1155,
// //       //     _signer: signers[6],
// //       //   });
// //       //   const Voucherbuy = await buyerVoucher.createVoucher1155(
// //       //     Tseries,
// //       //     signers[6].address,
// //       //     1,
// //       //     2,
// //       //     expandTo6Decimals(10),
// //       //     1,
// //       //     true
// //       //   );
// //       //   //Primary Buy
// //       //   await usdt
// //       //     .connect(owner)
// //       //     .transfer(signers[6].address, expandTo6Decimals(1000));
// //       //   await usdt
// //       //     .connect(owner)
// //       //     .approve(marketplace1155.address, expandTo6Decimals(1000));
// //       //   await marketplace1155.Buy(Voucherbuy, VoucherSell, voucher);
// //       //   expect(await TRS.balanceOf(signers[6].address, 1)).to.be.eq(2);
// //       //   //Secondary Buy
// //       //   const Template1155Voucher2 = new template1155Voucher({
// //       //     _contract: TRS,
// //       //     _signer: signers[6],
// //       //   });
// //       //   const voucher2 = await Template1155Voucher2.createVoucher(
// //       //     Tseries,
// //       //     1,
// //       //     expandTo6Decimals(3),
// //       //     2,
// //       //     2,
// //       //     "testURI",
// //       //     false,
// //       //     signers[2].address,
// //       //     1
// //       //   );
// //       //   const sellerVoucher2 = new SellerVoucher({
// //       //     _contract: marketplace1155,
// //       //     _signer: signers[6],
// //       //   });
// //       //   const VoucherSell2 = await sellerVoucher2.createVoucher1155(
// //       //     Tseries,
// //       //     signers[6].address,
// //       //     1,
// //       //     2,
// //       //     expandTo6Decimals(10),
// //       //     2,
// //       //     true,
// //       //     true
// //       //   );
// //       //   const buyerVoucher2 = new BuyerVoucher({
// //       //     _contract: marketplace1155,
// //       //     _signer: signers[7],
// //       //   });
// //       //   const Voucherbuy2 = await buyerVoucher2.createVoucher1155(
// //       //     Tseries,
// //       //     signers[7].address,
// //       //     1,
// //       //     2,
// //       //     expandTo6Decimals(10),
// //       //     2,
// //       //     true
// //       //   );
// //       //   await usdt
// //       //     .connect(owner)
// //       //     .transfer(signers[7].address, expandTo6Decimals(1000));
// //       //   await usdt
// //       //     .connect(signers[7])
// //       //     .approve(marketplace1155.address, expandTo6Decimals(1000));
// //       //   await TRS.connect(signers[6]).setApprovalForAll(marketplace1155.address,true);
// //       //   await marketplace1155.Buy(Voucherbuy2, VoucherSell2, voucher2);
// //       // });





// //   it("custodial to noncustodial buy", async () => {
// //     //create collection
// //     await factory
// //       .connect(owner)
// //       .create1155Token(
// //         "T-series",
// //         owner.address,
// //         superOwner.address,
// //         usdt.address
// //       );
// //     const Tseries = await factory
// //       .connect(owner)
// //       .userLastNFTContracts(owner.address,0);
// //     const TRS = await new Template1155__factory(owner).attach(Tseries);
// //     const addressOfTemplate = Tseries;
// //     //creating vouchers
// //     const Template1155Voucher = new template1155Voucher({
// //       _contract: TRS,
// //       _signer: owner,
// //     });
// //     const voucher = await Template1155Voucher.createVoucher(
// //       addressOfTemplate,
// //       1,
// //       expandTo6Decimals(3),
// //       2,
// //       1,
// //       "testURI",
// //       true,
// //       signers[2].address,
// //       1
// //     );
// //     const sellerVoucher = new SellerVoucher({
// //       _contract: marketplace1155,
// //       _signer: owner,
// //     });
// //     const VoucherSell = await sellerVoucher.createVoucher1155(
// //       Tseries,
// //       owner.address,
// //       1,
// //       2,
// //       expandTo6Decimals(10),
// //       1,
// //       true,
// //       true
// //     );
// //     const buyerVoucher = new BuyerVoucher({
// //       _contract: marketplace1155,
// //       _signer: signers[6],
// //     });
// //     const Voucherbuy = await buyerVoucher.createVoucher1155(
// //       Tseries,
// //       signers[6].address,
// //       1,
// //       2,
// //       expandTo6Decimals(10),
// //       1,
// //       false
// //     );
// //     //Primary Buy
// //     await usdt
// //       .connect(owner)
// //       .transfer(signers[6].address, expandTo6Decimals(1000));
// //     await usdt
// //       .connect(signers[6])
// //       .approve(marketplace1155.address, expandTo6Decimals(1000));
// //     await marketplace1155.Buy(Voucherbuy, VoucherSell, voucher);
// //     expect(await TRS.balanceOf(signers[6].address, 1)).to.be.eq(2);
// //     //Secondary Buy
// //     const Template1155Voucher2 = new template1155Voucher({
// //       _contract: TRS,
// //       _signer: signers[6],
// //     });
// //     const voucher2 = await Template1155Voucher2.createVoucher(
// //       addressOfTemplate,
// //       1,
// //       expandTo6Decimals(3),
// //       2,
// //       2,
// //       "testURI",
// //       false,
// //       signers[2].address,
// //       1
// //     );
// //     const sellerVoucher2 = new SellerVoucher({
// //       _contract: marketplace1155,
// //       _signer: signers[6],
// //     });
// //     const VoucherSell2 = await sellerVoucher2.createVoucher1155(
// //       Tseries,
// //       signers[6].address,
// //       1,
// //       2,
// //       expandTo6Decimals(10),
// //       2,
// //       true,
// //       true
// //     );
// //     const buyerVoucher2 = new BuyerVoucher({
// //       _contract: marketplace1155,
// //       _signer: signers[7],
// //     });
// //     const Voucherbuy2 = await buyerVoucher2.createVoucher1155(
// //       Tseries,
// //       signers[7].address,
// //       1,
// //       2,
// //       expandTo6Decimals(10),
// //       2,
// //       false
// //     );
// //     await usdt
// //       .connect(owner)
// //       .transfer(signers[7].address, expandTo6Decimals(1000));
// //     await usdt
// //       .connect(signers[7])
// //       .approve(marketplace1155.address, expandTo6Decimals(1000));
// //     await TRS.connect(signers[6]).setApprovalForAll(marketplace1155.address,true);
// //     await marketplace1155.Buy(Voucherbuy2, VoucherSell2, voucher2);
// //     expect(await TRS.balanceOf(signers[7].address, 1)).to.be.eq(2);
// //   });

// //   it("ERROR: custodial to noncustodial primary buy: invalid buyer", async () => {
// //     //create collection
// //     await factory
// //       .connect(owner)
// //       .create1155Token(
// //         "T-series",
// //         owner.address,
// //         superOwner.address,
// //         usdt.address
// //       );
// //     const Tseries = await factory
// //       .connect(owner)
// //       .userLastNFTContracts(owner.address,0);
// //     const TRS = await new Template1155__factory(owner).attach(Tseries);
// //     const addressOfTemplate = Tseries;
// //     //creating vouchers
// //     const Template1155Voucher = new template1155Voucher({
// //       _contract: TRS,
// //       _signer: owner,
// //     });
// //     const voucher = await Template1155Voucher.createVoucher(
// //       addressOfTemplate,
// //       1,
// //       expandTo6Decimals(3),
// //       2,
// //       1,
// //       "testURI",
// //       true,
// //       signers[2].address,
// //       1
// //     );
// //     const sellerVoucher = new SellerVoucher({
// //       _contract: marketplace1155,
// //       _signer: owner,
// //     });
// //     const VoucherSell = await sellerVoucher.createVoucher1155(
// //       Tseries,
// //       owner.address,
// //       1,
// //       2,
// //       expandTo6Decimals(10),
// //       1,
// //       true,
// //       true
// //     );
// //     const buyerVoucher = new BuyerVoucher({
// //       _contract: marketplace1155,
// //       _signer: signers[6],
// //     });
// //     const Voucherbuy = await buyerVoucher.createVoucher1155(
// //       Tseries,
// //       signers[5].address,
// //       1,
// //       2,
// //       expandTo6Decimals(10),
// //       1,
// //       false
// //     );
// //     //Primary Buy
// //     await usdt
// //       .connect(owner)
// //       .transfer(signers[6].address, expandTo6Decimals(1000));
// //     await usdt
// //       .connect(signers[6])
// //       .approve(marketplace1155.address, expandTo6Decimals(1000));
// //       await expect (marketplace1155.Buy(Voucherbuy, VoucherSell, voucher)).to.be.revertedWith("invalid buyer");
// //     });

// //   it.only("ERROR custodial to noncustodial primary buy:  mismatched addresses", async () => {
// //     //create collection
// //     await factory
// //       .connect(owner)
// //       .create1155Token(
// //         "T-series",
// //         owner.address,
// //         superOwner.address,
// //         usdt.address
// //       );
// //     const Tseries = await factory
// //       .connect(owner)
// //       .userLastNFTContracts(owner.address,0);
// //     const TRS = await new Template1155__factory(owner).attach(Tseries);
// //     //creating vouchers
// //     const Template1155Voucher = new template1155Voucher({
// //       _contract: TRS,
// //       _signer: owner,
// //     });
// //     const voucher = await Template1155Voucher.createVoucher(
// //       signers[2].address,
// //       1,
// //       expandTo6Decimals(3),
// //       2,
// //       1,
// //       "testURI",
// //       true,
// //       signers[2].address,
// //       1
// //     );
// //     const sellerVoucher = new SellerVoucher({
// //       _contract: marketplace1155,
// //       _signer: owner,
// //     });
// //     const VoucherSell = await sellerVoucher.createVoucher1155(
// //       Tseries,
// //       owner.address,
// //       1,
// //       2,
// //       expandTo6Decimals(10),
// //       1,
// //       true,
// //       true
// //     );
// //     const buyerVoucher = new BuyerVoucher({
// //       _contract: marketplace1155,
// //       _signer: signers[6],
// //     });
// //     const Voucherbuy = await buyerVoucher.createVoucher1155(
// //       Tseries,
// //       signers[6].address,
// //       1,
// //       2,
// //       expandTo6Decimals(10),
// //       1,
// //       false
// //     );
// //     //Primary Buy
// //     await usdt
// //       .connect(owner)
// //       .transfer(signers[6].address, expandTo6Decimals(1000));
// //     await usdt
// //       .connect(signers[6])
// //       .approve(marketplace1155.address, expandTo6Decimals(1000));
// //     await expect (marketplace1155.Buy(Voucherbuy, VoucherSell, voucher)).to.be.revertedWith("");
// //   });

// //   it("ERROR custodial to noncustodial primary buy: invalid price", async () => {
// //     //create collection
// //     await factory
// //       .connect(owner)
// //       .create1155Token(
// //         "T-series",
// //         owner.address,
// //         superOwner.address,
// //         usdt.address
// //       );
// //     const Tseries = await factory
// //       .connect(owner)
// //       .userLastNFTContracts(owner.address,0);
// //     const TRS = await new Template1155__factory(owner).attach(Tseries);
// //     const addressOfTemplate = Tseries;
// //     //creating vouchers
// //     const Template1155Voucher = new template1155Voucher({
// //       _contract: TRS,
// //       _signer: owner,
// //     });
// //     const voucher = await Template1155Voucher.createVoucher(
// //       addressOfTemplate,
// //       1,
// //       expandTo6Decimals(4),
// //       2,
// //       1,
// //       "testURI",
// //       true,
// //       signers[2].address,
// //       1
// //     );
// //     const sellerVoucher = new SellerVoucher({
// //       _contract: marketplace1155,
// //       _signer: owner,
// //     });
// //     const VoucherSell = await sellerVoucher.createVoucher1155(
// //       Tseries,
// //       owner.address,
// //       1,
// //       2,
// //       expandTo6Decimals(3),
// //       1,
// //       true,
// //       true
// //     );
// //     const buyerVoucher = new BuyerVoucher({
// //       _contract: marketplace1155,
// //       _signer: signers[6],
// //     });
// //     const Voucherbuy = await buyerVoucher.createVoucher1155(
// //       Tseries,
// //       signers[6].address,
// //       1,
// //       2,
// //       expandTo6Decimals(3),
// //       1,
// //       false
// //     );
// //     //Primary Buy
// //     await usdt
// //       .connect(owner)
// //       .transfer(signers[6].address, expandTo6Decimals(1000));
// //     await usdt
// //       .connect(signers[6])
// //       .approve(marketplace1155.address, expandTo6Decimals(1000));
// //     await expect(marketplace1155.Buy(Voucherbuy, VoucherSell, voucher)).to.be.revertedWith("invalid price");
// //   });

// //   it("ERROR custodial to noncustodial secondary buy: invalid Seller", async () => {
// //     //create collection
// //     await factory
// //       .connect(owner)
// //       .create1155Token(
// //         "T-series",
// //         owner.address,
// //         superOwner.address,
// //         usdt.address
// //       );
// //     const Tseries = await factory
// //       .connect(owner)
// //       .userLastNFTContracts(owner.address,0);
// //     const TRS = await new Template1155__factory(owner).attach(Tseries);
// //     const addressOfTemplate = Tseries;
// //     //creating vouchers
// //     const Template1155Voucher = new template1155Voucher({
// //       _contract: TRS,
// //       _signer: owner,
// //     });
// //     const voucher = await Template1155Voucher.createVoucher(
// //       addressOfTemplate,
// //       1,
// //       expandTo6Decimals(3),
// //       2,
// //       1,
// //       "testURI",
// //       true,
// //       signers[2].address,
// //       1
// //     );
// //     const sellerVoucher = new SellerVoucher({
// //       _contract: marketplace1155,
// //       _signer: owner,
// //     });
// //     const VoucherSell = await sellerVoucher.createVoucher1155(
// //       Tseries,
// //       owner.address,
// //       1,
// //       2,
// //       expandTo6Decimals(10),
// //       1,
// //       true,
// //       true
// //     );
// //     const buyerVoucher = new BuyerVoucher({
// //       _contract: marketplace1155,
// //       _signer: signers[6],
// //     });
// //     const Voucherbuy = await buyerVoucher.createVoucher1155(
// //       Tseries,
// //       signers[6].address,
// //       1,
// //       2,
// //       expandTo6Decimals(10),
// //       1,
// //       false
// //     );
// //     //Primary Buy
// //     await usdt
// //       .connect(owner)
// //       .transfer(signers[6].address, expandTo6Decimals(1000));
// //     await usdt
// //       .connect(signers[6])
// //       .approve(marketplace1155.address, expandTo6Decimals(1000));
// //     await marketplace1155.Buy(Voucherbuy, VoucherSell, voucher);
// //     expect(await TRS.balanceOf(signers[6].address, 1)).to.be.eq(2);
// //     //Secondary Buy
// //     const Template1155Voucher2 = new template1155Voucher({
// //       _contract: TRS,
// //       _signer: signers[6],
// //     });
// //     const voucher2 = await Template1155Voucher2.createVoucher(
// //       addressOfTemplate,
// //       1,
// //       expandTo6Decimals(3),
// //       2,
// //       2,
// //       "testURI",
// //       false,
// //       signers[2].address,
// //       1
// //     );
// //     const sellerVoucher2 = new SellerVoucher({
// //       _contract: marketplace1155,
// //       _signer: signers[6],
// //     });
// //     const VoucherSell2 = await sellerVoucher2.createVoucher1155(
// //       Tseries,
// //       signers[3].address,
// //       1,
// //       2,
// //       expandTo6Decimals(10),
// //       2,
// //       true,
// //       true
// //     );
// //     const buyerVoucher2 = new BuyerVoucher({
// //       _contract: marketplace1155,
// //       _signer: signers[7],
// //     });
// //     const Voucherbuy2 = await buyerVoucher2.createVoucher1155(
// //       Tseries,
// //       signers[7].address,
// //       1,
// //       2,
// //       expandTo6Decimals(10),
// //       2,
// //       false
// //     );
// //     await usdt
// //       .connect(owner)
// //       .transfer(signers[7].address, expandTo6Decimals(1000));
// //     await usdt
// //       .connect(signers[7])
// //       .approve(marketplace1155.address, expandTo6Decimals(1000));
// //     await TRS.connect(signers[6]).setApprovalForAll(marketplace1155.address,true);
// //     await expect(marketplace1155.Buy(Voucherbuy2, VoucherSell2, voucher2)).to.be.revertedWith("invalid Seller");
// //   });

// //   it("ERROR custodial to noncustodial secondary buy: invalid buyer", async () => {
// //     //create collection
// //     await factory
// //       .connect(owner)
// //       .create1155Token(
// //         "T-series",
// //         owner.address,
// //         superOwner.address,
// //         usdt.address
// //       );
// //     const Tseries = await factory
// //       .connect(owner)
// //       .userLastNFTContracts(owner.address,0);
// //     const TRS = await new Template1155__factory(owner).attach(Tseries);
// //     const addressOfTemplate = Tseries;
// //     //creating vouchers
// //     const Template1155Voucher = new template1155Voucher({
// //       _contract: TRS,
// //       _signer: owner,
// //     });
// //     const voucher = await Template1155Voucher.createVoucher(
// //       addressOfTemplate,
// //       1,
// //       expandTo6Decimals(3),
// //       2,
// //       1,
// //       "testURI",
// //       true,
// //       signers[2].address,
// //       1
// //     );
// //     const sellerVoucher = new SellerVoucher({
// //       _contract: marketplace1155,
// //       _signer: owner,
// //     });
// //     const VoucherSell = await sellerVoucher.createVoucher1155(
// //       Tseries,
// //       owner.address,
// //       1,
// //       2,
// //       expandTo6Decimals(10),
// //       1,
// //       true,
// //       true
// //     );
// //     const buyerVoucher = new BuyerVoucher({
// //       _contract: marketplace1155,
// //       _signer: signers[6],
// //     });
// //     const Voucherbuy = await buyerVoucher.createVoucher1155(
// //       Tseries,
// //       signers[6].address,
// //       1,
// //       2,
// //       expandTo6Decimals(10),
// //       1,
// //       false
// //     );
// //     //Primary Buy
// //     await usdt
// //       .connect(owner)
// //       .transfer(signers[6].address, expandTo6Decimals(1000));
// //     await usdt
// //       .connect(signers[6])
// //       .approve(marketplace1155.address, expandTo6Decimals(1000));
// //     await marketplace1155.Buy(Voucherbuy, VoucherSell, voucher);
// //     expect(await TRS.balanceOf(signers[6].address, 1)).to.be.eq(2);
// //     //Secondary Buy
// //     const Template1155Voucher2 = new template1155Voucher({
// //       _contract: TRS,
// //       _signer: signers[6],
// //     });
// //     const voucher2 = await Template1155Voucher2.createVoucher(
// //       addressOfTemplate,
// //       1,
// //       expandTo6Decimals(3),
// //       2,
// //       2,
// //       "testURI",
// //       false,
// //       signers[2].address,
// //       1
// //     );
// //     const sellerVoucher2 = new SellerVoucher({
// //       _contract: marketplace1155,
// //       _signer: signers[6],
// //     });
// //     const VoucherSell2 = await sellerVoucher2.createVoucher1155(
// //       Tseries,
// //       signers[6].address,
// //       1,
// //       2,
// //       expandTo6Decimals(10),
// //       2,
// //       true,
// //       true
// //     );
// //     const buyerVoucher2 = new BuyerVoucher({
// //       _contract: marketplace1155,
// //       _signer: signers[7],
// //     });
// //     const Voucherbuy2 = await buyerVoucher2.createVoucher1155(
// //       Tseries,
// //       signers[3].address,
// //       1,
// //       2,
// //       expandTo6Decimals(10),
// //       2,
// //       false
// //     );
// //     await usdt
// //       .connect(owner)
// //       .transfer(signers[7].address, expandTo6Decimals(1000));
// //     await usdt
// //       .connect(signers[7])
// //       .approve(marketplace1155.address, expandTo6Decimals(1000));
// //     await TRS.connect(signers[6]).setApprovalForAll(marketplace1155.address,true);
// //     await expect(marketplace1155.Buy(Voucherbuy2, VoucherSell2, voucher2)).to.be.revertedWith("invalid buyer");
// //   });

// //   it("non custodial to custodial buy", async () => {
// //     //create collection
// //     await factory
// //       .connect(owner)
// //       .create1155Token(
// //         "T-series",
// //         owner.address,
// //         superOwner.address,
// //         usdt.address
// //       );
// //     const Tseries = await factory
// //       .connect(owner)
// //       .userLastNFTContracts(owner.address,0);
// //     const TRS = await new Template1155__factory(owner).attach(Tseries);
// //     const addressOfTemplate = Tseries;
// //     //creating vouchers
// //     const Template1155Voucher = new template1155Voucher({
// //       _contract: TRS,
// //       _signer: owner,
// //     });
// //     const voucher = await Template1155Voucher.createVoucher(
// //       addressOfTemplate,
// //       1,
// //       expandTo6Decimals(3),
// //       2,
// //       1,
// //       "testURI",
// //       true,
// //       signers[2].address,
// //       1
// //     );
// //     const sellerVoucher = new SellerVoucher({
// //       _contract: marketplace1155,
// //       _signer: owner,
// //     });
// //     const VoucherSell = await sellerVoucher.createVoucher1155(
// //       Tseries,
// //       owner.address,
// //       1,
// //       2,
// //       expandTo6Decimals(10),
// //       1,
// //       true,
// //       false
// //     );
// //     const buyerVoucher = new BuyerVoucher({
// //       _contract: marketplace1155,
// //       _signer: signers[6],
// //     });
// //     const Voucherbuy = await buyerVoucher.createVoucher1155(
// //       Tseries,
// //       signers[6].address,
// //       1,
// //       2,
// //       expandTo6Decimals(10),
// //       1,
// //       true
// //     );
// //     //Primary Buy

// //     await usdt
// //       .connect(owner)
// //       .transfer(signers[6].address, expandTo6Decimals(1000));
// //     await usdt
// //       .connect(owner)
// //       .approve(marketplace1155.address, expandTo6Decimals(1000));
// //     await marketplace1155.Buy(Voucherbuy, VoucherSell, voucher);
// //     expect(await TRS.balanceOf(signers[6].address, 1)).to.be.eq(2);
// //     //Secondary Buy
// //     const Template1155Voucher2 = new template1155Voucher({
// //       _contract: TRS,
// //       _signer: signers[6],
// //     });
// //     const voucher2 = await Template1155Voucher2.createVoucher(
// //       addressOfTemplate,
// //       1,
// //       expandTo6Decimals(3),
// //       2,
// //       2,
// //       "testURI",
// //       false,
// //       signers[2].address,
// //       1
// //     );
// //     const sellerVoucher2 = new SellerVoucher({
// //       _contract: marketplace1155,
// //       _signer: signers[6],
// //     });
// //     const VoucherSell2 = await sellerVoucher2.createVoucher1155(
// //       Tseries,
// //       signers[6].address,
// //       1,
// //       2,
// //       expandTo6Decimals(10),
// //       2,
// //       true,
// //       false
// //     );
// //     const buyerVoucher2 = new BuyerVoucher({
// //       _contract: marketplace1155,
// //       _signer: signers[7],
// //     });
// //     const Voucherbuy2 = await buyerVoucher2.createVoucher1155(
// //       Tseries,
// //       signers[7].address,
// //       1,
// //       2,
// //       expandTo6Decimals(10),
// //       2,
// //       true
// //     );
// //     await usdt
// //       .connect(owner)
// //       .transfer(signers[7].address, expandTo6Decimals(1000));
// //     await usdt
// //       .connect(signers[7])
// //       .approve(marketplace1155.address, expandTo6Decimals(1000));
// //     await TRS.connect(signers[6]).setApprovalForAll(marketplace1155.address,true);  
// //     await marketplace1155.Buy(Voucherbuy2, VoucherSell2, voucher2);
// //     expect(await TRS.balanceOf(signers[7].address, 1)).to.be.eq(2);
// //   });

// //   it("ERROR non custodial to custodial primary buy: invalid buyer", async () => {
// //     //create collection
// //     await factory
// //       .connect(owner)
// //       .create1155Token(
// //         "T-series",
// //         owner.address,
// //         superOwner.address,
// //         usdt.address
// //       );
// //     const Tseries = await factory
// //       .connect(owner)
// //       .userLastNFTContracts(owner.address,0);
// //     const TRS = await new Template1155__factory(owner).attach(Tseries);
// //     const addressOfTemplate = Tseries;
// //     //creating vouchers
// //     const Template1155Voucher = new template1155Voucher({
// //       _contract: TRS,
// //       _signer: owner,
// //     });
// //     const voucher = await Template1155Voucher.createVoucher(
// //       addressOfTemplate,
// //       1,
// //       expandTo6Decimals(3),
// //       2,
// //       1,
// //       "testURI",
// //       true,
// //       signers[2].address,
// //       1
// //     );
// //     const sellerVoucher = new SellerVoucher({
// //       _contract: marketplace1155,
// //       _signer: owner,
// //     });
// //     const VoucherSell = await sellerVoucher.createVoucher1155(
// //       Tseries,
// //       owner.address,
// //       1,
// //       2,
// //       expandTo6Decimals(10),
// //       1,
// //       true,
// //       false
// //     );
// //     const buyerVoucher = new BuyerVoucher({
// //       _contract: marketplace1155,
// //       _signer: signers[6],
// //     });
// //     const Voucherbuy = await buyerVoucher.createVoucher1155(
// //       Tseries,
// //       signers[3].address,
// //       1,
// //       2,
// //       expandTo6Decimals(10),
// //       1,
// //       true
// //     );
// //     //Primary Buy

// //     await usdt
// //       .connect(owner)
// //       .transfer(signers[6].address, expandTo6Decimals(1000));
// //     await usdt
// //       .connect(owner)
// //       .approve(marketplace1155.address, expandTo6Decimals(1000));
// //     await expect(marketplace1155.Buy(Voucherbuy, VoucherSell, voucher)).to.be.revertedWith("invalid buyer");
// //   });

// //   it("non custodial to custodial primary buy: mismatched addresses", async () => {
// //     //create collection
// //     await factory
// //       .connect(owner)
// //       .create1155Token(
// //         "T-series",
// //         owner.address,
// //         superOwner.address,
// //         usdt.address
// //       );
// //     const Tseries = await factory
// //       .connect(owner)
// //       .userLastNFTContracts(owner.address,0);
// //     const TRS = await new Template1155__factory(owner).attach(Tseries);
// //     //creating vouchers
// //     const Template1155Voucher = new template1155Voucher({
// //       _contract: TRS,
// //       _signer: owner,
// //     });
// //     const voucher = await Template1155Voucher.createVoucher(
// //       signers[2].address,
// //       1,
// //       expandTo6Decimals(3),
// //       2,
// //       1,
// //       "testURI",
// //       true,
// //       signers[2].address,
// //       1
// //     );
// //     const sellerVoucher = new SellerVoucher({
// //       _contract: marketplace1155,
// //       _signer: owner,
// //     });
// //     const VoucherSell = await sellerVoucher.createVoucher1155(
// //       Tseries,
// //       owner.address,
// //       1,
// //       2,
// //       expandTo6Decimals(10),
// //       1,
// //       true,
// //       false
// //     );
// //     const buyerVoucher = new BuyerVoucher({
// //       _contract: marketplace1155,
// //       _signer: signers[6],
// //     });
// //     const Voucherbuy = await buyerVoucher.createVoucher1155(
// //       Tseries,
// //       signers[6].address,
// //       1,
// //       2,
// //       expandTo6Decimals(10),
// //       1,
// //       true
// //     );
// //     //Primary Buy

// //     await usdt
// //       .connect(owner)
// //       .transfer(signers[6].address, expandTo6Decimals(1000));
// //     await usdt
// //       .connect(owner)
// //       .approve(marketplace1155.address, expandTo6Decimals(1000));
// //     await expect(marketplace1155.Buy(Voucherbuy, VoucherSell, voucher)).to.be.revertedWith("");
// //   });

// //   it("non custodial to custodial primary buy: invalid price", async () => {
// //     //create collection
// //     await factory
// //       .connect(owner)
// //       .create1155Token(
// //         "T-series",
// //         owner.address,
// //         superOwner.address,
// //         usdt.address
// //       );
// //     const Tseries = await factory
// //       .connect(owner)
// //       .userLastNFTContracts(owner.address,0);
// //     const TRS = await new Template1155__factory(owner).attach(Tseries);
// //     const addressOfTemplate = Tseries;
// //     //creating vouchers
// //     const Template1155Voucher = new template1155Voucher({
// //       _contract: TRS,
// //       _signer: owner,
// //     });
// //     const voucher = await Template1155Voucher.createVoucher(
// //       addressOfTemplate,
// //       1,
// //       expandTo6Decimals(11),
// //       2,
// //       1,
// //       "testURI",
// //       true,
// //       signers[2].address,
// //       1
// //     );
// //     const sellerVoucher = new SellerVoucher({
// //       _contract: marketplace1155,
// //       _signer: owner,
// //     });
// //     const VoucherSell = await sellerVoucher.createVoucher1155(
// //       Tseries,
// //       owner.address,
// //       1,
// //       2,
// //       expandTo6Decimals(10),
// //       1,
// //       true,
// //       false
// //     );
// //     const buyerVoucher = new BuyerVoucher({
// //       _contract: marketplace1155,
// //       _signer: signers[6],
// //     });
// //     const Voucherbuy = await buyerVoucher.createVoucher1155(
// //       Tseries,
// //       signers[6].address,
// //       1,
// //       2,
// //       expandTo6Decimals(10),
// //       1,
// //       true
// //     );
// //     //Primary Buy

// //     await usdt
// //       .connect(owner)
// //       .transfer(signers[6].address, expandTo6Decimals(1000));
// //     await usdt
// //       .connect(owner)
// //       .approve(marketplace1155.address, expandTo6Decimals(1000));
// //     await expect(marketplace1155.Buy(Voucherbuy, VoucherSell, voucher)).to.be.revertedWith("invalid price");
// //   });

// //   it("ERROR non custodial to custodial secondary buy: invalid Seller", async () => {
// //     //create collection
// //     await factory
// //       .connect(owner)
// //       .create1155Token(
// //         "T-series",
// //         owner.address,
// //         superOwner.address,
// //         usdt.address
// //       );
// //     const Tseries = await factory
// //       .connect(owner)
// //       .userLastNFTContracts(owner.address,0);
// //     const TRS = await new Template1155__factory(owner).attach(Tseries);
// //     const addressOfTemplate = Tseries;
// //     //creating vouchers
// //     const Template1155Voucher = new template1155Voucher({
// //       _contract: TRS,
// //       _signer: owner,
// //     });
// //     const voucher = await Template1155Voucher.createVoucher(
// //       addressOfTemplate,
// //       1,
// //       expandTo6Decimals(3),
// //       2,
// //       1,
// //       "testURI",
// //       true,
// //       signers[2].address,
// //       1
// //     );
// //     const sellerVoucher = new SellerVoucher({
// //       _contract: marketplace1155,
// //       _signer: owner,
// //     });
// //     const VoucherSell = await sellerVoucher.createVoucher1155(
// //       Tseries,
// //       owner.address,
// //       1,
// //       2,
// //       expandTo6Decimals(10),
// //       1,
// //       true,
// //       false
// //     );
// //     const buyerVoucher = new BuyerVoucher({
// //       _contract: marketplace1155,
// //       _signer: signers[6],
// //     });
// //     const Voucherbuy = await buyerVoucher.createVoucher1155(
// //       Tseries,
// //       signers[6].address,
// //       1,
// //       2,
// //       expandTo6Decimals(10),
// //       1,
// //       true
// //     );
// //     //Primary Buy

// //     await usdt
// //       .connect(owner)
// //       .transfer(signers[6].address, expandTo6Decimals(1000));
// //     await usdt
// //       .connect(owner)
// //       .approve(marketplace1155.address, expandTo6Decimals(1000));
// //     await marketplace1155.Buy(Voucherbuy, VoucherSell, voucher);
// //     expect(await TRS.balanceOf(signers[6].address, 1)).to.be.eq(2);
// //     //Secondary Buy
// //     const Template1155Voucher2 = new template1155Voucher({
// //       _contract: TRS,
// //       _signer: signers[6],
// //     });
// //     const voucher2 = await Template1155Voucher2.createVoucher(
// //       addressOfTemplate,
// //       1,
// //       expandTo6Decimals(3),
// //       2,
// //       2,
// //       "testURI",
// //       false,
// //       signers[2].address,
// //       1
// //     );
// //     const sellerVoucher2 = new SellerVoucher({
// //       _contract: marketplace1155,
// //       _signer: signers[6],
// //     });
// //     const VoucherSell2 = await sellerVoucher2.createVoucher1155(
// //       Tseries,
// //       signers[4].address,
// //       1,
// //       2,
// //       expandTo6Decimals(10),
// //       2,
// //       true,
// //       false
// //     );
// //     const buyerVoucher2 = new BuyerVoucher({
// //       _contract: marketplace1155,
// //       _signer: signers[7],
// //     });
// //     const Voucherbuy2 = await buyerVoucher2.createVoucher1155(
// //       Tseries,
// //       signers[7].address,
// //       1,
// //       2,
// //       expandTo6Decimals(10),
// //       2,
// //       true
// //     );
// //     await usdt
// //       .connect(owner)
// //       .transfer(signers[7].address, expandTo6Decimals(1000));
// //     await usdt
// //       .connect(signers[7])
// //       .approve(marketplace1155.address, expandTo6Decimals(1000));
// //     await TRS.connect(signers[6]).setApprovalForAll(marketplace1155.address,true);  
// //     await expect(marketplace1155.Buy(Voucherbuy2, VoucherSell2, voucher2)).to.be.revertedWith("invalid Seller");
// //   });

// //   it("ERROR non custodial to custodial secondary buy: invalid buyer", async () => {
// //     //create collection
// //     await factory
// //       .connect(owner)
// //       .create1155Token(
// //         "T-series",
// //         owner.address,
// //         superOwner.address,
// //         usdt.address
// //       );
// //     const Tseries = await factory
// //       .connect(owner)
// //       .userLastNFTContracts(owner.address,0);
// //     const TRS = await new Template1155__factory(owner).attach(Tseries);
// //     const addressOfTemplate = Tseries;
// //     //creating vouchers
// //     const Template1155Voucher = new template1155Voucher({
// //       _contract: TRS,
// //       _signer: owner,
// //     });
// //     const voucher = await Template1155Voucher.createVoucher(
// //       addressOfTemplate,
// //       1,
// //       expandTo6Decimals(3),
// //       2,
// //       1,
// //       "testURI",
// //       true,
// //       signers[2].address,
// //       1
// //     );
// //     const sellerVoucher = new SellerVoucher({
// //       _contract: marketplace1155,
// //       _signer: owner,
// //     });
// //     const VoucherSell = await sellerVoucher.createVoucher1155(
// //       Tseries,
// //       owner.address,
// //       1,
// //       2,
// //       expandTo6Decimals(10),
// //       1,
// //       true,
// //       false
// //     );
// //     const buyerVoucher = new BuyerVoucher({
// //       _contract: marketplace1155,
// //       _signer: signers[6],
// //     });
// //     const Voucherbuy = await buyerVoucher.createVoucher1155(
// //       Tseries,
// //       signers[6].address,
// //       1,
// //       2,
// //       expandTo6Decimals(10),
// //       1,
// //       true
// //     );
// //     //Primary Buy

// //     await usdt
// //       .connect(owner)
// //       .transfer(signers[6].address, expandTo6Decimals(1000));
// //     await usdt
// //       .connect(owner)
// //       .approve(marketplace1155.address, expandTo6Decimals(1000));
// //     await marketplace1155.Buy(Voucherbuy, VoucherSell, voucher);
// //     expect(await TRS.balanceOf(signers[6].address, 1)).to.be.eq(2);
// //     //Secondary Buy
// //     const Template1155Voucher2 = new template1155Voucher({
// //       _contract: TRS,
// //       _signer: signers[6],
// //     });
// //     const voucher2 = await Template1155Voucher2.createVoucher(
// //       addressOfTemplate,
// //       1,
// //       expandTo6Decimals(3),
// //       2,
// //       2,
// //       "testURI",
// //       false,
// //       signers[2].address,
// //       1
// //     );
// //     const sellerVoucher2 = new SellerVoucher({
// //       _contract: marketplace1155,
// //       _signer: signers[6],
// //     });
// //     const VoucherSell2 = await sellerVoucher2.createVoucher1155(
// //       Tseries,
// //       signers[6].address,
// //       1,
// //       2,
// //       expandTo6Decimals(10),
// //       2,
// //       true,
// //       false
// //     );
// //     const buyerVoucher2 = new BuyerVoucher({
// //       _contract: marketplace1155,
// //       _signer: signers[7],
// //     });
// //     const Voucherbuy2 = await buyerVoucher2.createVoucher1155(
// //       Tseries,
// //       signers[2].address,
// //       1,
// //       2,
// //       expandTo6Decimals(10),
// //       2,
// //       true
// //     );
// //     await usdt
// //       .connect(owner)
// //       .transfer(signers[7].address, expandTo6Decimals(1000));
// //     await usdt
// //       .connect(signers[7])
// //       .approve(marketplace1155.address, expandTo6Decimals(1000));
// //     await TRS.connect(signers[6]).setApprovalForAll(marketplace1155.address,true);  
// //     await expect(marketplace1155.Buy(Voucherbuy2, VoucherSell2, voucher2)).to.be.revertedWith("invalid buyer");
// //   });

// //   it("non custodial to non custodial buy", async () => {
// //     await factory
// //       .connect(owner)
// //       .create1155Token(
// //         "T-series",
// //         owner.address,
// //         superOwner.address,
// //         usdt.address
// //       );
// //     const Tseries = await factory
// //       .connect(owner)
// //       .userLastNFTContracts(owner.address,0);
// //     const TRS = await new Template1155__factory(owner).attach(Tseries);
// //     const addressOfTemplate = Tseries;
// //     //creating vouchers
// //     const Template1155Voucher = new template1155Voucher({
// //       _contract: TRS,
// //       _signer: owner,
// //     });
// //     const voucher = await Template1155Voucher.createVoucher(
// //       addressOfTemplate,
// //       1,
// //       expandTo6Decimals(3),
// //       2,
// //       1,
// //       "testURI",
// //       true,
// //       signers[2].address,
// //       1
// //     );
// //     const sellerVoucher = new SellerVoucher({
// //       _contract: marketplace1155,
// //       _signer: owner,
// //     });
// //     const VoucherSell = await sellerVoucher.createVoucher1155(
// //       Tseries,
// //       owner.address,
// //       1,
// //       2,
// //       expandTo6Decimals(10),
// //       1,
// //       true,
// //       false
// //     );
// //     const buyerVoucher = new BuyerVoucher({
// //       _contract: marketplace1155,
// //       _signer: signers[6],
// //     });
// //     const Voucherbuy = await buyerVoucher.createVoucher1155(
// //       Tseries,
// //       signers[6].address,
// //       1,
// //       2,
// //       expandTo6Decimals(10),
// //       1,
// //       false
// //     );
// //     //Primary Buy

// //     await usdt
// //       .connect(owner)
// //       .transfer(signers[6].address, expandTo6Decimals(1000));
// //     await usdt
// //       .connect(signers[6])
// //       .approve(marketplace1155.address, expandTo6Decimals(1000));
// //     await marketplace1155.Buy(Voucherbuy, VoucherSell, voucher);
// //     expect(await TRS.balanceOf(signers[6].address, 1)).to.be.eq(2);
// //     //Secondary Buy
// //     const Template1155Voucher2 = new template1155Voucher({
// //       _contract: TRS,
// //       _signer: signers[6],
// //     });
// //     const voucher2 = await Template1155Voucher2.createVoucher(
// //       addressOfTemplate,
// //       1,
// //       expandTo6Decimals(3),
// //       2,
// //       2,
// //       "testURI",
// //       false,
// //       signers[2].address,
// //       1
// //     );
// //     const sellerVoucher2 = new SellerVoucher({
// //       _contract: marketplace1155,
// //       _signer: signers[6],
// //     });
// //     const VoucherSell2 = await sellerVoucher2.createVoucher1155(
// //       Tseries,
// //       signers[6].address,
// //       1,
// //       2,
// //       expandTo6Decimals(10),
// //       2,
// //       true,
// //       false
// //     );
// //     const buyerVoucher2 = new BuyerVoucher({
// //       _contract: marketplace1155,
// //       _signer: signers[7],
// //     });
// //     const Voucherbuy2 = await buyerVoucher2.createVoucher1155(
// //       Tseries,
// //       signers[7].address,
// //       1,
// //       2,
// //       expandTo6Decimals(10),
// //       2,
// //       false
// //     );
// //     await usdt
// //       .connect(owner)
// //       .transfer(signers[7].address, expandTo6Decimals(1000));
// //     await usdt
// //       .connect(signers[7])
// //       .approve(marketplace1155.address, expandTo6Decimals(1000));
// //     await TRS.connect(signers[6]).setApprovalForAll(marketplace1155.address,true);
// //     await marketplace1155.Buy(Voucherbuy2, VoucherSell2, voucher2);
// //     expect(await TRS.balanceOf(signers[7].address, 1)).to.be.eq(2);
// //   });
// // });

// // it("non custodial to non custodial buy : mismatched addresses", async () => {
  
// //   await factory
// //     .connect(owner)
// //     .create1155Token(
// //       "T-series",
// //       owner.address,
// //       superOwner.address,
// //       usdt.address
// //     );
    
// //   const Tseries = await factory
// //     .connect(owner)
// //     .userLastNFTContracts(owner.address,0);
    
// //   const TRS = await new Template1155__factory(owner).attach(Tseries);
  
// //   //creating vouchers
// //   const Template1155Voucher = new template1155Voucher({
// //     _contract: TRS,
// //     _signer: owner,
// //   });
  
// //   const voucher = await Template1155Voucher.createVoucher(
// //     signers[4].address,
// //     1,
// //     expandTo6Decimals(3),
// //     2,
// //     1,
// //     "testURI",
// //     true,
// //     signers[2].address,
// //     1
// //   );
  
// //   const sellerVoucher = new SellerVoucher({
// //     _contract: marketplace1155,
// //     _signer: owner,
// //   });
  
// //   const VoucherSell = await sellerVoucher.createVoucher1155(
// //     Tseries,
// //     owner.address,
// //     1,
// //     2,
// //     expandTo6Decimals(10),
// //     1,
// //     true,
// //     false
// //   );
  
// //   const buyerVoucher = new BuyerVoucher({
// //     _contract: marketplace1155,
// //     _signer: signers[6],
// //   });
  
// //   const Voucherbuy = await buyerVoucher.createVoucher1155(
// //     Tseries,
// //     signers[6].address,
// //     1,
// //     2,
// //     expandTo6Decimals(10),
// //     1,
// //     false
// //   );
// //   //Primary Buy
  
// //   await usdt
// //     .connect(owner)
// //     .transfer(signers[6].address, expandTo6Decimals(1000));
    
// //   await usdt
// //     .connect(signers[6])
// //     .approve(marketplace1155.address, expandTo6Decimals(1000));
    
// //   await expect( marketplace1155.Buy(Voucherbuy, VoucherSell, voucher)).to.be.revertedWith("");
// // });

// // it("ERROR non custodial to non custodial primary buy: invalid price", async () => {
// //   await factory
// //     .connect(owner)
// //     .create1155Token(
// //       "T-series",
// //       owner.address,
// //       superOwner.address,
// //       usdt.address
// //     );
// //   const Tseries = await factory
// //     .connect(owner)
// //     .userLastNFTContracts(owner.address,0);
// //   const TRS = await new Template1155__factory(owner).attach(Tseries);
// //   const addressOfTemplate = Tseries;
// //   //creating vouchers
// //   const Template1155Voucher = new template1155Voucher({
// //     _contract: TRS,
// //     _signer: owner,
// //   });
// //   const voucher = await Template1155Voucher.createVoucher(
// //     addressOfTemplate,
// //     1,
// //     expandTo6Decimals(11),
// //     2,
// //     1,
// //     "testURI",
// //     true,
// //     signers[2].address,
// //     1
// //   );
// //   const sellerVoucher = new SellerVoucher({
// //     _contract: marketplace1155,
// //     _signer: owner,
// //   });
// //   const VoucherSell = await sellerVoucher.createVoucher1155(
// //     Tseries,
// //     owner.address,
// //     1,
// //     2,
// //     expandTo6Decimals(10),
// //     1,
// //     true,
// //     false
// //   );
// //   const buyerVoucher = new BuyerVoucher({
// //     _contract: marketplace1155,
// //     _signer: signers[6],
// //   });
// //   const Voucherbuy = await buyerVoucher.createVoucher1155(
// //     Tseries,
// //     signers[6].address,
// //     1,
// //     2,
// //     expandTo6Decimals(10),
// //     1,
// //     false
// //   );
// //   //Primary Buy

// //   await usdt
// //     .connect(owner)
// //     .transfer(signers[6].address, expandTo6Decimals(1000));
// //   await usdt
// //     .connect(signers[6])
// //     .approve(marketplace1155.address, expandTo6Decimals(1000));
// //   await expect(marketplace1155.Buy(Voucherbuy, VoucherSell, voucher)).to.be.revertedWith("invalid price");
// // });

// // it("ERROR non custodial to non custodial primary buy:invalid buyer", async () => {
// //   await factory
// //     .connect(owner)
// //     .create1155Token(
// //       "T-series",
// //       owner.address,
// //       superOwner.address,
// //       usdt.address
// //     );
// //   const Tseries = await factory
// //     .connect(owner)
// //     .userLastNFTContracts(owner.address,0);
// //   const TRS = await new Template1155__factory(owner).attach(Tseries);
// //   const addressOfTemplate = Tseries;
// //   //creating vouchers
// //   const Template1155Voucher = new template1155Voucher({
// //     _contract: TRS,
// //     _signer: owner,
// //   });
// //   const voucher = await Template1155Voucher.createVoucher(
// //     addressOfTemplate,
// //     1,
// //     expandTo6Decimals(3),
// //     2,
// //     1,
// //     "testURI",
// //     true,
// //     signers[2].address,
// //     1
// //   );
// //   const sellerVoucher = new SellerVoucher({
// //     _contract: marketplace1155,
// //     _signer: owner,
// //   });
// //   const VoucherSell = await sellerVoucher.createVoucher1155(
// //     Tseries,
// //     owner.address,
// //     1,
// //     2,
// //     expandTo6Decimals(10),
// //     1,
// //     true,
// //     false
// //   );
// //   const buyerVoucher = new BuyerVoucher({
// //     _contract: marketplace1155,
// //     _signer: signers[6],
// //   });
// //   const Voucherbuy = await buyerVoucher.createVoucher1155(
// //     Tseries,
// //     signers[2].address,
// //     1,
// //     2,
// //     expandTo6Decimals(10),
// //     1,
// //     false
// //   );
// //   //Primary Buy

// //   await usdt
// //     .connect(owner)
// //     .transfer(signers[6].address, expandTo6Decimals(1000));
// //   await usdt
// //     .connect(signers[6])
// //     .approve(marketplace1155.address, expandTo6Decimals(1000));
// //   await expect(marketplace1155.Buy(Voucherbuy, VoucherSell, voucher)).to.be.revertedWith("invalid buyer");
// // });

// // it("ERROR: non custodial to non custodial secondary buy: invalid Seller", async () => {
// //   await factory
// //     .connect(owner)
// //     .create1155Token(
// //       "T-series",
// //       owner.address,
// //       superOwner.address,
// //       usdt.address
// //     );
// //   const Tseries = await factory
// //     .connect(owner)
// //     .userLastNFTContracts(owner.address,0);
// //   const TRS = await new Template1155__factory(owner).attach(Tseries);
// //   const addressOfTemplate = Tseries;
// //   //creating vouchers
// //   const Template1155Voucher = new template1155Voucher({
// //     _contract: TRS,
// //     _signer: owner,
// //   });
// //   const voucher = await Template1155Voucher.createVoucher(
// //     addressOfTemplate,
// //     1,
// //     expandTo6Decimals(3),
// //     2,
// //     1,
// //     "testURI",
// //     true,
// //     signers[2].address,
// //     1
// //   );
// //   const sellerVoucher = new SellerVoucher({
// //     _contract: marketplace1155,
// //     _signer: owner,
// //   });
// //   const VoucherSell = await sellerVoucher.createVoucher1155(
// //     Tseries,
// //     owner.address,
// //     1,
// //     2,
// //     expandTo6Decimals(10),
// //     1,
// //     true,
// //     false
// //   );
// //   const buyerVoucher = new BuyerVoucher({
// //     _contract: marketplace1155,
// //     _signer: signers[6],
// //   });
// //   const Voucherbuy = await buyerVoucher.createVoucher1155(
// //     Tseries,
// //     signers[6].address,
// //     1,
// //     2,
// //     expandTo6Decimals(10),
// //     1,
// //     false
// //   );
// //   //Primary Buy

// //   await usdt
// //     .connect(owner)
// //     .transfer(signers[6].address, expandTo6Decimals(1000));
// //   await usdt
// //     .connect(signers[6])
// //     .approve(marketplace1155.address, expandTo6Decimals(1000));
// //   await marketplace1155.Buy(Voucherbuy, VoucherSell, voucher);
// //   expect(await TRS.balanceOf(signers[6].address, 1)).to.be.eq(2);
// //   //Secondary Buy
// //   const Template1155Voucher2 = new template1155Voucher({
// //     _contract: TRS,
// //     _signer: signers[6],
// //   });
// //   const voucher2 = await Template1155Voucher2.createVoucher(
// //     addressOfTemplate,
// //     1,
// //     expandTo6Decimals(3),
// //     2,
// //     2,
// //     "testURI",
// //     false,
// //     signers[2].address,
// //     1
// //   );
// //   const sellerVoucher2 = new SellerVoucher({
// //     _contract: marketplace1155,
// //     _signer: signers[6],
// //   });
// //   const VoucherSell2 = await sellerVoucher2.createVoucher1155(
// //     Tseries,
// //     signers[3].address,
// //     1,
// //     2,
// //     expandTo6Decimals(10),
// //     2,
// //     true,
// //     false
// //   );
// //   const buyerVoucher2 = new BuyerVoucher({
// //     _contract: marketplace1155,
// //     _signer: signers[7],
// //   });
// //   const Voucherbuy2 = await buyerVoucher2.createVoucher1155(
// //     Tseries,
// //     signers[7].address,
// //     1,
// //     2,
// //     expandTo6Decimals(10),
// //     2,
// //     false
// //   );
// //   await usdt
// //     .connect(owner)
// //     .transfer(signers[7].address, expandTo6Decimals(1000));
// //   await usdt
// //     .connect(signers[7])
// //     .approve(marketplace1155.address, expandTo6Decimals(1000));
// //   await TRS.connect(signers[6]).setApprovalForAll(marketplace1155.address,true);
// //   await expect(marketplace1155.Buy(Voucherbuy2, VoucherSell2, voucher2)).to.be.revertedWith("invalid Seller");
// // });

// // it("ERROR non custodial to non custodial buy: invalid buyer", async () => {
// //   await factory
// //     .connect(owner)
// //     .create1155Token(
// //       "T-series",
// //       owner.address,
// //       superOwner.address,
// //       usdt.address
// //     );
// //   const Tseries = await factory
// //     .connect(owner)
// //     .userLastNFTContracts(owner.address,0);
// //   const TRS = await new Template1155__factory(owner).attach(Tseries);
// //   const addressOfTemplate = Tseries;
// //   //creating vouchers
// //   const Template1155Voucher = new template1155Voucher({
// //     _contract: TRS,
// //     _signer: owner,
// //   });
// //   const voucher = await Template1155Voucher.createVoucher(
// //     addressOfTemplate,
// //     1,
// //     expandTo6Decimals(3),
// //     2,
// //     1,
// //     "testURI",
// //     true,
// //     signers[2].address,
// //     1
// //   );
// //   const sellerVoucher = new SellerVoucher({
// //     _contract: marketplace1155,
// //     _signer: owner,
// //   });
// //   const VoucherSell = await sellerVoucher.createVoucher1155(
// //     Tseries,
// //     owner.address,
// //     1,
// //     2,
// //     expandTo6Decimals(10),
// //     1,
// //     true,
// //     false
// //   );
// //   const buyerVoucher = new BuyerVoucher({
// //     _contract: marketplace1155,
// //     _signer: signers[6],
// //   });
// //   const Voucherbuy = await buyerVoucher.createVoucher1155(
// //     Tseries,
// //     signers[6].address,
// //     1,
// //     2,
// //     expandTo6Decimals(10),
// //     1,
// //     false
// //   );
// //   //Primary Buy

// //   await usdt
// //     .connect(owner)
// //     .transfer(signers[6].address, expandTo6Decimals(1000));
// //   await usdt
// //     .connect(signers[6])
// //     .approve(marketplace1155.address, expandTo6Decimals(1000));
// //   await marketplace1155.Buy(Voucherbuy, VoucherSell, voucher);
// //   expect(await TRS.balanceOf(signers[6].address, 1)).to.be.eq(2);
// //   //Secondary Buy
// //   const Template1155Voucher2 = new template1155Voucher({
// //     _contract: TRS,
// //     _signer: signers[6],
// //   });
// //   const voucher2 = await Template1155Voucher2.createVoucher(
// //     addressOfTemplate,
// //     1,
// //     expandTo6Decimals(3),
// //     2,
// //     2,
// //     "testURI",
// //     false,
// //     signers[2].address,
// //     1
// //   );
// //   const sellerVoucher2 = new SellerVoucher({
// //     _contract: marketplace1155,
// //     _signer: signers[6],
// //   });
// //   const VoucherSell2 = await sellerVoucher2.createVoucher1155(
// //     Tseries,
// //     signers[6].address,
// //     1,
// //     2,
// //     expandTo6Decimals(10),
// //     2,
// //     true,
// //     false
// //   );
// //   const buyerVoucher2 = new BuyerVoucher({
// //     _contract: marketplace1155,
// //     _signer: signers[7],
// //   });
// //   const Voucherbuy2 = await buyerVoucher2.createVoucher1155(
// //     Tseries,
// //     signers[3].address,
// //     1,
// //     2,
// //     expandTo6Decimals(10),
// //     2,
// //     false
// //   );
// //   await usdt
// //     .connect(owner)
// //     .transfer(signers[7].address, expandTo6Decimals(1000));
// //   await usdt
// //     .connect(signers[7])
// //     .approve(marketplace1155.address, expandTo6Decimals(1000));
// //   await TRS.connect(signers[6]).setApprovalForAll(marketplace1155.address,true);
// //   await expect (marketplace1155.Buy(Voucherbuy2, VoucherSell2, voucher2)).to.be.revertedWith("invalid buyer");
// // });


// // it("ERROR non custodial to non custodial buy: not enough balance for token", async () => {
// //   await factory
// //     .connect(owner)
// //     .create1155Token(
// //       "T-series",
// //       owner.address,
// //       superOwner.address,
// //       usdt.address
// //     );
// //   const Tseries = await factory
// //     .connect(owner)
// //     .userLastNFTContracts(owner.address,0);
// //   const TRS = await new Template1155__factory(owner).attach(Tseries);
// //   const addressOfTemplate = Tseries;
// //   //creating vouchers
// //   const Template1155Voucher = new template1155Voucher({
// //     _contract: TRS,
// //     _signer: owner,
// //   });
// //   const voucher = await Template1155Voucher.createVoucher(
// //     addressOfTemplate,
// //     1,
// //     expandTo6Decimals(3),
// //     2,
// //     1,
// //     "testURI",
// //     true,
// //     signers[2].address,
// //     1
// //   );
// //   const sellerVoucher = new SellerVoucher({
// //     _contract: marketplace1155,
// //     _signer: owner,
// //   });
// //   const VoucherSell = await sellerVoucher.createVoucher1155(
// //     Tseries,
// //     owner.address,
// //     1,
// //     2,
// //     expandTo6Decimals(10),
// //     1,
// //     true,
// //     false
// //   );
// //   const buyerVoucher = new BuyerVoucher({
// //     _contract: marketplace1155,
// //     _signer: signers[6],
// //   });
// //   const Voucherbuy = await buyerVoucher.createVoucher1155(
// //     Tseries,
// //     signers[6].address,
// //     1,
// //     2,
// //     expandTo6Decimals(10),
// //     1,
// //     false
// //   );
// //   //Primary Buy

// //   await usdt
// //     .connect(owner)
// //     .transfer(signers[6].address, expandTo6Decimals(1000));
// //   await usdt
// //     .connect(signers[6])
// //     .approve(marketplace1155.address, expandTo6Decimals(1000));
// //   await marketplace1155.Buy(Voucherbuy, VoucherSell, voucher);
// //   expect(await TRS.balanceOf(signers[6].address, 1)).to.be.eq(2);
// //   //Secondary Buy
// //   const Template1155Voucher2 = new template1155Voucher({
// //     _contract: TRS,
// //     _signer: signers[6],
// //   });
// //   const voucher2 = await Template1155Voucher2.createVoucher(
// //     addressOfTemplate,
// //     1,
// //     expandTo6Decimals(3),
// //     2,
// //     2,
// //     "testURI",
// //     false,
// //     signers[2].address,
// //     1
// //   );
// //   const sellerVoucher2 = new SellerVoucher({
// //     _contract: marketplace1155,
// //     _signer: signers[6],
// //   });
// //   const VoucherSell2 = await sellerVoucher2.createVoucher1155(
// //     Tseries,
// //     signers[6].address,
// //     1,
// //     2,
// //     expandTo6Decimals(10),
// //     2,
// //     true,
// //     false
// //   );
// //   const buyerVoucher2 = new BuyerVoucher({
// //     _contract: marketplace1155,
// //     _signer: signers[7],
// //   });
// //   const Voucherbuy2 = await buyerVoucher2.createVoucher1155(
// //     Tseries,
// //     signers[7].address,
// //     1,
// //     2,
// //     expandTo6Decimals(10),
// //     2,
// //     false
// //   );
// //   await usdt
// //     .connect(owner)
// //     .transfer(signers[7].address, expandTo6Decimals(1000));
// //   await usdt
// //     .connect(signers[7])
// //     .approve(marketplace1155.address, expandTo6Decimals(1000));
// //   await TRS.connect(signers[6]).setApprovalForAll(marketplace1155.address,true);
// //   await expect(marketplace1155.Buy(Voucherbuy2, VoucherSell2, voucher2)).to.be.revertedWith("not enough balance for token");
// // });



//   // it("ERROR 1155 Buy: Addresses doesn't match",async()=>{
//   //   //create collection
//   //   await factory.connect(owner).create1155Token("T-series", owner.address, superOwner.address,usdt.address);
//   //   const Tseries = await factory.connect(owner).userLastNFTContracts(owner.address,0);
//   //   const TRS = await new Template1155__factory(owner).attach(Tseries);
//   //   const addressOfTemplate = Tseries;
//   //   //creating vouchers
//   //   const Template1155Voucher = new template1155Voucher({_contract:TRS , _signer:owner});
//   //   const voucher= await Template1155Voucher.createVoucher(addressOfTemplate,1,expandTo6Decimals(3),2,1,"testURI",true,signers[2].address,1);
//   //   const sellerVoucher = new SellerVoucher({_contract:marketplace1155 , _signer:owner});
//   //   const VoucherSell = await sellerVoucher.createVoucher1155(Tseries, owner.address,1,2,expandTo6Decimals(10),1,true,true);
//   //   const buyerVoucher = new BuyerVoucher({_contract:marketplace1155 , _signer:signers[6]});
//   //   const Voucherbuy = await buyerVoucher.createVoucher1155(signers[8].address, signers[6].address,1,2,expandTo6Decimals(10),1,true);
//   //   //Primary Buy
//   //   //console.log("treasury balance:",await usdt.balanceOf(owner.address))
//   //   await usdt.connect(owner).transfer(signers[6].address,expandTo6Decimals(1000));
//   //   //console.log("treasury balance:",await usdt.balanceOf(owner.address))
//   //   await usdt.connect(owner).approve(marketplace1155.address,expandTo6Decimals(1000));
//   //   //console.log("NFT balance of first buyer before buy:",await TRS.balanceOf(signers[6].address,1));
//   //   await expect (marketplace1155.Buy(Voucherbuy, VoucherSell, voucher)).to.be.revertedWith("Addresses invalid");
//   //   })

//   //   it("1155buy: counters mismatched",async()=>{
//   //     //create collection
//   //     await factory.connect(owner).create1155Token("T-series", owner.address, superOwner.address,usdt.address);
//   //     const Tseries = await factory.connect(owner).userLastNFTContracts(owner.address,0);
//   //     const TRS = await new Template1155__factory(owner).attach(Tseries);
//   //     const addressOfTemplate = Tseries;
//   //     //creating vouchers
//   //     const Template1155Voucher = new template1155Voucher({_contract:TRS , _signer:owner});
//   //     const voucher= await Template1155Voucher.createVoucher(addressOfTemplate,1,expandTo6Decimals(3),2,1,"testURI",true,signers[2].address,1);
//   //     const sellerVoucher = new SellerVoucher({_contract:marketplace1155 , _signer:owner});
//   //     const VoucherSell = await sellerVoucher.createVoucher1155(Tseries, owner.address,1,2,expandTo6Decimals(10),2,true,true);
//   //     const buyerVoucher = new BuyerVoucher({_contract:marketplace1155 , _signer:signers[6]});
//   //     const Voucherbuy = await buyerVoucher.createVoucher1155(Tseries, signers[6].address,1,2,expandTo6Decimals(10),1,true);
//   //     //Primary Buy
//   //     //console.log("treasury balance:",await usdt.balanceOf(owner.address))
//   //     await usdt.connect(owner).transfer(signers[6].address,expandTo6Decimals(1000));
//   //     //console.log("treasury balance:",await usdt.balanceOf(owner.address))
//   //     await usdt.connect(owner).approve(marketplace1155.address,expandTo6Decimals(1000));
//   //     //console.log("NFT balance of first buyer before buy:",await TRS.balanceOf(signers[6].address,1));
//   //     await expect(marketplace1155.Buy(Voucherbuy, VoucherSell, voucher)).to.be.revertedWith("Counters invalid");
//   //     })

//   //     it("ERROR 1155 buy: mismatched amounts",async()=>{
//   //       //create collection
//   //       await factory.connect(owner).create1155Token("T-series", owner.address, superOwner.address,usdt.address);
//   //       const Tseries = await factory.connect(owner).userLastNFTContracts(owner.address,0);
//   //       const TRS = await new Template1155__factory(owner).attach(Tseries);
//   //       const addressOfTemplate = Tseries;
//   //       //creating vouchers
//   //       const Template1155Voucher = new template1155Voucher({_contract:TRS , _signer:owner});
//   //       const voucher= await Template1155Voucher.createVoucher(addressOfTemplate,1,expandTo6Decimals(3),1,1,"testURI",true,signers[2].address,1);
//   //       const sellerVoucher = new SellerVoucher({_contract:marketplace1155 , _signer:owner});
//   //       const VoucherSell = await sellerVoucher.createVoucher1155(Tseries, owner.address,1,2,expandTo6Decimals(10),1,true,true);
//   //       const buyerVoucher = new BuyerVoucher({_contract:marketplace1155 , _signer:signers[6]});
//   //       const Voucherbuy = await buyerVoucher.createVoucher1155(Tseries, signers[6].address,1,2,expandTo6Decimals(10),1,true);
//   //       //Primary Buy
//   //       //console.log("treasury balance:",await usdt.balanceOf(owner.address))
//   //       await usdt.connect(owner).transfer(signers[6].address,expandTo6Decimals(1000));
//   //       //console.log("treasury balance:",await usdt.balanceOf(owner.address))
//   //       await usdt.connect(owner).approve(marketplace1155.address,expandTo6Decimals(1000));
//   //       //console.log("NFT balance of first buyer before buy:",await TRS.balanceOf(signers[6].address,1));
//   //       await expect(marketplace1155.Buy(Voucherbuy, VoucherSell, voucher)).to.be.revertedWith("Amounts invalid");
//   //     })    

//   //     it("ERROR 1155 buy :price doesn't match",async()=>{
//   //       //create collection
//   //       await factory.connect(owner).create1155Token("T-series", owner.address, superOwner.address,usdt.address);
//   //       const Tseries = await factory.connect(owner).userLastNFTContracts(owner.address,0);
//   //       const TRS = await new Template1155__factory(owner).attach(Tseries);
//   //       const addressOfTemplate = Tseries;
//   //       //creating vouchers
//   //       const Template1155Voucher = new template1155Voucher({_contract:TRS , _signer:owner});
//   //       const voucher= await Template1155Voucher.createVoucher(addressOfTemplate,1,expandTo6Decimals(3),2,1,"testURI",true,signers[2].address,1);
//   //       const sellerVoucher = new SellerVoucher({_contract:marketplace1155 , _signer:owner});
//   //       const VoucherSell = await sellerVoucher.createVoucher1155(Tseries, owner.address,1,2,expandTo6Decimals(10),1,true,true);
//   //       const buyerVoucher = new BuyerVoucher({_contract:marketplace1155 , _signer:signers[6]});
//   //       const Voucherbuy = await buyerVoucher.createVoucher1155(Tseries, signers[6].address,1,2,expandTo6Decimals(9),1,true);
//   //       //Primary Buy
//   //       //console.log("treasury balance:",await usdt.balanceOf(owner.address))
//   //       await usdt.connect(owner).transfer(signers[6].address,expandTo6Decimals(1000));
//   //       //console.log("treasury balance:",await usdt.balanceOf(owner.address))
//   //       await usdt.connect(owner).approve(marketplace1155.address,expandTo6Decimals(1000));
//   //       //console.log("NFT balance of first buyer before buy:",await TRS.balanceOf(signers[6].address,1));
//   //       await expect(marketplace1155.Buy(Voucherbuy, VoucherSell, voucher)).to.be.revertedWith("Prices invalid");
//   //     }) 


// // describe("template1155 testing", async () => {
// //   it("creating clones from factory", async () => {
// //     await factory
// //       .connect(owner).create1155Token("testURI",owner.address,signers[1].address,usdt.address);
// //     const Tseries = await factory
// //       .connect(owner)
// //       .userLastNFTContracts(owner.address,0);
// //   const TRS = await new Template1155__factory(owner).attach(Tseries);
// //   const addressOfTemplate = Tseries;
// //   const Template1155Voucher = new template1155Voucher({_contract:TRS , _signer:owner});
// //   const voucher= await Template1155Voucher.createVoucher(addressOfTemplate,1,expandTo6Decimals(3),2,1,"testURI",signers[3].address,signers[2].address,1);
// //   //console.log("NFT balance before buy",await TRS.balanceOf(signers[4].address,1));
// //   await TRS.connect(signers[4]).redeem(voucher,signers[4].address,2);
// //   //console.log("NFT balance after buy",await TRS.balanceOf(signers[4].address,1));
// //   });
// // });

// describe.only("Single Market place: 721 NFT",async()=>{
//   it("custodial to custodial",async()=>{
//     await factory.connect(owner).create721Token("TestName","TestSymbol",owner.address,signers[1].address,usdt.address);
//     const Tseries = await factory.connect(owner).userLastNFTContracts(owner.address,0);
//     const TRS = await new Template__factory(owner).attach(Tseries);
  
    
//     //creating vouchers
//     const TemplateVoucher= await new template1155Voucher({_contract:TRS, _signer:signers[1]});
//     const voucher = await TemplateVoucher.createVoucher(Tseries,1,expandTo6Decimals(10),1,1,"TestURI",true,signers[2].address,expandTo6Decimals(0));
//     const seller =  new SellerVoucher({_contract:singleMarketplace, _signer:signers[1]});
//     const sellerVoucher = await seller.createVoucher(Tseries,signers[1].address,1,1,expandTo6Decimals(10),1,true,true);
//     const buyer = await new BuyerVoucher({_contract:singleMarketplace,_signer: signers[6]});
//     const buyerVoucher = await buyer.createVoucher(Tseries,signers[6].address,1,1,expandTo6Decimals(10),1,true);

//     //Primary Buy
//     await usdt.connect(owner).transfer(signers[6].address,expandTo6Decimals(10000));
//     await usdt.connect(owner).approve(singleMarketplace.address,expandTo6Decimals(1000));
//     await usdt.connect(signers[6]).approve(singleMarketplace.address,expandTo6Decimals(1000));

//     await (singleMarketplace.Buy(buyerVoucher,sellerVoucher,voucher,true));
//     expect(await TRS.balanceOf(signers[6].address)).to.be.eq(1);

//     //Secondary buy
//     const TemplateVoucher2= await new template1155Voucher({_contract:TRS, _signer:signers[1]});
//     const voucher2 = await TemplateVoucher2.createVoucher(Tseries,1,expandTo6Decimals(10),1,1,"TestURI",false,signers[2].address,expandTo6Decimals(0));
//     const seller2 =  new SellerVoucher({_contract:singleMarketplace, _signer:signers[6]});
//     const sellerVoucher2 = await seller2.createVoucher(Tseries,signers[6].address,1,1,expandTo6Decimals(10),1,true,true);
//     const buyer2 = await new BuyerVoucher({_contract:singleMarketplace,_signer: signers[7]});
//     const buyerVoucher2 = await buyer2.createVoucher(Tseries,signers[7].address,1,1,expandTo6Decimals(10),1,true);

//     await TRS.connect(signers[6]).approve(singleMarketplace.address,1);
//     await singleMarketplace.Buy(buyerVoucher2,sellerVoucher2,voucher2,true);
//     expect(await TRS.balanceOf(signers[7].address)).to.be.eq(1);
    

//   });

//   it("custodial to non-custodial",async()=>{
//     await factory.connect(owner).create721Token("TestName","TestSymbol",owner.address,signers[1].address,usdt.address);
//     const Tseries = await factory.connect(owner).userLastNFTContracts(owner.address,0);
//     const TRS = await new Template__factory(owner).attach(Tseries);
  
    
//     //creating vouchers
//     const TemplateVoucher= await new template1155Voucher({_contract:TRS, _signer:signers[1]});
//     const voucher = await TemplateVoucher.createVoucher(Tseries,1,expandTo6Decimals(10),1,1,"TestURI",true,signers[2].address,expandTo6Decimals(0));
//     const seller =  new SellerVoucher({_contract:singleMarketplace, _signer:signers[1]});
//     const sellerVoucher = await seller.createVoucher(Tseries,signers[1].address,1,1,expandTo6Decimals(10),1,true,true);
//     const buyer = await new BuyerVoucher({_contract:singleMarketplace,_signer: signers[6]});
//     const buyerVoucher = await buyer.createVoucher(Tseries,signers[6].address,1,1,expandTo6Decimals(10),1,false);

//     //Primary Buy
//     await usdt.connect(owner).transfer(signers[6].address,expandTo6Decimals(10000));
//     await usdt.connect(owner).approve(singleMarketplace.address,expandTo6Decimals(1000));
//     await usdt.connect(signers[6]).approve(singleMarketplace.address,expandTo6Decimals(1000));

//     await (singleMarketplace.Buy(buyerVoucher,sellerVoucher,voucher,true));
//     expect(await TRS.balanceOf(signers[6].address)).to.be.eq(1);

//     //Secondary buy
//     const TemplateVoucher2= await new template1155Voucher({_contract:TRS, _signer:signers[1]});
//     const voucher2 = await TemplateVoucher2.createVoucher(Tseries,1,expandTo6Decimals(10),1,1,"TestURI",false,signers[2].address,expandTo6Decimals(0));
//     const seller2 =  new SellerVoucher({_contract:singleMarketplace, _signer:signers[6]});
//     const sellerVoucher2 = await seller2.createVoucher(Tseries,signers[6].address,1,1,expandTo6Decimals(10),1,true,true);
//     const buyer2 = await new BuyerVoucher({_contract:singleMarketplace,_signer: signers[7]});
//     const buyerVoucher2 = await buyer2.createVoucher(Tseries,signers[7].address,1,1,expandTo6Decimals(10),1,false);

//     await usdt.connect(owner).transfer(signers[7].address,expandTo6Decimals(10000));
//     await usdt.connect(signers[7]).approve(singleMarketplace.address,expandTo6Decimals(1000));
//     await TRS.connect(signers[6]).approve(singleMarketplace.address,1);
//     await singleMarketplace.Buy(buyerVoucher2,sellerVoucher2,voucher2,true);
//     expect(await TRS.balanceOf(signers[7].address)).to.be.eq(1);
    

//   });


//   it("non-custodial to custodial",async()=>{
//     await factory.connect(owner).create721Token("TestName","TestSymbol",owner.address,signers[1].address,usdt.address);
//     const Tseries = await factory.connect(owner).userLastNFTContracts(owner.address,0);
//     const TRS = await new Template__factory(owner).attach(Tseries);
  
    
//     //creating vouchers
//     const TemplateVoucher= await new template1155Voucher({_contract:TRS, _signer:signers[1]});
//     const voucher = await TemplateVoucher.createVoucher(Tseries,1,expandTo6Decimals(10),1,1,"TestURI",true,signers[2].address,expandTo6Decimals(0));
//     const seller =  new SellerVoucher({_contract:singleMarketplace, _signer:signers[1]});
//     const sellerVoucher = await seller.createVoucher(Tseries,signers[1].address,1,1,expandTo6Decimals(10),1,true,false);
//     const buyer = await new BuyerVoucher({_contract:singleMarketplace,_signer: signers[6]});
//     const buyerVoucher = await buyer.createVoucher(Tseries,signers[6].address,1,1,expandTo6Decimals(10),1,true);

//     //Primary Buy
//     await usdt.connect(owner).transfer(signers[6].address,expandTo6Decimals(10000));
//     await usdt.connect(owner).approve(singleMarketplace.address,expandTo6Decimals(1000));
//     await usdt.connect(signers[6]).approve(singleMarketplace.address,expandTo6Decimals(1000));

//     await (singleMarketplace.Buy(buyerVoucher,sellerVoucher,voucher,true));
//     expect(await TRS.balanceOf(signers[6].address)).to.be.eq(1);

//     //Secondary buy
//     const TemplateVoucher2= await new template1155Voucher({_contract:TRS, _signer:signers[1]});
//     const voucher2 = await TemplateVoucher2.createVoucher(Tseries,1,expandTo6Decimals(10),1,1,"TestURI",false,signers[2].address,expandTo6Decimals(0));
//     const seller2 =  new SellerVoucher({_contract:singleMarketplace, _signer:signers[6]});
//     const sellerVoucher2 = await seller2.createVoucher(Tseries,signers[6].address,1,1,expandTo6Decimals(10),1,true,false);
//     const buyer2 = await new BuyerVoucher({_contract:singleMarketplace,_signer: signers[7]});
//     const buyerVoucher2 = await buyer2.createVoucher(Tseries,signers[7].address,1,1,expandTo6Decimals(10),1,true);

//     await usdt.connect(owner).transfer(signers[7].address,expandTo6Decimals(10000));
//     await usdt.connect(signers[7]).approve(singleMarketplace.address,expandTo6Decimals(1000));
//     await TRS.connect(signers[6]).approve(singleMarketplace.address,1);
//     await singleMarketplace.Buy(buyerVoucher2,sellerVoucher2,voucher2,true);
//     expect(await TRS.balanceOf(signers[7].address)).to.be.eq(1);
    

//   });

//   it("non-custodial to non-custodial",async()=>{
//     await factory.connect(owner).create721Token("TestName","TestSymbol",owner.address,signers[1].address,usdt.address);
//     const Tseries = await factory.connect(owner).userLastNFTContracts(owner.address,0);
//     const TRS = await new Template__factory(owner).attach(Tseries);
  
    
//     //creating vouchers
//     const TemplateVoucher= await new template1155Voucher({_contract:TRS, _signer:signers[1]});
//     const voucher = await TemplateVoucher.createVoucher(Tseries,1,expandTo6Decimals(10),1,1,"TestURI",true,signers[2].address,expandTo6Decimals(0));
//     const seller =  new SellerVoucher({_contract:singleMarketplace, _signer:signers[1]});
//     const sellerVoucher = await seller.createVoucher(Tseries,signers[1].address,1,1,expandTo6Decimals(10),1,true,false);
//     const buyer = await new BuyerVoucher({_contract:singleMarketplace,_signer: signers[6]});
//     const buyerVoucher = await buyer.createVoucher(Tseries,signers[6].address,1,1,expandTo6Decimals(10),1,false);

//     //Primary Buy
//     await usdt.connect(owner).transfer(signers[6].address,expandTo6Decimals(10000));
//     await usdt.connect(owner).approve(singleMarketplace.address,expandTo6Decimals(1000));
//     await usdt.connect(signers[6]).approve(singleMarketplace.address,expandTo6Decimals(1000));

//     await (singleMarketplace.Buy(buyerVoucher,sellerVoucher,voucher,true));
//     expect(await TRS.balanceOf(signers[6].address)).to.be.eq(1);

//     //Secondary buy
//     const TemplateVoucher2= await new template1155Voucher({_contract:TRS, _signer:signers[1]});
//     const voucher2 = await TemplateVoucher2.createVoucher(Tseries,1,expandTo6Decimals(10),1,1,"TestURI",false,signers[2].address,expandTo6Decimals(0));
//     const seller2 =  new SellerVoucher({_contract:singleMarketplace, _signer:signers[6]});
//     const sellerVoucher2 = await seller2.createVoucher(Tseries,signers[6].address,1,1,expandTo6Decimals(10),1,true,false);
//     const buyer2 = await new BuyerVoucher({_contract:singleMarketplace,_signer: signers[7]});
//     const buyerVoucher2 = await buyer2.createVoucher(Tseries,signers[7].address,1,1,expandTo6Decimals(10),1,false);

//     await usdt.connect(owner).transfer(signers[7].address,expandTo6Decimals(10000));
//     await usdt.connect(signers[7]).approve(singleMarketplace.address,expandTo6Decimals(1000));
//     await TRS.connect(signers[6]).approve(singleMarketplace.address,1);
//     await singleMarketplace.Buy(buyerVoucher2,sellerVoucher2,voucher2,true);
//     expect(await TRS.balanceOf(signers[7].address)).to.be.eq(1);
    

//   })
// })
// });