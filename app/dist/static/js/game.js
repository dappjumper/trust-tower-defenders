window.ttdgame = {
	step: 64,
	instances: [],
	offsetX: 0,
	offsetY: 0
}

class View {
	constructor(focus) {
		window.addEventListener('resize', function(){this.resize();}.bind(this));
		window.addEventListener("wheel", function(delta){this.zoom(delta.deltaY)}.bind(this));
		this.focus = focus;
		this.world = new PIXI.Container()
		this.world.addChild(focus.underground.draw)
		this.world.addChild(focus.floor.draw)
		this.world.addChild(focus.sky.draw)
		this.xoffsetCenter = ttdgame.app.screen.width/2;
		this.yoffsetCenter = ttdgame.app.screen.height/2;
		this.xoffset = ttdgame.app.screen.width/2;
		this.yoffset = ttdgame.app.screen.height/2;
		ttdgame.app.stage.addChild(this.world)
		ttdgame.app.ticker.add(function(){this.project()}.bind(this))
		this.world.interactive = true;
		    this.world
		        .on('pointerdown', function(e){this.onDragStart(e)}.bind(this))
		        .on('pointerup', function(e){this.onDragEnd(e)}.bind(this))
		        .on('pointermove', function(e){this.onDragMove(e)}.bind(this))
	}
	onDragStart(event) {
		this.isDragging = true;
		this.dragData = {
			x: event.data.global.x,
			y: event.data.global.y
		}
	}
	onDragEnd() {
		this.isDragging = false;
		this.xoffsetCenter = this.xoffset
		this.yoffsetCenter = this.yoffset
	}
	onDragMove(event) {
		if(!this.isDragging) return;
		this.xoffset = this.xoffsetCenter + ( event.data.global.x - this.dragData.x )
		this.yoffset = this.yoffsetCenter + ( event.data.global.y - this.dragData.y )
		
		//this.yoffset = event.data.global.y - this.dragData.y
	}
	project() {
		this.world.position.x = this.xoffset
		this.world.position.y = this.yoffset
	}
	zoom(delta) {

		//this.xoffset = (ttdgame.app.screen.width / 2) + (delta)
		/*this.xoffset += (mouseE.x - this.world.width / 2) / delta
		this.yoffset += (mouseE.y - this.world.height / 2) / delta*/

		this.xoffsetCenter = this.xoffset
		this.yoffsetCenter = this.yoffset
		let step = (delta > 0 ? 0.05 : -0.05)
		this.adjustScale(this.world,step)
		this.center()
	}
	adjustScale(element, delta) {
		let scale = (element.scale.x-delta < 0 ? 0 : element.scale.x-delta)
		if(this.world.width * scale > ttdgame.app.screen.width || this.world.height * scale > ttdgame.app.screen.height || scale < 0.5) return;
		element.scale.set(scale, scale)
	}
	resize() {
		ttdgame.app.renderer.resize(window.innerWidth, window.innerHeight);
		this.center()
	}
	center() {
		this.world.position.set(ttdgame.app.screen.width/2+this.xoffset,ttdgame.app.screen.height/2+this.yoffset)
	}
}

class Grid {
	constructor(width, height, tileSize) {
		this.draw = new PIXI.Container()
		this.grid = this.generate(width, height)
		this.height = height;
		this.width = width;
		this.tileSize = tileSize || 64;
		ttdgame.app.stage.addChild(this.draw)
	}
	generate(width, height) {
		let grid = []
		for(let x = 0; x<width; x++) {
			grid[x] = []
			for(let y = 0; y<height; y++) {
				grid[x][y] = null;
			}
		}
		return grid;
	}
	getSize() {
		return {
			width: this.width * this.tileSize,
			height: this.height * this.tileSize
		}
	}
	getOffset(n, _axis) {
		let sizes = this.getSize()
		let axis = sizes[_axis]
		return (-axis/2) + (n * this.tileSize)
	}
	getOffsets(x, y) {
		return {
			x: this.getOffset(x, 'width'),
			y: this.getOffset(y, 'height')
		}
	}
}

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

class GameObject {
	constructor() {
		if(this.visual) this.visual()
		this.idealPosition = {x:this.draw.position.x, y:this.draw.position.y}
	}
}

