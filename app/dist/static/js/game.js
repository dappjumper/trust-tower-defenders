window.ttdgame = {
	step: 64,
	instances: [],
	offsetX: 0,
	offsetY: 0
}

/*class GameObject {
	constructor(x, y, overwrites) {
		//Initialize logical position
		this.position = {
			x: x||0,
			y: y||0
		}

		//Loop through overwrites
		for(let prop in overwrites) {
			this[prop] = overwrites[prop];
		}

		//Add to the global instances list and assign the index to this object's scope
		this.id = window.ttdgame.instances.length
		window.ttdgame.instances.push(this)

		//Run building phases if available
		this.preBuild()
			.then(()=>{
				this.build()
					.then(()=>{
						this.postBuild()
					})
					.catch(()=>{
						this.destroy()
					})
			})
			.catch(()=>{
				this.destroy()
			})
	}
	destroy() {
		console.log("Destruction")
	}
	preBuild() {
		return new Promise((resolve, reject)=>{
			resolve()
		})
	}
	build() {
		return new Promise((resolve, reject)=>{
			resolve()
		})
	}
	postBuild() {
		//Add the drawable element to graphics engine
		if(this.draw) {
			try {
				ttdgame.app.stage.addChild(this.draw)
			} catch(e) {
				console.log(e)
			}
		}
		if(this.update) {
			ttdgame.app.ticker.add(function(){
				this.update();
			}.bind(this))
		}
		return;
		if(typeof this.draw !== 'undefined') {
			ttdgame.app.stage.addChild(this.draw)
		}

		//Add the logic function to the graphics engine
		if(typeof this.update !== 'undefined') {
			ttdgame.app.ticker.add(function(){
				this.update();
			}.bind(this))
		}
	}
	fromGrid(logicalPosition) {
		return (logicalPosition * ttdgame.step)+32;
	}
	toGrid(offset) {
		return offset / ttdgame.step
	}
}

class Board extends GameObject {
	generateEmptyGrid() {
		this.children = []
		for(let x = 0; x<this.width; x++) {
			this.children[x] = new Array(this.height) 
		}
		this.container = new PIXI.Container()
	}
	preBuild() {
		return new Promise((resolve, reject)=>{
			this.generateEmptyGrid()
			this.texture = new PIXI.Texture.from('/static/assets/tile.png')
			this.texture_lit = new PIXI.Texture.from('/static/assets/tile_lit.png')
			this.draw = new PIXI.TilingSprite(
			    this.texture,
			    this.fromGrid(this.width)-32,
			    this.fromGrid(this.height)-32,
			);
			this.container.addChild(this.draw)
			this.center()
			//this.draw = new PIXI.Sprite.from('/static/assets/creature.png')
			resolve()
		})
	}
	center() {
		this.draw.position.set(50,50)
		this.container.position.set(500,500)
		//this.container.x = ttdgame.app.screen.width/2 
		//this.container.y = ttdgame.app.screen.height/2
		this.container.pivot.x = this.container.width/2
		this.container.pivot.y = this.container.height/2
		/*if(this.children) {
			for(let x in this.children) {
				for(let y in this.children[x]) if(this.children[x][y]) {
					this.children[x][y].adjustPosition((this.children[x][y] instanceof Wall))
				} 
			}
		}
	}
	isEmptyAtLocation(x, y) {
		try {
			if(x<0 || x>this.width-1 || y<0 || y>this.height-1) return false;
			if(!this.children[x]) return true;
			return !this.children[x][y]
		}
		catch(e){return false}
	}
	addChild(child, x, y) {
		if(!this.isEmptyAtLocation(x,y)) return false;
		this.children[x][y] = child;
		this.container.addChild(child.draw)
	}
}

class BoardPiece extends GameObject {
	placeOnBoard(board) {
		board.children[Math.round(this.position.x)][Math.round(this.position.y)] = this
		this.board = board;
		this.adjustPosition(true)
		this.draw.anchor.set(0.5,0.5)
	}
	adjustPosition(instant) {
		if(instant) {
			this.draw.position.x = this.board.draw.position.x + this.board.fromGrid(this.position.x) ;
			this.draw.position.y = this.board.draw.position.y + this.board.fromGrid(this.position.y);
		} else {
			let xDiff = this.board.fromGrid(this.position.x) + this.board.draw.position.x
			let yDiff = this.board.fromGrid(this.position.y) + this.board.draw.position.y
			let xDist = xDiff - this.draw.position.x;
			let yDist = yDiff - this.draw.position.y;
			let adjustMore = false
			let timeBetween = new Date().getTime() - this.movementInitiated

			if(Math.abs(xDist) > 0) {
				this.draw.position.x += xDist / (1000 / timeBetween);
				adjustMore = true;
			}
			if(Math.abs(yDist) > 0) {
				this.draw.position.y += yDist / (1000 / timeBetween);
				adjustMore = true;
			}
			if(adjustMore) {
				requestAnimationFrame(function(){
					this.adjustPosition()
				}.bind(this))
			} else {
				
			}
		}
	}
	move(direction, distance) {
		this.movementInitiated = new Date().getTime()
		distance = distance || 1
		this.board.children[this.position.x][this.position.y] = null;
		let newPos = this.directionToGrid(direction)
		this.position.x += newPos.x*distance
		this.position.y += newPos.y*distance
		this.board.children[this.position.x][this.position.y] = this;
		this.adjustPosition()
	}
	directionToGrid(direction) {
		let radian = direction * (Math.PI/180)

		return {
			x: Math.round(Math.cos(radian)),
			y: -Math.round(Math.sin(radian))
		}
	}
}

class Wall extends BoardPiece {
	preBuild() {
		return new Promise((resolve, reject)=>{
			this.draw = new PIXI.Sprite.from('/static/assets/wall.png')
			//this.draw = new PIXI.Sprite.from('/static/assets/creature.png')
			this.draw.scale.set(0,0)
			resolve()
		})
	}
	update() {
		if(this.draw.scale.x < 1) {
			this.draw.scale.set(this.draw.scale.x+0.1,this.draw.scale.y+0.1)
		}
	}
}

class Creature extends BoardPiece {
	preBuild() {
		return new Promise((resolve, reject)=>{
			this.draw = new PIXI.Sprite.from('/static/assets/creature.png')
			this.draw.scale.set(0,0)
			//this.draw = new PIXI.Sprite.from('/static/assets/creature.png')
			resolve()
		})
	}
	setPath() {
		let q = [(this.position.x, this.position.y)];
		while(q.length > 0) {
			let pos = q.shift()
			let directions = [0, 90, 180, 270]
			for (let i in directions) {
				let delta = this.directionToGrid(directions[i],1)
				if(this.position.x + delta.x < 0 || this.position.y - delta.y < 0) {
					console.log({delta},"Outside bounds")
				} else {
					console.log("Is not outside bounds")
				}
			}
		}
	}
	debug(instant) {
		setTimeout(function(){
			let canMove = false;
			let rand = 0;
			rand = Math.floor(Math.random()*360)
			let pPos = this.directionToGrid(rand, 1)
			if(this.board.isEmptyAtLocation(this.position.x+pPos.x,this.position.y+pPos.y)) {
				canMove = true;
			}
			if(canMove) this.move(rand, 1)
			this.debug((!canMove ? true : null))
		}.bind(this),(instant ? 60 : 500))
	}
	update() {
		if(this.draw.scale.x < 1) {
			this.draw.scale.set(this.draw.scale.x+0.001,this.draw.scale.y+0.001)
		}
		//return this.setPath()
		//setTimeout(function(){this.update()}.bind(this), 1000)
	}
}*/

