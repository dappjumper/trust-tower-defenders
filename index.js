const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const wssPort = process.env.WSSPORT || 3030

const wss = require('./game/wss')(app)

app.use(express.static('app/dist'));

app.get('/js/pixi.js', (req, res) => res.sendFile(__dirname+'/node_modules/pixi.js/dist/pixi.min.js'))
app.get('/js/vue.js', (req, res) => res.sendFile(__dirname+'/node_modules/vue/dist/vue.min.js'))
app.get('/', (req, res) => res.sendFile(__dirname+'/app/dist/index.html') )

app.listen(port, function(){
  console.log(`Listening on port ${port}!`)
  wss.start(wssPort)
});