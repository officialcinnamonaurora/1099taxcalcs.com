import fs from 'node:fs';import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..'),errors=[],seen={titles:new Set(),descriptions:new Set(),canonicals:new Set()};
const walk=dir=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()&&!['.git','.agents','tests'].includes(e.name)?walk(path.join(dir,e.name)):e.isFile()&&e.name.endsWith('.html')?[path.join(dir,e.name)]:[]),files=walk(root);
for(const file of files){
 const html=fs.readFileSync(file,'utf8'),rel=path.relative(root,file).replaceAll('\\','/');
 if((html.match(/<h1(?:\s|>)/g)||[]).length!==1)errors.push(`${rel}: expected one H1.`);
 if(rel!=='404.html')for(const [kind,re] of [['titles',/<title>(.*?)<\/title>/],['descriptions',/<meta name="description" content="([^"]+)"/],['canonicals',/<link rel="canonical" href="([^"]+)"/]]){const value=html.match(re)?.[1];if(!value)errors.push(`${rel}: missing ${kind}.`);else if(seen[kind].has(value))errors.push(`${rel}: duplicate ${kind}.`);else seen[kind].add(value)}
 if(rel.startsWith('calculators/')&&rel!=='calculators/index.html'&&!html.includes('Sources and assumptions')&&!html.includes('phase3-calculators.js'))errors.push(`${rel}: missing sources section.`);
 if(/"@type"\s*:\s*"(?:Review|AggregateRating)"|"aggregateRating"/i.test(html))errors.push(`${rel}: prohibited rating/review schema.`);
 for(const m of html.matchAll(/(?:href|src)="([^"]+)"/g)){const u=m[1];if(!u||/^(https?:|#|mailto:|\/)/.test(u))continue;const target=path.resolve(path.dirname(file),u),resolved=u.endsWith('/')?path.join(target,'index.html'):target;if(!fs.existsSync(resolved))errors.push(`${rel}: broken reference ${u}.`)}
}
const sitemap=fs.readFileSync(path.join(root,'sitemap.xml'),'utf8');if(!sitemap.startsWith('<?xml')||!sitemap.includes('<urlset'))errors.push('Invalid sitemap.');if(!fs.readFileSync(path.join(root,'robots.txt'),'utf8').includes('Sitemap: https://1099taxcalcs.com/sitemap.xml'))errors.push('Invalid robots sitemap directive.');
const all=files.map(f=>fs.readFileSync(f,'utf8')).join('\n');if(/<script[^>]+src="https?:/i.test(all))errors.push('Remote script detected.');if(/google-analytics|gtag\(|mixpanel|segment\.com|facebook pixel/i.test(all))errors.push('Tracking detected.');
if(errors.length){console.error(errors.map(x=>`ERROR: ${x}`).join('\n'));process.exit(1)}console.log(`PASS: ${files.length} HTML files; links, H1s, unique metadata, canonicals, source sections, sitemap, robots, schema, and privacy scans passed.`);
