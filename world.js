(function(){
var world=document.getElementById('world');if(!world||location.protocol==='file:')return;
var RM=matchMedia('(prefers-reduced-motion: reduce)').matches,TOUCH=matchMedia('(hover:none) and (pointer:coarse)').matches,MQ=matchMedia('(max-width:700px)'),de=document.documentElement,nv=navigator;
var LOW=(nv.deviceMemory&&nv.deviceMemory<=2)||(nv.hardwareConcurrency&&nv.hardwareConcurrency<=2);
var cv=document.createElement('canvas'),CA={alpha:false,antialias:false,depth:false,stencil:false,premultipliedAlpha:true},gl=null,G2=false;
cv.className='w-gl';
try{gl=cv.getContext('webgl2',CA);G2=!!gl;if(!gl)gl=cv.getContext('webgl',CA);}catch(e){gl=null;}
if(!gl)return;

var W=1,H=1,K=1,P=1000,OY=.5,XS=1,FAR=4800,SMALL=false,D=1,DM=2,cz=0,lx=0,ly=0,tlx=0,tly=0,PR=0,YR=0;
var pls=[],RG=[-900,-60,-8900],M=[],NM=0,SY=[0],SZ=[0],TK=[],VIS=[],dead=false,gen=0,NL=0,dirty=true,bars=0,lastFog=-1,lastY=-1;
var PF,PB,PP,PS,vbT,vbQ,vbD,ibD,txN,txY,txA,txF=null,fbF=null,fw=0,fh=0,MAXT=2048,ANI=null,ANM=0,NZ=null;
var CAP=2048,DB=new Float32Array(CAP*48),NV=0,YA=new Uint8Array(256);
var HIT=false,tcx=0,tcy=0,tcX=1,tsX=0,tcY=1,tsY=0,QX=0,QY=0,QS=0,QV=0,QZ=0,EX=0,EY=0,EZ=0;
function cl(v,a,b){return v<a?a:v>b?b:v;}
function sm(a,b,v){var t=cl((v-a)/(b-a),0,1);return t*t*(3-2*t);}

var HD='#ifdef GL_FRAGMENT_PRECISION_HIGH\nprecision highp float;\n#else\nprecision mediump float;\n#endif\n';
var VG='uniform vec4 uS;uniform float uB;vec4 vg(vec4 c){vec2 f=vec2(gl_FragCoord.x*uS.z,uS.y-gl_FragCoord.y*uS.w),e=(f-vec2(.5,.44)*uS.xy)/(vec2(.96,.86)*uS.xy);'+
 'float v=.8*clamp((length(e)-.46)/.54,0.,1.),d=min(f.x,uS.x-f.x),b=.96*(1.-clamp((d-12.)/14.,0.,1.))*uB;v=1.-(1.-v)*(1.-b);return vec4(c.rgb*((1.-v)*.7)+vec3(.0392,.0157,.0196)*(v*c.a),c.a);}\n';
var VT='attribute vec2 a;varying vec2 vT;void main(){vT=a*.5+.5;gl_Position=vec4(a,0.,1.);}';
var FF='uniform vec2 R,M,L;uniform float T,K;uniform vec3 C;uniform sampler2D uN,uY;'+
 'void main(){vec2 uv=gl_FragCoord.xy/R;float asp=R.x/R.y;vec2 p=vec2(uv.x*asp,uv.y),l=vec2((L.x-M.x*.04)*asp,L.y+M.y*.04),d=p-l;float r=length(d),a=atan(d.y,d.x);'+
 'float ray=texture2D(uY,vec2(a*.1591549+.5,.5)).r;ray=smoothstep(.42,.9,ray)*(1.-smoothstep(.05,1.35,r));'+
 'vec2 q=texture2D(uN,(p*1.4+vec2(T*.02,-T*.016))*.25).rg;float fog=smoothstep(.36,.86,texture2D(uN,(p*2.1+q*1.7+vec2(T*.035,0.)+M*.06)*.25).b);'+
 'float low=1.-smoothstep(0.,.8,uv.y),core=exp(-r*r*10.)*1.1+exp(-r*2.8)*.22;'+
 'vec3 c=C*fog*(.3+.7*low)+vec3(1.,.62,.48)*ray*.7+vec3(1.,.5,.4)*fog*exp(-r*1.7)*.55+vec3(1.,.87,.74)*core;gl_FragColor=vec4(c*K,1.);}';
var FB='uniform sampler2D uF;varying vec2 vT;void main(){gl_FragColor=vg(vec4(texture2D(uF,vT).rgb,1.));}';
var VP='attribute vec2 a;uniform vec3 uO,uU,uV,uC;uniform vec4 uL,uR,uP;uniform float uY;varying vec2 vL,vT;'+
 'void main(){vec3 w=uO+uU*a.x+uV*a.y,p=(w-uC)*uP.x;vL=mix(uL.xy,uL.zw,a);vT=a;'+
 'float x1=p.x*uR.x+p.z*uR.y,z1=p.z*uR.x-p.x*uR.y,y2=p.y*uR.z-z1*uR.w,z2=p.y*uR.w+z1*uR.z,q=max(1.-z2/uP.y,.02);'+
 'gl_Position=vec4(x1*uP.z,(1.-2.*uY)*q-y2*uP.w,0.,q);}';
var FP='uniform sampler2D uT;uniform float uK,uA,uPx;uniform vec4 uQ,uE,uCo;varying vec2 vL,vT;'+
 'vec2 erf(vec2 x){vec2 s=sign(x),a=abs(x);x=1.+(.278393+(.230389+.078108*(a*a))*a)*a;x*=x;return s-s/(x*x);}'+
 'float ln(float d,float hw){float hp=hw*uPx,he=max(hp,.5);return clamp(he+.5-d*uPx,0.,1.)*(hp/he);}'+
 'void main(){vec4 c;'+
 'if(uK<.5){vec2 p=vL-uE.yz,k=vec2(.7071068/uE.x),g=.5*(erf((p-uQ.xy)*k)-erf((p-uQ.zw)*k));'+
 'float o=step(uQ.x,vL.x)*step(vL.x,uQ.z)*step(uQ.y,vL.y)*step(vL.y,uQ.w);c=vec4(uCo.rgb,1.)*(uCo.a*g.x*g.y*(1.-o));}'+
 'else if(uK<1.5){c=vec4(1.,.29,.31,1.)*(.9*(1.-clamp(-vL.y/700.,0.,1.))*ln(abs(vL.x-uQ.x),1.));}'+
 'else if(uK<2.5){c=vec4(1.,.886,.769,1.)*(.28*clamp(1.-length((vL-uQ.xy)/uQ.zw)/.7,0.,1.));}'+
 'else if(uK<3.5){float t=1.-vL.y/1000.;vec4 c0=vec4(1.,.376,.361,1.)*.9,c1=vec4(1.,.29,.31,1.)*.34,b=t<.28?mix(c0,c1,t/.28):mix(c1,vec4(0.),(t-.28)/.72),'+
 'k=vec4(1.,.902,.784,1.)*(clamp(1.-t/.76,0.,1.)*ln(abs(vL.x-15.),2.));c=(k+b*(1.-k.a))*ln(abs(vL.x-15.),15.);}'+
 'else{c=texture2D(uT,vT);c.rgb=max(c.rgb*uE.x+c.a*uE.y,0.);}'+
 'gl_FragColor=vg(c*uA);}';
var VS='attribute vec2 aP,aL;attribute vec4 aG,aC;uniform vec2 uW;varying vec2 vL;varying vec4 vG,vC;'+
 'void main(){vL=aL;vG=aG;vC=aC;gl_Position=vec4(aP.x*uW.x-1.,1.-aP.y*uW.y,0.,1.);}';
var FS='uniform sampler2D uA;uniform float uD;varying vec2 vL;varying vec4 vG,vC;'+
 'vec4 ly(vec4 o,float s,float lw,float a,vec3 k){float hp=lw*.5*uD,he=max(hp,.5),v=clamp(he+.5-s*uD,0.,1.)*(hp/he)*a;return vec4(k*v,v)+o*(1.-v);}'+
 'void main(){float k=vG.x;vec4 c;'+
 'if(k<.5){float d=length(vec2(vL.x-clamp(vL.x,0.,vG.z),vL.y));c=vec4(vC.rgb,1.)*(vC.a*clamp((vG.y-d)*uD+.5,0.,1.));}'+
 'else if(k<1.5){c=vec4(vC.rgb,1.)*(vC.a*max(0.,1.-length(vL)/vG.y));}'+
 'else if(k<2.5){float d=length(vL)/vG.y;vec4 a0=vec4(.588,.376,1.,1.)*vC.a,a1=vec4(.482,.239,1.,1.)*(vC.a*.35);c=d<.45?mix(a0,a1,d/.45):mix(a1,vec4(0.),min(1.,(d-.45)/.55));}'+
 'else if(k<3.5){c=texture2D(uA,vec2(vG.w*.5+.125+vL.x*.25,.25+vL.y*.5))*vC.a;}'+
 'else{float s=abs(vL.y),w=vG.w,a=vC.a;c=ly(vec4(0.),s,w*4.2+5.,a*.16,vec3(.89,.149,.184));c=ly(c,s,w*2.+1.5,a*.34,vec3(.941,.196,.22));'+
 'c=ly(c,s,w,a*.96,vec3(1.,.329,.345));if(w>1.4)c=ly(c,s,w*.34,a*.6,vec3(1.,.769,.698));}'+
 'gl_FragColor=vg(c);}';

function sh(t,s){var o=gl.createShader(t);gl.shaderSource(o,s);gl.compileShader(o);return gl.getShaderParameter(o,gl.COMPILE_STATUS)?o:null;}
function prog(vs,fs,at,un){var v=sh(gl.VERTEX_SHADER,vs),f=sh(gl.FRAGMENT_SHADER,HD+fs),p,o,i;if(!v||!f)return null;
  p=gl.createProgram();gl.attachShader(p,v);gl.attachShader(p,f);for(i=0;i<at.length;i++)gl.bindAttribLocation(p,i,at[i]);gl.linkProgram(p);
  if(!gl.getProgramParameter(p,gl.LINK_STATUS))return null;o={p:p,u:{}};un.split(' ').forEach(function(n){o.u[n]=gl.getUniformLocation(p,n);});return o;}
function buf(t,d){var b=gl.createBuffer();gl.bindBuffer(t,b);gl.bufferData(t,d,gl.STATIC_DRAW);return b;}
function tex(rep){var t=gl.createTexture(),w=rep?gl.REPEAT:gl.CLAMP_TO_EDGE;gl.bindTexture(gl.TEXTURE_2D,t);
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,w);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,w);
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);return t;}
function up(c,an){var t=tex(false);gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL,true);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,c);gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL,false);
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR_MIPMAP_LINEAR);gl.generateMipmap(gl.TEXTURE_2D);
  if(an&&ANM)gl.texParameterf(gl.TEXTURE_2D,ANI.TEXTURE_MAX_ANISOTROPY_EXT,ANM);return t;}

