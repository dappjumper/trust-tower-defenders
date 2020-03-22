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