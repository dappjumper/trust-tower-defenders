window.ttdgame = {
	step: 64,
	instances: [],
	offsetX: 0,
	offsetY: 0,
	_uid: 0,
	gameObjects: {},
	uid: (object)=>{ttdgame.gameObjects[ttdgame._uid+1] = object; ttdgame._uid++; return ttdgame._uid;}
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
	}
}



ttdgame.setup = (app, env) => {
	ttdgame.states.intro(app,env)
}