var app = new Vue({
  el: '#app',
  data: {
    message: 'Under construction',
    state: "",
    display: "",
    web3: new Web3(),
    user: {
    	address: ""
    },
    error: ""
  },
  mounted: function(){
  	console.log(wuf)
  	let jwt = wuf.getJWT()
    setTimeout(function(){
      this.display = "solo";
    	if(jwt) {
    		//User has login token..
    	} else {
    		//User does not have login token...
    	  let memoryWallet = localStorage.getItem('ttd_enc_wallet')
        if(!memoryWallet || memoryWallet == "null") {
          this.state = "initial"
        } else {
          this.user = JSON.parse(memoryWallet)
          this.state = "decryptWallet"
        }
    	}
    }.bind(this),1)
  },
  methods: {
    setError: function(string){
      this.error = string
    },
    deleteWallet: function(){
      localStorage.setItem('ttd_enc_wallet', null)
      this.state = "initial"
      this.error = ""
      this.status = ""
    },
  	createWallet: function(){
  		this.state = "loading"
  		this.status = "Generating account..."
  		this.user = this.web3.eth.accounts.create();
  		this.state = "encryptNewWallet"
  	},
    decryptWallet: function(){
      let pass = document.querySelector('#decryptPassword').value
      if(!pass) return this.setError('Please enter password')
      this.state = "loading"
      this.status = "Decoding wallet..."
    },
    encryptWallet: function(){
      let pass = document.querySelector('#encryptPassword').value
      let pass_v = document.querySelector('#encryptPasswordVerify').value
      if(!pass) return this.setError('Please enter password')
      if(!pass_v) return this.setError('Please re-type password')
      if(pass !== pass_v) return this.setError('passwords do not match')
      this.state = "loading"
      this.status = "Encrypting your password"
      setTimeout(function(){
        localStorage.setItem('ttd_enc_wallet',JSON.stringify(this.user.encrypt(pass)));
      }.bind(this),1)
    }
  }
})