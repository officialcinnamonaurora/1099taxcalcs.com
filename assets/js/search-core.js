(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports)module.exports=api;
  else root.SiteSearchCore=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  const normalize=value=>String(value||'').toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,' ').trim();
  function search(records,query,type='all',limit=12){
    const terms=normalize(query).split(' ').filter(Boolean);
    if(!terms.length)return[];
    return records.filter(record=>type==='all'||record.type===type).map(record=>{
      const title=normalize(record.title),description=normalize(record.description),keywords=normalize(record.keywords),haystack=`${title} ${description} ${keywords}`;
      if(!terms.every(term=>haystack.includes(term)))return null;
      const score=terms.reduce((total,term)=>total+(title.startsWith(term)?8:title.includes(term)?5:keywords.includes(term)?3:1),0);
      return{record,score};
    }).filter(Boolean).sort((a,b)=>b.score-a.score||a.record.title.localeCompare(b.record.title)).slice(0,limit).map(item=>item.record);
  }
  return{normalize,search};
});
