import admin,{db} from './_admin.js';
const RATE=0.01;
export default async function handler(req,res){
 if(req.method!=='POST')return res.status(405).end();
 try{
  const {orderId,reference}=req.body||{};
  const pr=await fetch('https://api.paystack.co/transaction/verify/'+encodeURIComponent(reference),{headers:{Authorization:'Bearer '+process.env.PAYSTACK_SECRET_KEY}});
  const pj=await pr.json(),t=pj.data;
  if(!pj.status||t?.status!=='success'||t.metadata?.orderId!==orderId)return res.status(400).json({error:'Payment not verified'});
  const ref=db.collection('orders').doc(orderId);
  const out=await db.runTransaction(async tx=>{
   const s=await tx.get(ref);if(!s.exists)throw new Error('Order not found');
   const o=s.data();if(o.status==='paid')return {already:true};
   const uref=db.collection('users').doc(o.uid),u=await tx.get(uref);
   let sub=0;for(const i of o.items){const w=await tx.get(db.collection('watches').doc(i.id));if(!w.exists)throw new Error('Watch missing');sub+=w.data().price*i.qty}
   const expected=sub-o.creditsApplied;
   if(expected!==o.total||t.amount!==expected*100||(u.data()?.credits||0)<o.creditsApplied)throw new Error('Amount mismatch');
   const earned=Math.floor(o.total*RATE);
   tx.update(ref,{status:'paid',creditsEarned:earned,reference,paidAt:admin.firestore.FieldValue.serverTimestamp()});
   tx.update(uref,{credits:admin.firestore.FieldValue.increment(earned-o.creditsApplied)});
   return {earned};});
  res.json({ok:true,...out});
 }catch(e){res.status(400).json({error:e.message})}}
