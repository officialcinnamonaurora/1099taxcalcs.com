(()=>{
  const input=document.getElementById('guideFilter');
  if(!input)return;
  const items=[...document.querySelectorAll('.filter-item')];
  const status=document.getElementById('filterStatus');
  const sections=[...document.querySelectorAll('.section')];
  const update=()=>{
    const query=input.value.trim().toLowerCase();
    let visible=0;
    for(const item of items){
      const match=!query||item.dataset.search.includes(query);
      item.hidden=!match;
      if(match)visible+=1;
    }
    for(const section of sections){const cards=[...section.querySelectorAll('.filter-item')];if(cards.length)section.hidden=cards.every(card=>card.hidden)}
    status.textContent=query?`${visible} result${visible===1?'':'s'} shown.`:`${items.length} items available.`;
  };
  input.addEventListener('input',update);
  update();
})();
