import React, { Component } from "react";
import ItemManager from "./contracts/ItemManager.json";
import Item from "./contracts/Item.json";
import getWeb3 from "./getWeb3";

import "./App.css";

class App extends Component {
  state = {cost: 0, itemName: "exampleItem1", loaded:false};
  componentDidMount = async () => {
  try {
    // Get network provider and web3 instance.
    this.web3 = await getWeb3();
 // Use web3 to get the user's accounts.
    this.accounts = await this.web3.eth.getAccounts();

    // Get the contract instance.
    const networkId = this.web3.eth.net.getId();
 
    this.itemManager = new this.web3.eth.Contract(
      ItemManager.abi,
      ItemManager.networks[networkId] && ItemManager.networks[networkId].address,
  );
    this.itemManager.options.address = "0x58408fc058f2fBE5864F56C5B9Aaf93BAC53C67e"
    this.item = new this.web3.eth.Contract(
      Item.abi,
      Item.networks[networkId] && Item.networks[networkId].address,
    );
    this.setState({loaded:true});
    this.item.options.address = "0x58408fc058f2fBE5864F56C5B9Aaf93BAC53C67e"
  } catch (error) {
  // Catch any errors for any of the above operations.
    alert(
      `Failed to load web3, accounts, or contract. Check console for details.`,
    );
    console.error(error);
    }
  };
 
  handleSubmit = async () => {
    const { cost, itemName, sendaddress } = this.state;
    console.log(itemName, cost, this.itemManager);
    await this.itemManager.methods.createItem(itemName, cost).send({ from:this.accounts[0] });
    alert("Send "+cost+" Wei to "+sendaddress);
  };
    
  handleInputChange = (event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.setState({
    [name]: value
    });
  }

  nowdelivertrigger = async () => {
    const {itemName, itemIndex } = this.state;
    this.itemManager.methods.triggerDelivery(itemIndex);
    alert("Item " + itemName + " was paid, deliver it now!");
  }

   
  render() {
    if (!this.state.loaded) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
      <h1>OrderCreation in Blockchain</h1>
      <h2>Items</h2>
     
      <h2>Enter Cost </h2>
      Cost: <input type="text" name="cost" value={this.state.cost} onChange={this.handleInputChange} /> 
      <h2>Enter name of item</h2>
      Item Name: <input type="text" name="itemName" value={this.state.itemName} onChange={this.handleInputChange} /> 
      <h2>Enter wallet address</h2>
      sendaddress: <input type="text" name="sendaddress" value={this.state.sendaddress} onChange={this.handleInputChange} />
      <h2>Create New Item</h2>
      <button type="button" onClick={this.handleSubmit}>Create new Item</button>
      <h2>Deliver the item</h2>
      <button type="button" onClick={this.nowdelivertrigger}>click when payment Received</button>
      
      </div>
    );
  }
}

export default App;
