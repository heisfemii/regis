import {createContext,useContext,useState,useCallback} from 'react';
const C=createContext();export const useToast=()=>useContext(C);
export default function ToastProvider({children}){
 const [msg,setMsg]=useState('');
 const toast=useCallback(m=>{setMsg(m);setTimeout(()=>setMsg(''),6000)},[]);
 return <C.Provider value={toast}>{children}{msg&&<div className="toast">{msg}</div>}</C.Provider>;}
