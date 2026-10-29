import {useEffect} from 'react';import {Link} from 'react-router-dom';
export default function NotFound(){
 useEffect(()=>{document.title='Page not found | Regis';return()=>{document.title='Regis | Curated Watches'}},[]);
 return <div className="nf"><div className="four" aria-hidden="true"><span>4</span><span className="tick">⌚</span><span>4</span></div>
  <h1>This page isn’t here.</h1><p className="lead">The link may be old, or the page may have moved. Let’s get you back to the watches.</p>
  <div className="ctas"><Link className="pill" to="/">Back to shop</Link><Link className="tlink" to="/account">My account ›</Link></div></div>;}
