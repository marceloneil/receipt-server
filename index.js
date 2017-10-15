const Express = require('express')
const Web3 = require('web3')
const bodyParser = require('body-parser')
const path = require('path')

const app = Express()
app.use(bodyParser.json())
app.use(Express.static(path.join(__dirname, 'dapp/build')))

const web3 = new Web3()
web3.setProvider(new web3.providers.HttpProvider('http://geth:8545'))

var accounts = {}

function getBulkBlocks(j) {
  setTimeout(function () {
    web3.eth.getBlock(i, true).then(data => {
      if (data.transactions) {
        for (let j = 0; j < data.transactions.length; i++) {
          var address = data.transactions[j].from
          if (!accounts[address]) {
            accounts[address] = []
          }
          accounts[address].push(data.transactions[j])
        }
      }
    }).catch(console.log)
    i++;
    if (i < j) {
      getBulkBlocks(j);
    }
  }, 1000)
}

setTimeout(() => {
  web3.eth.getBlockNumber().then(blockNumber => {
    getBulkBlocks(blockNumber)
  })
  var subscription = web3.eth.subscribe('pendingTransactions')
    .on("data", function (transaction) {
      var address = transaction.from
      if (!accounts[address]) {
        accounts[address] = []
      }
      accounts[address].push(transaction)
    })
    .on("error", console.log)
}, 10000)

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