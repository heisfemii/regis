import {Routes,Route,Link,Navigate,useLocation} from 'react-router-dom';
import {useAuth} from './context/AuthContext';import {useCart} from './context/CartContext';
import Shop from './pages/Shop';import Watch from './pages/Watch';import Cart from './pages/Cart';import Login from './pages/Login';import Account from './pages/Account';import Admin from './pages/Admin';import Receipt from './pages/Receipt';
import {WHATSAPP_NUMBER,SUPPORT_EMAIL} from './services/config';
export default function App(){
 const {user,isAdmin,logout,loading}=useAuth(),{count}=useCart(),{pathname}=useLocation();
 if(loading)return <div className="boot">REGIS</div>;
 return <>
  <div className="ann">Order on WhatsApp · Nationwide delivery · Earn credits on every order</div>
  <header className="top"><div className="bar"><Link to="/" className="logo">REGIS</Link>
   <nav className="mid" aria-label="Main"><a href="/#latest">Latest</a><a href="/#shop">Shop</a><a href="/#how">How it works</a></nav>
   <div className="right">
    {isAdmin&&<Link to="/admin">Admin</Link>}
    {user?<><Link to="/account">Account</Link><a href="#" onClick={e=>{e.preventDefault();logout()}}>Logout</a></>:<Link to="/login">Log in</Link>}
    <Link to="/cart" className="bag" aria-label={`Cart, ${count} items`}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 8h12l1 12H5z M9 8a3 3 0 016 0"/></svg>{count>0&&<span className="dot">{count}</span>}</Link>
   </div></div></header>
  <div key={pathname} className="page"><Routes>
   <Route path="/" element={<Shop/>}/><Route path="/watch/:id" element={<Watch/>}/><Route path="/cart" element={<Cart/>}/><Route path="/login" element={<Login/>}/>
   <Route path="/account" element={user?<Account/>:<Navigate to="/login"/>}/><Route path="/receipt/:id" element={user?<Receipt/>:<Navigate to="/login"/>}/>
   <Route path="/admin" element={isAdmin?<Admin/>:<Navigate to="/"/>}/>
  </Routes></div>
  <footer><div className="fwrap">
   <p className="fnote">Regis sells watches under their real brand names. Prices are in Naira (₦). Payment is confirmed with you directly on WhatsApp.</p>
   <div className="fcols">
    <div><h4>Shop</h4><a href="/#latest">The latest</a><a href="/#shop">Collection</a><Link to="/cart">Cart</Link></div>
    <div><h4>Account</h4><Link to={user?'/account':'/login'}>{user?'My account':'Log in'}</Link><Link to="/login">Create account</Link></div>
    <div><h4>Customer support</h4><a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noreferrer">WhatsApp</a><a href={`https://mail.google.com/mail/?view=cm&fs=1&to=${SUPPORT_EMAIL}`} target="_blank" rel="noreferrer">Email support</a></div>
    <div><h4>Follow</h4><a href="https://instagram.com/regis.watch" target="_blank" rel="noreferrer">Instagram</a><a href="https://x.com/Regis_watches" target="_blank" rel="noreferrer">X</a></div>
   </div>
   <p className="legal">Copyright © {new Date().getFullYear()} Regis. All rights reserved. Nigeria.</p>
  </div></footer></>;}
