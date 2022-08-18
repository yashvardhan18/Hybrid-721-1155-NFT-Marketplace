// //SPDX-License-Identifier: UNLICENSED
// pragma solidity ^0.8.14;

// import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
// import "@openzeppelin/contracts/utils/cryptography/draft-EIP712.sol";
// import "./Relayer/BasicMetaTransaction.sol";
// import "./interfaces/ISFTTemplate.sol";

// contract HeftyVerseMarketplace1155 is EIP712, BasicMetaTransaction {

//     struct HeftyVerseSeller{
//         address nftAddress;     // Address of the SFT contract
//         address owner;          // Owner of the SFT
//         uint256 tokenID;        // Token ID of the SFT
//         uint256 amount;         // Amount of the SFT to be sold
//         uint256 minPrice;       // Minimum secondary sale price of the SFT
//         uint256 counter;        // Unique counter of the HeftyVerseSeller
//         bool isFixedPrice;      // Bool to check if it is fixed price sale or auction
//         bool isCustodial;       // Bool to check if the wallet is custodial or non-custodail
//         bytes signature;        // Signature created after signing HeftyVerseSeller
//     }

//     struct HeftyVerseBuyer{
//         address nftAddress;     // Address of the SFT contract
//         address buyer;          // Address of the Buyer of the SFT 
//         uint256 tokenID;        // Token ID of the SFT
//         uint256 amount;         // Amount of the SFT to be bought
//         uint256 pricePaid;      // Price paid for the SFT
//         uint256 counter;        // Unique counter of the HeftyVerseSeller
//         bool isCustodial;       // Bool to check if the wallet is custodial or non-custodail
//         bytes signature;        // Signature created after signing HeftyVerseBuyer
//     }

//     // Admin address of the contract
//     address public admin;

//     // Token to buy SFTs
//     IERC20 public token;

//     // Marketing address for fee
//     address public marketWallet;

//     // Treasury address
//     address public treasury;

//     // Marketplace fee in bps
//     uint public marketFee = 200;

//     // Mapping for used counter numbers
//     mapping (uint256 => bool) public usedCounters;

//     // Mapping of the counter to the amount left in voucher
//     mapping (uint256 => uint256) public amountLeft;

//     event AmountDistributed(address indexed buyer, uint amountPaid, uint royaltyPaid, uint marketFeePaid);
//     event TokenWithdrawn(uint256 _amount);

//     /**
//      * @dev Initializes the contract by setting a `owner`, `marketingWallet`, `treasury` and `token` for the marketplace
//      * @param _owner is set as the owner for Marketplace contract
//      * @param _marketWallet is set as the wallet for marketplace fee
//      * @param _token is set as the token using which SFTs will be bought
//      * @param _treasury is set as the address from which funds will be used during custodial buy.
//      */
//     constructor(address _owner, address _marketWallet, address _token, address _treasury) EIP712("Heftyverse_MarketItem","1"){
//         admin = _owner;
//         marketWallet = _marketWallet;
//         treasury = _treasury;
//         token = IERC20(_token);
//     }

//     /**
//      * @notice Returns a hash of the given HeftyVerseSeller, prepared using EIP712 typed data hashing rules.
//      * @param seller is a HeftyVerseSeller to hash.
//      */
//     function _hashSeller(HeftyVerseSeller memory seller)
//         internal
//         view
//         returns (bytes32)
//     {
//         return
//             _hashTypedDataV4(
//                 keccak256(
//                     abi.encode(
//                         keccak256(
//                             "HeftyVerseSeller(address nftAddress,address owner,uint256 tokenID,uint256 amount,uint256 minPrice,uint256 counter,bool isFixedPrice,bool isCustodial)"
//                         ),
//                         seller.nftAddress,
//                         seller.owner,
//                         seller.tokenID,
//                         seller.amount,
//                         seller.minPrice,
//                         seller.counter,
//                         seller.isFixedPrice,
//                         seller.isCustodial
//                     )
//                 )
//             );
//     }

