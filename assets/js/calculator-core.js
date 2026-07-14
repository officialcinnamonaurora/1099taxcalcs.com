'use strict';
(function(){
 const C=window.TaxConfig, V=C.values;
 const money=n=>Number.isFinite(n)?new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(n):'—';
 const number=(f,id)=>{const e=f.elements[id];return e&&e.value.trim()!==''?Number(e.value):0};
 const value=(key)=>V[key].value;
 function selfEmploymentTax(net,status='single',w2Wages=0){
   const taxable=Math.max(0,net)*value('netEarningsPercentage');
   const remainingBase=Math.max(0,value('socialSecurityWageBase')-Math.max(0,w2Wages));
   const socialSecurity=Math.min(taxable,remainingBase)*value('socialSecuritySeRate');
   const medicare=taxable*value('medicareSeRate');
   const threshold=value('additionalMedicareThresholds')[status]??200000;
   const additionalMedicare=Math.max(0,taxable+Math.max(0,w2Wages)-threshold)*value('additionalMedicareRate');
   return{taxable,socialSecurity,medicare,additionalMedicare,total:socialSecurity+medicare+additionalMedicare,deductible:(socialSecurity+medicare)/2};
 }
 function employeePayrollTax(wages,rateOverride){
   if(Number.isFinite(rateOverride))return wages*rateOverride;
   return Math.min(wages,value('socialSecurityWageBase'))*value('employeeSocialSecurityRate')+wages*value('employeeMedicareRate');
 }
 function federalIncomeTax(taxableIncome,status='single'){
   const brackets=C.federalIncomeTax.brackets[status]||C.federalIncomeTax.brackets.single;
   let lower=0,total=0,marginalRate=0;const rows=[];
   for(const [upper,rate] of brackets){const amount=Math.max(0,Math.min(taxableIncome,upper)-lower);const tax=amount*rate;if(amount>0)marginalRate=rate;rows.push({lower,upper,rate,amount,tax});total+=tax;if(taxableIncome<=upper)break;lower=upper;}
   return{total,marginalRate,rows};
 }
 function set(id,n,formatter=money){const e=document.getElementById(id);if(e)e.textContent=typeof n==='string'?n:formatter(n)}
 function validate(form,rules={}){
   form.querySelectorAll('.field-error').forEach(e=>e.remove());form.querySelectorAll('.has-error').forEach(e=>e.classList.remove('has-error'));
   const errors=[];
   [...form.querySelectorAll('input[type=number],input[type=date],select')].filter(el=>!el.disabled).forEach(el=>{
     const r=rules[el.name]||{}, empty=el.value.trim()===''; let msg='';
     if((r.required||el.required)&&empty)msg='Enter a value (zero is allowed).';
     else if(!empty&&el.type==='number'&&(!Number.isFinite(Number(el.value))||Number(el.value)<0))msg='Enter a valid number of zero or more.';
     else if(!empty&&r.max!==undefined&&Number(el.value)>r.max)msg=`Enter ${r.max} or less.`;
     else if(!empty&&r.greaterThanZero&&Number(el.value)<=0)msg='Enter a number greater than zero.';
     if(msg){errors.push(el);const field=el.closest('.field');field?.classList.add('has-error');const p=document.createElement('p');p.className='field-error';p.id=el.id+'Error';p.textContent=msg;field?.append(p);el.setAttribute('aria-invalid','true');el.setAttribute('aria-describedby',[el.dataset.help,p.id].filter(Boolean).join(' '));}else el.removeAttribute('aria-invalid');
   });
   const summary=form.querySelector('.error-summary');
   if(errors.length){summary.hidden=false;summary.textContent=`Please correct ${errors.length} highlighted field${errors.length===1?'':'s'}.`;errors[0].focus();return false}summary.hidden=true;return true;
 }
 function summary(form,title,rows){return `${title}\nTax year: ${C.taxYear}\n`+rows.map(([a,b])=>`${a}: ${typeof b==='number'?money(b):b}`).join('\n')+'\nInformational planning estimate only; not a tax return or advice.'}
 async function copy(text,button){try{await navigator.clipboard.writeText(text);button.textContent='Copied';setTimeout(()=>button.textContent='Copy summary',1800)}catch{button.textContent='Copy unavailable'}}
 function bind({id,rules,calculate,reset}){const f=document.getElementById(id);if(!f)return;let text='';f.addEventListener('submit',e=>{e.preventDefault();if(validate(f,rules)){const result=calculate(f);text=result.summary;f.closest('.calculator-page')?.querySelector('.results')?.focus()}});f.addEventListener('reset',()=>setTimeout(()=>{f.querySelector('.error-summary').hidden=true;f.querySelectorAll('.field-error').forEach(e=>e.remove());f.closest('.calculator-page')?.querySelectorAll('.results strong').forEach(e=>e.textContent='—');reset?.(f)},0));f.closest('.calculator-page')?.querySelector('.copy-button')?.addEventListener('click',e=>copy(text||'Calculate an estimate before copying.',e.currentTarget));}
 window.CalculatorCore={C,V,money,number,set,validate,selfEmploymentTax,employeePayrollTax,federalIncomeTax,summary,bind};
})();
