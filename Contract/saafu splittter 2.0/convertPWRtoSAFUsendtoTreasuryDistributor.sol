// SPDX-License-Identifier: MIT

// treasury 0xc690fE0d47803ed50E1EA7109a9750360117aa22
// safu 0x86d287870F0f120E62d1b23EC080cDA92FaD0C91
// router 0x581fA0Ee5A68a1Fe7c8Ad1Eb2bfdD9cF66d3d923

pragma solidity ^0.8.0;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v4.5/contracts/token/ERC20/IERC20.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v4.5/contracts/access/Ownable.sol";
import "https://github.com/Uniswap/v2-periphery/blob/master/contracts/interfaces/IUniswapV2Router02.sol";

contract EtherToTokenSwap is Ownable {
    address public treasuryWallet;
    address public tokenAddress;
    IUniswapV2Router02 public uniswapRouter;
    uint256 public totalEtherReceived;
    uint256 public totalTokensTransferred;

    constructor(address _treasuryWallet, address _tokenAddress, address _uniswapRouter) {
        treasuryWallet = _treasuryWallet;
        tokenAddress = _tokenAddress;
        uniswapRouter = IUniswapV2Router02(_uniswapRouter);
    }

    receive() external payable {
        totalEtherReceived += msg.value;
        swapEtherForToken(msg.value);
    }

    function swapEtherForToken(uint etherAmount) private {
        address[] memory path = new address[](2);
        path[0] = uniswapRouter.WETH();
        path[1] = tokenAddress;

        uniswapRouter.swapExactETHForTokens{value: etherAmount}(
            0, // accept any amount of tokens
            path,
            address(this),
            block.timestamp
        );

        uint tokenAmount = IERC20(tokenAddress).balanceOf(address(this));
        totalTokensTransferred += tokenAmount;
        IERC20(tokenAddress).transfer(treasuryWallet, tokenAmount);
    }

    function recoverERC20(address _tokenAddress, uint256 tokenAmount) public onlyOwner {
        IERC20(_tokenAddress).transfer(owner(), tokenAmount);
    }

    function withdrawEther(uint256 amount) public onlyOwner {
        payable(owner()).transfer(amount);
    }

    function updateTreasuryWallet(address newTreasuryWallet) public onlyOwner {
        treasuryWallet = newTreasuryWallet;
    }

    function updateUniswapRouter(address newUniswapRouter) public onlyOwner {
        uniswapRouter = IUniswapV2Router02(newUniswapRouter);
    }

    function updateTokenAddress(address newTokenAddress) public onlyOwner {
        tokenAddress = newTokenAddress;
    }
}
