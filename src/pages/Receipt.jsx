import {useEffect,useState} from 'react';import {useParams,Link} from 'react-router-dom';import {getOrder} from '../services/orders';import {naira,fmtDate} from '../services/config';import {useToast} from '../context/ToastContext';
const load=s=>new Promise(r=>{if(!s)return r(null);const i=new Image();i.crossOrigin='anonymous';i.onload=()=>r(i);i.onerror=()=>r(null);i.src=s});
async function draw(o){
 await Promise.all([document.fonts.load('100px Anton'),document.fonts.load('600 40px Inter'),document.fonts.load('400 40px Inter')]);
 const W=1080,c=document.createElement('canvas');c.width=W;c.height=1920;const x=c.getContext('2d');
 x.fillStyle='#f5f4f0';x.fillRect(0,0,W,1920);
 const T=(s,px,y,col='#111',w=600,f='Inter',al='center',X=W/2)=>{x.font=`${w} ${px}px ${f},sans-serif`;x.fillStyle=col;x.textAlign=al;x.fillText(s,X,y)};
 T('REGIS',96,190,'#4a5232',400,'Anton');T('Thank you.',132,430,'#111',700);T('Your order is confirmed.',44,500,'#6a6a64',400);
 x.fillStyle='#fff';x.beginPath();x.roundRect(60,580,960,1000,48);x.fill();
 let y=640;
 for(const i of o.items.slice(0,4)){const im=await load(i.image);
  x.save();x.beginPath();x.roundRect(100,y,150,150,28);x.clip();x.fillStyle='#f5f4f0';x.fillRect(100,y,150,150);
  if(im){const r=Math.min(im.width,im.height);x.drawImage(im,(im.width-r)/2,(im.height-r)/2,r,r,100,y,150,150)}x.restore();
  T(i.name.slice(0,24),40,y+60,'#111',600,'Inter','left',280);T(`${i.color} · x${i.qty}`,32,y+110,'#6a6a64',400,'Inter','left',280);T(naira(i.price*i.qty),38,y+60,'#111',600,'Inter','right',980);y+=200}
 x.fillStyle='#dcd9cf';x.fillRect(100,1360,880,2);
 T('Total',44,1440,'#111',600,'Inter','left',100);T(naira(o.total),56,1440,'#111',700,'Inter','right',980);
 if(o.creditsApplied)T(`Credits applied  -${naira(o.creditsApplied)}`,32,1495,'#6a6a64',400,'Inter','left',100);
 if(o.creditsEarned)T(`+${naira(o.creditsEarned)} credits earned`,38,1550,'#4a5232',600,'Inter','left',100);
 T('#'+o.id.slice(0,8).toUpperCase()+' · '+fmtDate(o.paidAt||o.createdAt),32,1700,'#6a6a64',400);T('regiswatch.vercel.app',34,1790,'#4a5232',600);
 return c}
export default function Receipt(){
 const {id}=useParams(),toast=useToast(),[o,setO]=useState(undefined);
 useEffect(()=>{getOrder(id).then(setO).catch(()=>setO(null))},[id]);
 if(o===undefined)return <p className="center">Loading…</p>;
 if(!o)return <div className="center"><h2>Receipt not found.</h2><Link className="tlink" to="/account">My account ›</Link></div>;
 const blob=async()=>new Promise(r=>draw(o).then(c=>c.toBlob(r,'image/png')));
 const save=async()=>{try{const a=document.createElement('a');a.href=URL.createObjectURL(await blob());a.download='regis-receipt.png';a.click()}catch{toast('Could not save image')}};
 const share=async()=>{try{const f=new File([await blob()],'regis-receipt.png',{type:'image/png'});if(navigator.canShare?.({files:[f]}))await navigator.share({files:[f],title:'My Regis order'});else save()}catch{}};
 return <div className="rcpt"><div className="slip"><p className="logo">REGIS</p><h1>Thank you.</h1><p className="muted">{o.status==='paid'?'Your order is confirmed.':'Awaiting payment confirmation.'}</p>
  <div className="items">{o.items.map((i,n)=><div className="arow" key={n}>{i.image?<img className="thumb" src={i.image} alt=""/>:<div className="thumb"/>}<div className="grow left"><b>{i.name}</b><p className="muted">{i.color} · x{i.qty}</p></div><span>{naira(i.price*i.qty)}</span></div>)}</div>
  <div className="row"><b>Total</b><b>{naira(o.total)}</b></div>
  {o.creditsApplied>0&&<div className="row"><span className="muted">Credits applied</span><span className="muted">-{naira(o.creditsApplied)}</span></div>}
  {o.creditsEarned>0&&<p className="earn">+{naira(o.creditsEarned)} credits earned</p>}
  <p className="muted">#{o.id.slice(0,8).toUpperCase()} · {fmtDate(o.paidAt||o.createdAt)}</p></div>
  <div className="ctas"><button className="pill" onClick={save}>Save for your story</button><button className="pill ghost" onClick={share}>Share</button></div></div>;}
