import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..'),read=file=>fs.readFileSync(path.join(root,file),'utf8'),site='https://1099taxcalcs.com/';
const routes=[...read('sitemap.xml').matchAll(/<loc>https:\/\/1099taxcalcs\.com\/([^<]*)<\/loc>/g)].map(match=>match[1]);
const fileFor=route=>route?`${route}index.html`:'index.html',problems=[],titles=new Map(),descriptions=new Map(),canonicals=new Map(),incoming=new Map(routes.map(route=>[route,0]));
for(const route of routes){
  const file=fileFor(route);if(!fs.existsSync(path.join(root,file))){problems.push(`${route}: missing file`);continue}
  const html=read(file),title=(html.match(/<title>([^<]+)<\/title>/)||[])[1],description=(html.match(/<meta name="description" content="([^"]+)"/)||[])[1],canonical=(html.match(/<link rel="canonical" href="([^"]+)"/)||[])[1];
  for(const [value,map,label]of[[title,titles,'title'],[description,descriptions,'description'],[canonical,canonicals,'canonical']]){if(!value)problems.push(`${route}: missing ${label}`);else if(map.has(value))problems.push(`${route}: duplicate ${label} with ${map.get(value)}`);else map.set(value,route)}
  if(canonical!==site+route)problems.push(`${route}: canonical mismatch`);if((html.match(/<h1\b/g)||[]).length!==1)problems.push(`${route}: H1 count`);
  for(const match of html.matchAll(/href="([^"]+)"/g)){const href=match[1];if(/^(?:https?:|mailto:|tel:|#)/.test(href))continue;const target=new URL(href,site+route).pathname.replace(/^\//,'');if(path.posix.extname(target))continue;const normalized=target&&!target.endsWith('/')?target+'/':target;if(incoming.has(normalized))incoming.set(normalized,incoming.get(normalized)+1);else problems.push(`${route}: broken link ${href}`)}
  for(const schema of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)){try{const data=JSON.parse(schema[1]);if(/Review|Rating/.test(String(data['@type']||'')))problems.push(`${route}: prohibited review schema`)}catch{problems.push(`${route}: invalid JSON-LD`)}}
}
for(const [route,count]of incoming)if(route&&count===0)problems.push(`${route}: orphan`);
if(!read('robots.txt').includes('Sitemap: https://1099taxcalcs.com/sitemap.xml'))problems.push('robots invalid');if(read('CNAME').trim()!=='1099TaxCalcs.com')problems.push('CNAME invalid');
if(problems.length){problems.forEach(problem=>console.error('ERROR:',problem));process.exit(1)}console.log(`PASS: Phase 7 validated ${routes.length} sitemap pages, metadata, JSON-LD, links, orphans, robots, and CNAME.`);
