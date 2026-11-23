import {init} from './_admin.js';
// Plain-HTML version of Regis pages for crawlers (search engines, AI assistants, WhatsApp/social link previews).
// The React site is built in the browser, and most of these crawlers do not run JavaScript, so without this they see an empty page.
const SITE='https://regiswatch.com',IG='https://www.instagram.com/regiswatch.ng/',XH='https://x.com/Regis_watches',MAIL='inbox.regis@gmail.com';
const DESC='Regis. Known brands, carefully sourced. Affordable, curated watches delivered across Nigeria.';
const esc=s=>String(s??'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const js=o=>JSON.stringify(o).replace(/</g,'\\u003c');
const jpg=u=>u&&u.includes('res.cloudinary.com')&&u.includes('/upload/')&&!/\/upload\/[^/]*(f_|q_|w_\d)/.test(u)?u.replace('/upload/','/upload/f_jpg,q_auto,w_1200,c_limit/'):(u||'');
const imgs=w=>[...new Set([w.demo,...(w.colors||[]).flatMap(c=>c.images||[]),w.image].filter(Boolean))].slice(0,6).map(jpg);
const naira=n=>'₦'+Number(n||0).toLocaleString('en-NG');
const nav='<nav><a href="/">Home</a> | <a href="/shop">Shop all watches</a> | <a href="/terms">Terms</a> | <a href="/privacy">Privacy</a> | <a href="/refunds">Refunds</a></nav>';
const org={'@context':'https://schema.org','@type':'Organization',name:'Regis',url:SITE,logo:SITE+'/apple-touch-icon.png',description:DESC,email:MAIL,sameAs:[IG,XH],areaServed:{'@type':'Country',name:'Nigeria'}};
const how=(wa)=>`<h2>How ordering works</h2><ol><li>Pick a watch and colour on regiswatch.com.</li><li>Send the order on WhatsApp and pay Regis directly${wa?` (<a href="https://wa.me/${esc(wa)}">wa.me/${esc(wa)}</a>)`:''}.</li><li>Follow packaging and delivery from your account.</li></ol><p>Email: <a href="mailto:${MAIL}">${MAIL}</a> | Instagram: <a href="${IG}">@regiswatch.ng</a></p>`;
function page({title,desc,path,image,type='website',ld=[],body}){const url=SITE+path;
 return `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>${esc(title)}</title><meta name="description" content="${esc(desc)}"><link rel="canonical" href="${esc(url)}"><meta name="robots" content="index,follow"><meta property="og:site_name" content="Regis"><meta property="og:type" content="${type}"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(desc)}"><meta property="og:url" content="${esc(url)}">${image?`<meta property="og:image" content="${esc(image)}">`:''}<meta name="twitter:card" content="${image?'summary_large_image':'summary'}"><meta name="twitter:title" content="${esc(title)}"><meta name="twitter:description" content="${esc(desc)}">${ld.map(o=>`<script type="application/ld+json">${js(o)}</script>`).join('')}</head><body>${nav}<main>${body}</main></body></html>`}
const list=ws=>`<ul>${ws.map(w=>`<li><a href="/watch/${encodeURIComponent(w.id)}">${esc(w.name)}</a>${w.brand?` by ${esc(w.brand)}`:''}: ${naira(w.price)}${w.inStock===false?' (out of stock)':''}</li>`).join('')}</ul>`;
const itemList=ws=>({'@context':'https://schema.org','@type':'ItemList',itemListElement:ws.map((w,i)=>({'@type':'ListItem',position:i+1,url:`${SITE}/watch/${encodeURIComponent(w.id)}`,name:w.name}))});
export function buildHome(ws,wa){const top=ws.filter(w=>w.featured).slice(0,12);const f=top.length?top:ws.slice(0,12);
 return page({title:'Regis | Curated Watches',desc:DESC,path:'/',ld:[org,{'@context':'https://schema.org','@type':'WebSite',name:'Regis',url:SITE},...(f.length?[itemList(f)]:[])],
  body:`<h1>Regis: curated watches in Nigeria</h1><p>${esc(DESC)}</p>${f.length?`<h2>The latest</h2>${list(f)}`:''}<p><a href="/shop">Shop the full collection</a></p>${how(wa)}`})}
export function buildShop(ws,wa){return page({title:'Shop all watches | Regis',desc:`Browse ${ws.length||'all'} curated watches from Regis, with prices in naira and delivery across Nigeria.`,path:'/shop',ld:[org,itemList(ws)],
 body:`<h1>All watches</h1>${list(ws)}${how(wa)}`})}
export function buildWatch(w,wa){const im=imgs(w),colors=(w.colors||[]).map(c=>c.name).filter(Boolean),desc=[w.description||`${[w.brand,w.name].filter(Boolean).join(' ')} from Regis.`,w.strap&&`Strap: ${w.strap}.`,colors.length&&`Colours: ${colors.join(', ')}.`].filter(Boolean).join(' ');
 const ld={'@context':'https://schema.org','@type':'Product',name:w.name,description:desc,sku:w.id,...(w.brand?{brand:{'@type':'Brand',name:w.brand}}:{}),...(im.length?{image:im}:{}),
  offers:{'@type':'Offer',url:`${SITE}/watch/${encodeURIComponent(w.id)}`,priceCurrency:'NGN',price:String(Number(w.price)||0),availability:w.inStock===false?'https://schema.org/OutOfStock':'https://schema.org/InStock',seller:{'@type':'Organization',name:'Regis'}}};
 return page({title:`${w.name} | Regis`,desc:`${w.name}${w.brand?` by ${w.brand}`:''}, ${naira(w.price)}. ${desc}`.slice(0,300),path:'/watch/'+encodeURIComponent(w.id),image:im[0],type:'product',ld:[ld],
  body:`<h1>${esc(w.name)}</h1>${w.brand?`<p>Brand: ${esc(w.brand)}</p>`:''}<p>Price: ${naira(w.price)}</p><p>${w.inStock===false?'Currently out of stock.':'In stock.'}</p><p>${esc(desc)}</p>${im.map(u=>`<img src="${esc(u)}" alt="${esc(w.name)}" width="600">`).join('')}${how(wa)}`})}
export default async function handler(req,res){
 const type=String(req.query.type||'home'),id=String(req.query.id||'');let html,status=200;
 try{const {db}=await init(),wa=String((await db.collection('settings').doc('site').get()).data()?.whatsapp||'').replace(/\D/g,''),W=/^\d{10,15}$/.test(wa)?wa:'';
  if(type==='watch'){const d=await db.collection('watches').doc(id).get();if(!d.exists){status=404;html='<!doctype html><title>Not found | Regis</title><meta name="robots" content="noindex"><p>This watch is no longer available. <a href="/shop">See all watches</a>.</p>'}else html=buildWatch({id:d.id,...d.data()},W)}
  else{const s=await db.collection('watches').orderBy('createdAt','desc').get(),ws=s.docs.map(d=>({id:d.id,...d.data()}));html=type==='shop'?buildShop(ws,W):buildHome(ws,W)}
 }catch{html=buildHome([],'')}
 res.setHeader('Content-Type','text/html; charset=utf-8');res.setHeader('Cache-Control','public, s-maxage=600, stale-while-revalidate=86400');res.setHeader('Vary','User-Agent');res.status(status).send(html)}