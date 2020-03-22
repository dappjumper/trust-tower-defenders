class Board {
	constructor(width, height) {
		this.underground = new Grid(width, height, 64)
		this.floor = new Grid(width, height, 64)
		this.sky = new Grid(width, height, 64)
		this.draw = new PIXI.TilingSprite(
		    new PIXI.Texture.from('/static/assets/tile.png'),
		    width*64,
		    height*64,
		);
		this.width = width
		this.height = height
		this.draw.position.x = -(width*64)/2
		this.draw.position.y = -(height*64)/2
		this.draw.alpha = 0.5
		this.floor.draw.addChild(this.draw)
		this.sky.draw.alpha = 0.5;
		this.underground.draw.alpha = 0.1;
	}
	spawn(object, x, y, _dimension) {
		let dimension = this.isEmptyLocation(x,y,_dimension);
		if(!dimension) return false;
		

		dimension.grid[x][y] = object
		object.dimension = _dimension
		object.board = this
		object.x = x
		object.y = y
		this.moveEntity(object, x, y, true)
		dimension.draw.addChild(object.draw)
		if(object.onSpawned) object.onSpawned()
	}
	isEmptyLocation(x, y, _dimension) {
		let dimension = this[_dimension]
		if(!dimension) return false;
		if(typeof dimension.grid[x] == 'undefined') return false;
		if(typeof dimension.grid[x][y] == 'undefined') return false;
		if(dimension.grid[x][y]) return false;
		return dimension;
	}
	moveEntity(entity, x, y, instant) {
		let offsets = this[entity.dimension].getOffsets(x, y)

		entity.idealPosition.x = offsets.x
		entity.idealPosition.y = offsets.y
		if(instant) entity.draw.position = entity.idealPosition
		entity.x = x
		entity.y = y
	}
}