function noise(){if(NZ)return NZ;var N=128,d=new Uint8Array(N*N*4),g=new Float32Array(N*N),c,o,x,y,i,n,L,am,u,v,i0,i1,j0,j1,fx,fy,a,b;
  for(c=0;c<3;c++){for(i=0;i<N*N;i++)g[i]=0;am=.5;
    for(o=0;o<5;o++){n=4<<o;L=new Float32Array(n*n);for(i=0;i<n*n;i++)L[i]=Math.random();
      for(y=0;y<N;y++){v=(y+.5)/N*n;j0=Math.floor(v);fy=v-j0;fy=fy*fy*(3-2*fy);j1=(j0+1)%n;
        for(x=0;x<N;x++){u=(x+.5)/N*n;i0=Math.floor(u);fx=u-i0;fx=fx*fx*(3-2*fx);i1=(i0+1)%n;
          a=L[j0*n+i0];a+=(L[j0*n+i1]-a)*fx;b=L[j1*n+i0];b+=(L[j1*n+i1]-b)*fx;g[y*N+x]+=am*(a+(b-a)*fy);}}am*=.5;}
    for(i=0;i<N*N;i++)d[i*4+c]=Math.round(g[i]*255);}
  for(i=0;i<N*N;i++)d[i*4+3]=255;return NZ=d;}
function fr(x){return x-Math.floor(x);}
function hh(x,y){x=fr(x*123.34);y=fr(y*456.21);var s=x*(x+45.32)+y*(y+45.32);return fr((x+s)*(y+s));}
function vn(x,y){var i=Math.floor(x),j=Math.floor(y),fx=x-i,fy=y-j,a=hh(i,j),b=hh(i+1,j),c=hh(i,j+1),d=hh(i+1,j+1);fx=fx*fx*(3-2*fx);fy=fy*fy*(3-2*fy);return a+(b-a)*fx+(c-a)*fy+(a-b-c+d)*fx*fy;}
function fbm(x,y){var s=0,a=.5;for(var i=0;i<5;i++){s+=a*vn(x,y);x=x*2.03+3.1;y=y*2.03+1.7;a*=.5;}return s;}
function rays(T){for(var i=0;i<256;i++){var a=((i+.5)/256-.5)*6.2831853;YA[i]=Math.round(cl(fbm(a*3,T*.06)*.55+fbm(a*8.5+2,T*.11)*.45,0,1)*255);}
  gl.activeTexture(gl.TEXTURE2);gl.bindTexture(gl.TEXTURE_2D,txY);gl.texSubImage2D(gl.TEXTURE_2D,0,0,0,256,1,gl.LUMINANCE,gl.UNSIGNED_BYTE,YA);gl.activeTexture(gl.TEXTURE0);}
function atlas(){var c=document.createElement('canvas'),x,g,t;c.width=256;c.height=128;x=c.getContext('2d');x.translate(32,32);
  x.fillStyle='rgba(0,0,0,.45)';x.beginPath();x.arc(36,37,19,0,6.2832);x.fill();
  g=x.createRadialGradient(32,32,8,32,32,32);g.addColorStop(0,'rgba(227,38,47,.4)');g.addColorStop(1,'rgba(227,38,47,0)');x.fillStyle=g;x.fillRect(0,0,64,64);
  g=x.createRadialGradient(25,25,2,32,32,20);g.addColorStop(0,'#FF8A80');g.addColorStop(.45,'#E3262F');g.addColorStop(1,'#5E0A10');x.fillStyle=g;x.beginPath();x.arc(32,32,20,0,6.2832);x.fill();
  x.fillStyle='rgba(255,236,226,.55)';x.beginPath();x.arc(25,24,4.5,0,6.2832);x.fill();
  x.setTransform(1,0,0,1,160,32);g=x.createRadialGradient(32,32,0,32,32,32);
  g.addColorStop(0,'rgba(255,246,236,1)');g.addColorStop(.12,'rgba(255,230,200,.95)');g.addColorStop(.3,'rgba(255,120,100,.45)');g.addColorStop(.6,'rgba(227,38,47,.14)');g.addColorStop(1,'rgba(227,38,47,0)');
  x.fillStyle=g;x.fillRect(0,0,64,64);t=up(c,false);c.width=c.height=0;return t;}