class View {
	constructor(focus) {
		window.addEventListener('resize', function(){this.resize();}.bind(this));
		window.addEventListener("wheel", function(delta){this.zoom(delta.deltaY)}.bind(this));
		this.focus = focus;
	}
	zoom(delta) {
		let step = (delta > 0 ? 0.05 : -0.05)
		this.adjustScale(this.focus.sky,step)
		this.adjustScale(this.focus.floor,step)
		this.adjustScale(this.focus.underground,step)
		this.center()
	}
	adjustScale(element, delta) {
		let scale = (element.draw.scale.x-delta < 0 ? 0 : element.draw.scale.x-delta)
		element.draw.scale.set(scale, scale)
	}
	resize() {
		ttdgame.app.renderer.resize(window.innerWidth, window.innerHeight);
		this.center()
	}
	center() {
		let center = [ttdgame.app.screen.width/2,ttdgame.app.screen.height/2]
		this.focus.sky.draw.position.set(center[0],center[1]-(this.focus.sky.draw.scale.x * this.focus.sky.draw.scale.x * 32))
		this.focus.floor.draw.position.set(center[0],center[1])
		this.focus.underground.draw.position.set(center[0],center[1]+(this.focus.underground.draw.scale.x * this.focus.underground.draw.scale.x * 32))
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

		this.sky.draw.alpha = 0.5;
		this.underground.draw.alpha = 0.1;

		/*this.view = view;
		this.view.grid = new PIXI.Container();
		this.grid = view.grid;
		this.grid.pivot.x = this.grid.width/2;
		this.grid.pivot.y = this.grid.height/2;
		ttdgame.app.stage.addChild(this.grid);
*/
	}
	spawn(object, x, y, _dimension) {
		let dimension = this.isEmptyLocation(x,y,_dimension);
		if(!dimension) return false;
		
		let size = dimension.getSize()
		let offsets = dimension.getOffsets(x, y)

		object.draw.position.x = offsets.x
		object.draw.position.y = offsets.y

		dimension.grid[x][y] = object
		dimension.draw.addChild(object.draw)
	}
	isEmptyLocation(x, y, _dimension) {
		let dimension = this[(_dimension||'floor')]
		if(!dimension) return false;
		if(typeof dimension.grid[x] == 'undefined') return false;
		if(typeof dimension.grid[x][y] == 'undefined') return false;
		if(dimension.grid[x][y]) return false;
		return dimension;
	}
	applyDimensionVisuals(drawObject, dimension) {
		switch(dimension) {
			case 'sky':
			break;

			case 'floor':
			break;

			case 'underground':
			break;
		}
	}
}

class GameObject {
	constructor() {
		if(this.visual) this.visual()
	}
}

class Creature extends GameObject {
	visual() {
		this.draw = new PIXI.Sprite.from('/static/assets/creature.png')
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
		board.spawn(new Creature(),Math.floor(maxX*Math.random()), Math.floor(maxY*Math.random()), 'floor')
		board.spawn(new Creature(),Math.floor(maxX*Math.random()), Math.floor(maxY*Math.random()), 'underground')

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