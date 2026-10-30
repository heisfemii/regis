const N=n=>'₦'+Number(n||0).toLocaleString('en-NG');
const th=u=>u&&u.includes('res.cloudinary.com')?u.replace('/upload/','/upload/w_240,h_240,c_fill,q_auto,f_jpg/'):u;
export async function drawReceipt({createCanvas,loadImage},d,F){
 F=F||{sans:'RegisSans, Helvetica, Arial, sans-serif',bold:'RegisBold, Helvetica, Arial, sans-serif'};
 const rows=d.items.slice(0,5),extra=d.items.length-rows.length,RH=150,W=900,yRows=480,yDiv=yRows+rows.length*RH+(extra>0?60:0),yTotal=yDiv+85;
 let y=yTotal;const lines=[];
 if(d.creditsApplied){y+=55;lines.push(['Credits applied','-'+N(d.creditsApplied),y,'#6a6a64',400])}
 if(d.creditsEarned){y+=60;lines.push(['Credits earned','+'+N(d.creditsEarned),y,'#4a5232',700])}
 const yMeta=y+85,bottom=yMeta+45,H=bottom+150;
 const imgs=await Promise.all(rows.map(async i=>{try{return await Promise.race([loadImage(th(i.image)),new Promise((_,r)=>setTimeout(r,6000))])}catch{return null}}));
 const c=createCanvas(W,H),x=c.getContext('2d');
 const T=(s,sz,X,Y,{col='#111',w=400,al='left',f=F.sans}={})=>{x.font=`${w>=600?'bold ':''}${sz}px ${w>=600?F.bold:f}`;x.fillStyle=col;x.textAlign=al;x.fillText(s,X,Y)};
 const rr=(X,Y,w,h,r)=>{x.beginPath();x.moveTo(X+r,Y);x.arcTo(X+w,Y,X+w,Y+h,r);x.arcTo(X+w,Y+h,X,Y+h,r);x.arcTo(X,Y+h,X,Y,r);x.arcTo(X,Y,X+w,Y,r);x.closePath()};
 const fit=(s,sz,max)=>{x.font=`bold ${sz}px ${F.bold}`;let t=String(s);while(x.measureText(t).width>max&&t.length>3)t=t.slice(0,-2);return t===String(s)?t:t.trim()+'…'};
 x.fillStyle='#f5f4f0';x.fillRect(0,0,W,H);
 T('R E G I S',44,W/2,130,{col:'#4a5232',w:700,al:'center'});T('Thank you.',120,W/2,300,{w:700,al:'center'});T('Your payment is confirmed.',38,W/2,370,{col:'#6a6a64',al:'center'});
 x.fillStyle='#fff';rr(40,420,820,bottom-420,40);x.fill();
 rows.forEach((it,n)=>{const Y=yRows+n*RH;x.save();rr(80,Y,110,110,22);x.clip();x.fillStyle='#f5f4f0';x.fillRect(80,Y,110,110);const im=imgs[n];if(im){const r=Math.min(im.width,im.height);x.drawImage(im,(im.width-r)/2,(im.height-r)/2,r,r,80,Y,110,110)}x.restore();
  T(fit(it.name,34,420),34,215,Y+45,{w:700});T(`${it.color||''} · x${it.qty}`,28,215,Y+90,{col:'#6a6a64'});T(N(it.price*it.qty),34,820,Y+45,{w:700,al:'right'})});
 if(extra>0)T(`+ ${extra} more item${extra>1?'s':''}`,28,80,yDiv-20,{col:'#6a6a64'});
 x.fillStyle='#e4e0d6';x.fillRect(80,yDiv,740,3);
 T('Total',40,80,yTotal,{w:700});T(N(d.total),48,820,yTotal,{w:700,al:'right'});
 lines.forEach(([a,b,yy,col,w])=>{T(a,30,80,yy,{col});T(b,30,820,yy,{col,w,al:'right'})});
 T(`#${d.id} · ${d.date}`,28,W/2,yMeta,{col:'#6a6a64',al:'center'});T(d.site||'',32,W/2,H-60,{col:'#4a5232',w:700,al:'center'});
 return c;}
export async function makeReceipt(d){
 const {createCanvas,loadImage,GlobalFonts}=await import('@napi-rs/canvas'),path=(await import('path')).default;
 const p=path.join(process.cwd(),'api','fonts');GlobalFonts.registerFromPath(path.join(p,'sans.ttf'),'RegisSans');GlobalFonts.registerFromPath(path.join(p,'sans-bold.ttf'),'RegisBold');
 return (await drawReceipt({createCanvas,loadImage},d)).toBuffer('image/png');}
