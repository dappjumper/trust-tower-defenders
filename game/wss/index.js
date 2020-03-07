var wss = {}
var io = {}

var WSS = {}

WSS.start = function(port){
	io.listen(port)
	console.log(`Sockets opened on port ${port}`)

	io.on('connection', function(socket){
		socket.emit('welcome', "Welcome!"); // emit an event to the socket
	})

}

module.exports = function(app){
	wss = require('http').createServer(app);
	io = require('socket.io')(wss);
	app.get('/js/socket.js', (req, res) => res.sendFile(__dirname.replace('\\game\\wss','')+'/node_modules/socket.io-client/dist/socket.io.js'));
	return WSS
}