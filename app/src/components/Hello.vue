<template>
  <div class="hello" v-if="!ready">
    <p v-html="status"></p>
    <div v-if="hasMetamask">
      <div v-if="!hasEnabledMetamask">
        <button v-on:click="enableWeb3">Enable</button>
      </div>
      <div v-if="hasEnabledMetamask">
        <pre>{{address}}</pre>
      </div>
    </div>
    <div v-if="!hasMetamask">
      <button>Get metamask</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'tdd',
  data () {
    return {
      canvas: "",
      status: "",
      hasMetamask: false,
      address: "",
      hasEnabledMetamask: false,
      ready: false
    }
  },
  methods: {
    isNotReady (error) {
      this.ready = false;
      this.status = error || "Something went wrong"
    },
    isReady (status) {
      this.ready = true;
      this.status = status || "Success!"
    },
    enableWeb3 () {
      wuf.connectWeb3()
      .then(()=>{
        this.connectToServer(address)
      })
      .catch(()=>{
        console.log("Did not enable")
      })
    },
    connectToServer (address) {
      this.hasEnabledMetamask = true;
      this.hasMetamask = true
      this.address = address
      this.status = "Connecting to login server..."
    },
    hasToken (token) {
      this.isNotReady("Validating login...")
    },
    notLoggedIn () {
      this.isNotReady("Not logged in")
      let endpoint = wuf.host+wuf.url
      wuf.getWeb3()
      .then(()=>{
        this.hasMetamask = true;
        wuf.hasVisibleAccount()
        .then((address)=>{
          this.connectToServer(address)
        })
        .catch(this.enableWeb3State)
      })
      .catch(()=>{
        this.isNotReady("Please install web3")
      })
    },
    enableWeb3State () {
      this.isNotReady("Please enable your metamask")
    },
    loginFlow (url) {
      this.isNotReady(url)
    },
    breakingError (error) {
      this.isNotReady(error || "A breaking error occured")
    }
  },
  mounted () {
    //Check for module dependencies
    if(!window.web3) return this.isNotReady("Failed to load login dependency")
    if(!window.wuf) return this.isNotReady("Failed to load login scripts")
    if(!window.PIXI) return this.isNotReady("Failed to load graphics renderer")

    //If in vuejs dev mode, change port
    //Todo: dynamic
    if(window.wuf.host.indexOf(':8080')) window.wuf.host = "http://localhost:3000"

    //Ready to check for user
    wuf.checkJWT()
    .then(()=>{console.log("JWT found")})
    .catch(this.notLoggedIn)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #35495E;
}
</style>
