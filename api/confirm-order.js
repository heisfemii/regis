import {init} from './_admin.js';
const RATE=0.01,N=n=>'₦'+Number(n||0).toLocaleString('en-NG');
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
  let emailed=true,emailError;
  try{
   const nodemailer=(await import('nodemailer')).default,o=out.o,first=(o.customer||'there').split(' ')[0],site=process.env.SITE_URL||'https://regiswatch.vercel.app';
   if(!process.env.GMAIL_USER||!process.env.GMAIL_APP_PASSWORD)throw new Error('GMAIL_USER or GMAIL_APP_PASSWORD is not set on the server');
   const tr=nodemailer.createTransport({service:'gmail',auth:{user:process.env.GMAIL_USER,pass:process.env.GMAIL_APP_PASSWORD}});
   const items=o.items.map(i=>`- ${i.name} (${i.color}) x${i.qty}`).join('\n');
   await tr.sendMail({from:`Regis <${process.env.GMAIL_USER}>`,to:o.email,subject:`Thank you for your order, ${first}!`,
    text:`Hi ${first},\n\nThank you for your order! We have confirmed your payment and your watch is now being packaged.\n\nOrder #${orderId.slice(0,8).toUpperCase()}\n${items}\nTotal: ${N(o.total)}\n${out.earned?`You earned ${N(out.earned)} in credits.\n`:''}\nFollow every step, from packaging to delivery, on your dashboard:\n${site}/account\n(Log in and open "Your orders" to see where your watch is.)\n\nQuestions? Reply to this email or message us on WhatsApp: +234 703 598 0727.\n\nWarm regards,\nThe Regis Team\n@regis.watch`});
  }catch(e){emailed=false;emailError=e.message}
  res.json({ok:true,earned:out.earned,emailed,emailError});
 }catch(e){res.status(400).json({error:e.message})}}
