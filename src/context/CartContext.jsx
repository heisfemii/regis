import {createContext,useContext,useState,useEffect} from 'react';
const C=createContext();export const useCart=()=>useContext(C);
export default function CartProvider({children}){
 const [items,setItems]=useState(()=>{try{return JSON.parse(localStorage.getItem('cart2'))||[]}catch{return[]}});
 useEffect(()=>{try{localStorage.setItem('cart2',JSON.stringify(items))}catch{}},[items]);
 const add=(w,c)=>{const key=w.id+'|'+c.name;setItems(p=>p.find(i=>i.key===key)?p.map(i=>i.key===key?{...i,qty:i.qty+1}:i):[...p,{key,id:w.id,name:w.name,brand:w.brand||'',strap:w.strap||'',price:w.price,color:c.name,image:c.images?.[0]||'',qty:1}])};
 const remove=key=>setItems(p=>p.filter(i=>i.key!==key));
 const clear=()=>setItems([]);
 const setQty=(key,q)=>setItems(p=>q<1?p.filter(i=>i.key!==key):p.map(i=>i.key===key?{...i,qty:Math.min(q,10)}:i));
 return <C.Provider value={{items,add,remove,clear,setQty,subtotal:items.reduce((s,i)=>s+i.price*i.qty,0),count:items.reduce((s,i)=>s+i.qty,0)}}>{children}</C.Provider>;}
