const game = {}

module.exports = (app)=>{
	if(app) {
		let path = require('path')
		app.get('/js/vue.min.js', (req, res)=>{
			res.sendFile(path.join(__dirname, './dist', 'vue.min.js'))
		})
		app.get('/js/game.js', (req, res)=>{
			res.sendFile(path.join(__dirname, './dist', 'game.js'))
		})
	}
	return game;
}