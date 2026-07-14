'use strict';
document.querySelectorAll('[data-year]').forEach(el=>el.textContent=new Date().getFullYear());
const menu=document.querySelector('.menu-button');
if(menu){menu.addEventListener('click',()=>{const nav=document.getElementById('site-nav');const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));});}
document.querySelectorAll('.print-button').forEach(button=>button.addEventListener('click',()=>window.print()));
