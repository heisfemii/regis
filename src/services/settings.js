import {doc,getDoc,setDoc,serverTimestamp} from 'firebase/firestore';import {db} from './firebase';import {WHATSAPP_NUMBER} from './config';
export const loadSettings=async()=>{try{const s=await getDoc(doc(db,'settings','site'));return {whatsapp:s.data()?.whatsapp||WHATSAPP_NUMBER}}catch{return {whatsapp:WHATSAPP_NUMBER}}};
export const saveWhatsapp=n=>setDoc(doc(db,'settings','site'),{whatsapp:n,updatedAt:serverTimestamp()},{merge:true});
