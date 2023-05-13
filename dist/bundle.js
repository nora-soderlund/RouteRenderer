(()=>{"use strict";var e={607:function(e,t,o){var r=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0}),t.RouteWebGLOverlayView=t.RouteRenderer=void 0;var n=r(o(751));t.RouteRenderer=n.default;var i=r(o(279));t.RouteWebGLOverlayView=i.default},824:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.Projection=void 0;var o=function(){function e(){}return e.getTileSize=function(e){return 256*e},e.getMercatorWorldCoordinateProjection=function(e,t,o){var r=this.getTileSize(e),n=t*Math.PI/180;return{left:(o+180)*(r/360),top:r/2-r*Math.log(Math.tan(Math.PI/4+n/2))/(2*Math.PI)}},e.getPixelCoordinates=function(e,t,o){return{left:t*Math.pow(2,e),top:o*Math.pow(2,e)}},e.projectToPixelCoordinate=function(e,t){var o,r,n,i=this.getMercatorWorldCoordinateProjection(null!==(o=t.projectionZoomLevel)&&void 0!==o?o:2,e.latitude,e.longitude),a=this.getPixelCoordinates(null!==(r=t.projectionZoomLevel)&&void 0!==r?r:2,i.left,i.top);return{x:a.left,y:a.top,z:e.altitude*((null!==(n=t.projectionZoomLevel)&&void 0!==n?n:2)/100)}},e}();t.Projection=o},751:function(e,t,o){var r=this&&this.__assign||function(){return r=Object.assign||function(e){for(var t,o=1,r=arguments.length;o<r;o++)for(var n in t=arguments[o])Object.prototype.hasOwnProperty.call(t,n)&&(e[n]=t[n]);return e},r.apply(this,arguments)};Object.defineProperty(t,"__esModule",{value:!0});var n=o(824),i=o(660),a=o(503),l=o(931),s=o(964),u=function(){function e(e){this.paths=[],this.bufferers=[],this.animations=null,this.previousAnimationsLength=0,this.deltaX=0,this.deltaY=0,this.previous=0,this.options=e}return e.prototype.setOptions=function(e){this.options=r(r({},this.options),e)},e.prototype.setupContext=function(e){this.programInfo=s.RendererWebGL.initializeProgram(e)},e.prototype.setPaths=function(e,t,o,r){var i=this;void 0===t&&(t=null),void 0===o&&(o=!0);for(var a=NaN,l=NaN,s=NaN,u=NaN,c=NaN,d=NaN,v=NaN,f=NaN,p=0,h=e;p<h.length;p++)for(var m=0,g=h[p];m<g.length;m++){var R=g[m];R.projection=o?(null!=r?r:n.Projection.projectToPixelCoordinate).call(null!=r?r:n.Projection,R,this.options):{x:R.x,y:R.y,z:R.z},(window.isNaN(v)||R.projection.z<v)&&(v=R.projection.z),(window.isNaN(f)||R.projection.z>f)&&(f=R.projection.z),window.isNaN(a)&&(a=R.projection.x),window.isNaN(l)&&(l=R.projection.y),(window.isNaN(s)||R.projection.x<s)&&(s=R.projection.x),(window.isNaN(u)||R.projection.x>u)&&(u=R.projection.x),(window.isNaN(c)||R.projection.y<c)&&(c=R.projection.y),(window.isNaN(d)||R.projection.y>d)&&(d=R.projection.y)}var x=(u-s)/2,y=(d-c)/2,w=[0,1,0,1],P=[1,0,0,1];this.options.keepMinimumAltitude&&(v=0),this.paths=e.map((function(e){var t=[],o=0;return e.forEach((function(e,r){var n,s,u,c,d=(e.projection.z-v)/(f-v),p=e.projection.x,h=e.projection.y;null!==(n=i.options.keepMinimumPositions)&&void 0!==n&&n||!i.options.center?null!==(s=i.options.keepMinimumPositions)&&void 0!==s&&s||(p=e.projection.x-a,h=l-e.projection.y):(p=a>e.projection.x?a-e.projection.x:e.projection.x-a,h=l<e.projection.y?l-e.projection.y:e.projection.y-l),(null===(u=i.options.center)||void 0===u||u)&&(p-=x,h+=y);var m=e.projection.z-v,g=0===r?0:Math.abs(p-t[r-1].x),R=0===r?0:Math.abs(h-t[r-1].y),b=Math.sqrt(Math.pow(g,2)+Math.pow(R,2)),M={x:p,y:h,z:m,distanceX:g,distanceY:R,distance:b,distanceStart:o,verticles:null,color:i.options.elevationGradient?i.options.elevationGradientColors?[(i.options.elevationGradientColors[0][0]+(i.options.elevationGradientColors[1][0]-i.options.elevationGradientColors[0][0])*d)/255,(i.options.elevationGradientColors[0][1]+(i.options.elevationGradientColors[1][1]-i.options.elevationGradientColors[0][1])*d)/255,(i.options.elevationGradientColors[0][2]+(i.options.elevationGradientColors[1][2]-i.options.elevationGradientColors[0][2])*d)/255,(i.options.elevationGradientColors[0][3]+(i.options.elevationGradientColors[1][3]-i.options.elevationGradientColors[0][3])*d)/255]:[w[0]+(P[0]-w[0])*d,w[1]+(P[1]-w[1])*d,w[2]+(P[2]-w[2])*d,1]:null===(c=e.color)||void 0===c?void 0:c.map((function(e){return e/255}))};t.push(M),o+=b})),{points:t,fullDistance:o}})),this.animations=t,this.bufferers=[]},e.prototype.getAnimationFrame=function(e){void 0===e&&(e=0);var t={distanceFraction:1,elevationFraction:1};if(this.animations){var o=e-this.previous;this.previous=e;for(var r=0;r<this.animations.length;r++){var n=this.animations[r];n.progress||(n.progress={elapsed:0}),n.progress.elapsed+=o;var i=Math.max(Math.min(n.progress.elapsed/n.interval,1),0);switch(n.forwards||(i=1-i),i===(n.forwards?1:0)&&(n.repeat?(n.forwards=!n.forwards,delete n.progress):(this.animations.splice(r,1),r--)),n.type){case"distance":t.distanceFraction=i;break;case"elevation":t.elevationFraction=i}}}return t},e.prototype.registerMouseEvents=function(e){var t=this,o=!1,r=null,n=null;e.addEventListener("mousedown",(function(e){o=!0,r=e.pageX,n=e.pageY})),document.body.addEventListener("mouseup",(function(e){o=!1})),document.body.addEventListener("mousemove",(function(e){if(o&&null!==r&&null!==n){var i=e.pageX,a=e.pageY;t.deltaX+=i-r,t.deltaY+=a-n,r=i,n=a}}))},e.prototype.render=function(e,t,o){var r,n,i,a;if(!this.programInfo)throw new Error("Program info is not set up yet, you must call setupContext before rendering!");var s=null!==(n=null===(r=this.animations)||void 0===r?void 0:r.length)&&void 0!==n?n:0;(this.bufferers.length!==this.paths.length||(null===(i=this.animations)||void 0===i?void 0:i.length)||(null===(a=this.animations)||void 0===a?void 0:a.length)!==this.previousAnimationsLength)&&(this.bufferers=this.createBuffers(e,t)),l.RendererScene.drawScene(e,this.programInfo,this.bufferers,this.options,{x:this.deltaX,y:this.deltaY},o),this.previousAnimationsLength=s},e.prototype.createBuffers=function(e,t){var o=this,r=[],n=this.getAnimationFrame(t);return r.push.apply(r,this.paths.map((function(t){return a.RendererPathModel.createBuffers(e,t,o.options,n)}))),this.options.grid&&r.push(i.RendererGridModel.createBuffers(e,this.options,n,this.paths)),r},e}();t.default=u},954:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.RendererBuffers=void 0;var o=function(){function e(){}return e.initPositionBuffer=function(e,t){var o=e.createBuffer();return e.bindBuffer(e.ARRAY_BUFFER,o),e.bufferData(e.ARRAY_BUFFER,new Float32Array(t),e.STATIC_DRAW),o},e.initColorBuffer=function(e,t){for(var o=[],r=0;r<t.length;++r){var n=t[r];o=o.concat(n,n,n,n)}var i=e.createBuffer();return e.bindBuffer(e.ARRAY_BUFFER,i),e.bufferData(e.ARRAY_BUFFER,new Float32Array(o),e.STATIC_DRAW),i},e.initIndexBuffer=function(e,t){var o=e.createBuffer();return e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,o),e.bufferData(e.ELEMENT_ARRAY_BUFFER,new Uint16Array(t),e.STATIC_DRAW),o},e}();t.RendererBuffers=o},660:(e,t,o)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.RendererGridModel=void 0;var r=o(954),n=function(){function e(){}return e.createBuffers=function(e,t,o,n){for(var i,a,l,s=NaN,u=NaN,c=NaN,d=NaN,v=0,f=n;v<f.length;v++)for(var p=0,h=f[v].points;p<h.length;p++){var m=h[p];(window.isNaN(s)||m.x<s)&&(s=m.x),(window.isNaN(u)||m.x>u)&&(u=m.x),(window.isNaN(c)||m.y<c)&&(c=m.y),(window.isNaN(d)||m.y>d)&&(d=m.y)}var g=null!==(i=t.gridPadding)&&void 0!==i?i:1,R=[c-g,-.002,u+g,d+g,-.002,u+g,d+g,-.002,s-g,c-g,-.002,s-g],x=[null!==(l=null===(a=t.gridColor)||void 0===a?void 0:a.map((function(e){return e/255})))&&void 0!==l?l:[.5,0,0,1]],y=r.RendererBuffers.initPositionBuffer(e,R),w=r.RendererBuffers.initColorBuffer(e,x),P=r.RendererBuffers.initIndexBuffer(e,[0,1,2,0,2,3]);return{verticles:R.length/2,position:y,color:w,indices:P}},e}();t.RendererGridModel=n},503:(e,t,o)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.RendererPathModel=void 0;var r=o(954),n=function(){function e(){}return e.createBuffers=function(e,t,o,n){for(var i,a,l,s,u,c,d,v,f,p,h,m,g,R,x,y,w,P,b,M,C,A=[],L=[],j=[],N=0,_=0,B=t.fullDistance*n.distanceFraction,E=1;E<t.points.length;E++){var F=t.points[E-1],S=t.points[E],T=F.z*n.elevationFraction,G=S.z*n.elevationFraction,Y=1;_=S.distanceStart;var O=null!==(s=null!==(i=S.color)&&void 0!==i?i:null===(l=null!==(a=o.leftWallColor)&&void 0!==a?a:o.wallColor)||void 0===l?void 0:l.map((function(e){return e/255})))&&void 0!==s?s:[0,1,0,1],I=null!==(v=null!==(u=S.color)&&void 0!==u?u:null===(d=null!==(c=o.rightWallColor)&&void 0!==c?c:o.wallColor)||void 0===d?void 0:d.map((function(e){return e/255})))&&void 0!==v?v:[0,0,1,1],z=null!==(p=null===(f=o.topColor)||void 0===f?void 0:f.map((function(e){return e/255})))&&void 0!==p?p:[1,0,0,1],V=null!==(m=null===(h=o.bottomColor)||void 0===h?void 0:h.map((function(e){return e/255})))&&void 0!==m?m:[0,0,0,1],U=null!==(y=null!==(g=S.color)&&void 0!==g?g:null===(x=null!==(R=o.endBlockColor)&&void 0!==R?R:o.wallColor)||void 0===x?void 0:x.map((function(e){return e/255})))&&void 0!==y?y:[0,0,0,1],X=null!==(M=null!==(w=S.color)&&void 0!==w?w:null===(b=null!==(P=o.startBlockColor)&&void 0!==P?P:o.wallColor)||void 0===b?void 0:b.map((function(e){return e/255})))&&void 0!==M?M:[0,0,0,1];if(_>B)break;B<_+S.distance&&(Y=Math.max(0,Math.min((B-S.distanceStart)/S.distance,1)));var D={x:S.x-F.x,y:S.y-F.y},W=vec3.fromValues(F.y,F.x,T),k=vec3.fromValues(F.y+D.y*Y,F.x+D.x*Y,G),Z=vec3.sub(vec3.create(),k,W),H=vec3.normalize(vec3.create(),[-Z[1],Z[0],0]),q=(null!==(C=o.wallWidth)&&void 0!==C?C:.1)/2,K=[vec3.add(vec3.create(),W,vec3.scale(vec3.create(),H,q)),vec3.add(vec3.create(),k,vec3.scale(vec3.create(),H,q))],Q=[vec3.sub(vec3.create(),W,vec3.scale(vec3.create(),H,q)),vec3.sub(vec3.create(),k,vec3.scale(vec3.create(),H,q))];A.push(Q[0][0],0,Q[0][1],Q[0][0],T,Q[0][1],Q[1][0],G,Q[1][1],Q[1][0],0,Q[1][1]),A.push(K[0][0],0,K[0][1],K[0][0],T,K[0][1],K[1][0],G,K[1][1],K[1][0],0,K[1][1]),A.push(K[0][0],K[0][2],K[0][1],K[1][0],K[1][2],K[1][1],Q[1][0],Q[1][2],Q[1][1],Q[0][0],Q[0][2],Q[0][1]),A.push(K[0][0],-.001,K[0][1],K[1][0],-.001,K[1][1],Q[1][0],-.001,Q[1][1],Q[0][0],-.001,Q[0][1]),L.push.apply(L,[O,I,z,V]),j.push.apply(j,[0,1,2,0,2,3,4,5,6,4,6,7,8,9,10,8,10,11,12,13,14,12,14,15].map((function(e){return N+e}))),N+=16,S.verticles={frontRightX:K[1][1],frontRightY:K[1][0],frontRightZ:K[1][2],frontLeftX:Q[1][1],frontLeftY:Q[1][0],frontLeftZ:Q[1][2]},F.verticles&&(A.push(F.verticles.frontLeftY,0,F.verticles.frontLeftX,F.verticles.frontLeftY,F.verticles.frontLeftZ,F.verticles.frontLeftX,Q[0][0],Q[0][2],Q[0][1],Q[0][0],0,Q[0][1]),A.push(F.verticles.frontRightY,0,F.verticles.frontRightX,F.verticles.frontRightY,F.verticles.frontRightZ,F.verticles.frontRightX,K[0][0],K[0][2],K[0][1],K[0][0],0,K[0][1]),A.push(F.verticles.frontRightY,F.verticles.frontRightZ,F.verticles.frontRightX,K[0][0],K[0][2],K[0][1],Q[0][0],Q[0][2],Q[0][1],F.verticles.frontLeftY,F.verticles.frontLeftZ,F.verticles.frontLeftX),A.push(F.verticles.frontRightY,-.001,F.verticles.frontRightX,K[0][0],-.001,K[0][1],Q[0][0],-.001,Q[0][1],F.verticles.frontLeftY,-.001,F.verticles.frontLeftX),L.push.apply(L,[O,I,z,V]),j.push.apply(j,[0,1,2,0,2,3,4,5,6,4,6,7,8,9,10,8,10,11,12,13,14,12,14,15].map((function(e){return N+e}))),N+=16),E===t.points.length-1?(A.push(K[1][0],0,K[1][1],K[1][0],G,K[1][1],Q[1][0],G,Q[1][1],Q[1][0],0,Q[1][1]),L.push.apply(L,[U]),j.push.apply(j,[0,1,2,0,2,3].map((function(e){return N+e}))),N+=4):1===E&&(A.push(Q[0][0],0,Q[0][1],Q[0][0],F.z,Q[0][1],K[0][0],F.z,K[0][1],K[0][0],0,K[0][1]),L.push.apply(L,[X]),j.push.apply(j,[0,1,2,0,2,3].map((function(e){return N+e}))),N+=4)}var J=r.RendererBuffers.initPositionBuffer(e,A),$=r.RendererBuffers.initColorBuffer(e,L),ee=r.RendererBuffers.initIndexBuffer(e,j);return{verticles:A.length/2,position:J,color:$,indices:ee}},e}();t.RendererPathModel=n},931:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.RendererScene=void 0;var o=function(){function e(){}return e.drawScene=function(e,t,o,r,n,i){var a,l,s,u,c,d,v,f,p,h;(null===(a=r.autoClear)||void 0===a||a)&&(e.clearColor(0,0,0,0),e.clearDepth(1),e.clear(e.COLOR_BUFFER_BIT|e.DEPTH_BUFFER_BIT)),e.enable(e.DEPTH_TEST),e.depthFunc(e.LEQUAL);var m=(null!==(l=r.cameraFov)&&void 0!==l?l:45)*Math.PI/180,g=e.canvas.clientWidth/e.canvas.clientHeight,R=mat4.create();(null===(s=r.keepPerspectiveProjection)||void 0===s||s)&&mat4.perspective(R,m,g,.1,1e3);var x=mat4.create();if(i){var y=[i[0],i[1],i[2],i[3],i[4],i[5],i[6],i[7],i[8],i[9],i[10],i[11],i[12],i[13],i[14],i[15]],w=mat4.fromValues.apply(null,y);mat4.multiply(x,x,w)}mat4.rotate(x,x,180/Math.PI*0,[0,0,1]),mat4.translate(x,x,null!==(u=r.cameraTranslation)&&void 0!==u?u:[0,0,-25]),mat4.rotate(x,x,(null!==(d=null===(c=r.cameraRotation)||void 0===c?void 0:c[1])&&void 0!==d?d:0)+.01*n.y,[1,0,0]),mat4.rotate(x,x,(null!==(f=null===(v=r.cameraRotation)||void 0===v?void 0:v[0])&&void 0!==f?f:0)+.01*n.x,[0,1,0]),mat4.rotate(x,x,null!==(h=null===(p=r.cameraRotation)||void 0===p?void 0:p[2])&&void 0!==h?h:0,[0,0,1]);for(var P=0,b=o;P<b.length;P++){var M=b[P];this.setPositionAttribute(e,M,t),this.setColorAttribute(e,M,t),e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,M.indices),e.useProgram(t.program),e.uniformMatrix4fv(t.uniformLocations.projectionMatrix,!1,R),e.uniformMatrix4fv(t.uniformLocations.modelViewMatrix,!1,x);var C=M.verticles,A=e.UNSIGNED_SHORT;e.drawElements(e.TRIANGLES,C,A,0)}},e.setPositionAttribute=function(e,t,o){var r=e.FLOAT;e.bindBuffer(e.ARRAY_BUFFER,t.position),e.vertexAttribPointer(o.attribLocations.vertexPosition,3,r,!1,0,0),e.enableVertexAttribArray(o.attribLocations.vertexPosition)},e.setColorAttribute=function(e,t,o){var r=e.FLOAT;e.bindBuffer(e.ARRAY_BUFFER,t.color),e.vertexAttribPointer(o.attribLocations.vertexColor,4,r,!1,0,0),e.enableVertexAttribArray(o.attribLocations.vertexColor)},e}();t.RendererScene=o},964:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.RendererWebGL=void 0;var o=function(){function e(){}return e.initializeProgram=function(t){var o=e.initShaderProgram(t,"\n            attribute vec4 aVertexPosition;\n            attribute vec4 aVertexColor;\n\n            uniform mat4 uModelViewMatrix;\n            uniform mat4 uProjectionMatrix;\n\n            varying lowp vec4 vColor;\n\n            void main(void) {\n                gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;\n                vColor = aVertexColor;\n            }\n        ","\n            varying lowp vec4 vColor;\n\n            void main(void) {\n                gl_FragColor = vColor;\n            }\n        ");if(!o)throw new Error("shader program");return{program:o,attribLocations:{vertexPosition:t.getAttribLocation(o,"aVertexPosition"),vertexColor:t.getAttribLocation(o,"aVertexColor")},uniformLocations:{projectionMatrix:t.getUniformLocation(o,"uProjectionMatrix"),modelViewMatrix:t.getUniformLocation(o,"uModelViewMatrix")}}},e.initShaderProgram=function(e,t,o){var r=this.loadShader(e,e.VERTEX_SHADER,t);if(!r)throw new Error("vertex shader");var n=this.loadShader(e,e.FRAGMENT_SHADER,o);if(!n)throw new Error("fragment shader");var i=e.createProgram();if(!i)throw new Error("shader program");return e.attachShader(i,r),e.attachShader(i,n),e.linkProgram(i),e.getProgramParameter(i,e.LINK_STATUS)?i:(alert("Unable to initialize the shader program: ".concat(e.getProgramInfoLog(i))),null)},e.loadShader=function(e,t,o){var r=e.createShader(t);if(!r)throw new Error("shader");return e.shaderSource(r,o),e.compileShader(r),e.getShaderParameter(r,e.COMPILE_STATUS)?r:(alert("An error occurred compiling the shaders: ".concat(e.getShaderInfoLog(r))),e.deleteShader(r),null)},e}();t.RendererWebGL=o},279:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0});t.default=function(e,t){var o=new google.maps.WebGLOverlayView;return o.onAdd=o.onStateUpdate=o.onContextLost=o.onRemove=function(){},o.onContextRestored=function(t){var o=t.gl;e.setOptions({autoClear:!1,center:!1,keepPerspectiveProjection:!1}),e.setupContext(o)},o.onDraw=function(r){var n=r.gl,i=r.transformer;e.paths.length||e.setPaths(t,null,!0,(function(e,t){var o=i.fromLatLngAltitude({lat:e.latitude,lng:e.longitude,altitude:0}),r=mat4.create(),n=vec4.fromValues(0,0,0,1),a=vec4.create();return mat4.invert(r,o),vec4.transformMat4(a,n,r),{x:a[1]/3*2,y:a[0]/3*2,z:20*e.altitude}}));var a=i.fromLatLngAltitude({lat:t[0][0].latitude,lng:t[0][0].longitude,altitude:0});o.requestRedraw(),e.render(n,performance.now(),a)},o}}},t={};!function o(r){var n=t[r];if(void 0!==n)return n.exports;var i=t[r]={exports:{}};return e[r].call(i.exports,i,i.exports,o),i.exports}(607)})();
//# sourceMappingURL=bundle.js.map