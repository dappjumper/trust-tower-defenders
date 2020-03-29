"use strict";var precacheConfig=[["index.html","7d5dd2b75dd62797a64e875cf012312c"],["service-worker.js","5a483b7e0c36c4a210b32d51df9971b1"],["static/css/app.fae1f98fc28dec72bda60014f0e675f4.css","ed2afacf828167ea282ded057184ce2d"],["static/js/Board.js","b2e36df3a2d741ebf23bc9ef01492e18"],["static/js/Creature.js","56878cd3f85b6e9e0b7c9b3687b3a3dd"],["static/js/GameObject.js","161b59eb6bd7cefceb879de07f87a811"],["static/js/Grid.js","adaf8ce020895e920616c3a981f5802a"],["static/js/Mob.js","95588d71cf10780b1ac6d6ee5a83e7d2"],["static/js/View.js","dea6f9f6055c60a8fa63c175ef66a62c"],["static/js/app.54d18403384c4c6a97a4.js","5911d284e477c6ec8987a893d97cef38"],["static/js/game.js","fe3fb33b053974e7a6e5c0ddb853b634"],["static/js/manifest.2ae2e69a05c33dfc65f8.js","2f4fd3b092ed7f7e76dbb3976729742e"],["static/js/pixi.filters.min.js","d051b8fd071e5a8c05a8a5c76887c17c"],["static/js/vendor.800257b849fb44ad713e.js","65a2e5783704ecb33f1df6438210d133"]],cacheName="sw-precache-v3-ttd-"+(self.registration?self.registration.scope:""),ignoreUrlParametersMatching=[/^utm_/],addDirectoryIndex=function(e,t){var n=new URL(e);return"/"===n.pathname.slice(-1)&&(n.pathname+=t),n.toString()},cleanResponse=function(e){return e.redirected?("body"in e?Promise.resolve(e.body):e.blob()).then(function(t){return new Response(t,{headers:e.headers,status:e.status,statusText:e.statusText})}):Promise.resolve(e)},createCacheKey=function(e,t,n,r){var a=new URL(e);return r&&a.pathname.match(r)||(a.search+=(a.search?"&":"")+encodeURIComponent(t)+"="+encodeURIComponent(n)),a.toString()},isPathWhitelisted=function(e,t){if(0===e.length)return!0;var n=new URL(t).pathname;return e.some(function(e){return n.match(e)})},stripIgnoredUrlParameters=function(e,t){var n=new URL(e);return n.hash="",n.search=n.search.slice(1).split("&").map(function(e){return e.split("=")}).filter(function(e){return t.every(function(t){return!t.test(e[0])})}).map(function(e){return e.join("=")}).join("&"),n.toString()},hashParamName="_sw-precache",urlsToCacheKeys=new Map(precacheConfig.map(function(e){var t=e[0],n=e[1],r=new URL(t,self.location),a=createCacheKey(r,hashParamName,n,!1);return[r.toString(),a]}));function setOfCachedUrls(e){return e.keys().then(function(e){return e.map(function(e){return e.url})}).then(function(e){return new Set(e)})}self.addEventListener("install",function(e){e.waitUntil(caches.open(cacheName).then(function(e){return setOfCachedUrls(e).then(function(t){return Promise.all(Array.from(urlsToCacheKeys.values()).map(function(n){if(!t.has(n)){var r=new Request(n,{credentials:"same-origin"});return fetch(r).then(function(t){if(!t.ok)throw new Error("Request for "+n+" returned a response with status "+t.status);return cleanResponse(t).then(function(t){return e.put(n,t)})})}}))})}).then(function(){return self.skipWaiting()}))}),self.addEventListener("activate",function(e){var t=new Set(urlsToCacheKeys.values());e.waitUntil(caches.open(cacheName).then(function(e){return e.keys().then(function(n){return Promise.all(n.map(function(n){if(!t.has(n.url))return e.delete(n)}))})}).then(function(){return self.clients.claim()}))}),self.addEventListener("fetch",function(e){if("GET"===e.request.method){var t,n=stripIgnoredUrlParameters(e.request.url,ignoreUrlParametersMatching);(t=urlsToCacheKeys.has(n))||(n=addDirectoryIndex(n,"index.html"),t=urlsToCacheKeys.has(n));0,t&&e.respondWith(caches.open(cacheName).then(function(e){return e.match(urlsToCacheKeys.get(n)).then(function(e){if(e)return e;throw Error("The cached response that was expected is missing.")})}).catch(function(t){return console.warn('Couldn\'t serve response for "%s" from cache: %O',e.request.url,t),fetch(e.request)}))}});