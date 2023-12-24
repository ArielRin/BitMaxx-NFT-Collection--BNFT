
// router 0x581fA0Ee5A68a1Fe7c8Ad1Eb2bfdD9cF66d3d923
// bitmaxx 0xc27BbD4276F9eb2D6F2c4623612412d52D7Bb43D

// contract deployed at 0xa053DfA0039fe1Ee8ceAB169Acb8A565997EC290

pragma solidity ^0.8.0;

import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v4.5/contracts/token/ERC20/IERC20.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v4.5/contracts/access/Ownable.sol";
import "https://github.com/Uniswap/v2-periphery/blob/master/contracts/interfaces/IUniswapV2Router02.sol";


contract EthToTokenAutoConversion is Ownable {
    IUniswapV2Router02 public uniswapRouter;
    address public toTokenAddress;

    constructor(address _uniswapRouterAddress, address _toTokenAddress) Ownable() {
        require(_uniswapRouterAddress != address(0), "Invalid Uniswap router address");
        require(_toTokenAddress != address(0), "Invalid to token address");

        uniswapRouter = IUniswapV2Router02(_uniswapRouterAddress);
        toTokenAddress = _toTokenAddress;
    }

    // Function to auto-convert and send back tokens
    receive() external payable {
        require(msg.value > 0, "Must send ETH to convert");

        address[] memory path = new address[](2);
        path[0] = uniswapRouter.WETH(); // Wrapped ETH address
        path[1] = toTokenAddress;

        uniswapRouter.swapExactETHForTokens{value: msg.value}(
            1, // Minimum amount of 'to' tokens to accept (set to 1 for simplicity)
            path,
            msg.sender,
            block.timestamp
        );
    }

    // Allow the owner to recover lost ERC20 tokens
    function recoverLostERC20Tokens(address tokenAddress, uint256 amount) public onlyOwner {
        require(tokenAddress != address(0), "Cannot recover tokens of zero address");
        require(tokenAddress != toTokenAddress, "Cannot recover the 'to' token");
        IERC20(tokenAddress).transfer(owner(), amount);
    }

    // Allow the owner to withdraw ETH
    function withdrawETH() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }

    // Update Uniswap router address
    function setUniswapRouterAddress(address newUniswapRouterAddress) external onlyOwner {
        require(newUniswapRouterAddress != address(0), "Invalid Uniswap router address");
        uniswapRouter = IUniswapV2Router02(newUniswapRouterAddress);
    }
}
