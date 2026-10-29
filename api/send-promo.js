import {init} from './_admin.js';
export default async function handler(req,res){
 if(req.method!=='POST')return res.status(405).end();
 try{
  const {db,auth}=await init();
  if(!process.env.GMAIL_USER||!process.env.GMAIL_APP_PASSWORD)throw new Error('GMAIL_USER or GMAIL_APP_PASSWORD is not set on the server');
  const nodemailer=(await import('nodemailer')).default;
  const {uid}=await auth.verifyIdToken((req.headers.authorization||'').replace('Bearer ',''));
  if(!(await db.collection('admins').doc(uid).get()).exists)return res.status(403).json({error:'Admins only'});
  const {subject,message}=req.body||{};if(!subject||!message)return res.status(400).json({error:'Subject and message required'});
  const adminIds=new Set((await db.collection('admins').get()).docs.map(d=>d.id));
  const people=(await db.collection('users').get()).docs.filter(d=>!adminIds.has(d.id)).map(d=>d.data()).filter(p=>p.email&&p.marketing!==false);
  const tr=nodemailer.createTransport({service:'gmail',pool:true,maxConnections:3,auth:{user:process.env.GMAIL_USER,pass:process.env.GMAIL_APP_PASSWORD}});
  const foot='\n\n--\nYou are receiving this because you have an account at Regis. Reply to this email to stop receiving promotions.';
  let sent=0,failed=0,last='';
  for(let i=0;i<people.length;i+=5)await Promise.all(people.slice(i,i+5).map(async p=>{
   const first=(p.name||'there').split(' ')[0],fill=s=>s.replace(/\{name\}/gi,first);
   try{await tr.sendMail({from:`Regis <${process.env.GMAIL_USER}>`,to:p.email,subject:fill(subject),text:fill(message)+foot});sent++}catch(e){failed++;last=e.message}}));
  if(!sent&&failed)throw new Error(last);
  res.json({sent,failed});
 }catch(e){res.status(500).json({error:e.message})}}
