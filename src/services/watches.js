import {collection,getDocs,addDoc,updateDoc,deleteDoc,doc,serverTimestamp,query,orderBy} from 'firebase/firestore';
import {db} from './firebase';
export const listWatches=async()=>(await getDocs(query(collection(db,'watches'),orderBy('createdAt','desc')))).docs.map(d=>({id:d.id,...d.data()}));
export const addWatch=w=>addDoc(collection(db,'watches'),{...w,createdAt:serverTimestamp()});
export const updateWatch=(id,w)=>updateDoc(doc(db,'watches',id),w);
export const deleteWatch=id=>deleteDoc(doc(db,'watches',id));
export async function uploadImage(file){
 const e=import.meta.env,f=new FormData();f.append('file',file);f.append('upload_preset',e.VITE_CLOUDINARY_PRESET);
 const r=await fetch(`https://api.cloudinary.com/v1_1/${e.VITE_CLOUDINARY_CLOUD}/image/upload`,{method:'POST',body:f});
 if(!r.ok)throw new Error('Image upload failed');return (await r.json()).secure_url;}
