const cards=[...document.querySelectorAll('.card')];
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
document.getElementById('search').addEventListener('input',e=>filter(e.target.value));
document.querySelectorAll('.chip').forEach(b=>{
 b.addEventListener('click',()=>{
   const v=b.dataset.filter;
   document.getElementById('search').value=v==='all'?'':v;
   filter(v==='all'?'':v);
   document.getElementById('algorithms').scrollIntoView();
 });
});
document.querySelectorAll('.choice').forEach(c=>{
 c.addEventListener('click',()=>{
   const target=document.getElementById(c.dataset.jump);
   target.classList.add('open');
   target.scrollIntoView({behavior:'smooth',block:'center'});
 });
});
