import {init} from './_admin.js';
// Live sitemap at /sitemap.xml: fixed pages plus one URL per watch, read from Firestore each hour.
const SITE='https://regiswatch.com',PAGES=[['/','1.0','weekly'],['/shop','0.9','daily'],['/terms','0.3','yearly'],['/privacy','0.3','yearly'],['/refunds','0.3','yearly']];
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&apos;');
export function buildSitemap(watches=[]){
 const u=(path,p,f,d)=>` <url><loc>${esc(SITE+path)}</loc>${d?`<lastmod>${d}</lastmod>`:''}<changefreq>${f}</changefreq><priority>${p}</priority></url>`;
 return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${[...PAGES.map(([a,p,f])=>u(a,p,f)),...watches.map(w=>u('/watch/'+encodeURIComponent(w.id),'0.8','weekly',w.date))].join('\n')}\n</urlset>\n`}
export default async function handler(req,res){
 let watches=[];
 try{const {db}=await init(),s=await db.collection('watches').get();watches=s.docs.map(d=>{const t=d.data().createdAt?.toDate?.();return{id:d.id,date:t?t.toISOString().slice(0,10):''}})}catch{/* fall back to the fixed pages */}
 res.setHeader('Content-Type','application/xml; charset=utf-8');res.setHeader('Cache-Control','public, s-maxage=3600, stale-while-revalidate=86400');
 res.status(200).send(buildSitemap(watches))}