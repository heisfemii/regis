import {useEffect,useMemo,useRef,useState} from 'react';
import {drawContent,blank,TYPES,THEMES,FIELDS,ONE,STARTERS} from '../services/contentArt';
import {buildIdeas,seasonNote,captionOf} from '../services/contentIdeas';
import {cover} from '../services/watches';
import {naira} from '../services/config';
import {useToast} from '../context/ToastContext';
// Admin tab: pick an idea (or start blank), tweak it, then save/print the image and copy the caption.
const CATS=['All','Seasonal','Showcase','Engage','Educate','Quote','Reel'];
const card={background:'#ebe9e2',border:0,borderRadius:14,padding:'12px 14px',textAlign:'left',cursor:'pointer',font:'inherit',display:'flex',flexDirection:'column',gap:4};
export default function ContentStudio({w}){
 const toast=useToast(),init=useRef(false),skip=useRef(false),[s,setS]=useState(()=>blank('promo')),[cap,setCap]=useState(''),[capEd,setCapEd]=useState(false),[url,setUrl]=useState(''),[seed,setSeed]=useState(1),[cat,setCat]=useState('All'),[script,setScript]=useState(null);
 const ideas=useMemo(()=>buildIdeas(w,new Date(),seed),[w,seed]),shown=ideas.filter(i=>cat==='All'||i.cat===cat);
 const set=(k,v)=>setS(p=>({...p,[k]:v})),use=i=>{if(i.spec){setS({...i.spec,count:Math.max(1,i.spec.imgs.filter(Boolean).length)});skip.current=true;setCapEd(false);setCap(i.caption);setScript(null)}else setScript(i)};
 useEffect(()=>{const f=ideas.find(i=>i.spec);if(f&&!init.current){init.current=true;use(f)}},[ideas]);
 useEffect(()=>{let live=true;const t=setTimeout(()=>drawContent(s).then(c=>live&&setUrl(c.toDataURL('image/png'))).catch(()=>live&&toast('We couldn’t draw this image. Please try again.')),200);return()=>{live=false;clearTimeout(t)}},[s]);
 useEffect(()=>{if(skip.current){skip.current=false;return}if(!capEd)setCap(captionOf(s))},[s.type,s.headline,s.sub,s.price,s.code,s.deadline,s.imgs,s.labels]);
 const sel=k=>w.find(a=>cover(a)&&cover(a)===s.imgs[k])?.id||'';
 const pick=(k,id)=>{const x=w.find(a=>a.id===id);setS(p=>{const imgs=[...p.imgs],labels=[...p.labels];imgs[k]=x?cover(x):'';labels[k]=x?`${x.name} · ${naira(x.price)}`:'';const f=imgs.filter(Boolean).length,q={...p,imgs,labels};if(p.type==='spotlight'){if(f===1&&x){q.headline=x.name;q.price=naira(x.price)}else if(f>1)q.price=''}if(p.type==='sale'&&x){q.headline=x.name;q.code=naira(x.price)}return q})};
 const cnt=s.type==='versus'?2:ONE.includes(s.type)?1:Math.max(1,s.count||1),dropLast=()=>setS(p=>{const imgs=[...p.imgs],labels=[...p.labels];imgs[cnt-1]='';labels[cnt-1]='';return{...p,imgs,labels,count:cnt-1}});
 const chips=(v,on,list)=><div className="chips">{list.map(([k,l])=><button type="button" key={k} className={v===k?'on':''} aria-pressed={v===k} onClick={()=>on(k)}>{l}</button>)}</div>;
 const WP=({k,label})=><label style={{display:'block'}}><span className="muted">{label}</span><select value={sel(k)} onChange={e=>pick(k,e.target.value)} style={{width:'100%'}}><option value="">None</option>{w.map(a=>a.id&&<option key={a.id} value={a.id}>{a.name} · {naira(a.price)}</option>)}</select></label>;
 const save=()=>{const a=document.createElement('a');a.href=url;a.download=`regis-${s.type}-${s.format}.png`;a.click()};
 const print=()=>{const v=window.open('');if(!v)return toast('Allow pop-ups to print');v.document.write(`<title>Regis post</title><style>@page{margin:0}body{margin:0;display:flex;justify-content:center}img{max-width:100%;max-height:100vh}</style><img src="${url}" onload="setTimeout(()=>print(),150)">`);v.document.close()};
 const copy=t=>navigator.clipboard.writeText(t).then(()=>toast('Copied'),()=>toast('Could not copy'));
 return <div className="panel"><h2>Content studio</h2>
  <p className="muted">{seasonNote(new Date())}</p>
  <div className="chips" style={{margin:'12px 0'}}>{CATS.map(c=><button type="button" key={c} className={c===cat?'on':''} onClick={()=>setCat(c)}>{c}</button>)}<button type="button" className="pill ghost" onClick={()=>setSeed(n=>n+1)}>Shuffle ideas</button></div>
  <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(210px,1fr))',gap:10,marginBottom:24}}>{shown.map(i=><button type="button" key={i.id} style={card} onClick={()=>use(i)}><span className="muted" style={{fontSize:13}}>{i.cat}{i.spec?'':' · idea, no image'}</span><b>{i.title}</b></button>)}</div>
  {script&&<div style={{background:'#f5f4f0',borderRadius:14,padding:16,marginBottom:24}}><b>{script.title}</b><p style={{margin:'8px 0'}}>{script.script}</p><p className="muted" style={{whiteSpace:'pre-wrap'}}>{script.caption}</p><div className="ctas left"><button className="pill ghost" onClick={()=>copy(script.caption)}>Copy caption</button><button className="pill ghost" onClick={()=>setScript(null)}>Close</button></div></div>}
  <div style={{display:'flex',flexWrap:'wrap',gap:24,alignItems:'flex-start'}}>
   <div style={{flex:'1 1 320px',maxWidth:420,display:'flex',flexDirection:'column',gap:12}}>
    <p className="muted">Type</p>{chips(s.type,t=>{setS(p=>({...blank(t),...(STARTERS[t]||{}),theme:p.theme,format:p.format}));setCapEd(false)},TYPES)}
    <p className="muted">Look</p>{chips(s.theme,v=>set('theme',v),THEMES)}
    <p className="muted">Format</p>{chips(s.format,v=>set('format',v),[['feed','Post 4:5'],['story','Story 9:16']])}
    {['promo','spotlight'].includes(s.type)&&<><p className="muted">Watch display</p>{chips(s.style||'photo',v=>set('style',v),[['photo','Full photo'],['dial','Dial (one watch)']])}</>}
    {['promo','spotlight','versus','sale','giveaway','testimonial'].includes(s.type)&&<>{Array.from({length:cnt},(_,k)=><WP key={k} k={k} label={s.type==='versus'?`Watch ${'AB'[k]}`:`Watch ${k+1}${(s.type==='promo'||s.type==='testimonial')&&k===0?' (optional)':''}`}/>)}
     {['promo','spotlight'].includes(s.type)&&<div className="ctas left">{cnt<4&&<button type="button" className="pill ghost" onClick={()=>set('count',cnt+1)}>Add another watch</button>}{cnt>1&&<button type="button" className="pill ghost" onClick={dropLast}>Remove last watch</button>}</div>}
     {(cnt>1||s.type==='versus')&&<label style={{display:'flex',gap:8,alignItems:'center'}}><input type="checkbox" checked={s.labelsOn!==false} onChange={e=>set('labelsOn',e.target.checked)}/>Show names and prices under the watches</label>}</>}
    {FIELDS[s.type].map(([k,l])=>({tip:'sub',quote:'headline',testimonial:'headline',steps:'sub',giveaway:'sub',greeting:'sub'})[s.type]===k?<textarea key={k} rows={3} placeholder={l} value={s[k]} onChange={e=>set(k,e.target.value)} maxLength={260}/>:<input key={k} placeholder={l} value={s[k]} onChange={e=>set(k,e.target.value)} maxLength={90}/>)}
    {s.type==='promo'&&<p className="muted">The site has no discount-code system, so the offer line is only text on the image. Only promise what you will honour.</p>}
    {s.type==='sale'&&<p className="muted">Check the new price before you post. Picking a watch fills in the old price for you.</p>}
    {s.type==='testimonial'&&<p className="muted">Only use real reviews, and ask the customer first.</p>}
    {s.type==='giveaway'&&<p className="muted">Only promise a prize you will actually give, and pick the winner fairly.</p>}
    <p className="muted">Caption{capEd&&<> · <button type="button" className="tlink" onClick={()=>{setCapEd(false);setCap(captionOf(s))}}>Reset to match the post</button></>}</p><textarea rows={7} value={cap} onChange={e=>{setCap(e.target.value);setCapEd(true)}} placeholder="Caption for Instagram"/>
    <div className="ctas left"><button className="pill" disabled={!url} onClick={save}>Save image</button><button className="pill ghost" disabled={!url} onClick={print}>Print</button><button className="pill ghost" onClick={()=>copy(cap||captionOf(s))}>Copy caption</button></div>
   </div>
   <div style={{flex:'1 1 320px',maxWidth:460}}>{url?<img src={url} alt="Preview" style={{display:'block',width:'100%',borderRadius:12}}/>:<p className="muted">Drawing…</p>}</div>
  </div></div>}