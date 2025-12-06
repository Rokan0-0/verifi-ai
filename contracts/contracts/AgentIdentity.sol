// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// SIMPLIFIED ERC-8004 IMPLEMENTATION FOR HACKATHON MVP
// "Identity Registry" - Gives Agents a License Plate
contract AgentIdentity is ERC721URIStorage, Ownable {
    uint256 private _nextTokenId;

    // Mapping from Agent Address -> Token ID (License)
    mapping(address => uint256) public agentToTokenId;

    event AgentRegistered(address indexed agentWallet, uint256 indexed tokenId, string metadataURI);

    constructor() ERC721("VerifiAI AgentID", "VAI") Ownable(msg.sender) {}

    // 1. REGISTER AGENT: Anyone can mint an ID if they pay the "License Fee" (optional, free for now)
    function registerAgent(string memory uri) public returns (uint256) {
        require(agentToTokenId[msg.sender] == 0, "Agent already registered");

        uint256 tokenId = _nextTokenId++;
        _mint(msg.sender, tokenId);
        _setTokenURI(tokenId, uri);
        
        agentToTokenId[msg.sender] = tokenId;

        emit AgentRegistered(msg.sender, tokenId, uri);
        return tokenId;
    }

    // 2. VERIFY AGENT: Backend calls this to check if the Seller is legit
    function isVerifiedAgent(address agent) public view returns (bool) {
        return agentToTokenId[agent] != 0; // Returns true if they hold a token
    }
}