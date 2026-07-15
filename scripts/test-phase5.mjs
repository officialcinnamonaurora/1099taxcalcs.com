import fs from 'node:fs';
import path from 'node:path';

const root=path.resolve(import.meta.dirname,'..');
const read=file=>fs.readFileSync(path.join(root,file),'utf8');
const professionSlugs=['freelancers','independent-contractors','gig-workers','rideshare-drivers','delivery-drivers','real-estate-agents','consultants','photographers','graphic-designers','web-developers','software-developers','content-creators','youtubers','social-media-influencers','online-sellers','tutors','cleaning-businesses','landscapers','handymen','personal-trainers'];
const educationSlugs=['what-is-self-employment-tax','how-self-employment-tax-is-calculated','how-to-pay-taxes-on-1099-income','when-do-1099-workers-pay-taxes','do-i-need-to-pay-quarterly-taxes','how-to-save-for-quarterly-taxes','estimated-tax-payments-explained','1099-tax-deductions','common-business-expenses-for-freelancers','difference-between-expense-and-deduction','how-tax-deductions-reduce-taxable-income','standard-mileage-vs-actual-expenses','home-office-deduction-explained','1099-vs-w2-taxes','how-much-more-should-a-contractor-charge','how-to-set-a-freelance-hourly-rate','how-to-track-freelance-income','how-to-organize-business-expenses','what-records-should-independent-contractors-keep','1099-tax-checklist'];
const deductionSlugs=['advertising-expenses','contract-labor','office-supplies','software-and-subscriptions','business-insurance','legal-and-professional-fees','business-travel','business-meals','vehicle-expenses','home-office-expenses','phone-and-internet','education-and-training','equipment-and-tools','retirement-contributions','self-employed-health-insurance'];
const tests=[];
const test=(name,condition,detail='')=>tests.push([name,Boolean(condition),detail]);
const count=(text,pattern)=>(text.match(pattern)||[]).length;
const required=['Hypothetical example','Common mistakes','Official sources','Tax disclaimer','Last reviewed'];

test('20 profession pages configured',professionSlugs.length===20);
test('20 education pages configured',educationSlugs.length===20);
test('15 deduction pages configured',deductionSlugs.length===15);
for(const slug of professionSlugs){
  const file=`guides/taxes-for-${slug}/index.html`,html=read(file);
  test(`${slug}: required content`,required.every(x=>html.includes(x)));
  test(`${slug}: tailored calculator path`,count(html,/href="\.\.\/\.\.\/calculators\//g)>=3);
  test(`${slug}: deduction paths`,count(html,/href="\.\.\/\.\.\/deductions\//g)>=3);
  test(`${slug}: education paths`,count(html,/href="\.\.\/[a-z0-9-]+\//g)>=3);
  test(`${slug}: related professions`,count(html,/href="\.\.\/taxes-for-/g)>=2);
}
for(const slug of educationSlugs){
  const html=read(`guides/${slug}/index.html`);
  test(`${slug}: required content`,required.every(x=>html.includes(x)));
  test(`${slug}: calculator links`,count(html,/href="\.\.\/\.\.\/calculators\//g)>=3);
  test(`${slug}: profession links`,count(html,/href="\.\.\/taxes-for-/g)>=3);
  test(`${slug}: deduction links`,count(html,/href="\.\.\/\.\.\/deductions\//g)>=3);
}
for(const slug of deductionSlugs){
  const html=read(`deductions/${slug}/index.html`);
  test(`${slug}: required content`,required.every(x=>html.includes(x)));
  test(`${slug}: planner and Schedule C links`,html.includes('/calculators/business-expense-deduction/')&&html.includes('/calculators/schedule-c-profit/'));
  test(`${slug}: eligibility warning`,/does not determine eligibility/i.test(html));
}
const guides=read('guides/index.html'),deductions=read('deductions/index.html'),home=read('index.html'),sitemap=read('sitemap.xml'),css=read('assets/css/styles.css');
test('guide directory filter',guides.includes('id="guideFilter"')&&guides.includes('content-filter.js'));
test('deduction directory filter',deductions.includes('id="guideFilter"')&&deductions.includes('content-filter.js'));
test('all profession directory cards',professionSlugs.every(x=>guides.includes(`taxes-for-${x}/`)));
test('all deduction directory cards',deductionSlugs.every(x=>deductions.includes(`${x}/`)));
test('homepage has no more than eight featured professions',count(home,/href="guides\/taxes-for-/g)===8);
test('homepage discovery links',home.includes('Browse all profession guides')&&home.includes('Browse deduction guides'));
test('sitemap includes all Phase 5 pages',[...professionSlugs.map(x=>`guides/taxes-for-${x}/`),...educationSlugs.map(x=>`guides/${x}/`),...deductionSlugs.map(x=>`deductions/${x}/`)].every(x=>sitemap.includes(x)));
test('mobile styles retained',css.includes('@media(max-width:560px)'));
const projectText=[read('build_phase5.mjs'),read('assets/js/content-filter.js')].join('\n');
test('no storage, cookies, network, or analytics',!/(localStorage|sessionStorage|document\.cookie|fetch\(|XMLHttpRequest|analytics|gtag\()/i.test(projectText));
test('CNAME exact',read('CNAME')==='1099TaxCalcs.com\n'||read('CNAME')==='1099TaxCalcs.com\r\n'||read('CNAME')==='1099TaxCalcs.com');

for(const [name,ok,detail] of tests)console.log(`${ok?'PASS':'FAIL'}: ${name}${detail?` — ${detail}`:''}`);
if(tests.some(x=>!x[1]))process.exit(1);
console.log(`PASS: ${tests.length} Phase 5 content tests.`);
