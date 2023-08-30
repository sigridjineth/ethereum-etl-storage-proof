// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0;

import "./ERC721A.sol";

contract StarknetTest is ERC721A {

constructor() ERC721A("StarknetTest", "STK") {}

    function mint(address to, uint256 tokenId) external {
        _mint(to, tokenId);
    }

    function burn(uint256 tokenId) external {
        _burn(tokenId);
    }
}