import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ethers, } from "hardhat";
import { 
  Template, 
  Template__factory, 
  TokenFactory, 
  TokenFactory__factory, 
  Usd, 
  Usd__factory,
  Template1155,
  Template1155__factory,
  SingleMarket,
  SingleMarket__factory} from "../typechain"
import SellerVoucher from "./utilities/SellerVoucher";
import BuyerVoucher from "./utilities/BuyerVoucher";
import { expandTo6Decimals } from "./utilities/utilities";
import { expect } from "chai";
// import { console } from "console";
import template1155Voucher from "./utilities/SFTVoucher";
import LazyMinting from "./utilities/LazyMinting";


describe("Template", async() => {
let NFT : Template;
let factory : TokenFactory;
let owner : SignerWithAddress;
let superOwner : SignerWithAddress;
let signers : SignerWithAddress[];
let usdt :Usd;
let template1155 : Template1155;
let singleMarketplace:SingleMarket;

beforeEach(async() =>{
    signers= await ethers.getSigners();
    owner = signers[0];
    superOwner = signers[1];
    NFT = await new Template__factory(owner).deploy();
    template1155 = await new Template1155__factory(owner).deploy();
    usdt = await new Usd__factory(owner).deploy();
    factory = await new TokenFactory__factory(owner).deploy();
    singleMarketplace= await new SingleMarket__factory(owner).deploy(owner.address,owner.address,usdt.address,owner.address);
    await NFT.initialize("testName","testSymbol", owner.address, superOwner.address,usdt.address,signers[2].address);
    await template1155.initialize("testURI",owner.address,signers[1].address,usdt.address,factory.address);
    await factory.initialize(NFT.address, template1155.address,singleMarketplace.address);
});


describe("singleMarketplace 1155 ",async()=>{

  it("factory", async() =>{
    await factory.connect(signers[0]).create721Token("testName","testSymbol",owner.address,superOwner.address,usdt.address)
    await factory.connect(signers[1]).create721Token("heftiverse","hef",owner.address,superOwner.address,usdt.address);
    await factory.connect(signers[2]).create721Token("hefty","hev",owner.address,superOwner.address,usdt.address);
    });
  });
  
  it("custodial to custodial buy", async () => {
    //create collection
    await factory
      .connect(owner)
      .create1155Token(
        "T-series",
        owner.address,
        superOwner.address,
        usdt.address
      );

    const Tseries = await factory
      .connect(owner)
      .userLastNFTContracts(owner.address,0);

      const TRS = await new Template1155__factory(owner).attach(Tseries);
    //creating vouchers
    const TemplateVoucher = await new LazyMinting({
        _contract: TRS,
        _signer: signers[1],
      });
      const voucherNFT = await TemplateVoucher.createVoucher(
        Tseries,
        1,
        expandTo6Decimals(10),
        "TestURI",
        true,
        signers[2].address,
        expandTo6Decimals(0)
      );
      const Template1155Voucher = await new template1155Voucher({
        _contract: TRS,
        _signer: signers[1],
      });
      const voucher = await Template1155Voucher.createVoucher(
        Tseries,
        1,
        expandTo6Decimals(10),
        2,
        1,
        "TestURI",
        true,
        signers[2].address,
        expandTo6Decimals(0)
      );
    const sellerVoucher = new SellerVoucher({
      _contract: singleMarketplace,
      _signer: owner
    });

    const VoucherSell = await sellerVoucher.createVoucher1155(
      Tseries,
      owner.address,
      1,
      2,
      expandTo6Decimals(10),
      1,
      true,
      true
    );
    const buyerVoucher = new BuyerVoucher({
      _contract: singleMarketplace,
      _signer: signers[6]
    });
    const Voucherbuy = await buyerVoucher.createVoucher1155(
      Tseries,
      signers[6].address,
      1,
      2,
      expandTo6Decimals(10),
      1,
      true
    );
    //Primary Buy

    await usdt
      .connect(owner)
      .transfer(signers[6].address, expandTo6Decimals(1000));

    await usdt
      .connect(owner)
      .approve(singleMarketplace.address, expandTo6Decimals(1000));
    await singleMarketplace.Buy(Voucherbuy,VoucherSell,voucher,voucherNFT,false);

      expect(await TRS.balanceOf(signers[6].address,1)).to.be.eq(2);
    //Secondary Buy

    const TemplateVoucher2 = await new LazyMinting({
        _contract: TRS,
        _signer: signers[1],
      });
      const voucherNFT2 = await TemplateVoucher2.createVoucher(
        Tseries,
        1,
        expandTo6Decimals(10),
        "TestURI",
        true,
        signers[2].address,
        expandTo6Decimals(0)
      );
      const Template1155Voucher2 = await new template1155Voucher({
        _contract: TRS,
        _signer: signers[1],
      });
      const voucher2 = await Template1155Voucher2.createVoucher(
        Tseries,
        1,
        expandTo6Decimals(10),
        2,
        2,
        "TestURI",
        true,
        signers[2].address,
        expandTo6Decimals(0)
      );  
        const sellerVoucher2 = new SellerVoucher({
      _contract: singleMarketplace,
      _signer: signers[6],
    });
    const VoucherSell2 = await sellerVoucher2.createVoucher1155(
      Tseries,
      signers[6].address,
      1,
      2,
      expandTo6Decimals(10),
      2,
      true,
      true
    );

    const buyerVoucher2 = new BuyerVoucher({
      _contract: singleMarketplace,
      _signer: signers[7],
    });
    const Voucherbuy2 = await buyerVoucher2.createVoucher1155(
      Tseries,
      signers[7].address,
      1,
      2,
      expandTo6Decimals(10),
      2,
      true
    );
    await usdt
      .connect(owner)
      .transfer(signers[7].address, expandTo6Decimals(1000));
    await usdt
      .connect(signers[7])
      .approve(singleMarketplace.address, expandTo6Decimals(1000));
    await TRS.connect(signers[6]).setApprovalForAll(singleMarketplace.address,true);
    await singleMarketplace.Buy(Voucherbuy2, VoucherSell2, voucher2,voucherNFT2,false);
   expect(await TRS.balanceOf(signers[7].address, 1)).to.be.eq(2);
  });

  it("ERROR custodial to custodial primary buy:invalid buyer", async () => {
    //create collection
    await factory
      .connect(owner)
      .create1155Token(
        "T-series",
        owner.address,
        superOwner.address,
        usdt.address
      );
    const Tseries = await factory
      .connect(owner)
      .userLastNFTContracts(owner.address,0);
    const TRS = await new Template1155__factory(owner).attach(Tseries);
    //creating vouchers
    const TemplateVoucher = await new LazyMinting({
        _contract: TRS,
        _signer: signers[1],
      });
      const voucherNFT = await TemplateVoucher.createVoucher(
        Tseries,
        1,
        expandTo6Decimals(10),
        "TestURI",
        true,
        signers[2].address,
        expandTo6Decimals(0)
      );
      const Template1155Voucher = await new template1155Voucher({
        _contract: TRS,
        _signer: signers[1],
      });
      const voucher = await Template1155Voucher.createVoucher(
        Tseries,
        1,
        expandTo6Decimals(10),
        2,
        1,
        "TestURI",
        true,
        signers[2].address,
        expandTo6Decimals(0)
      );
    const sellerVoucher = new SellerVoucher({
      _contract: singleMarketplace,
      _signer: owner,
    });
    const VoucherSell = await sellerVoucher.createVoucher1155(
      Tseries,
      owner.address,
      1,
      2,
      expandTo6Decimals(10),
      1,
      true,
      true
    );
    const buyerVoucher = new BuyerVoucher({
      _contract: singleMarketplace,
      _signer: signers[6],
    });
    const Voucherbuy = await buyerVoucher.createVoucher1155(
      Tseries,
      signers[5].address,
      1,
      2,
      expandTo6Decimals(10),
      1,
      true
    );
    //Primary Buy
    await usdt
      .connect(owner)
      .transfer(signers[6].address, expandTo6Decimals(1000));
    await usdt
      .connect(owner)
      .approve(singleMarketplace.address, expandTo6Decimals(1000));
    await expect(singleMarketplace.Buy(Voucherbuy, VoucherSell, voucher,voucherNFT,false)).to.be.revertedWith("invalid buyer");
    });



  it("ERROR custodial to custodial primary buy : buyer and nft mismatched addresses", async () => {
    //create collection
    await factory
      .connect(owner)
      .create1155Token(
        "T-series",
        owner.address,
        superOwner.address,
        usdt.address
      );
    const Tseries = await factory
      .connect(owner)
      .userLastNFTContracts(owner.address,0);
    const TRS = await new Template1155__factory(owner).attach(Tseries);
    //creating vouchers
    const TemplateVoucher = await new LazyMinting({
        _contract: TRS,
        _signer: signers[1],
      });
      const voucherNFT = await TemplateVoucher.createVoucher(
        Tseries,
        1,
        expandTo6Decimals(10),
        "TestURI",
        true,
        signers[2].address,
        expandTo6Decimals(0)
      );
      const Template1155Voucher = await new template1155Voucher({
        _contract: TRS,
        _signer: signers[1],
      });
      const voucher = await Template1155Voucher.createVoucher(
        Tseries,
        1,
        expandTo6Decimals(10),
        2,
        1,
        "TestURI",
        true,
        signers[2].address,
        expandTo6Decimals(0)
      );
    const sellerVoucher = new SellerVoucher({
      _contract: singleMarketplace,
      _signer: owner,
    });
    const VoucherSell = await sellerVoucher.createVoucher1155(
      Tseries,
      owner.address,
      1,
      2,
      expandTo6Decimals(10),
      1,
      true,
      true
    );
    const buyerVoucher = new BuyerVoucher({
      _contract: singleMarketplace,
      _signer: signers[6],
    });
    const Voucherbuy = await buyerVoucher.createVoucher1155(
      signers[8].address,
      signers[6].address,
      1,
      2,
      expandTo6Decimals(10),
      1,
      true
    );
    //Primary Buy
    await usdt
      .connect(owner)
      .transfer(signers[6].address, expandTo6Decimals(1000));
    await usdt
      .connect(owner)
      .approve(singleMarketplace.address, expandTo6Decimals(1000));
    await expect(singleMarketplace.Buy(Voucherbuy, VoucherSell, voucher,voucherNFT,false)).to.be.revertedWith("Addresses invalid");
    });

    it("ERROR custodial to custodial primary buy : invalid price", async () => {
      //create collection
    await factory
    .connect(owner)
    .create1155Token(
      "T-series",
      owner.address,
      superOwner.address,
      usdt.address
    );
  const Tseries = await factory
    .connect(owner)
    .userLastNFTContracts(owner.address,0);
  const TRS = await new Template1155__factory(owner).attach(Tseries);
  const addressOfTemplate = Tseries;
  //creating vouchers
  const TemplateVoucher = await new LazyMinting({
      _contract: TRS,
      _signer: signers[1],
    });
    const voucherNFT = await TemplateVoucher.createVoucher(
      Tseries,
      1,
      expandTo6Decimals(10),
      "TestURI",
      true,
      signers[2].address,
      expandTo6Decimals(0)
    );
    const Template1155Voucher = await new template1155Voucher({
      _contract: TRS,
      _signer: signers[1],
    });
    const voucher = await Template1155Voucher.createVoucher(
      Tseries,
      1,
      expandTo6Decimals(10),
      2,
      1,
      "TestURI",
      true,
      signers[2].address,
      expandTo6Decimals(0)
    );
  const sellerVoucher = new SellerVoucher({
    _contract: singleMarketplace,
    _signer: owner,
  });
  const VoucherSell = await sellerVoucher.createVoucher1155(
    Tseries,
    owner.address,
    1,
    2,
    expandTo6Decimals(3),
    1,
    true,
    true
  );
  const buyerVoucher = new BuyerVoucher({
    _contract: singleMarketplace,
    _signer: signers[6],
  });
  const Voucherbuy = await buyerVoucher.createVoucher1155(
    Tseries,
    signers[6].address,
    1,
    2,
    expandTo6Decimals(3),
    1,
    true
  );
  //Primary Buy
  await usdt
    .connect(owner)
    .transfer(signers[6].address, expandTo6Decimals(1000));
  await usdt
    .connect(signers[6])
    .approve(singleMarketplace.address, expandTo6Decimals(1000));
  await expect(singleMarketplace.Buy(Voucherbuy, VoucherSell, voucher,voucherNFT,false)).to.be.revertedWith("invalid price");
      });  

      it("ERROR custodial to custodial secondary buy :invalid Seller", async () => {
        //create collection
        await factory
          .connect(owner)
          .create1155Token(
            "T-series",
            owner.address,
            superOwner.address,
            usdt.address
          );
        const Tseries = await factory
          .connect(owner)
          .userLastNFTContracts(owner.address,0);
        const TRS = await new Template1155__factory(owner).attach(Tseries);
        //creating vouchers
        const TemplateVoucher = await new LazyMinting({
            _contract: TRS,
            _signer: signers[1],
          });
          const voucherNFT = await TemplateVoucher.createVoucher(
            Tseries,
            1,
            expandTo6Decimals(10),
            "TestURI",
            true,
            signers[2].address,
            expandTo6Decimals(0)
          );
          const Template1155Voucher = await new template1155Voucher({
            _contract: TRS,
            _signer: signers[1],
          });
          const voucher = await Template1155Voucher.createVoucher(
            Tseries,
            1,
            expandTo6Decimals(10),
            2,
            1,
            "TestURI",
            true,
            signers[2].address,
            expandTo6Decimals(0)
          );
        const sellerVoucher = new SellerVoucher({
          _contract: singleMarketplace,
          _signer: owner,
        });
        const VoucherSell = await sellerVoucher.createVoucher1155(
          Tseries,
          owner.address,
          1,
          2,
          expandTo6Decimals(10),
          1,
          true,
          true
        );
        const buyerVoucher = new BuyerVoucher({
          _contract: singleMarketplace,
          _signer: signers[6],
        });
        const Voucherbuy = await buyerVoucher.createVoucher1155(
          Tseries,
          signers[6].address,
          1,
          2,
          expandTo6Decimals(10),
          1,
          true
        );
        //Primary Buy
        await usdt
          .connect(owner)
          .transfer(signers[6].address, expandTo6Decimals(1000));
        await usdt
          .connect(owner)
          .approve(singleMarketplace.address, expandTo6Decimals(1000));
        await singleMarketplace.Buy(Voucherbuy, VoucherSell, voucher,voucherNFT,false);
        expect(await TRS.balanceOf(signers[6].address, 1)).to.be.eq(2);
        //Secondary Buy
        const TemplateVoucher2 = await new LazyMinting({
            _contract: TRS,
            _signer: signers[1],
          });
          const voucherNFT2 = await TemplateVoucher2.createVoucher(
            Tseries,
            1,
            expandTo6Decimals(10),
            "TestURI",
            true,
            signers[2].address,
            expandTo6Decimals(0)
          );
          const Template1155Voucher2 = await new template1155Voucher({
            _contract: TRS,
            _signer: signers[1],
          });
          const voucher2 = await Template1155Voucher2.createVoucher(
            Tseries,
            1,
            expandTo6Decimals(10),
            2,
            2,
            "TestURI",
            true,
            signers[2].address,
            expandTo6Decimals(0)
          );
        const sellerVoucher2 = new SellerVoucher({
          _contract: singleMarketplace,
          _signer: signers[6],
        });
        const VoucherSell2 = await sellerVoucher2.createVoucher1155(
          Tseries,
          signers[3].address,
          1,
          2,
          expandTo6Decimals(10),
          2,
          true,
          true
        );
        const buyerVoucher2 = new BuyerVoucher({
          _contract: singleMarketplace,
          _signer: signers[7],
        });
        const Voucherbuy2 = await buyerVoucher2.createVoucher1155(
          Tseries,
          signers[7].address,
          1,
          2,
          expandTo6Decimals(10),
          2,
          true
        );
        await usdt
          .connect(owner)
          .transfer(signers[7].address, expandTo6Decimals(1000));
        await usdt
          .connect(signers[7])
          .approve(singleMarketplace.address, expandTo6Decimals(1000));
        await TRS.connect(signers[6]).setApprovalForAll(singleMarketplace.address,true);
        await expect(singleMarketplace.Buy(Voucherbuy2, VoucherSell2, voucher2,voucherNFT2,false)).to.be.revertedWith("invalid Seller");
      });

      it("custodial to custodial secondary buy errror: invalid buyer", async () => {
        //create collection
        await factory
          .connect(owner)
          .create1155Token(
            "T-series",
            owner.address,
            superOwner.address,
            usdt.address
          );
        const Tseries = await factory
          .connect(owner)
          .userLastNFTContracts(owner.address,0);
        const TRS = await new Template1155__factory(owner).attach(Tseries);
        //creating vouchers
        const TemplateVoucher = await new LazyMinting({
            _contract: TRS,
            _signer: signers[1],
          });
          const voucherNFT = await TemplateVoucher.createVoucher(
            Tseries,
            1,
            expandTo6Decimals(10),
            "TestURI",
            true,
            signers[2].address,
            expandTo6Decimals(0)
          );
          const Template1155Voucher = await new template1155Voucher({
            _contract: TRS,
            _signer: signers[1],
          });
          const voucher = await Template1155Voucher.createVoucher(
            Tseries,
            1,
            expandTo6Decimals(10),
            2,
            1,
            "TestURI",
            true,
            signers[2].address,
            expandTo6Decimals(0)
          );
        const sellerVoucher = new SellerVoucher({
          _contract: singleMarketplace,
          _signer: owner,
        });
        const VoucherSell = await sellerVoucher.createVoucher1155(
          Tseries,
          owner.address,
          1,
          2,
          expandTo6Decimals(10),
          1,
          true,
          true
        );
        const buyerVoucher = new BuyerVoucher({
          _contract: singleMarketplace,
          _signer: signers[6],
        });
        const Voucherbuy = await buyerVoucher.createVoucher1155(
          Tseries,
          signers[6].address,
          1,
          2,
          expandTo6Decimals(10),
          1,
          true
        );
        //Primary Buy
        await usdt
          .connect(owner)
          .transfer(signers[6].address, expandTo6Decimals(1000));
        await usdt
          .connect(owner)
          .approve(singleMarketplace.address, expandTo6Decimals(1000));
        await singleMarketplace.Buy(Voucherbuy, VoucherSell, voucher,voucherNFT,false);
        expect(await TRS.balanceOf(signers[6].address, 1)).to.be.eq(2);
        //Secondary Buy
        const TemplateVoucher2 = await new LazyMinting({
            _contract: TRS,
            _signer: signers[1],
          });
          const voucherNFT2 = await TemplateVoucher2.createVoucher(
            Tseries,
            1,
            expandTo6Decimals(10),
            "TestURI",
            true,
            signers[2].address,
            expandTo6Decimals(0)
          );
          const Template1155Voucher2 = await new template1155Voucher({
            _contract: TRS,
            _signer: signers[1],
          });
          const voucher2 = await Template1155Voucher2.createVoucher(
            Tseries,
            1,
            expandTo6Decimals(10),
            2,
            2,
            "TestURI",
            true,
            signers[2].address,
            expandTo6Decimals(0)
          );
        const sellerVoucher2 = new SellerVoucher({
          _contract: singleMarketplace,
          _signer: signers[6],
        });
        const VoucherSell2 = await sellerVoucher2.createVoucher1155(
          Tseries,
          signers[6].address,
          1,
          2,
          expandTo6Decimals(10),
          2,
          true,
          true
        );
        const buyerVoucher2 = new BuyerVoucher({
          _contract: singleMarketplace,
          _signer: signers[7],
        });
        const Voucherbuy2 = await buyerVoucher2.createVoucher1155(
          Tseries,
          signers[3].address,
          1,
          2,
          expandTo6Decimals(10),
          2,
          true
        );
        await usdt
          .connect(owner)
          .transfer(signers[7].address, expandTo6Decimals(1000));
        await usdt
          .connect(signers[7])
          .approve(singleMarketplace.address, expandTo6Decimals(1000));
        await TRS.connect(signers[6]).setApprovalForAll(singleMarketplace.address,true);
        await expect(singleMarketplace.Buy(Voucherbuy2, VoucherSell2, voucher2,voucherNFT2,false)).to.be.revertedWith("invalid buyer");
      });

  it("custodial to noncustodial buy", async () => {
    //create collection
    await factory
      .connect(owner)
      .create1155Token(
        "T-series",
        owner.address,
        superOwner.address,
        usdt.address
      );
    const Tseries = await factory
      .connect(owner)
      .userLastNFTContracts(owner.address,0);
    const TRS = await new Template1155__factory(owner).attach(Tseries);
    const addressOfTemplate = Tseries;
    //creating vouchers
    const TemplateVoucher = await new LazyMinting({
        _contract: TRS,
        _signer: signers[1],
      });
      const voucherNFT = await TemplateVoucher.createVoucher(
        Tseries,
        1,
        expandTo6Decimals(10),
        "TestURI",
        true,
        signers[2].address,
        expandTo6Decimals(0)
      );
      const Template1155Voucher = await new template1155Voucher({
        _contract: TRS,
        _signer: signers[1],
      });
      const voucher = await Template1155Voucher.createVoucher(
        Tseries,
        1,
        expandTo6Decimals(10),
        2,
        1,
        "TestURI",
        true,
        signers[2].address,
        expandTo6Decimals(0)
      );
    const sellerVoucher = new SellerVoucher({
      _contract: singleMarketplace,
      _signer: owner,
    });
    const VoucherSell = await sellerVoucher.createVoucher1155(
      Tseries,
      owner.address,
      1,
      2,
      expandTo6Decimals(10),
      1,
      true,
      true
    );
    const buyerVoucher = new BuyerVoucher({
      _contract: singleMarketplace,
      _signer: signers[6],
    });
    const Voucherbuy = await buyerVoucher.createVoucher1155(
      Tseries,
      signers[6].address,
      1,
      2,
      expandTo6Decimals(10),
      1,
      false
    );
    //Primary Buy
    await usdt
      .connect(owner)
      .transfer(signers[6].address, expandTo6Decimals(1000));
    await usdt
      .connect(signers[6])
      .approve(singleMarketplace.address, expandTo6Decimals(1000));
    await singleMarketplace.Buy(Voucherbuy, VoucherSell, voucher,voucherNFT,false);
    expect(await TRS.balanceOf(signers[6].address, 1)).to.be.eq(2);
    //Secondary Buy
    const TemplateVoucher2 = await new LazyMinting({
        _contract: TRS,
        _signer: signers[1],
      });
      const voucherNFT2 = await TemplateVoucher2.createVoucher(
        Tseries,
        1,
        expandTo6Decimals(10),
        "TestURI",
        true,
        signers[2].address,
        expandTo6Decimals(0)
      );
      const Template1155Voucher2 = await new template1155Voucher({
        _contract: TRS,
        _signer: signers[1],
      });
      const voucher2 = await Template1155Voucher2.createVoucher(
        Tseries,
        1,
        expandTo6Decimals(10),
        2,
        2,
        "TestURI",
        true,
        signers[2].address,
        expandTo6Decimals(0)
      );
    const sellerVoucher2 = new SellerVoucher({
      _contract: singleMarketplace,
      _signer: signers[6],
    });
    const VoucherSell2 = await sellerVoucher2.createVoucher1155(
      Tseries,
      signers[6].address,
      1,
      2,
      expandTo6Decimals(10),
      2,
      true,
      true
    );
    const buyerVoucher2 = new BuyerVoucher({
      _contract: singleMarketplace,
      _signer: signers[7],
    });
    const Voucherbuy2 = await buyerVoucher2.createVoucher1155(
      Tseries,
      signers[7].address,
      1,
      2,
      expandTo6Decimals(10),
      2,
      false
    );
    await usdt
      .connect(owner)
      .transfer(signers[7].address, expandTo6Decimals(1000));
    await usdt
      .connect(signers[7])
      .approve(singleMarketplace.address, expandTo6Decimals(1000));
    await TRS.connect(signers[6]).setApprovalForAll(singleMarketplace.address,true);
    await singleMarketplace.Buy(Voucherbuy2,VoucherSell2,voucher2,voucherNFT2,false);
    expect(await TRS.balanceOf(signers[7].address, 1)).to.be.eq(2);
  });

  it("ERROR: custodial to noncustodial primary buy: invalid buyer", async () => {
    //create collection
    await factory
      .connect(owner)
      .create1155Token(
        "T-series",
        owner.address,
        superOwner.address,
        usdt.address
      );
    const Tseries = await factory
      .connect(owner)
      .userLastNFTContracts(owner.address,0);
    const TRS = await new Template1155__factory(owner).attach(Tseries);
    const addressOfTemplate = Tseries;
    //creating vouchers
    const TemplateVoucher = await new LazyMinting({
        _contract: TRS,
        _signer: signers[1],
      });
      const voucherNFT = await TemplateVoucher.createVoucher(
        Tseries,
        1,
        expandTo6Decimals(10),
        "TestURI",
        true,
        signers[2].address,
        expandTo6Decimals(0)
      );
      const Template1155Voucher = await new template1155Voucher({
        _contract: TRS,
        _signer: signers[1],
      });
      const voucher = await Template1155Voucher.createVoucher(
        Tseries,
        1,
        expandTo6Decimals(10),
        2,
        1,
        "TestURI",
        true,
        signers[2].address,
        expandTo6Decimals(0)
      );
    const sellerVoucher = new SellerVoucher({
      _contract: singleMarketplace,
      _signer: owner,
    });
    const VoucherSell = await sellerVoucher.createVoucher1155(
      Tseries,
      owner.address,
      1,
      2,
      expandTo6Decimals(10),
      1,
      true,
      true
    );
    const buyerVoucher = new BuyerVoucher({
      _contract: singleMarketplace,
      _signer: signers[6],
    });
    const Voucherbuy = await buyerVoucher.createVoucher1155(
      Tseries,
      signers[5].address,
      1,
      2,
      expandTo6Decimals(10),
      1,
      false
    );
    //Primary Buy
    await usdt
      .connect(owner)
      .transfer(signers[6].address, expandTo6Decimals(1000));
    await usdt
      .connect(signers[6])
      .approve(singleMarketplace.address, expandTo6Decimals(1000));
      await expect (singleMarketplace.Buy(Voucherbuy, VoucherSell, voucher,voucherNFT,false)).to.be.revertedWith("invalid buyer");
    });

  it("ERROR custodial to noncustodial primary buy: mismatched addresses", async () => {
    //create collection
    await factory
      .connect(owner)
      .create1155Token(
        "T-series",
        owner.address,
        superOwner.address,
        usdt.address
      );
    const Tseries = await factory
      .connect(owner)
      .userLastNFTContracts(owner.address,0);
    const TRS = await new Template1155__factory(owner).attach(Tseries);
    //creating vouchers
    const TemplateVoucher = await new LazyMinting({
        _contract: TRS,
        _signer: signers[1],
      });
      const voucherNFT = await TemplateVoucher.createVoucher(
        Tseries,
        1,
        expandTo6Decimals(10),
        "TestURI",
        true,
        signers[2].address,
        expandTo6Decimals(0)
      );
      const Template1155Voucher = await new template1155Voucher({
        _contract: TRS,
        _signer: signers[1],
      });
      const voucher = await Template1155Voucher.createVoucher(
        Tseries,
        1,
        expandTo6Decimals(10),
        2,
        1,
        "TestURI",
        true,
        signers[2].address,
        expandTo6Decimals(0)
      );
    const sellerVoucher = new SellerVoucher({
      _contract: singleMarketplace,
      _signer: owner,
    });
    const VoucherSell = await sellerVoucher.createVoucher1155(
      signers[4].address,
      owner.address,
      1,
      2,
      expandTo6Decimals(10),
      1,
      true,
      true
    );
    const buyerVoucher = new BuyerVoucher({
      _contract: singleMarketplace,
      _signer: signers[6],
    });
    const Voucherbuy = await buyerVoucher.createVoucher1155(
      Tseries,
      signers[6].address,
      1,
      2,
      expandTo6Decimals(10),
      1,
      false
    );
    //Primary Buy
    await usdt
      .connect(owner)
      .transfer(signers[6].address, expandTo6Decimals(1000));
    await usdt
      .connect(signers[6])
      .approve(singleMarketplace.address, expandTo6Decimals(1000));
    await expect (singleMarketplace.Buy(Voucherbuy, VoucherSell, voucher,voucherNFT,false)).to.be.revertedWith("Addresses invalid");
  });

  it("ERROR custodial to noncustodial primary buy: invalid price", async () => {
    //create collection
    await factory
      .connect(owner)
      .create1155Token(
        "T-series",
        owner.address,
        superOwner.address,
        usdt.address
      );
    const Tseries = await factory
      .connect(owner)
      .userLastNFTContracts(owner.address,0);
    const TRS = await new Template1155__factory(owner).attach(Tseries);
    const addressOfTemplate = Tseries;
    //creating vouchers
    const TemplateVoucher = await new LazyMinting({
        _contract: TRS,
        _signer: signers[1],
      });
      const voucherNFT = await TemplateVoucher.createVoucher(
        Tseries,
        1,
        expandTo6Decimals(10),
        "TestURI",
        true,
        signers[2].address,
        expandTo6Decimals(0)
      );
      const Template1155Voucher = await new template1155Voucher({
        _contract: TRS,
        _signer: signers[1],
      });
      const voucher = await Template1155Voucher.createVoucher(
        Tseries,
        1,
        expandTo6Decimals(10),
        2,
        1,
        "TestURI",
        true,
        signers[2].address,
        expandTo6Decimals(0)
      );
    const sellerVoucher = new SellerVoucher({
      _contract: singleMarketplace,
      _signer: owner,
    });
    const VoucherSell = await sellerVoucher.createVoucher1155(
      Tseries,
      owner.address,
      1,
      2,
      expandTo6Decimals(3),
      1,
      true,
      true
    );
    const buyerVoucher = new BuyerVoucher({
      _contract: singleMarketplace,
      _signer: signers[6],
    });
    const Voucherbuy = await buyerVoucher.createVoucher1155(
      Tseries,
      signers[6].address,
      1,
      2,
      expandTo6Decimals(3),
      1,
      false
    );
    //Primary Buy
    await usdt
      .connect(owner)
      .transfer(signers[6].address, expandTo6Decimals(1000));
    await usdt
      .connect(signers[6])
      .approve(singleMarketplace.address, expandTo6Decimals(1000));
    await expect(singleMarketplace.Buy(Voucherbuy, VoucherSell, voucher,voucherNFT,false)).to.be.revertedWith("invalid price");
  });

  it("ERROR custodial to noncustodial secondary buy: invalid Seller", async () => {
    //create collection
    await factory
      .connect(owner)
      .create1155Token(
        "T-series",
        owner.address,
        superOwner.address,
        usdt.address
      );
    const Tseries = await factory
      .connect(owner)
      .userLastNFTContracts(owner.address,0);
    const TRS = await new Template1155__factory(owner).attach(Tseries);
    const addressOfTemplate = Tseries;
    //creating vouchers
    const TemplateVoucher = await new LazyMinting({
        _contract: TRS,
        _signer: signers[1],
      });
      const voucherNFT = await TemplateVoucher.createVoucher(
        Tseries,
        1,
        expandTo6Decimals(10),
        "TestURI",
        true,
        signers[2].address,
        expandTo6Decimals(0)
      );
      const Template1155Voucher = await new template1155Voucher({
        _contract: TRS,
        _signer: signers[1],
      });
      const voucher = await Template1155Voucher.createVoucher(
        Tseries,
        1,
        expandTo6Decimals(10),
        2,
        1,
        "TestURI",
        true,
        signers[2].address,
        expandTo6Decimals(0)
      );
    const sellerVoucher = new SellerVoucher({
      _contract: singleMarketplace,
      _signer: owner,
    });
    const VoucherSell = await sellerVoucher.createVoucher1155(
      Tseries,
      owner.address,
      1,
      2,
      expandTo6Decimals(10),
      1,
      true,
      true
    );
    const buyerVoucher = new BuyerVoucher({
      _contract: singleMarketplace,
      _signer: signers[6],
    });
    const Voucherbuy = await buyerVoucher.createVoucher1155(
      Tseries,
      signers[6].address,
      1,
      2,
      expandTo6Decimals(10),
      1,
      false
    );
    //Primary Buy
    await usdt
      .connect(owner)
      .transfer(signers[6].address, expandTo6Decimals(1000));
    await usdt
      .connect(signers[6])
      .approve(singleMarketplace.address, expandTo6Decimals(1000));
    await singleMarketplace.Buy(Voucherbuy, VoucherSell, voucher,voucherNFT,false);
    expect(await TRS.balanceOf(signers[6].address, 1)).to.be.eq(2);
    //Secondary Buy
    const TemplateVoucher2 = await new LazyMinting({
        _contract: TRS,
        _signer: signers[1],
      });
      const voucherNFT2 = await TemplateVoucher2.createVoucher(
        Tseries,
        1,
        expandTo6Decimals(10),
        "TestURI",
        true,
        signers[2].address,
        expandTo6Decimals(0)
      );
      const Template1155Voucher2 = await new template1155Voucher({
        _contract: TRS,
        _signer: signers[1],
      });
      const voucher2 = await Template1155Voucher2.createVoucher(
        Tseries,
        1,
        expandTo6Decimals(10),
        2,
        2,
        "TestURI",
        true,
        signers[2].address,
        expandTo6Decimals(0)
      );
    const sellerVoucher2 = new SellerVoucher({
      _contract: singleMarketplace,
      _signer: signers[6],
    });
    const VoucherSell2 = await sellerVoucher2.createVoucher1155(
      Tseries,
      signers[3].address,
      1,
      2,
      expandTo6Decimals(10),
      2,
      true,
      true
    );
    const buyerVoucher2 = new BuyerVoucher({
      _contract: singleMarketplace,
      _signer: signers[7],
    });
    const Voucherbuy2 = await buyerVoucher2.createVoucher1155(
      Tseries,
      signers[7].address,
      1,
      2,
      expandTo6Decimals(10),
      2,
      false
    );
    await usdt
      .connect(owner)
      .transfer(signers[7].address, expandTo6Decimals(1000));
    await usdt
      .connect(signers[7])
      .approve(singleMarketplace.address, expandTo6Decimals(1000));
    await TRS.connect(signers[6]).setApprovalForAll(singleMarketplace.address,true);
    await expect(singleMarketplace.Buy(Voucherbuy2, VoucherSell2, voucher2,voucherNFT2,false)).to.be.revertedWith("invalid Seller");
  });

  it("ERROR custodial to noncustodial secondary buy: invalid buyer", async () => {
    //create collection
    await factory
      .connect(owner)
      .create1155Token(
        "T-series",
        owner.address,
        superOwner.address,
        usdt.address
      );
    const Tseries = await factory
      .connect(owner)
      .userLastNFTContracts(owner.address,0);
    const TRS = await new Template1155__factory(owner).attach(Tseries);
    const addressOfTemplate = Tseries;
    //creating vouchers
    const TemplateVoucher = await new LazyMinting({
        _contract: TRS,
        _signer: signers[1],
      });
      const voucherNFT = await TemplateVoucher.createVoucher(
        Tseries,
        1,
        expandTo6Decimals(10),
        "TestURI",
        true,
        signers[2].address,
        expandTo6Decimals(0)
      );
      const Template1155Voucher = await new template1155Voucher({
        _contract: TRS,
        _signer: signers[1],
      });
      const voucher = await Template1155Voucher.createVoucher(
        Tseries,
        1,
        expandTo6Decimals(10),
        2,
        1,
        "TestURI",
        true,
        signers[2].address,
        expandTo6Decimals(0)
      );
    const sellerVoucher = new SellerVoucher({
      _contract: singleMarketplace,
      _signer: owner,
    });
    const VoucherSell = await sellerVoucher.createVoucher1155(
      Tseries,
      owner.address,
      1,
      2,
      expandTo6Decimals(10),
      1,
      true,
      true
    );
    const buyerVoucher = new BuyerVoucher({
      _contract: singleMarketplace,
      _signer: signers[6],
    });
    const Voucherbuy = await buyerVoucher.createVoucher1155(
      Tseries,
      signers[6].address,
      1,
      2,
      expandTo6Decimals(10),
      1,
      false
    );
    //Primary Buy
    await usdt
      .connect(owner)
      .transfer(signers[6].address, expandTo6Decimals(1000));
    await usdt
      .connect(signers[6])
      .approve(singleMarketplace.address, expandTo6Decimals(1000));
    await singleMarketplace.Buy(Voucherbuy, VoucherSell, voucher,voucherNFT,false);
    expect(await TRS.balanceOf(signers[6].address, 1)).to.be.eq(2);
    //Secondary Buy
    const TemplateVoucher2 = await new LazyMinting({
        _contract: TRS,
        _signer: signers[1],
      });
      const voucherNFT2 = await TemplateVoucher2.createVoucher(
        Tseries,
        1,
        expandTo6Decimals(10),
        "TestURI",
        true,
        signers[2].address,
        expandTo6Decimals(0)
      );
      const Template1155Voucher2 = await new template1155Voucher({
        _contract: TRS,
        _signer: signers[1],
      });
      const voucher2 = await Template1155Voucher2.createVoucher(
        Tseries,
        1,
        expandTo6Decimals(10),
        2,
        2,
        "TestURI",
        true,
        signers[2].address,
        expandTo6Decimals(0)
      );
    const sellerVoucher2 = new SellerVoucher({
      _contract: singleMarketplace,
      _signer: signers[6],
    });
    const VoucherSell2 = await sellerVoucher2.createVoucher1155(
      Tseries,
      signers[6].address,
      1,
      2,
      expandTo6Decimals(10),
      2,
      true,
      true
    );
    const buyerVoucher2 = new BuyerVoucher({
      _contract: singleMarketplace,
      _signer: signers[7],
    });
    const Voucherbuy2 = await buyerVoucher2.createVoucher1155(
      Tseries,
      signers[3].address,
      1,
      2,
      expandTo6Decimals(10),
      2,
      false
    );
    await usdt
      .connect(owner)
      .transfer(signers[7].address, expandTo6Decimals(1000));
    await usdt
      .connect(signers[7])
      .approve(singleMarketplace.address, expandTo6Decimals(1000));
    await TRS.connect(signers[6]).setApprovalForAll(singleMarketplace.address,true);
    await expect(singleMarketplace.Buy(Voucherbuy2, VoucherSell2, voucher2,voucherNFT2,false)).to.be.revertedWith("invalid buyer");
  });

  it("non custodial to custodial buy", async () => {
    //create collection
    await factory
      .connect(owner)
      .create1155Token(
        "T-series",
        owner.address,
        superOwner.address,
        usdt.address
      );
    const Tseries = await factory
      .connect(owner)
      .userLastNFTContracts(owner.address,0);
    const TRS = await new Template1155__factory(owner).attach(Tseries);
    const addressOfTemplate = Tseries;
    //creating vouchers
    const TemplateVoucher = await new LazyMinting({
        _contract: TRS,
        _signer: signers[1],
      });
      const voucherNFT = await TemplateVoucher.createVoucher(
        Tseries,
        1,
        expandTo6Decimals(10),
        "TestURI",
        true,
        signers[2].address,
        expandTo6Decimals(0)
      );
      const Template1155Voucher = await new template1155Voucher({
        _contract: TRS,
        _signer: signers[1],
      });
      const voucher = await Template1155Voucher.createVoucher(
        Tseries,
        1,
        expandTo6Decimals(10),
        2,
        1,
        "TestURI",
        true,
        signers[2].address,
        expandTo6Decimals(0)
      );
    const sellerVoucher = new SellerVoucher({
      _contract: singleMarketplace,
      _signer: owner,
    });
    const VoucherSell = await sellerVoucher.createVoucher1155(
      Tseries,
      owner.address,
      1,
      2,
      expandTo6Decimals(10),
      1,
      true,
      false
    );
    const buyerVoucher = new BuyerVoucher({
      _contract: singleMarketplace,
      _signer: signers[6],
    });
    const Voucherbuy = await buyerVoucher.createVoucher1155(
      Tseries,
      signers[6].address,
      1,
      2,
      expandTo6Decimals(10),
      1,
      true
    );
    //Primary Buy

    await usdt
      .connect(owner)
      .transfer(signers[6].address, expandTo6Decimals(1000));
    await usdt
      .connect(owner)
      .approve(singleMarketplace.address, expandTo6Decimals(1000));
    await singleMarketplace.Buy(Voucherbuy, VoucherSell, voucher,voucherNFT,false);
    expect(await TRS.balanceOf(signers[6].address, 1)).to.be.eq(2);
    //Secondary Buy
    const TemplateVoucher2 = await new LazyMinting({
        _contract: TRS,
        _signer: signers[1],
      });
      const voucherNFT2 = await TemplateVoucher2.createVoucher(
        Tseries,
        1,
        expandTo6Decimals(10),
        "TestURI",
        true,
        signers[2].address,
        expandTo6Decimals(0)
      );
      const Template1155Voucher2 = await new template1155Voucher({
        _contract: TRS,
        _signer: signers[1],
      });
      const voucher2 = await Template1155Voucher2.createVoucher(
        Tseries,
        1,
        expandTo6Decimals(10),
        2,
        2,
        "TestURI",
        true,
        signers[2].address,
        expandTo6Decimals(0)
      );
    const sellerVoucher2 = new SellerVoucher({
      _contract: singleMarketplace,
      _signer: signers[6],
    });
    const VoucherSell2 = await sellerVoucher2.createVoucher1155(
      Tseries,
      signers[6].address,
      1,
      2,
      expandTo6Decimals(10),
      2,
      true,
      false
    );
    const buyerVoucher2 = new BuyerVoucher({
      _contract: singleMarketplace,
      _signer: signers[7],
    });
    const Voucherbuy2 = await buyerVoucher2.createVoucher1155(
      Tseries,
      signers[7].address,
      1,
      2,
      expandTo6Decimals(10),
      2,
      true
    );
    await usdt
      .connect(owner)
      .transfer(signers[7].address, expandTo6Decimals(1000));
    await usdt
      .connect(signers[7])
      .approve(singleMarketplace.address, expandTo6Decimals(1000));
    await TRS.connect(signers[6]).setApprovalForAll(singleMarketplace.address,true);  
    await singleMarketplace.Buy(Voucherbuy2, VoucherSell2, voucher2,voucherNFT2,false);
    expect(await TRS.balanceOf(signers[7].address, 1)).to.be.eq(2);
  });

  it("ERROR non custodial to custodial primary buy: invalid buyer", async () => {
    //create collection
    await factory
      .connect(owner)
      .create1155Token(
        "T-series",
        owner.address,
        superOwner.address,
        usdt.address
      );
    const Tseries = await factory
      .connect(owner)
      .userLastNFTContracts(owner.address,0);
    const TRS = await new Template1155__factory(owner).attach(Tseries);
    const addressOfTemplate = Tseries;
    //creating vouchers
    const TemplateVoucher = await new LazyMinting({
        _contract: TRS,
        _signer: signers[1],
      });
      const voucherNFT = await TemplateVoucher.createVoucher(
        Tseries,
        1,
        expandTo6Decimals(10),
        "TestURI",
        true,
        signers[2].address,
        expandTo6Decimals(0)
      );
      const Template1155Voucher = await new template1155Voucher({
        _contract: TRS,
        _signer: signers[1],
      });
      const voucher = await Template1155Voucher.createVoucher(
        Tseries,
        1,
        expandTo6Decimals(10),
        2,
        1,
        "TestURI",
        true,
        signers[2].address,
        expandTo6Decimals(0)
      );
    const sellerVoucher = new SellerVoucher({
      _contract: singleMarketplace,
      _signer: owner,
    });
    const VoucherSell = await sellerVoucher.createVoucher1155(
      Tseries,
      owner.address,
      1,
      2,
      expandTo6Decimals(10),
      1,
      true,
      false
    );
    const buyerVoucher = new BuyerVoucher({
      _contract: singleMarketplace,
      _signer: signers[6],
    });
    const Voucherbuy = await buyerVoucher.createVoucher1155(
      Tseries,
      signers[3].address,
      1,
      2,
      expandTo6Decimals(10),
      1,
      true
    );
    //Primary Buy

    await usdt
      .connect(owner)
      .transfer(signers[6].address, expandTo6Decimals(1000));
    await usdt
      .connect(owner)
      .approve(singleMarketplace.address, expandTo6Decimals(1000));
    await expect(singleMarketplace.Buy(Voucherbuy, VoucherSell, voucher,voucherNFT,false)).to.be.revertedWith("invalid buyer");
  });

  it("non custodial to custodial primary buy: mismatched addresses", async () => {
    //create collection
    await factory
      .connect(owner)
      .create1155Token(
        "T-series",
        owner.address,
        superOwner.address,
        usdt.address
      );
    const Tseries = await factory
      .connect(owner)
      .userLastNFTContracts(owner.address,0);
    const TRS = await new Template1155__factory(owner).attach(Tseries);
    //creating vouchers
    const TemplateVoucher = await new LazyMinting({
        _contract: TRS,
        _signer: signers[1],
      });
      const voucherNFT = await TemplateVoucher.createVoucher(
        Tseries,
        1,
        expandTo6Decimals(10),
        "TestURI",
        true,
        signers[2].address,
        expandTo6Decimals(0)
      );
      const Template1155Voucher = await new template1155Voucher({
        _contract: TRS,
        _signer: signers[1],
      });
      const voucher = await Template1155Voucher.createVoucher(
        Tseries,
        1,
        expandTo6Decimals(10),
        2,
        1,
        "TestURI",
        true,
        signers[2].address,
        expandTo6Decimals(0)
      );
    const sellerVoucher = new SellerVoucher({
      _contract: singleMarketplace,
      _signer: owner,
    });
    const VoucherSell = await sellerVoucher.createVoucher1155(
      signers[4].address,
      owner.address,
      1,
      2,
      expandTo6Decimals(10),
      1,
      true,
      false
    );
    const buyerVoucher = new BuyerVoucher({
      _contract: singleMarketplace,
      _signer: signers[6],
    });
    const Voucherbuy = await buyerVoucher.createVoucher1155(
      Tseries,
      signers[6].address,
      1,
      2,
      expandTo6Decimals(10),
      1,
      true
    );
    //Primary Buy

    await usdt
      .connect(owner)
      .transfer(signers[6].address, expandTo6Decimals(1000));
    await usdt
      .connect(owner)
      .approve(singleMarketplace.address, expandTo6Decimals(1000));
    await expect(singleMarketplace.Buy(Voucherbuy, VoucherSell, voucher,voucherNFT,false)).to.be.revertedWith("");
  });

  it("non custodial to custodial primary buy: invalid price", async () => {
    //create collection
    await factory
      .connect(owner)
      .create1155Token(
        "T-series",
        owner.address,
        superOwner.address,
        usdt.address
      );
    const Tseries = await factory
      .connect(owner)
      .userLastNFTContracts(owner.address,0);
    const TRS = await new Template1155__factory(owner).attach(Tseries);
    const addressOfTemplate = Tseries;
    //creating vouchers
    const TemplateVoucher = await new LazyMinting({
        _contract: TRS,
        _signer: signers[1],
      });
      const voucherNFT = await TemplateVoucher.createVoucher(
        Tseries,
        1,
        expandTo6Decimals(10),
        "TestURI",
        true,
        signers[2].address,
        expandTo6Decimals(0)
      );
      const Template1155Voucher = await new template1155Voucher({
        _contract: TRS,
        _signer: signers[1],
      });
      const voucher = await Template1155Voucher.createVoucher(
        Tseries,
        1,
        expandTo6Decimals(10),
        2,
        1,
        "TestURI",
        true,
        signers[2].address,
        expandTo6Decimals(0)
      );
    const sellerVoucher = new SellerVoucher({
      _contract: singleMarketplace,
      _signer: owner,
    });
    const VoucherSell = await sellerVoucher.createVoucher1155(
      Tseries,
      owner.address,
      1,
      2,
      expandTo6Decimals(10),
      1,
      true,
      false
    );
    const buyerVoucher = new BuyerVoucher({
      _contract: singleMarketplace,
      _signer: signers[6],
    });
    const Voucherbuy = await buyerVoucher.createVoucher1155(
      Tseries,
      signers[6].address,
      1,
      2,
      expandTo6Decimals(9),
      1,
      true
    );
    //Primary Buy

    await usdt
      .connect(owner)
      .transfer(signers[6].address, expandTo6Decimals(1000));
    await usdt
      .connect(owner)
      .approve(singleMarketplace.address, expandTo6Decimals(1000));
    await expect(singleMarketplace.Buy(Voucherbuy, VoucherSell, voucher,voucherNFT,false)).to.be.revertedWith("Prices invalid");
  });

  it("ERROR non custodial to custodial secondary buy: invalid Seller", async () => {
    //create collection
    await factory
      .connect(owner)
      .create1155Token(
        "T-series",
        owner.address,
        superOwner.address,
        usdt.address
      );
    const Tseries = await factory
      .connect(owner)
      .userLastNFTContracts(owner.address,0);
    const TRS = await new Template1155__factory(owner).attach(Tseries);
    const addressOfTemplate = Tseries;
    //creating vouchers
    const TemplateVoucher = await new LazyMinting({
        _contract: TRS,
        _signer: signers[1],
      });
      const voucherNFT = await TemplateVoucher.createVoucher(
        Tseries,
        1,
        expandTo6Decimals(10),
        "TestURI",
        true,
        signers[2].address,
        expandTo6Decimals(0)
      );
      const Template1155Voucher = await new template1155Voucher({
        _contract: TRS,
        _signer: signers[1],
      });
      const voucher = await Template1155Voucher.createVoucher(
        Tseries,
        1,
        expandTo6Decimals(10),
        2,
        1,
        "TestURI",
        true,
        signers[2].address,
        expandTo6Decimals(0)
      );
    const sellerVoucher = new SellerVoucher({
      _contract: singleMarketplace,
      _signer: owner,
    });
    const VoucherSell = await sellerVoucher.createVoucher1155(
      Tseries,
      owner.address,
      1,
      2,
      expandTo6Decimals(10),
      1,
      true,
      false
    );
    const buyerVoucher = new BuyerVoucher({
      _contract: singleMarketplace,
      _signer: signers[6],
    });
    const Voucherbuy = await buyerVoucher.createVoucher1155(
      Tseries,
      signers[6].address,
      1,
      2,
      expandTo6Decimals(10),
      1,
      true
    );
    //Primary Buy

    await usdt
      .connect(owner)
      .transfer(signers[6].address, expandTo6Decimals(1000));
    await usdt
      .connect(owner)
      .approve(singleMarketplace.address, expandTo6Decimals(1000));
    await singleMarketplace.Buy(Voucherbuy, VoucherSell, voucher,voucherNFT,false);
    expect(await TRS.balanceOf(signers[6].address, 1)).to.be.eq(2);
    //Secondary Buy
    const TemplateVoucher2 = await new LazyMinting({
        _contract: TRS,
        _signer: signers[1],
      });
      const voucherNFT2 = await TemplateVoucher2.createVoucher(
        Tseries,
        1,
        expandTo6Decimals(10),
        "TestURI",
        true,
        signers[2].address,
        expandTo6Decimals(0)
      );
      const Template1155Voucher2 = await new template1155Voucher({
        _contract: TRS,
        _signer: signers[1],
      });
      const voucher2 = await Template1155Voucher2.createVoucher(
        Tseries,
        1,
        expandTo6Decimals(10),
        2,
        2,
        "TestURI",
        true,
        signers[2].address,
        expandTo6Decimals(0)
      );
    const sellerVoucher2 = new SellerVoucher({
      _contract: singleMarketplace,
      _signer: signers[6],
    });
    const VoucherSell2 = await sellerVoucher2.createVoucher1155(
      Tseries,
      signers[4].address,
      1,
      2,
      expandTo6Decimals(10),
      2,
      true,
      false
    );
    const buyerVoucher2 = new BuyerVoucher({
      _contract: singleMarketplace,
      _signer: signers[7],
    });
    const Voucherbuy2 = await buyerVoucher2.createVoucher1155(
      Tseries,
      signers[7].address,
      1,
      2,
      expandTo6Decimals(10),
      2,
      true
    );
    await usdt
      .connect(owner)
      .transfer(signers[7].address, expandTo6Decimals(1000));
    await usdt
      .connect(signers[7])
      .approve(singleMarketplace.address, expandTo6Decimals(1000));
    await TRS.connect(signers[6]).setApprovalForAll(singleMarketplace.address,true);  
    await expect(singleMarketplace.Buy(Voucherbuy2, VoucherSell2, voucher2,voucherNFT2,false)).to.be.revertedWith("invalid Seller");
  });

  it("ERROR non custodial to custodial secondary buy: invalid buyer", async () => {
    //create collection
    await factory
      .connect(owner)
      .create1155Token(
        "T-series",
        owner.address,
        superOwner.address,
        usdt.address
      );
    const Tseries = await factory
      .connect(owner)
      .userLastNFTContracts(owner.address,0);
    const TRS = await new Template1155__factory(owner).attach(Tseries);
    const addressOfTemplate = Tseries;
    //creating vouchers
    const TemplateVoucher = await new LazyMinting({
        _contract: TRS,
        _signer: signers[1],
      });
      const voucherNFT = await TemplateVoucher.createVoucher(
        Tseries,
        1,
        expandTo6Decimals(10),
        "TestURI",
        true,
        signers[2].address,
        expandTo6Decimals(0)
      );
      const Template1155Voucher = await new template1155Voucher({
        _contract: TRS,
        _signer: signers[1],
      });
      const voucher = await Template1155Voucher.createVoucher(
        Tseries,
        1,
        expandTo6Decimals(10),
        2,
        1,
        "TestURI",
        true,
        signers[2].address,
        expandTo6Decimals(0)
      );
    const sellerVoucher = new SellerVoucher({
      _contract: singleMarketplace,
      _signer: owner,
    });
    const VoucherSell = await sellerVoucher.createVoucher1155(
      Tseries,
      owner.address,
      1,
      2,
      expandTo6Decimals(10),
      1,
      true,
      false
    );
    const buyerVoucher = new BuyerVoucher({
      _contract: singleMarketplace,
      _signer: signers[6],
    });
    const Voucherbuy = await buyerVoucher.createVoucher1155(
      Tseries,
      signers[6].address,
      1,
      2,
      expandTo6Decimals(10),
      1,
      true
    );
    //Primary Buy

    await usdt
      .connect(owner)
      .transfer(signers[6].address, expandTo6Decimals(1000));
    await usdt
      .connect(owner)
      .approve(singleMarketplace.address, expandTo6Decimals(1000));
    await singleMarketplace.Buy(Voucherbuy, VoucherSell, voucher,voucherNFT,false);
    expect(await TRS.balanceOf(signers[6].address, 1)).to.be.eq(2);
    //Secondary Buy
    const TemplateVoucher2 = await new LazyMinting({
        _contract: TRS,
        _signer: signers[1],
      });
      const voucherNFT2 = await TemplateVoucher2.createVoucher(
        Tseries,
        1,
        expandTo6Decimals(10),
        "TestURI",
        true,
        signers[2].address,
        expandTo6Decimals(0)
      );
      const Template1155Voucher2 = await new template1155Voucher({
        _contract: TRS,
        _signer: signers[1],
      });
      const voucher2 = await Template1155Voucher2.createVoucher(
        Tseries,
        1,
        expandTo6Decimals(10),
        2,
        2,
        "TestURI",
        true,
        signers[2].address,
        expandTo6Decimals(0)
      );
    const sellerVoucher2 = new SellerVoucher({
      _contract: singleMarketplace,
      _signer: signers[6],
    });
    const VoucherSell2 = await sellerVoucher2.createVoucher1155(
      Tseries,
      signers[6].address,
      1,
      2,
      expandTo6Decimals(10),
      2,
      true,
      false
    );
    const buyerVoucher2 = new BuyerVoucher({
      _contract: singleMarketplace,
      _signer: signers[7],
    });
    const Voucherbuy2 = await buyerVoucher2.createVoucher1155(
      Tseries,
      signers[2].address,
      1,
      2,
      expandTo6Decimals(10),
      2,
      true
    );
    await usdt
      .connect(owner)
      .transfer(signers[7].address, expandTo6Decimals(1000));
    await usdt
      .connect(signers[7])
      .approve(singleMarketplace.address, expandTo6Decimals(1000));
    await TRS.connect(signers[6]).setApprovalForAll(singleMarketplace.address,true);  
    await expect(singleMarketplace.Buy(Voucherbuy2, VoucherSell2, voucher2,voucherNFT2,false)).to.be.revertedWith("invalid buyer");
  });

  it("non custodial to non custodial buy", async () => {
    await factory
      .connect(owner)
      .create1155Token(
        "T-series",
        owner.address,
        superOwner.address,
        usdt.address
      );
    const Tseries = await factory
      .connect(owner)
      .userLastNFTContracts(owner.address,0);
    const TRS = await new Template1155__factory(owner).attach(Tseries);
    const addressOfTemplate = Tseries;
    //creating vouchers
    const TemplateVoucher = await new LazyMinting({
        _contract: TRS,
        _signer: signers[1],
      });
      const voucherNFT = await TemplateVoucher.createVoucher(
        Tseries,
        1,
        expandTo6Decimals(10),
        "TestURI",
        true,
        signers[2].address,
        expandTo6Decimals(0)
      );
      const Template1155Voucher = await new template1155Voucher({
        _contract: TRS,
        _signer: signers[1],
      });
      const voucher = await Template1155Voucher.createVoucher(
        Tseries,
        1,
        expandTo6Decimals(10),
        2,
        1,
        "TestURI",
        true,
        signers[2].address,
        expandTo6Decimals(0)
      );
    const sellerVoucher = new SellerVoucher({
      _contract: singleMarketplace,
      _signer: owner,
    });
    const VoucherSell = await sellerVoucher.createVoucher1155(
      Tseries,
      owner.address,
      1,
      2,
      expandTo6Decimals(10),
      1,
      true,
      false
    );
    const buyerVoucher = new BuyerVoucher({
      _contract: singleMarketplace,
      _signer: signers[6],
    });
    const Voucherbuy = await buyerVoucher.createVoucher1155(
      Tseries,
      signers[6].address,
      1,
      2,
      expandTo6Decimals(10),
      1,
      false
    );
    //Primary Buy

    await usdt
      .connect(owner)
      .transfer(signers[6].address, expandTo6Decimals(1000));
    await usdt
      .connect(signers[6])
      .approve(singleMarketplace.address, expandTo6Decimals(1000));
    await singleMarketplace.Buy(Voucherbuy, VoucherSell, voucher,voucherNFT,false);
    expect(await TRS.balanceOf(signers[6].address, 1)).to.be.eq(2);
    //Secondary Buy
    const TemplateVoucher2 = await new LazyMinting({
        _contract: TRS,
        _signer: signers[1],
      });
      const voucherNFT2 = await TemplateVoucher2.createVoucher(
        Tseries,
        1,
        expandTo6Decimals(10),
        "TestURI",
        true,
        signers[2].address,
        expandTo6Decimals(0)
      );
      const Template1155Voucher2 = await new template1155Voucher({
        _contract: TRS,
        _signer: signers[1],
      });
      const voucher2 = await Template1155Voucher2.createVoucher(
        Tseries,
        1,
        expandTo6Decimals(10),
        2,
        2,
        "TestURI",
        true,
        signers[2].address,
        expandTo6Decimals(0)
      );
    const sellerVoucher2 = new SellerVoucher({
      _contract: singleMarketplace,
      _signer: signers[6],
    });
    const VoucherSell2 = await sellerVoucher2.createVoucher1155(
      Tseries,
      signers[6].address,
      1,
      2,
      expandTo6Decimals(10),
      2,
      true,
      false
    );
    const buyerVoucher2 = new BuyerVoucher({
      _contract: singleMarketplace,
      _signer: signers[7],
    });
    const Voucherbuy2 = await buyerVoucher2.createVoucher1155(
      Tseries,
      signers[7].address,
      1,
      2,
      expandTo6Decimals(10),
      2,
      false
    );
    await usdt
      .connect(owner)
      .transfer(signers[7].address, expandTo6Decimals(1000));
    await usdt
      .connect(signers[7])
      .approve(singleMarketplace.address, expandTo6Decimals(1000));
    await TRS.connect(signers[6]).setApprovalForAll(singleMarketplace.address,true);
    await singleMarketplace.Buy(Voucherbuy2, VoucherSell2, voucher2,voucherNFT2,false);
    expect(await TRS.balanceOf(signers[7].address, 1)).to.be.eq(2);
  
});

it("non custodial to non custodial buy : mismatched addresses", async () => {
  
  await factory
    .connect(owner)
    .create1155Token(
      "T-series",
      owner.address,
      superOwner.address,
      usdt.address
    );
    
  const Tseries = await factory
    .connect(owner)
    .userLastNFTContracts(owner.address,0);
    
  const TRS = await new Template1155__factory(owner).attach(Tseries);
  
  //creating vouchers
  const TemplateVoucher = await new LazyMinting({
    _contract: TRS,
    _signer: signers[1],
  });
  const voucherNFT = await TemplateVoucher.createVoucher(
    Tseries,
    1,
    expandTo6Decimals(10),
    "TestURI",
    true,
    signers[2].address,
    expandTo6Decimals(0)
  );
  const Template1155Voucher = await new template1155Voucher({
    _contract: TRS,
    _signer: signers[1],
  });
  const voucher = await Template1155Voucher.createVoucher(
    Tseries,
    1,
    expandTo6Decimals(10),
    2,
    1,
    "TestURI",
    true,
    signers[2].address,
    expandTo6Decimals(0)
  );
  const sellerVoucher = new SellerVoucher({
    _contract: singleMarketplace,
    _signer: owner,
  });
  
  const VoucherSell = await sellerVoucher.createVoucher1155(
    signers[4].address,
    owner.address,
    1,
    2,
    expandTo6Decimals(10),
    1,
    true,
    false
  );
  
  const buyerVoucher = new BuyerVoucher({
    _contract: singleMarketplace,
    _signer: signers[6],
  });
  
  const Voucherbuy = await buyerVoucher.createVoucher1155(
    Tseries,
    signers[6].address,
    1,
    2,
    expandTo6Decimals(10),
    1,
    false
  );
  //Primary Buy
  
  await usdt
    .connect(owner)
    .transfer(signers[6].address, expandTo6Decimals(1000));
    
  await usdt
    .connect(signers[6])
    .approve(singleMarketplace.address, expandTo6Decimals(1000));
    
  await expect( singleMarketplace.Buy(Voucherbuy, VoucherSell, voucher,voucherNFT,false)).to.be.revertedWith("");
});

it("ERROR non custodial to non custodial primary buy: invalid price", async () => {
  await factory
    .connect(owner)
    .create1155Token(
      "T-series",
      owner.address,
      superOwner.address,
      usdt.address
    );
  const Tseries = await factory
    .connect(owner)
    .userLastNFTContracts(owner.address,0);
  const TRS = await new Template1155__factory(owner).attach(Tseries);
  const addressOfTemplate = Tseries;
  //creating vouchers
  const TemplateVoucher = await new LazyMinting({
    _contract: TRS,
    _signer: signers[1],
  });
  const voucherNFT = await TemplateVoucher.createVoucher(
    Tseries,
    1,
    expandTo6Decimals(10),
    "TestURI",
    true,
    signers[2].address,
    expandTo6Decimals(0)
  );
  const Template1155Voucher = await new template1155Voucher({
    _contract: TRS,
    _signer: signers[1],
  });
  const voucher = await Template1155Voucher.createVoucher(
    Tseries,
    1,
    expandTo6Decimals(10),
    2,
    1,
    "TestURI",
    true,
    signers[2].address,
    expandTo6Decimals(0)
  );
  const sellerVoucher = new SellerVoucher({
    _contract: singleMarketplace,
    _signer: owner,
  });
  const VoucherSell = await sellerVoucher.createVoucher1155(
    Tseries,
    owner.address,
    1,
    2,
    expandTo6Decimals(10),
    1,
    true,
    false
  );
  const buyerVoucher = new BuyerVoucher({
    _contract: singleMarketplace,
    _signer: signers[6],
  });
  const Voucherbuy = await buyerVoucher.createVoucher1155(
    Tseries,
    signers[6].address,
    1,
    2,
    expandTo6Decimals(9),
    1,
    false
  );
  //Primary Buy

  await usdt
    .connect(owner)
    .transfer(signers[6].address, expandTo6Decimals(1000));
  await usdt
    .connect(signers[6])
    .approve(singleMarketplace.address, expandTo6Decimals(1000));
  await expect(singleMarketplace.Buy(Voucherbuy, VoucherSell, voucher,voucherNFT,false)).to.be.revertedWith("Prices invalid");
});

it("ERROR non custodial to non custodial primary buy:invalid buyer", async () => {
  await factory
    .connect(owner)
    .create1155Token(
      "T-series",
      owner.address,
      superOwner.address,
      usdt.address
    );
  const Tseries = await factory
    .connect(owner)
    .userLastNFTContracts(owner.address,0);
  const TRS = await new Template1155__factory(owner).attach(Tseries);
  const addressOfTemplate = Tseries;
  //creating vouchers
  const TemplateVoucher = await new LazyMinting({
    _contract: TRS,
    _signer: signers[1],
  });
  const voucherNFT = await TemplateVoucher.createVoucher(
    Tseries,
    1,
    expandTo6Decimals(10),
    "TestURI",
    true,
    signers[2].address,
    expandTo6Decimals(0)
  );
  const Template1155Voucher = await new template1155Voucher({
    _contract: TRS,
    _signer: signers[1],
  });
  const voucher = await Template1155Voucher.createVoucher(
    Tseries,
    1,
    expandTo6Decimals(10),
    2,
    1,
    "TestURI",
    true,
    signers[2].address,
    expandTo6Decimals(0)
  );
  const sellerVoucher = new SellerVoucher({
    _contract: singleMarketplace,
    _signer: owner,
  });
  const VoucherSell = await sellerVoucher.createVoucher1155(
    Tseries,
    owner.address,
    1,
    2,
    expandTo6Decimals(10),
    1,
    true,
    false
  );
  const buyerVoucher = new BuyerVoucher({
    _contract: singleMarketplace,
    _signer: signers[6],
  });
  const Voucherbuy = await buyerVoucher.createVoucher1155(
    Tseries,
    signers[2].address,
    1,
    2,
    expandTo6Decimals(10),
    1,
    false
  );
  //Primary Buy

  await usdt
    .connect(owner)
    .transfer(signers[6].address, expandTo6Decimals(1000));
  await usdt
    .connect(signers[6])
    .approve(singleMarketplace.address, expandTo6Decimals(1000));
  await expect(singleMarketplace.Buy(Voucherbuy, VoucherSell, voucher,voucherNFT,false)).to.be.revertedWith("invalid buyer");
});

it("ERROR: non custodial to non custodial secondary buy: invalid Seller", async () => {
  await factory
    .connect(owner)
    .create1155Token(
      "T-series",
      owner.address,
      superOwner.address,
      usdt.address
    );
  const Tseries = await factory
    .connect(owner)
    .userLastNFTContracts(owner.address,0);
  const TRS = await new Template1155__factory(owner).attach(Tseries);
  const addressOfTemplate = Tseries;
  //creating vouchers
  const TemplateVoucher = await new LazyMinting({
    _contract: TRS,
    _signer: signers[1],
  });
  const voucherNFT = await TemplateVoucher.createVoucher(
    Tseries,
    1,
    expandTo6Decimals(10),
    "TestURI",
    true,
    signers[2].address,
    expandTo6Decimals(0)
  );
  const Template1155Voucher = await new template1155Voucher({
    _contract: TRS,
    _signer: signers[1],
  });
  const voucher = await Template1155Voucher.createVoucher(
    Tseries,
    1,
    expandTo6Decimals(10),
    2,
    1,
    "TestURI",
    true,
    signers[2].address,
    expandTo6Decimals(0)
  );
  const sellerVoucher = new SellerVoucher({
    _contract: singleMarketplace,
    _signer: owner,
  });
  const VoucherSell = await sellerVoucher.createVoucher1155(
    Tseries,
    owner.address,
    1,
    2,
    expandTo6Decimals(10),
    1,
    true,
    false
  );
  const buyerVoucher = new BuyerVoucher({
    _contract: singleMarketplace,
    _signer: signers[6],
  });
  const Voucherbuy = await buyerVoucher.createVoucher1155(
    Tseries,
    signers[6].address,
    1,
    2,
    expandTo6Decimals(10),
    1,
    false
  );
  //Primary Buy

  await usdt
    .connect(owner)
    .transfer(signers[6].address, expandTo6Decimals(1000));
  await usdt
    .connect(signers[6])
    .approve(singleMarketplace.address, expandTo6Decimals(1000));
  await singleMarketplace.Buy(Voucherbuy, VoucherSell, voucher,voucherNFT,false);
  expect(await TRS.balanceOf(signers[6].address, 1)).to.be.eq(2);
  //Secondary Buy
  const TemplateVoucher2 = await new LazyMinting({
    _contract: TRS,
    _signer: signers[1],
  });
  const voucherNFT2 = await TemplateVoucher2.createVoucher(
    Tseries,
    1,
    expandTo6Decimals(10),
    "TestURI",
    true,
    signers[2].address,
    expandTo6Decimals(0)
  );
  const Template1155Voucher2 = await new template1155Voucher({
    _contract: TRS,
    _signer: signers[1],
  });
  const voucher2 = await Template1155Voucher2.createVoucher(
    Tseries,
    1,
    expandTo6Decimals(10),
    2,
    2,
    "TestURI",
    true,
    signers[2].address,
    expandTo6Decimals(0)
  );
  const sellerVoucher2 = new SellerVoucher({
    _contract: singleMarketplace,
    _signer: signers[6],
  });
  const VoucherSell2 = await sellerVoucher2.createVoucher1155(
    Tseries,
    signers[3].address,
    1,
    2,
    expandTo6Decimals(10),
    2,
    true,
    false
  );
  const buyerVoucher2 = new BuyerVoucher({
    _contract: singleMarketplace,
    _signer: signers[7],
  });
  const Voucherbuy2 = await buyerVoucher2.createVoucher1155(
    Tseries,
    signers[7].address,
    1,
    2,
    expandTo6Decimals(10),
    2,
    false
  );
  await usdt
    .connect(owner)
    .transfer(signers[7].address, expandTo6Decimals(1000));
  await usdt
    .connect(signers[7])
    .approve(singleMarketplace.address, expandTo6Decimals(1000));
  await TRS.connect(signers[6]).setApprovalForAll(singleMarketplace.address,true);
  await expect(singleMarketplace.Buy(Voucherbuy2, VoucherSell2, voucher2,voucherNFT2,false)).to.be.revertedWith("invalid Seller");
});

it("ERROR non custodial to non custodial buy: invalid buyer", async () => {
  await factory
    .connect(owner)
    .create1155Token(
      "T-series",
      owner.address,
      superOwner.address,
      usdt.address
    );
  const Tseries = await factory
    .connect(owner)
    .userLastNFTContracts(owner.address,0);
  const TRS = await new Template1155__factory(owner).attach(Tseries);
  const addressOfTemplate = Tseries;
  //creating vouchers
  const TemplateVoucher = await new LazyMinting({
    _contract: TRS,
    _signer: signers[1],
  });
  const voucherNFT = await TemplateVoucher.createVoucher(
    Tseries,
    1,
    expandTo6Decimals(10),
    "TestURI",
    true,
    signers[2].address,
    expandTo6Decimals(0)
  );
  const Template1155Voucher = await new template1155Voucher({
    _contract: TRS,
    _signer: signers[1],
  });
  const voucher = await Template1155Voucher.createVoucher(
    Tseries,
    1,
    expandTo6Decimals(10),
    2,
    1,
    "TestURI",
    true,
    signers[2].address,
    expandTo6Decimals(0)
  );
  const sellerVoucher = new SellerVoucher({
    _contract: singleMarketplace,
    _signer: owner,
  });
  const VoucherSell = await sellerVoucher.createVoucher1155(
    Tseries,
    owner.address,
    1,
    2,
    expandTo6Decimals(10),
    1,
    true,
    false
  );
  const buyerVoucher = new BuyerVoucher({
    _contract: singleMarketplace,
    _signer: signers[6],
  });
  const Voucherbuy = await buyerVoucher.createVoucher1155(
    Tseries,
    signers[6].address,
    1,
    2,
    expandTo6Decimals(10),
    1,
    false
  );
  //Primary Buy

  await usdt
    .connect(owner)
    .transfer(signers[6].address, expandTo6Decimals(1000));
  await usdt
    .connect(signers[6])
    .approve(singleMarketplace.address, expandTo6Decimals(1000));
  await singleMarketplace.Buy(Voucherbuy, VoucherSell, voucher,voucherNFT,false);
  expect(await TRS.balanceOf(signers[6].address, 1)).to.be.eq(2);
  //Secondary Buy
  const TemplateVoucher2 = await new LazyMinting({
    _contract: TRS,
    _signer: signers[1],
  });
  const voucherNFT2 = await TemplateVoucher2.createVoucher(
    Tseries,
    1,
    expandTo6Decimals(10),
    "TestURI",
    true,
    signers[2].address,
    expandTo6Decimals(0)
  );
  const Template1155Voucher2 = await new template1155Voucher({
    _contract: TRS,
    _signer: signers[1],
  });
  const voucher2 = await Template1155Voucher2.createVoucher(
    Tseries,
    1,
    expandTo6Decimals(10),
    2,
    2,
    "TestURI",
    true,
    signers[2].address,
    expandTo6Decimals(0)
  );
  const sellerVoucher2 = new SellerVoucher({
    _contract: singleMarketplace,
    _signer: signers[6],
  });
  const VoucherSell2 = await sellerVoucher2.createVoucher1155(
    Tseries,
    signers[6].address,
    1,
    2,
    expandTo6Decimals(10),
    2,
    true,
    false
  );
  const buyerVoucher2 = new BuyerVoucher({
    _contract: singleMarketplace,
    _signer: signers[7],
  });
  const Voucherbuy2 = await buyerVoucher2.createVoucher1155(
    Tseries,
    signers[3].address,
    1,
    2,
    expandTo6Decimals(10),
    2,
    false
  );
  await usdt
    .connect(owner)
    .transfer(signers[7].address, expandTo6Decimals(1000));
  await usdt
    .connect(signers[7])
    .approve(singleMarketplace.address, expandTo6Decimals(1000));
  await TRS.connect(signers[6]).setApprovalForAll(singleMarketplace.address,true);
  await expect (singleMarketplace.Buy(Voucherbuy2, VoucherSell2, voucher2,voucherNFT2,false)).to.be.revertedWith("invalid buyer");
});

  it("ERROR 1155 Buy: Addresses doesn't match",async()=>{
    //create collection
    await factory.connect(owner).create1155Token("T-series", owner.address, superOwner.address,usdt.address);
    const Tseries = await factory.connect(owner).userLastNFTContracts(owner.address,0);
    const TRS = await new Template1155__factory(owner).attach(Tseries);
    const addressOfTemplate = Tseries;
    //creating vouchers
    const TemplateVoucher = await new LazyMinting({
        _contract: TRS,
        _signer: signers[1],
      });
      const voucherNFT = await TemplateVoucher.createVoucher(
        Tseries,
        1,
        expandTo6Decimals(10),
        "TestURI",
        true,
        signers[2].address,
        expandTo6Decimals(0)
      );
      const Template1155Voucher = await new template1155Voucher({
        _contract: TRS,
        _signer: signers[1],
      });
      const voucher = await Template1155Voucher.createVoucher(
        Tseries,
        1,
        expandTo6Decimals(10),
        2,
        1,
        "TestURI",
        true,
        signers[2].address,
        expandTo6Decimals(0)
      );
    const sellerVoucher = new SellerVoucher({_contract:singleMarketplace , _signer:owner});
    const VoucherSell = await sellerVoucher.createVoucher1155(Tseries, owner.address,1,2,expandTo6Decimals(10),1,true,true);
    const buyerVoucher = new BuyerVoucher({_contract:singleMarketplace , _signer:signers[6]});
    const Voucherbuy = await buyerVoucher.createVoucher1155(signers[8].address, signers[6].address,1,2,expandTo6Decimals(10),1,true);
    //Primary Buy
   
    await usdt.connect(owner).transfer(signers[6].address,expandTo6Decimals(1000));
  
    await usdt.connect(owner).approve(singleMarketplace.address,expandTo6Decimals(1000));
    
    await expect (singleMarketplace.Buy(Voucherbuy, VoucherSell, voucher,voucherNFT,false)).to.be.revertedWith("Addresses invalid");
    })

    it("1155buy: counters mismatched",async()=>{
      //create collection
      await factory.connect(owner).create1155Token("T-series", owner.address, superOwner.address,usdt.address);
      const Tseries = await factory.connect(owner).userLastNFTContracts(owner.address,0);
      const TRS = await new Template1155__factory(owner).attach(Tseries);
      const addressOfTemplate = Tseries;
      //creating vouchers
      const TemplateVoucher = await new LazyMinting({
        _contract: TRS,
        _signer: signers[1],
      });
      const voucherNFT = await TemplateVoucher.createVoucher(
        Tseries,
        1,
        expandTo6Decimals(10),
        "TestURI",
        true,
        signers[2].address,
        expandTo6Decimals(0)
      );
      const Template1155Voucher = await new template1155Voucher({
        _contract: TRS,
        _signer: signers[1],
      });
      const voucher = await Template1155Voucher.createVoucher(
        Tseries,
        1,
        expandTo6Decimals(10),
        2,
        1,
        "TestURI",
        true,
        signers[2].address,
        expandTo6Decimals(0)
      );      const sellerVoucher = new SellerVoucher({_contract:singleMarketplace , _signer:owner});
      const VoucherSell = await sellerVoucher.createVoucher1155(Tseries, owner.address,1,2,expandTo6Decimals(10),2,true,true);
      const buyerVoucher = new BuyerVoucher({_contract:singleMarketplace , _signer:signers[6]});
      const Voucherbuy = await buyerVoucher.createVoucher1155(Tseries, signers[6].address,1,2,expandTo6Decimals(10),1,true);
      //Primary Buy
      
      await usdt.connect(owner).transfer(signers[6].address,expandTo6Decimals(1000));
      
      await usdt.connect(owner).approve(singleMarketplace.address,expandTo6Decimals(1000));
      
      await expect(singleMarketplace.Buy(Voucherbuy, VoucherSell, voucher,voucherNFT,false)).to.be.revertedWith("Counters invalid");
      })

      it("ERROR 1155 buy: mismatched amounts",async()=>{
        //create collection
        await factory.connect(owner).create1155Token("T-series", owner.address, superOwner.address,usdt.address);
        const Tseries = await factory.connect(owner).userLastNFTContracts(owner.address,0);
        const TRS = await new Template1155__factory(owner).attach(Tseries);
        const addressOfTemplate = Tseries;
        //creating vouchers
        const TemplateVoucher = await new LazyMinting({
            _contract: TRS,
            _signer: signers[1],
          });
          const voucherNFT = await TemplateVoucher.createVoucher(
            Tseries,
            1,
            expandTo6Decimals(10),
            "TestURI",
            true,
            signers[2].address,
            expandTo6Decimals(0)
          );
          const Template1155Voucher = await new template1155Voucher({
            _contract: TRS,
            _signer: signers[1],
          });
          const voucher = await Template1155Voucher.createVoucher(
            Tseries,
            1,
            expandTo6Decimals(10),
            1,
            1,
            "TestURI",
            true,
            signers[2].address,
            expandTo6Decimals(0)
          );        const sellerVoucher = new SellerVoucher({_contract:singleMarketplace , _signer:owner});
        const VoucherSell = await sellerVoucher.createVoucher1155(Tseries, owner.address,1,2,expandTo6Decimals(10),1,true,true);
        const buyerVoucher = new BuyerVoucher({_contract:singleMarketplace , _signer:signers[6]});
        const Voucherbuy = await buyerVoucher.createVoucher1155(Tseries, signers[6].address,1,2,expandTo6Decimals(10),1,true);
        //Primary Buy
        
        await usdt.connect(owner).transfer(signers[6].address,expandTo6Decimals(1000));
        
        await usdt.connect(owner).approve(singleMarketplace.address,expandTo6Decimals(1000));
        
        await expect(singleMarketplace.Buy(Voucherbuy, VoucherSell, voucher,voucherNFT,false)).to.be.revertedWith("Amounts invalid");
      })    

      it("ERROR 1155 buy :price doesn't match",async()=>{
        //create collection
        await factory.connect(owner).create1155Token("T-series", owner.address, superOwner.address,usdt.address);
        const Tseries = await factory.connect(owner).userLastNFTContracts(owner.address,0);
        const TRS = await new Template1155__factory(owner).attach(Tseries);
        const addressOfTemplate = Tseries;
        //creating vouchers
        const TemplateVoucher = await new LazyMinting({
            _contract: TRS,
            _signer: signers[1],
          });
          const voucherNFT = await TemplateVoucher.createVoucher(
            Tseries,
            1,
            expandTo6Decimals(10),
            "TestURI",
            true,
            signers[2].address,
            expandTo6Decimals(0)
          );
          const Template1155Voucher = await new template1155Voucher({
            _contract: TRS,
            _signer: signers[1],
          });
          const voucher = await Template1155Voucher.createVoucher(
            Tseries,
            1,
            expandTo6Decimals(10),
            2,
            1,
            "TestURI",
            true,
            signers[2].address,
            expandTo6Decimals(0)
          );        const sellerVoucher = new SellerVoucher({_contract:singleMarketplace , _signer:owner});
        const VoucherSell = await sellerVoucher.createVoucher1155(Tseries, owner.address,1,2,expandTo6Decimals(10),1,true,true);
        const buyerVoucher = new BuyerVoucher({_contract:singleMarketplace , _signer:signers[6]});
        const Voucherbuy = await buyerVoucher.createVoucher1155(Tseries, signers[6].address,1,2,expandTo6Decimals(9),1,true);
        //Primary Buy
        
        await usdt.connect(owner).transfer(signers[6].address,expandTo6Decimals(1000));
        
        await usdt.connect(owner).approve(singleMarketplace.address,expandTo6Decimals(1000));
        
        await expect(singleMarketplace.Buy(Voucherbuy, VoucherSell, voucher,voucherNFT,false)).to.be.revertedWith("Prices invalid");
      }) 

      describe("setter functions",async()=>{
        it("Update Operator",async()=>{
            await template1155.connect(signers[1]).updateOperator(signers[3].address,true);
            expect(await template1155.operators(signers[3].address)).to.be.eq(true);
           
        }) 

        it("msg.sender not admin",async()=>{
          await expect(template1155.connect(signers[2]).updateOperator(signers[3].address,true)).to.be.revertedWith("not admin");

        }) 
    
        it("Set Admin",async()=>{
            await template1155.setAdmin(signers[4].address);
            expect(await template1155.admin()).to.be.eq(signers[4].address);
           

          })
    
        it("Set Creator",async()=>{
            await template1155.setCreator(signers[5].address);
            expect(await template1155.creator()).to.be.eq(signers[5].address);
        });

        it("updating token address",async()=>{
          await singleMarketplace.setToken(signers[4].address);
          expect(await singleMarketplace.token()).to.be.eq(signers[4].address);
      })
  
      it("updating market wallet address",async()=>{
          await singleMarketplace.setMarketingWallet(signers[4].address);
          expect(await singleMarketplace.marketWallet()).to.be.eq(signers[4].address);
      });
  
      it("Updating treasury wallet address",async()=>{
          await singleMarketplace.settreasury(signers[4].address);
          expect(await singleMarketplace.treasury()).to.be.eq(signers[4].address);
      });
  
      it("Updating market fee amount",async()=>{
          await singleMarketplace.setMarketFee(2);
          expect(await singleMarketplace.marketFee()).to.be.eq(2);
      })
  
       it("transferring admin",async()=>{
          await singleMarketplace.transferAdminRole(signers[4].address);
          expect(await singleMarketplace.admin()).to.be.eq(signers[4].address);
      })
  
      })
    
});
