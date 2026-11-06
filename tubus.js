(function(){
var CODE='ОРДЕН';
var RINGS=['ТКАОМСВПЛШ','АЕРИОУЛНКТ','ЙБГДЗЛМРСЖ','НАИОЕУЯЮЫЭ','АКЛМРНТЦХЧ'];
var HINTS=['Слово из пяти букв. Оно есть в первом абзаце страницы.','О нём не говорят вслух.','Начинается на «О», заканчивается на «Н».'];
var LAYOUT='QЙWЦEУRКTЕYНUГIШOЩPЗAФSЫDВFАGПHРJОKЛLДZЯXЧCСVМBИNТMЬ';
function norm(i){return ((i%10)+10)%10;}
function letter(r,p){return RINGS[r][norm(p)];}
function word(pos){return pos.map(function(p,r){return letter(r,p);}).join('');}
function solved(pos){return word(pos)===CODE;}
function stepTo(r,p,ch){var k=RINGS[r].indexOf(ch);if(k<0)return p;var d=norm(k-norm(p));return p+(d>5?d-10:d);}
function keyLetter(key,code){var ch=(key||'').toUpperCase();if(ch==='Ё')ch='Е';if(/^[А-Я]$/.test(ch))return ch;
  var m=/^Key([A-Z])$/.exec(code||'');if(m){var i=LAYOUT.indexOf(m[1]);return i>=0?LAYOUT[i+1]:'';}
  return {Semicolon:'Ж',Quote:'Э',Comma:'Б',Period:'Ю',BracketLeft:'Х',BracketRight:'Ъ'}[code]||'';}
if(typeof module!=='undefined'&&module.exports){module.exports={CODE:CODE,RINGS:RINGS,HINTS:HINTS,norm:norm,letter:letter,word:word,solved:solved,stepTo:stepTo,keyLetter:keyLetter};return;}

var root=document.getElementById('tubus');if(!root)return;
var RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
var st={p:[0,0,0,0,0],f:[],h:0,s:false,snd:false};

function $(id){return document.getElementById(id);}
function emit(n,d){document.dispatchEvent(new CustomEvent('tubus:'+n,{detail:d}));}

var cx=$('cryptex'),box=$('tbRings'),paper=$('tbPaper'),live=$('tbStatus'),foundBox=$('tbFound'),hintP=$('tbHint'),hintB=$('tbHintBtn'),sndB=$('tbSound'),lampB=$('tbLamp');
function say(t){live.textContent='';setTimeout(function(){live.textContent=t;},40);}

var ac=null,nb=null;
function audio(){if(!st.snd)return null;var A=window.AudioContext||window.webkitAudioContext;if(!A)return null;if(!ac)ac=new A();if(ac.state==='suspended')ac.resume();return ac;}
function noise(a){if(nb)return nb;nb=a.createBuffer(1,Math.round(a.sampleRate*.03),a.sampleRate);var d=nb.getChannelData(0);for(var i=0;i<d.length;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/d.length,4);return nb;}
function tick(){var a=audio();if(!a)return;var s=a.createBufferSource(),f=a.createBiquadFilter(),g=a.createGain();s.buffer=noise(a);f.type='bandpass';f.frequency.value=2200+Math.random()*900;f.Q.value=2.5;g.gain.value=.6;s.connect(f);f.connect(g);g.connect(a.destination);s.start();}
function chime(){var a=audio();if(!a)return;var t=a.currentTime;
  var o=a.createOscillator(),g=a.createGain();o.frequency.setValueAtTime(140,t);o.frequency.exponentialRampToValueAtTime(55,t+.25);g.gain.setValueAtTime(.35,t);g.gain.exponentialRampToValueAtTime(.001,t+.3);o.connect(g);g.connect(a.destination);o.start(t);o.stop(t+.32);
  [392,523.25,659.25,783.99].forEach(function(fr,i){var s=t+.35+i*.11,o=a.createOscillator(),g=a.createGain();o.type='triangle';o.frequency.value=fr;g.gain.setValueAtTime(0,s);g.gain.linearRampToValueAtTime(.09,s+.015);g.gain.exponentialRampToValueAtTime(.0001,s+1.4);o.connect(g);g.connect(a.destination);o.start(s);o.stop(s+1.5);});}

var rings=[];
RINGS.forEach(function(set,r){
  var el=document.createElement('div');el.className='ring';el.tabIndex=0;el.setAttribute('role','spinbutton');el.setAttribute('aria-label','Кольцо '+(r+1));el.setAttribute('aria-valuemin','1');el.setAttribute('aria-valuemax','10');
  var cyl=document.createElement('div');cyl.className='cyl';
  set.split('').forEach(function(ch,i){var f=document.createElement('span');f.className='face';f.textContent=ch;f.style.transform='rotateX('+(-i*36)+'deg) translateZ(var(--rz))';cyl.appendChild(f);});
  var sh=document.createElement('span');sh.className='tb-shade';
  el.appendChild(cyl);el.appendChild(sh);box.appendChild(el);
  rings.push({el:el,cyl:cyl,faces:[].slice.call(cyl.children)});});

function paint(r,off,anim){var R=rings[r],p=st.p[r]+(off||0),k=norm(Math.round(p));
  R.cyl.style.transition=anim&&!RM?'transform .45s cubic-bezier(.2,1.25,.4,1)':'none';
  R.cyl.style.transform='rotateX('+(p*36)+'deg)';
  R.faces.forEach(function(f,i){f.classList.toggle('on',i===k);});
  R.el.setAttribute('aria-valuenow',k+1);R.el.setAttribute('aria-valuetext',RINGS[r][k]);}
function check(){if(!st.s&&solved(st.p))win();}
function step(r,d){if(st.s)return;st.p[r]+=d;paint(r,0,true);tick();check();}

rings.forEach(function(R,r){var el=R.el,id=null,y0=0,off=0,moved=0,ly=0,lt=0,v=0,fh=1,acc=0;
  el.addEventListener('pointerdown',function(e){if(st.s||e.button>0)return;id=e.pointerId;el.setPointerCapture(id);y0=ly=e.clientY;lt=e.timeStamp;off=0;moved=0;v=0;fh=R.faces[0].offsetHeight||60;el.classList.add('drag');});
  el.addEventListener('pointermove',function(e){if(e.pointerId!==id)return;var dy=e.clientY-y0,no=-dy/fh;moved=Math.max(moved,Math.abs(dy));
    if(Math.round(st.p[r]+no)!==Math.round(st.p[r]+off))tick();off=no;
    var dt=e.timeStamp-lt;if(dt>0)v=-(e.clientY-ly)/fh/dt*1000;ly=e.clientY;lt=e.timeStamp;paint(r,off,false);});
  function up(e){if(e.pointerId!==id)return;id=null;el.classList.remove('drag');
    if(moved<6){if(e.type==='pointercancel'){paint(r,0,true);return;}var b=el.getBoundingClientRect();step(r,e.clientY<b.top+b.height/2?-1:1);return;}
    var fling=e.timeStamp-lt<90?Math.max(-4,Math.min(4,Math.round(v*.15))):0;
    st.p[r]=Math.round(st.p[r]+off)+fling;off=0;paint(r,0,true);if(fling)tick();check();}
  el.addEventListener('pointerup',up);el.addEventListener('pointercancel',up);
  el.addEventListener('wheel',function(e){if(st.s)return;e.preventDefault();acc+=e.deltaY;if(Math.abs(acc)>=40){step(r,acc>0?1:-1);acc=0;}},{passive:false});
  el.addEventListener('keydown',function(e){var k=e.key;if(e.ctrlKey||e.metaKey||e.altKey)return;
    if(k==='ArrowUp'||k==='ArrowDown'){e.preventDefault();step(r,k==='ArrowUp'?1:-1);return;}
    if(k==='ArrowRight'||k==='ArrowLeft'){var n=r+(k==='ArrowRight'?1:-1);if(n>=0&&n<5){e.preventDefault();rings[n].el.focus();}return;}
    var ch=keyLetter(k,e.code);if(!ch||st.s)return;e.preventDefault();
    if(RINGS[r].indexOf(ch)<0){el.classList.remove('nope');void el.offsetWidth;el.classList.add('nope');say('На кольце '+(r+1)+' нет буквы '+ch);return;}
    st.p[r]=stepTo(r,st.p[r],ch);paint(r,0,true);tick();check();if(!st.s&&r<4)rings[r+1].el.focus();});});

function win(){st.s=true;root.classList.add('solved');
  var lag=!RM;
  rings.forEach(function(R,i){setTimeout(function(){R.el.classList.add('lit');},lag?i*110:0);});
  setTimeout(function(){cx.classList.add('open');paper.hidden=false;
    requestAnimationFrame(function(){requestAnimationFrame(function(){paper.classList.add('open');});});
    chime();},lag?650:0);
  say('Тубус открыт. Шифр разгадан.');emit('solved');}
$('tbReset').addEventListener('click',function(){st.s=false;st.p=[0,0,0,0,0];root.classList.remove('solved');cx.classList.remove('open');paper.classList.remove('open');paper.hidden=true;
  rings.forEach(function(R,r){R.el.classList.remove('lit');paint(r,0,true);});rings[0].el.focus();say('Тубус закрыт. Кольца снова на месте.');});

function drawHint(){var n=st.h;hintP.innerHTML=HINTS.slice(0,n).map(function(t,i){return '<span'+(i===n-1?' class="new"':'')+'>'+t+'</span>';}).join(' ');
  hintB.disabled=n>=HINTS.length;hintB.textContent=n>=HINTS.length?'Подсказок больше нет':'Подсказка '+(n+1)+' из '+HINTS.length;}
hintB.addEventListener('click',function(){if(st.h<HINTS.length){st.h++;drawHint();}});
function drawSound(){sndB.setAttribute('aria-pressed',st.snd);}
sndB.addEventListener('click',function(){st.snd=!st.snd;drawSound();tick();});

var marks=[].slice.call(document.querySelectorAll('.uv-mark')).map(function(m){var r=+m.dataset.ring;m.setAttribute('aria-hidden','true');m.innerHTML='<b>'+CODE[r-1]+'</b><small>'+r+'</small>';return {el:m,r:r,t:0};});
var slots=[];for(var i=1;i<=5;i++){var li=document.createElement('li');foundBox.appendChild(li);slots.push(li);}
function drawFound(){slots.forEach(function(li,i){var got=st.f.indexOf(i+1)>=0;li.className=got?'got':'';li.innerHTML='<small>'+(i+1)+'</small><b>'+(got?CODE[i]:'')+'</b>';li.setAttribute('aria-label','Кольцо '+(i+1)+': '+(got?'буква '+CODE[i]:'буква пока не найдена'));});
  var n=st.f.length;tog.querySelector('.uv-n').textContent=n+'/5';tog.setAttribute('aria-label','Ультрафиолетовый фонарик, найдено '+n+' из 5');}

var html=document.documentElement,lampOn=false,hoverDev=matchMedia('(hover: hover)').matches,lx=innerWidth/2,ly=innerHeight*.45,raf=0;
var light=document.createElement('div');light.className='uv-light';light.setAttribute('aria-hidden','true');document.body.appendChild(light);
var tog=document.createElement('button');tog.type='button';tog.className='uv-toggle';tog.setAttribute('aria-pressed','false');
tog.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8.5 2.5h7v4.2l-2 3.3v10.5a1.5 1.5 0 0 1-3 0V10l-2-3.3z"/><path d="M8.5 5.5h7M12 13v2"/></svg><span class="uv-n">0/5</span>';
document.body.appendChild(tog);
function found(m){st.f.push(m.r);st.f.sort();drawFound();m.el.classList.add('got');
  say('Найдена буква '+CODE[m.r-1]+' для кольца '+m.r+'. Всего '+st.f.length+' из 5.');emit('found',{ring:m.r,count:st.f.length});}
function upd(now){raf=0;light.style.setProperty('--lx',lx+'px');light.style.setProperty('--ly',ly+'px');var again=false;
  marks.forEach(function(m){if(!lampOn){m.el.style.opacity='';m.t=0;return;}
    var b=m.el.getBoundingClientRect(),d=Math.hypot(b.left+b.width/2-lx,b.top+b.height/2-ly),v=Math.max(0,Math.min(1,(180-d)/110));
    m.el.style.opacity=v.toFixed(3);
    if(v>.7&&st.f.indexOf(m.r)<0){if(!m.t)m.t=now;if(now-m.t>350)found(m);else again=true;}else m.t=0;});
  if(again)sched();}
function sched(){if(!raf)raf=requestAnimationFrame(upd);}
function setLamp(on){lampOn=on;html.classList.toggle('uv-on',on);tog.setAttribute('aria-pressed',on);lampB.setAttribute('aria-pressed',on);
  lampB.lastChild.textContent=on?'Выключить фонарик':'Включить фонарик';
  if(on&&!hoverDev){lx=innerWidth/2;ly=innerHeight*.45;}showTog();sched();if(on)emit('lamp');}
tog.addEventListener('click',function(){setLamp(!lampOn);});
lampB.addEventListener('click',function(){setLamp(!lampOn);});
addEventListener('keydown',function(e){if(e.key==='Escape'&&lampOn)setLamp(false);});
addEventListener('pointermove',function(e){if(e.pointerType==='touch')return;lx=e.clientX;ly=e.clientY;if(lampOn)sched();},{passive:true});
addEventListener('pointerdown',function(e){if(!lampOn||e.pointerType!=='touch')return;lx=e.clientX;ly=e.clientY;sched();},{passive:true});
function showTog(){tog.classList.toggle('show',lampOn||scrollY>innerHeight*.6);}
addEventListener('scroll',function(){showTog();if(lampOn)sched();},{passive:true});
addEventListener('resize',function(){if(lampOn)sched();});

rings.forEach(function(R,r){paint(r,0,false);});drawHint();drawSound();drawFound();showTog();
})();
