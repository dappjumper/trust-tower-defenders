window.wuf = {
	host: (window.location.host.indexOf('localhost') > -1 ? 'http://' : 'https://')+window.location.host,
	url: "/wuf/api/",
	basePrefix: "_wuf_",
	error: {
		noJWT:"No JWT token found"
	}
}

wuf.getJWT = ()=>{
	return JSON.parse(localStorage.getItem(wuf.basePrefix+'jwt'));
}

wuf.setJWT = (token)=>{
    localStorage.setItem(wuf.basePrefix+'jwt', JSON.stringify(token))
}

wuf.checkJWT = ()=>{
	return new Promise((resolve, reject)=>{
		if(localStorage.getItem(wuf.basePrefix+'jwt')) {
			resolve(url)
		} else {
			reject(wuf.error.noJWT)
		}
	});
}

wuf.getWeb3 = ()=>{
	return new Promise((resolve, reject)=>{
		if (typeof Web3 !== 'undefined') {
			wuf.provider = new Web3(Web3.givenProvider);
			wuf.account = wuf.provider.givenProvider;
			resolve();
        } else {
            reject();
        }
	})
}

wuf.hasVisibleAccount = ()=>{
    if(!wuf.account) return false;
    if(wuf.account.selectedAddress) {
        return wuf.account.selectedAddress
    } else {
        return false
    }
}

wuf.connectWeb3 = ()=>{
	return new Promise((resolve, reject)=>{
        window.ethereum.enable()
        .then(()=>{
            resolve()
        })
        .catch(()=>{
            reject()
        })
	})
}

wuf.sign = (address, message) => {
    return new Promise((resolve, reject)=>{
        let hashedMessage = web3.fromUtf8(message)
        web3.personal.sign(hashedMessage, address, '', function (err, result) {
            if (err) return reject()
            resolve(result)
          })
    })
}

wuf.apicall = {
	getUser: (user)=>{
		return wuf.api('user/' + address)
	}
}

wuf.api = (endpoint, payload)=>{
	return new Promise((resolve, reject)=>{
		let xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function () {
		    if (this.readyState == 4 && this.status == 200) {
		        resolve(JSON.parse(this.responseText))
		    } else {
		        if (this.readyState == 4 && this.status != 200) {
		            console.log(this)
                    reject()
		        }
		    }
		};
		xhttp.open((payload ? 'POST' : 'GET'), wuf.host+wuf.url+endpoint, true);
		try {
            let jwt = wuf.getJWT();
            if(jwt.token) xhttp.setRequestHeader('Authorization', "Bearer "+wuf.getJWT().token);
        } catch(e) {
            
        }
        //if (typeof wuf.getJWT() == 'string') xhttp.setRequestHeader('jwtToken', JSON.parse(wuf.getJWT()).token);
		let load = (payload ? JSON.stringify(payload) : null)
        if(load) xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhttp.send(load);
	})
}