//     /**
//      * @notice Verifies the signature for a given HeftyVerseSeller, returning the address of the signer.
//      * @dev Will revert if the signature is invalid. Does not verify that the signer is owner of the SFT.
//      * @param seller is a HeftyVerseSeller describing the SFT to be sold
//      */
//     function _verifySeller(HeftyVerseSeller memory seller)
//         internal
//         view
//         returns (address)
//     {
//         bytes32 digest = _hashSeller(seller);
//         return ECDSA.recover(digest, seller.signature);
//     }

//     /**
//      * @notice Returns a hash of the given HeftyVerseBuyer, prepared using EIP712 typed data hashing rules.
//      * @param buyer is a HeftyVerseBuyer to hash.
//      */
//     function _hashBuyer(HeftyVerseBuyer memory buyer)
//         internal
//         view
//         returns (bytes32)
//     {
//         return
//             _hashTypedDataV4(
//                 keccak256(
//                     abi.encode(
//                         keccak256(
//                             "HeftyVerseBuyer(address nftAddress,address buyer,uint256 tokenID,uint256 amount,uint256 pricePaid,uint256 counter,bool isCustodial)"
//                         ),
//                         buyer.nftAddress,
//                         buyer.buyer,
//                         buyer.tokenID,
//                         buyer.amount,
//                         buyer.pricePaid,
//                         buyer.counter,
//                         buyer.isCustodial
//                     )
//                 )
//             );
//     }

//     /**
//      * @notice Verifies the signature for a given HeftyVerseBuyer, returning the address of the signer.
//      * @dev Will revert if the signature is invalid.
//      * @param buyer is a HeftyVerseBuyer describing the SFT to be bought
//      */
//     function _verifyBuyer(HeftyVerseBuyer memory buyer)
//         internal
//         view
//         returns (address)
//     {
//         bytes32 digest = _hashBuyer(buyer);
//         return ECDSA.recover(digest, buyer.signature);
//     }

//     /**
//      * @dev `buyer` and `seller` will be used in case of secondary sell
//      * @dev `seller` and `_voucher` will be used in case of primary sell
//      * @param buyer is a HeftyVerseBuyer describing the SFT to be bought
//      * @param seller is a HeftyVerseSeller describing the SFT to be sold
//      * @param _voucher is a SFTvoucher describing an unminted SFT
//      */
//     function Buy(HeftyVerseBuyer memory buyer,HeftyVerseSeller memory seller, Voucher.SFTvoucher memory _voucher) public {
//         require(buyer.nftAddress == seller.nftAddress,"Addresses invalid");
//         require(buyer.counter == seller.counter && seller.counter == _voucher.counter,"Counters invalid");
//         require(buyer.amount == seller.amount && seller.amount == _voucher.amount,"Amounts invalid");
//         require(seller.minPrice <= buyer.pricePaid,"Prices invalid");

//         if(buyer.isCustodial == true && seller.isCustodial == true)
//             BuyCustodial2Custodial(buyer, seller, _voucher);
//         else if(buyer.isCustodial == true && seller.isCustodial == false)
//             BuyNonCustodial2Custodial(buyer,seller, _voucher);
//         else if(buyer.isCustodial == false && seller.isCustodial == true)
//             BuyCustodial2NonCustodial(buyer,seller, _voucher);
//         else if(buyer.isCustodial == false && seller.isCustodial == false)
//             BuyNonCustodial2NonCustodial(buyer,seller, _voucher);
//     }

//     /**
//      * @notice This is the internal function used in case if both buyer and seller are custodial wallets
//      * @dev `buyer` and `seller` will be used in case of secondary sell
//      * @dev `seller` and `_voucher` will be used in case of primary sell
//      * @param buyer is a HeftyVerseBuyer describing the SFT to be bought
//      * @param seller is a HeftyVerseSeller describing the SFT to be sold
//      * @param _voucher is a SFTVoucher describing an unminted SFT
//      */
//     function BuyCustodial2Custodial(HeftyVerseBuyer memory buyer,HeftyVerseSeller memory seller, Voucher.SFTvoucher memory _voucher) internal {
//         if(!_voucher.toMint) {
//             verifySecondary(buyer,seller);

