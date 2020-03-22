class Creature extends GameObject {
	visual() {
		this.draw = new PIXI.Sprite.from('/static/assets/creature.png')
	}
	onSpawned() {
		this.lastMovement = new Date().getTime()
		this.enable()
		ttdgame.app.ticker.add(function(delta){
			this.update(delta)
		}.bind(this))
	}
	update(delta) {
		if(this.draw.position.x !== this.idealPosition.x) {
			let calc = delta*2
			if(this.draw.position.x > this.idealPosition.x) this.draw.position.x -= calc
			if(this.draw.position.x < this.idealPosition.x) this.draw.position.x += calc
			if(this.draw.position.y > this.idealPosition.y) this.draw.position.y -= calc
			if(this.draw.position.y < this.idealPosition.y) this.draw.position.y += calc
		}
		if(new Date().getTime() - this.lastMovement > 1000) {
			this.lastMovement = new Date().getTime()
			let newX = this.x + Math.round((Math.random()*2)-1)
			let newY = this.y + Math.round((Math.random()*2)-1)
			if(this.board.isEmptyLocation(newX, newY, this.dimension)) {
				this.moveTo(newX,newY,this.dimension)
			}
		}
	}
	moveTo(x, y, dimension) {
		this.board[dimension].grid[this.x][this.y] = null;
		this.board[dimension].grid[x][y] = this;
		this.board.moveEntity(this, x, y)
	}
}