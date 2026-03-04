// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title Counter
 * @dev Minimal contract: one number, increment, and read. Used for learning the stack.
 */
contract Counter {
    uint256 public number;

    function setNumber(uint256 _number) external {
        number = _number;
    }

    function increment() external {
        number++;
    }
}
