import {Component} from 'react';
export default class ErrorBoundary extends Component{
 state={bad:false};static getDerivedStateFromError(){return {bad:true}}
 render(){return this.state.bad?<div className="nf"><h1>Something went wrong.</h1><p className="lead">Please refresh the page. If it keeps happening, contact our support team.</p><button className="pill" onClick={()=>window.location.reload()}>Refresh</button></div>:this.props.children}}
