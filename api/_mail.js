import crypto from 'crypto';
export const SITE=()=>process.env.SITE_URL||'https://regiswatch.vercel.app';
export const EMAIL='inbox.regis@gmail.com';
export const fn=n=>{const f=(n||'').trim().split(/\s+/)[0]||'there';return f.length>1&&f===f.toUpperCase()?f[0]+f.slice(1).toLowerCase():f};
export const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const naira=n=>'₦'+Number(n||0).toLocaleString('en-NG');
export const fmtPhone=d=>String(d).startsWith('234')&&String(d).length===13?`+234 ${d.slice(3,6)} ${d.slice(6,9)} ${d.slice(9)}`:'+'+d;
export const cldn=(u,t)=>u&&u.includes('res.cloudinary.com')?u.replace('/upload/',`/upload/${t}/`):u;
export const sign=uid=>process.env.UNSUBSCRIBE_SECRET?crypto.createHmac('sha256',process.env.UNSUBSCRIBE_SECRET).update(String(uid)).digest('hex').slice(0,32):null;
export const unsubUrl=uid=>{const t=sign(uid);return t?`${SITE()}/api/unsubscribe?u=${encodeURIComponent(uid)}&t=${t}`:null};
export const verify=(uid,t)=>{const s=sign(uid);return !!s&&typeof t==='string'&&t.length===s.length&&crypto.timingSafeEqual(Buffer.from(s),Buffer.from(t))};
export async function settings(db){try{return {whatsapp:(await db.collection('settings').doc('site').get()).data()?.whatsapp||'2347035980727'}}catch{return {whatsapp:'2347035980727'}}}
export const para=t=>String(t||'').split(/\n{2,}/).map(p=>`<p style="margin:0 0 16px;font-size:16px;line-height:1.6;color:#111">${esc(p).replace(/\n/g,'<br>')}</p>`).join('');
export const button=(href,label)=>`<a href="${esc(href)}" style="display:inline-block;background:#4a5232;color:#f5f4f0;text-decoration:none;padding:14px 28px;border-radius:980px;font-weight:600;font-size:16px">${esc(label)}</a>`;
export const layout=({body,unsub,wa})=>`<!doctype html><html><body style="margin:0;background:#f5f4f0;font-family:-apple-system,'Segoe UI',Helvetica,Arial,sans-serif;color:#111"><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:32px 16px"><table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%"><tr><td style="padding:0 0 24px;font-weight:700;letter-spacing:.26em;color:#4a5232;font-size:16px">REGIS</td></tr><tr><td style="background:#fff;border-radius:24px;padding:32px">${body}</td></tr><tr><td style="padding:24px 8px;font-size:12px;line-height:1.7;color:#6a6a64">Regis · Nigeria · <a href="mailto:${EMAIL}" style="color:#6a6a64">${EMAIL}</a> · WhatsApp ${esc(fmtPhone(wa))}${unsub?`<br><a href="${esc(unsub)}" style="color:#6a6a64">Unsubscribe</a> from promotional emails.`:''}</td></tr></table></td></tr></table></body></html>`;
export const footText=(wa,unsub)=>`\n\n--\nRegis · Nigeria · ${EMAIL} · WhatsApp ${fmtPhone(wa)}${unsub?`\nUnsubscribe: ${unsub}`:''}`;
export const unsubHeaders=u=>u?{'List-Unsubscribe':`<${u}>, <mailto:${EMAIL}?subject=unsubscribe>`,'List-Unsubscribe-Post':'List-Unsubscribe=One-Click'}:{};
export async function transporter(pool=false){
 if(!process.env.GMAIL_USER||!process.env.GMAIL_APP_PASSWORD)throw new Error('GMAIL_USER or GMAIL_APP_PASSWORD is not set on the server');
 const nodemailer=(await import('nodemailer')).default;
 return nodemailer.createTransport({service:'gmail',pool,maxConnections:3,auth:{user:process.env.GMAIL_USER,pass:process.env.GMAIL_APP_PASSWORD}});}
