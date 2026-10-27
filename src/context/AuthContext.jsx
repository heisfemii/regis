import {createContext,useContext,useEffect,useState} from 'react';
import {onAuthStateChanged,createUserWithEmailAndPassword,signInWithEmailAndPassword,signOut,updateProfile,GoogleAuthProvider,signInWithPopup} from 'firebase/auth';
import {doc,setDoc,getDoc,onSnapshot,serverTimestamp} from 'firebase/firestore';
import {auth,db} from '../services/firebase';
const C=createContext();export const useAuth=()=>useContext(C);
export default function AuthProvider({children}){
 const [user,setUser]=useState(null),[profile,setProfile]=useState(null),[isAdmin,setAdmin]=useState(false),[loading,setLoading]=useState(true);
 useEffect(()=>{let unsub=()=>{};
  const off=onAuthStateChanged(auth,async u=>{unsub();setUser(u);
   if(!u){setProfile(null);setAdmin(false);setLoading(false);return;}
   unsub=onSnapshot(doc(db,'users',u.uid),s=>setProfile(s.data()||null));
   try{setAdmin((await getDoc(doc(db,'admins',u.uid))).exists())}catch{setAdmin(false)}
   setLoading(false);});
  return()=>{off();unsub();};},[]);
 const signup=async(name,email,pw)=>{const {user:u}=await createUserWithEmailAndPassword(auth,email,pw);
  await updateProfile(u,{displayName:name});
  await setDoc(doc(db,'users',u.uid),{name,email,credits:0,createdAt:serverTimestamp()});};
 const google=async()=>{const {user:u}=await signInWithPopup(auth,new GoogleAuthProvider());
  const ref=doc(db,'users',u.uid);
  if(!(await getDoc(ref)).exists())await setDoc(ref,{name:u.displayName||'Friend',email:u.email,credits:0,createdAt:serverTimestamp()});};
 const login=(e,p)=>signInWithEmailAndPassword(auth,e,p);
 return <C.Provider value={{user,profile,isAdmin,loading,signup,login,google,logout:()=>signOut(auth)}}>{children}</C.Provider>;}
