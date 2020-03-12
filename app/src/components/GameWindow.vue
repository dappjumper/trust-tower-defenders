<template>
    <div id="gameview"></div>
</template>

<script>
export default {
  name: 'GameWindow',
  props: ["user"],
  data () {
    return {

    }
  },
  mounted () {
    const app = new PIXI.Application({ transparent: true, width: window.innerWidth, height: window.innerHeight, resolution: window.devicePixelRatio || 1, });
    document.querySelector('#gameview').appendChild(app.view);
    ttdgame.setup(app, this)
  },
  methods: {
    
  }
}
</script>

<style>
#gameview {
  position:fixed;
  top:0;
  left:0;
  width:100%;
  height:100%;
  z-index:0;
  background:#333333;
}
#gameview canvas {
  display:block;
  width:100%!important;
  height:100%!important;
  image-rendering:pixelated;
}
</style>