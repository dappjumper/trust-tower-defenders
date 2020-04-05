module.exports = function(parent) {
	return {
		routes: {
			'/api/me': {
				method: "get",
				description:"",
				protected: true,
				function: function(req,res){
					parent.User.model.findOne({address:req.user.address}, function(err, user){
						if(!err && user) {
							res.send({user: user})
						} else {
							res.send({error:"User not found"})
						}
					}.bind({parent:parent}))
				}
			}
		}
	}
}