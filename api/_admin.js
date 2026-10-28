export async function init(){
 const admin=(await import('firebase-admin')).default;
 if(!admin.apps.length){
  const raw=process.env.FIREBASE_SERVICE_ACCOUNT;
  if(!raw)throw new Error('FIREBASE_SERVICE_ACCOUNT is not set on the server (add it in Vercel, then redeploy)');
  let c;try{c=JSON.parse(raw)}catch{throw new Error('FIREBASE_SERVICE_ACCOUNT is not valid JSON. Paste the whole service account key file.')}
  admin.initializeApp({credential:admin.credential.cert(c)});}
 return {admin,db:admin.firestore(),auth:admin.auth()};}
