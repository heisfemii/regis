import {useState} from 'react';import {useNavigate,Link} from 'react-router-dom';
import {useCart} from '../context/CartContext';import {useAuth} from '../context/AuthContext';import {useToast} from '../context/ToastContext';
import {createOrder,payWithPaystack,verifyPayment} from '../services/orders';import {naira} from '../services/config';
export default function Cart(){
 const {items,remove,clear,subtotal}=useCart(),{user,profile}=useAuth(),nav=useNavigate(),toast=useToast();
 const [use,setUse]=useState(false),[busy,setBusy]=useState(false);
 const avail=profile?.credits||0,applied=use?Math.min(avail,Math.max(0,subtotal-100)):0,total=subtotal-applied;
 if(!items.length)return <div className="center"><h2>Your cart is empty.</h2><p><Link className="tlink" to="/">Continue shopping ›</Link></p></div>;
 async function pay(){
  if(!user)return nav('/login');
  setBusy(true);let o;
  try{o=await createOrder(user,profile?.name||user.displayName||'Customer',items,applied)}catch{toast('Could not start checkout. Try again.');return setBusy(false)}
  try{await verifyPayment(o.id,await payWithPaystack(o,user.email));clear();nav('/receipt/'+o.id)}
  catch(e){toast(e.message==='closed'?'Payment cancelled':'We could not confirm your payment yet. Please contact support.')}
  setBusy(false);}
 return <div className="box wide"><h2>Your cart</h2>
  {items.map(i=><div className="arow" key={i.key}>{i.image?<img className="thumb" src={i.image} alt=""/>:<div className="thumb"/>}
   <div className="grow"><b>{i.name}</b><p className="muted">{i.color} · {i.strap} · x{i.qty}</p></div><span>{naira(i.price*i.qty)}</span><a href="#" aria-label="Remove" onClick={e=>{e.preventDefault();remove(i.key)}}>✕</a></div>)}
  <div className="row"><span>Subtotal</span><span>{naira(subtotal)}</span></div>
  {user&&avail>0&&<label className="row"><span><input type="checkbox" checked={use} onChange={e=>setUse(e.target.checked)}/> Use my credits ({naira(avail)})</span><span>-{naira(applied)}</span></label>}
  <div className="row"><b>Total</b><b>{naira(total)}</b></div>
  <button disabled={busy} onClick={pay}>{user?`Pay ${naira(total)} with Paystack`:'Log in to check out'}</button>
  <p className="muted">Secure payment by Paystack. Your receipt appears right after.</p></div>;}
