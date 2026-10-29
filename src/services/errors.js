const NET='We couldn’t connect. Please check your internet connection and try again.';
const A={
 'auth/invalid-email':'That email address doesn’t look right. Please check it and try again.',
 'auth/missing-email':'Please enter your email address.',
 'auth/user-not-found':'We couldn’t find an account with that email. Try creating an account instead.',
 'auth/wrong-password':'That password isn’t right. Please try again, or reset it.',
 'auth/invalid-credential':'Your email or password isn’t right. Please try again.',
 'auth/invalid-login-credentials':'Your email or password isn’t right. Please try again.',
 'auth/email-already-in-use':'An account with this email already exists. Try logging in instead.',
 'auth/weak-password':'Please choose a password with at least 6 characters.',
 'auth/too-many-requests':'Too many attempts. Please wait a few minutes and try again.',
 'auth/network-request-failed':NET,
 'auth/popup-closed-by-user':'','auth/cancelled-popup-request':'',
 'auth/popup-blocked':'Your browser blocked the Google window. Please allow pop-ups for this site and try again.',
 'auth/account-exists-with-different-credential':'This email is already registered another way. Please log in with your email and password.',
 'auth/user-disabled':'This account has been disabled. Please contact support.',
 'auth/unauthorized-domain':'Google sign-in isn’t available on this address right now. Please contact support.',
 'auth/operation-not-allowed':'This sign-in method isn’t available right now. Please contact support.',
 'permission-denied':'You don’t have permission to do that. Please log in and try again.',
 'unauthenticated':'Please log in to continue.',
 'unavailable':NET,
 'deadline-exceeded':'This is taking longer than usual. Your connection may be slow. Please try again.',
 'resource-exhausted':'We’re very busy right now. Please try again in a moment.',
 'not-found':'We couldn’t find that. It may have been removed.',
 'failed-precondition':'We couldn’t complete that right now. Please try again shortly.',
 'cancelled':'That was cancelled. Please try again.',
};
export function msg(e,fallback='Something went wrong. Please try again.'){
 if(typeof navigator!=='undefined'&&navigator.onLine===false)return 'You appear to be offline. Please check your internet connection and try again.';
 const code=(e?.code||'').replace('firestore/','');
 if(code in A)return A[code];
 if(/failed to fetch|networkerror|load failed|network request/i.test(e?.message||''))return NET;
 return fallback;}
export const withTimeout=(p,ms=20000)=>Promise.race([p,new Promise((_,r)=>setTimeout(()=>r({code:'deadline-exceeded'}),ms))]);
