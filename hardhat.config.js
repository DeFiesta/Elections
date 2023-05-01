require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  networks: {
    hardhat: {
      chainId: 1337,
      gasPrice: 20000000000, // 20 gwei
      accounts: {
        count: 10,
        initialIndex: 0,
        mnemonic: "test test test test test test test test test test test junk",
        path: "m/44'/60'/0'/0",
      },
      mining: {
        auto: false,
        interval: 5000,
      },
    },
  },
  solidity: "0.8.18",
};
