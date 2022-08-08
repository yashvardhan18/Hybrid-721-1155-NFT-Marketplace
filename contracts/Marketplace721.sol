//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.14;

import "./CustomAccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/draft-EIP712.sol";
import "./Relayer/BasicMetaTransaction.sol";
import "./interfaces/INFTTemplate.sol";

contract HeftyVerseMarketplace721 is EIP712, CustomAccessControl, BasicMetaTransaction {
    bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");

    struct HeftyVerseSeller{
        address nftAddress;     // Address of the NFT contract
        address owner;          // Owner of the NFT
        uint256 tokenID;        // Token ID of the NFT
        uint256 minPrice;       // Minimum secondary sale price of the NFT
        bool isFixedPrice;      // Bool to check if it is fixed price sale or auction
        bool isCustodial;       // Bool to check if the wallet is custodial or non-custodail
        bytes signature;        // Signature created after signing HeftyVerseSeller
    }

    struct HeftyVerseBuyer{
        address nftAddress;     // Address of the NFT contract
        address buyer;          // Address of the buyer of the NFT
        uint256 tokenID;        // Token ID of the NFT
        uint256 pricePaid;      // Price paid for the NFT
        bool isCustodial;       // Bool to check if the wallet is cutodial or not
        bytes signature;        // Signature created after signing HeftyVerseSeller
    }

    // Admin address of the contract
    address public admin;

    // Token to buy NFTs
    IERC20 public token;

    // Marketing address for fee
    address public marketWallet;

    // Treasury address
    address public treasury;

    // Marketplace fee in bps
    uint public marketFee = 200;

    event AmountDistributed(address indexed buyer, uint amountPaid, uint royaltyPaid, uint marketFeePaid);

    event TokenWithdrawn(uint256 _amount);

    /**
     * @dev sets 'owner' address as Default Admin and sets addresses for 
       marketFee wallet, treasury and token.
     *@param _owner address is set Default Admin.
     * @param _marketWallet address is marketFee wallet.
     * @param _token address for ERC20 token.
     * @param _treasury address is for treasury. 
     */
    constructor(address _owner, address _marketWallet, address _token, address _treasury) EIP712("Heftyverse_MarketItem","1"){
        _setupRole(DEFAULT_ADMIN_ROLE, _owner);
        marketWallet = _marketWallet;
        treasury = _treasury;
        token = IERC20(_token);
    }

    /**
    *@dev makes hash of seller voucher.
    *@param seller is of data type HeftyVerseSeller struct.
     */
    function _hashSeller(HeftyVerseSeller memory seller)
        internal
        view
        returns (bytes32)
    {
        return
            _hashTypedDataV4(
                keccak256(
                    abi.encode(
                        keccak256(
                            "HeftyVerseSeller(address nftAddress,address owner,uint256 tokenID,uint256 minPrice,bool isFixedPrice,bool isCustodial)"
                        ),
                        seller.nftAddress,
                        seller.owner,
                        seller.tokenID,
                        seller.minPrice,
                        seller.isFixedPrice,
                        seller.isCustodial
                    )
                )
            );
    }
    /**
    @notice Verifies the signature for a given HeftyVerseSeller, returning the address of the signer.
    @dev Will revert if the signature is invalid. Does not verify that the signer is owner of the NFT.
    @param seller is of data type HeftyVerseSeller struct.
      */
    function _verifySeller(HeftyVerseSeller memory seller)
        internal
        view
        returns (address)
    {
        bytes32 digest = _hashSeller(seller);
        return ECDSA.recover(digest, seller.signature);
    }

    /**
    *@dev Returns hash ofHeftyVerseBuyer voucher using EIP712 typed data hashing rules.
    *@param buyer is of data type HeftyVerseBuyer struct.
     */
     function _hashBuyer(HeftyVerseBuyer memory buyer)
        internal
        view
        returns (bytes32)
    {
        return
            _hashTypedDataV4(
                keccak256(
                    abi.encode(
                        keccak256(
                            "HeftyVerseBuyer(address nftAddress,address buyer,uint256 tokenID,uint256 pricePaid,bool isCustodial)"
                        ),
                        buyer.nftAddress,
                        buyer.buyer,
                        buyer.tokenID,
                        buyer.pricePaid,
                        buyer.isCustodial
                    )
                )
            );
    }

    /**
    @notice Verifies the signature for a given HeftyVerseBuyer, returning the address of the signer.
    @dev Will revert if the signature is invalid.
    @param buyer is of data type HeftyVerseBuyer struct.
      */
    function _verifyBuyer(HeftyVerseBuyer memory buyer)
        internal
        view
        returns (address)
    {
        // console.log("verify",address(buyer.buyer));
        bytes32 digest = _hashBuyer(buyer);
        // console.log("return from verify",ECDSA.recover(digest, buyer.signature));
        return ECDSA.recover(digest, buyer.signature);
    }

    /**
    @dev checks the wallet types of seller and buyer and call the respective function for the trade.
    @param seller is of data type HeftyVerseSeller struct representing the NFT to be sold.
    @param buyer is of data type HeftyVerseBuyer struct representing the NFT to be bought.
    @param _voucher is of data type NFTVoucher struct from Voucher library representing the NFT that is being traded.
    */
    function BuyFixedPrice(HeftyVerseBuyer memory buyer,HeftyVerseSeller memory seller, Voucher.NFTvoucher memory _voucher) public {
        require(buyer.nftAddress == seller.nftAddress,"Addresses doesn't match");
        // require(IERC721(seller.nftAddress).ownerOf(seller.tokenID) == seller.owner, "Seller not onwer of token");
        // require(seller.isFixedPrice,"not for fixed price");
        require(seller.minPrice <= buyer.pricePaid,"price doesn't match");
        if(buyer.isCustodial == true && seller.isCustodial == true)
            BuyCustodial2Custodial(buyer, seller, _voucher);
        else if(buyer.isCustodial == true && seller.isCustodial == false)
            BuyNonCustodial2Custodial(buyer,seller, _voucher);
        else if(buyer.isCustodial == false && seller.isCustodial == true)
            BuyCustodial2NonCustodial(buyer,seller, _voucher);
        else if(buyer.isCustodial == false && seller.isCustodial == false)
            BuyNonCustodial2NonCustodial(buyer,seller, _voucher);
    }
    /**
    @notice internal function
    @dev implements primary and secondary buy between sellers' custodial and buyers' custodial wallets.
    event AmountDistributed emitted.
     */
    function BuyCustodial2Custodial(HeftyVerseBuyer memory buyer,HeftyVerseSeller memory seller, Voucher.NFTvoucher memory _voucher) internal {
        if(INFTTemplate(address(seller.nftAddress)).exists(seller.tokenID)) {
            address signerSeller = _verifySeller(seller);
            require(address(seller.owner) == signerSeller, "invalid Seller");
            address signerBuyer = _verifyBuyer(buyer);
            require(address(buyer.buyer) == signerBuyer,"invalid buyer");
        
            require(INFTTemplate(address(seller.nftAddress)).ownerOf(seller.tokenID) == address(seller.owner), "Seller not onwer of token");
            // royalty given
            (address receiver,uint royaltyAmount) = INFTTemplate(address(seller.nftAddress)).royaltyInfo(seller.tokenID,buyer.pricePaid);
            token.transferFrom(treasury, receiver , royaltyAmount);
            //market fee deducted
            uint fee = (buyer.pricePaid * marketFee) / 10000;
            token.transferFrom(treasury, marketWallet,fee);
            // token transfer
            INFTTemplate(address(seller.nftAddress)).transferFrom(address(seller.owner), address(buyer.buyer), seller.tokenID);
        
            emit AmountDistributed(address(buyer.buyer), buyer.pricePaid, royaltyAmount, fee);
        } else {
            address signerBuyer = _verifyBuyer(buyer);
            require(address(buyer.buyer) == signerBuyer,"invalid buyer");
            require(buyer.nftAddress == _voucher.nftAddress,"mismatched addresses");
            require(_voucher.price <= buyer.pricePaid,"invalid price");
           
            //market fee deducted
            uint fee = (buyer.pricePaid * marketFee) / 10000;
            token.transferFrom(treasury, marketWallet,fee);
            //payment to creator
            token.transferFrom(treasury, INFTTemplate(address(seller.nftAddress)).creator() , buyer.pricePaid -  fee);
            // token redeeming
            INFTTemplate(address(seller.nftAddress)).redeem(_voucher, address(buyer.buyer));

            emit AmountDistributed(address(buyer.buyer), buyer.pricePaid, 0, fee);
        }

    }
    /**
    @notice internal function
    @dev implements primary and secondary buy between sellers' custodial and buyers' Non-custodial wallets.
    event AmountDistributed emitted.
     */
    function BuyCustodial2NonCustodial(HeftyVerseBuyer memory buyer,HeftyVerseSeller memory seller, Voucher.NFTvoucher memory _voucher) internal {
        if(INFTTemplate(address(seller.nftAddress)).exists(seller.tokenID)) {
            address signerSeller = _verifySeller(seller);
            require(address(seller.owner) == signerSeller, "invalid Seller");
            address signerBuyer = _verifyBuyer(buyer);
            require(address(buyer.buyer) == signerBuyer,"invalid buyer");
            // royalty given
            (address receiver,uint royaltyAmount) = INFTTemplate(address(seller.nftAddress)).royaltyInfo(seller.tokenID,buyer.pricePaid);
            token.transferFrom(address(buyer.buyer), receiver , royaltyAmount);
            //market fee deducted
            uint fee = (buyer.pricePaid * marketFee) / 10000;
            token.transferFrom(address(buyer.buyer), marketWallet,fee);
            //payment transfer
            token.transferFrom(address(buyer.buyer), treasury, buyer.pricePaid - (royaltyAmount+ fee));
            // nft transfer
            INFTTemplate(address(seller.nftAddress)).transferFrom(address(seller.owner), address(buyer.buyer), seller.tokenID);

            emit AmountDistributed(address(buyer.buyer), buyer.pricePaid, royaltyAmount, fee);
        } else {
            address signerBuyer = _verifyBuyer(buyer);
            require(address(buyer.buyer) == signerBuyer,"invalid buyer");
            require(address(buyer.nftAddress) == address(_voucher.nftAddress),"mismatched addresses");
            require(_voucher.price <= buyer.pricePaid,"invalid price");

            //market fee deducted
            uint fee = (buyer.pricePaid * marketFee) / 10000;
            token.transferFrom(address(buyer.buyer), marketWallet,fee);
            //payment transfer
            token.transferFrom(address(buyer.buyer), INFTTemplate(address(seller.nftAddress)).creator(), buyer.pricePaid - fee);
            // token redeeming
            INFTTemplate(address(seller.nftAddress)).redeem(_voucher, address(buyer.buyer));

            emit AmountDistributed(address(buyer.buyer), buyer.pricePaid, 0, fee);
        }
    }
    /**
    @notice internal function
    @dev implements primary and secondary buy between sellers' Non-custodial and buyers' custodial wallets.
    event AmountDistributed emitted.
     */
    function BuyNonCustodial2Custodial(HeftyVerseBuyer memory buyer,HeftyVerseSeller memory seller, Voucher.NFTvoucher memory _voucher) internal {
        if(INFTTemplate(address(seller.nftAddress)).exists(seller.tokenID)) {
            address signerSeller = _verifySeller(seller);
            require(address(seller.owner) == signerSeller, "invalid Seller");
            address signerBuyer = _verifyBuyer(buyer);
            require(address(buyer.buyer) == signerBuyer,"invalid buyer");
            // royalty given
            (address receiver,uint royaltyAmount) = INFTTemplate(address(seller.nftAddress)).royaltyInfo(seller.tokenID,buyer.pricePaid);
            token.transferFrom(treasury, receiver , royaltyAmount);
            //market fee deducted
            uint fee = (buyer.pricePaid * marketFee) / 10000;
            token.transferFrom(treasury, marketWallet,fee);
            //payment transfer
            token.transferFrom(treasury, address(seller.owner), buyer.pricePaid - (royaltyAmount+ fee));
            //nft transfer
            INFTTemplate(address(seller.nftAddress)).transferFrom(address(seller.owner), address(buyer.buyer), seller.tokenID);

            emit AmountDistributed(address(buyer.buyer), buyer.pricePaid, royaltyAmount, fee);
        } else {
            address signerBuyer = _verifyBuyer(buyer);
            require(address(buyer.buyer) == signerBuyer,"invalid buyer");
            require(address(buyer.nftAddress) == address(_voucher.nftAddress),"mismatched addresses");
            require(_voucher.price <= buyer.pricePaid,"invalid price");

            //market fee deducted
            uint fee = (buyer.pricePaid * marketFee) / 10000;
            token.transferFrom(treasury, marketWallet,fee);
            // token redeeming
            INFTTemplate(address(seller.nftAddress)).redeem(_voucher, address(buyer.buyer));

            emit AmountDistributed(address(buyer.buyer), buyer.pricePaid, 0, fee);
        }
    }

    /**
    @notice internal function
    @dev implements primary and secondary buy between sellers' Non-custodial and buyers' Non-custodial wallets.
        event AmountDistributed emitted.
     */

    function BuyNonCustodial2NonCustodial(HeftyVerseBuyer memory buyer,HeftyVerseSeller memory seller, Voucher.NFTvoucher memory _voucher) internal {
        if(INFTTemplate(address(seller.nftAddress)).exists(seller.tokenID)) {
            address signerSeller = _verifySeller(seller);
            require(address(seller.owner) == signerSeller, "invalid Seller");
            address signerBuyer = _verifyBuyer(buyer);
            require(address(buyer.buyer) == signerBuyer,"invalid buyer");
            // royalty given
            (address receiver,uint royaltyAmount) = INFTTemplate(address(seller.nftAddress)).royaltyInfo(seller.tokenID,buyer.pricePaid);
            token.transferFrom(address(buyer.buyer), receiver , royaltyAmount); 
            //market fee deducted
            uint fee = (buyer.pricePaid * marketFee) / 10000;
            token.transferFrom(address(buyer.buyer), marketWallet,fee);
            //payment transfer
            token.transferFrom(address(buyer.buyer), address(seller.owner), buyer.pricePaid - (royaltyAmount+ fee));
            //nft transfer
            INFTTemplate(address(seller.nftAddress)).transferFrom(address(seller.owner), address(buyer.buyer), seller.tokenID);

            emit AmountDistributed(address(buyer.buyer), buyer.pricePaid, royaltyAmount, fee);
        } else {
             address signerBuyer = _verifyBuyer(buyer);
            require(address(buyer.buyer) == signerBuyer,"invalid buyer");
            require(address(buyer.nftAddress) == address(_voucher.nftAddress),"mismatched addresses");
            require(_voucher.price <= buyer.pricePaid,"invalid price");

            //market fee deducted
            uint fee = (buyer.pricePaid * marketFee) / 10000;
            token.transferFrom(address(buyer.buyer), marketWallet,fee);
            //payment transfer
            token.transferFrom(address(buyer.buyer), address(seller.owner), buyer.pricePaid - fee);
            INFTTemplate(address(seller.nftAddress)).redeem(_voucher, address(buyer.buyer));
            emit AmountDistributed(address(buyer.buyer), buyer.pricePaid, 0, fee);
        }
    }

    /**
    @dev sets ERC20 token contract address
    @param _token is ERC20 token contract address.
     */
    function setToken(address _token) external onlyRole(OPERATOR_ROLE) {
        require(_token != address(0),"zero address sent");
        token = IERC20(_token);
    }

    /**
    @dev sets market fee wallet address
    @param _wallet is address of market fee wallet */
    function setMarketingWallet(address _wallet) external onlyRole(OPERATOR_ROLE) {
        require(_wallet != address(0),"zero address sent");
        marketWallet = _wallet;
    }
    
    /**
    @dev sets treasury address 
    @param _wallet is treasury address */
    function settreasury(address _wallet) external onlyRole(OPERATOR_ROLE) {
        require(_wallet != address(0),"zero address sent");
        treasury = _wallet;
    }

    /**
    @dev sets amount for market fee
    @param _fee is amount for fee */
    function setMarketFee(uint _fee) external onlyRole(OPERATOR_ROLE) {
        require(_fee <= 10000, "invalid value");
        marketFee = _fee;
    }

    /**
    @dev withdraws token that are accidently sent to the contract. 
    @param _token is address of ERC20 token that is stuck.
    @param _amount is the amount that is stuck.*/
    function withdrawStuckToken(address _token, uint256 _amount) public onlyRole(OPERATOR_ROLE) {
        require(_token!=address(0),"Zero address");
        IERC20(_token).transfer(msg.sender, _amount);
        emit TokenWithdrawn(_amount);
    }

    function _msgSender()
        internal
        view
        override(Context,BasicMetaTransaction)
        returns (address sender)
    {
        return super._msgSender();
    }    
}
