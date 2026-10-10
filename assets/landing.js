(() => {
 'use strict';
 const plans = {
  'sin-rastreo':{name:'Sin rastreo',prices:[180,160,435,1635]},
  mexico:{name:'México con rastreo',prices:[220,195,525,1990]},
  internacional:{name:'Internacional con rastreo',prices:[240,215,580,2195]}
 };
 const duration=document.getElementById('duration');
 const dialog=document.getElementById('selection-dialog');
 const labels=['Compra única','Suscripción mensual','Suscripción por 3 meses','Suscripción anual'];
 const terms=['una entrega','al mes','total por 3 meses','total por 12 meses'];
 function money(value) {
  const amount=document.createDocumentFragment();
  const symbol=document.createElement('span');symbol.className='currency-symbol';symbol.textContent='$';
  const code=document.createElement('span');code.className='currency-code';code.textContent='MXN';
  amount.append(symbol,document.createTextNode(value.toLocaleString('es-MX')),code);
  return amount;
 }
 function update(){
  const index=Number(duration.value);
  document.querySelectorAll('[data-price]').forEach(el=>{
   el.replaceChildren(money(plans[el.dataset.price].prices[index]));
   el.setAttribute('aria-label',plans[el.dataset.price].prices[index]+' pesos mexicanos, '+terms[index]);
   const small=document.createElement('small');small.textContent=terms[index];el.append(small);
  });
 }
 duration.addEventListener('change',update);update();
 document.querySelectorAll('[data-plan]').forEach(button=>button.addEventListener('click',()=>{
  const plan=plans[button.dataset.plan],index=Number(duration.value);
  document.getElementById('selection-summary').replaceChildren(document.createTextNode(plan.name+' · '+labels[index]+' · '),money(plan.prices[index]),document.createTextNode(' ('+terms[index]+').'));
  dialog.showModal();
 }));
 dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});
})();
