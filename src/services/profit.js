import {makeXlsx} from './xlsx';
// Profit = what the customer paid (after credits) minus watch cost and delivery to you. Orders without costs are left out of cost/profit.
const unit=c=>(+c.cost||0)+(+c.delivery||0),has=c=>c&&c.cost!==null&&c.cost!==undefined&&c.cost!==''&&!isNaN(c.cost);
export function orderCost(o,costs={}){
 if(o.costKnown===true&&o.costTotal!=null)return{cost:+o.costTotal,known:true};
 let cost=0,known=true;for(const i of o.items||[]){const c=costs[i.id];if(!has(c)){known=false;continue}cost+=unit(c)*(i.qty||1)}
 return{cost,known}}
export const when=o=>{const t=o.paidAt||o.createdAt;return t?.toDate?t.toDate():t?.seconds?new Date(t.seconds*1000):new Date()};
export const monthKey=d=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
export const monthLabel=k=>{const[y,m]=k.split('-');return new Date(+y,+m-1,1).toLocaleDateString('en-NG',{month:'long',year:'numeric'})};
export function summarize(orders,costs){let sales=0,cost=0,costedSales=0,missing=0,items=0;
 for(const o of orders){const c=orderCost(o,costs);sales+=o.total||0;items+=(o.items||[]).reduce((a,i)=>a+(i.qty||1),0);if(c.known){cost+=c.cost;costedSales+=o.total||0}else missing++}
 const profit=costedSales-cost;return{count:orders.length,items,sales,cost,profit,costedSales,missing,margin:costedSales?profit/costedSales:0}}
export function byMonth(orders,costs){const g={};for(const o of orders){const k=monthKey(when(o));(g[k]=g[k]||[]).push(o)}
 return Object.keys(g).sort().reverse().map(k=>({key:k,label:monthLabel(k),...summarize(g[k],costs)}))}
export function workbook(paid,costs,key='all'){
 const sel=(key==='all'?paid:paid.filter(o=>monthKey(when(o))===key)).slice().sort((a,b)=>when(a)-when(b)),ms=byMonth(sel,costs).reverse(),T=summarize(sel,costs);
 const sum={name:'Monthly summary',cols:[['text',20],['int',10],['int',14],['money',16],['money',16],['money',16],['pct',10],['int',20]],
  rows:[['Month','Orders','Watches sold','Sales','Cost','Profit','Margin','Orders missing costs'],
   ...ms.map(m=>[m.label,m.count,m.items,m.sales,m.cost,m.profit,m.margin,m.missing]),
   ['Total',T.count,T.items,T.sales,T.cost,T.profit,T.margin,T.missing],
   [],['Sales = what customers paid, after any credits used. Cost = watch cost + delivery to you.'],['Cost, profit and margin only count orders that have costs entered. Add missing costs in the Profit tab.']]};
 sum.bold=[sum.rows.length-4];sum.notes=[sum.rows.length-2,sum.rows.length-1];
 const ord={name:'Orders',cols:[['date',13],['text',12],['text',22],['text',46],['money',14],['money',14],['money',14],['money',14],['money',14],['pct',10],['text',14]],
  rows:[['Date','Order','Customer','Watches','Subtotal','Credits used','Sales','Cost','Profit','Margin','Costs entered'],
   ...sel.map(o=>{const c=orderCost(o,costs);return[when(o),'#'+o.id.slice(0,8).toUpperCase(),o.customer||'',(o.items||[]).map(i=>`${i.name}${i.qty>1?' x'+i.qty:''}`).join('; '),o.subtotal??null,o.creditsApplied||0,o.total||0,c.known?c.cost:null,c.known?(o.total||0)-c.cost:null,c.known&&o.total?((o.total-c.cost)/o.total):null,c.known?'Yes':'No']})]};
 const W={};for(const o of sel)for(const i of o.items||[]){const k=i.id||i.name,r=W[k]=W[k]||{name:`${i.name}${i.brand?' ('+i.brand+')':''}`,units:0,sales:0,cost:0,known:true,id:i.id};r.units+=i.qty||1;r.sales+=(i.price||0)*(i.qty||1);const c=costs[i.id];if(has(c))r.cost+=unit(c)*(i.qty||1);else r.known=false}
 const wr=Object.values(W).sort((a,b)=>b.sales-a.sales),bw={name:'By watch',cols:[['text',40],['int',10],['money',16],['money',16],['money',16]],
  rows:[['Watch','Units','Sales at list price','Cost','Profit'],...wr.map(r=>[r.name,r.units,r.sales,r.known?r.cost:null,r.known?r.sales-r.cost:null]),[],['Sales here are at list price, before any credits customers used, so totals can differ slightly from the other sheets.']]};
 bw.notes=[bw.rows.length-1];
 return makeXlsx([sum,ord,bw])}