function setup(){
  PF=prog(VT,FF,['a'],'R M L T K C uN uY');PB=prog(VT,VG+FB,['a'],'uS uB uF');
  PP=prog(VP,VG+FP,['a'],'uO uU uV uC uL uR uP uY uS uB uT uK uA uPx uQ uE uCo');
  PS=prog(VS,VG+FS,['aP','aL','aG','aC'],'uW uS uB uA uD');
  if(!PF||!PB||!PP||!PS)return false;
  var ix=new Uint16Array(CAP*6),i;for(i=0;i<CAP;i++){ix[i*6]=i*4;ix[i*6+1]=i*4+1;ix[i*6+2]=i*4+2;ix[i*6+3]=i*4+2;ix[i*6+4]=i*4+1;ix[i*6+5]=i*4+3;}
  vbT=buf(gl.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]));vbQ=buf(gl.ARRAY_BUFFER,new Float32Array([0,0,1,0,0,1,1,1]));
  ibD=buf(gl.ELEMENT_ARRAY_BUFFER,ix);vbD=gl.createBuffer();
  MAXT=Math.min(2048,gl.getParameter(gl.MAX_TEXTURE_SIZE)||2048);
  ANI=gl.getExtension('EXT_texture_filter_anisotropic')||gl.getExtension('WEBKIT_EXT_texture_filter_anisotropic');ANM=ANI?Math.min(4,gl.getParameter(ANI.MAX_TEXTURE_MAX_ANISOTROPY_EXT)||0):0;
  gl.activeTexture(gl.TEXTURE1);txN=tex(true);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,128,128,0,gl.RGBA,gl.UNSIGNED_BYTE,noise());
  gl.activeTexture(gl.TEXTURE2);txY=tex(false);gl.texImage2D(gl.TEXTURE_2D,0,gl.LUMINANCE,256,1,0,gl.LUMINANCE,gl.UNSIGNED_BYTE,YA);
  gl.activeTexture(gl.TEXTURE0);txA=atlas();
  gl.useProgram(PF.p);gl.uniform1i(PF.u.uN,1);gl.uniform1i(PF.u.uY,2);gl.useProgram(PB.p);gl.uniform1i(PB.u.uF,0);
  gl.useProgram(PP.p);gl.uniform1i(PP.u.uT,0);gl.useProgram(PS.p);gl.uniform1i(PS.u.uA,0);
  gl.disable(gl.DEPTH_TEST);gl.disable(gl.CULL_FACE);gl.blendFunc(gl.ONE,gl.ONE_MINUS_SRC_ALPHA);gl.enableVertexAttribArray(0);
  txF=fbF=null;fw=fh=0;lastFog=-1;return !gl.isContextLost();}

function fogBuf(){var s=Math.min(SMALL?.4:.5,960/Math.max(1,W)),w=Math.max(1,Math.round(W*s)),h=Math.max(1,Math.round(H*s));if(w===fw&&h===fh&&txF)return;fw=w;fh=h;
  if(txF)gl.deleteTexture(txF);if(fbF)gl.deleteFramebuffer(fbF);
  txF=tex(false);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,w,h,0,gl.RGBA,gl.UNSIGNED_BYTE,null);
  fbF=gl.createFramebuffer();gl.bindFramebuffer(gl.FRAMEBUFFER,fbF);gl.framebufferTexture2D(gl.FRAMEBUFFER,gl.COLOR_ATTACHMENT0,gl.TEXTURE_2D,txF,0);gl.bindFramebuffer(gl.FRAMEBUFFER,null);lastFog=-1;}
function pickD(){var d=Math.min(devicePixelRatio||1,2),cap=SMALL?7.4e5:3e6;if(W*H*d*d>cap)d=Math.max(1,Math.sqrt(cap/(W*H)));if(LOW)d=Math.min(d,1.5);return Math.min(d,DM);}
function size(){D=pickD();var w=Math.max(1,Math.round(W*D)),h=Math.max(1,Math.round(H*D));if(cv.width!==w)cv.width=w;if(cv.height!==h)cv.height=h;if(!dead)fogBuf();dirty=true;}

function rec(o){o.a=0;o.v=0;o.off=false;o.st=0;o.tex=null;o.im=null;o.px=1;o.dz=0;o.n0=-420;o.n1=-60;o.ry=o.ry||0;o.O=[0,0,0];o.U=[1,0,0];o.V=[0,1,0];pls.push(o);return o;}
function build(){
  [].forEach.call(document.querySelectorAll('#wScene .w-cut'),function(im){var d=im.getAttribute('data-p').split(' ').map(Number);rec({k:'cut',e:im,x:d[0],y:d[1],z:d[2],w:d[3],h:d[4],o:1});});
  [['print','game-hq',820,-60,-2000,560,740,-26,0],['hang','game-envelope',-900,-240,-2600,500,660,22,0],['hang','game-start',720,-300,-3300,560,740,-20,0],
   ['print','game-cup',-760,40,-3900,520,686,24,1],['print','game-route',860,-100,-4500,580,766,-24,0],['hang','board-museum',-640,-320,-7200,440,520,16,0],
   ['hang','board-showcase',600,-380,-7600,420,496,-14,0],['hang','board-gas',-460,-140,-8100,440,520,10,1],['hang','board-witness',720,-220,-8500,440,520,-18,1],
   ['screen','fmt-film',-620,-220,-13500,1000,625,10,0],['poster','fmt-map',820,-100,-14200,640,400,-22,0],['poster','fmt-quest',-840,30,-14700,640,400,22,1],
   ['poster','fmt-reward',760,-260,-15200,600,375,-18,0]
  ].forEach(function(d,i){var h=d[0]==='hang';rec({k:h?'print':d[0],hang:h,dl:-i*1.37,src:'img/items/'+d[1]+'.webp',x:d[2],y:d[3],z:d[4],w:d[5],h:d[6],ry:d[7],big:!!d[8],fx:true,o:1});});
  rec({k:'floor',x:698,y:520,z:-5962,w:2000,h:1057,o:1});
  var F=2000/1060;[[148,253,0],[166,180,0],[216,330,1],[86,358,1]].forEach(function(b){rec({k:'beam',x:(b[0]-160)*F,y:20,z:-6000+(b[1]-260)*F,w:30,h:1000,o:b[2]?.55:.9,big:!!b[2]});});
  ['clue-receipt','clue-note','clue-compass','clue-seal','clue-key'].forEach(function(n,i){rec({k:'card',ring:true,ri:i,src:'img/items/'+n+'.webp',x:RG[0],y:RG[1],z:RG[2],w:300,h:400,fx:true,o:1});});
  ['svyat','nino','maria','grigorii','maksim','kadir'].forEach(function(n,i){rec({k:'frame',src:'img/team/'+n+'.webp',x:780,y:-40,z:-11000-i*420,w:340,h:453,ry:-68,big:i>2,fx:true,o:1});});}

var FL=[-200*2000/1060,-200*1057/560,1260*2000/1060,760*1057/560];
function floorSvg(tw,th){
  var R=window.RU||[],pts=[[148,253],[174,238],[216,166],[166,180],[216,330],[138,303],[86,358]],open=[1,1,1,1,0,0,0];
  var line=pts.map(function(p){return p[0]+','+p[1];}).join(' '),dots='';
  pts.forEach(function(p,i){dots+='<circle cx="'+p[0]+'" cy="'+p[1]+'" r="'+(open[i]?12:8)+'" fill="rgba(255,74,79,'+(open[i]?.45:.22)+')"/><circle cx="'+p[0]+'" cy="'+p[1]+'" r="'+(open[i]?4.2:3)+'" fill="'+(open[i]?'#FFE6C8':'#D99482')+'"/>';});
  return '<svg xmlns="http://www.w3.org/2000/svg" width="'+tw+'" height="'+th+'" viewBox="-200 -200 1460 960" preserveAspectRatio="none"><defs><radialGradient id="wfG"><stop offset="0" stop-color="#FF4A4F" stop-opacity=".46"/><stop offset="1" stop-color="#FF4A4F" stop-opacity="0"/></radialGradient>'+
    '<radialGradient id="wfR" cx=".4" cy=".5" r=".62"><stop offset=".3" stop-color="#fff"/><stop offset="1" stop-color="#000"/></radialGradient><mask id="wfM"><rect x="-200" y="-200" width="1460" height="960" fill="url(#wfR)"/></mask>'+
    '<pattern id="wfP" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M40 0H0V40" fill="none" stroke="rgba(255,130,120,.16)" stroke-width="1"/></pattern></defs>'+
    '<rect x="-200" y="-200" width="1460" height="960" fill="url(#wfP)" mask="url(#wfM)"/>'+
    '<path d="'+R.join(' ')+'" fill="#250910" stroke="rgba(255,150,120,.62)" stroke-width="1.1" stroke-linejoin="round"/>'+
    '<ellipse cx="156" cy="262" rx="240" ry="180" fill="url(#wfG)"/>'+
    '<polyline points="'+line+'" fill="none" stroke="rgba(255,74,79,.42)" stroke-width="12" stroke-linejoin="round" stroke-linecap="round"/>'+
    '<polyline points="'+line+'" fill="none" stroke="#FF4A4F" stroke-width="3" stroke-dasharray="9 6" stroke-linejoin="round"/>'+dots+'</svg>';}
