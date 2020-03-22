class GameObject {
	constructor() {
		this.uid = ttdgame.uid(this)
		if(this.visual) this.visual()
		if(this.init) this.init()
		this.idealPosition = {x:this.draw.position.x, y:this.draw.position.y}
	}
	select() {
		this.draw.filters = [ttdgame.filters.gameObjectOutline];
	}
	unselect() {
		this.draw.filters = []
	}
	enable(){
		this.draw.interactive = true
		this.draw.buttonMode = true
		this.selectable = true
		this.draw.on('mousedown', function(){
			ttdgame.view.unselectAll()
			this.select()
		}.bind(this))
	}
}