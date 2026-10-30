export const WHATSAPP_NUMBER='2347035980727'; // customer support only
export const SUPPORT_EMAIL='inbox.regis@gmail.com';
export const CREDIT_RATE=0.01;
export const naira=n=>'₦'+Number(n||0).toLocaleString('en-NG');
export const fmtDate=t=>{const d=t?.toDate?t.toDate():null;return d?d.toLocaleDateString('en-NG',{day:'numeric',month:'short',year:'numeric'}):''};
export const firstName=n=>{const f=(n||'').trim().split(/\s+/)[0]||'there';return f.length>1&&f===f.toUpperCase()?f[0]+f.slice(1).toLowerCase():f};
