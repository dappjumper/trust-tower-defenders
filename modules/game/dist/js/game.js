var app = new Vue({
  el: '#app',
  data: {
    message: 'Under construction',
    nonce: 0,
    state: "",
    display: "",
    web3: new Web3(),
    user: {
    	address: ""
    },
    strategy: "local",
    error: "",
    me: {
      created: null,
      nonce: null,
      _id: null,
      address: null
    }
  },
  mounted: function(){
  	let jwt = wuf.getJWT()
    setTimeout(function(){
      this.display = "solo";
    	if(jwt) {
    		//User has login token..
        this.useJWT()
    	} else {
    		//User does not have login token...
    	  let memoryWallet = localStorage.getItem('ttd_enc_wallet')
        if(!memoryWallet || memoryWallet == "null") {
          this.state = "initial"
        } else {
          this.user = JSON.parse(memoryWallet)
          this.state = "decryptWallet"
          this.strategy = "local"
        }
    	}
    }.bind(this),1)
  },
  filters: {
    timeSince: (value)=>{
      let hour = Math.floor(( new Date().getTime() - new Date(value).getTime() ) / 1000 / 60 / 60)
      return (hour > 0 ? hour : 0) + ' hour' + (hour > 1 ? 's' : hour > 0 ? '' : 's')
    }
  },
  methods: {
    useJWT: function(){
      this.user = wuf.getJWT()
      this.state = ""
      this.status = "Getting profile information..."
      this.state = "loading"
      wuf.origUrl = wuf.url;
      wuf.url = "/api/"
      wuf.api('me')
        .then(function(result){
          this.state = ""
          this.state = "dashboard"
          this.display = "full"
          this.me = result.user
          console.log(this.me)
        }.bind(this))
        .catch(function(){
          this.state = ""
          this.status = "Could not load profile..."
          this.state = "loading"
        }.bind(this))
    },
    setError: function(string){
      this.error = string
    },
    getChallenge: function(user){
      this.state = ""
      this.state = "loading"
      this.status = "Contacting server..."
      if(this.user.address.indexOf('0x') == -1) this.user.address = '0x' + this.user.address
      wuf.api('user/'+this.user.address)
        .then((res)=>{
          this.signChallenge(this.strategy, res)
        })
        .catch((res)=>{
          this.state = "loading"
          this.status = "Failed..."
        })
    },
    signChallenge: function(strategy, object) {
      switch(strategy) {
        case 'local':
          this.state = ""
          this.state = "loading"
          this.status = "Signing..."
          setTimeout(function(){
            let signature = this.web3.eth.accounts.sign(object.challenge, this.user.privateKey)
            this.state = ""
            this.state = "loading"
            this.status = "Sending signature to server..."
            wuf.api('user/'+this.user.address+'/getjwt', {
              signature: signature.signature
            })
              .then((res)=>{
                if(res.token) {
                  wuf.setJWT(res)
                  this.useJWT()
                } else {
                  //TODO ERROR HANDLE
                }
              })
              .catch((res)=>{
                //TODO ERROR HANDLE
              })
          }.bind(this),1)
        break;
      }
    },
    deleteWallet: function(){
      localStorage.setItem('ttd_enc_wallet', null)
      this.state = "initial"
      this.error = ""
      this.status = ""
    },
    logout: function(){
      wuf.setJWT(null)
      this.state = "decryptWallet"
      wuf.url = wuf.origUrl;
      this.display = "solo"
    },
  	createWallet: function(){
  		this.state = "loading"
  		this.status = "Generating account..."
  		this.user = this.web3.eth.accounts.create();
  		this.state = "encryptNewWallet"
  	},
    decryptV3: function(user, password){
      this.state = "loading"
      this.status = "Decrypting..."
      return new Promise(function(resolve, reject){
        setTimeout(function(){
          try {
            let res = this.web3.eth.accounts.decrypt(user, password)
            resolve(res)
          } catch(e){
            reject()
          }
        }.bind(this),1)
      }.bind(this))
    },
    encryptV3: function(user, password){
      this.state = "loading"
      this.status = "Encrypting..."
      return new Promise(function(resolve, reject){
        setTimeout(function(){
          let res = this.web3.eth.accounts.encrypt(user.privateKey, password)
          resolve(res)
        }.bind(this),1)
      }.bind(this))
    },
    decryptWallet: function(){
      let pass = document.querySelector('#decryptPassword').value
      if(!pass) return this.setError('Please enter password')
      this.state = "loading"
      this.status = "Decoding wallet..."
      this.decryptV3(JSON.parse(localStorage.getItem('ttd_enc_wallet')), pass)
        .then((decrypted)=>{
          this.user = decrypted
          this.getChallenge(decrypted)
        })
        .catch(()=>{
          this.state = "decryptWallet"
          this.error = "Incorrect password, please try again."
        })
    },
    encryptWallet: function(){
      let pass = document.querySelector('#encryptPassword').value
      let pass_v = document.querySelector('#encryptPasswordVerify').value
      if(!pass) return this.setError('Please enter password')
      if(!pass_v) return this.setError('Please re-type password')
      if(pass !== pass_v) return this.setError('passwords do not match')
      this.state = "loading"
      this.status = "Encrypting your password..."
      this.encryptV3(this.user, pass)
        .then(function(user){
          localStorage.setItem('ttd_enc_wallet', JSON.stringify(user))
          this.getChallenge(this.user)
        }.bind(this))
        .catch(function(e){
          this.state = "initial"
        }.bind(this))
    }
  }
})