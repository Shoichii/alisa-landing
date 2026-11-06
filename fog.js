window.makeFog=function(canvas,opt){
  opt=opt||{};
  var gl=canvas.getContext('webgl',{alpha:false,antialias:false,depth:false,stencil:false,preserveDrawingBuffer:false,powerPreference:'low-power'});
  if(!gl)return null;
  var VS='attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}';
  var FS=['precision mediump float;',
    'uniform vec2 R;uniform float T;uniform vec2 M;uniform vec2 L;uniform float K;uniform vec3 C;',
    'float h(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}',
    'float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1.,0.)),f.x),mix(h(i+vec2(0.,1.)),h(i+vec2(1.,1.)),f.x),f.y);}',
    'float fbm(vec2 p){float s=0.,a=.5;for(int i=0;i<5;i++){s+=a*n(p);p=p*2.03+vec2(3.1,1.7);a*=.5;}return s;}',
    'void main(){',
    ' vec2 uv=gl_FragCoord.xy/R;float asp=R.x/R.y;vec2 p=vec2(uv.x*asp,uv.y);',
    ' vec2 l=vec2((L.x-M.x*.04)*asp,L.y+M.y*.04);vec2 d=p-l;float r=length(d);float a=atan(d.y,d.x);',
    ' float ray=fbm(vec2(a*3.,T*.06))*.55+fbm(vec2(a*8.5+2.,T*.11))*.45;',
    ' ray=smoothstep(.42,.9,ray)*smoothstep(1.35,.05,r);',
    ' vec2 q=vec2(fbm(p*1.4+vec2(T*.02,0.)),fbm(p*1.4+vec2(5.2,1.3)-vec2(0.,T*.016)));',
    ' float fog=fbm(p*2.1+q*1.7+vec2(T*.035,0.)+M*.06);',
    ' fog=smoothstep(.36,.86,fog);',
    ' float low=smoothstep(.8,.0,uv.y);',
    ' float core=exp(-r*r*10.)*1.1+exp(-r*2.8)*.22;',
    ' vec3 c=C*fog*(.3+.7*low);',
    ' c+=vec3(1.,.62,.48)*ray*.7;',
    ' c+=vec3(1.,.5,.4)*fog*exp(-r*1.7)*.55;',
    ' c+=vec3(1.,.87,.74)*core;',
    ' gl_FragColor=vec4(c*K,1.);}'].join('\n');
  function sh(type,src){var s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);return gl.getShaderParameter(s,gl.COMPILE_STATUS)?s:null;}
  var v=sh(gl.VERTEX_SHADER,VS),f=sh(gl.FRAGMENT_SHADER,FS);if(!v||!f)return null;
  var pr=gl.createProgram();gl.attachShader(pr,v);gl.attachShader(pr,f);gl.linkProgram(pr);if(!gl.getProgramParameter(pr,gl.LINK_STATUS))return null;
  gl.useProgram(pr);
  var b=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);
  var loc=gl.getAttribLocation(pr,'a');gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,2,gl.FLOAT,false,0,0);
  var U={};['R','T','M','L','K','C'].forEach(function(k){U[k]=gl.getUniformLocation(pr,k);});
  var col=opt.color||[.62,.07,.1],light=opt.light||[.5,.7],scale=opt.scale||.5,api={dead:false};
  canvas.addEventListener('webglcontextlost',function(e){e.preventDefault();api.dead=true;if(opt.onLost)opt.onLost();});
  api.resize=function(){var w=canvas.clientWidth,hh=canvas.clientHeight,s=Math.min(scale,960/Math.max(1,w));canvas.width=Math.max(1,Math.round(w*s));canvas.height=Math.max(1,Math.round(hh*s));gl.viewport(0,0,canvas.width,canvas.height);};
  api.draw=function(t,mx,my,k){if(api.dead)return;gl.uniform2f(U.R,canvas.width,canvas.height);gl.uniform1f(U.T,t);gl.uniform2f(U.M,mx||0,my||0);gl.uniform2f(U.L,light[0],light[1]);gl.uniform1f(U.K,k==null?1:k);gl.uniform3f(U.C,col[0],col[1],col[2]);gl.drawArrays(gl.TRIANGLES,0,6);};
  api.light=function(x,y){light=[x,y];};
  api.resize();
  return api;
};
