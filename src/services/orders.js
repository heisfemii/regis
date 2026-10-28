import {collection,addDoc,getDocs,getDoc,query,where,orderBy,writeBatch,doc,increment,serverTimestamp} from 'firebase/firestore';
import {db} from './firebase';import {CREDIT_RATE} from './config';
const m=d=>({id:d.id,...d.data()});
export async function createOrder(user,name,items,creditsApplied){
 const subtotal=items.reduce((s,i)=>s+i.price*i.qty,0);
 const o={uid:user.uid,customer:name,email:user.email,items:items.map(({id,name,brand,color,strap,price,qty,image})=>({id,name,brand,color,strap,price,qty,image})),subtotal,creditsApplied,total:subtotal-creditsApplied,status:'pending',createdAt:serverTimestamp()};
 const ref=await addDoc(collection(db,'orders'),o);return {...o,id:ref.id};}
export function payWithPaystack(order,email){return new Promise((res,rej)=>{
 window.PaystackPop.setup({key:import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,email,amount:order.total*100,currency:'NGN',ref:order.id+'-'+Date.now(),metadata:{orderId:order.id},callback:r=>res(r.reference),onClose:()=>rej(new Error('closed'))}).openIframe();});}
export async function verifyPayment(orderId,reference){
 const r=await fetch('/api/paystack-verify',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({orderId,reference})});
 if(!r.ok)throw new Error('verify');return r.json();}
export const getOrder=async id=>{const s=await getDoc(doc(db,'orders',id));return s.exists()?m(s):null};
export const myOrders=async uid=>(await getDocs(query(collection(db,'orders'),where('uid','==',uid)))).docs.map(m).sort((a,b)=>(b.createdAt?.seconds||0)-(a.createdAt?.seconds||0));
export const allOrders=async()=>(await getDocs(query(collection(db,'orders'),orderBy('createdAt','desc')))).docs.map(m);
export const listUsers=async()=>(await getDocs(collection(db,'users'))).docs.map(m);
export async function markPaid(o){const earned=Math.floor(o.total*CREDIT_RATE),b=writeBatch(db);
 b.update(doc(db,'orders',o.id),{status:'paid',creditsEarned:earned});b.update(doc(db,'users',o.uid),{credits:increment(earned-o.creditsApplied)});await b.commit();}
export async function cancelOrder(o){const b=writeBatch(db);b.update(doc(db,'orders',o.id),{status:'cancelled'});await b.commit();}
