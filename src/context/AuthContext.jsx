import {createContext,useContext,useEffect,useRef,useState} from 'react';
import {onAuthStateChanged,createUserWithEmailAndPassword,signInWithEmailAndPassword,signOut,updateProfile,GoogleAuthProvider,signInWithPopup,signInWithRedirect,getRedirectResult,sendPasswordResetEmail} from 'firebase/auth';
import {doc,setDoc,getDoc,onSnapshot,serverTimestamp} from 'firebase/firestore';
import {auth,db} from '../services/firebase';
const C=createContext();export const useAuth=()=>useContext(C);
export default function AuthProvider({children}){
 const [user,setUser]=useState(null),[profile,setProfile]=useState(null),[isAdmin,setAdmin]=useState(false),[loading,setLoading]=useState(true),signing=useRef(false);
 useEffect(()=>{let unsub=()=>{};
  getRedirectResult(auth).catch(()=>{});
  const off=onAuthStateChanged(auth,async u=>{unsub();setUser(u);
   if(!u){setProfile(null);setAdmin(false);setLoading(false);return;}
   const ref=doc(db,'users',u.uid);
   if(!signing.current){try{if(!(await getDoc(ref)).exists())await setDoc(ref,{name:u.displayName||(u.email||'Friend').split('@')[0],email:u.email,credits:0,marketing:true,createdAt:serverTimestamp()})}catch{}}
   unsub=onSnapshot(ref,s=>setProfile(s.data()||null),()=>{});
   try{setAdmin((await getDoc(doc(db,'admins',u.uid))).exists())}catch{setAdmin(false)}
   setLoading(false);});
  return()=>{off();unsub();};},[]);
 const signup=async(name,email,pw)=>{signing.current=true;
  try{const {user:u}=await createUserWithEmailAndPassword(auth,email,pw);await updateProfile(u,{displayName:name});
   await setDoc(doc(db,'users',u.uid),{name,email,credits:0,marketing:true,createdAt:serverTimestamp()});}
  finally{signing.current=false}};
 const login=(e,p)=>signInWithEmailAndPassword(auth,e,p);
 const google=async()=>{const p=new GoogleAuthProvider();p.setCustomParameters({prompt:'select_account'});
  try{await signInWithPopup(auth,p)}catch(e){if(e.code==='auth/popup-blocked'){await signInWithRedirect(auth,p);return}throw e}};
 const reset=email=>sendPasswordResetEmail(auth,email);
 return <C.Provider value={{user,profile,isAdmin,loading,signup,login,google,reset,logout:()=>signOut(auth)}}>{children}</C.Provider>;}
