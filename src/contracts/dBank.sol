// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.8.0;

import "./Token.sol";

contract dBank {

  // assign Token contract to variable
  // State variable: value is written to the blockchain
  Token private token;

  //add mappings — key value pair storage mechanism (dictionar: word definitiony)
  mapping(address => uint) public etherBalanceOf;
  mapping(address => uint) public depositStart;
  mapping(address => bool) public isDeposited;
  
  //add events
  event Deposit(address indexed user, uint etherAmount, uint timeStart);
  event Withdraw(address indexed user, uint etherAmount, uint depositTime, uint interest);

  // pass deployed Token contract as constructor argument.
  // _token is the address (location on the network) of the token.
  // see2_deploy.js — await deployer.deploy(dBank, token.address).
  // so in this case _token = token.address from our deploy script.
  constructor(Token _token) public {
    token = _token;
  }

  function deposit() payable public {
    //check if msg.sender didn't already deposited funds
    //check if msg.value is >= than 0.01 ETH
    require(isDeposited[msg.sender] == false, 'Error, deposit already active.');
    require(msg.value >= 1e16, 'Error, deposit must be >= 0.01 ETH');

    // msg.sender = address (hash)
    // msg.value = ETH amount
    etherBalanceOf[msg.sender] = etherBalanceOf[msg.sender] + msg.value;

    // We use the block timestamp (based on Epoch time) to calculate time. Seconds
    depositStart[msg.sender] = depositStart[msg.sender] + block.timestamp;
    
    isDeposited[msg.sender] = true;
    emit Deposit(msg.sender, msg.value, block.timestamp);
  }

  function withdraw() public {
    //check if msg.sender deposit status is true
    require(isDeposited[msg.sender] == true, 'Error, no previous despoit');

    //assign msg.sender ether deposit balance to variable for event
    uint userBalance = etherBalanceOf[msg.sender];

    //check user's hodl time
    uint depositTime = block.timestamp - depositStart[msg.sender];

    // calculate interest
    uint interestPerSecond = 31668017 * (userBalance / 1e16);
    uint interest = interestPerSecond * depositTime;
  
    //send eth to user (person who is withdrawing the money)
    // transfer sends Ether around
    msg.sender.transfer(userBalance);

    //send interest in tokens to user
    token.mint(msg.sender, interest); // interest to user.

    //reset depositer data
    depositStart[msg.sender] = 0;
    etherBalanceOf[msg.sender] = 0;
    isDeposited[msg.sender] = false;

    emit Withdraw(msg.sender, userBalance, depositTime, interest);
  }

  function borrow() payable public {
    //check if collateral is >= than 0.01 ETH
    //check if user doesn't have active loan

    //add msg.value to ether collateral

    //calc tokens amount to mint, 50% of msg.value

    //mint&send tokens to user

    //activate borrower's loan status

    //emit event
  }

  function payOff() public {
    //check if loan is active
    //transfer tokens from user back to the contract

    //calc fee

    //send user's collateral minus fee

    //reset borrower's data

    //emit event
  }
}