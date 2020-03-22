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