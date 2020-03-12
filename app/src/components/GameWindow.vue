<template>
    <div id="gameview"></div>
</template>

<script>
export default {
  name: 'GameWindow',
  data () {
    return {

    }
  },
  mounted () {
    const app = new PIXI.Application({ transparent: true, width: window.innerWidth, height: window.innerHeight, resolution: window.devicePixelRatio || 1, });
    document.querySelector('#gameview').appendChild(app.view);

    // create a new Sprite from an image path.
    const bunny = PIXI.Sprite.from('/static/assets/creature.png');

    // center the sprite's anchor point
    bunny.anchor.set(0.5,1);

    // move the sprite to the center of the screen
    bunny.x = app.screen.width / 2;
    bunny.y = app.screen.height / 2;


    app.stage.addChild(bunny);

    let startTime = new Date().getTime()

    let idleanimation = (object)=>{
      let x = object.scale.x;
      let y = object.scale.y;
      let currentDate = new Date().getTime()
      let dx = Math.abs(Math.sin(startTime - currentDate / 1000)) / 2 + 0.5
      let dy = Math.abs(Math.sin(startTime - currentDate / 1000)) / 2 + 0.5
      object.scale.set(dx,dy)
    }

    // Listen for window resize events
    window.addEventListener('resize', resize);

    // Resize function window
    function resize() {
      // Resize the renderer
      app.renderer.resize(window.innerWidth, window.innerHeight);
      
      // You can use the 'screen' property as the renderer visible
      // area, this is more useful than view.width/height because
      // it handles resolution
      bunny.position.set(app.screen.width/2, app.screen.height/2);
    }

    app.ticker.add(() => {
        // just for fun, let's rotate mr rabbit a little
        idleanimation(bunny)
    });

  },
  methods: {
    
  }
}
</script>

<style scoped>
#gameview {
  position:fixed;
  top:0;
  left:0;
  width:100%;
  height:100%;
  z-index:0;
  background:#333333;
}
</style>