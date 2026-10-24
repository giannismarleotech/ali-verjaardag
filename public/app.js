const $=s=>document.querySelector(s);
for(const key of ['date','time','venue','address'])document.querySelectorAll('[data-'+key+']').forEach(el=>el.textContent=window.PARTY[key]);
const form=$('#rsvp'),message=$('#form-message');
let identity;
try { identity=JSON.parse(localStorage.getItem('ali30-identity')); }catch{}
if(!identity?.id || !identity?.token)identity={id:crypto.randomUUID(),token:crypto.randomUUID()+crypto.randomUUID()};
let saved;
try { saved=JSON.parse(localStorage.getItem('ali30-answer')); }catch{}
if(saved){form.elements.name.value=saved.name;form.elements.status.value=saved.status;form.elements.count.value=saved.count||1;form.querySelector('button').textContent='Mijn antwoord aanpassen';}
function toggleCount(){$('#count-wrap').hidden=form.elements.status.value==='no';}
form.addEventListener('change',toggleCount);toggleCount();
async function refresh(){
  const button=$('#refresh');button.disabled=true;
  try{
    const response=await fetch('/api/rsvp',{cache:'no-store'});
    if(!response.ok)throw Error();
    const data=await response.json();if(!Array.isArray(data.guests))throw Error();
    const guests=data.guests;
    const yes=guests.filter(g=>g.status==='yes');
    $('#yes-total').textContent=yes.reduce((n,g)=>n+g.count,0);
    $('#yes-answers').textContent=yes.length;
    $('#no-total').textContent=guests.filter(g=>g.status==='no').length;
    $('#guest-list').replaceChildren();
    for(const guest of guests){
      const row=document.createElement('tr');
      const name=document.createElement('td');name.textContent=guest.name+(guest.id===identity.id?' (jij)':'');
      const status=document.createElement('td'),badge=document.createElement('span');badge.className='badge'+(guest.status==='no'?' no':'');badge.textContent=guest.status==='yes'?'Aanwezig':'Kan niet';status.append(badge);
      const count=document.createElement('td');count.textContent=guest.status==='yes'?guest.count:'—';row.append(name,status,count);$('#guest-list').append(row);
    }
    $('#list-message').textContent=guests.length?'':'Nog geen antwoorden. Ben jij de eerste?';
  }catch{$('#list-message').textContent='De gedeelde gastenlijst is nog niet bereikbaar. Probeer opnieuw zodra de site volledig op Netlify gepubliceerd is.';}
  finally{button.disabled=false;}
}
form.addEventListener('submit',async event=>{
  event.preventDefault();const button=form.querySelector('button');button.disabled=true;message.className='';message.textContent='Je antwoord wordt opgeslagen…';
  const answer={name:form.elements.name.value.trim(),status:form.elements.status.value,count:Number(form.elements.count.value)};
  try{
    // Save the editing credential before submitting, so a retry never loses access to an accepted answer.
    localStorage.setItem('ali30-identity',JSON.stringify(identity));
    const response=await fetch('/api/rsvp',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...identity,...answer,website:form.elements.website.value})});
    const data=await response.json();if(!response.ok)throw Error(data.error||'Opslaan is niet gelukt. Probeer opnieuw.');
    try{localStorage.setItem('ali30-answer',JSON.stringify(answer));}catch{}
    message.textContent=answer.status==='yes'?'Je staat op de lijst. Tot op het feest!':'Je afmelding is opgeslagen. Bedankt om iets te laten weten.';
    button.textContent='Mijn antwoord aanpassen';await refresh();
  }catch(error){message.className='error';message.textContent=error instanceof SyntaxError?'Opslaan lukt pas nadat ook de Netlify-functie gepubliceerd is.':error.message==='Failed to fetch'?'Geen verbinding. Controleer je internet en probeer opnieuw.':error.message;}
  finally{button.disabled=false;}
});
$('#refresh').addEventListener('click',refresh);
$('#share').addEventListener('click',async()=>{try{await navigator.clipboard.writeText(location.origin+location.pathname);$('#share').textContent='Link gekopieerd';}catch{$('#share').textContent='Kopieer de link uit je adresbalk';}});
refresh();setInterval(()=>{if(!document.hidden)refresh();},20000);
