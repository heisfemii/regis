import {cover} from '../services/watches';import Img from './Img';
export default function Pic({w}){const s=cover(w);return <div className="im">{s?<Img src={s} alt={w.name}/>:<span aria-hidden="true">⌚</span>}</div>}
