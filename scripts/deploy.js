const hre = require("hardhat");
const { MerkleTree } = require("merkletreejs");
const keccak256 = require("keccak256");
const whitelist = require("./whitelist.json");

async function main() {

    let whiteListAccount = [];
    whitelist.map(address => {
        whiteListAccount.push(address.address);
    });
    const leave = whiteListAccount.map(address => keccak256(address));
    console.log(leave);
    const tree = new MerkleTree(leave, keccak256, { sort: true });
    const root = tree.getHexRoot();

    // const Raffle = await hre.ethers.getContractFactory("Raffle");
    const Raffle = await hre.ethers.getContractFactory("ERC721Merkle");
    const raffle = await Raffle.deploy("Yessai", "YSI", root);

    await raffle.deployed();

    console.log("Yessai deployed to:", raffle.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });