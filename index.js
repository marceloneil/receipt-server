const Express = require('express')
const Web3 = require('web3')
const bodyParser = require('body-parser')

const app = Express()
app.use(bodyParser.json())

const web3 = new Web3()
web3.setProvider(new web3.providers.HttpProvider('http://geth:8545'))

app.get('/receipt', function (req, res) {
  console.log(req.body)
  res.send(200)
})

app.listen(3000, () => {
  console.log('Receipt server listening on port 3000!')
})