function p2(n){return Math.min(MAXT,Math.pow(2,Math.round(Math.log(n)/Math.LN2)));}
function floorUrl(p){var s=K*P/(P-p.n0)*D*1.15,tw=Math.ceil((FL[2]-FL[0])*s),th=Math.ceil((FL[3]-FL[1])*s),f=Math.min(1,(SMALL?1536:MAXT)/tw,MAXT/th);
  tw=Math.max(1,Math.floor(tw*f));th=Math.max(1,Math.floor(th*f));if(!G2){tw=p2(tw);th=p2(th);}p.tw=tw;p.th=th;
  return 'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(floorSvg(tw,th));}

function place(){
  for(var i=0;i<pls.length;i++){var p=pls[i],x=p.fx?p.x*XS:p.x,side=Math.abs(x)>560;p.off=SMALL&&!!p.big;
    p.n0=p.k==='floor'?-650:side?-200:-420;p.n1=p.k==='floor'?-120:side?140:-60;}
  if(TH)thPlace();}
function fade(z){for(var i=0;i<pls.length;i++){var p=pls[i],v=p.z+z;p.v=v;p.a=p.off||v<=-FAR||v>=p.n1?0:p.o*sm(-FAR,-900,v)*(1-sm(p.n0,p.n1,v));}}
function want(p){return !p.off&&(RM?p.a>0:p.v>-FAR*1.6&&p.v<p.n1+800);}
function load(p){var g=gen,im,fin;p.st=1;NL++;HIT=true;
  fin=function(ok){NL--;if(g!==gen)return;if(ok&&im.naturalWidth>0){p.im=im;p.st=2;}else p.st=4;dirty=true;};
  if(p.k==='cut')im=p.e;else{im=new Image();im.decoding='async';if(p.k!=='floor')im.fetchPriority='low';im.src=p.k==='floor'?floorUrl(p):p.src;}
  if(im.decode)im.decode().then(function(){fin(true);},function(){fin(im.complete&&im.naturalWidth>0);});
  else if(im.complete&&im.naturalWidth)fin(true);else{im.onload=function(){fin(true);};im.onerror=function(){fin(false);};}}
function boxOf(p,nw,nh){var w=p.w,h=p.h,k=p.k,b,ar;
  if(k==='cut'){ar=nw/nh;b=ar>w/h?[0,(h-w/ar)/2,w,w/ar]:[(w-h*ar)/2,0,h*ar,h];return [b,nw/b[2]];}
  b=k==='print'?[w*.032,w*.032,w*.936,h-w*.162]:k==='frame'?[9,9,w-18,h-18]:k==='screen'?[12,12,w-24,h-24]:k==='poster'?[10,10,w-20,h-20]:[9,9,w-18,h-43];
  return [b,Math.min(nw/b[2],nh/b[3])];}
function cover(x,im,b){var iw=im.naturalWidth,ih=im.naturalHeight,k=Math.max(b[2]/iw,b[3]/ih),sw=b[2]/k,sh=b[3]/k;x.drawImage(im,(iw-sw)/2,(ih-sh)/2,sw,sh,b[0],b[1],b[2],b[3]);}
function paint(x,p,im,b,s,sy){var k=p.k,w=p.w,h=p.h,g;
  if(k==='cut'){x.shadowColor='rgba(255,140,110,.3)';x.shadowBlur=16*s;x.drawImage(im,b[0],b[1],b[2],b[3]);x.shadowColor='rgba(255,214,180,.9)';x.shadowBlur=s;x.drawImage(im,b[0],b[1],b[2],b[3]);return;}
  if(k==='card'){g=x.createLinearGradient(w/2-81.8,h/2-224.8,w/2+81.8,h/2+224.8);g.addColorStop(0,'#F6EEE2');g.addColorStop(1,'#D6C5AE');x.fillStyle=g;}
  else x.fillStyle=k==='print'?'#E8DCCA':k==='frame'?'#140709':k==='screen'?'#0B0405':'#120608';
  x.fillRect(0,0,w,h);
  if(k==='frame'||k==='screen'||k==='poster'){x.strokeStyle=k==='frame'?'rgba(255,214,180,.24)':'rgba(255,214,180,.2)';x.lineWidth=1;x.strokeRect(.5,.5,w-1,h-1);}
  if(k==='print'){x.fillStyle='#2A1712';x.fillRect(b[0],b[1],b[2],b[3]);}
  cover(x,im,b);
  if(p.hang){x.shadowColor='rgba(0,0,0,.5)';x.shadowBlur=4*s;x.shadowOffsetY=2*sy;g=x.createLinearGradient(w/2-7,0,w/2+7,0);g.addColorStop(0,'#7a5a3a');g.addColorStop(.5,'#b48d62');g.addColorStop(1,'#7a5a3a');x.fillStyle=g;x.fillRect(w/2-7,-12,14,28);}}
function bake(p){HIT=true;var im=p.im,k=p.k,w=p.w,h=p.h,r,s,mx,mt,mb,tw,th,f,c,x,sx,sy;p.im=null;
  if(k==='floor'){tw=p.tw;th=p.th;p.tr=FL;}
  else{r=boxOf(p,im.naturalWidth,im.naturalHeight);s=cl(K*P/(P-p.n0)*D*1.15,.25*r[1],r[1]);mx=mt=mb=2/s;if(k==='cut')mx=mt=mb=26+2/s;if(p.hang)mt=17+2/s;
    tw=Math.ceil((w+2*mx)*s);th=Math.ceil((h+mt+mb)*s);f=Math.min(1,MAXT/tw,MAXT/th);if(f<1){tw=Math.floor(tw*f);th=Math.floor(th*f);}
    if(!G2){tw=p2(tw);th=p2(th);}p.tr=[-mx,-mt,w+mx,h+mb];}
  c=document.createElement('canvas');c.width=tw;c.height=th;x=c.getContext('2d');x.imageSmoothingEnabled=true;x.imageSmoothingQuality='high';
  try{if(k==='floor')x.drawImage(im,0,0,tw,th);else{sx=tw/(w+2*mx);sy=th/(h+mt+mb);x.setTransform(sx,0,0,sy,mx*sx,mt*sy);paint(x,p,im,r[0],(sx+sy)/2,sy);}
    if(dead)p.st=0;else{p.tex=up(c,k==='floor');p.st=3;}}catch(e){p.st=4;}
  c.width=c.height=0;dirty=true;}
function lmg(){var i,p,b=null,c=null;
  for(i=0;i<pls.length;i++){p=pls[i];if(p.k==='beam')continue;
    if(p.st===3&&!RM&&(p.off||p.v<-FAR*2.2||p.v>p.n1+1800)){gl.deleteTexture(p.tex);p.tex=null;p.st=0;}
    else if(p.st===0&&want(p)&&(!c||p.v>c.v))c=p;
    else if(p.st===2&&(!b||p.v>b.v))b=p;}
  if(c&&NL<2)load(c);
  if(b){if(want(b))bake(b);else{b.im=null;b.st=0;}}}

function set3(a,x,y,z){a[0]=x;a[1]=y;a[2]=z;}
function sway(p,t){var x=(t-p.dl)/7,c=Math.floor(x),f=x-c;if(c&1)f=1-f;return (-1.6+3.2*f*f*(3-2*f))*Math.PI/180;}
function aff(p,t,ra){var x0=p.fx?p.x*XS:p.x,th,ct,st,a,co,si,h2,rx;
  if(p.k==='floor'){set3(p.O,x0-p.w/2,p.y,p.z-p.h/2);set3(p.U,1,0,0);set3(p.V,0,0,1);return;}
  if(p.ring){th=p.ri*1.25664+ra;ct=Math.cos(th);st=Math.sin(th);rx=RG[0]*XS;set3(p.O,rx-150*ct+420*st,RG[1]-200,RG[2]+150*st+420*ct);set3(p.U,ct,0,-st);set3(p.V,0,1,0);p.nx=st;p.nz=ct;return;}
  th=p.ry*Math.PI/180;ct=Math.cos(th);st=Math.sin(th);
  if(p.hang){a=sway(p,t);co=Math.cos(a);si=Math.sin(a);h2=-p.w/2*ct;set3(p.O,x0+h2*co-600*si,p.y-p.h/2-600+h2*si+600*co,p.z+p.w/2*st);set3(p.U,ct*co,ct*si,-st);set3(p.V,-si,co,0);}
  else{set3(p.O,x0-p.w/2*ct,p.y-p.h/2,p.z+p.w/2*st);set3(p.U,ct,0,-st);set3(p.V,0,1,0);}}
var SHD={print:[[0,40,35,0,0,0,.6]],frame:[[0,30,30,0,0,0,.6]],screen:[[0,40,40,0,0,0,.7],[0,0,70,.89,.149,.184,.3]],poster:[[0,30,35,0,0,0,.65]],card:[[0,30,25,0,0,0,.5]]};
function rect(p,x0,y0,x1,y1){var O=p.O,U=p.U,V=p.V,u=PP.u,a=x1-x0,b=y1-y0;
  gl.uniform3f(u.uO,O[0]+U[0]*x0+V[0]*y0,O[1]+U[1]*x0+V[1]*y0,O[2]+U[2]*x0+V[2]*y0);gl.uniform3f(u.uU,U[0]*a,U[1]*a,U[2]*a);gl.uniform3f(u.uV,V[0]*b,V[1]*b,V[2]*b);
  gl.uniform4f(u.uL,x0,y0,x1,y1);gl.drawArrays(gl.TRIANGLE_STRIP,0,4);}
function dplane(p){var u=PP.u,w=p.w,h=p.h,k=p.k,px=p.px,s=SHD[k],i,d;
  gl.uniform1f(u.uA,p.a);gl.uniform1f(u.uPx,px);
  if(k==='beam'){gl.uniform1f(u.uK,3);rect(p,-2/px,0,30+2/px,1000);return;}
  if(s)for(i=0;i<s.length;i++){d=s[i];gl.uniform1f(u.uK,0);gl.uniform4f(u.uQ,0,0,w,h);gl.uniform4f(u.uE,d[2],d[0],d[1],0);gl.uniform4f(u.uCo,d[3],d[4],d[5],d[6]);rect(p,d[0]-3*d[2],d[1]-3*d[2],w+d[0]+3*d[2],h+d[1]+3*d[2]);}
  if(k==='frame'){gl.uniform1f(u.uK,2);gl.uniform4f(u.uQ,w/2,0,w*.8,240);rect(p,-w*.3,-240,w*1.3,0);}
  if(p.hang){gl.uniform1f(u.uK,1);gl.uniform4f(u.uQ,w/2,0,0,0);rect(p,w/2-1-2/px,-700,w/2+1+2/px,0);}
  gl.uniform1f(u.uK,4);gl.uniform4f(u.uE,k==='cut'?.9672:1,k==='cut'?-.02:0,0,0);gl.bindTexture(gl.TEXTURE_2D,p.tex);rect(p,p.tr[0],p.tr[1],p.tr[2],p.tr[3]);}

function room(){return NV+4<=CAP*4;}
function vx(x,y,a,b,k,r,l,w,R,G,B,A){var o=NV*12;DB[o]=x;DB[o+1]=y;DB[o+2]=a;DB[o+3]=b;DB[o+4]=k;DB[o+5]=r;DB[o+6]=l;DB[o+7]=w;DB[o+8]=R;DB[o+9]=G;DB[o+10]=B;DB[o+11]=A;NV++;}
function disc(x,y,r,k,R,G,B,A){var e=k?r:r+1.5/D;vx(x-e,y-e,-e,-e,k,r,0,0,R,G,B,A);vx(x+e,y-e,e,-e,k,r,0,0,R,G,B,A);vx(x-e,y+e,-e,e,k,r,0,0,R,G,B,A);vx(x+e,y+e,e,e,k,r,0,0,R,G,B,A);}
function caps(ax,ay,bx,by,r,R,G,B,A){var dx=bx-ax,dy=by-ay,l=Math.sqrt(dx*dx+dy*dy),e=r+1.5/D,ux,uy;if(l<.01){disc(ax,ay,r,0,R,G,B,A);return;}ux=dx/l*e;uy=dy/l*e;
  vx(ax-ux+uy,ay-uy-ux,-e,-e,0,r,l,0,R,G,B,A);vx(bx+ux+uy,by+uy-ux,l+e,-e,0,r,l,0,R,G,B,A);vx(ax-ux-uy,ay-uy+ux,-e,e,0,r,l,0,R,G,B,A);vx(bx+ux-uy,by+uy+ux,l+e,e,0,r,l,0,R,G,B,A);}
function spr(x,y,h,c,A){vx(x-h,y-h,0,0,3,0,0,c,1,1,1,A);vx(x+h,y-h,1,0,3,0,0,c,1,1,1,A);vx(x-h,y+h,0,1,3,0,0,c,1,1,1,A);vx(x+h,y+h,1,1,3,0,0,c,1,1,1,A);}

var CK=[[0,0,0,0,0,.95,.74],[1200,0,-20,0,0,.72,.86],[3500,40,-40,-2,0,.58,.98],[4500,200,-40,-16,0,.55,1.02],[5300,300,-20,-18,-1,.55,1.04],[6300,80,-50,-3,0,.58,1],[9200,0,-40,0,0,.6,.96],[10400,90,-40,0,-3,.55,.94],[12100,0,-40,0,0,.6,.92],[13800,0,-20,0,0,.75,.78],[15400,0,0,0,0,1,.56]],CO=[0,0,0,0,0,0,0];
function camAt(z){var a=CK[0],b=CK[CK.length-1],i,k=0;
  if(z<=a[0])b=a;else if(z>=b[0])a=b;else{for(i=1;i<CK.length;i++)if(z<=CK[i][0]){a=CK[i-1];b=CK[i];break;}k=(z-a[0])/(b[0]-a[0]);k=.5-.5*Math.cos(k*Math.PI);}
  for(i=0;i<7;i++)CO[i]=a[i]+(b[i]-a[i])*k;return CO;}
function cam(c){var pr=PR*Math.PI/180,yr=YR*Math.PI/180;tcx=c[1];tcy=c[2];tcX=Math.cos(pr);tsX=Math.sin(pr);tcY=Math.cos(yr);tsY=Math.sin(yr);EX=-P*tcX*tsY+tcx;EY=P*tsX+tcy;EZ=P*tcX*tcY-cz;}
function tpj(x,y,z){var X=(x-tcx)*K,Y=(y-tcy)*K,Z=(z+cz)*K,x1=X*tcY+Z*tsY,z1=-X*tsY+Z*tcY,y2=Y*tcX-z1*tsX,z2=Y*tsX+z1*tcX,d=P*K,q=d-z2;
  if(q<d*.18)return false;QS=d/q;QX=W/2+x1*QS;QY=H*OY+y2*QS;QV=z+cz;QZ=z2;return true;}
function tun(sx,sy,n){var x1=sx-W/2,y2=sy-H*OY,Y=y2*tcX,z1=-y2*tsX,X=x1*tcY-z1*tsY,Z=x1*tsY+z1*tcY;n.x=X/K+tcx;n.y=Y/K+tcy;n.z=Z/K-cz;}
function tfar(v){return sm(-FAR,-900,v);}
function tnear(v){return 1-sm(-320,40,v);}

var IDS=['hero','prereg','people','game','map','start','collect','tubus','team','reels','partners'],ZS=[0,1200,2300,3500,4900,6500,7900,9200,10400,12100,13300],ZEND=15400;
function stations(){var vh=H,last=-1,i,s,y;SY=[];SZ=[];
  for(i=0;i<IDS.length;i++){s=document.getElementById(IDS[i]);if(!s)continue;y=i?Math.max(0,s.getBoundingClientRect().top+scrollY-vh*.3):0;if(y<=last)y=last+1;SY.push(y);SZ.push(ZS[i]);last=y;}
  SY.push(Math.max(last+1,de.scrollHeight-vh));SZ.push(ZEND);if(TH)thTimes();}
function zAt(y){if(y<=SY[0])return SZ[0];for(var i=1;i<SY.length;i++)if(y<SY[i])return SZ[i-1]+(SZ[i]-SZ[i-1])*(y-SY[i-1])/(SY[i]-SY[i-1]);return SZ[SZ.length-1];}

function spawn(m,mode){
  m.x=(Math.random()*2-1)*(SMALL?1300:2100);m.y=(Math.random()*2-1)*1200;
  var v=mode===0?-FAR+Math.random()*(FAR+P*.45):mode===1?-FAR*(.82+Math.random()*.18):P*(.8+Math.random()*.06);
  m.z=v-cz;m.big=Math.random()<.07;m.r=m.big?6+Math.random()*10:.9+Math.random()*2;m.vy=-(10+Math.random()*30);m.ph=Math.random()*6.283;m.tw=.5+Math.random()*1.6;m.px=-1e4;m.py=-1e4;}
function seed(){var n=SMALL?60:130;if(n===NM)return;NM=n;M=[];for(var i=0;i<n;i++){var m={};spawn(m,0);M.push(m);}}
function motes(t,dt,sp){var i,m,v,r,a,sx,sy,gv=-10300+cz,streak=sp>8;
  if(gv>-FAR&&gv<P*.3&&tpj(-900*XS,-60,-10300)){a=.6*sm(-FAR,-1600,gv)*(1-sm(-500,250,gv));if(a>.01)disc(QX,QY,950*K*QS,2,0,0,0,a);}
  for(i=0;i<M.length;i++){m=M[i];
    if(dt>0){m.y+=m.vy*dt;m.x+=Math.sin(t*.3+m.ph)*8*dt;if(m.y<-1300){m.y+=2500;m.px=-1e4;}}
    v=m.z+cz;if(v>P*.86){spawn(m,1);v=m.z+cz;}else if(v<-FAR-300){spawn(m,2);v=m.z+cz;}
    if(!tpj(m.x,m.y,m.z)){m.px=-1e4;continue;}
    sx=QX;sy=QY;r=m.r*QS*K;a=sm(-FAR,-FAR*.55,v)*(1-sm(P*.45,P*.8,v))*(.4+.6*Math.abs(Math.sin(t*m.tw+m.ph)));
    if(a>.02&&sx>-r-40&&sx<W+r+40&&sy>-r-40&&sy<H+r+40&&room()){
      if(m.big)disc(sx,sy,r,1,1,.839,.729,a*.16);
      else if(streak&&m.px>-1e3)caps(m.px,m.py,sx,sy,Math.max(.6,r)/2,1,.886,.784,a*.75);
      else disc(sx,sy,Math.max(.5,r),0,1,.902,.804,a*.9);}
    m.px=sx;m.py=sy;}}

var TH=false,TN=[],TE=[],TT=[],LP=[],TLEAD=1300,TCZ0=1050;
function tn(k,o){o.k=k;o.x=0;o.y=0;o.z=0;o.t=1e9;o.on=false;o.at=-1;o.off=false;o.use=false;o.fa=1;TN.push(o);return o;}
function te(a,b,o){if(!a||!b)return;o=o||{};o.a=a;o.b=b;o.sg=o.sg||0;o.n=a.k==='s'?16:20;o.on=false;o.t0=o.t1=1e9;TE.push(o);}
function tpos(n,ra,t){var p=n.p,w,h,x0,rx,ry,rz,th,ct,st,a,c,ph,co,si;
  if(n.k==='d'){w=p.w;h=p.h;x0=p.fx?p.x*XS:p.x;rx=n.u*w-w/2;rz=n.f;th=p.ry*Math.PI/180;ct=Math.cos(th);st=Math.sin(th);
    if(p.hang){ry=n.v*h+600;a=rx*ct+rz*st;c=-rx*st+rz*ct;ph=sway(p,t);co=Math.cos(ph);si=Math.sin(ph);n.x=x0+a*co-ry*si;n.y=p.y-h/2-600+a*si+ry*co;n.z=p.z+c;}
    else{n.x=x0+rx*ct+rz*st;n.y=p.y+n.v*h-h/2;n.z=p.z-rx*st+rz*ct;}}
  else if(n.k==='f'){n.x=p.x+(n.u-.5)*p.w;n.y=p.y-n.f;n.z=p.z+(n.v-.5)*p.h;}
  else if(n.k==='r'){rx=(n.u-.5)*300;ry=(n.v-.5)*400;rz=n.f+420;th=n.i*1.25664+ra;ct=Math.cos(th);st=Math.sin(th);
    n.x=RG[0]*XS+rx*ct+rz*st;n.y=RG[1]+ry;n.z=RG[2]-rx*st+rz*ct;n.nx=st;n.nz=ct;}
  else if(n.k==='h'||n.k==='c'){n.x=RG[0]*XS;n.y=RG[1]+n.dy;n.z=RG[2];}}
function thInit(){
  var cards=[],floor=null,i;
  for(i=0;i<pls.length;i++){if(pls[i].ring)cards.push(pls[i]);if(pls[i].k==='floor')floor=pls[i];}
  function Dn(name,u,v,f){var p=null,j;for(j=0;j<pls.length;j++)if(pls[j].src&&pls[j].src.indexOf('/'+name+'.webp')>0){p=pls[j];break;}if(!p)return null;return tn('d',{p:p,u:u,v:v,f:f==null?4:f});}
  function F(px,py){return floor?tn('f',{p:floor,u:px/1060,v:py/560,f:3}):null;}
  function S(id){var el=document.querySelector('#'+id+' .v2p');if(!el)return null;var pin=document.createElement('i');pin.className='v6-pin';pin.setAttribute('aria-hidden','true');el.appendChild(pin);return tn('s',{el:pin,px:0,py:0});}
  var pPre=S('prereg'),pPeo=S('people'),pMap=S('map'),pSta=S('start'),pCol=S('collect'),pTeam=S('team'),pReel=S('reels'),pPar=S('partners'),
    hq=Dn('game-hq',.5,.045),hq2=Dn('game-hq',.22,.94),en=Dn('game-envelope',.84,.06),st=Dn('game-start',.16,.055),cu=Dn('game-cup',.8,.06),
    ro=Dn('game-route',.5,.045),ro2=Dn('game-route',.3,.94),c0=F(148,253),c1=F(174,238),c2=F(216,166),
    mu=Dn('board-museum',.84,.08),sh=Dn('board-showcase',.16,.08),ga=Dn('board-gas',.5,.07),wi=Dn('board-witness',.5,.07),
    hb=tn('h',{dy:-700}),cn=tn('c',{dy:-3400}),
    fr=['svyat','nino','maria','grigorii','maksim','kadir'].map(function(n){return Dn(n,.5,.03,12);}),
    s0=Dn('fmt-film',.06,.1),s1=Dn('fmt-film',.94,.1),fm=Dn('fmt-map',.5,.06),fq=Dn('fmt-quest',.5,.06),fw=Dn('fmt-reward',.5,.07);
  te(pPre,hq,{sg:.04});te(hq,hq2,{hide:1,min:100});te(hq,en,{sg:.08});te(hq,st,{sg:.06});
  te(pPeo,cu,{sg:.04,m:'d'});te(pPeo,st,{sg:.04,m:'m'});te(hq2,cu,{sg:.05});te(en,cu,{sg:.06});
  te(st,ro,{sg:.06});te(cu,ro,{sg:.08});te(ro,ro2,{hide:1,min:100});
  te(ro2,c0,{sg:.02});te(ro2,c2,{sg:.02});te(pMap,c1,{sg:.03});te(c0,c1,{min:250});
  te(c0,mu,{sg:.02});te(c2,sh,{sg:.02});te(pSta,mu,{sg:.04});te(mu,ga,{sg:.07});te(sh,wi,{sg:.07});
  te(mu,hb,{sg:.05});te(sh,hb,{sg:.05});te(ga,hb,{sg:.05});te(wi,hb,{sg:.05});te(pCol,hb,{sg:.04});
  te(hb,cn,{min:500});
  cards.forEach(function(p,j){te(hb,tn('r',{p:p,i:j,u:.5,v:.03,f:3}),{min:300});});
  te(hb,fr[0],{sg:.06});te(pTeam,fr[1],{sg:.04});
  for(i=0;i<5;i++)te(fr[i],fr[i+1],{sg:.16,min:300});
  te(fr[2],s1,{sg:.06});te(fr[5],s1,{sg:.06});te(pReel,s0,{sg:.04});
  te(s1,fm,{sg:.06});te(s0,fq,{sg:.06});te(fm,fw,{sg:.07});te(fq,fw,{sg:.07});te(pPar,fw,{sg:.04});
  TH=true;}
function thPlace(){var i,n,e;
  for(i=0;i<TN.length;i++){n=TN[i];n.off=!!(n.p&&n.p.off);n.use=false;if(n.k!=='s')tpos(n,0,0);}
  for(i=0;i<TE.length;i++){e=TE[i];e.on=!e.a.off&&!e.b.off&&(!e.m||(e.m==='m')===SMALL);if(e.on&&!e.hide){e.a.use=true;e.b.use=true;}}
  for(i=0;i<TN.length;i++){n=TN[i];if(n.k==='s')n.el.style.display=n.use?'':'none';}}
function thTimes(){var vh=H,i,n,e,r;
  for(i=0;i<TN.length;i++){n=TN[i];n.t=1e9;if(n.k==='s'&&n.use){r=n.el.getBoundingClientRect();n.px=r.left+r.width/2;n.py=r.top+r.height/2+scrollY;n.t=Math.max(TCZ0,zAt(n.py-vh*.8));}}
  for(i=0;i<TE.length;i++){e=TE[i];e.t0=e.t1=1e9;if(!e.on||e.a.t>=1e9)continue;e.t0=e.a.t;
    e.t1=e.a.k==='s'?e.t0+420:Math.max(e.t0+(e.min||300),-e.b.z-TLEAD);if(e.t1<e.b.t)e.b.t=e.t1;}}
function lflush(){var n=LP.length/4,i,j,o,a,b,tx,ty,l,nx,ny,h;
  for(i=0;i<n-1;i++){if(LP[i*4+3]<.004&&LP[i*4+7]<.004)continue;if(!room())break;
    for(j=0;j<2;j++){o=(i+j)*4;a=Math.max(0,i+j-1)*4;b=Math.min(n-1,i+j+1)*4;tx=LP[b]-LP[a];ty=LP[b+1]-LP[a+1];l=Math.sqrt(tx*tx+ty*ty)||1;nx=-ty/l;ny=tx/l;h=(LP[o+2]*4.2+5)/2+1.5/D;
      vx(LP[o]+nx*h,LP[o+1]+ny*h,0,h,4,0,0,LP[o+2],0,0,0,LP[o+3]);vx(LP[o]-nx*h,LP[o+1]-ny*h,0,-h,4,0,0,LP[o+2],0,0,0,LP[o+3]);}}
  LP.length=0;}
function tstrand(e,q){var A=e.a,B=e.b,dx=B.x-A.x,dy=B.y-A.y,dz=B.z-A.z,sg=e.sg*Math.sqrt(dx*dx+dz*dz)*4,n=e.n,m=Math.ceil(n*q-1e-6),
    vis=A.k==='s'?(B.p?B.p.a/(B.p.o||1):tfar(B.z+cz)*tnear(B.z+cz)):-1,fa=A.fa*B.fa,j,u,a,la=-1,lx2=0,ly2=0,lq=0;
  if(A.z+cz<-FAR-300&&B.z+cz<-FAR-300)return;
  if(A.z+cz>400&&B.z+cz>400)return;
  LP.length=0;
  for(j=0;j<=m;j++){u=j<m?j/n:q;
    if(!tpj(A.x+dx*u,A.y+dy*u+sg*u*(1-u),A.z+dz*u)){lflush();la=-1;continue;}
    a=tfar(QV)*(vis<0?tnear(QV):vis)*fa;LP.push(QX,QY,Math.min(7,Math.max(.8,3.4*K*QS)),a);lx2=QX;ly2=QY;lq=QS;la=a;}
  lflush();
  if(q<1&&la>.03)TT.push(lx2,ly2,lq,la);}
function thDraw(t,ra){var g=cz,i,n,e,q,k,a,r,dx,dy,dz,l;
  for(i=0;i<TN.length;i++){n=TN[i];if(n.off||!n.use)continue;
    if(n.k==='s')tun(n.px,n.py-scrollY,n);else if(n.k==='r'||(n.p&&n.p.hang))tpos(n,ra,t);
    if(n.k==='r'){dx=EX-n.x;dy=EY-n.y;dz=EZ-n.z;l=Math.sqrt(dx*dx+dy*dy+dz*dz)||1;n.fa=sm(.02,.3,(n.nx*dx+n.nz*dz)/l);}
    k=g>=n.t;if(k!==n.on){n.on=k;n.at=k?t:-1;if(n.k==='s')n.el.classList.toggle('on',k);}}
  TT.length=0;
  for(i=0;i<TE.length;i++){e=TE[i];if(!e.on||e.hide||g<=e.t0)continue;q=(g-e.t0)/(e.t1-e.t0);tstrand(e,q>1?1:q);}
  for(i=0;i<TN.length;i++){n=TN[i];if(!n.on||n.off||!n.use||n.k==='s'||n.k==='c')continue;
    if(!tpj(n.x,n.y,n.z))continue;
    a=n.p?n.p.a*n.fa:tfar(QV)*tnear(QV);if(a<.02)continue;
    k=(t-n.at)/.42;k=k>=1?1:k<=0?0:1+2.70158*Math.pow(k-1,3)+1.70158*Math.pow(k-1,2);
    r=Math.max(2.6,(n.k==='h'?8:12)*K*QS)*k;if(r<.3||!room())continue;
    spr(QX,QY,r*1.6,0,Math.min(1,a));}
  for(i=0;i<TT.length&&room();i+=4){r=Math.max(12,44*K*TT[i+2]);spr(TT[i],TT[i+1],r,1,TT[i+3]*(.82+.18*Math.sin(t*11+i)));}}

function render(t,dt,sp){
  var c=camAt(cz),i,p,u,cx,cy,cw,ra=RM?0:t/64%1*6.2831853,sw,sh2,bb;
  PR=c[3]-ly*2.4;YR=c[4]+lx*3.6;cam(c);fade(cz);lmg();
  if(!txF)return;
  if(RM||lastFog<0||t-lastFog>.032){if(RM||lastFog<0||t-lastY>.1||t<lastY){rays(t);lastY=t;}gl.bindFramebuffer(gl.FRAMEBUFFER,fbF);gl.viewport(0,0,fw,fh);gl.disable(gl.BLEND);gl.useProgram(PF.p);u=PF.u;
    gl.uniform2f(u.R,fw,fh);gl.uniform1f(u.T,t);gl.uniform2f(u.M,lx,-ly);gl.uniform2f(u.L,.5,c[6]);gl.uniform1f(u.K,c[5]);gl.uniform3f(u.C,.62,.07,.1);
    gl.bindBuffer(gl.ARRAY_BUFFER,vbT);gl.vertexAttribPointer(0,2,gl.FLOAT,false,0,0);gl.drawArrays(gl.TRIANGLES,0,3);gl.bindFramebuffer(gl.FRAMEBUFFER,null);lastFog=t;}
  sw=W/cv.width;sh2=H/cv.height;bb=MQ.matches?bars:0;
  gl.viewport(0,0,cv.width,cv.height);gl.disable(gl.BLEND);gl.useProgram(PB.p);u=PB.u;gl.uniform4f(u.uS,W,H,sw,sh2);gl.uniform1f(u.uB,bb);
  gl.bindTexture(gl.TEXTURE_2D,txF);gl.bindBuffer(gl.ARRAY_BUFFER,vbT);gl.vertexAttribPointer(0,2,gl.FLOAT,false,0,0);gl.drawArrays(gl.TRIANGLES,0,3);
  gl.enable(gl.BLEND);gl.useProgram(PP.p);u=PP.u;
  gl.uniform3f(u.uC,tcx,tcy,-cz);gl.uniform4f(u.uR,tcY,tsY,tcX,tsX);gl.uniform4f(u.uP,K,P*K,2/W,2/H);gl.uniform1f(u.uY,OY);gl.uniform4f(u.uS,W,H,sw,sh2);gl.uniform1f(u.uB,bb);
  gl.bindBuffer(gl.ARRAY_BUFFER,vbQ);gl.vertexAttribPointer(0,2,gl.FLOAT,false,0,0);
  VIS.length=0;
  for(i=0;i<pls.length;i++){p=pls[i];if(p.a<=.003||(p.k!=='beam'&&p.st!==3))continue;aff(p,t,ra);
    cx=p.O[0]+(p.U[0]*p.w+p.V[0]*p.h)/2;cy=p.O[1]+(p.U[1]*p.w+p.V[1]*p.h)/2;cw=p.O[2]+(p.U[2]*p.w+p.V[2]*p.h)/2;
    if(p.ring&&(EX-cx)*p.nx+(EZ-cw)*p.nz<=0)continue;
    if(!tpj(cx,cy,cw))continue;p.px=Math.max(.05,K*QS/sw);p.dz=p.k==='floor'?-1e9:QZ;VIS.push(p);}
  VIS.sort(function(a,b){return a.dz-b.dz;});
  for(i=0;i<VIS.length;i++)dplane(VIS[i]);
  NV=0;motes(t,dt,sp);if(TH)thDraw(t,ra);
  if(NV){gl.useProgram(PS.p);u=PS.u;gl.uniform2f(u.uW,2/W,2/H);gl.uniform4f(u.uS,W,H,sw,sh2);gl.uniform1f(u.uB,bb);gl.uniform1f(u.uD,1/sw);
    gl.bindTexture(gl.TEXTURE_2D,txA);gl.bindBuffer(gl.ARRAY_BUFFER,vbD);gl.bufferData(gl.ARRAY_BUFFER,DB.subarray(0,NV*12),gl.STREAM_DRAW);
    gl.vertexAttribPointer(0,2,gl.FLOAT,false,48,0);gl.vertexAttribPointer(1,2,gl.FLOAT,false,48,8);gl.vertexAttribPointer(2,4,gl.FLOAT,false,48,16);gl.vertexAttribPointer(3,4,gl.FLOAT,false,48,32);
    gl.enableVertexAttribArray(1);gl.enableVertexAttribArray(2);gl.enableVertexAttribArray(3);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,ibD);gl.drawElements(gl.TRIANGLES,NV/4*6,gl.UNSIGNED_SHORT,0);
    gl.disableVertexAttribArray(1);gl.disableVertexAttribArray(2);gl.disableVertexAttribArray(3);}}

