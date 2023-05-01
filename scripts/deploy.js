const hre = require("hardhat");

async function main() {
  const signers = await hre.ethers.getSigners();

  const Voting = await hre.ethers.getContractFactory("Voting");
  const voting = await Voting.connect(signers[0]).deploy(); // Change this line

  await voting.deployed();

  console.log("Voting deployed to:", voting.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
