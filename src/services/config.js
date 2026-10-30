export const WHATSAPP_NUMBER='2347035980727'; // customer support only
export const SUPPORT_EMAIL='inbox.regis@gmail.com';
export const CREDIT_RATE=0.01;
export const naira=n=>'₦'+Number(n||0).toLocaleString('en-NG');
export const fmtDate=t=>{const d=t?.toDate?t.toDate():null;return d?d.toLocaleDateString('en-NG',{day:'numeric',month:'short',year:'numeric'}):''};
export const firstName=n=>{const f=(n||'').trim().split(/\s+/)[0]||'there';return f.length>1&&f===f.toUpperCase()?f[0]+f.slice(1).toLowerCase():f};
export const normalizePhone=s=>{let d=String(s||'').replace(/\D/g,'');if(d.startsWith('00'))d=d.slice(2);if(d.startsWith('0')&&d.length===11)d='234'+d.slice(1);else if(d.length===10&&!d.startsWith('0'))d='234'+d;return d};
export const validPhone=d=>/^\d{11,15}$/.test(d);
export const fmtPhone=d=>d.startsWith('234')&&d.length===13?`+234 ${d.slice(3,6)} ${d.slice(6,9)} ${d.slice(9)}`:'+'+d;
