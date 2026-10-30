import {init} from './_admin.js';import {fn,esc,unsubUrl,unsubHeaders,settings,layout,para,button,transporter,footText,SITE} from './_mail.js';
export default async function handler(req,res){
 if(req.method!=='POST')return res.status(405).end();
 let tr,ref;
 try{
  const {db,auth}=await init();
  const dec=await auth.verifyIdToken((req.headers.authorization||'').replace('Bearer ',''));
  ref=db.collection('users').doc(dec.uid);
  const u=await db.runTransaction(async tx=>{const s=await tx.get(ref);if(!s.exists||s.data().welcomed)return null;tx.update(ref,{welcomed:true});return s.data()});
  if(!u||!u.email)return res.json({ok:true,sent:false});
  try{
   const st=await settings(db),first=fn(u.name),unsub=unsubUrl(dec.uid);tr=await transporter();
   await tr.sendMail({from:`Regis <${process.env.GMAIL_USER}>`,to:u.email,subject:`Welcome to Regis, ${first}`,headers:unsubHeaders(unsub),
    html:layout({wa:st.whatsapp,unsub,body:`<h1 style="font-size:32px;margin:0 0 16px;letter-spacing:-.02em">Welcome, ${esc(first)}.</h1>`+para("Thank you for creating an account with Regis.\n\nWe sell stylish, affordable watches for men and women, carefully sourced and delivered across Nigeria.")+para("Here is what your account gives you:\n- Credits on every order, to spend on your next one\n- A receipt you can save or share after every purchase\n- Live order tracking, from packaging to delivery\n- Your favourite colour on every watch")+`<p style="margin:0">${button(SITE()+'/shop','Start shopping')}</p>`}),
    text:`Hi ${first},\n\nWelcome to Regis! Thank you for creating an account.\n\nYour account gives you credits on every order, a shareable receipt, live order tracking and your favourite colour on every watch.\n\nStart shopping: ${SITE()}/shop${footText(st.whatsapp,unsub)}`});
  }catch(e){await ref.update({welcomed:false}).catch(()=>{});throw e}
  res.json({ok:true,sent:true});
 }catch(e){res.status(400).json({error:e.message})}finally{tr?.close?.()}}
