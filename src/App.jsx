import {useEffect,useState} from 'react';
import {Routes,Route,Link,Navigate,useLocation} from 'react-router-dom';
import {useAuth} from './context/AuthContext';import {useCart} from './context/CartContext';
import Home from './pages/Home';import Shop from './pages/Shop';import Watch from './pages/Watch';import Cart from './pages/Cart';import Login from './pages/Login';import Account from './pages/Account';import Admin from './pages/Admin';import Receipt from './pages/Receipt';import NotFound from './pages/NotFound';
import Offline from './components/Offline';import Loader from './components/Loader';import ErrorBoundary from './components/ErrorBoundary';import {listWatches,cover} from './services/watches';import {preload} from './services/preload';import {SUPPORT_EMAIL} from './services/config';import SettingsProvider,{useSettings} from './context/SettingsContext';import CookieNotice from './components/CookieNotice';import Legal from './pages/Legal';
function Shell(){
 const {whatsapp}=useSettings(),{user,isAdmin,logout,loading}=useAuth(),{count}=useCart(),{pathname,hash}=useLocation();
 useEffect(()=>{if(!hash){window.scrollTo(0,0);return}let n=0;const t=setInterval(()=>{const el=document.getElementById(hash.slice(1));if(el){el.scrollIntoView({behavior:'smooth'});clearInterval(t)}else if(++n>30)clearInterval(t)},100);return()=>clearInterval(t)},[pathname,hash]);
 useEffect(()=>{let t=0;const on=()=>{if(t)return;t=requestAnimationFrame(()=>{t=0;const y=window.scrollY,h=document.documentElement;h.style.setProperty('--sy',y);h.style.setProperty('--p',y/Math.max(1,h.scrollHeight-window.innerHeight));document.body.classList.toggle('scrolled',y>8)})};
  on();window.addEventListener('scroll',on,{passive:true});window.addEventListener('resize',on);return()=>{window.removeEventListener('scroll',on);window.removeEventListener('resize',on)}},[]);
 useEffect(()=>{const m=e=>{const c=e.target.closest?.('.card,.rcard,.feat');if(!c)return;const r=c.getBoundingClientRect();c.style.setProperty('--mx',e.clientX-r.left+'px');c.style.setProperty('--my',e.clientY-r.top+'px')};
  document.addEventListener('mousemove',m);return()=>document.removeEventListener('mousemove',m)},[]);
 const [booted,setBooted]=useState(false);
 useEffect(()=>{listWatches().then(l=>preload(['/hero-watch.png',...l.slice(0,30).map(x=>cover(x))],8000)).catch(()=>{}).finally(()=>setBooted(true))},[]);
 if(loading||!booted)return <Loader/>;
 const out=<a href="#" onClick={e=>{e.preventDefault();logout()}}>Logout</a>;
 return <>
  <div className="progress" aria-hidden="true"/><Offline/>
  <div className="ann">Order on WhatsApp · Nationwide delivery · Earn credits on every order</div>
  <header className="top"><div className="bar"><Link to="/" className="logo">REGIS</Link>
   <nav className="mid" aria-label="Main"><Link to="/#latest">Latest</Link><Link to="/shop">Shop</Link><Link to="/#how">How it works</Link></nav>
   <div className="right">
    {isAdmin?<><Link to="/admin">Dashboard</Link><Link to="/">View store</Link>{out}</>
    :<>{user?<><Link to="/account">Account</Link>{out}</>:<Link to="/login">Log in</Link>}
     <Link to="/cart" className="bag" aria-label={`Cart, ${count} items`}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 8h12l1 12H5z M9 8a3 3 0 016 0"/></svg>{count>0&&<span className="dot" key={count}>{count}</span>}</Link></>}
   </div></div></header>
  <div key={pathname} className="page"><ErrorBoundary><Routes>
   <Route path="/" element={<Home/>}/><Route path="/shop" element={<Shop/>}/><Route path="/watch/:id" element={<Watch/>}/><Route path="/cart" element={<Cart/>}/>
   <Route path="/login" element={user?<Navigate to="/"/>:<Login/>}/>
   <Route path="/account" element={user?<Account/>:<Navigate to="/login"/>}/><Route path="/receipt/:id" element={user?<Receipt/>:<Navigate to="/login"/>}/>
   <Route path="/admin" element={isAdmin?<Admin/>:<Navigate to="/"/>}/><Route path="/terms" element={<Legal doc="terms"/>}/><Route path="/privacy" element={<Legal doc="privacy"/>}/><Route path="/refunds" element={<Legal doc="refunds"/>}/><Route path="*" element={<NotFound/>}/>
  </Routes></ErrorBoundary></div>
  <footer><div className="fwrap">
   <p className="fnote">Prices are in Naira (₦). Payment is confirmed with you directly on WhatsApp.</p>
   <div className="fcols">
    <div><h4>Shop</h4><Link to="/#latest">The latest</Link><Link to="/shop">Collection</Link>{!isAdmin&&<Link to="/cart">Cart</Link>}</div>
    {!isAdmin&&<div><h4>Account</h4>{user?<Link to="/account">My account</Link>:<><Link to="/login">Log in</Link><Link to="/login">Create account</Link></>}</div>}
    <div><h4>Customer support</h4><a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noreferrer">WhatsApp</a><a href={`https://mail.google.com/mail/?view=cm&fs=1&to=${SUPPORT_EMAIL}`} target="_blank" rel="noreferrer">Email support</a></div>
    <div><h4>Legal</h4><Link to="/terms">Terms of Service</Link><Link to="/privacy">Privacy Policy</Link><Link to="/refunds">Refunds and delivery</Link></div><div><h4>Follow</h4><a href="https://instagram.com/regis.watch" target="_blank" rel="noreferrer">Instagram</a><a href="https://x.com/Regis_watches" target="_blank" rel="noreferrer">X</a></div>
   </div>
   <p className="legal">Copyright © {new Date().getFullYear()} Regis. All rights reserved. Nigeria.</p>
  </div></footer><CookieNotice/></>;}
export default function App(){return <SettingsProvider><Shell/></SettingsProvider>}
