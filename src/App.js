import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import SimpleStorage from './contracts/SimpleStorage.json';

function App() {
  const [account, setAccount] = useState('');
  const [contract, setContract] = useState(null);
  const [data, setData] = useState('');
  const [inputValue, setInputValue] = useState('');

  const loadWeb3 = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
      loadBlockchainData();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
      loadBlockchainData();
    } else {
      window.alert('MetaMask not detected');
    }
  };
  const loadBlockchainData = async () => {
    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    setAccount(accounts[0]);
    const networkId = await web3.eth.net.getId();
    const networkData = SimpleStorage
      .networks[networkId];
    if (networkData) {
      const simpleStorage = new web3.eth.Contract(SimpleStorage.abi, networkData.address);
      setContract(simpleStorage);
      const storedData = await simpleStorage.methods.get().call();
      setData(storedData);
    } else {
      window.alert('Smart contract not deployed to detected network.');
    }
  };
  useEffect(() => {
    // loadBlockchainData();
  }, []);

  const setDataOnBlockchain = async () => {
    await contract.methods.set(inputValue).send({ from: account });
    const storedData = await contract.methods.get().call();
    setData(storedData);
  };

  return (
    <div>
      <h1>Connect to MetaMask</h1>
      <p>Account: {account}</p>
      <p>Stored Data: {data}</p>
      <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
      <button onClick={setDataOnBlockchain}>Set Data</button>
      <div>
        <button
          onClick={loadWeb3}
        >
          Connect to MetaMask
        </button>
      </div>
    </div>
  );
}

export default App;
