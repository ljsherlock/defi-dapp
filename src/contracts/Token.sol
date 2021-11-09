// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.8.0;

// Solidity is a static 

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// Token extends (is child of) ERC20
contract Token is ERC20 {
  //add minter variable

  /** 
    'address' is a DataType.
    Solidity is a statically typed programming language == you have to 
    declare the type before you declare the variablem
   */
  address public minter;

  event MinterChanged(address indexed from, address to);

  /**
  * constructor must be public
  * payable means it can receive crypto currency
  * ERC20() is calling the ERC20 contract imported about (which calls the constructor() of ERC20)
  */
  constructor() public payable ERC20("Bank of Sherlock", "BOS") {
    //asign initial minter
    /**
    * This constructor is called ONCE: when the contract is deployed. So it's like a website 
    * that is loaded once, not multiple times.
    *
    * msg is a global variable inside of Solidity.
    * we can get 'sender' as the person who called this function ('payable')
    * We will set sender as the name of the person who deployed it.
     */
    minter = msg.sender;
  }

  /**
  * Because we will deploy this contract, we will be the minter by default.
  * However we want to be able to re-assign the minter (to the bank). We can 
  * create a function for that.
  */
  function reAssignMinterRole(address dBank) public returns (bool) {
    require(msg.sender == minter, 'Error, msg.sender does not have minter role');
    minter = dBank;

    emit MinterChanged(msg.sender, dBank);
    return true; 
  }

  function mint(address account, uint256 amount) public {
    /** 
    * check if msg.sender have minter role
    * _mint() is inherited from ERC20 contract
    * Creates tokens 
    *
    * We wrap it in our own mint function to ensure that the minter (msg.sender == the person who 
    * deployed the contract) is the only one who can call mint().
    */

    // This function will halt all further execution if it evaluates to false.
    require(msg.sender == minter, 'Error, msg.sender does not have minter role');

		_mint(account, amount);
	}
}