import React from 'react';
// Safety net: React calls whatever an effect returns as its cleanup. If an effect ever returns a non-function
// (a Promise, a value), unmounting crashes with "n is not a function". Drop such values and log which effect did it.
['useEffect','useLayoutEffect'].forEach(k=>{const orig=React[k];
 React[k]=(fn,deps)=>orig(typeof fn==='function'?()=>{const r=fn();if(r===undefined||typeof r==='function')return r;console.warn('Regis: an effect returned a non-function; ignored.',String(fn).slice(0,240));return undefined}:fn,deps)});
import {createRoot} from 'react-dom/client';import {BrowserRouter} from 'react-router-dom';
import App from './App';import ErrorBoundary from './components/ErrorBoundary';import AuthProvider from './context/AuthContext';import CartProvider from './context/CartContext';import ToastProvider from './context/ToastContext';import './index.css';
createRoot(document.getElementById('root')).render(<ErrorBoundary><BrowserRouter><ToastProvider><AuthProvider><CartProvider><App/></CartProvider></AuthProvider></ToastProvider></BrowserRouter></ErrorBoundary>);
