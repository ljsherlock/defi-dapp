import { Tabs, Tab } from 'react-bootstrap'
import dBank from '../abis/dBank.json'
import React, { Component } from 'react';
import Token from '../abis/Token.json'
import dbankLogo from '../dbank.png';
import Web3 from 'web3';
import './App.css';

//h0m3w0rk - add new tab to check accrued interest

class App extends Component {

  async componentWillMount() {
    await this.loadBlockchainData(this.props.dispatch)
  }

  async loadBlockchainData(dispatch) {
    // window.ethereum is a variable local to the browser 'window' (AKA tab).
    if (typeof window.ethereum !== 'undefined') {
      const web3 = new Web3(window.ethereum)
      const accounts = await window.ethereum.enable();
      const netId = await web3.eth.net.getId()
      const chainId = await web3.eth.getChainId()
      
      if (typeof accounts[0] !== 'undefined') {
        const account = accounts[0]  
        const balance = await web3.eth.getBalance(account)
        this.setState({
          account,
          balance,
          web3
        })    
      } else {
        window.alert('please login with MetaMask! Ya DUM dum!')
      }
      
      try {
        const dBankAddress = dBank.networks[netId].address
        // Create JS versions of the contracts.
        const tokenContract = new web3.eth.Contract(Token.abi, Token.networks[netId].address)
        const dBankContract = new web3.eth.Contract(dBank.abi, dBankAddress)
  
        this.setState({
          dBankAddress,
          tokenContract,
          dBankContract
        })     
      } catch (error) {
        console.log('Error', error)
        window.alert('Contracts not deployed to the current network')
      }
    
    } else {
      window.alert('Please install MetaMask to continue.')
    }
      // ssign to values to variables: web3, netId, accounts

      // check if account is detected, then load balance&setStates, elsepush alert

      // in try block load contracts

      // if MetaMask not exists push alert
  }

  async deposit(amount) {
    if(this.state.dBankContract !== 'undefined') {
      try {
        await this.state.dBankContract.methods.deposit().send({
          value: amount.toString(),
          from: this.state.account
        }) 
      } catch (error) {
        console.log('error', 'deposit: ', error)
      }
    }
    //check if this.state.dbank is ok
      //in try block call dBank deposit();
  }

  async withdraw(event) {
    if(this.state.dBankContract !== 'undefined') {
      try {
        await this.state.dBankContract.methods.withdraw().send({
          from: this.state.account
        }) 
      } catch (error) {
        console.log('error', 'Withdraw: ', error)
      }
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      web3: 'undefined',
      account: '',
      tokenContract: null,
      dBankContract: null,
      balance: 0,
      dBankAddress: null
    }
  }

  render() {
    return (
      <div className='text-monospace'>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <a
            className="navbar-brand col-sm-3 col-md-2 mr-0"
            href="http://www.dappuniversity.com/bootcamp"
            target="_blank"
            rel="noopener noreferrer"
          >
        <img src={dbankLogo} className="App-logo" alt="logo" height="32"/>
          <b>dBank</b>
        </a>
        </nav>
        <div className="container-fluid mt-5 text-center">
        <br></br>
          <h1>{'Welcome to DBank'}</h1>
          <h2>{this.state.account}</h2>
          <p>{this.state.balance}</p>
          <br></br>
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
              <Tabs defaultActiveKey="profile" id="uncontrolled-tab-example">
                <Tab eventKey='Desposit' title='deposit'>
                  <div>
                    <br/>
                    How much do you want to deposit?
                    <br/>
                    (min. amount is 0.01ETH)
                    <br/>
                    (1 deposit is possible at a time)
                  </div>

                  <form onSubmit={(e) => {
                    e.preventDefault()
                    let amount = this.depositAmount.value
                    amount = amount * 10**18 // convert to wei
                    this.deposit(amount)
                  }}>
                    <div className='form-group mr-sm-2'>
                      <br/>
                      <input 
                        id='depositAmount'
                        step='0.01'
                        type='number'  
                        className='form-control form-control-md'
                        placeholder='amount'
                        required
                        ref={(input => { this.depositAmount = input})}
                      />
                      </div>
                    <button type='submit' className='btn btn-primary'>
                      Deposit
                    </button>
                  </form>
                </Tab>
                <Tab eventKey='Withdraw' title='withdraw'>
                  <div>
                    <br/>
                    Do yo u want to withdraw + take interest?
                    <br/>
                    <br/>
                  </div>
                  <button type='submit' className='btn btn-primary' onClick={(e) => {
                    this.withdraw(e)
                  }}>
                    Withdraw
                  </button>
                </Tab>
              </Tabs>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;