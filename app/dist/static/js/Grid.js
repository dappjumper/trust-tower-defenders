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