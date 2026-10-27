import {collection,addDoc,getDocs,query,where,orderBy,writeBatch,doc,increment,serverTimestamp} from 'firebase/firestore';
import {db} from './firebase';import {WHATSAPP_NUMBER,CREDIT_RATE,naira} from './config';
export async function createOrder(user,profile,items,creditsApplied){
 const subtotal=items.reduce((s,i)=>s+i.price*i.qty,0);
 const o={uid:user.uid,customer:profile.name,email:user.email,items:items.map(({id,name,brand,color,strap,price,qty})=>({id,name,brand:brand||'',color:color||'',strap:strap||'',price,qty})),subtotal,creditsApplied,total:subtotal-creditsApplied,status:'pending',createdAt:serverTimestamp()};
 const ref=await addDoc(collection(db,'orders'),o);return {...o,id:ref.id};}
export function whatsappLink(o){
 const lines=['*NEW ORDER* #'+o.id.slice(0,8).toUpperCase(),'Customer: '+o.customer,''];
 o.items.forEach((i,n)=>lines.push(`${n+1}. ${i.name} (${i.brand})`,`   Color: ${i.color} | Strap: ${i.strap}`,`   Qty: ${i.qty} x ${naira(i.price)}`));
 lines.push('',`Subtotal: ${naira(o.subtotal)}`);
 if(o.creditsApplied)lines.push(`Credits applied: -${naira(o.creditsApplied)}`);
 lines.push(`*Total: ${naira(o.total)}*`);
 return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join('\n'))}`;}
export const myOrders=async uid=>(await getDocs(query(collection(db,'orders'),where('uid','==',uid),orderBy('createdAt','desc')))).docs.map(d=>({id:d.id,...d.data()}));
export const allOrders=async()=>(await getDocs(query(collection(db,'orders'),orderBy('createdAt','desc')))).docs.map(d=>({id:d.id,...d.data()}));
export async function markPaid(o){
 const earned=Math.floor(o.total*CREDIT_RATE),b=writeBatch(db);
 b.update(doc(db,'orders',o.id),{status:'paid',creditsEarned:earned});
 b.update(doc(db,'users',o.uid),{credits:increment(earned-o.creditsApplied)});
 await b.commit();}
export async function cancelOrder(o){const b=writeBatch(db);b.update(doc(db,'orders',o.id),{status:'cancelled'});await b.commit();}
