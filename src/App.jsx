import {Routes,Route,Link,Navigate,useLocation} from 'react-router-dom';
import {useAuth} from './context/AuthContext';import {useCart} from './context/CartContext';
import Shop from './pages/Shop';import Cart from './pages/Cart';import Login from './pages/Login';import Account from './pages/Account';import Admin from './pages/Admin';
import {WHATSAPP_NUMBER} from './services/config';
export default function App(){
 const {user,isAdmin,logout,loading}=useAuth(),{count}=useCart(),{pathname}=useLocation();
 if(loading)return <div className="boot">REGIS</div>;
 return <>
  <div className="ann">Nationwide delivery · Order easily on WhatsApp · Earn credits on every order</div>
  <header className="top"><div className="bar"><Link to="/" className="logo">REGIS</Link>
   <nav className="links" aria-label="Main">
    <a href="/#shop" className="hide">Shop</a>
    {isAdmin&&<Link to="/admin">Admin</Link>}
    {user?<><Link to="/account">Account</Link><a href="#" onClick={e=>{e.preventDefault();logout()}}>Logout</a></>:<Link to="/login">Login</Link>}
    <Link to="/cart" className="cartlink" aria-label={`Cart, ${count} items`}>
     <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M6 8h12l1 12H5z M9 8a3 3 0 016 0"/></svg><span className="pill">{count}</span></Link>
   </nav></div></header>
  <div key={pathname} className="page"><Routes>
   <Route path="/" element={<Shop/>}/><Route path="/cart" element={<Cart/>}/><Route path="/login" element={<Login/>}/>
   <Route path="/account" element={user?<Account/>:<Navigate to="/login"/>}/>
   <Route path="/admin" element={isAdmin?<Admin/>:<Navigate to="/"/>}/>
  </Routes></div>
  <footer><div className="wrap foot">
   <div><Link to="/" className="logo">REGIS</Link><p className="muted">Known brands, carefully sourced. Affordable, curated, yours.</p></div>
   <div><h4>Shop</h4><a href="/#shop">Collection</a><Link to="/cart">Cart</Link><Link to={user?'/account':'/login'}>{user?'Account':'Login'}</Link></div>
   <div><h4>Contact</h4><a href={`https://wa.me/${WHATSAPP_NUMBER}`}>WhatsApp</a><a href="https://instagram.com/regis.watch">Instagram</a><a href="https://x.com/Regis_watches">X</a><a href="mailto:inbox.regis@gmail.com">Email</a></div>
  </div></footer></>;}
