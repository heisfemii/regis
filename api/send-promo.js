import nodemailer from 'nodemailer';import {db,auth} from './_admin.js';
export default async function handler(req,res){
 if(req.method!=='POST')return res.status(405).end();
 try{
  const {uid}=await auth.verifyIdToken((req.headers.authorization||'').replace('Bearer ',''));
  if(!(await db.collection('admins').doc(uid).get()).exists)return res.status(403).json({error:'Admins only'});
  const {subject,message}=req.body||{};if(!subject||!message)return res.status(400).json({error:'Subject and message required'});
  const emails=(await db.collection('users').get()).docs.filter(d=>d.data().marketing!==false).map(d=>d.data().email).filter(Boolean);
  const tr=nodemailer.createTransport({service:'gmail',auth:{user:process.env.GMAIL_USER,pass:process.env.GMAIL_APP_PASSWORD}});
  const foot='\n\n--\nYou are receiving this because you have an account at Regis. Reply to this email to stop receiving promotions.';
  for(let i=0;i<emails.length;i+=50)await tr.sendMail({from:`Regis <${process.env.GMAIL_USER}>`,to:process.env.GMAIL_USER,bcc:emails.slice(i,i+50),subject,text:message+foot});
  res.json({sent:emails.length});
 }catch(e){res.status(500).json({error:e.message})}}
