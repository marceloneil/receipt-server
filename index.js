const Express = require('express')
const Web3 = require('web3')
const bodyParser = require('body-parser')
const path = require('path')
const net = require('net')
const cors = require('cors')

const app = Express()
app.use(cors())
app.use(bodyParser.json())
app.use(Express.static(path.join(__dirname, 'dapp/build')))

var accounts = {}

let callback = (error, data) => {
  if (error) {
    return console.log(error)
  }
  if (data.transactions) {
    for (let i = 0; i < data.transactions.length; i++) {
      var address = data.transactions[i].from
      if (!accounts[address]) {
        accounts[address] = []
      }
      accounts[address].push(data.transactions[i])
    }
  }
}

setTimeout(() => {
  const web3 = new Web3('/opt/chain/geth.ipc', net)
  web3.eth.getBlockNumber().then(blockNumber => {
    let batch = new web3.BatchRequest()
    for (let i = 0; i < blockNumber; i++) {
      batch.add(web3.eth.getBlock.request(i, true, callback))
    }
    batch.execute()
  })
  var subscription = web3.eth.subscribe('pendingTransactions', (error, transaction) => {
    if (error) {
      return console.log(error)
    }
    var address = transaction.from
    if (!accounts[address]) {
      accounts[address] = []
    }
    accounts[address].push(transaction)
  })
}, 5000)

app.post('/receipt', (req, res) => {
  console.log(req.body)
  res.send(200)
})

app.get('/tx', (req, res) => {
  console.log(accounts)
  console.log(req.query)
  if (req.query.address && accounts[req.query.address]) {
    res.send(accounts[req.query.address])
  } else {
    res.send(404)
  }
})

app.listen(3000, () => {
  console.log('Receipt server listening on port 3000!')
})