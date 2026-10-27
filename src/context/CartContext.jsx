import {createContext,useContext,useState,useEffect} from 'react';
const C=createContext();export const useCart=()=>useContext(C);
export default function CartProvider({children}){
 const [items,setItems]=useState(()=>{try{return JSON.parse(localStorage.getItem('cart'))||[]}catch{return[]}});
 useEffect(()=>{try{localStorage.setItem('cart',JSON.stringify(items))}catch{}},[items]);
 const add=w=>setItems(p=>p.find(i=>i.id===w.id)?p.map(i=>i.id===w.id?{...i,qty:i.qty+1}:i):[...p,{...w,qty:1}]);
 const remove=id=>setItems(p=>p.filter(i=>i.id!==id));
 const clear=()=>setItems([]);
 const subtotal=items.reduce((s,i)=>s+i.price*i.qty,0);
 return <C.Provider value={{items,add,remove,clear,subtotal,count:items.reduce((s,i)=>s+i.qty,0)}}>{children}</C.Provider>;}
