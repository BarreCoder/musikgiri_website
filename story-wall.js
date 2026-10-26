(()=>{
  'use strict';
  const rail=document.getElementById('story-carousel');
  if(!rail)return;
  const slides=Array.from(rail.querySelectorAll('.story-panel'));
  const dots=Array.from(document.querySelectorAll('.story-dots [data-story]'));
  const current=document.getElementById('story-current');
  const progress=document.getElementById('story-timer-progress');
  const play=document.getElementById('story-play');
  const wall=document.getElementById('story-wall');
  const duration=10000; // 10 seconds per creation; change to taste
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
  let index=0,elapsed=0,lastTime=0,frame=0,userPaused=false,hovered=false,focused=false,inView=false,scrollDebounce=0;
  function active(){return !userPaused&&!hovered&&!focused&&inView&&!document.hidden&&!reduced.matches}
  function render(){
    current.textContent=String(index+1).padStart(2,'0');
    dots.forEach((d,i)=>{if(i===index)d.setAttribute('aria-current','true');else d.removeAttribute('aria-current')});
    progress.style.width=(elapsed/duration*100)+'%';
    const running=!userPaused;
    play.setAttribute('aria-pressed',String(running));
    play.setAttribute('aria-label',running?'Pause automatic story rotation':'Resume automatic story rotation');
    play.innerHTML=running?'Pause <span aria-hidden="true">Ⅱ</span>':'Play <span aria-hidden="true">▶</span>';
  }
  function go(to,manual=false){
    index=(to+slides.length)%slides.length;
    elapsed=0;
    rail.scrollTo({left:slides[index].offsetLeft-slides[0].offsetLeft,behavior:reduced.matches?'instant':'smooth'});
    if(manual){lastTime=0;}
    render();
  }
  document.getElementById('story-prev').addEventListener('click',()=>go(index-1,true));
  document.getElementById('story-next').addEventListener('click',()=>go(index+1,true));
  dots.forEach((dot,i)=>dot.addEventListener('click',()=>go(i,true)));
  play.addEventListener('click',()=>{userPaused=!userPaused;lastTime=0;render()});
  rail.addEventListener('keydown',e=>{if(e.key==='ArrowRight'){e.preventDefault();go(index+1,true)}else if(e.key==='ArrowLeft'){e.preventDefault();go(index-1,true)}});
  rail.addEventListener('scroll',()=>{
    clearTimeout(scrollDebounce);
    scrollDebounce=setTimeout(()=>{
      const nearest=Math.round(rail.scrollLeft/Math.max(1,rail.clientWidth));
      if(nearest!==index){index=Math.max(0,Math.min(slides.length-1,nearest));elapsed=0;render()}
    },120);
  },{passive:true});
  wall.addEventListener('mouseenter',()=>{hovered=true;lastTime=0});
  wall.addEventListener('mouseleave',()=>{hovered=false;lastTime=0});
  wall.addEventListener('focusin',()=>{focused=true;lastTime=0});
  wall.addEventListener('focusout',()=>{focused=wall.contains(document.activeElement);lastTime=0});
  if('IntersectionObserver' in window){const io=new IntersectionObserver(entries=>{inView=entries[0].intersectionRatio>=.35;lastTime=0},{threshold:[0,.35,.7]});io.observe(wall)}else inView=true;
  document.addEventListener('visibilitychange',()=>{lastTime=0});
  function tick(time){
    if(active()){
      if(lastTime)elapsed+=Math.min(100,time-lastTime);
      if(elapsed>=duration){go(index+1);elapsed=0}
      progress.style.width=Math.min(100,elapsed/duration*100)+'%';
      lastTime=time;
    }else lastTime=0;
    frame=requestAnimationFrame(tick);
  }
  render();frame=requestAnimationFrame(tick);
})();
