window.ttdgame = {}

ttdgame.states = {
	intro: (app, env)=>{
		// create a new Sprite from an image path.
		const bunny = PIXI.Sprite.from('/static/assets/creature.png');
		const text = new PIXI.Text(env.user.address+'\n\nReady for action',{fontFamily : 'sans-serif', fontSize: 16, fill : 0xfafafa, align : 'center'})

		// center the sprite's anchor point
		bunny.anchor.set(0.5,1);

		// move the sprite to the center of the screen
		bunny.x = app.screen.width / 2;
		bunny.y = app.screen.height / 2;

		text.x = app.screen.width / 2 - 185;
		text.y = app.screen.height / 2 + 32;

		let base = env.user.address.substr(0,8)

		bunny.tint = parseInt(base) + 0xfafafa;

		app.stage.addChild(bunny);
		app.stage.addChild(text);

		let startTime = new Date().getTime()

		let idleanimation = (object)=>{
		  let x = object.scale.x;
		  let y = object.scale.y;
		  let currentDate = new Date().getTime()
		  let dx = 1//Math.abs(Math.sin(startTime - currentDate / 1000)) / 2 + 0.5
		  let dy = Math.abs(Math.sin(startTime - currentDate / 1000)) / 2 + 0.5
		  object.scale.set(dx,dy)
		}

		// Listen for window resize events
		window.addEventListener('resize', resize);

		// Resize function window
		function resize() {
		  // Resize the renderer
		  app.renderer.resize(window.innerWidth/2, window.innerHeight/2);
		  
		  // You can use the 'screen' property as the renderer visible
		  // area, this is more useful than view.width/height because
		  // it handles resolution
		  bunny.position.set(app.screen.width/2, app.screen.height/2);
		  text.position.set(app.screen.width/2-185, app.screen.height/2+32);
		}

		app.ticker.add(() => {
		    // just for fun, let's rotate mr rabbit a little
		    idleanimation(bunny)
		});
	}
}

ttdgame.setup = (app, env) => {
	ttdgame.states.intro(app,env)
}