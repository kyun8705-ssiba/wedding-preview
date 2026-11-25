/* 모바일 청첩장 공통 스크립트 (시안 A·B·C 공용)
   - 갤러리 사진은 아래 PHOTOS 배열만 바꾸면 됩니다.
     예) {src:'gallery/01.jpg'}  (pos·zoom은 썸네일 자르기 위치, 생략 가능)
   - 지금은 사진이 1장뿐이라 같은 사진을 다른 위치로 잘라 자리만 채워 두었습니다. */
const PHOTOS = [
  {src:'photo.jpg', pos:'50% 50%'},
  {src:'photo.jpg', pos:'68% 61%', zoom:3},
  {src:'photo.jpg', pos:'55% 10%', zoom:2.2},
  {src:'photo.jpg', pos:'50% 44%', zoom:2.4},
  {src:'photo.jpg', pos:'30% 50%', zoom:1.6},
  {src:'photo.jpg', pos:'72% 52%', zoom:1.8},
  {src:'photo.jpg', pos:'50% 70%', zoom:1.5},
  {src:'photo.jpg', pos:'90% 18%', zoom:2.6},
  {src:'photo.jpg', pos:'50% 30%', zoom:1.3},
  {src:'photo.jpg', pos:'40% 85%', zoom:2},
  {src:'photo.jpg', pos:'62% 40%', zoom:2.8},
  {src:'photo.jpg', pos:'50% 50%', zoom:1.15},
  {src:'photo.jpg', pos:'20% 30%', zoom:2.2},
  {src:'photo.jpg', pos:'58% 58%', zoom:2},
  {src:'photo.jpg', pos:'50% 0%',  zoom:1.4},
];
const WEDDING = new Date('2027-04-24T13:10:00+09:00');
const $ = (s, el=document) => el.querySelector(s);
const $$ = (s, el=document) => [...el.querySelectorAll(s)];

/* 달력 */
(function(){
  const el = $('#cal'); if(!el) return;
  const head = (el.dataset.head||'일,월,화,수,목,금,토').split(',');
  let h = head.map((d,i)=>`<div class="h ${i==0?'sun':i==6?'sat':''}">${d}</div>`).join('');
  const first = new Date(2027,3,1).getDay();
  for(let i=0;i<first;i++) h += '<div></div>';
  for(let d=1; d<=30; d++){
    const w = (first+d-1)%7;
    h += `<div class="${w==0?'sun':w==6?'sat':''} ${d==24?'on':''}">${d}</div>`;
  }
  el.innerHTML = h;
})();

/* 카운트다운 */
(function(){
  const box = $('#dday'); if(!box) return;
  const labels = (box.dataset.labels||'DAYS,HOUR,MIN,SEC').split(',');
  box.innerHTML = labels.map(l=>`<div><b>00</b><span>${l}</span></div>`).join('');
  const bs = $$('b', box);
  function tick(){
    let s = Math.max(0,(WEDDING-new Date())/1000);
    const v = [Math.floor(s/86400), Math.floor(s%86400/3600), Math.floor(s%3600/60), Math.floor(s%60)];
    v.forEach((n,i)=>{ const t=String(n).padStart(2,'0'); if(bs[i].textContent!==t){ bs[i].textContent=t; bs[i].classList.remove('flip'); void bs[i].offsetWidth; bs[i].classList.add('flip'); }});
    $$('.dnum').forEach(e=>e.textContent = v[0]);
  }
  tick(); setInterval(tick,1000);
})();

/* 글자 하나씩 나타나기 */
$$('.split').forEach(el=>{
  const base = +(el.dataset.delay||0);
  el.innerHTML = [...el.textContent].map((c,i)=>`<span style="transition-delay:${base+i*0.06}s">${c===' '?'&nbsp;':c}</span>`).join('');
});

/* 스크롤 등장 */
const io = new IntersectionObserver(es=>es.forEach(e=>{
  if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }
}),{threshold:.12, rootMargin:'0px 0px -6% 0px'});
function watch(root=document){ $$('[data-r], .split, .stagger', root).forEach(el=>{
  if(el.classList.contains('stagger')) [...el.children].forEach((c,i)=>c.style.transitionDelay=(i*0.08)+'s');
  io.observe(el);
}); }

