
// File: https://github.com/Uniswap/v2-periphery/blob/master/contracts/interfaces/IUniswapV2Router01.sol

pragma solidity >=0.6.2;

interface IUniswapV2Router01 {
    function factory() external pure returns (address);
    function WETH() external pure returns (address);

    function addLiquidity(
        address tokenA,
        address tokenB,
        uint amountADesired,
        uint amountBDesired,
        uint amountAMin,
        uint amountBMin,
        address to,
        uint deadline
    ) external returns (uint amountA, uint amountB, uint liquidity);
    function addLiquidityETH(
        address token,
        uint amountTokenDesired,
        uint amountTokenMin,
        uint amountETHMin,
        address to,
        uint deadline
    ) external payable returns (uint amountToken, uint amountETH, uint liquidity);
    function removeLiquidity(
        address tokenA,
        address tokenB,
        uint liquidity,
        uint amountAMin,
        uint amountBMin,
        address to,
        uint deadline
    ) external returns (uint amountA, uint amountB);
    function removeLiquidityETH(
        address token,
        uint liquidity,
        uint amountTokenMin,
        uint amountETHMin,
        address to,
        uint deadline
    ) external returns (uint amountToken, uint amountETH);
    function removeLiquidityWithPermit(
        address tokenA,
        address tokenB,
        uint liquidity,
        uint amountAMin,
        uint amountBMin,
        address to,
        uint deadline,
        bool approveMax, uint8 v, bytes32 r, bytes32 s
    ) external returns (uint amountA, uint amountB);
    function removeLiquidityETHWithPermit(
        address token,
        uint liquidity,
        uint amountTokenMin,
        uint amountETHMin,
        address to,
        uint deadline,
        bool approveMax, uint8 v, bytes32 r, bytes32 s
    ) external returns (uint amountToken, uint amountETH);
    function swapExactTokensForTokens(
        uint amountIn,
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external returns (uint[] memory amounts);
    function swapTokensForExactTokens(
        uint amountOut,
        uint amountInMax,
        address[] calldata path,
        address to,
        uint deadline
    ) external returns (uint[] memory amounts);
    function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline)
        external
        payable
        returns (uint[] memory amounts);
    function swapTokensForExactETH(uint amountOut, uint amountInMax, address[] calldata path, address to, uint deadline)
        external
        returns (uint[] memory amounts);
    function swapExactTokensForETH(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline)
        external
        returns (uint[] memory amounts);
    function swapETHForExactTokens(uint amountOut, address[] calldata path, address to, uint deadline)
        external
        payable
        returns (uint[] memory amounts);

    function quote(uint amountA, uint reserveA, uint reserveB) external pure returns (uint amountB);
    function getAmountOut(uint amountIn, uint reserveIn, uint reserveOut) external pure returns (uint amountOut);
    function getAmountIn(uint amountOut, uint reserveIn, uint reserveOut) external pure returns (uint amountIn);
    function getAmountsOut(uint amountIn, address[] calldata path) external view returns (uint[] memory amounts);
    function getAmountsIn(uint amountOut, address[] calldata path) external view returns (uint[] memory amounts);
}

// File: https://github.com/Uniswap/v2-periphery/blob/master/contracts/interfaces/IUniswapV2Router02.sol

pragma solidity >=0.6.2;


interface IUniswapV2Router02 is IUniswapV2Router01 {
    function removeLiquidityETHSupportingFeeOnTransferTokens(
        address token,
        uint liquidity,
        uint amountTokenMin,
        uint amountETHMin,
        address to,
        uint deadline
    ) external returns (uint amountETH);
    function removeLiquidityETHWithPermitSupportingFeeOnTransferTokens(
        address token,
        uint liquidity,
        uint amountTokenMin,
        uint amountETHMin,
        address to,
        uint deadline,
        bool approveMax, uint8 v, bytes32 r, bytes32 s
    ) external returns (uint amountETH);

