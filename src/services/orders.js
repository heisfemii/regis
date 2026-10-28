import {collection,addDoc,getDocs,getDoc,query,where,orderBy,writeBatch,updateDoc,doc,serverTimestamp} from 'firebase/firestore';
import {db,auth} from './firebase';import {WHATSAPP_NUMBER,naira} from './config';
const m=d=>({id:d.id,...d.data()});
export async function createOrder(user,name,items,creditsApplied){
 const subtotal=items.reduce((s,i)=>s+i.price*i.qty,0);
 const o={uid:user.uid,customer:name,email:user.email,items:items.map(({id,name,brand,color,strap,price,qty,image})=>({id,name,brand,color,strap,price,qty,image})),subtotal,creditsApplied,total:subtotal-creditsApplied,status:'pending',stage:'processing',createdAt:serverTimestamp()};
 const ref=await addDoc(collection(db,'orders'),o);return {...o,id:ref.id};}
export const stageOf=o=>o.stage||(o.status==='paid'?'packaging':'processing');
export function whatsappLink(o){
 const L=['*NEW ORDER* #'+o.id.slice(0,8).toUpperCase(),'Customer: '+o.customer,''];
 o.items.forEach((i,n)=>L.push(`${n+1}. ${i.name} (${i.brand})`,`   Color: ${i.color} | Strap: ${i.strap}`,`   Qty: ${i.qty} x ${naira(i.price)}`));
 L.push('',`Subtotal: ${naira(o.subtotal)}`);if(o.creditsApplied)L.push(`Credits applied: -${naira(o.creditsApplied)}`);L.push(`*Total: ${naira(o.total)}*`);
 return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(L.join('\n'))}`;}
export async function confirmOrder(o){
 const t=await auth.currentUser.getIdToken(),r=await fetch('/api/confirm-order',{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+t},body:JSON.stringify({orderId:o.id})});
 const j=await r.json().catch(()=>({error:'Server error '+r.status}));if(!r.ok)throw new Error(j.error);return j;}
export const setStage=(o,stage)=>updateDoc(doc(db,'orders',o.id),{stage,stageUpdatedAt:serverTimestamp()});
export const getOrder=async id=>{const s=await getDoc(doc(db,'orders',id));return s.exists()?m(s):null};
export const myOrders=async uid=>(await getDocs(query(collection(db,'orders'),where('uid','==',uid)))).docs.map(m).sort((a,b)=>(b.createdAt?.seconds||0)-(a.createdAt?.seconds||0));
export const allOrders=async()=>(await getDocs(query(collection(db,'orders'),orderBy('createdAt','desc')))).docs.map(m);
export const listUsers=async()=>(await getDocs(collection(db,'users'))).docs.map(m);
export async function cancelOrder(o){const b=writeBatch(db);b.update(doc(db,'orders',o.id),{status:'cancelled'});await b.commit();}
