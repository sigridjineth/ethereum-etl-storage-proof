// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console2} from "forge-std/Test.sol";
import {Counter} from "../src/Counter.sol";
import "forge-std/console.sol";

contract CounterTest is Test {
    Counter public counter;

    function setUp() public {
        counter = new Counter();
        counter.setNumber(0);
    }

    function test_Increment() public {
        counter.increment();
        assertEq(counter.number(), 1);
    }

    function testFuzz_SetNumber(uint256 x) public {
        counter.setNumber(x);
        assertEq(counter.number(), x);
    }

    // A function to calculate the storage key for a hypothetical mapping
    function test_calculateStorageKey(uint256 key) public view returns (bytes32) {
        uint256 slot = 4;
        bytes32 storageKey = keccak256(abi.encodePacked(key, slot));
        console.logBytes32(storageKey);
        return storageKey;
    }
}
