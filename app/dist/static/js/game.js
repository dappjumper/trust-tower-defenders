window.ttdgame = {
	step: 64
}

class BoardPiece {
	constructor(at) {
		this.position = {
			x: 0,
			y: 0
		}
		if(this.spawn && at) this.spawn(at)
	}
	placeAt(at) {
		this.position = at;
		this.desiredPosition = at;
		this.draw.position.set(at.x*ttdgame.step, at.y*ttdgame.step)
	}
}

class Wall extends BoardPiece {
	spawn(at) {
		this.draw = new PIXI.Text('🤸‍♂️',{fontFamily : 'sans-serif', fontSize: 60, fill : 0xfafafa, align : 'center'})
		this.placeAt(at)
		this.draw.interactive = true;
		this.draw.buttonMode = true;
		this.draw.on('pointerdown', function(){this.clicked();}.bind(this));
		ttdgame.app.stage.addChild(this.draw)
		ttdgame.app.ticker.add(function(){this.update();}.bind(this))
	}
	update() {
		//console.log(ttdgame.app.interaction.mouse.global)
		if(this.desiredPosition.x !== this.position.x || this.desiredPosition.y !== this.position.y) {
			this.draw.text = '🏃‍♂️'
			let pos = {
				x: this.draw.position.x / 64,
				y: this.draw.position.y / 64
			}
			if(pos.x !== this.desiredPosition.x) {
				this.position.x = Math.round(pos.x)
				this.draw.position.x += (pos.x < this.desiredPosition.x ? this.speed || 1 : -this.speed || -1);
			}
			if(pos.y !== this.desiredPosition.y) {
				this.position.y = Math.round(pos.y)
				this.draw.position.y += (pos.y < this.desiredPosition.y ? this.speed || 1 : -this.speed || -1);
			}
		} else {
			this.draw.text = '🤸‍♂️'
		}
	}
	clicked() {
		this.desiredPosition = {x: Math.round(Math.random()*10), y: Math.round(Math.random()*10)}
	}
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

		let wall = new Wall({x: 5, y: 5})
		wall.speed = 5; 

		let snail = new Wall({x: 5, y: 5})
		snail.speed = 1; 

		let rocket = new Wall({x: 5, y: 5})
		rocket.speed = 32; 

		setInterval(function(){
			rocket.desiredPosition = {
				x: Math.round(Math.random()*10),
				y: Math.round(Math.random()*10)
			}
			snail.desiredPosition = {
				x: Math.round(Math.random()*10),
				y: Math.round(Math.random()*10)
			}
			wall.desiredPosition = {
				x: Math.round(Math.random()*10),
				y: Math.round(Math.random()*10)
			}
		},1000)

		console.log(wall)

		// Resize function window
		function resize() {
		  // Resize the renderer
//		  app.renderer.resize(window.innerWidth, window.innerHeight);
		  
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