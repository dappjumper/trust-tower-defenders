<template>
  <div>
    <GameWindow v-if="ready" />
    <div v-if="ready" class="inheader">
      <span>{{user.address}}</span>
      <button v-on:click="logout">
        <a>Log out</a>
      </button>
    </div>
    <div class="hello" v-if="!ready">
      <div v-if="state == 'loading'">
        <pre>{{status}}</pre>
      </div>
      <div v-if="state == 'enableWeb3'">
        <pre>Please enable your Metamask</pre>
        <button v-on:click="enableWeb3">
          <a>
            Enable
          </a>
        </button>
      </div>
      <div v-if="state == 'signWeb3'">
        <pre>Access as {{user.address}}</pre>
        <button v-on:click="signWeb3">
          <a>
            Access
          </a>
        </button>
      </div>
      <div v-if="state == 'hasNoWeb3'">
        <pre>Please download Metamask</pre>
        <button>
          <a target="_blank" href="https://metamask.io">
            Download
          </a>
        </button>
      </div>
    </div>
  </div>
</template>

<script>

  import GameWindow from './GameWindow.vue'

export default {
  name: 'tdd',
  data () {
    return {
      user: false,
      status: "",
      state: "",
      ready: false
    }
  },
  components: {
    GameWindow
  },
  mounted () {
    //Check for module dependencies
    if(!window.web3)  return this.setError("Failed to load web3", "hasNoWeb3");
    if(!window.wuf)   return this.setError("Failed to load user system");
    if(!window.PIXI)  return this.setError("Failed to load graphics");

    //If in vuejs dev mode, change port
    //Todo: dynamic
    if(window.wuf.host.indexOf(':8080')) window.wuf.host = "http://localhost:3000"
    //Ready to check for user

    let token = wuf.getJWT()
    if(token) return this.tryLogin(token);
    this.tryWeb3()
  },
  methods: {
    setError (string, newState) {
      console.log(string)
      this.state = newState;
    },
    logout () {
      this.user = false;
      this.ready = false;
      wuf.setJWT(null)
      this.tryWeb3()
    },
    tryLogin () {
      let user = wuf.getJWT()
      wuf.api('user/' + user.address + '/profile')
        .then((profile)=>{
          this.user = profile.user;
          this.ready = true;
        })
        .catch(()=>{
          this.user = false;
          this.ready = false;
        })
    },
    enableWeb3 () {
      wuf.connectWeb3().then(()=>{

      }).catch(()=>{

      })
    },
    signWeb3 () {
      let address = this.user.address;
      console.log("Trying sign")
      wuf.api('user/' + address)
        .then((response)=>{
          wuf.sign(address, response.challenge)
            .then((signature)=>{
              wuf.api('user/'+address+'/getjwt', address, {
                signature: signature
              })
                .then((response)=>{
                  if(response.error) {
                    //Could not get token
                  } else {
                    //Successfully got token
                    wuf.setJWT(response)
                    this.tryLogin()
                  }
                })
                .catch((error)=>{
                  //API Failed
                })
            })
            .catch(()=>{
              //Signature failed
            })
        })
        .catch(()=>{
          //API Failed
        })
    },
    tryWeb3 () {
      wuf.getWeb3()
        .then(()=>{
          this.state = "enableWeb3"
          this.getAddressLoop();
        })
        .catch(()=>{
          this.state = "hasNoWeb3"
        })
    },
    getAddressLoop () {
      if(this.ready) return;
      console.log("Loopering")
      if(wuf.hasVisibleAccount()) {
        this.state = 'signWeb3'
        this.user = {address:wuf.hasVisibleAccount()}
      } else {
        this.state = "enableWeb3"
      }
      setTimeout(this.getAddressLoop, 500)
    }
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

main {
  color:#fafafa;
}

button {
  background:none;
  padding: none;
  outline:none; border:none;
  border: 2px solid #fafafa;
  border-radius:8px;
  transition:background .1s;
  cursor:pointer;
}
button a {
  transition:color .1s;
  text-decoration: none;
  padding:16px 20px;
  display:inline-block;
  box-sizing:border-box;
  font-weight:600;
}

button:hover {
  background:#fafafa;
}

button:hover a {
  color:#333333;
  font-weight:600;
}

a {
  color: #fafafa;
}

.inheader {
  position:fixed;
  top:0;
  right:0;
  padding-right:32px;
  font-family:monospace;
  z-index:2;
}

header {
  z-index:1;
  position:fixed;
  top:0;
  left:0;
  width:100%;
}

.inheader button {
  margin-left:0px;
  transform:scale(0.7,0.7);
}

</style>