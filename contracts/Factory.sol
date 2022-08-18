// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.14;

import "@openzeppelin/contracts/proxy/Clones.sol";
import "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/IERC721Upgradeable.sol";
import "./interfaces/INFTTemplate.sol";
import "./interfaces/ISFTTemplate.sol";
import "./Relayer/BasicMetaTransaction.sol";
import "./libraries/VoucherLib.sol";

contract TokenFactory is Initializable, BasicMetaTransaction {

    // Admin of the contract
    address public admin;

    // Template of ERC721
    address public template721Address;

    // Template of ERC1155
    address public template1155Address;

    // Marketplace address for ERC721
    address public marketplace721;

    // Marketplace address for ERC1155
    address public marketplace1155;
    
    // MarketPlace address for both
    address public marketPlace;

    // Counter to create unique salt
    uint256 public counter;

    // Mapping of last contract deployed by any address
    mapping (address=>mapping(uint256=>address)) public userLastNFTContracts;

    event ERC721Created(address indexed token, string name, string symbol);
    event ERC1155Created(address indexed token, string uri);

    /**
     * @dev Initializes the contract by setting a `template721Address`, `template1155Address` and `marketplace` for the contract
     * @param _template721Address is set as the template of ERC721 that will be redeployed using create721Token()
     * @param _template1155Address is set as the template of ERC1155 that will be redeployed using create1155Token()
    //  *  set as the address of the marketplace contract for ERC721
    //  *  set as the address of the marketplace contract for ERC1155
     */
    function initialize(address _template721Address,  address _template1155Address, address _marketplace) external initializer {
        admin = msg.sender;
        template721Address = _template721Address;
        template1155Address = _template1155Address;
        // marketplace721 = _marketplace721;
        // marketplace1155 = _marketplace1155;
        marketPlace = _marketplace;
    }

    /**
     * @notice deploys a clone of the ERC721 template contracts using the openzeppelin clones contract
     * @param name is set as the name of the deployed ERC721 
     * @param symbol is set as the symbol of the deployed ERC721 
     * @param _admin is set as the admin of the deployed ERC721 which will be the creator itself
     * @param _creator is set as the admin of the deployed ERC1155 which will be the creator itself
     * @param _token20 is set as the token using which NFT will be bought
     */
    function create721Token(string memory name, string memory symbol,address _admin,address _creator,address _token20) external returns(address token) {
        bytes32 salt = keccak256(abi.encodePacked(counter,name,_creator));
        token = Clones.cloneDeterministic(template721Address,salt);
        userLastNFTContracts[msg.sender][counter]=token;
        counter++;

        INFTTemplate(token).initialize(
            name,
            symbol,
            _admin,
            _creator,
            _token20,
            address(this)
        );
        
        emit ERC721Created(token, name, symbol);
    }

    /**
     * @notice deploys a clone of the ERC1155 template contracts using the openzeppelin clones contract
     * @param uri is set as the uri of the deployed ERC1155
     * @param _creator is set as the admin of the deployed ERC1155 which will be the creator itself
     * @param _admin is set as the second admin of the deployed ERC1155 which will be the platform owner
     * @param _token20 is set as the token using which SFT will be bought
     */
    function create1155Token(string memory uri,address _creator,address _admin,address _token20) external returns (address token1155){
        bytes32 salt = keccak256(abi.encodePacked(counter,uri,_creator));
        token1155 = Clones.cloneDeterministic(template1155Address, salt);
        userLastNFTContracts[msg.sender][counter]=token1155;
        counter++;
        
        ISFTTemplate(token1155).initialize(
            uri, 
            _creator, 
            _admin, 
            _token20, 
            address(this));
        
        emit ERC1155Created(token1155, uri);
    }

    /**
     * @dev Computes the address of a clone deployed using {Clones-cloneDeterministic}.
     */
    function predictDeterministicAddress(
        address implementation,
        bytes32 salt,
        address deployer
    ) internal pure returns (address predicted) {
        assembly {
            let ptr := mload(0x40)
            mstore(ptr, 0x3d602d80600a3d3981f3363d3d373d3d3d363d73000000000000000000000000)
            mstore(add(ptr, 0x14), shl(0x60, implementation))
            mstore(add(ptr, 0x28), 0x5af43d82803e903d91602b57fd5bf3ff00000000000000000000000000000000)
            mstore(add(ptr, 0x38), shl(0x60, deployer))
            mstore(add(ptr, 0x4c), salt)
            mstore(add(ptr, 0x6c), keccak256(ptr, 0x37))
            predicted := keccak256(add(ptr, 0x37), 0x55)
        }
    }

    /**
     * @dev Computes the address of a clone deployed using {Clones-cloneDeterministic}.
     */
    function predictDeterministicAddress(address implementation, bytes32 salt)
        external
        view
        returns (address predicted)
    {
        return predictDeterministicAddress(implementation, salt, address(this));
    } 

    /**
     * @notice Function to update the template of ERC721
     * @param _template is the new template address
     */
    function updateTemplate721(address _template) external {
        require(_template!=address(0),"Zero address sent");
        require(msg.sender == admin, "TokenFactory: Caller not admin");
        template721Address = _template;
    }

    /**
     * @notice Function to update the template of ERC1155
     * @param _template is the new template address
     */
    function updateTemplate1155(address _template) external {
        require(_template!=address(0),"Zero address sent");
        require(msg.sender == admin, "TokenFactory: Caller not admin");
        template1155Address = _template;
    }
    
    // /**
    //  * @notice Function to update the address of the marketplace contract for ERC721
    //  * @param _marketplace721 is the new marketplace address for ERC721
    //  */
    // function updateMarketplace721(address _marketplace721) external {
    //     require(_marketplace721!=address(0),"Zero address sent");
    //     require(msg.sender == admin, "TokenFactory: Caller not admin");
    //     marketplace721 = _marketplace721;
    // }

    /**
     * @notice Function to update the address of the marketplace contract 
     * @param _marketplace is the new marketplace address 
     */
    function updateMarketplace(address _marketplace) external {
        require(_marketplace!=address(0),"Zero address sent");
        require(msg.sender == admin, "TokenFactory: Caller not admin");
        marketPlace = _marketplace;
    }

    // /**
    //  * @notice Function to update the address of the marketplace contract for ERC1155
    //  * @param _marketplace1155 is the new marketplace address for ERC1155
    //  */
    // function updateMarketplace1155(address _marketplace1155) external {
    //     require(_marketplace1155!=address(0),"Zero address sent");
    //     require(msg.sender == admin, "TokenFactory: Caller not admin");
    //     marketplace1155 = _marketplace1155;
    // }

    /**
     * @notice Function to update the admin of this contract
     * @param _newAdmin is the new admin address
     */
    function updateAdmin(address _newAdmin) external {
        require(_newAdmin!=address(0),"Zero address sent");
        require(msg.sender == admin, "TokenFactory: Caller not admin");
        admin = _newAdmin;
    }   
} 



