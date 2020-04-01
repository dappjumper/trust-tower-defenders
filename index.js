require('dotenv').config()
const express = require('express')
const app = express()
var cors = require('cors');
var bodyParser = require('body-parser')
const port = process.env.PORT || 3000

app.use(express.static('app/dist'));
app.use(cors())
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

const userflow = require('./modules/user')({
	database: process.env.MONGODB_URI,
	verbose: true
}, app)

app.get('/', (req, res) => res.sendFile(__dirname+'/dist/index.html') )

app.listen(port, function(){
  console.log(`Listening on port ${port}!`)
});