class Creature extends GameObject {
	visual() {
		this.draw = new PIXI.Sprite.from('/static/assets/creature.png')
	}
	onSpawned() {
		this.lastMovement = new Date().getTime()
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

class Mob extends Creature {

}

class WalkingMob extends Mob {
	visual() {
		this.draw = new PIXI.Sprite.from('/static/assets/creature.png')
	}
}

class FlyingMob extends Mob {
	visual() {
		this.draw = new PIXI.Sprite.from('/static/assets/flying.png')
	}
}

class Wall extends GameObject {
	visual() {
		this.draw = new PIXI.Sprite.from('/static/assets/wall.png')
	}
}

ttdgame.states = {
	intro: (app, env)=>{
		ttdgame.app = app;
		ttdgame.env = env;

		let board = new Board(20, 10)
		let viewer = new View(board)
		viewer.center()

		let bird = new Creature();
		let spider = new Creature();
		let mole = new Creature();

		let maxX = board.floor.width
		let maxY = board.floor.height

		for(let x = 0; x<maxX; x++) {
			for(let y = 0; y<maxY; y++) {
					if(y == 0 || y == maxY-1 || x == 0 || x == maxX-1) board.spawn(new Wall, x, y, 'floor')
			}
		}
		board.spawn(new WalkingMob(),Math.floor(maxX*Math.random()), Math.floor(maxY*Math.random()), 'floor')
		board.spawn(new WalkingMob(),Math.floor(maxX*Math.random()), Math.floor(maxY*Math.random()), 'floor')
		board.spawn(new WalkingMob(),Math.floor(maxX*Math.random()), Math.floor(maxY*Math.random()), 'floor')
		board.spawn(new WalkingMob(),Math.floor(maxX*Math.random()), Math.floor(maxY*Math.random()), 'floor')
		board.spawn(new WalkingMob(),Math.floor(maxX*Math.random()), Math.floor(maxY*Math.random()), 'floor')

		board.spawn(new FlyingMob(),Math.floor(maxX*Math.random()), Math.floor(maxY*Math.random()), 'sky')
		board.spawn(new FlyingMob(),Math.floor(maxX*Math.random()), Math.floor(maxY*Math.random()), 'sky')
		board.spawn(new FlyingMob(),Math.floor(maxX*Math.random()), Math.floor(maxY*Math.random()), 'sky')
		board.spawn(new FlyingMob(),Math.floor(maxX*Math.random()), Math.floor(maxY*Math.random()), 'sky')
		board.spawn(new FlyingMob(),Math.floor(maxX*Math.random()), Math.floor(maxY*Math.random()), 'sky')
		board.spawn(new FlyingMob(),Math.floor(maxX*Math.random()), Math.floor(maxY*Math.random()), 'sky')
		board.spawn(new FlyingMob(),Math.floor(maxX*Math.random()), Math.floor(maxY*Math.random()), 'sky')

		// Listen for animate update
		


		// Listen for window resize events
/*		

		let board = new Board(0,0, {
			width: 5,
			height: 5
		})

		console.log(board.height, board.width)*/
		//board.addChild(new Wall(5,5),5,5)

		/*for(let column = 0; column<board.width; column++) {
			for(let row = 0; row<board.height; row++) {
				if(!((column == 1 && row == 0) || (column == board.width-2 && row == board.height-1) ))	{//Only continue if not in middle and not the two specified coordinates (in and out)
					if(row == 0 || column == 0 || row == board.height-1 || column == board.width-1)	{
						let wall = new Wall(column, row)
						wall.placeOnBoard(board)
					}
				}
			}
		}*/

		/*setInterval(function(){
			let randX = Math.floor(Math.random()*board.width)
			let randY = Math.floor(Math.random()*board.height)
			console.log(board.isEmptyAtLocation(2,2))
			if(!board.isEmptyAtLocation(randX,randY)) return;
			let newCreature = (Math.random()>0.5? new Creature(randX,randY) : new Wall(randX,randY))
			newCreature.placeOnBoard(board)
			if(newCreature.debug) newCreature.debug()
		},500)*/

		// Resize function window
			/*setInterval(function(){
				board.grid.scale.x += 0.001;
				board.grid.scale.y += 0.001;
			}.bind({board:board}),1)*/
		function resize() {
			
		  // Resize the renderer
		  
		  // You can use the 'screen' property as the renderer visible
		  // area, this is more useful than view.width/height because
		  // it handles resolution
//		  bunny.position.set(app.screen.width/2, app.screen.height/2);
//		  text.position.set(app.screen.width/2-185, app.screen.height/2+32);
		}

		app.ticker.add(() => {
		});
	}
}



ttdgame.setup = (app, env) => {
	ttdgame.states.intro(app,env)
}