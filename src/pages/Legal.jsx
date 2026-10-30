import {useEffect} from 'react';import {useSettings} from '../context/SettingsContext';import {SUPPORT_EMAIL,fmtPhone} from '../services/config';
const DOCS={
terms:{title:'Terms of Service',body:[
['About Regis','Regis (“we”, “us”) is an online watch retailer in Nigeria. You can reach us at {email} or on WhatsApp at {wa}. By using this website or placing an order you agree to these terms.'],
['Your account','Keep your login details private and give us accurate information. You are responsible for activity on your account. If you are under 18, please ask a parent or guardian before ordering.'],
['Orders and payment','You place an order on this website and send it to us on WhatsApp. An order is only confirmed once we confirm your payment with you. Prices are in Naira (₦). We may cancel an order if an item is unavailable or a price was shown incorrectly, and we will refund anything you have paid.'],
['Product information','We describe each watch as accurately as we can, including brand, colours and strap. Colours can look slightly different on different screens.'],
['Credits','You earn credits on confirmed orders and can use them at checkout. Credits have no cash value, cannot be transferred, and are adjusted if an order is cancelled or refunded. We may change how credits work and will update this page when we do.'],
['No warranty','Regis does not provide a warranty on the watches we sell. Any manufacturer warranty is between you and the manufacturer. This does not take away any rights you have under Nigerian law.'],
['Limit of liability','To the extent the law allows, our liability for any order is limited to the amount you paid for it.'],
['Intellectual property','Brand names and logos belong to their owners. The Regis name, design and website content belong to us.'],
['Changes to these terms','We may update these terms. The date at the top shows the latest version. Continuing to use the site means you accept the update.'],
['Governing law','These terms are governed by the laws of the Federal Republic of Nigeria.']]},
refunds:{title:'Refund, Cancellation and Delivery Policy',body:[
['Delivery','We deliver across Nigeria. The delivery time and fee are confirmed with you on WhatsApp before you pay. Delivery fees are non-refundable.'],
['Cancelling an order','You can cancel for free at any time before we confirm your payment. Once payment is confirmed we start packaging your order, and it can no longer be cancelled.'],
['Refunds and exchanges','If your watch arrives damaged, is the wrong item, or is not as described on our website, tell us within 48 hours of delivery with clear photos or a video of the item and its packaging. We will then offer a refund of the watch price or an exchange. Delivery fees are not refunded. Apart from this, all sales are final.'],
['How refunds are paid','Approved refunds are returned through the same method you paid with, within 7 working days. Any credits you used on the order are returned to your account.'],
['Warranty','We do not offer a warranty on watches. See our Terms of Service for details.'],
['Contact us','Questions about an order? Email {email} or message us on WhatsApp at {wa}.']]},
privacy:{title:'Privacy Policy',body:[
['Who we are','Regis is an online watch retailer in Nigeria. Contact us at {email} or on WhatsApp at {wa}.'],
['What we collect','Your name and email when you create an account (including through Google sign-in), your orders and credits, and the delivery details you share with us on WhatsApp. We never see or store your password. Sign-in is handled by Google Firebase.'],
['Why we use it','To run your account, process and deliver orders, give you credits, answer support questions and send order updates. We may also send promotional emails, and you can opt out at any time.'],
['Who handles your data','We use trusted services to run the site: Google Firebase (accounts and database), Cloudinary (photos), Gmail (emails) and WhatsApp (order messages). They process data for us under their own privacy terms. We do not sell your data.'],
['Cookies and similar storage','We only use essential browser storage to keep you signed in during your visit and to remember your cart and your choice on our notice. We do not use advertising or tracking cookies.'],
['Emails and opting out','Every promotional email has an unsubscribe link. Order and account emails are not promotional and will still be sent.'],
['Your rights','You can ask to see, correct or delete your data by emailing {email}. We handle personal data in line with the Nigeria Data Protection Act 2023.'],
['How long we keep it','We keep your account and order records while your account is active, and as long as needed for our legal and accounting duties.'],
['Children','Our site is not aimed at children. If you are under 18, please ask a parent or guardian before using it.'],
['Changes','We may update this policy. The date at the top shows the latest version.']]}};
export default function Legal({doc}){
 const {whatsapp}=useSettings(),d=DOCS[doc];
 useEffect(()=>{document.title=`${d.title} | Regis`;return()=>{document.title='Regis | Curated Watches'}},[doc]);
 const f=t=>t.replace('{email}',SUPPORT_EMAIL).replace('{wa}',fmtPhone(whatsapp));
 return <div className="legal-page"><h1>{d.title}</h1><p className="muted">Last updated: 30 October 2026</p>{d.body.map(([h,t])=><section key={h}><h3>{h}</h3><p>{f(t)}</p></section>)}</div>;}