function dims(){
  W=world.clientWidth||innerWidth;H=world.clientHeight||innerHeight;SMALL=W<700;
  K=SMALL?cl(H/900*.72,.5,.9):cl(Math.max(W/1440,H/900*.56),.42,1.25);OY=SMALL?.36:.5;XS=SMALL?.55:1;FAR=SMALL?4200:4800;
  size();place();seed();}

if(!setup())return;
world.insertBefore(cv,world.firstChild);world.classList.add('gl');
build();
var rmT=function(){if(dead)return;render(0,0,0);for(var i=0;i<pls.length;i++){var p=pls[i];if(p.k!=='beam'&&p.a>0&&!p.off&&p.st<3){requestAnimationFrame(rmT);return;}}};
cv.addEventListener('webglcontextlost',function(e){e.preventDefault();dead=true;world.classList.add('nogl');},false);
cv.addEventListener('webglcontextrestored',function(){gen++;for(var i=0;i<pls.length;i++){var p=pls[i];p.tex=null;p.im=null;if(p.st!==4)p.st=0;}
  if(setup()){dead=false;world.classList.remove('nogl');fogBuf();dirty=true;if(RM)requestAnimationFrame(rmT);}},false);
if(RM){world.classList.add('still');dims();requestAnimationFrame(rmT);addEventListener('resize',function(){dims();requestAnimationFrame(rmT);});return;}

