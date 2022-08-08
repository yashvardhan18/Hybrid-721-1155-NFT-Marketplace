//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.14;

// import "./CustomAccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/cryptography/draft-EIP712.sol";
import "./Relayer/BasicMetaTransaction.sol";
import "./interfaces/ISFTTemplate.sol";


contract HeftyVerseMarketplace1155 is EIP712, BasicMetaTransaction {
    // bytes32 public constant OPERATOR_ROLE = keccak256("OPERATOR_ROLE");

    struct HeftyVerseSeller{
        address nftAddress; 
        address owner;
        uint256 tokenID; 
        uint256 amount;
        uint256 minPrice; 
        uint256 counter;
        bool isFixedPrice; 
        bool isCustodial; 
        bytes signature;
    }

    struct HeftyVerseBuyer{
        address nftAddress;
        address buyer;
        uint256 tokenID;
        uint256 amount;
        uint256 pricePaid;
        uint256 counter;
        bool isCustodial;
        bytes signature;
    }

    // Token to buy NFTs
    IERC20 public token;

    // Marketing address for fee
    address public marketWallet;

    // Treasury address
    address public treasury;

    // Marketplace fee in bps
    uint public marketFee = 200;

    // Mapping for used counter numbers
    mapping (uint256 => bool) public usedCounters;

    event AmountDistributed(address indexed buyer, uint amountPaid, uint royaltyPaid, uint marketFeePaid);
    event TokenWithdrawn(uint256 _amount);

    /**
     * @dev Initializes the contract by setting a `owner`, `marketingWallet`, `treasury` and `token` for the marketplace
     * @param _owner is set as the owner for Marketplace contract
     * @param _marketWallet is set as the wallet for marketplace fee
     * @param _token is set as the token using which NFTs will be bought
     * @param _treasury is set as the address from which funds will be used during custodial buy.
     */
    constructor(address _owner, address _marketWallet, address _token, address _treasury) EIP712("Heftyverse_MarketItem","1"){
        // _setupRole(DEFAULT_ADMIN_ROLE, _owner);
        marketWallet = _marketWallet;
        treasury = _treasury;
        token = IERC20(_token);
    }

    /**
     * @notice Returns a hash of the given HeftyVerseSeller, prepared using EIP712 typed data hashing rules.
     * @param seller is a HeftyVerseSeller to hash.
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
                            "HeftyVerseSeller(address nftAddress,address owner,uint256 tokenID,uint256 amount,uint256 minPrice,uint256 counter,bool isFixedPrice,bool isCustodial)"
                        ),
                        seller.nftAddress,
                        seller.owner,
                        seller.tokenID,
                        seller.amount,
                        seller.minPrice,
                        seller.counter,
                        seller.isFixedPrice,
                        seller.isCustodial
                    )
                )
            );
    }

    /**
     * @notice Verifies the signature for a given HeftyVerseSeller, returning the address of the signer.
     * @dev Will revert if the signature is invalid. Does not verify that the signer is owner of the NFT.
     * @param seller is a HeftyVerseSeller describing the NFT to be sold
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
     * @notice Returns a hash of the given HeftyVerseBuyer, prepared using EIP712 typed data hashing rules.
     * @param buyer is a HeftyVerseBuyer to hash.
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
                            "HeftyVerseBuyer(address nftAddress,address buyer,uint256 tokenID,uint256 amount,uint256 pricePaid,uint256 counter,bool isCustodial)"
                        ),
                        buyer.nftAddress,
                        buyer.buyer,
                        buyer.tokenID,
                        buyer.amount,
                        buyer.pricePaid,
                        buyer.counter,
                        buyer.isCustodial
                    )
                )
            );
    }

    /**
     * @notice Verifies the signature for a given HeftyVerseBuyer, returning the address of the signer.
     * @dev Will revert if the signature is invalid.
     * @param buyer is a HeftyVerseBuyer describing the NFT to be bought
     */
    function _verifyBuyer(HeftyVerseBuyer memory buyer)
        internal
        view
        returns (address)
    {
        bytes32 digest = _hashBuyer(buyer);
        return ECDSA.recover(digest, buyer.signature);
    }

    /**
     * @dev `buyer` and `seller` will be used in case of secondary sell
     * @dev `seller` and `_voucher` will be used in case of primary sell
     * @param buyer is a HeftyVerseBuyer describing the NFT to be bought
     * @param seller is a HeftyVerseSeller describing the NFT to be sold
     * @param _voucher is a SFTVoucher describing an unminted NFT
     */
    function Buy(HeftyVerseBuyer memory buyer,HeftyVerseSeller memory seller, Voucher.SFTvoucher memory _voucher) public {
        require(buyer.nftAddress == seller.nftAddress,"Addresses doesn't match");
        require(buyer.counter == seller.counter && seller.counter == _voucher.counter,"counters mismatched");
        require(buyer.amount == seller.amount && seller.amount == _voucher.amount,"mismatched amounts");
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
     * @notice This is the internal function used in case if both buyer and seller are custodial wallets
     * @dev `buyer` and `seller` will be used in case of secondary sell
     * @dev `seller` and `_voucher` will be used in case of primary sell
     * @param buyer is a HeftyVerseBuyer describing the NFT to be bought
     * @param seller is a HeftyVerseSeller describing the NFT to be sold
     * @param _voucher is a SFTVoucher describing an unminted NFT
     */
    function BuyCustodial2Custodial(HeftyVerseBuyer memory buyer,HeftyVerseSeller memory seller, Voucher.SFTvoucher memory _voucher) internal {
        if(!_voucher.toMint) {
            address signerSeller = _verifySeller(seller);
            require(
                address(seller.owner) == signerSeller, 
                "invalid Seller"
            );
            address signerBuyer = _verifyBuyer(buyer);
            require(
                address(buyer.buyer) == signerBuyer,
                "invalid buyer"
            );
        
            require(
                IERC1155(address(seller.nftAddress))
                    .balanceOf(address(seller.owner), seller.tokenID) >= seller.amount,
                "not enough balance for token"
            );
            // require(IERC721(address(seller.nftAddress)).ownerOf(seller.tokenID) == address(seller.owner), "Seller not onwer of token");
            // royalty given
            (address receiver,uint royaltyAmount) = ISFTTemplate(address(seller.nftAddress)).royaltyInfo(seller.tokenID,buyer.pricePaid);
            token.transferFrom(treasury, receiver , royaltyAmount);
            //market fee deducted
            uint fee = (buyer.pricePaid * marketFee) / 10000;
            token.transferFrom(treasury, marketWallet,fee);
            // token transfer
            IERC1155(address(seller.nftAddress)).safeTransferFrom(
                address(seller.owner), 
                address(buyer.buyer), 
                seller.tokenID,
                seller.amount,
                ""
                );
        
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
            token.transferFrom(
                treasury, 
                ISFTTemplate(address(seller.nftAddress)).creator() ,
                buyer.pricePaid -  fee
                );
            // token redeeming
            ISFTTemplate(address(seller.nftAddress)).redeem(_voucher, address(buyer.buyer));

            emit AmountDistributed(address(buyer.buyer), buyer.pricePaid, 0, fee);
        }

    }

    /**
     * @notice This is the internal function used in case if seller is a custodial wallet and buyer is non-custodial wallet
     * @dev `buyer` and `seller` will be used in case of secondary sell
     * @dev `seller` and `_voucher` will be used in case of primary sell
     * @param buyer is a HeftyVerseBuyer describing the NFT to be bought
     * @param seller is a HeftyVerseSeller describing the NFT to be sold
     * @param _voucher is a SFTVoucher describing an unminted NFT
     */
    function BuyCustodial2NonCustodial(HeftyVerseBuyer memory buyer,HeftyVerseSeller memory seller, Voucher.SFTvoucher memory _voucher) internal {
        if(!_voucher.toMint) {
            address signerSeller = _verifySeller(seller);
            require(
                address(seller.owner) == signerSeller, 
                "invalid Seller"
            );
            address signerBuyer = _verifyBuyer(buyer);
            require(
                address(buyer.buyer) == signerBuyer,
                "invalid buyer"
            );

            require(IERC1155(address(seller.nftAddress)).balanceOf(address(seller.owner), seller.tokenID) >= seller.amount,"not enough balance for token");
            // royalty given
            (address receiver,uint royaltyAmount) = ISFTTemplate(address(seller.nftAddress)).royaltyInfo(seller.tokenID,buyer.pricePaid);
            token.transferFrom(address(buyer.buyer), receiver , royaltyAmount);
            //market fee deducted
            uint fee = (buyer.pricePaid * marketFee) / 10000;
            token.transferFrom(
                        address(buyer.buyer), 
                        marketWallet,
                        fee
                        );
            //payment transfer
            token.transferFrom(
                        address(buyer.buyer), 
                        treasury, 
                        buyer.pricePaid - (royaltyAmount+ fee)
                        );
            // nft transfer
            IERC1155(address(seller.nftAddress)).safeTransferFrom(
                        address(seller.owner), 
                        address(buyer.buyer), 
                        seller.tokenID,
                        seller.amount,
                        ""
                        );

            emit AmountDistributed(address(buyer.buyer), buyer.pricePaid, royaltyAmount, fee);
        } else {
            address signerBuyer = _verifyBuyer(buyer);
            require(
                address(buyer.buyer) == signerBuyer,
                "invalid buyer"
            );
            require(
                address(buyer.nftAddress) == address(_voucher.nftAddress),
                "mismatched addresses"
            );
            require(
                _voucher.price <= buyer.pricePaid,
                "invalid price"
            );

            //market fee deducted
           
            uint fee = (buyer.pricePaid * marketFee) / 10000;
            token.transferFrom(
                        address(buyer.buyer), 
                        marketWallet,
                        fee
                        );
            //payment transfer
            
            token.transferFrom(
                        address(buyer.buyer), 
                        ISFTTemplate(address(seller.nftAddress)).creator(), 
                        buyer.pricePaid - fee
                        );
            // token redeeming
            ISFTTemplate(address(seller.nftAddress))
                .redeem(_voucher, address(buyer.buyer));

            emit AmountDistributed(address(buyer.buyer), buyer.pricePaid, 0, fee);
        }
    }

    /**
     * @notice This is the internal function used in case if seller is a non-custodial wallet and buyer is custodial wallet
     * @dev `buyer` and `seller` will be used in case of secondary sell
     * @dev `seller` and `_voucher` will be used in case of primary sell
     * @param buyer is a HeftyVerseBuyer describing the NFT to be bought
     * @param seller is a HeftyVerseSeller describing the NFT to be sold
     * @param _voucher is a SFTVoucher describing an unminted NFT
     */
    function BuyNonCustodial2Custodial(HeftyVerseBuyer memory buyer,HeftyVerseSeller memory seller, Voucher.SFTvoucher memory _voucher) internal {
        if(!_voucher.toMint) {
            address signerSeller = _verifySeller(seller);
            require(
                address(seller.owner) == signerSeller,
                "invalid Seller"
                );
            address signerBuyer = _verifyBuyer(buyer);
            require(
                address(buyer.buyer) == signerBuyer,
                "invalid buyer"
                );
            require(
                IERC1155(address(seller.nftAddress))
                    .balanceOf(address(seller.owner), seller.tokenID) >= seller.amount,
                "not enough balance for token"
            );

            // royalty given
            (address receiver,uint royaltyAmount) = ISFTTemplate(address(seller.nftAddress)).royaltyInfo(seller.tokenID,buyer.pricePaid);
            token.transferFrom(
                treasury, 
                receiver , 
                royaltyAmount
            );
            //market fee deducted
            uint fee = (buyer.pricePaid * marketFee) / 10000;
            token.transferFrom(
                treasury, 
                marketWallet,
                fee
            );
            //payment transfer
            token.transferFrom(
                treasury, 
                address(seller.owner), 
                buyer.pricePaid - (royaltyAmount+ fee)
            );
            //nft transfer
            IERC1155(address(seller.nftAddress))
                .safeTransferFrom(
                    address(seller.owner), 
                    address(buyer.buyer), 
                    seller.tokenID,
                    seller.amount,
                    ""
                );

            emit AmountDistributed(address(buyer.buyer), buyer.pricePaid, royaltyAmount, fee);
        } else {
            address signerBuyer = _verifyBuyer(buyer);
            require(
                address(buyer.buyer) == signerBuyer,
                "invalid buyer"
            );
            require(
                address(buyer.nftAddress) == address(_voucher.nftAddress),
                "mismatched addresses"
            );
            require(
                _voucher.price <= buyer.pricePaid,
                "invalid price"
            );

            //market fee deducted
            uint fee = (buyer.pricePaid * marketFee) / 10000;
            token.transferFrom(treasury, marketWallet,fee);
            // token redeeming
            ISFTTemplate(address(seller.nftAddress))
                .redeem(
                    _voucher, 
                    address(buyer.buyer))
                ;

            emit AmountDistributed(address(buyer.buyer), buyer.pricePaid, 0, fee);
        }
    }

    /**
     * @notice This is the internal function used in case if seller is a non-custodial wallet and buyer is also non-custodial wallet
     * @dev `buyer` and `seller` will be used in case of secondary sell
     * @dev `seller` and `_voucher` will be used in case of primary sell
     * @param buyer is a HeftyVerseBuyer describing the NFT to be bought
     * @param seller is a HeftyVerseSeller describing the NFT to be sold
     * @param _voucher is a SFTVoucher describing an unminted NFT
     */
    function BuyNonCustodial2NonCustodial(HeftyVerseBuyer memory buyer,HeftyVerseSeller memory seller, Voucher.SFTvoucher memory _voucher) internal {
        if(!_voucher.toMint) {
            address signerSeller = _verifySeller(seller);
            require(
                address(seller.owner) == signerSeller, 
            "invalid Seller"
            );
            address signerBuyer = _verifyBuyer(buyer);
            require(
                address(buyer.buyer) == signerBuyer,
            "invalid buyer"
            );
            require(
                IERC1155(address(seller.nftAddress))
                    .balanceOf(address(seller.owner), seller.tokenID) >= seller.amount,
            "not enough balance for token"
            );

            // royalty given
            (address receiver,uint royaltyAmount) = ISFTTemplate(address(seller.nftAddress)).royaltyInfo(seller.tokenID,buyer.pricePaid);
            token.transferFrom(
                address(buyer.buyer), 
            receiver , 
            royaltyAmount
            ); 
            //market fee deducted
            uint fee = (buyer.pricePaid * marketFee) / 10000;
            token.transferFrom(address(buyer.buyer), marketWallet,fee);
            //payment transfer
            token.transferFrom(
                address(buyer.buyer), 
            address(seller.owner), 
            buyer.pricePaid - (royaltyAmount+ fee)
            );
            //nft transfer
            IERC1155(address(seller.nftAddress)).safeTransferFrom(
                address(seller.owner), 
                address(buyer.buyer), 
                seller.tokenID,
                seller.amount,
                ""
            );

            emit AmountDistributed(address(buyer.buyer), buyer.pricePaid, royaltyAmount, fee);
        } else {
             address signerBuyer = _verifyBuyer(buyer);
            require(
                address(buyer.buyer) == signerBuyer,
                "invalid buyer"
            );
            require(
                address(buyer.nftAddress) == address(_voucher.nftAddress),
                "mismatched addresses"
            );
            require(
                _voucher.price <= buyer.pricePaid,
                "invalid price"
            );

            //market fee deducted
            uint fee = (buyer.pricePaid * marketFee) / 10000;
            token.transferFrom(address(buyer.buyer), marketWallet,fee);
            //payment transfer
            token.transferFrom(
                address(buyer.buyer), 
                address(seller.owner), 
                buyer.pricePaid - fee
                );
                
            // token redeeming
            ISFTTemplate(address(seller.nftAddress))
                .redeem(
                    _voucher, 
                    address(buyer.buyer))
                ;
            emit AmountDistributed(address(buyer.buyer), buyer.pricePaid, 0, fee);
        }
    }

    /**
     * @notice Function to set new token for buy/sell in the marketplace
     * @param _token is the new token which will be used for buy/sell in the marketplace
     */
    function setToken(address _token) external {
        require(_token != address(0),"zero address sent");
        token = IERC20(_token);
    }

    /**
     * @notice Function to set new address for market wallet
     * @param _wallet is the new wallet address where marketplace fee will be sent
     */
    function setMarketingWallet(address _wallet) external{
        require(_wallet != address(0),"zero address sent");
        marketWallet = _wallet;
    }
    
    /**
     * @notice Function to set new address for market wallet
     * @param _wallet is the new wallet address where marketplace fee will be sent
     */
    function settreasury(address _wallet) external{
        require(_wallet != address(0),"zero address sent");
        treasury = _wallet;
    }

    /**
     * @notice Function to set new marketplace fee in bps
     * @param _fee is the new marketplace fee
     */
    function setMarketFee(uint _fee) external{
        require(_fee <= 10000, "invalid value");
        marketFee = _fee;
    }

    /**
     * @notice Function to withdraw stuck tokens from the contract
     * @param _token is the token to be withdrawn
     * @param _amount is the amount to be withdrawn
     */
    function withdrawStuckToken(address _token, uint256 _amount) public{
        require(_token!=address(0),"Zero address sent");
        IERC20(_token).transfer(msg.sender, _amount);
        emit TokenWithdrawn(_amount);
    }

    function _msgSender()
        internal
        view
        override(BasicMetaTransaction)
        returns (address sender)
    {
        return super._msgSender();
    }    
}