    function swapExactTokensForTokensSupportingFeeOnTransferTokens(
        uint amountIn,
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external;
    function swapExactETHForTokensSupportingFeeOnTransferTokens(
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external payable;
    function swapExactTokensForETHSupportingFeeOnTransferTokens(
        uint amountIn,
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external;
}

// File: v2SplitterwithNative2RewadsSwapperbuiltin.sol

// router 0x581fA0Ee5A68a1Fe7c8Ad1Eb2bfdD9cF66d3d923
// safu 0x86d287870F0f120E62d1b23EC080cDA92FaD0C91
// File: https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v4.5/contracts/utils/Context.sol


// OpenZeppelin Contracts v4.4.1 (utils/Context.sol)

pragma solidity ^0.8.0;

/**
 * @dev Provides information about the current execution context, including the
 * sender of the transaction and its data. While these are generally available
 * via msg.sender and msg.data, they should not be accessed in such a direct
 * manner, since when dealing with meta-transactions the account sending and
 * paying for execution may not be the actual sender (as far as an application
 * is concerned).
 *
 * This contract is only required for intermediate, library-like contracts.
 */
abstract contract Context {
    function _msgSender() internal view virtual returns (address) {
        return msg.sender;
    }

    function _msgData() internal view virtual returns (bytes calldata) {
        return msg.data;
    }
}

// File: https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v4.5/contracts/access/Ownable.sol


// OpenZeppelin Contracts v4.4.1 (access/Ownable.sol)

pragma solidity ^0.8.0;


/**
 * @dev Contract module which provides a basic access control mechanism, where
 * there is an account (an owner) that can be granted exclusive access to
 * specific functions.
 *
 * By default, the owner account will be the one that deploys the contract. This
 * can later be changed with {transferOwnership}.
 *
 * This module is used through inheritance. It will make available the modifier
 * `onlyOwner`, which can be applied to your functions to restrict their use to
 * the owner.
 */
abstract contract Ownable is Context {
    address private _owner;

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    /**
     * @dev Initializes the contract setting the deployer as the initial owner.
     */
    constructor() {
        _transferOwnership(_msgSender());
    }

    /**
     * @dev Returns the address of the current owner.
     */
    function owner() public view virtual returns (address) {
        return _owner;
    }

    /**
     * @dev Throws if called by any account other than the owner.
     */
    modifier onlyOwner() {
        require(owner() == _msgSender(), "Ownable: caller is not the owner");
        _;
    }

    /**
     * @dev Leaves the contract without owner. It will not be possible to call
     * `onlyOwner` functions anymore. Can only be called by the current owner.
     *
     * NOTE: Renouncing ownership will leave the contract without an owner,
     * thereby removing any functionality that is only available to the owner.
     */
    function renounceOwnership() public virtual onlyOwner {
        _transferOwnership(address(0));
    }

    /**
     * @dev Transfers ownership of the contract to a new account (`newOwner`).
     * Can only be called by the current owner.
     */
    function transferOwnership(address newOwner) public virtual onlyOwner {
        require(newOwner != address(0), "Ownable: new owner is the zero address");
        _transferOwnership(newOwner);
    }

    /**
     * @dev Transfers ownership of the contract to a new account (`newOwner`).
     * Internal function without access restriction.
     */
    function _transferOwnership(address newOwner) internal virtual {
        address oldOwner = _owner;
        _owner = newOwner;
        emit OwnershipTransferred(oldOwner, newOwner);
    }
}

// File: https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v4.5/contracts/token/ERC20/IERC20.sol


// OpenZeppelin Contracts (last updated v4.5.0) (token/ERC20/IERC20.sol)

pragma solidity ^0.8.0;

/**
 * @dev Interface of the ERC20 standard as defined in the EIP.
 */
interface IERC20 {
    /**
     * @dev Returns the amount of tokens in existence.
     */
    function totalSupply() external view returns (uint256);

    /**
     * @dev Returns the amount of tokens owned by `account`.
     */
    function balanceOf(address account) external view returns (uint256);

    /**
     * @dev Moves `amount` tokens from the caller's account to `to`.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transfer(address to, uint256 amount) external returns (bool);

    /**
     * @dev Returns the remaining number of tokens that `spender` will be
     * allowed to spend on behalf of `owner` through {transferFrom}. This is
     * zero by default.
     *
     * This value changes when {approve} or {transferFrom} are called.
     */
    function allowance(address owner, address spender) external view returns (uint256);

    /**
     * @dev Sets `amount` as the allowance of `spender` over the caller's tokens.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * IMPORTANT: Beware that changing an allowance with this method brings the risk
     * that someone may use both the old and the new allowance by unfortunate
     * transaction ordering. One possible solution to mitigate this race
     * condition is to first reduce the spender's allowance to 0 and set the
     * desired value afterwards:
     * https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729
     *
     * Emits an {Approval} event.
     */
    function approve(address spender, uint256 amount) external returns (bool);

    /**
     * @dev Moves `amount` tokens from `from` to `to` using the
     * allowance mechanism. `amount` is then deducted from the caller's
     * allowance.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transferFrom(
        address from,
        address to,
        uint256 amount
    ) external returns (bool);

    /**
     * @dev Emitted when `value` tokens are moved from one account (`from`) to
     * another (`to`).
     *
     * Note that `value` may be zero.
     */
    event Transfer(address indexed from, address indexed to, uint256 value);

    /**
     * @dev Emitted when the allowance of a `spender` for an `owner` is set by
     * a call to {approve}. `value` is the new allowance.
     */
    event Approval(address indexed owner, address indexed spender, uint256 value);
}

// File: erc20splitter.sol



/*

```markdown
# TokenSplitter Smart Contract

## Overview

The TokenSplitter smart contract allows you to distribute tokens among multiple wallets based on specified ratios. Additionally,
it provides functionality for recovering lost tokens, recovering native tokens, and managing ownership and operators.

## Usage

### Deployment

1. Deploy the TokenSplitter smart contract on the Ethereum blockchain.

### Set Wallets and Ratios

2. After deployment, set the wallets and ratios using the `setWalletsAndRatios` function.

   - Call `setWalletsAndRatios` with an array of wallet addresses and an array of corresponding ratios.
   - Example:

   ```json
   {
     "_wallets": ["0xWallet1", "0xWallet2", "0xWallet3"],
     "_ratios": [30, 40, 30]
   }
   ```

### Distribute Tokens

3. Execute the `distributeTokens` function to distribute tokens to the specified wallets based on the set ratios.

   - Only the operator or the contract owner can execute this function.

### Recover Lost Tokens

4. If any non-native tokens are accidentally sent to the contract, you can recover them using the `recoverLostTokens` function.

   - Call `recoverLostTokens` with the address of the token and the amount to recover.

### Recover Native Tokens

5. Recover native tokens (the token the contract is designed to split) using the `recoverNativeTokens` function.

   - Call `recoverNativeTokens` with the amount to recover.

### Change Ownership and Operator

6. Transfer ownership and change the operator using the `transferOwnershipAndOperator` function.

   - Only the contract owner can execute this function.

### Set Operator

7. Set a new operator using the `setOperator` function.

   - Only the contract owner can execute this function.

### Change Operator

8. Change the operator using the `changeOperator` function.

   - Only the current operator or the contract owner can execute this function.

## Security

- Ensure that you thoroughly test the contract on a testnet before deploying it on the mainnet.
- Consider obtaining a professional audit for the smart contract.
- Be cautious with the ownership and operator functions, as they can impact the security of the contract.

## Disclaimer

This smart contract and README are provided for educational purposes. Use at your own risk. Always follow best practices for smart contract development and security.
```

This README file provides a step-by-step guide on how to operate the TokenSplitter contract after deployment,
including setting wallets and ratios, distributing tokens, recovering lost and native tokens, and managing ownership and operators.
Customize it according to your specific contract details and deployment process.

 token 0x6CB6c8D16e7B6Fd5A815702B824e6Dfdf148a7D9
 wallets
 ["0x18Ff7f454B6A3233113f51030384F49054DD27BF","0xc690fE0d47803ed50E1EA7109a9750360117aa22"]
 ratios
 ["40","60"]
 operator: 0x18Ff7f454B6A3233113f51030384F49054DD27BF
*/


/*
Wallets ["0x89d49eCe2052968518bB391cA2c96f7d5E627c78","0x89d49eCe2052968518bB391cA2c96f7d5E627c78","0x89d49eCe2052968518bB391cA2c96f7d5E627c78","0x89d49eCe2052968518bB391cA2c96f7d5E627c78","0x89d49eCe2052968518bB391cA2c96f7d5E627c78","0x89d49eCe2052968518bB391cA2c96f7d5E627c78","0x89d49eCe2052968518bB391cA2c96f7d5E627c78","0x335c3CEE4d11A40B30e91d61588699188760cA3D","0x335c3CEE4d11A40B30e91d61588699188760cA3D","0x335c3CEE4d11A40B30e91d61588699188760cA3D","0x335c3CEE4d11A40B30e91d61588699188760cA3D","0x335c3CEE4d11A40B30e91d61588699188760cA3D","0x93e792125649733D08050f04fBb395B5F6EA9945","0x93e792125649733D08050f04fBb395B5F6EA9945","0x93e792125649733D08050f04fBb395B5F6EA9945","0x8Bd0247f62A5B58c0B9d1e30F812e30059E5aC5d","0xC4C958A72Bc36dccb2be414ffB31e4bFCDEf4018","0x71A32F7541ad78f375dAAEA22f9209B497C93A59","0xf878F26213238175F7aa140604AA3DCf170eef30","0xF241d7306aC62Dcc16Eb1b04f05D745C71c791A1","0xD6C9620929B5E83d00c5C99C1e6EB7772902d18D","0xb092FdFFF8b91c7354fE56ABC6908639a75C5797","0xA9CA947265A07051BeE065deA4810c5bAD4d29b2","0x952c9B691Ec7da0C76a015051C7ff5402852DBE0","0x44f32a44b767EbE95173C63d7cC0ae2B5AB0161D"]

*/


pragma solidity ^0.8.0;

// Importing IERC20 and Ownable from OpenZeppelin contracts



contract v2RewardsPaymentSplitter is Ownable {
    address[] public payees;
    address public tokenAddress; // ERC-20 token address
    uint256 public totalDistributed;
    bool public isPublicDistributeEnabled = false; // Flag to enable/disable public distribution
    uint256 public lastDistributeCall; // Timestamp of the last distribute call


    IUniswapV2Router02 public uniswapRouter;

constructor(address[] memory _payees, address _tokenAddress, address _uniswapRouterAddress) Ownable() {
        require(_payees.length > 0, "No payees provided");
        require(_tokenAddress != address(0), "Invalid token address");

        for (uint i = 0; i < _payees.length; i++) {
            payees.push(_payees[i]);
        }
        tokenAddress = _tokenAddress;
        uniswapRouter = IUniswapV2Router02(_uniswapRouterAddress);
    }

    receive() external payable {
        swapNativeTokenForERC20(msg.value);
    }

    function swapNativeTokenForERC20(uint256 amount) private {
    address[] memory path = new address[](2);
    path[0] = uniswapRouter.WETH();
    path[1] = tokenAddress;

    uniswapRouter.swapExactETHForTokens{value: amount}(
        0, // accept any amount of ERC20
        path,
        address(this),
        block.timestamp
    );
    }




    function distribute() public onlyOwner {
    require(tokenAddress != address(0), "Token address not set");

    uint256 balance = IERC20(tokenAddress).balanceOf(address(this));
    require(balance > 0, "No tokens to distribute");

    uint256 amountPerPayee = balance / payees.length;
    totalDistributed += balance; // Update total distributed

        for (uint256 i = 0; i < payees.length; i++) {
        IERC20(tokenAddress).transfer(payees[i], amountPerPayee);
        }

    }

    function updatePayees(address[] memory _payees) public onlyOwner {
        require(_payees.length > 0, "No payees provided");
        delete payees;
        for (uint i = 0; i < _payees.length; i++) {
            payees.push(_payees[i]);
        }
    }

    function addPayee(address newPayee) public onlyOwner {
        require(newPayee != address(0), "Invalid payee address");
        payees.push(newPayee);
    }

    function recoverLostERC20Tokens(address tokenAddress, uint256 amount) public onlyOwner {
    require(tokenAddress != address(this), "Cannot recover tokens of this contract");
    IERC20(tokenAddress).transfer(owner(), amount);
    }

    function recoverNativeTokens(uint256 amount) public onlyOwner {
    payable(owner()).transfer(amount);
    }

    function getPayeesList() public view returns (address[] memory) {
    return payees;
    }

    function getTokenBalance() public view returns (uint256) {
    return IERC20(tokenAddress).balanceOf(address(this));
    }

    function getTotalDistributed() public view returns (uint256) {
    return totalDistributed;
    }

    // Function to allow public distribution but only once every 24 hours
    function publicDistribute() external {
        require(isPublicDistributeEnabled, "Public distribution is disabled");
        require(block.timestamp >= lastDistributeCall + 24 hours, "Distribute can only be called once every 24 hours");
        lastDistributeCall = block.timestamp; // Update the timestamp
        distribute();
    }

    // Function to enable public distribution
    function enablePublicDistribute() external onlyOwner {
        isPublicDistributeEnabled = true;
    }

    // Function to disable public distribution
    function disablePublicDistribute() external onlyOwner {
        isPublicDistributeEnabled = false;
    }




}
