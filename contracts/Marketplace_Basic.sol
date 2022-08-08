// pragma solidity ^0.8.7;

// // import "@openzeppelin/contracts/access/Ownable.sol";
// import "./CustomAccessControl.sol";
// import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
// import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
// import "./interfaces/INFTTemplate.sol";
// import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
// import "@openzeppelin/contracts/utils/cryptography/draft-EIP712.sol";
// import "./Relayer/BasicMetaTransaction.sol";

// contract HeftyVerseMarketplace is EIP712("Heftyverse_MarketItem","1"), CustomAccessControl, BasicMetaTransaction {
//     bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");

//     struct HeftyVerseSeller {
//         address nftAddress; //Contract address of the NFT
//         address owner; //owner of the token
//         uint256 tokenID; 
//         uint256 minPrice; // in matic
//         bool isFixedPrice; //false if auction based sale
//         bool isCustodial; //false for external wallets
//         bytes signature;
//     }

//     struct HeftyVerseBuyer{
//         address nftAddress;
//         address buyer;
//         uint tokenID;
//         uint pricePaid;
//         bool isCustodial;
//         bytes signature;
//     }

//     IERC20 public token;
//     address public marketWallet;
//     address public treasury;

//     uint public marketFee = 200;

//     event AmountDistributed(address indexed buyer, uint amountPaid, uint royaltyPaid, uint marketFeePaid);

//     constructor(address _owner, address _marketWallet, address _token, address _treasury) {
//         _setupRole(DEFAULT_ADMIN_ROLE, _owner);
//         marketWallet = _marketWallet;
//         treasury = _treasury;
//         token = IERC20(_token);
//     }

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
//                             "HeftyVerseSeller(address nftAddress,address owner,uint256 tokenID,uint256 minPrice,bool isFixedPrice,bool isCustodial)"
//                         ),
//                         seller.nftAddress,
//                         seller.owner,
//                         seller.tokenID,
//                         seller.minPrice,
//                         seller.isFixedPrice,
//                         seller.isCustodial
//                     )
//                 )
//             );
//     }

//     function _verifySeller(HeftyVerseSeller memory seller)
//         internal
//         view
//         returns (address)
//     {
//         bytes32 digest = _hashSeller(seller);
//         return ECDSA.recover(digest, seller.signature);
//     }

//      function _hashBuyer(HeftyVerseBuyer memory buyer)
//         internal
//         view
//         returns (bytes32)
//     {
//         return
//             _hashTypedDataV4(
//                 keccak256(
//                     abi.encode(
//                         keccak256(
//                             "HeftyVerseBuyer(address nftAddress,address buyer,uint tokenID,uint pricePaid,bool isCustodial)"
//                         ),
//                         buyer.nftAddress,
//                         buyer.buyer,
//                         buyer.tokenID,
//                         buyer.pricePaid,
//                         buyer.isCustodial
//                     )
//                 )
//             );
//     }

//     function _verifyBuyer(HeftyVerseBuyer memory buyer)
//         internal
//         view
//         returns (address)
//     {
//         bytes32 digest = _hashBuyer(buyer);
//         return ECDSA.recover(digest, buyer.signature);
//     }

//     function BuyFixedPrice(HeftyVerseBuyer memory buyer,HeftyVerseSeller memory seller) payable public {
//         require(buyer.nftAddress == seller.nftAddress,"Addresses doesn't match");
//         require(IERC721(seller.nftAddress).ownerOf(seller.tokenID) == seller.owner, "Seller not onwer of token");
//         // require(seller.isFixedPrice,"not for fixed price");
//         require(seller.minPrice <= buyer.pricePaid,"price doesn't match");
//         if(buyer.isCustodial == true && seller.isCustodial == true)
//             BuyCustodial2Custodial(buyer,seller);
//         else if(buyer.isCustodial == true && seller.isCustodial == false)
//             BuyNonCustodial2Custodial(buyer,seller);
//         else if(buyer.isCustodial == false && seller.isCustodial == true)
//             BuyCustodial2NonCustodial(buyer,seller);
//         else if(buyer.isCustodial == false && seller.isCustodial == false)
//             BuyNonCustodial2NonCustodial(buyer,seller);
//     }

//     function BuyCustodial2Custodial(HeftyVerseBuyer memory buyer,HeftyVerseSeller memory seller) internal {
//         address signerSeller = _verifySeller(seller);
//         require(seller.owner == signerSeller, "invalid Seller");
//         address signerBuyer = _verifyBuyer(buyer);
//         require(buyer.buyer == signerBuyer,"invalid buyer");
//         // royalty given
//         (address receiver,uint royaltyAmount) = INFTTemplate(seller.nftAddress).royaltyInfo(seller.tokenID,buyer.pricePaid);
//         token.transferFrom(treasury, receiver , royaltyAmount);
//         //market fee deducted
//         uint fee = (buyer.pricePaid * marketFee) / 10000;
//         token.transferFrom(treasury, marketWallet,fee);
//         // token transfer
//         IERC721(seller.nftAddress).transferFrom(seller.owner, buyer.buyer, seller.tokenID);

