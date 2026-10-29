export default function Split({text,base=0,step=80}){
 return <span aria-label={text}>{text.split(' ').map((w,i)=><span className="wd" key={i} aria-hidden="true"><span style={{animationDelay:base+i*step+'ms'}}>{w}&nbsp;</span></span>)}</span>;}
