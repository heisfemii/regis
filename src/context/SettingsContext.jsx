import {createContext,useContext,useEffect,useState} from 'react';import {loadSettings} from '../services/settings';import {WHATSAPP_NUMBER} from '../services/config';
const C=createContext({whatsapp:WHATSAPP_NUMBER,setWhatsapp(){}});export const useSettings=()=>useContext(C);
export default function SettingsProvider({children}){
 const [whatsapp,setWhatsapp]=useState(WHATSAPP_NUMBER);
 useEffect(()=>{loadSettings().then(s=>setWhatsapp(s.whatsapp))},[]);
 return <C.Provider value={{whatsapp,setWhatsapp}}>{children}</C.Provider>;}
