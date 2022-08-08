// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./Relayer/BasicMetaTransaction.sol";

contract MyToken is ERC721, Ownable, BasicMetaTransaction {
    constructor() ERC721("MyToken", "MTK") {}

    function safeMint(address to, uint256 tokenId) public onlyOwner {
        _safeMint(to, tokenId);
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