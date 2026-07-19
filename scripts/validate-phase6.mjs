import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url),root=path.resolve(import.meta.dirname,'..'),problems=[];
const read=file=>fs.readFileSync(path.join(root,file),'utf8'),exists=file=>fs.existsSync(path.join(root,file));
const sitemap=read('sitemap.xml'),routes=[...sitemap.matchAll(/<loc>https:\/\/1099taxcalcs\.com\/([^<]*)<\/loc>/g)].map(match=>match[1]);
const fileFor=route=>route?`${route}index.html`:'index.html',titles=new Map(),descriptions=new Map(),canonicals=new Map();
for(const route of routes){const file=fileFor(route);if(!exists(file)){problems.push(`${route||'/'}: sitemap file missing`);continue}const html=read(file),title=(html.match(/<title>(.*?)<\/title>/)||[])[1],description=(html.match(/<meta name="description" content="([^"]+)"/)||[])[1],canonical=(html.match(/<link rel="canonical" href="([^"]+)"/)||[])[1],h1=(html.match(/<h1\b/g)||[]).length;
  if(!title)problems.push(`${route||'/'}: missing title`);else if(titles.has(title))problems.push(`${route||'/'}: duplicate title with ${titles.get(title)}`);else titles.set(title,route);
  if(!description)problems.push(`${route||'/'}: missing description`);else if(descriptions.has(description))problems.push(`${route||'/'}: duplicate description with ${descriptions.get(description)}`);else descriptions.set(description,route);
  const expected=`https://1099taxcalcs.com/${route}`;if(canonical!==expected)problems.push(`${route||'/'}: canonical mismatch`);else if(canonicals.has(canonical))problems.push(`${route||'/'}: duplicate canonical`);else canonicals.set(canonical,route);
  if(h1!==1)problems.push(`${route||'/'}: expected one H1, found ${h1}`);
  if(!html.includes('class="skip-link"'))problems.push(`${route||'/'}: missing skip link`);
  if(!html.includes('data-site-search'))problems.push(`${route||'/'}: missing site search`);
  for(const script of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)){try{const data=JSON.parse(script[1]);if(/Review|Rating/.test(data['@type']||''))problems.push(`${route||'/'}: prohibited review/rating schema`)}catch{problems.push(`${route||'/'}: invalid JSON-LD`)}}
  const faqSchema=html.includes('FAQPage');if(faqSchema&&!/<section[^>]*>[\s\S]*Frequently asked questions/i.test(html))problems.push(`${route||'/'}: FAQ schema without visible FAQ`);
  if(/guides\/(?!$)|deductions\/(?!$)/.test(route)){if(!/Official sources/i.test(html))problems.push(`${route}: missing official-source section`);if(!/Tax disclaimer/i.test(html))problems.push(`${route}: missing disclaimer`);if(!/Last reviewed:/i.test(html))problems.push(`${route}: missing review date`)}
}
const allIndex=[];function walk(directory){for(const entry of fs.readdirSync(directory,{withFileTypes:true})){if(['.git','tests'].includes(entry.name))continue;const absolute=path.join(directory,entry.name);if(entry.isDirectory())walk(absolute);else if(entry.name==='index.html')allIndex.push(path.relative(root,absolute).split(path.sep).join('/').replace(/index\.html$/,''))}}walk(root);for(const route of allIndex)if(!routes.includes(route))problems.push(`${route||'/'}: public index page absent from sitemap`);
const report=read('INTERNAL-LINK-REPORT.md');if(!report.includes('Broken internal page links: 0'))problems.push('internal-link report contains broken links');if(!report.includes('Orphan pages: 0'))problems.push('internal-link report contains orphan pages');
if(problems.length){for(const problem of problems)console.error(`ERROR: ${problem}`);process.exit(1)}console.log(`PASS: Phase 6 SEO/link audit validated ${routes.length} sitemap pages with unique metadata, canonicals, one H1, search, skip links, structured data, required trust sections, and zero orphans.`);
