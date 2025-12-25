// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract LiTreeNFT is ERC721URIStorage, Ownable {
    uint256 public nextTokenId;
    uint256 public mintPrice = 0.01 ether;
    mapping(address => bool) public hasMintedLootBox;

    constructor() ERC721("LiTreeNFT", "LITREE") {}

    function mintNFT(string memory tokenURI) public payable {
        require(msg.value >= mintPrice, "Insufficient payment");
        uint256 tokenId = nextTokenId++;
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, tokenURI);
    }

    function mintLootBox(string memory tokenURI) public payable {
        require(!hasMintedLootBox[msg.sender], "Loot box already claimed");
        require(msg.value >= mintPrice, "Insufficient payment");
        hasMintedLootBox[msg.sender] = true;
        uint256 tokenId = nextTokenId++;
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, tokenURI);
    }

    function setMintPrice(uint256 price) external onlyOwner {
        mintPrice = price;
    }

    function withdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
}
