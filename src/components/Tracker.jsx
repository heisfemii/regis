import {stageOf} from '../services/orders';
export const STAGES=[['processing','Processing'],['packaging','Being packaged'],['out_for_delivery','Out for delivery'],['delivered','Delivered']];
export const LABEL=Object.fromEntries(STAGES);
const HINT={processing:'We are waiting to confirm your payment on WhatsApp.',packaging:'Payment confirmed. Your watch is being carefully packaged.',out_for_delivery:'Your watch is on its way to you.',delivered:'Delivered. Thank you for shopping with Regis!'};
export default function Tracker({o}){
 if(o.status==='cancelled')return <p className="muted">This order was cancelled.</p>;
 const s=stageOf(o),i=STAGES.findIndex(x=>x[0]===s);
 return <><ol className="trk" aria-label="Order progress">{STAGES.map(([k,l],n)=><li key={k} className={n<i?'done':n===i?'now':''}><span className="d"/><b>{l}</b></li>)}</ol><p className="muted hint">{HINT[s]}</p></>;}
