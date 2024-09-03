// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Airdroping {





    address tokenAddress;
    bytes32 merkleRoot;
    address owner;

    mapping (address => bool) public alreadyClaimed;


    constructor(address _tokenAddress, bytes32 _merkleRoot) {
        tokenAddress = _tokenAddress;
        merkleRoot = _merkleRoot;
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require( owner == msg.sender, "not owner");
        _;
    }

    event SuccessfulClaim(address indexed user , uint _amount );
    


        //    Accepts an ERC20 token address and the Merkle root as constructor parameters.
        //     Allows users to claim their airdrop by providing their address, the amount, and a valid Merkle proof.
        //     Verifies the proof against the stored Merkle root.
        //     Ensures that users can only claim their airdrop once.
        //     Emits an event when a successful claim is made.
        //     Provides functions for the contract owner to update the Merkle root and withdraw any remaining tokens after the airdrop is complete.


    function claimAirdrop( uint _amount, bytes32[] calldata _merkleProof) external  {
        bytes32 leaf = keccak256(abi.encodePacked(msg.sender, _amount));
        require(alreadyClaimed[msg.sender] == true , "shole nie ni");
        MerkleProof.verify(_merkleProof,merkleRoot,leaf);
        IERC20(tokenAddress).transfer(msg.sender ,_amount );
        alreadyClaimed[msg.sender]= true;
        emit SuccessfulClaim(msg.sender , _amount );
    }

   

    function uPdateMerkleRoot(bytes32 _merkleRoot) private onlyOwner {

         merkleRoot = _merkleRoot;

    }



    function withdrawRemainingToken() private {

     require(IERC20(tokenAddress).balanceOf(address(this)) > 0 , "not enough balance"  );
        uint256 tokenbalance = IERC20(tokenAddress).balanceOf(address(this)) ;
        IERC20(tokenAddress).transfer(owner,tokenbalance);
    }

    


}
