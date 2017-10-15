const Express = require('express')
const Web3 = require('web3')
const bodyParser = require('body-parser')
const path = require('path')

const app = Express()
app.use(bodyParser.json())
app.use(Express.static(path.join(__dirname, 'dapp/build')))

const web3 = new Web3('ws://geth.8546')

for (let i = 0; i < 4000; i++) {
  web3.eth.getBlock(i).then(data => {
    console.log(data)
  })
}

app.post('/receipt', function (req, res) {
  console.log(req.body)
  res.send(200)
})

app.listen(3000, () => {
  console.log('Receipt server listening on port 3000!')
})
