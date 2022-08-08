//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.14;

import "@openzeppelin/contracts-upgradeable/token/ERC1155/extensions/ERC1155URIStorageUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/common/ERC2981Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/cryptography/draft-EIP712Upgradeable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
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

    // Address of the token 
    IERC20 public token;

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
        token = IERC20(_token);
        operators[_admin] = true;
        operators[_creator] = true;
        operators[_factory] = true;
    }

    function MintNFT(address to, uint256 tokenId, uint256 mintAmount, string memory tokenURI, address royaltyKeeper, uint96 royaltyFees) internal {
        _mint(to, tokenId, mintAmount, "");
        _setURI(tokenId, tokenURI);
        if(royaltyKeeper != address(0)) {
            _setTokenRoyalty(tokenId, royaltyKeeper, royaltyFees);
        }
    }

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

    function _verify(Voucher.SFTvoucher calldata voucher)
        internal
        view
        returns (address)
    {
        bytes32 digest = _hash(voucher);
        return ECDSAUpgradeable.recover(digest, voucher.signature);
    }

    function redeem(Voucher.SFTvoucher calldata _voucher, address redeemer) public {
        require(!redeemedCounter[_voucher.counter],"counter used");    
        require(address(_voucher.nftAddress) == address(this),"invalid address");
        
        address signer = _verify(_voucher);
        require(signer == admin || signer == creator,"invalid signer");
        
        redeemedCounter[_voucher.counter] = true;
        MintNFT(signer, _voucher.tokenId,_voucher.amount, _voucher.tokenUri, address(_voucher.royaltyKeeper), _voucher.royaltyFees);
        _safeTransferFrom(signer, redeemer, _voucher.tokenId,_voucher.amount,"");
    }

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
            "ERC1155: caller is not token owner nor approved"
        );
        _safeTransferFrom(from, to, id, amount, data);
    }

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
            "ERC1155: caller is not token owner nor approved"
        );
        _safeBatchTransferFrom(from, to, ids, amounts, data);
    }

    function updateOperator(address _account, bool _status) external {
        require(msg.sender == admin,"not admin");
        require(_account!=address(0),"Zero address sent");
        operators[_account] = _status;
    }

    function setAdmin(address _admin) external onlyOperator {
        require(_admin!=address(0),"Zero address sent");
        admin = _admin;
    }

    function setCreator(address _creator) external onlyOperator {
        require(_creator!=address(0),"Zero address sent");
        creator = _creator;
    }

    function setToken(IERC20 _token) external onlyOperator {
        token = _token;
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