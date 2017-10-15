const Express = require('express')
const Web3 = require('web3')
const bodyParser = require('body-parser')
const path = require('path')

const app = Express()
app.use(bodyParser.json())
app.use(Express.static(path.join(__dirname, 'dapp/build')))

const web3 = new Web3()
web3.setProvider(new web3.providers.HttpProvider('http://geth:8545'))

setTimeout(() => {
  for (let i = 1950; i < 1960; i++) {
    web3.eth.getBlock(i).then(data => {
      console.log(data)
    }).catch(error => {
      console.log(error)
    })
  }
}, 15000)

app.post('/receipt', function (req, res) {
  console.log(req.body)
  res.send(200)
})

app.listen(3000, () => {
  console.log('Receipt server listening on port 3000!')
})
