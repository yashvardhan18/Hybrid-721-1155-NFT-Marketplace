//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.14;

import "@openzeppelin/contracts-upgradeable/token/ERC1155/extensions/ERC1155URIStorageUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/common/ERC2981Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/cryptography/draft-EIP712Upgradeable.sol";
import "./Relayer/BasicMetaTransaction.sol";
import "./libraries/VoucherLib.sol";
import "./interfaces/IFactory.sol";

contract Template1155 is ERC1155URIStorageUpgradeable, ERC2981Upgradeable, EIP712Upgradeable, BasicMetaTransaction{

    // Admin of the contract
    address public admin;

    // Creator of the NFT
    address public creator;

    // Factory contract address
    address public factory;

    // Mapping of the operator which have specific accesses
    mapping(address => bool) public operators;

    // Mapping of the counters that has been redeemed
    mapping(uint256 => bool) public redeemedCounter;

    // Mapping of the counter to the amount left in voucher
    mapping (uint256 => uint256) public amountLeft;

    modifier onlyOperator {
      require(operators[msg.sender],"not operator");
      _;
    }

    /**
     * @notice Initializes the contract by setting a `admin`, `creator`, `factory` and `token` for the contract
     * @param uri is set as the uri of the deployed ERC1155
     * @param _creator is set as the admin of the deployed ERC1155 which will be the creator itself
     * @param _admin is set as the second admin of the deployed ERC1155 which will be the platform owner
     * @param _token is set as the token using which SFT will be bought
     * @param _factory is set as the factory address
     */
    function initialize(string memory uri, 
                        address _creator, 
                        address _admin, 
                        address _token, 
                        address _factory) public initializer {
        __ERC1155_init(uri);
        __ERC1155URIStorage_init();
        __ERC2981_init();
        __EIP712_init("HeftyVerse_NFT_Voucher", "1");
        

        admin = _admin;
        creator = _creator;
        factory = _factory;
        // token = IERC20(_token);
        operators[_admin] = true;
        operators[_creator] = true;
        operators[_factory] = true;
    }

     /**
     * @notice This is an internal function modified to mint the NFT and set the token URI and royalty info
     * @param to is the address to which NFT will be minted
     * @param tokenId is the ID of the NFT to be minted
     * @param mintAmount is the amount of tokens to be minted of the same tokenID
     * @param tokenURI is the URI of the token
     * @param royaltyKeeper is the address to which the royalty will be sent
     * @param royaltyFees is the royalty percentage in bps
     */
    function MintNFT(address to, uint256 tokenId, uint256 mintAmount, string memory tokenURI, address royaltyKeeper, uint96 royaltyFees) internal {
        _mint(to, tokenId, mintAmount, "");
        _setURI(tokenId, tokenURI);
        if(royaltyKeeper != address(0)) {
            _setTokenRoyalty(tokenId, royaltyKeeper, royaltyFees);
        }
    }

    /**
     * @notice Returns a hash of the given SFTvoucher, prepared using EIP712 typed data hashing rules.
     * @param voucher is a SFTvoucher to hash.
     */
    function _hash(Voucher.SFTvoucher calldata voucher) internal view returns (bytes32) {
        return _hashTypedDataV4(keccak256(abi.encode(
            keccak256(
                "SFTvoucher(address nftAddress,uint256 tokenId,uint256 price,uint256 amount,uint256 counter,string tokenUri,bool toMint,address royaltyKeeper,uint96 royaltyFees)"
            ),
            voucher.nftAddress,
            voucher.tokenId,
            voucher.price,
            voucher.amount,
            voucher.counter,
            keccak256(bytes(voucher.tokenUri)),
            voucher.toMint,
            voucher.royaltyKeeper,
            voucher.royaltyFees
            )
        ));
    }

    /**
     * @notice Verifies the signature for a given SFTvoucher, returning the address of the signer.
     * @dev Will revert if the signature is invalid.
     * @param voucher is a SFTvoucher describing the SFT to be bought
     */
    function _verify(Voucher.SFTvoucher calldata voucher)
        internal
        view
        returns (address)
    {
        bytes32 digest = _hash(voucher);
        return ECDSAUpgradeable.recover(digest, voucher.signature);
    }

    /**
     * @notice Redeems an SFTvoucher for an actual SFT, creating it in the process.
     * @param redeemer The address of the account which will receive the SFT upon success.
     * @param _voucher A signed SFTvoucher that describes the SFT to be redeemed.
     */
    function redeem(Voucher.SFTvoucher calldata _voucher, address redeemer, uint amount) public {
        require(!redeemedCounter[_voucher.counter]);    
        require(_voucher.nftAddress == address(this));
        
        address signer = _verify(_voucher);
        require(signer == admin || signer == creator);

        // Handling counter and amount
        if(amountLeft[_voucher.counter] == 0) {
            amountLeft[_voucher.counter] = _voucher.amount - amount;
        } else {
            amountLeft[_voucher.counter] = amountLeft[_voucher.counter] - amount;
        }
        if(amountLeft[_voucher.counter] == 0)
            redeemedCounter[_voucher.counter] = true;


        MintNFT(signer, _voucher.tokenId,_voucher.amount, _voucher.tokenUri, _voucher.royaltyKeeper, _voucher.royaltyFees);
        _safeTransferFrom(signer, redeemer, _voucher.tokenId,_voucher.amount,"");
    }

    /**
     * @notice Standard safeTransferFrom function is modified to bypass the check for approval if msg sender is marketplace
     */
    function safeTransferFrom(
        address from,
        address to,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) public override {
        if(msg.sender != IFactory(factory).marketplace1155())
        require(
            from == _msgSender() || isApprovedForAll(from, _msgSender()),
            "ERC1155: not approved"
        );
        _safeTransferFrom(from, to, id, amount, data);
    }

    /**
     * @notice Standard safeBatchTransferFrom function is modified to bypass the check for approval if msg sender is marketplace
     */
    function safeBatchTransferFrom(
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) public override {
        if(msg.sender != IFactory(factory).marketplace1155())
        require(
            from == _msgSender() || isApprovedForAll(from, _msgSender()),
            "ERC1155: not approved"
        );
        _safeBatchTransferFrom(from, to, ids, amounts, data);
    }

    /**
     * @notice Function to update the status of operators
     */
    function updateOperator(address _account, bool _status) external {
        require(_account!=address(0));
        require(msg.sender == admin,"not admin");
        operators[_account] = _status;
    }

    /**
     * @notice Function to change the admin of the contract
     * @param _admin is the new admin address
     */
    function setAdmin(address _admin) external onlyOperator {
        require(_admin!=address(0));
        admin = _admin;
    }

    /**
     * @notice Function to change the creator of the contract
     * @param _creator is the new admin address
     */
    function setCreator(address _creator) external onlyOperator {
        require(_creator!=address(0));
        creator = _creator;
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC1155Upgradeable, ERC2981Upgradeable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function _msgSender()
        internal
        view
        override(ContextUpgradeable,BasicMetaTransaction)
        returns (address sender)
    {
        return super._msgSender();
    }
}