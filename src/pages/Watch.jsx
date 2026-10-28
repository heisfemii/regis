import {useEffect,useState} from 'react';import {useParams,useNavigate,Link} from 'react-router-dom';
import {getWatch,colorsOf} from '../services/watches';import {useCart} from '../context/CartContext';import {useToast} from '../context/ToastContext';import {naira} from '../services/config';
export default function Watch(){
 const {id}=useParams(),nav=useNavigate(),{add}=useCart(),toast=useToast();
 const [w,setW]=useState(undefined),[ci,setCi]=useState(0),[pi,setPi]=useState(0);
 useEffect(()=>{getWatch(id).then(setW).catch(()=>setW(null))},[id]);
 if(w===undefined)return <p className="center">Loading…</p>;
 if(!w)return <div className="center"><h2>Watch not found.</h2><Link className="tlink" to="/">Back to shop ›</Link></div>;
 const cols=colorsOf(w),col=cols[ci],imgs=col.images||[];
 return <div className="detail"><div className="gal"><div className="main">{imgs[pi]?<img key={imgs[pi]} src={imgs[pi]} alt={`${w.name} in ${col.name}`}/>:<span aria-hidden="true">⌚</span>}</div>
  {imgs.length>1&&<div className="thumbs">{imgs.map((s,i)=><button key={s} className={i===pi?'on':''} onClick={()=>setPi(i)} aria-label={`View image ${i+1}`}><img src={s} alt=""/></button>)}</div>}</div>
  <div className="info"><p className="eyebrow">{w.brand}</p><h1>{w.name}</h1><p className="price big">{naira(w.price)}</p>
   {w.description&&<p className="lead">{w.description}</p>}
   <p className="muted">Colour · <b>{col.name}</b></p>
   <div className="cols">{cols.map((c,i)=><button key={c.name} className={'sw'+(i===ci?' on':'')} onClick={()=>{setCi(i);setPi(0)}}><span className="c">{c.images?.[0]?<img src={c.images[0]} alt=""/>:'⌚'}</span>{c.name}</button>)}</div>
   {w.strap&&<p className="muted">Strap · <b>{w.strap}</b></p>}
   {w.inStock?<div className="ctas left"><button className="pill" onClick={()=>{add(w,col);toast('Added to cart')}}>Add to cart</button><button className="pill ghost" onClick={()=>{add(w,col);nav('/cart')}}>Buy now</button></div>:<button className="pill" disabled>Sold out</button>}
  </div></div>;}
