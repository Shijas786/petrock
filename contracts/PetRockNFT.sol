// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title PetRockNFT
 * @notice A minimal ERC721 implementation for minting and feeding Pet Rocks
 * @dev Single-file contract with no external dependencies for easy verification
 */
contract PetRockNFT {
    // ERC721 Metadata
    string public constant name = "Onchain Pet Rock";
    string public constant symbol = "ROCK";

    // Token counter
    uint256 private _nextTokenId = 1;

    // Pet Rock State
    mapping(uint256 => uint256) public xp;
    mapping(uint256 => uint256) public lastFedAt;

    // ERC721 Core State
    mapping(uint256 => address) private _owners;
    mapping(address => uint256) private _balances;
    mapping(uint256 => address) private _tokenApprovals;
    mapping(address => mapping(address => bool)) private _operatorApprovals;

    // Owner enumeration (simple approach for toy dApp)
    mapping(address => uint256[]) private _ownedTokens;
    mapping(uint256 => uint256) private _ownedTokensIndex;

    // ERC721 Events
    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);
    event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId);
    event ApprovalForAll(address indexed owner, address indexed operator, bool approved);

    // Pet Rock Events
    event PetMinted(address indexed to, uint256 indexed tokenId);
    event PetFed(uint256 indexed tokenId, uint256 newXp);

    // ERC165 Interface Support
    function supportsInterface(bytes4 interfaceId) public pure returns (bool) {
        return
            interfaceId == 0x01ffc9a7 || // ERC165
            interfaceId == 0x80ac58cd || // ERC721
            interfaceId == 0x5b5e139f;   // ERC721Metadata
    }

    // ============ VIEW FUNCTIONS ============

    function totalSupply() public view returns (uint256) {
        return _nextTokenId - 1;
    }

    function balanceOf(address owner) public view returns (uint256) {
        require(owner != address(0), "ERC721: address zero is not a valid owner");
        return _balances[owner];
    }

    function ownerOf(uint256 tokenId) public view returns (address) {
        address owner = _owners[tokenId];
        require(owner != address(0), "ERC721: invalid token ID");
        return owner;
    }

    function tokenOfOwnerByIndex(address owner, uint256 index) public view returns (uint256) {
        require(index < balanceOf(owner), "ERC721: owner index out of bounds");
        return _ownedTokens[owner][index];
    }

    function getApproved(uint256 tokenId) public view returns (address) {
        require(_owners[tokenId] != address(0), "ERC721: invalid token ID");
        return _tokenApprovals[tokenId];
    }

    function isApprovedForAll(address owner, address operator) public view returns (bool) {
        return _operatorApprovals[owner][operator];
    }

    function tokenURI(uint256 tokenId) public view returns (string memory) {
        require(_owners[tokenId] != address(0), "ERC721: invalid token ID");
        // Returns empty string - metadata can be handled off-chain or upgraded later
        return "";
    }

    function canFeed(uint256 tokenId) public view returns (bool) {
        return block.timestamp >= lastFedAt[tokenId] + 1 days;
    }

    function timeUntilNextFeed(uint256 tokenId) public view returns (uint256) {
        if (canFeed(tokenId)) return 0;
        return (lastFedAt[tokenId] + 1 days) - block.timestamp;
    }

    // ============ WRITE FUNCTIONS ============

    function mint() public returns (uint256) {
        uint256 tokenId = _nextTokenId++;
        address to = msg.sender;

        _balances[to] += 1;
        _owners[tokenId] = to;

        // Add to enumeration
        _ownedTokensIndex[tokenId] = _ownedTokens[to].length;
        _ownedTokens[to].push(tokenId);

        // Initialize pet rock state
        xp[tokenId] = 0;
        lastFedAt[tokenId] = 0;

        emit Transfer(address(0), to, tokenId);
        emit PetMinted(to, tokenId);

        return tokenId;
    }

    function feed(uint256 tokenId) public {
        require(ownerOf(tokenId) == msg.sender, "Not the owner");
        require(block.timestamp >= lastFedAt[tokenId] + 1 days, "Already fed recently");

        xp[tokenId] += 10;
        lastFedAt[tokenId] = block.timestamp;

        emit PetFed(tokenId, xp[tokenId]);
    }

    function approve(address to, uint256 tokenId) public {
        address owner = ownerOf(tokenId);
        require(to != owner, "ERC721: approval to current owner");
        require(
            msg.sender == owner || isApprovedForAll(owner, msg.sender),
            "ERC721: approve caller is not token owner or approved for all"
        );

        _tokenApprovals[tokenId] = to;
        emit Approval(owner, to, tokenId);
    }

    function setApprovalForAll(address operator, bool approved) public {
        require(msg.sender != operator, "ERC721: approve to caller");
        _operatorApprovals[msg.sender][operator] = approved;
        emit ApprovalForAll(msg.sender, operator, approved);
    }

    function transferFrom(address from, address to, uint256 tokenId) public {
        require(_isApprovedOrOwner(msg.sender, tokenId), "ERC721: caller is not token owner or approved");
        _transfer(from, to, tokenId);
    }

    function safeTransferFrom(address from, address to, uint256 tokenId) public {
        safeTransferFrom(from, to, tokenId, "");
    }

    function safeTransferFrom(address from, address to, uint256 tokenId, bytes memory data) public {
        require(_isApprovedOrOwner(msg.sender, tokenId), "ERC721: caller is not token owner or approved");
        _transfer(from, to, tokenId);
        require(_checkOnERC721Received(from, to, tokenId, data), "ERC721: transfer to non ERC721Receiver implementer");
    }

    // ============ INTERNAL FUNCTIONS ============

    function _isApprovedOrOwner(address spender, uint256 tokenId) internal view returns (bool) {
        address owner = ownerOf(tokenId);
        return (spender == owner || isApprovedForAll(owner, spender) || getApproved(tokenId) == spender);
    }

    function _transfer(address from, address to, uint256 tokenId) internal {
        require(ownerOf(tokenId) == from, "ERC721: transfer from incorrect owner");
        require(to != address(0), "ERC721: transfer to the zero address");

        // Clear approvals
        delete _tokenApprovals[tokenId];

        // Update balances
        _balances[from] -= 1;
        _balances[to] += 1;
        _owners[tokenId] = to;

        // Update enumeration - remove from sender
        _removeTokenFromOwnerEnumeration(from, tokenId);
        // Add to receiver
        _ownedTokensIndex[tokenId] = _ownedTokens[to].length;
        _ownedTokens[to].push(tokenId);

        emit Transfer(from, to, tokenId);
    }

    function _removeTokenFromOwnerEnumeration(address from, uint256 tokenId) private {
        uint256 lastTokenIndex = _ownedTokens[from].length - 1;
        uint256 tokenIndex = _ownedTokensIndex[tokenId];

        if (tokenIndex != lastTokenIndex) {
            uint256 lastTokenId = _ownedTokens[from][lastTokenIndex];
            _ownedTokens[from][tokenIndex] = lastTokenId;
            _ownedTokensIndex[lastTokenId] = tokenIndex;
        }

        _ownedTokens[from].pop();
        delete _ownedTokensIndex[tokenId];
    }

    function _checkOnERC721Received(
        address from,
        address to,
        uint256 tokenId,
        bytes memory data
    ) private returns (bool) {
        if (to.code.length > 0) {
            try IERC721Receiver(to).onERC721Received(msg.sender, from, tokenId, data) returns (bytes4 retval) {
                return retval == IERC721Receiver.onERC721Received.selector;
            } catch (bytes memory reason) {
                if (reason.length == 0) {
                    revert("ERC721: transfer to non ERC721Receiver implementer");
                } else {
                    assembly {
                        revert(add(32, reason), mload(reason))
                    }
                }
            }
        } else {
            return true;
        }
    }
}

interface IERC721Receiver {
    function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes calldata data
    ) external returns (bytes4);
}

