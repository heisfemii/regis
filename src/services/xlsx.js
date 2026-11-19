// Tiny dependency-free .xlsx writer (stored zip + inline strings). sheets:[{name,cols:[[fmt,width]],rows:[[...]],bold:[rowIdx],notes:[rowIdx]}]
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g,'');
const colL=i=>{let s='';for(i++;i>0;i=Math.floor((i-1)/26))s=String.fromCharCode(65+(i-1)%26)+s;return s};
const XF={text:0,int:5,money:2,pct:3,date:4},B={text:6,int:9,money:7,pct:8,date:6},H=1,NOTE=10;
const serial=d=>(Date.UTC(d.getFullYear(),d.getMonth(),d.getDate())-Date.UTC(1899,11,30))/864e5;
const STYLES=`<?xml version="1.0" encoding="UTF-8" standalone="yes"?><styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><numFmts count="3"><numFmt numFmtId="164" formatCode="&quot;₦&quot;#,##0"/><numFmt numFmtId="165" formatCode="0.0%"/><numFmt numFmtId="166" formatCode="dd mmm yyyy"/></numFmts><fonts count="4"><font><sz val="11"/><name val="Calibri"/></font><font><b/><sz val="11"/><name val="Calibri"/></font><font><i/><sz val="10"/><color rgb="FF6A6A64"/><name val="Calibri"/></font><font><b/><sz val="11"/><color rgb="FFFFFFFF"/><name val="Calibri"/></font></fonts><fills count="3"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill><fill><patternFill patternType="solid"><fgColor rgb="FF3A4226"/></patternFill></fill></fills><borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders><cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs><cellXfs count="11"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/><xf numFmtId="0" fontId="3" fillId="2" borderId="0" xfId="0" applyFont="1" applyFill="1"/><xf numFmtId="164" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1"/><xf numFmtId="165" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1"/><xf numFmtId="166" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1"/><xf numFmtId="3" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1"/><xf numFmtId="0" fontId="1" fillId="0" borderId="0" xfId="0" applyFont="1"/><xf numFmtId="164" fontId="1" fillId="0" borderId="0" xfId="0" applyFont="1" applyNumberFormat="1"/><xf numFmtId="165" fontId="1" fillId="0" borderId="0" xfId="0" applyFont="1" applyNumberFormat="1"/><xf numFmtId="3" fontId="1" fillId="0" borderId="0" xfId="0" applyFont="1" applyNumberFormat="1"/><xf numFmtId="0" fontId="2" fillId="0" borderId="0" xfId="0" applyFont="1"/></cellXfs><cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles></styleSheet>`;
function sheetXml(sh){
 const cols=sh.cols||[],bold=new Set(sh.bold||[]),notes=new Set(sh.notes||[]);
 const rows=sh.rows.map((r,ri)=>`<row r="${ri+1}">${r.map((v,ci)=>{
  if(v===null||v===undefined||v==='')return '';const ref=colL(ci)+(ri+1),f=(cols[ci]||['text'])[0];
  if(ri===0)return `<c r="${ref}" s="${H}" t="inlineStr"><is><t>${esc(v)}</t></is></c>`;
  if(notes.has(ri))return `<c r="${ref}" s="${NOTE}" t="inlineStr"><is><t xml:space="preserve">${esc(v)}</t></is></c>`;
  const s=bold.has(ri)?B[f]:XF[f];
  if(typeof v==='number'&&isFinite(v))return `<c r="${ref}" s="${s}"><v>${v}</v></c>`;
  if(v instanceof Date)return `<c r="${ref}" s="${bold.has(ri)?B.date:XF.date}"><v>${serial(v)}</v></c>`;
  return `<c r="${ref}" s="${bold.has(ri)?6:0}" t="inlineStr"><is><t xml:space="preserve">${esc(v)}</t></is></c>`}).join('')}</row>`).join('');
 return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetViews><sheetView workbookViewId="0"><pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews><cols>${cols.map((c,i)=>`<col min="${i+1}" max="${i+1}" width="${c[1]||14}" customWidth="1"/>`).join('')}</cols><sheetData>${rows}</sheetData></worksheet>`}
const crcT=(()=>{const t=new Uint32Array(256);for(let n=0;n<256;n++){let c=n;for(let k=0;k<8;k++)c=c&1?0xEDB88320^(c>>>1):c>>>1;t[n]=c>>>0}return t})();
const crc=b=>{let c=0xFFFFFFFF;for(let i=0;i<b.length;i++)c=crcT[(c^b[i])&255]^(c>>>8);return(c^0xFFFFFFFF)>>>0};
function zip(files){
 const enc=new TextEncoder(),parts=[],cd=[];let off=0;
 for(const f of files){
  const nm=enc.encode(f.name),d=enc.encode(f.data),c=crc(d),lh=new DataView(new ArrayBuffer(30));
  lh.setUint32(0,0x04034b50,true);lh.setUint16(4,20,true);lh.setUint16(6,0x0800,true);lh.setUint16(12,0x21,true);lh.setUint32(14,c,true);lh.setUint32(18,d.length,true);lh.setUint32(22,d.length,true);lh.setUint16(26,nm.length,true);
  parts.push(new Uint8Array(lh.buffer),nm,d);
  const ch=new DataView(new ArrayBuffer(46));
  ch.setUint32(0,0x02014b50,true);ch.setUint16(4,20,true);ch.setUint16(6,20,true);ch.setUint16(8,0x0800,true);ch.setUint16(14,0x21,true);ch.setUint32(16,c,true);ch.setUint32(20,d.length,true);ch.setUint32(24,d.length,true);ch.setUint16(28,nm.length,true);ch.setUint32(42,off,true);
  cd.push(new Uint8Array(ch.buffer),nm);off+=30+nm.length+d.length}
 const cdSize=cd.reduce((s,b)=>s+b.length,0),end=new DataView(new ArrayBuffer(22));
 end.setUint32(0,0x06054b50,true);end.setUint16(8,files.length,true);end.setUint16(10,files.length,true);end.setUint32(12,cdSize,true);end.setUint32(16,off,true);
 return new Blob([...parts,...cd,new Uint8Array(end.buffer)],{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'})}
export function makeXlsx(sheets){
 const X='<?xml version="1.0" encoding="UTF-8" standalone="yes"?>',n=sheets.length;
 return zip([
  {name:'[Content_Types].xml',data:`${X}<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>${sheets.map((_,i)=>`<Override PartName="/xl/worksheets/sheet${i+1}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>`).join('')}</Types>`},
  {name:'_rels/.rels',data:`${X}<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>`},
  {name:'xl/workbook.xml',data:`${X}<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets>${sheets.map((s,i)=>`<sheet name="${esc(s.name.replace(/[\\/?*\[\]:]/g,' ').slice(0,31))}" sheetId="${i+1}" r:id="rId${i+1}"/>`).join('')}</sheets></workbook>`},
  {name:'xl/_rels/workbook.xml.rels',data:`${X}<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">${sheets.map((_,i)=>`<Relationship Id="rId${i+1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet${i+1}.xml"/>`).join('')}<Relationship Id="rId${n+1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>`},
  {name:'xl/styles.xml',data:STYLES},
  ...sheets.map((s,i)=>({name:`xl/worksheets/sheet${i+1}.xml`,data:sheetXml(s)}))])}