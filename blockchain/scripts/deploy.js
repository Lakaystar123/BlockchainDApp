// scripts/deploy.js
const hre = require("hardhat");

async function main() {
  const Transactions = await hre.ethers.getContractFactory("Transactions");
  const transactions = await Transactions.deploy();
  await transactions.waitForDeployment();
  console.log("Transactions deployed to:", transactions.target);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 