var last=0,lastR=0,czR=0,moving=false,wasMv=false,idle=0,ptr=false,gy=null,rq=0,fs=0,fn=0,fa=0,fp=0,fl=false;
function tick(ts){requestAnimationFrame(tick);
  var t=ts/1000,dt=last?cl(t-last,0,.1):.016,pz=cz,tz=zAt(scrollY),kl,bt,gap,a,i;last=t;
  if(TOUCH)cz=tz;else{cz+=(tz-cz)*Math.min(1,dt*4.5);if(Math.abs(tz-cz)<.05)cz=tz;}
  if(!SMALL&&!ptr&&!gy){tlx=.3*Math.sin(t*.21);tly=.16*Math.sin(t*.17+1.3);}
  kl=Math.min(1,dt*2.4);lx+=(tlx-lx)*kl;ly+=(tly-ly)*kl;
  bt=de.classList.contains('v6-away')?1:0;if(bars!==bt){bars=bt>bars?Math.min(1,bars+dt/.4):Math.max(0,bars-dt/.4);dirty=true;}
  if(Math.abs(cz-pz)>.3){moving=true;idle=0;}else if(moving){idle+=dt;if(idle>.6)moving=false;}
  gap=ts-lastR;if(gap<(moving||dirty?15:32))return;
  if(HIT||t<3){fs=fn=0;HIT=false;}else if(moving&&wasMv&&gap<100){fs+=gap;fn++;if(fs>1500){a=fs/fn;fs=fn=0;if(fp){if(a>fa*.9){DM=fp;size();fl=true;HIT=true;}fp=0;}else if(!fl&&a>22&&D>1){fa=a;fp=DM;DM=Math.max(1,D*.8);size();HIT=true;}}}
  wasMv=moving;dirty=false;
  for(i=0;i<TK.length;i++)TK[i](ts);
  if(!dead)render(t,lastR?cl(gap/1000,0,.1):.016,Math.abs(cz-czR));lastR=ts;czR=cz;}
function relayout(){rq=0;var w=world.clientWidth||innerWidth,h=world.clientHeight||innerHeight;if(w===W&&h===H)return;dims();stations();}

thInit();dims();stations();cz=zAt(scrollY);
addEventListener('resize',function(){if(!rq)rq=requestAnimationFrame(relayout);});
if(window.ResizeObserver)new ResizeObserver(function(){stations();}).observe(document.body);
addEventListener('pointermove',function(e){if(e.pointerType!=='mouse')return;ptr=true;tlx=cl(e.clientX/W*2-1,-1,1);tly=cl(e.clientY/H*2-1,-1,1);},{passive:true});
de.addEventListener('mouseleave',function(){tlx=0;tly=0;});
addEventListener('deviceorientation',function(e){if(SMALL||e.gamma==null||e.beta==null)return;if(!gy)gy={g:e.gamma,b:e.beta};gy.g+=(e.gamma-gy.g)*.01;gy.b+=(e.beta-gy.b)*.01;tlx=cl((e.gamma-gy.g)/22,-1,1);tly=cl((e.beta-gy.b)/22,-1,1);},{passive:true});
window.v6w={on:function(f){TK.push(f);}};
requestAnimationFrame(tick);
})();
