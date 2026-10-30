import {init} from './_admin.js';import {fn,esc,naira,settings,layout,para,button,transporter,footText,SITE} from './_mail.js';import {makeReceipt} from './_receipt.js';
const RATE=0.01;
const htmlReceipt=(o,id,earned)=>`<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 24px;border:1px solid #e4e0d6;border-radius:16px;font-size:15px"><tr><td style="padding:16px 20px;font-weight:700">Receipt #${esc(id)}</td></tr>${o.items.map(i=>`<tr><td style="padding:8px 20px;border-top:1px solid #eee">${esc(i.name)} (${esc(i.color)}) x${i.qty}<span style="float:right">${esc(naira(i.price*i.qty))}</span></td></tr>`).join('')}<tr><td style="padding:12px 20px;border-top:1px solid #e4e0d6;font-weight:700">Total<span style="float:right">${esc(naira(o.total))}</span></td></tr>${earned?`<tr><td style="padding:0 20px 16px;color:#4a5232">You earned ${esc(naira(earned))} in credits.</td></tr>`:''}</table>`;
export default async function handler(req,res){
 if(req.method!=='POST')return res.status(405).end();
 try{
  const {admin,db,auth}=await init(),F=admin.firestore.FieldValue;
  const {uid}=await auth.verifyIdToken((req.headers.authorization||'').replace('Bearer ',''));
  if(!(await db.collection('admins').doc(uid).get()).exists)return res.status(403).json({error:'Admins only'});
  const {orderId}=req.body||{},ref=db.collection('orders').doc(orderId);
  const out=await db.runTransaction(async tx=>{
   const s=await tx.get(ref);if(!s.exists)throw new Error('Order not found');
   const o=s.data();if(o.status==='paid')return {already:true};
   if(o.status==='cancelled')throw new Error('This order was cancelled');
   const uref=db.collection('users').doc(o.uid),u=await tx.get(uref);
   if((u.data()?.credits||0)<o.creditsApplied)throw new Error('Customer no longer has enough credits for this order');
   const earned=Math.floor(o.total*RATE);
   tx.update(ref,{status:'paid',stage:'packaging',creditsEarned:earned,paidAt:F.serverTimestamp(),stageUpdatedAt:F.serverTimestamp()});
   tx.update(uref,{credits:F.increment(earned-o.creditsApplied)});
   return {earned,o};});
  if(out.already)return res.json({ok:true,already:true});
  let emailed=true,emailError,receipt='picture',receiptError,tr;
  try{
   const o=out.o,first=fn(o.customer),st=await settings(db),site=SITE(),id=orderId.slice(0,8).toUpperCase(),date=new Date().toLocaleDateString('en-NG',{day:'numeric',month:'short',year:'numeric'});
   let png=null;try{png=await makeReceipt({id,items:o.items,total:o.total,creditsApplied:o.creditsApplied,creditsEarned:out.earned,date,site:site.replace(/^https?:\/\//,'')})}catch(e){receipt='text';receiptError=e.message}
   const rec=png?`<img src="cid:receipt" width="450" alt="Your Regis receipt" style="display:block;width:100%;max-width:450px;height:auto;margin:0 auto 24px;border-radius:16px">`:htmlReceipt(o,id,out.earned);
   const html=layout({wa:st.whatsapp,body:`<h1 style="font-size:32px;margin:0 0 8px;letter-spacing:-.02em">Thank you, ${esc(first)}.</h1>`+para("We've confirmed your payment and your watch is now being packaged. Here is your receipt.")+rec+para('Follow every step, from packaging to delivery, on your dashboard.')+`<p style="margin:0">${button(site+'/account','Track your order')}</p>`});
   const text=`Hi ${first},\n\nThank you for your order! We have confirmed your payment and your watch is now being packaged.\n\nOrder #${id}\n${o.items.map(i=>`- ${i.name} (${i.color}) x${i.qty}`).join('\n')}\nTotal: ${naira(o.total)}\n${out.earned?`You earned ${naira(out.earned)} in credits.\n`:''}\nFollow every step on your dashboard: ${site}/account${footText(st.whatsapp)}`;
   tr=await transporter();
   await tr.sendMail({from:`Regis <${process.env.GMAIL_USER}>`,to:o.email,subject:`Thank you for your order, ${first}!`,html,text,attachments:png?[{filename:'receipt.png',content:png,cid:'receipt',contentDisposition:'inline'}]:[]});
  }catch(e){emailed=false;emailError=e.message}finally{tr?.close?.()}
  res.json({ok:true,earned:out.earned,emailed,emailError,receipt,receiptError});
 }catch(e){res.status(400).json({error:e.message})}}
