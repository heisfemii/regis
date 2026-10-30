import {init} from './_admin.js';import {fn,esc,naira,unsubUrl,unsubHeaders,settings,layout,para,button,transporter,footText,cldn,SITE} from './_mail.js';
export default async function handler(req,res){
 if(req.method!=='POST')return res.status(405).end();
 let tr;
 try{
  const {db,auth}=await init();
  const dec=await auth.verifyIdToken((req.headers.authorization||'').replace('Bearer ',''));
  if(!(await db.collection('admins').doc(dec.uid).get()).exists)return res.status(403).json({error:'Admins only'});
  const {subject,message,watchId,test}=req.body||{};if(!subject||!message)return res.status(400).json({error:'Subject and message required'});
  tr=await transporter(true);const st=await settings(db);
  let w=null;if(watchId){const s=await db.collection('watches').doc(String(watchId)).get();if(s.exists)w={id:s.id,...s.data()}}
  let people;
  if(test)people=[{id:dec.uid,name:dec.name||'there',email:dec.email}];
  else{
   if(!process.env.UNSUBSCRIBE_SECRET)throw new Error('UNSUBSCRIBE_SECRET is not set on the server (add any long random text in Vercel, then redeploy)');
   const adminIds=new Set((await db.collection('admins').get()).docs.map(d=>d.id));
   people=(await db.collection('users').get()).docs.filter(d=>!adminIds.has(d.id)).map(d=>({id:d.id,...d.data()})).filter(p=>p.email&&p.marketing!==false);}
  const card=w?(()=>{const img=cldn(w.demo||(w.colors||[])[0]?.images?.[0]||w.image,'w_960,q_auto,f_jpg'),cols=(w.colors||[]).map(c=>c.name).filter(Boolean).join(', ');
   return `<div style="margin:8px 0 24px;border:1px solid #e4e0d6;border-radius:20px;overflow:hidden">${img?`<img src="${esc(img)}" alt="${esc(w.name)}" width="496" style="display:block;width:100%;height:auto">`:''}<div style="padding:20px 24px"><div style="font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:#4a5232;font-weight:600">${esc(w.brand||'')}</div><div style="font-size:22px;font-weight:600;margin:4px 0">${esc(w.name)}</div><div style="color:#6a6a64;font-size:15px">${esc(naira(w.price))}${cols?' · '+esc(cols):''}</div></div></div>`})():'';
  const link=w?`${SITE()}/watch/${w.id}`:SITE(),label=w?'View watch':'Visit Regis';
  let sent=0,failed=0,last='';
  for(let i=0;i<people.length;i+=5)await Promise.all(people.slice(i,i+5).map(async p=>{
   const first=fn(p.name),f=s=>s.replace(/\{name\}/gi,first),unsub=unsubUrl(p.id);
   try{await tr.sendMail({from:`Regis <${process.env.GMAIL_USER}>`,to:p.email,subject:f(subject),headers:unsubHeaders(unsub),
    html:layout({wa:st.whatsapp,unsub,body:para(f(message))+card+`<p style="margin:24px 0 0">${button(link,label)}</p>`}),
    text:f(message)+`\n\n${label}: ${link}`+footText(st.whatsapp,unsub)});sent++}catch(e){failed++;last=e.message}}));
  if(!sent&&failed)throw new Error(last);
  res.json({sent,failed});
 }catch(e){res.status(500).json({error:e.message})}finally{tr?.close?.()}}
