import {Component} from 'react';
export default class ErrorBoundary extends Component{
 state={bad:false,msg:''};
 static getDerivedStateFromError(e){return {bad:true,msg:String(e?.stack||e?.message||e)}}
 componentDidCatch(e){console.error('Regis error:',e)}
 render(){
  if(!this.state.bad)return this.props.children;
  const debug=typeof window!=='undefined'&&window.location.search.includes('debug');
  return <div className="nf"><h1>Something went wrong.</h1><p className="lead">Please try again. If it keeps happening, contact our support team.</p>
   <div className="ctas"><button className="pill" onClick={()=>window.location.reload()}>Refresh</button><a className="tlink" href="/">Back to home ›</a></div>
   {debug&&<pre className="dbg">{this.state.msg}</pre>}</div>;}}
