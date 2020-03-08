require('dotenv').config()
const express = require('express')
const app = express()
var cors = require('cors');
var bodyParser = require('body-parser')
const port = process.env.PORT || 3000
const wssPort = process.env.WSSPORT || 3030

const wss = require('./game/wss')(app)

app.use(express.static('app/dist'));
app.use(cors())
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

const userflow = require('./userflow/web3userflow')({
	database: process.env.MONGODB_URI,
	verbose: true
}, app)

app.get('/js/pixi.js', (req, res) => res.sendFile(__dirname+'/node_modules/pixi.js/dist/pixi.min.js'))
app.get('/js/vue.js', (req, res) => res.sendFile(__dirname+'/node_modules/vue/dist/vue.min.js'))
app.get('/js/web3.js', (req, res) => res.sendFile(__dirname+'/userflow/web3userflow/dist/web3.js'))
app.get('/js/wuf.js', (req, res) => res.sendFile(__dirname+'/userflow/web3userflow/dist/wuf.js'))

app.get('/', (req, res) => res.sendFile(__dirname+'/app/dist/index.html') )

app.listen(port, function(){
  console.log(`Listening on port ${port}!`)
  wss.start(wssPort)
});