window.ttdgame = {
	step: 64,
	instances: [],
	offsetX: 0,
	offsetY: 0
}

class GameObject {
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
						console.log("Try postbuild")
						this.postBuild()
						console.log("postbuild complete")
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
			console.log("Has drawable element")
			try {
				ttdgame.app.stage.addChild(this.draw)
			} catch(e) {
				console.log(e)
			}
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
		return logicalPosition * ttdgame.step;
	}
}

class Board extends GameObject {
	preBuild() {
		return new Promise((resolve, reject)=>{
			this.texture = new PIXI.Texture.from('/static/assets/tile.png')
			this.texture_lit = new PIXI.Texture.from('/static/assets/tile_lit.png')
			this.draw = new PIXI.TilingSprite(
			    this.texture,
			    this.fromGrid(this.width),
			    this.fromGrid(this.height),
			);
			//this.draw = new PIXI.Sprite.from('/static/assets/creature.png')
			resolve()
		})
	}
	center() {
		this.draw.position.set(ttdgame.app.screen.width/2-(this.fromGrid(this.width)/2), ttdgame.app.screen.height/2-(this.fromGrid(this.height)/2))
	}
	/*build() {
		return new Promise((resolve, reject)=>{
			this.draw.interactive = true;
			this.draw.hitArea = new PIXI.Rectangle(0, 0, this.fromGrid(this.width), this.fromGrid(this.height));
			this.draw.mouseover = (mouseData)=> {
				this.draw.texture = this.texture_lit;
			}
			this.draw.mouseout = (mouseData)=> {
				this.draw.texture = this.texture;
			}
			resolve()
		})
	}*/
}

class BoardPiece extends GameObject {
	
}

class Wall extends BoardPiece {
	
}

class Creature extends BoardPiece {

}

ttdgame.states = {
	intro: (app, env)=>{
		ttdgame.app = app;
		ttdgame.env = env;
		// create a new Sprite from an image path.
		const text = new PIXI.Text(env.user.address+'\n\nReady for action',{fontFamily : 'sans-serif', fontSize: 16, fill : 0xfafafa, align : 'center'})
		let base = env.user.address.substr(0,8) 

		// Listen for window resize events
		window.addEventListener('resize', resize);

		let board = new Board(0,0, {
			width: 10,
			height: 10
		})

		board.center()

		console.log(board)

		console.log(board)

		// Resize function window
		function resize() {
			ttdgame.app.renderer.resize(window.innerWidth, window.innerHeight);
			board.center();
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