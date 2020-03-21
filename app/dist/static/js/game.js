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
		ttdgame.app.stage.addChild(this.world)
		this.drag = new PIXI.Graphics();
		this.drag.position.z=1
		ttdgame.app.stage.addChild(this.drag)
		this.resetDragger()

		ttdgame.app.renderer.view.addEventListener('pointerdown', function(e){this.onDragStart(e)}.bind(this))
		ttdgame.app.renderer.view.addEventListener('mouseout', function(e){this.onDragEnd(e)}.bind(this))
		ttdgame.app.renderer.view.addEventListener('pointerup', function(e){this.onDragEnd(e)}.bind(this))
		ttdgame.app.renderer.view.addEventListener('pointermove', function(e){this.onDragMove(e)}.bind(this))
	}
	onDragStart(event) {
		this.isDragging = true;
		this.resetDragger()
		this.dragData = {
			x: event.layerX,
			y: event.layerY
		}
	}
	resetDragger() {
		this.drag.clear()
	}
	onDragEnd() {
		this.isDragging = false;
		this.resetDragger()
	}
	getSelected(x,y,x2,y2) {
		let xOffset = this.world.position.x-this.world.width/2
		let yOffset = this.world.position.y-this.world.height/2

		if((x < xOffset && x2 < xOffset) 
			|| (y < yOffset && y2 < yOffset) 
			|| (x > xOffset+this.world.width && x2 > xOffset+this.world.width)
			|| (y > yOffset+this.world.height && y2 > yOffset+this.world.height)) {
			//Selection is not within world or containing world
			this.unselectAll()
		} else {
			let scaleFactor = (64 * this.world.scale.x)
			let pX = (x-xOffset) / scaleFactor
			let pY = (y-yOffset) / scaleFactor
			let pX2 = pX + (x2-x) / scaleFactor
			let pY2 = pY + (y2-y) / scaleFactor
			
			let fromX = Math.floor(pX2 > pX ? pX : pX2)
			let fromY = Math.floor(pY2 > pY ? pY : pY2)
			let toX = Math.floor(pX2 > pX ? pX2 : pX)
			let toY = Math.floor(pY2 > pY ? pY2 : pY)

			let foundObjects = []

			if(fromX < 0) fromX = 0
			if(fromY < 0) fromY = 0
			if(toX > this.focus.width-1) toX = this.focus.width-1
			if(toY > this.focus.height-1) toY = this.focus.height-1

			for(let gX = fromX; gX <= toX; gX++) {
				for(let gY = fromY; gY <= toY; gY++) {
					if(this.focus.sky.grid[gX][gY]) foundObjects.push(this.focus.sky.grid[gX][gY])
					if(this.focus.floor.grid[gX][gY]) foundObjects.push(this.focus.floor.grid[gX][gY])
					if(this.focus.underground.grid[gX][gY]) foundObjects.push(this.focus.underground.grid[gX][gY])
				}
			}
			this.unselectAll()
			this.handleSelection(foundObjects)
		}
	}
	unselectAll() {
		for(let x = 0; x < this.focus.width; x++) {
			for(let y = 0; y < this.focus.height; y++) {
				if(this.focus.sky.grid[x][y]) this.focus.sky.grid[x][y].unselect()
				if(this.focus.floor.grid[x][y]) this.focus.floor.grid[x][y].unselect()
				if(this.focus.underground.grid[x][y]) this.focus.underground.grid[x][y].unselect()
			}
		}
	}
	handleSelection(objects) {
		for(let o in objects) {
			if(objects[o].selectable) objects[o].select()
		}
	}
	onDragMove(event) {
		if(!this.isDragging) return;
		//this.drag.width = (event.data.global.x - this.drag.position.x)
		//this.drag.height = (event.data.global.y - this.drag.position.y)
		this.drag.clear()
		this.drag.beginFill(0xfafafa, 0.1);
		this.drag.lineStyle(1, 0xfafafa, 0.6);
		this.drag.drawRect(this.dragData.x, this.dragData.y, event.layerX - this.dragData.x, event.layerY - this.dragData.y);
		this.getSelected(this.dragData.x, this.dragData.y, event.layerX, event.layerY)


	}
	zoom(delta) {
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
		this.world.position.set(ttdgame.app.screen.width/2,ttdgame.app.screen.height/2)
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

class GameObject {
	constructor() {
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

class Mob extends Creature {
	init() {
		this.selectable = true
	}
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
	onSpawned() {
		this.enable()
	}

}

ttdgame.states = {
	intro: (app, env)=>{
		ttdgame.app = app;
		ttdgame.env = env;
		ttdgame.filters = {
			gameObjectOutline: new PIXI.filters.OutlineFilter(1, 0xfafafa)
		}

		let board = new Board(20, 10)
		let viewer = new View(board)
		viewer.center()
		ttdgame.view = viewer;
		ttdgame.board = board;

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