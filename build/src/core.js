function store(k,v){try{ if(v===undefined) return localStorage.getItem(k); localStorage.setItem(k,v);}catch(e){return null}}
const esc = s => String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
