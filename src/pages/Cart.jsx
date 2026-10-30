import {useState} from 'react';import {useNavigate,Link} from 'react-router-dom';
import {useCart} from '../context/CartContext';import {useAuth} from '../context/AuthContext';import {useToast} from '../context/ToastContext';
import {createOrder,whatsappLink} from '../services/orders';import {getWatch} from '../services/watches';import {naira} from '../services/config';import {msg,withTimeout} from '../services/errors';import {useSettings} from '../context/SettingsContext';
export default function Cart(){
 const {whatsapp}=useSettings(),{items,remove,clear,setQty,subtotal}=useCart(),{user,profile}=useAuth(),nav=useNavigate(),toast=useToast();
 const [use,setUse]=useState(false),[busy,setBusy]=useState(false);
 const avail=profile?.credits||0,applied=use?Math.min(avail,subtotal):0,total=subtotal-applied;
 if(!items.length)return <div className="center"><h2>Your cart is empty.</h2><p><Link className="tlink" to="/">Continue shopping ›</Link></p></div>;
 async function order(){
  if(!user)return nav('/login');
  setBusy(true);
  try{
   const fresh=await withTimeout(Promise.all(items.map(i=>getWatch(i.id))));
   const bad=items.filter((i,n)=>!fresh[n]||!fresh[n].inStock||fresh[n].price!==i.price);
   if(bad.length){const b=bad[0],f=fresh[items.indexOf(b)];bad.forEach(i=>remove(i.key));
    toast(!f||!f.inStock?`${b.name} is no longer available, so we removed it from your cart.`:`The price of ${b.name} has changed, so we removed it. Please add it again to continue.`);return setBusy(false)}
   const ap=Math.min(applied,subtotal);
   const o=await withTimeout(createOrder(user,profile?.name||user.displayName||'Customer',items,ap));
   clear();window.location.href=whatsappLink(o,whatsapp);
  }catch(e){toast(msg(e,'We couldn’t place your order. Please try again.'));setBusy(false)}}
 return <div className="box wide"><h2>Your cart</h2>
  {items.map(i=><div className="arow" key={i.key}>{i.image?<img className="thumb" src={i.image} alt=""/>:<div className="thumb"/>}
   <div className="grow"><b>{i.name}</b><p className="muted">{i.color} · {i.strap}</p></div>
   <div className="qty"><button aria-label="Decrease quantity" onClick={()=>setQty(i.key,i.qty-1)}>−</button><span>{i.qty}</span><button aria-label="Increase quantity" onClick={()=>setQty(i.key,i.qty+1)}>+</button></div>
   <span>{naira(i.price*i.qty)}</span><a href="#" aria-label="Remove" onClick={e=>{e.preventDefault();remove(i.key)}}>✕</a></div>)}
  <div className="row"><span>Subtotal</span><span>{naira(subtotal)}</span></div>
  {user&&avail>0&&<label className="row"><span><input type="checkbox" checked={use} onChange={e=>setUse(e.target.checked)}/> Use my credits ({naira(avail)})</span><span>-{naira(applied)}</span></label>}
  <div className="row"><b>Total</b><b>{naira(total)}</b></div>
  <button disabled={busy} onClick={order}>{busy?'Placing your order…':user?'Order on WhatsApp':'Log in to order'}</button>
  <p className="muted">We confirm your payment on WhatsApp, then you can follow packaging and delivery in your account.</p></div>;}
