import {cover} from './watches';
import {naira} from './config';
import {blank} from './contentArt';
// Offline idea generator: season-aware promos, catalogue spotlights, tips, quotes and reel scripts.
const HT='#regiswatch #watchesnigeria #watchesofinstagram #wristcheck #nigerianbusiness',CTA='Shop: regiswatch.vercel.app · @regiswatch.ng';
const rng=s=>()=>{s|=0;s=s+0x6D2B79F5|0;let t=Math.imul(s^s>>>15,1|s);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296};
const shuf=(a,r)=>{const b=[...a];for(let i=b.length-1;i>0;i--){const j=Math.floor(r()*(i+1));[b[i],b[j]]=[b[j],b[i]]}return b};
const cov=w=>w?cover(w):'';
const cap=(body,extra='')=>`${body}\n\n${extra?extra+'\n\n':''}${CTA}\n\n${HT}`;
export function upcoming(now=new Date()){
 const t0=new Date(now.getFullYear(),now.getMonth(),now.getDate()),ev=[];
 for(const y of [t0.getFullYear(),t0.getFullYear()+1]){
  const bf=new Date(y,10,1);while(bf.getDay()!==5)bf.setDate(bf.getDate()+1);bf.setDate(bf.getDate()+21);
  ev.push({k:'bf',name:'Black Friday',d:bf},{k:'xmas',name:'Christmas',d:new Date(y,11,25)},{k:'ny',name:'New Year',d:new Date(y+1,0,1)},{k:'val',name:'Valentine’s Day',d:new Date(y,1,14)});
 }
 return ev.filter(e=>e.d>=t0).sort((a,b)=>a.d-b.d).map(e=>({...e,days:Math.round((e.d-t0)/864e5)})).filter(e=>e.days<=50);
}
export const seasonNote=now=>{const u=upcoming(now).slice(0,2);return u.length?u.map(e=>e.days===0?`${e.name} is today`:`${e.name} is in ${e.days} day${e.days===1?'':'s'}`).join(' · ')+'. Start posting for it now.':'No big date in the next 50 days. Evergreen ideas below.'};
const TIPS=[
 ['Watch tip','Size it to your wrist','A case between 36 and 40mm suits most smaller wrists, while 40 to 44mm suits larger ones. The lugs should never hang past the edge of your wrist.'],
 ['Watch tip','30M is not for swimming','30 metres of water resistance means splash-proof, not swim-proof. Keep your watch away from the pool and the shower.'],
 ['Watch tip','Quartz vs automatic','Quartz runs on a battery and ticks once a second. Automatic runs on a spring wound by your movement and glides smoothly.'],
 ['Watch tip','Keep it looking new','Wipe it with a soft dry cloth after wearing, store it away from heat and perfume, and give leather straps a rest between wears.'],
 ['Watch tip','Leather or metal?','Leather dresses up and feels light. Metal handles heat and sweat better. Pick for the life you actually live.'],
 ['Style tip','The strap rule','Match your strap to your shoes, not your outfit. Brown leather with brown shoes never misses.']];
const QUOTES=[['Time is the only luxury you can’t restock.',''],['Wear it like you meant it.',''],['Be on time. Look the part.',''],['Some people collect moments. Others wear them.',''],['A watch is a small decision you make every morning.',''],['Dress for the wrist check.','']];
const LINES=['Wear it like you meant it.','Small piece. Big presence.','Built for the daily wrist check.','Your next favourite.'];
const SCRIPTS=[
 ['Unboxing POV reel','Shot 1 (2s): sealed box on a clean surface. Shot 2 (3s): hands open it, close-up on the watch. Shot 3 (3s): put it on the wrist and turn it in the light. Shot 4 (2s): text “Yours?” and the handle. Audio: a soft trending beat.','Unboxing, but make it quiet.'],
 ['Packing an order','Film the order being packed from above: watch, box, ribbon, note. No talking, just the sounds. End on the sealed parcel with the text “On its way to [city].” Post it as a reel.','Every order gets packed like a gift.'],
 ['Price guess story','Story 1: show one watch with no price and add a quiz or slider sticker: “Guess the price.” Story 2 (a few hours later): reveal the price and the number of people who guessed right.','Guess the price. No googling.'],
 ['Ask me anything: watches','Post a story with a question box: “Ask us anything about watches.” Answer 3 to 5 questions over the next stories, one per story, face or hand on camera.','You asked, we answered.'],
 ['Wrist roll','Slow 5-second video of one watch turning on a wrist in daylight. Text overlay: the name and the price. Works well as the first reel of the week.','The wrist roll.'],
 ['Why we stock it','Pick one watch and say, in 20 seconds on camera or as text, why it made the shelf: the look, the strap, the price. Post it as a story and pin it to a highlight called “Why.”','Why this one made the shelf.']];