//         emit AmountDistributed(buyer.buyer, buyer.pricePaid, royaltyAmount, fee);
//     }

//     function BuyCustodial2NonCustodial(HeftyVerseBuyer memory buyer,HeftyVerseSeller memory seller) internal {
//         address signerSeller = _verifySeller(seller);
//         require(seller.owner == signerSeller, "invalid Seller");
//         address signerBuyer = _verifyBuyer(buyer);
//         require(buyer.buyer == signerBuyer,"invalid buyer");
//         // royalty given
//         (address receiver,uint royaltyAmount) = INFTTemplate(seller.nftAddress).royaltyInfo(seller.tokenID,buyer.pricePaid);
//         token.transferFrom(buyer.buyer, receiver , royaltyAmount);
//         //market fee deducted
//         uint fee = (buyer.pricePaid * marketFee) / 10000;
//         token.transferFrom(treasury, marketWallet,fee);
//         //payment transfer
//         token.transferFrom(buyer.buyer, treasury, buyer.pricePaid - (royaltyAmount+ fee));
//         // nft transfer
//         IERC721(seller.nftAddress).transferFrom(seller.owner, buyer.buyer, seller.tokenID);

//         emit AmountDistributed(buyer.buyer, buyer.pricePaid, royaltyAmount, fee);
//     }

//     function BuyNonCustodial2Custodial(HeftyVerseBuyer memory buyer,HeftyVerseSeller memory seller) internal {
//         address signerSeller = _verifySeller(seller);
//         require(seller.owner == signerSeller, "invalid Seller");
//         address signerBuyer = _verifyBuyer(buyer);
//         require(buyer.buyer == signerBuyer,"invalid buyer");
//         // royalty given
//         (address receiver,uint royaltyAmount) = INFTTemplate(seller.nftAddress).royaltyInfo(seller.tokenID,buyer.pricePaid);
//         token.transferFrom(treasury, receiver , royaltyAmount);
//         //market fee deducted
//         uint fee = (buyer.pricePaid * marketFee) / 10000;
//         token.transferFrom(treasury, marketWallet,fee);
//         //payment transfer
//         token.transferFrom(treasury, seller.owner, buyer.pricePaid - (royaltyAmount+ fee));
//         //nft transfer
//         IERC721(seller.nftAddress).transferFrom(seller.owner, buyer.buyer, seller.tokenID);

//         emit AmountDistributed(buyer.buyer, buyer.pricePaid, royaltyAmount, fee);
//     }

//     function BuyNonCustodial2NonCustodial(HeftyVerseBuyer memory buyer,HeftyVerseSeller memory seller) internal {
//         address signerSeller = _verifySeller(seller);
//         require(seller.owner == signerSeller, "invalid Seller");
//         address signerBuyer = _verifyBuyer(buyer);
//         require(buyer.buyer == signerBuyer,"invalid buyer");
//         // royalty given
//         (address receiver,uint royaltyAmount) = INFTTemplate(seller.nftAddress).royaltyInfo(seller.tokenID,buyer.pricePaid);
//         token.transferFrom(treasury, receiver , royaltyAmount); 
//         //market fee deducted
//         uint fee = (buyer.pricePaid * marketFee) / 10000;
//         token.transferFrom(treasury, marketWallet,fee);
//         //payment transfer
//         token.transferFrom(buyer.buyer, seller.owner, buyer.pricePaid - (royaltyAmount+ fee));
//         //nft transfer
//         IERC721(seller.nftAddress).transferFrom(seller.owner, buyer.buyer, seller.tokenID);

//         emit AmountDistributed(buyer.buyer, buyer.pricePaid, royaltyAmount, fee);
//     }

//     function setToken(address _token) external onlyRole(OPERATOR_ROLE){
//         require(_token != address(0),"zero address sent");
//         token = IERC20(_token);
//     }

//     function setMarketingWallet(address _wallet) external onlyRole(OPERATOR_ROLE){
//         require(_wallet != address(0),"zero address sent");
//         marketWallet = _wallet;
//     }
    
//     function settreasury(address _wallet) external onlyRole(OPERATOR_ROLE){
//         require(_wallet != address(0),"zero address sent");
//         treasury = _wallet;
//     }

//     function setMarketFee(uint _fee) external onlyRole(OPERATOR_ROLE){
//         require(_fee <= 10000, "invalid value");
//         marketFee = _fee;
//     }

//     function _msgSender()
//         internal
//         view
//         override(Context,BasicMetaTransaction)
//         returns (address sender)
//     {
//         return super._msgSender();
//     }
// }