//             require(ISFTTemplate(seller.nftAddress).balanceOf(seller.owner, seller.tokenID) >= seller.amount,"invalid amount");


//             setCounter(buyer, seller);

//             // royalty given
//             (address receiver,uint royaltyAmount) = ISFTTemplate(seller.nftAddress).royaltyInfo(seller.tokenID,buyer.pricePaid);
//             token.transferFrom(treasury, receiver , royaltyAmount);
//             //market fee deducted
//             uint fee = (buyer.pricePaid * marketFee) / 10000;
//             token.transferFrom(treasury, marketWallet,fee);
//             //nft transfer
//             ISFTTemplate(seller.nftAddress).safeTransferFrom(seller.owner, buyer.buyer, seller.tokenID,seller.amount,"");
        
//             emit AmountDistributed(buyer.buyer, buyer.pricePaid, royaltyAmount, fee);
//         } else {
//             verifyPrimary(buyer, _voucher);
           
//             //market fee deducted
//             uint fee = (buyer.pricePaid * marketFee) / 10000;
//             token.transferFrom(treasury, marketWallet,fee);
//             //payment to creator
//             token.transferFrom(treasury, ISFTTemplate(seller.nftAddress).creator() ,buyer.pricePaid -  fee);
//             // token redeeming
//             ISFTTemplate(seller.nftAddress).redeem(_voucher, buyer.buyer, buyer.amount);

//             emit AmountDistributed(buyer.buyer, buyer.pricePaid, 0, fee);
//         }

//     }

//     /**
//      * @notice This is the internal function used in case if seller is a custodial wallet and buyer is non-custodial wallet
//      * @dev `buyer` and `seller` will be used in case of secondary sell
//      * @dev `seller` and `_voucher` will be used in case of primary sell
//      * @param buyer is a HeftyVerseBuyer describing the SFT to be bought
//      * @param seller is a HeftyVerseSeller describing the SFT to be sold
//      * @param _voucher is a SFTVoucher describing an unminted SFT
//      */
//     function BuyCustodial2NonCustodial(HeftyVerseBuyer memory buyer,HeftyVerseSeller memory seller, Voucher.SFTvoucher memory _voucher) internal {
//         if(!_voucher.toMint) {
//             verifySecondary(buyer,seller);

//             require(ISFTTemplate(seller.nftAddress).balanceOf(seller.owner, seller.tokenID) >= seller.amount,"invalid amount");


//             setCounter(buyer, seller);

//             // royalty given
//             (address receiver,uint royaltyAmount) = ISFTTemplate(seller.nftAddress).royaltyInfo(seller.tokenID,buyer.pricePaid);
//             token.transferFrom(buyer.buyer, receiver , royaltyAmount);
//             //market fee deducted
//             uint fee = (buyer.pricePaid * marketFee) / 10000;
//             token.transferFrom(buyer.buyer, marketWallet,fee);
//             //payment transfer
//             token.transferFrom(buyer.buyer, treasury, buyer.pricePaid - (royaltyAmount+ fee));
//             // nft transfer
//             ISFTTemplate(seller.nftAddress).safeTransferFrom(seller.owner, buyer.buyer, seller.tokenID,seller.amount,"");

//             emit AmountDistributed(buyer.buyer, buyer.pricePaid, royaltyAmount, fee);
//         } else {
//             verifyPrimary(buyer, _voucher);

//             //market fee deducted
//             uint fee = (buyer.pricePaid * marketFee) / 10000;
//             token.transferFrom(buyer.buyer, marketWallet,fee);
//             //payment transfer
//             token.transferFrom(buyer.buyer, ISFTTemplate(seller.nftAddress).creator(), buyer.pricePaid - fee);
//             // token redeeming
//             ISFTTemplate(seller.nftAddress).redeem(_voucher, buyer.buyer, buyer.amount);

//             emit AmountDistributed(buyer.buyer, buyer.pricePaid, 0, fee);
//         }
//     }