const idea=(cat,title,spec,caption,script)=>({id:cat+title,cat,title,spec:spec&&{...blank(spec.type),...spec},caption,script});
export function buildIdeas(w=[],now=new Date(),seed=1){
 const r=rng(seed),pool=w.filter(x=>x.inStock!==false).length?w.filter(x=>x.inStock!==false):w,P=shuf(pool,r),by=g=>P.filter(x=>x.gender===g);
 const prices=P.map(x=>+x.price||0).filter(Boolean).sort((a,b)=>a-b),p60=prices[Math.floor(prices.length*.6)]||50000,cut=Math.ceil(p60/10000)*10000;
 const out=[];
 for(const e of upcoming(now)){
  if(e.k==='xmas'){
   out.push(idea('Seasonal','Christmas countdown',{type:'promo',theme:'christmas',tag:'Countdown',headline:`${e.days} days to Christmas`,sub:'Still deciding? A watch never goes out of style.',code:'DM TO ORDER',imgs:[cov(P[0]),'']},cap('Christmas is almost here. Give a gift that gets checked a hundred times a day.')));
   out.push(idea('Seasonal','Gifts under a budget',{type:'promo',theme:'christmas',tag:'Christmas edit',headline:`Gifts under ${naira(cut)}`,sub:'Pieces that look like they cost more.',imgs:[cov(P.find(x=>x.price<=cut)||P[0]),'']},cap(`Christmas gifts under ${naira(cut)}, picked for people who care about the details.`)));
   const a=by('men')[0]||P[0],b=by('women')[0]||P[1];
   out.push(idea('Seasonal','Gift for him or for her',{type:'versus',theme:'christmas',headline:'For him or for her?',imgs:[cov(a),cov(b)],labels:[a?`${a.name} · ${naira(a.price)}`:'',b?`${b.name} · ${naira(b.price)}`:'']},cap('Stuck on a gift? Pick a side and tell us who you are shopping for.')));
   out.push(idea('Seasonal','Christmas gift pick',{type:'spotlight',theme:'christmas',tag:'Gift pick',headline:P[1]?.name||'',sub:'Wrapped and ready to go.',price:P[1]?naira(P[1].price):'',imgs:[cov(P[1]),'']},cap(`${P[1]?.name||'This one'} is on the Christmas shortlist.`)));
   out.push(idea('Seasonal','Christmas quote',{type:'quote',theme:'christmas',headline:'The best gifts get checked a hundred times a day.',sub:'REGIS · CHRISTMAS'},cap('The best gifts get checked a hundred times a day.')));
  }
  if(e.k==='bf'){
   out.push(idea('Seasonal','Black Friday teaser',{type:'promo',theme:'noir',tag:'Teaser',headline:'Black Friday',sub:'Something special is coming. Turn on post notifications.',deadline:e.d.toLocaleDateString('en-GB',{day:'numeric',month:'short'}),imgs:[cov(P[2]||P[0]),'']},cap('Black Friday is coming. Turn on post notifications so you do not miss it.')));
   out.push(idea('Seasonal','Black Friday countdown',{type:'promo',theme:'noir',tag:'Countdown',headline:`${e.days} days to go`,sub:'Get your wishlist ready.'},cap('Get your wishlist ready.')));
  }
  if(e.k==='ny')out.push(idea('Seasonal','New year, on time',{type:'quote',theme:'noir',headline:'Start the year on time.',sub:'REGIS · NEW YEAR'},cap('Start the year on time.')));
  if(e.k==='val')out.push(idea('Seasonal','His and hers',{type:'versus',theme:'christmas',headline:'His or hers?',imgs:[cov(by('men')[0]||P[0]),cov(by('women')[0]||P[1])]},cap('Say it with something that keeps time.')));
 }
 const evergreen=[];
 P.slice(0,3).forEach((x,i)=>evergreen.push(idea('Showcase',i?`Watch of the day: ${x.name}`:`Just landed: ${x.name}`,{type:'spotlight',theme:'olive',tag:i?'Watch of the day':'Just landed',headline:x.name,sub:LINES[Math.floor(r()*LINES.length)],price:naira(x.price),imgs:[cov(x),'']},cap(`${x.name} is on the shelf.`,`${naira(x.price)}`))));
 if(P.length>=2)evergreen.push(idea('Engage','Which one’s yours?',{type:'versus',theme:'olive',imgs:[cov(P[0]),cov(P[1])],labels:[`${P[0].name} · ${naira(P[0].price)}`,`${P[1].name} · ${naira(P[1].price)}`]},cap('Left or right? Tell us in the comments, then see who wins.')));
 shuf(TIPS,r).slice(0,2).forEach(t=>evergreen.push(idea('Educate',t[1],{type:'tip',theme:'olive',tag:t[0],headline:t[1],sub:t[2]},cap(t[2]))));
 shuf(QUOTES,r).slice(0,2).forEach(q=>evergreen.push(idea('Quote',q[0],{type:'quote',theme:r()>.5?'noir':'olive',headline:q[0],sub:'REGIS'},cap(q[0]))));
 shuf(SCRIPTS,r).slice(0,3).forEach(s=>evergreen.push(idea('Reel',s[0],null,cap(s[2]),s[1])));
 return [...out,...evergreen];
}
export const captionOf=s=>{const l=[s.headline,s.sub].filter(Boolean).join('\n');return cap(l||'New from Regis.')};