require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks: {
    ganache: {
      url: "http://127.0.0.1:8545",
      accounts: [
        "0x2039478cc3cdbb8c0260746128600d15f53505254b5bfb1292089e4e6f598d39"
      ],
    },
  },
};