/* 패럴랙스 */
const px = $$('[data-px]');
addEventListener('scroll',()=>{
  const y = scrollY;
  px.forEach(el=>{ el.style.transform = `translate3d(0,${y*(+el.dataset.px)}px,0) scale(${el.dataset.scale||1})`; });
  const bar = $('#progress'); if(bar) bar.style.transform = `scaleX(${y/(document.body.scrollHeight-innerHeight)})`;
},{passive:true});

/* 인트로 */
(function(){
  const it = $('#intro'); if(!it) { watch(); return; }
  document.body.style.overflow='hidden';
  const close = ()=>{ if(it.classList.contains('out')) return; it.classList.add('out'); document.body.style.overflow=''; setTimeout(()=>{it.remove(); watch(); document.body.classList.add('ready'); setTimeout(()=>document.body.classList.add('settled'),2400);},1100); };
  it.addEventListener('click', close);
  setTimeout(close, +(it.dataset.time||3200));
})();

/* 꽃잎·빛가루 */
(function(){
  const type = document.body.dataset.petal; if(!type) return;
  const c = document.createElement('canvas'); c.id='petals'; document.body.appendChild(c);
  const x = c.getContext('2d'); let W,H; const dpr = Math.min(2,devicePixelRatio||1);
  const size=()=>{ const r=c.getBoundingClientRect(); W=r.width; H=r.height; c.width=W*dpr; c.height=H*dpr; x.setTransform(dpr,0,0,dpr,0,0); };
  size(); addEventListener('resize',size);
  const colors = {rose:['#B3202C','#8E1622','#C8394A'], gold:['#F6D9A8','#E9BC78','#FFF1D6'], peach:['#F4B48C','#F7CDB0','#FFFFFF','#E89A6E']}[type];
  const N = type==='gold'?28:18;
  const P = Array.from({length:N},()=>reset({},true));
  function reset(p,init){ p.x=Math.random()*W; p.y=init?Math.random()*H:-20; p.s=type==='gold'?1+Math.random()*2.2:5+Math.random()*6; p.vy=.35+Math.random()*.7; p.vx=-.3+Math.random()*.6; p.r=Math.random()*6.28; p.vr=-.02+Math.random()*.04; p.ph=Math.random()*6.28; p.c=colors[Math.floor(Math.random()*colors.length)]; p.a=.45+Math.random()*.45; return p; }
  (function loop(t){
    x.clearRect(0,0,W,H);
    P.forEach(p=>{
      p.y+=p.vy; p.x+=p.vx+Math.sin(t/1200+p.ph)*.4; p.r+=p.vr;
      if(p.y>H+20) reset(p);
      x.save(); x.translate(p.x,p.y); x.rotate(p.r); x.globalAlpha=p.a*(type==='gold'?(.6+.4*Math.sin(t/300+p.ph)):1); x.fillStyle=p.c;
      if(type==='gold'){ x.shadowColor=p.c; x.shadowBlur=8; x.beginPath(); x.arc(0,0,p.s,0,6.28); x.fill(); }
      else { x.beginPath(); x.ellipse(0,0,p.s,p.s*.62,0,0,6.28); x.fill(); x.globalAlpha*=.35; x.fillStyle='#fff'; x.beginPath(); x.ellipse(-p.s*.25,-p.s*.15,p.s*.35,p.s*.18,0,0,6.28); x.fill(); }
      x.restore();
    });
    requestAnimationFrame(loop);
  })(0);
})();

/* 배경음악 버튼 (bgm.mp3 파일을 같은 폴더에 넣으면 재생) */
(function(){
  const b = $('#bgm-btn'); if(!b) return;
  let a;
  b.addEventListener('click',()=>{ if(!a){ a = new Audio('bgm.mp3'); a.loop = true; } if(a.paused){ a.play().catch(()=>toast('bgm.mp3 파일을 넣으면 음악이 재생됩니다')); b.classList.add('on'); } else { a.pause(); b.classList.remove('on'); } });
})();

