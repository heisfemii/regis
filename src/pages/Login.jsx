import {useState} from 'react';import {useNavigate,Link} from 'react-router-dom';import {useAuth} from '../context/AuthContext';import {useToast} from '../context/ToastContext';import Google from '../components/Google';import {msg} from '../services/errors';
const OK=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export default function Login(){
 const {login,signup,google,reset}=useAuth(),nav=useNavigate(),toast=useToast(),[mode,setMode]=useState('login'),[f,setF]=useState({name:'',email:'',pw:''}),[busy,setBusy]=useState(''),[err,setErr]=useState('');
 const set=k=>e=>{setF({...f,[k]:e.target.value});setErr('')};
 const go=m=>{setMode(m);setErr('')};
 async function submit(e){
  e.preventDefault();
  if(mode==='signup'&&f.name.trim().length<2)return setErr('Please enter your full name.');
  if(!OK.test(f.email.trim()))return setErr('Please enter a valid email address.');
  if(mode==='forgot'){setBusy('mail');try{await reset(f.email.trim());toast('Reset link sent. Check your inbox and spam folder.');go('login')}catch(x){setErr(msg(x,'We couldn’t send the reset link. Please try again.'))}return setBusy('')}
  if(f.pw.length<6)return setErr('Your password needs at least 6 characters.');
  setBusy('mail');
  try{mode==='login'?await login(f.email.trim(),f.pw):await signup(f.name.trim(),f.email.trim(),f.pw)}
  catch(x){setErr(msg(x,mode==='login'?'We couldn’t log you in. Please try again.':'We couldn’t create your account. Please try again.'))}
  setBusy('');}
 async function viaGoogle(){setBusy('google');setErr('');try{await google()}catch(x){setErr(msg(x,'We couldn’t sign you in with Google. Please try again.'))}setBusy('')}
 const T={login:['Welcome back','Log in to see your credits and orders.'],signup:['Join Regis','Create an account and earn credits on every order.'],forgot:['Reset password','We’ll email you a link to choose a new one.']}[mode];
 return <form className="box auth" onSubmit={submit} noValidate><h2>{T[0]}</h2><p className="muted">{T[1]}</p>
  {mode!=='forgot'&&<><button type="button" className="gbtn" disabled={!!busy} onClick={viaGoogle}><Google/>{busy==='google'?'Opening Google…':'Continue with Google'}</button><div className="or"><span>or</span></div></>}
  {mode==='signup'&&<input placeholder="Full name" autoComplete="name" value={f.name} onChange={set('name')}/>}
  <input placeholder="Email" type="email" autoComplete="email" value={f.email} onChange={set('email')}/>
  {mode!=='forgot'&&<input placeholder="Password" type="password" autoComplete={mode==='login'?'current-password':'new-password'} value={f.pw} onChange={set('pw')}/>}
  {err&&<p className="err" role="alert">{err}</p>}
  {mode==='signup'&&<p className="muted">By creating an account you agree to our <Link to="/terms">Terms</Link> and <Link to="/privacy">Privacy Policy</Link>.</p>}
  <button type="submit" disabled={!!busy}>{busy==='mail'?'Please wait…':mode==='login'?'Log in':mode==='signup'?'Create account':'Send reset link'}</button>
  <p className="muted">{mode==='login'&&<><a href="#" onClick={e=>{e.preventDefault();go('forgot')}}>Forgot password?</a> · </>}
   <a href="#" onClick={e=>{e.preventDefault();go(mode==='signup'?'login':mode==='forgot'?'login':'signup')}}>{mode==='login'?'New here? Create an account':'Back to log in'}</a></p></form>;}