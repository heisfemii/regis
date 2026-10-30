import {init} from './_admin.js';import {verify} from './_mail.js';
const page=(t,m)=>`<!doctype html><meta name="viewport" content="width=device-width,initial-scale=1"><body style="font-family:-apple-system,Helvetica,Arial,sans-serif;background:#f5f4f0;color:#111;display:grid;place-items:center;min-height:100vh;margin:0"><div style="text-align:center;padding:24px;max-width:420px"><div style="font-weight:700;letter-spacing:.26em;color:#4a5232">REGIS</div><h1 style="font-size:32px;margin:24px 0 8px">${t}</h1><p style="color:#6a6a64;line-height:1.6">${m}</p><a href="/" style="color:#4a5232">Back to Regis</a></div></body>`;
export default async function handler(req,res){
 const q=req.query||{};res.setHeader('content-type','text/html; charset=utf-8');
 try{
  if(!verify(q.u,q.t))return res.status(400).send(page('Link not valid','This unsubscribe link is invalid or has expired. Please email inbox.regis@gmail.com and we will remove you.'));
  const {db}=await init();await db.collection('users').doc(String(q.u)).update({marketing:false});
  if(req.method==='POST')return res.status(200).send('ok');
  return res.status(200).send(page('You are unsubscribed','You will no longer receive promotional emails from Regis. Order updates will still reach you.'));
 }catch(e){return res.status(500).send(page('Something went wrong','We could not update your preference. Please email inbox.regis@gmail.com and we will do it for you.'))}}
