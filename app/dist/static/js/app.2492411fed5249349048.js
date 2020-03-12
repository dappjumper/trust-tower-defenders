webpackJsonp([0],[,,,function(e,t,n){"use strict";t.a={name:"app"}},function(e,t,n){"use strict";var s=n(18);t.a={name:"tdd",data:function(){return{user:!1,status:"",state:"",ready:!1}},components:{GameWindow:s.a},mounted:function(){if(!window.Web3)return this.setError("Failed to load web3","hasNoWeb3");if(!window.wuf)return this.setError("Failed to load user system");if(!window.PIXI)return this.setError("Failed to load graphics");window.wuf.host.indexOf(":8080")>-1&&(window.wuf.host="http://localhost:3000");var e=wuf.getJWT();if(e)return this.tryLogin(e);this.tryWeb3()},methods:{setError:function(e,t){console.log(e),this.state=t},logout:function(){this.user=!1,this.ready=!1,wuf.setJWT(null),this.tryWeb3()},tryLogin:function(){var e=this,t=wuf.getJWT();wuf.api("user/"+t.address+"/profile").then(function(t){e.user=t.user,e.ready=!0}).catch(function(){e.user=!1,e.ready=!1})},enableWeb3:function(){wuf.connectWeb3().then(function(){}).catch(function(){})},signWeb3:function(){var e=this,t=this.user.address;wuf.api("user/"+t).then(function(n){wuf.sign(t,n.challenge).then(function(n){wuf.api("user/"+t+"/getjwt",t,{signature:n}).then(function(t){t.error||(wuf.setJWT(t),e.tryLogin())}).catch(function(e){})}).catch(function(){})}).catch(function(){})},tryWeb3:function(){var e=this;wuf.getWeb3().then(function(){e.state="enableWeb3",e.getAddressLoop()}).catch(function(){e.state="hasNoWeb3"})},getAddressLoop:function(){if(!this.ready){if(console.log("Loopering"),wuf.hasVisibleAccount())this.state="signWeb3",this.user={address:wuf.hasVisibleAccount()};else{if(!web3)return this.state="hasNoWeb3";this.state="enableWeb3"}setTimeout(this.getAddressLoop,500)}}}}},function(e,t,n){"use strict";t.a={name:"GameWindow",props:["user"],data:function(){return{}},mounted:function(){var e=new PIXI.Application({transparent:!0,width:window.innerWidth,height:window.innerHeight,resolution:window.devicePixelRatio||1});document.querySelector("#gameview").appendChild(e.view),ttdgame.setup(e,this)},methods:{}}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var s=n(2),a=n(10),i=n(14);s.a.config.productionTip=!1,new s.a({el:"#app",router:i.a,template:"<App/>",components:{App:a.a}})},,,,function(e,t,n){"use strict";function s(e){n(11)}var a=n(3),i=n(13),r=n(1),o=s,u=r(a.a,i.a,!1,o,null,null);t.a=u.exports},function(e,t){},,function(e,t,n){"use strict";var s=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{attrs:{id:"app"}},[e._m(0),e._v(" "),n("main",[n("router-view")],1)])},a=[function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("header",[n("span",[e._v("Trust Tower Defense")])])}],i={render:s,staticRenderFns:a};t.a=i},function(e,t,n){"use strict";var s=n(2),a=n(15),i=n(16);s.a.use(a.a),t.a=new a.a({routes:[{path:"/",name:"Hello",component:i.a}]})},,function(e,t,n){"use strict";function s(e){n(17)}var a=n(4),i=n(21),r=n(1),o=s,u=r(a.a,i.a,!1,o,null,null);t.a=u.exports},function(e,t){},function(e,t,n){"use strict";function s(e){n(19)}var a=n(5),i=n(20),r=n(1),o=s,u=r(a.a,i.a,!1,o,null,null);t.a=u.exports},function(e,t){},function(e,t,n){"use strict";var s=function(){var e=this,t=e.$createElement;return(e._self._c||t)("div",{attrs:{id:"gameview"}})},a=[],i={render:s,staticRenderFns:a};t.a=i},function(e,t,n){"use strict";var s=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{attrs:{id:"appcontent"}},[e.ready?n("GameWindow",{attrs:{user:e.user}}):e._e(),e._v(" "),e.ready?n("div",{staticClass:"inheader"},[n("span",[e._v(e._s(e.user.address))]),e._v(" "),n("button",{on:{click:e.logout}},[n("a",[e._v("Log out")])])]):e._e(),e._v(" "),e.ready?e._e():n("div",{staticClass:"hello"},["loading"==e.state?n("div",[n("pre",[e._v(e._s(e.status))])]):e._e(),e._v(" "),"enableWeb3"==e.state?n("div",[n("pre",[e._v("Please enable your Metamask")]),e._v(" "),n("button",{on:{click:e.enableWeb3}},[n("a",[e._v("\n          Enable\n        ")])])]):e._e(),e._v(" "),"signWeb3"==e.state?n("div",[n("pre",[e._v("Access as "+e._s(e.user.address))]),e._v(" "),n("button",{on:{click:e.signWeb3}},[n("a",[e._v("\n          Access\n        ")])])]):e._e(),e._v(" "),"hasNoWeb3"==e.state?n("div",[n("pre",[e._v("Please download Metamask")]),e._v(" "),e._m(0)]):e._e()])],1)},a=[function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("button",[n("a",{attrs:{target:"_blank",href:"https://metamask.io"}},[e._v("\n          Download\n        ")])])}],i={render:s,staticRenderFns:a};t.a=i}],[6]);
//# sourceMappingURL=app.2492411fed5249349048.js.map