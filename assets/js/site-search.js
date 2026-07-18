(()=>{
  const records=Array.isArray(window.SITE_SEARCH_INDEX)?window.SITE_SEARCH_INDEX:[];
  const core=window.SiteSearchCore;
  if(!core)return;
  const labels={calculator:'Calculator',profession:'Profession Guide',guide:'Tax Guide',deduction:'Deduction Guide'};
  document.querySelectorAll('[data-site-search]').forEach((root,index)=>{
    const input=root.querySelector('[data-search-input]'),filter=root.querySelector('[data-search-filter]'),status=root.querySelector('[data-search-status]'),results=root.querySelector('[data-search-results]');
    if(!input||!filter||!status||!results)return;
    const render=()=>{
      const query=input.value.trim(),matches=core.search(records,query,filter.value,10);
      results.replaceChildren();
      if(!query){status.textContent='Enter a word or phrase to search calculators and guides.';return}
      status.textContent=matches.length?`${matches.length} result${matches.length===1?'':'s'} shown.`:'No results found. Try a broader term or another content type.';
      for(const record of matches){
        const item=document.createElement('li'),link=document.createElement('a'),type=document.createElement('span'),title=document.createElement('strong'),description=document.createElement('small');
        link.href=record.url;type.className='search-result-type';type.textContent=labels[record.type]||record.type;title.textContent=record.title;description.textContent=record.description;
        link.append(type,title,description);item.append(link);results.append(item);
      }
    };
    input.addEventListener('input',render);filter.addEventListener('change',render);
    root.addEventListener('submit',event=>event.preventDefault());
    if(index===0&&location.hash==='#site-search')setTimeout(()=>input.focus(),0);
    render();
  });
})();
