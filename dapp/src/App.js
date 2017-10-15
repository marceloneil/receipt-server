import React, { Component } from 'react'
import { Button, Dimmer, Grid, Loader, Segment } from 'semantic-ui-react'
import Web3 from 'web3'
import { ecrecover } from 'ethereumjs-util'
import request from 'superagent'
import './App.css'
import * as itemsFile from './items.json'
import Item from './Item'

class App extends Component {
  constructor (props) {
    super(props)

    this.state = {
      items: itemsFile,
      web3: null
    }

    this.getWeb3();
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  getWeb3() {
    window.addEventListener('load', () => {
      var web3 = new Web3(Web3.givenProvider || 'ws://localhost:8546');
      web3.bzz.setProvider(web3.bzz.givenProvider || 'http://swarm-gateways.net')
      web3.eth.getAccounts().then(accounts => {
        web3.eth.defaultAccount = accounts[0]
        this.setState({ web3: web3 })
      })
      console.log(web3.eth)
    })
  }

  renderItems() {
    let elements = [];
    for (let i = 0; i < this.state.items.length; i++) {
      elements.push(
        <Item
          name={this.state.items[i].name}
          price={this.state.items[i].price}
          quantity={this.state.items[i].quantity}
          handleAdd={() => this.handleAdd(i)}
          handleRemove={() => this.handleRemove(i)}
          key={i}
        />
      )
    }
    return elements
  }

  calculateTotal() {
    let total = 0
    for (let i = 0; i < this.state.items.length; i++) {
      total += this.state.items[i].price * this.state.items[i].quantity
    }
    return total
  }

  handleAdd(i) {
    let items = this.state.items
    items[i].quantity += 1
    this.setState({ items: items })
  }

  handleRemove(i) {
    let items = this.state.items
    if (items[i].quantity > 0) {
      items[i].quantity -= 1
      this.setState({ items: items })
    }
  }

  handleSubmit() {
    request.get('http://eth.1lab.me/tx').query({
        address: this.state.web3.eth.defaultAccount
      }).end(function(err, res){
        let transactions = JSON.parse(res)
        if (transactions) {
          let hash = transactions[0].hash
          let v = transactions[0].v
          let r = transactions[0].r
          let s = transactions[0].s
          let publickey = ecrecover(hash, v, r, s)
          console.log(publickey)
        } else {
          console.error('no transactions!')
        }
        console.log(res)
    });

    // this.state.web3.bzz.upload(this.state.items).then(hash => {
    //   console.log(hash)
    //   this.state.web3.bzz.download(hash).then(data => {
    //     console.log(data)
    //   })
    // }) 
  }

  render() {
    return (
      <Grid centered>
        <Grid.Column id='cart' mobile={14} tablet={10} computer={6}>
          <Segment.Group raised>
            {this.renderItems()}
            <Segment color='green' clearing>
              <h5 id='total'>Total: {this.calculateTotal()} eth</h5>
              <Button color='green' floated='right' onClick={this.handleSubmit}>
                Buy Now
              </Button>
            </Segment>
          </Segment.Group>
        </Grid.Column>

        <Dimmer
          active={!this.state.web3}
          onClickOutside={this.handleClose}
          page
        >
        <Loader indeterminate>Waiting for web3.js injection</Loader>
        </Dimmer>
      </Grid>
    );
  }
}

export default App
