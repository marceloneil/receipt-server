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

setTimeout(() => {
  let latest
  web3.eth.getBlock('latest').then(data => {
    console.log(data)
    latest = data.number
    console.log(latest)
  }).catch(error => {
    console.log(error)
  })
  for (let i = 0; i < latest + 50; i++) {
    web3.eth.getBlock(i, true).then(data => {
      if (data.transactions) {
        console.log(data)
        for (let j = 0; j < data.transactions.length; i++) {
          var address = data.transactions[j].from
          if (!accounts[address]) {
            accounts[address] = []
          }
          accounts[address].push(data.transactions[j])
        }
      }
    }).catch(error => {
      console.log(error)
    })
  }
  console.log(accounts)
}, 10000)

app.post('/receipt', function (req, res) {
  console.log(req.body)
  res.send(200)
})

app.listen(3000, () => {
  console.log('Receipt server listening on port 3000!')
})
