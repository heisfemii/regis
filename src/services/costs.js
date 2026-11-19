import {collection,getDocs,doc,setDoc,serverTimestamp} from 'firebase/firestore';import {db} from './firebase';
// Private per-watch costs (admin-only collection "costs", keyed by watch id): cost = what you paid, delivery = what it cost to get it to you.
export const getCosts=async()=>Object.fromEntries((await getDocs(collection(db,'costs'))).docs.map(d=>[d.id,d.data()]));
export const saveCost=(id,{cost,delivery})=>setDoc(doc(db,'costs',id),{cost:Number(cost),delivery:Number(delivery)||0,updatedAt:serverTimestamp()});