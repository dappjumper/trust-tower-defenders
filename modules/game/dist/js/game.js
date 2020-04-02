var app = new Vue({
  el: '#app',
  data: {
    message: 'Under construction',
    state: "",
    display: "",
    web3: new Web3(),
    user: {
    	address: ""
    }
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
    		this.onNotLoggedIn()
    	}
    }.bind(this),1)
  },
  methods: {
  	onNotLoggedIn: function(){
  		this.state = "initial"
  	},
  	createWallet: function(){
  		this.state = "loading"
  		this.status = "Generating account..."
  		this.user = this.web3.eth.accounts.create();
  		this.state = "encryptNewWallet"
  	}
  }
})