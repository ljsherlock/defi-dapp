// import/require contracts.
const Token = artifacts.require("Token");
const dBank = artifacts.require("dBank");

/**
 * A migration script will move the smart contract from our 
 * computer to the blockchain.
 * 
 * This file is standard practice for _Truffle_
 */

module.exports = async function(deployer) {
	// deploy Token
	await deployer.deploy(Token)

	// assign token into variable to get it's address
	const token = await Token.deployed()
	
	// pass token address for dBank contract(for future minting)
	await deployer.deploy(dBank, token.address)

	// assign dBank contract into variable to get it's address
	const dBank_deployed = await dBank.deployed()

	// change token's owner/minter from deployer to dBank
	await token.reAssignMinterRole(dBank_deployed.address)
};