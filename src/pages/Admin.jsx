import {useEffect,useState} from 'react';
import {listWatches,addWatch,deleteWatch,updateWatch,uploadImage} from '../services/watches';import {allOrders,markPaid,cancelOrder} from '../services/orders';
import {useToast} from '../context/ToastContext';import {naira} from '../services/config';
const blank={name:'',brand:'',color:'',strap:'',price:'',image:'',inStock:true};
export default function Admin(){
 const toast=useToast(),[w,setW]=useState([]),[o,setO]=useState([]),[f,setF]=useState(blank),[busy,setBusy]=useState(false);
 const load=()=>{listWatches().then(setW);allOrders().then(setO)};useEffect(load,[]);
 const set=k=>e=>setF({...f,[k]:e.target.value});
 async function pic(e){const file=e.target.files[0];if(!file)return;setBusy(true);try{setF({...f,image:await uploadImage(file)})}catch{toast('Upload failed. Paste an image URL instead.')}setBusy(false)}
 async function save(){if(!f.name||!f.price)return toast('Name and price required');setBusy(true);
  try{await addWatch({...f,price:Number(f.price)});setF(blank);toast('Watch added');load()}catch{toast('Could not save')}setBusy(false)}
 const act=fn=>async o=>{try{await fn(o);toast('Done');load()}catch{toast('Failed')}};
 return <><div className="box"><h2>Add watch</h2>
  {['name','brand','color','strap'].map(k=><input key={k} placeholder={k[0].toUpperCase()+k.slice(1)} value={f[k]} onChange={set(k)}/>)}
  <input placeholder="Price (₦)" type="number" value={f.price} onChange={set('price')}/>
  <input type="file" accept="image/*" onChange={pic}/><input placeholder="…or image URL" value={f.image} onChange={set('image')}/>
  <label><input type="checkbox" checked={f.inStock} onChange={e=>setF({...f,inStock:e.target.checked})}/> In stock</label>
  <button disabled={busy} onClick={save}>Add watch</button></div>
  <div className="box"><h2>Watches</h2>{w.map(x=><div className="row" key={x.id}><span>{x.name} · {naira(x.price)}</span><span>
   <a href="#" onClick={e=>{e.preventDefault();updateWatch(x.id,{inStock:!x.inStock}).then(load)}}>{x.inStock?'Mark sold out':'Restock'}</a>{' | '}
   <a href="#" onClick={e=>{e.preventDefault();window.confirm('Delete?')&&deleteWatch(x.id).then(load)}}>Delete</a></span></div>)}</div>
  <div className="box"><h2>Orders</h2>{o.map(x=><div className="row" key={x.id}><span>#{x.id.slice(0,8).toUpperCase()} · {x.customer}<br/><small>{x.items.map(i=>`${i.name} (${i.color}, ${i.strap}) x${i.qty}`).join('; ')}</small></span>
   <span>{naira(x.total)} · {x.status}{x.status==='pending'&&<><br/><a href="#" onClick={e=>{e.preventDefault();window.confirm('Confirm payment received?')&&act(markPaid)(x)}}>Mark paid</a>{' | '}<a href="#" onClick={e=>{e.preventDefault();act(cancelOrder)(x)}}>Cancel</a></>}</span></div>)}</div></>;}