/* 갤러리 */
(function(){
  const g = $('#gallery'); if(!g) return;
  const show = +(g.dataset.show||9);
  const thumb = (p,i)=>`<button class="g-item ${i>=show?'more':''}" data-i="${i}" style="--bg:url('${p.src}');--pos:${p.pos||'50% 50%'};--zoom:${p.zoom||1}"><i></i></button>`;
  g.innerHTML = PHOTOS.map(thumb).join('');
  const moreBtn = $('#g-more');
  if(moreBtn){
    if(PHOTOS.length<=show) moreBtn.remove();
    moreBtn.addEventListener('click',()=>{ const open = g.classList.toggle('all'); moreBtn.querySelector('span').textContent = open?'접기':'더보기'; if(!open) g.scrollIntoView({behavior:'smooth',block:'start'}); });
  }
  const cnt = $('#g-count'); if(cnt) cnt.textContent = PHOTOS.length;

  /* 전체화면 보기 */
  const lb = document.createElement('div'); lb.id='lightbox';
  lb.innerHTML = `<div class="lb-top"><span class="lb-n"></span><button class="lb-x" aria-label="닫기">✕</button></div>
    <div class="lb-track"></div><button class="lb-prev" aria-label="이전">‹</button><button class="lb-next" aria-label="다음">›</button>
    <div class="lb-dots"></div>`;
  document.body.appendChild(lb);
  const track = $('.lb-track',lb);
  track.innerHTML = PHOTOS.map(p=>`<div class="lb-slide"><img loading="lazy" src="${p.src}" alt=""></div>`).join('');
  let cur=0;
  const go = i=>{ cur=(i+PHOTOS.length)%PHOTOS.length; track.style.transform=`translateX(${-cur*100}%)`; $('.lb-n',lb).textContent=`${cur+1} / ${PHOTOS.length}`; };
  $$('.g-item',g).forEach(b=>b.addEventListener('click',()=>{ track.style.transition='none'; go(+b.dataset.i); requestAnimationFrame(()=>track.style.transition=''); lb.classList.add('open'); document.body.style.overflow='hidden'; }));
  const close=()=>{ lb.classList.remove('open'); document.body.style.overflow=''; };
  $('.lb-x',lb).onclick=close; $('.lb-prev',lb).onclick=()=>go(cur-1); $('.lb-next',lb).onclick=()=>go(cur+1);
  addEventListener('keydown',e=>{ if(!lb.classList.contains('open'))return; if(e.key==='Escape')close(); if(e.key==='ArrowLeft')go(cur-1); if(e.key==='ArrowRight')go(cur+1); });
  let sx=null; track.addEventListener('touchstart',e=>sx=e.touches[0].clientX,{passive:true});
  track.addEventListener('touchend',e=>{ if(sx===null)return; const d=e.changedTouches[0].clientX-sx; if(Math.abs(d)>40) go(cur+(d<0?1:-1)); sx=null; });
})();

/* 팝업(연락하기·참석의사) */
$$('[data-open]').forEach(b=>b.addEventListener('click',()=>{ const m=$('#'+b.dataset.open); m.classList.add('open'); }));
$$('.modal').forEach(m=>m.addEventListener('click',e=>{ if(e.target===m||e.target.closest('.m-x')) m.classList.remove('open'); }));
$$('form.rsvp').forEach(f=>f.addEventListener('submit',e=>{ e.preventDefault(); f.closest('.modal').classList.remove('open'); toast('참석 의사가 전달되었습니다 (시안: 실제 저장 안 됨)'); }));

/* 아코디언 */
$$('.acc-h').forEach(h=>h.addEventListener('click',()=>h.parentElement.classList.toggle('open')));

/* 복사 + 토스트 */
function toast(msg){ let t=$('#toast'); if(!t){ t=document.createElement('div'); t.id='toast'; document.body.appendChild(t);} t.textContent=msg; t.classList.add('show'); clearTimeout(t._h); t._h=setTimeout(()=>t.classList.remove('show'),2000); }
function copy(text,msg){ (navigator.clipboard?navigator.clipboard.writeText(text):Promise.reject()).catch(()=>{}); toast(msg||'복사되었습니다'); }
$$('[data-copy]').forEach(b=>b.addEventListener('click',()=>copy(b.dataset.copy||location.href.split('#')[0], b.dataset.msg)));
