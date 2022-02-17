import React from 'react';
import Web3 from 'web3';
import DaiTokenMock from '../abis/DaiTokenMock.json';
import './App.css';

function App() {
  const [account, setAccount] = React.useState('');
  const [transactions, setTransactions] = React.useState([]);
  const [balance, setBalance] = React.useState('');
  const [daiTokenMock, setDaiTokenMock] = React.useState();
  const recipient = React.useRef();
  const loadWeb3 = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      window.alert(
        'Non-Ethereum browser detected. You should consider trying metaMask'
      );
    }
  };

  const loadBlockchainData = async () => {
    const web3 = window.web3;
    const account = await web3.eth.getAccount();
    setAccount(account[0]);
    const daiTokenAddress = ''; // Place dai token address here
    const daiTokenMock = new web3.eth.Contract(
      DaiTokenMock.abi,
      daiTokenAddress
    );
    setDaiTokenMock(daiTokenMock);
    const balance = await daiTokenMock.methods.balanceOf(account).call();
    console.log(daiTokenMock);
    console.log(web3.utils.fromWei(balance.toString(), 'Ether'));
    console.log(balance.toString());
    setBalance(web3.utils.fromWei(balance.toString(), 'Ether'));
    const transactions = await daiTokenMock.getPastEvents(
      'Transfer',
      { fromBlock: 0, toBlock: 'latest' },
      { from: account }
    );
    setTransactions(transactions);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const recipient = recipient.current.value;
    const amount = window.web3.utils.toWei(amount.current.value, 'Ether');
    transfer(recipient, amount);
  };

  const transfer = (recipient, amount) => {
    daiTokenMock.methods.transfer(recipient, amount).send({ from: account });
  };

  React.useEffect(() => {
    async function run() {
      await loadWeb3();
      await loadBlockchainData();
    }
    run();
    return;
  });
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="Main Logo" />
        <h1>{balance} DAILY</h1>
        <form onSubmit={handleSubmit}>
          <input
            id="recipient"
            type="text"
            className="form-control"
            ref={(input) => {
              recipient = input;
            }}
            placeholder="Recipient Address"
            required
          />
          <input
            id="amount"
            type="text"
            className="form-control"
            ref={(input) => {
              recipient = input;
            }}
            placeholder="Amount"
            required
          />
          <button type="submit" className="btn">
            Send
          </button>
        </form>
        <table>
          <thead>
            <tr>
              <td scope="col">Recipient</td>
              <td scope="col">value</td>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx, index, self) => {
              return (
                <tr key={index}>
                  <td>{tx.returnValues.to}</td>
                  <td>
                    {window.web3.utils.fromWei(
                      tx.returnValues.value.toString()
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>{' '}
      </header>
    </div>
  );
}

export default App;
