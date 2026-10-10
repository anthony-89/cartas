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
 const money=value=>'$'+value.toLocaleString('es-MX')+' MXN';
 function update(){
  const index=Number(duration.value);
  document.querySelectorAll('[data-price]').forEach(el=>{
   el.textContent=money(plans[el.dataset.price].prices[index]);
   const small=document.createElement('small');small.textContent=terms[index];el.append(small);
  });
 }
 duration.addEventListener('change',update);update();
 document.querySelectorAll('[data-plan]').forEach(button=>button.addEventListener('click',()=>{
  const plan=plans[button.dataset.plan],index=Number(duration.value);
  document.getElementById('selection-summary').textContent=plan.name+' · '+labels[index]+' · '+money(plan.prices[index])+' ('+terms[index]+').';
  dialog.showModal();
 }));
 dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});
})();
