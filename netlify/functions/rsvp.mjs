import { getStore } from '@netlify/blobs';
import { createHash, timingSafeEqual } from 'node:crypto';
const hash = value => createHash('sha256').update(value).digest('hex');
const json = (data, status = 200) => Response.json(data, {status, headers:{'Cache-Control':'no-store'}});
export async function handle(request, store) {
  const url = new URL(request.url);
  if(request.method === 'GET') {
    const {blobs} = await store.list({prefix:'guest/'});
    const records = await Promise.all(blobs.map(b=>store.get(b.key,{type:'json'})));
    return json({guests:records.filter(Boolean).map(({tokenHash,...guest})=>guest).sort((a,b)=>a.name.localeCompare(b.name,'nl'))});
  }
  if(request.method !== 'POST') return json({error:'Methode niet toegestaan.'},405);
  if(request.headers.get('origin') && request.headers.get('origin') !== url.origin) return json({error:'Ongeldige aanvraag.'},403);
  if(Number(request.headers.get('content-length')||0)>4096) return json({error:'Aanvraag te groot.'},413);
  let body; try { const raw=await request.text(); if(raw.length>4096)return json({error:'Aanvraag te groot.'},413); body=JSON.parse(raw); }catch{return json({error:'Ongeldige gegevens.'},400);}
  const {id,token,status}=body;
  const name=typeof body.name==='string'?body.name.trim().replace(/\s+/g,' '):'';
  const count=Number(body.count);
  if(!/^[a-zA-Z0-9-]{20,64}$/.test(id||'') || !/^[a-zA-Z0-9-]{32,100}$/.test(token||'') || name.length<2 || name.length>70 || !['yes','no'].includes(status) || !Number.isInteger(count) || count<1 || count>15 || /[\x00-\x1f]/.test(name))return json({error:'Vul je naam, antwoord en een geldig aantal in.'},400);
  if(body.website) return json({error:'Aanmelding geweigerd.'},400);
  const key='guest/'+id;
  const previous=await store.get(key,{type:'json'});
  if(previous && !timingSafeEqual(Buffer.from(previous.tokenHash),Buffer.from(hash(token)))) return json({error:'Je kunt alleen je eigen antwoord wijzigen.'},403);
  const guest={id,name,status,count:status==='yes'?count:0,updatedAt:new Date().toISOString(),tokenHash:hash(token)};
  await store.setJSON(key,guest);
  return json({ok:true});
}
export default async request => {
  try { return await handle(request,getStore({name:'ali-30-rsvp',consistency:'strong'})); }
  catch {return json({error:'De gastenlijst is tijdelijk niet bereikbaar. Probeer het opnieuw.'},503);}
};
export const config={path:'/api/rsvp',rateLimit:{windowLimit:60,windowSize:60,aggregateBy:['ip','domain']}};
