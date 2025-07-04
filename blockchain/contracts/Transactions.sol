// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Transactions {
    event TransactionSubmitted(address indexed sender, address indexed receiver, uint256 amount, uint256 timestamp);
    event BlockMined(address indexed miner, uint256 timestamp);

    struct Transaction {
        address sender;
        address receiver;
        uint256 amount;
        uint256 timestamp;
    }

    Transaction[] public transactions;

    function submitTransaction(address receiver, uint256 amount) public {
        require(receiver != address(0), "Invalid receiver address");
        require(amount > 0, "Amount must be greater than zero");
        transactions.push(Transaction(msg.sender, receiver, amount, block.timestamp));
        emit TransactionSubmitted(msg.sender, receiver, amount, block.timestamp);
    }

    function getAllTransactions() public view returns (Transaction[] memory) {
        return transactions;
    }

    function mineBlock() public {
        emit BlockMined(msg.sender, block.timestamp);
    }
} 