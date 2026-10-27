import {useState} from 'react';import {useNavigate} from 'react-router-dom';import {useAuth} from '../context/AuthContext';import {useToast} from '../context/ToastContext';
export default function Login(){
 const {login,signup,google}=useAuth(),nav=useNavigate(),toast=useToast(),[mode,setMode]=useState('login'),[f,setF]=useState({name:'',email:'',pw:''}),[busy,setBusy]=useState(false);
 const set=k=>e=>setF({...f,[k]:e.target.value});
 const run=async fn=>{setBusy(true);try{await fn();nav('/')}catch(e){if(e.code!=='auth/popup-closed-by-user')toast(e.code==='auth/weak-password'?'Password must be 6+ characters':'Something went wrong. Check and try again.')}setBusy(false)};
 return <div className="box auth"><h2>{mode==='login'?'Welcome back':'Join Regis'}</h2><p className="muted">Earn credits on every order.</p>
  <button className="gbtn" disabled={busy} onClick={()=>run(google)}><b>G</b> Continue with Google</button>
  <div className="or"><span>or</span></div>
  {mode==='signup'&&<input placeholder="Full name" value={f.name} onChange={set('name')}/>}
  <input placeholder="Email" type="email" value={f.email} onChange={set('email')}/><input placeholder="Password" type="password" value={f.pw} onChange={set('pw')}/>
  <button disabled={busy} onClick={()=>run(()=>mode==='login'?login(f.email,f.pw):signup(f.name,f.email,f.pw))}>{mode==='login'?'Log in':'Create account'}</button>
  <p className="muted"><a href="#" onClick={e=>{e.preventDefault();setMode(mode==='login'?'signup':'login')}}>{mode==='login'?'New here? Create an account':'Have an account? Log in'}</a></p></div>;}