//     /**
//      * @notice This is the internal function used in case if seller is a non-custodial wallet and buyer is custodial wallet
//      * @dev `buyer` and `seller` will be used in case of secondary sell
//      * @dev `seller` and `_voucher` will be used in case of primary sell
//      * @param buyer is a HeftyVerseBuyer describing the SFT to be bought
//      * @param seller is a HeftyVerseSeller describing the SFT to be sold
//      * @param _voucher is a SFTVoucher describing an unminted SFT
//      */
//     function BuyNonCustodial2Custodial(HeftyVerseBuyer memory buyer,HeftyVerseSeller memory seller, Voucher.SFTvoucher memory _voucher) internal {
//         if(!_voucher.toMint) {
//             verifySecondary(buyer,seller);

//             require(ISFTTemplate(seller.nftAddress).balanceOf(seller.owner, seller.tokenID) >= seller.amount,"invalid amount");


//             setCounter(buyer, seller);

//             // royalty given
//             (address receiver,uint royaltyAmount) = ISFTTemplate(seller.nftAddress).royaltyInfo(seller.tokenID,buyer.pricePaid);
//             token.transferFrom(treasury, receiver , royaltyAmount);
//             //market fee deducted
//             uint fee = (buyer.pricePaid * marketFee) / 10000;
//             token.transferFrom(treasury, marketWallet,fee);
//             //payment transfer
//             token.transferFrom(treasury, seller.owner, buyer.pricePaid - (royaltyAmount+ fee));
//             //nft transfer
//             ISFTTemplate(seller.nftAddress).safeTransferFrom(seller.owner, buyer.buyer, seller.tokenID,seller.amount,"");

//             emit AmountDistributed(buyer.buyer, buyer.pricePaid, royaltyAmount, fee);
//         } else {
//             verifyPrimary(buyer, _voucher);

//             //market fee deducted
//             uint fee = (buyer.pricePaid * marketFee) / 10000;
//             token.transferFrom(treasury, marketWallet,fee);
//             // token redeeming
//             ISFTTemplate(seller.nftAddress).redeem(_voucher, buyer.buyer,buyer.amount);

//             emit AmountDistributed(buyer.buyer, buyer.pricePaid, 0, fee);
//         }
//     }

//     /**
//      * @notice This is the internal function used in case if seller is a non-custodial wallet and buyer is also non-custodial wallet
//      * @dev `buyer` and `seller` will be used in case of secondary sell
//      * @dev `seller` and `_voucher` will be used in case of primary sell
//      * @param buyer is a HeftyVerseBuyer describing the SFT to be bought
//      * @param seller is a HeftyVerseSeller describing the SFT to be sold
//      * @param _voucher is a SFTVoucher describing an unminted SFT
//      */
//     function BuyNonCustodial2NonCustodial(HeftyVerseBuyer memory buyer,HeftyVerseSeller memory seller, Voucher.SFTvoucher memory _voucher) internal {
//         if(!_voucher.toMint) {
//             verifySecondary(buyer,seller);

//             require(ISFTTemplate(seller.nftAddress).balanceOf(seller.owner, seller.tokenID) >= seller.amount,"invalid amount");


//             setCounter(buyer, seller);

//             // royalty given
//             (address receiver,uint royaltyAmount) = ISFTTemplate(seller.nftAddress).royaltyInfo(seller.tokenID,buyer.pricePaid);
//             token.transferFrom(buyer.buyer, receiver , royaltyAmount); 
//             //market fee deducted
//             uint fee = (buyer.pricePaid * marketFee) / 10000;
//             token.transferFrom(buyer.buyer, marketWallet,fee);
//             //payment transfer
//             token.transferFrom(buyer.buyer, seller.owner, buyer.pricePaid - (royaltyAmount+ fee));
//             //nft transfer
//             ISFTTemplate(seller.nftAddress).safeTransferFrom(seller.owner, buyer.buyer, seller.tokenID,seller.amount,"");

