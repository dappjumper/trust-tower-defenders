<template>
  <div class="hello" v-if="!ready">
    <div v-if="state == 'loading'">
      <pre>{{status}}</pre>
    </div>
    <div v-if="state == 'errorSign'">
      <pre>{{status}}</pre>
      <button v-on:click="signWeb3">
        <a>
          Retry
        </a>
      </button>
    </div>
    <div v-if="state == 'errorLogin'">
      <pre>{{status}}</pre>
      <button v-on:click="tryWeb3">
        <a>
          Retry
        </a>
      </button>
    </div>
    <div v-if="state == 'loggedIn'">
      Logged in
    </div>
    <div v-if="state == 'noWeb3'">
      <p>Please download metamask</p>
      <button>
        <a target="_blank" href="https://metamask.io">
          Download
        </a>
      </button>
    </div>
    <div v-if="state == 'tryWeb3'">
      Trying web3...
    </div>
    <div v-if="state == 'signWeb3' && !status">
      <pre>Selected account: {{user.address}}</pre>
      <button>
        <a v-on:click="signWeb3">
          Connect
        </a>
      </button>
    </div>
    <div v-if="state == 'connectWeb3'">
      <pre>Please enable your metamask</pre>
      <button>
        <a v-on:click="connectWeb3">
          Enable
        </a>
      </button>
    </div>
    <div v-if="state == 'signWeb3' && status">
        <pre v-html="status"></pre>
        <button v-on:click="signWeb3">
          <a>
            Retry
          </a>
        </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'tdd',
  data () {
    return {
      user: {
        address: "",
        signed: false
      },
      status: "",
      state: "",
      ready: false
    }
  },
  mounted () {
    //Check for module dependencies
    if(!window.web3)  return this.setError("Failed to load web3", "noWeb3");
    if(!window.wuf)   return this.setError("Failed to load user system");
    if(!window.PIXI)  return this.setError("Failed to load graphics");

    //If in vuejs dev mode, change port
    //Todo: dynamic
    if(window.wuf.host.indexOf(':8080')) window.wuf.host = "http://localhost:3000"
    //Ready to check for user

    let token = wuf.getJWT()
    if(token) return this.tryLogin(token);
    this.tryWeb3();
  },
  methods: {
    setError (string, newState) {
      this.status = string || "An error occured"
      this.state = newState || 'error';
    },
    setStatus (string) {
      this.status = string || ""
    },
    tryLogin (json) {
      let jsonObj = json;
      this.state = "loading"
      this.status = "Logging in as "+json.address+"..."
      wuf.api('user/'+json.address+'/profile')
        .then((user)=>{
          if(user.error) {
            this.state = "errorLogin"
            return this.status = user.error;
          }
          this.state = "dashboard"
          this.status = ""
          this.ready = true;
        })
        .catch(()=>{
          this.state = "errorLogin"
          this.status = "Login failed"
          wuf.setJWT(null)
        })
    },
    tryWeb3 () {
      this.state = "tryWeb3"
      this.status = ""
      wuf.getWeb3()
        .then(()=>{
          let account = wuf.hasVisibleAccount()
          if(account) {
            this.user.address = account;
            this.state = "signWeb3"
          } else {
            this.state = "connectWeb3"
          }
        })
        .catch(()=>{
          this.setError("Please download metamask","noWeb3")
        })
    },
    connectWeb3 () {
      wuf.connectWeb3()
      .then(()=>{
        this.state = "signWeb3"
        this.user.address = wuf.hasVisibleAccount()
        if(!this.user.address) return reject()
        this.signWeb3()
      })
      .catch(()=>{})
    },
    signWeb3 () {
      let address = this.user.address;
      this.state = "loading"
      this.status = "Communicating..."
      wuf.api('user/' + address)
        .then((response)=>{
          this.status = "Please please confirm your signature in the popup"
          this.state = "signWeb3"
          wuf.sign(address, response.challenge)
            .then((signature)=>{
              if(this.user.signed == true) return;
              this.user.signed = true;
              this.state = "loading"
              this.status = "Communicating..."
              wuf.api('user/'+address+'/getjwt', address, {
                signature: signature
              })
                .then((response)=>{
                  if(response.error) {
                    this.status = "Failed to get token"
                    return this.state = 'error';
                  } else {
                    wuf.setJWT(response);
                    this.tryLogin(response);
                  }
                })
                .catch((error)=>{

                })
            })
            .catch(()=>{
              if(this.user.signed == true) return;
              this.status = "Signature failed"
              this.state = "signWeb3"
            })
        })
        .catch(()=>{
          this.status = "Communication failed..."
          this.state = "errorSign"
          wuf.setJWT(null)
        })
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
</style>
