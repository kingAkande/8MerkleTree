import { ethers } from "hardhat";
import fs from "fs";
import csv from "csv-parser";
import { MerkleTree } from "merkletreejs";
import keccak256 from "keccak256";

const CSV_FILE_PATH = "Airdrop.csv";

const leafNodes: Buffer[] = [];

fs.createReadStream(CSV_FILE_PATH)
	.pipe(csv())
	.on("data", (row: { address: string; amount: number }) => {
		const address = row.address;
		const amount = ethers.parseUnits(row.amount.toString(), 18);

		// Correct hashing to create a leaf node (bytes32)
		const leaf = keccak256(
			ethers.solidityPacked(["address", "uint256"], [address, amount])
		);
		// console.log(leaf.toString('utf-8'))
		leafNodes.push(leaf);

		// Convert buffer to a readable hex string and print it
		//   console.log(`Leaf (Hex): ${leaf.toString('hex')}`);
	})
	.on("end", () => {
		const merkleTree = new MerkleTree(leafNodes, keccak256, {
			sortPairs: true,
		});

		const rootHash = merkleTree.getHexRoot();
		console.log("Merkle Root:", rootHash);

		// Extracting proof for this address
		const address = "0xd5bd0b6bcccaaac630bcc4103eaa2beea103e3bb";
		const amount = ethers.parseUnits("20", 18);

		// Create leaf for proof
		const leaf = keccak256(
			ethers.solidityPacked(["address", "uint256"], [address, amount])
		);

		console.log("Leaf:", leaf.toString("hex"));

		const proof = merkleTree.getHexProof(leaf);
		console.log("Proof:", proof);
	});




	

/* Merkle Root: 0x1129319d993866cb7f8266a99728ab6926c73c14b38eac4aac7626df6aba6498
Leaf: 702674ecc0808ef84bb4f1f63ff0836101d2a3a879b1cf24ee35242b83fc27a8
Proof: [
  '0x3dffc75d756b552803da297ed8d2cd5505cd38fe0b9727bde07ecffb6c3ae742',
  '0xa42c172fa0724c9b24b8947be6fc67845d547bf49deb3229bc8e134c3c48c41c',
  '0xce5d3de7c94629afe651ce03ead90fe0a15fa511bf037491152d477f61b25d94'
] */