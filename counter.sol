// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

contract Counter {
    uint256 counter;

    constructor() {
        counter=0;
    }

    function increment() public {
        counter += 1;
    }

    function getCounter() public view returns (uint256){
        return counter;
    }

}