//             emit AmountDistributed(buyer.buyer, buyer.pricePaid, royaltyAmount, fee);
//         } else {
//             verifyPrimary(buyer, _voucher);

//             //market fee deducted
//             uint fee = (buyer.pricePaid * marketFee) / 10000;
//             token.transferFrom(buyer.buyer, marketWallet,fee);
//             //payment transfer
//             token.transferFrom(buyer.buyer, seller.owner, buyer.pricePaid - fee);
//             // token redeeming
//             ISFTTemplate(seller.nftAddress).redeem(_voucher, buyer.buyer,buyer.amount);

//             emit AmountDistributed(buyer.buyer, buyer.pricePaid, 0, fee);
//         }
//     }

//     function verifySecondary(HeftyVerseBuyer memory buyer,HeftyVerseSeller memory seller) internal view {
//         address signerSeller = _verifySeller(seller);
//         require(seller.owner == signerSeller,"invalid Seller");
//         address signerBuyer = _verifyBuyer(buyer);
//         require(buyer.buyer == signerBuyer,"invalid buyer");
        
//     }

//     function verifyPrimary(HeftyVerseBuyer memory buyer, Voucher.SFTvoucher memory _voucher) internal view {
//         address signerBuyer = _verifyBuyer(buyer);
//         require(buyer.buyer == signerBuyer,"invalid buyer");
//         require(buyer.nftAddress == _voucher.nftAddress,"invalid addresses");
//         require(_voucher.price <= buyer.pricePaid,"invalid price");
//     }

//     function setCounter(HeftyVerseBuyer memory buyer,HeftyVerseSeller memory seller) internal {
//         require(!usedCounters[seller.counter]);
//         if(amountLeft[seller.counter] == 0) {
//             amountLeft[seller.counter] = seller.amount - buyer.amount;
//         } else {
//             amountLeft[seller.counter] = amountLeft[seller.counter] - buyer.amount;
//         }
//         if(amountLeft[seller.counter] == 0)
//             usedCounters[seller.counter] = true;
//     }

//     /**
//      * @notice Function to set new token for buy/sell in the marketplace
//      * @param _token is the new token which will be used for buy/sell in the marketplace
//      */
//     function setToken(address _token) external {
//         require(msg.sender == admin);
//         require(_token != address(0),"zero address");
//         token = IERC20(_token);
//     }

//     /**
//      * @notice Function to set new address for market wallet
//      * @param _wallet is the new wallet address where marketplace fee will be sent
//      */
//     function setMarketingWallet(address _wallet) external {
//         require(msg.sender == admin);
//         require(_wallet != address(0),"zero address");
//         marketWallet = _wallet;
//     }
    
//     /**
//      * @notice Function to set new address for market wallet
//      * @param _wallet is the new wallet address where marketplace fee will be sent
//      */
//     function settreasury(address _wallet) external {
//         require(msg.sender == admin);
//         require(_wallet != address(0),"zero address");
//         treasury = _wallet;
//     }

//     /**
//      * @notice Function to set new marketplace fee in bps
//      * @param _fee is the new marketplace fee
//      */
//     function setMarketFee(uint _fee) external {
//         require(msg.sender == admin);
//         require(_fee <= 10000, "invalid value");
//         marketFee = _fee;
//     }

//     /**
//      * @notice Function to withdraw stuck tokens from the contract
//      * @param _token is the token to be withdrawn
//      * @param _amount is the amount to be withdrawn
//      */
//     function withdrawStuckToken(address _token, uint256 _amount) public {
//         require(msg.sender == admin);
//         IERC20(_token).transfer(msg.sender, _amount);
//         emit TokenWithdrawn(_amount);
//     }

//     /**
//      * @notice Function to set new admin of the contract
//      * @param _admin is the new admin of the contract
//      */
//     function transferAdminRole(address _admin) external {
//         require(msg.sender == admin);
//         admin = _admin;
//     }

//     function _msgSender()
//         internal
//         view
//         override(BasicMetaTransaction)
//         returns (address sender)
//     {
//         return super._msgSender();
//     }    
// }

