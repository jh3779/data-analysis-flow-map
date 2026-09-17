const cards=[...document.querySelectorAll('.card')];
const chips=[...document.querySelectorAll('.chip')];
const searchInput=document.getElementById('search');

document.querySelectorAll('.card-head').forEach(h=>{
 h.addEventListener('click',()=>h.parentElement.classList.toggle('open'));
});

function filter(q){
 q=q.trim().toLowerCase();
 cards.forEach(c=>{
   const text=(c.innerText+' '+c.dataset.keywords).toLowerCase();
   c.classList.toggle('hidden', q && q!=='all' && !text.includes(q));
 });
}

searchInput.addEventListener('input',e=>{
 filter(e.target.value);
 chips.forEach(b=>b.classList.toggle('active', b.dataset.filter==='all' && e.target.value===''));
});

chips.forEach(b=>{
 b.addEventListener('click',()=>{
   const v=b.dataset.filter;
   searchInput.value=v==='all'?'':v;
   filter(v==='all'?'':v);
   chips.forEach(c=>c.classList.toggle('active', c===b));
   document.getElementById('algorithms').scrollIntoView();
 });
});

function jumpTo(el){
 const target=document.getElementById(el.dataset.jump);
 target.classList.add('open');
 target.scrollIntoView({behavior:'smooth',block:'center'});
}
document.querySelectorAll('.choice').forEach(c=>{
 c.addEventListener('click',()=>jumpTo(c));
 c.addEventListener('keydown',e=>{
   if(e.key==='Enter'||e.key===' '){
     e.preventDefault();
     jumpTo(c);
   }
 });
});

const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if(!reduceMotion && 'IntersectionObserver' in window){
 const revealTargets=document.querySelectorAll('.panel, .card, .choice, .callout');
 revealTargets.forEach(el=>el.classList.add('reveal'));
 const io=new IntersectionObserver(entries=>{
   entries.forEach(entry=>{
     if(entry.isIntersecting){
       entry.target.classList.add('in-view');
       io.unobserve(entry.target);
     }
   });
 },{threshold:.12,rootMargin:'0px 0px -40px 0px'});
 revealTargets.forEach(el=>io.observe(el));
}
