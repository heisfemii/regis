import {naira} from './config';
export const TEMPLATES=[{id:'blank',label:'Blank'},{id:'new',label:'New watch',watch:true},{id:'restock',label:'Back in stock',watch:true},{id:'offer',label:'Special offer'}];
export function fill(id,w){
 const cols=w?(w.colors||[]).map(c=>c.name).filter(Boolean).join(', '):'',d=w?.description?`${w.description}\n\n`:'',av=cols?`Available in: ${cols}.\n`:'';
 if(id==='new'&&w)return {subject:`New at Regis: ${w.name}`,message:`Hi {name},\n\nWe've just added the ${w.name}${w.brand?` by ${w.brand}`:''} to the collection.\n\n${d}${av}Price: ${naira(w.price)}.\n\nTap the button below to take a look. Ready to order? Add it to your cart and send it to us on WhatsApp.`};
 if(id==='restock'&&w)return {subject:`Back in stock: ${w.name}`,message:`Hi {name},\n\nGood news! The ${w.name} is back in stock.\n\n${av}Price: ${naira(w.price)}.\n\nIt went quickly last time, so grab yours while you can.`};
 if(id==='offer')return {subject:'A little something from Regis',message:`Hi {name},\n\n[Describe your offer here, for example: 10% off all watches until Sunday.]\n\nTo claim it, place your order on our website and mention the offer when you message us on WhatsApp.`};
 return {subject:'',message:''};}
