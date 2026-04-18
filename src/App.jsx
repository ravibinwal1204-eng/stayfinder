import "./App.css";
import { useState, useEffect, useRef, useCallback } from "react";

/* ═══════════════════ DATA ═══════════════════ */
const CITIES = ["Mumbai","Delhi","Bangalore","Pune","Hyderabad","Chennai","Kolkata","Ahmedabad","Jaipur","Goa"];
const PROPERTY_IMAGES = [
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80",
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80",
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80",
  "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80",
  "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800&q=80",
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80",
  "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80",
  "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=800&q=80",
  "https://images.unsplash.com/photo-1574362848149-11496d93a7c7?w=800&q=80",
  "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80",
  "https://images.unsplash.com/photo-1599423300746-b62533397364?w=800&q=80",
  "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800&q=80",
  "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800&q=80",
];
const PROPERTY_TYPES = ["Apartment","Villa","Studio","Penthouse","Duplex","Flat","Independent House","PG/Hostel"];
const FURNISHING = ["Fully Furnished","Semi Furnished","Unfurnished"];
const BHK_OPTIONS = ["1 BHK","2 BHK","3 BHK","4 BHK","Studio","1 RK"];
const AMENITIES_LIST = ["WiFi","AC","Parking","Gym","Pool","Power Backup","Security","Lift","Garden","Laundry","CCTV","Water Supply 24/7"];
const CATEGORIES = [
  {icon:"🏢",label:"Apartments"},{icon:"🏠",label:"Houses"},{icon:"🏡",label:"Villas"},
  {icon:"🏙️",label:"Studios"},{icon:"🏘️",label:"PG/Hostels"},{icon:"✨",label:"Luxury"},
  {icon:"🏗️",label:"New Build"},{icon:"🌳",label:"With Garden"},{icon:"🏊",label:"With Pool"},{icon:"🐾",label:"Pet Friendly"},
];
const CITY_IMAGES = {
  Mumbai:"https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=400&q=80",
  Delhi:"https://images.unsplash.com/photo-1587474260584-136574528ed5?w=400&q=80",
  Bangalore:"https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=400&q=80",
  Pune:"https://images.unsplash.com/photo-1572782252655-9c8771392601?w=400&q=80",
  Hyderabad:"https://images.unsplash.com/photo-1600077106724-64b6f332ed1f?w=400&q=80",
  Chennai:"https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=400&q=80",
  Kolkata:"https://images.unsplash.com/photo-1558431382-27e303142255?w=400&q=80",
  Goa:"https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=400&q=80",
};

/* ═══════════════════ SVG ICONS ═══════════════════ */
const I={
  search:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>,
  heart:f=>f?<svg width="18" height="18" viewBox="0 0 24 24" fill="#FF385C" stroke="#FF385C" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>,
  star:<svg width="14" height="14" viewBox="0 0 24 24" fill="#222" stroke="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>,
  chevL:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M15 18l-6-6 6-6"/></svg>,
  chevR:<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>,
  close:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>,
  camera:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>,
  gallery:<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>,
  home:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  contact:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
  about:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>,
  dash:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
  user:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  plus:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>,
  edit:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  trash:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>,
  logout:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  check:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  eye:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  mail:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
  phone:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 .12 4.18 2 2 0 0 1 2.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
  map:<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
};

/* ═══════════════════ COMPONENTS ═══════════════════ */
function PropertyCard({property:p,onOpen,onLike,liked}){
  const[idx,setIdx]=useState(0);const imgs=p.images;
  return(<div className="card" onClick={()=>onOpen(p)}>
    <div className="card-car">
      {imgs.map((s,i)=><img key={i} className={`card-img ${i!==idx?"hide":""}`} src={s} alt="" loading="lazy"/>)}
      {p.postedDaysAgo<=3&&<div className="card-badge">New</div>}
      <button className={`card-wl ${liked?"liked":""}`} onClick={e=>{e.stopPropagation();onLike(p.id)}}>{I.heart(liked)}</button>
      <button className="card-nv pv" onClick={e=>{e.stopPropagation();setIdx(i=>(i-1+imgs.length)%imgs.length)}}>{I.chevL}</button>
      <button className="card-nv nx" onClick={e=>{e.stopPropagation();setIdx(i=>(i+1)%imgs.length)}}>{I.chevR}</button>
      <div className="card-dots">{imgs.map((_,i)=><div key={i} className={`card-dot ${i===idx?"act":""}`}/>)}</div>
    </div>
    <div className="card-info">
      <div className="card-top"><div className="card-title">{p.title}</div><div className="card-rating">{I.star} {p.rating}</div></div>
      <div className="card-loc">{p.location}</div>
      <div className="card-det">{p.furnishing} · {p.area} sq.ft · Min {p.minLease} mo</div>
      <div className="card-price"><strong>₹{p.price.toLocaleString()}</strong> <span>/ month</span></div>
    </div>
  </div>);
}

function FeaturedSlider({properties,onOpen}){
  const feat=properties.slice(0,5);
  const[idx,setIdx]=useState(0);
  useEffect(()=>{if(feat.length===0)return;const t=setInterval(()=>setIdx(i=>(i+1)%feat.length),4500);return()=>clearInterval(t)},[feat.length]);
  if(feat.length===0)return null;
  return(<div className="feat-sl">
    <div className="feat-tk" style={{transform:`translateX(-${idx*100}%)`}}>
      {feat.map(p=>(<div className="feat-s" key={p.id} onClick={()=>onOpen(p)}>
        <img src={p.images[0]} alt={p.title}/>
        <div className="feat-ov"><div className="feat-ct"><h3>{p.title}</h3><p>{p.furnishing} · {p.area} sq.ft · ₹{p.price.toLocaleString()}/mo</p><button className="btn btn-p">View Details</button></div></div>
      </div>))}
    </div>
    <div className="feat-ind">{feat.map((_,i)=><button key={i} className={`feat-id ${i===idx?"act":""}`} onClick={()=>setIdx(i)}/>)}</div>
    <div className="sl-arr"><button className="sl-ar" onClick={()=>setIdx(i=>(i-1+feat.length)%feat.length)}>{I.chevL}</button><button className="sl-ar" onClick={()=>setIdx(i=>(i+1)%feat.length)}>{I.chevR}</button></div>
  </div>);
}

function PropertyModal({property:p,onClose,user,onShowAuth,onRecordEnquiry,viewerIsOwner}){
  if(!p)return null;
  const phoneClean=(p.ownerPhone||"").replace(/\s+/g,"");
  const handleContact=()=>{if(!user){onShowAuth();return}if(!viewerIsOwner)onRecordEnquiry?.(p);alert(`Contact request sent to ${p.owner}!`)};
  const bumpEnquiry=()=>{if(user&&!viewerIsOwner)onRecordEnquiry?.(p)};
  return(<div className="mo" onClick={onClose}><div className="modal" onClick={e=>e.stopPropagation()}>
    <button className="mo-cl" onClick={onClose}>{I.close}</button>
    <div className="mo-gal">{p.images.slice(0,3).map((img,i)=><img key={i} src={img} alt=""/>)}</div>
    <div className="mo-body">
      <div className="mo-hdr"><div><h2>{p.title}</h2><div className="mo-meta"><span>{I.star} {p.rating} ({p.reviews} reviews)</span><span>📍 {p.location}</span></div></div></div>
      <div className="mo-div"/><div className="mo-sec"><h3>About this property</h3><p>{p.description}</p></div>
      <div className="mo-div"/><div className="mo-sec"><h3>Details</h3><div className="am-grid" style={{marginTop:12}}><div className="am">🏠 {p.type}</div><div className="am">🛏️ {p.bhk}</div><div className="am">📐 {p.area} sq.ft</div><div className="am">🪑 {p.furnishing}</div><div className="am">📅 Min {p.minLease} months</div><div className="am">💰 ₹{p.deposit.toLocaleString()} deposit</div></div></div>
      <div className="mo-div"/><div className="mo-sec"><h3>Amenities</h3><div className="am-grid" style={{marginTop:12}}>{p.amenities.map((a,i)=><div className="am" key={i}>✓ {a}</div>)}</div></div>
      <div className="bk-card">
        <div className="bk-price">₹{p.price.toLocaleString()} <span>/ month</span></div>
        <div style={{fontSize:14,color:"var(--ts)",marginBottom:4}}>Deposit: ₹{p.deposit.toLocaleString()}</div>
        <div className="bk-flds"><div className="bk-fld"><label>Move-in</label><span>Choose date</span></div><div className="bk-fld"><label>Lease</label><span>{p.minLease}+ months</span></div></div>
        <button className="bk-btn" onClick={handleContact}>{user?"Contact Owner":"Login to Contact"}</button>
        <div className="ow-info"><div className="ow-av">{p.owner[0]}</div><div><div className="ow-nm">{p.owner}</div><div className="ow-lb">Property Owner · Direct (No Broker)</div>{user&&p.ownerPhone&&<div className="ow-phone-num">{I.phone} {p.ownerPhone}</div>}</div></div>
        {user&&p.ownerPhone&&<div className="ow-contact">
          <a className="ow-call" href={`tel:${phoneClean}`} onClick={bumpEnquiry}>📞 Call Owner</a>
          <a className="ow-whatsapp" href={`https://wa.me/${phoneClean.replace("+","")}`} target="_blank" rel="noopener noreferrer" onClick={bumpEnquiry}>💬 WhatsApp</a>
        </div>}
        {!user&&<div style={{textAlign:"center",padding:"12px 0 4px",fontSize:13,color:"var(--ts)"}}>🔒 Login to see owner's contact number</div>}
      </div>
    </div>
  </div></div>);
}

function AuthModal({onClose,onAuth}){
  const[mode,setMode]=useState("login");
  const[form,setForm]=useState({name:"",email:"",password:"",confirmPassword:""});
  const[error,setError]=useState("");const[loading,setLoading]=useState(false);
  const set=(k,v)=>setForm(f=>({...f,[k]:v}));
  const handleSubmit=async()=>{
    setError("");
    if(mode==="register"){if(!form.name||!form.email||!form.password||!form.confirmPassword){setError("All fields are required");return}if(form.password!==form.confirmPassword){setError("Passwords don't match");return}if(form.password.length<6){setError("Min 6 characters");return}}
    else{if(!form.email||!form.password){setError("Email and password required");return}}
    setLoading(true);
    try{
      const ep=mode==="register"?"/api/auth/register":"/api/auth/login";
      const pl=mode==="register"?{name:form.name,email:form.email,password:form.password,confirmPassword:form.confirmPassword}:{email:form.email,password:form.password};
      const res=await fetch(ep,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(pl)});
      const data=await res.json();
      if(data.success){if(mode==="login")onAuth({name:data.user.name,email:data.user.email,token:data.token});else{setMode("login");setError("")}}else setError(data.message||"Error");
    }catch{if(mode==="login")onAuth({name:form.name||form.email.split("@")[0],email:form.email});else{setMode("login");setError("")}}
    setLoading(false);
  };
  return(<div className="mo" onClick={onClose}><div className="auth" onClick={e=>e.stopPropagation()}>
    <div style={{display:"flex",justifyContent:"flex-end",marginBottom:8}}><button className="mo-cl" style={{position:"static",margin:0}} onClick={onClose}>{I.close}</button></div>
    <h2>{mode==="login"?"Welcome back":"Create account"}</h2>
    <p className="sub">{mode==="login"?"Log in to contact owners directly":"Join StayFinder — find your perfect home"}</p>
    <div className="auth-tabs"><button className={`auth-tab ${mode==="login"?"act":""}`} onClick={()=>{setMode("login");setError("")}}>Log In</button><button className={`auth-tab ${mode==="register"?"act":""}`} onClick={()=>{setMode("register");setError("")}}>Sign Up</button></div>
    {mode==="register"&&<div className="fg"><label>Full Name</label><input className="fg-in" placeholder="Your full name" value={form.name} onChange={e=>set("name",e.target.value)}/></div>}
    <div className="fg"><label>Email</label><input className="fg-in" type="email" placeholder="you@example.com" value={form.email} onChange={e=>set("email",e.target.value)}/></div>
    <div className="fg"><label>Password</label><input className="fg-in" type="password" placeholder="••••••••" value={form.password} onChange={e=>set("password",e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleSubmit()}/></div>
    {mode==="register"&&<div className="fg"><label>Confirm Password</label><input className="fg-in" type="password" placeholder="••••••••" value={form.confirmPassword} onChange={e=>set("confirmPassword",e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleSubmit()}/></div>}
    {error&&<div className="fg-err" style={{marginBottom:8}}>{error}</div>}
    <button className="btn btn-p btn-lg" style={{width:"100%",marginTop:12,justifyContent:"center"}} onClick={handleSubmit} disabled={loading}>{loading?"Please wait...":mode==="login"?"Log In":"Create Account"}</button>
    <div className="auth-div">or</div>
    <button className="btn btn-o" style={{width:"100%",justifyContent:"center"}} onClick={()=>onAuth({name:"Guest User",email:"guest@stayfinder.com"})}>Continue as Guest</button>
    <div className="auth-ft">{mode==="login"?<>Don't have an account? <a onClick={()=>setMode("register")}>Sign up</a></>:<>Already have an account? <a onClick={()=>setMode("login")}>Log in</a></>}</div>
  </div></div>);
}

/* ═══════════ PROFILE PAGE ═══════════ */
function ProfilePage({user,profile,setProfile,showToast}){
  const galRef=useRef(null);const vidRef=useRef(null);const streamRef=useRef(null);const[streaming,setStreaming]=useState(false);
  const handleGallery=e=>{const f=e.target.files?.[0];if(!f)return;const r=new FileReader();r.onload=ev=>setProfile(p=>({...p,photo:ev.target.result}));r.readAsDataURL(f)};

  useEffect(()=>{
    if(!streaming)return;
    const v=vidRef.current;const s=streamRef.current;
    if(!v||!s)return;
    v.srcObject=s;
    v.muted=true;
    v.playsInline=true;
    const play=()=>{v.play().catch(()=>{})};
    if(v.readyState>=2)play();else v.addEventListener("loadedmetadata",play,{once:true});
    return()=>{v.srcObject=null};
  },[streaming]);

  const startCamera=async()=>{
    try{
      const s=await navigator.mediaDevices.getUserMedia({video:{facingMode:"user"},audio:false});
      streamRef.current=s;
      setStreaming(true);
    }catch{showToast("Camera access denied")}
  };

  const stopCamera=()=>{
    streamRef.current?.getTracks().forEach(t=>t.stop());
    streamRef.current=null;
    if(vidRef.current)vidRef.current.srcObject=null;
    setStreaming(false);
  };

  const capturePhoto=()=>{
    const v=vidRef.current;
    if(!v)return;
    const draw=()=>{
      const w=v.videoWidth,h=v.videoHeight;
      if(!w||!h){showToast("Camera not ready — wait a moment");return}
      const c=document.createElement("canvas");
      c.width=w;c.height=h;
      c.getContext("2d").drawImage(v,0,0);
      setProfile(p=>({...p,photo:c.toDataURL("image/jpeg",.85)}));
      stopCamera();
    };
    if(v.readyState>=2&&v.videoWidth>0)draw();
    else v.addEventListener("loadeddata",draw,{once:true});
  };

  const removePhoto=()=>{setProfile(p=>({...p,photo:null}));showToast("Profile photo removed")};

  useEffect(()=>()=>{streamRef.current?.getTracks().forEach(t=>t.stop());streamRef.current=null},[]);
  return(<div className="prof">
    <div className="prof-head">
      <div className="prof-photo-wrap">
        <div className="prof-photo">
          {streaming?<video ref={vidRef} style={{width:"100%",height:"100%",objectFit:"cover"}} playsInline muted autoPlay/>:profile.photo?<img src={profile.photo} alt="Profile"/>:<div className="prof-photo-ph">{(profile.name||user.name||"U")[0].toUpperCase()}</div>}
        </div>
        <div className="prof-photo-actions" role="group" aria-label="Profile photo">
          {streaming?<><button type="button" className="prof-photo-act" onClick={capturePhoto}><span className="prof-photo-act-ic">{I.check}</span><span>Capture</span></button><button type="button" className="prof-photo-act" onClick={stopCamera}><span className="prof-photo-act-ic">{I.close}</span><span>Cancel</span></button></>:<><button type="button" className="prof-photo-act" onClick={startCamera}><span className="prof-photo-act-ic">{I.camera}</span><span>Camera</span></button><button type="button" className="prof-photo-act" onClick={()=>galRef.current?.click()}><span className="prof-photo-act-ic">{I.gallery}</span><span>Gallery</span></button>{profile.photo&&<button type="button" className="prof-photo-act prof-photo-act-del" onClick={removePhoto} aria-label="Remove profile photo"><span className="prof-photo-act-ic">{I.trash}</span><span>Remove</span></button>}</>}
        </div>
        <input ref={galRef} type="file" accept="image/*" style={{display:"none"}} onChange={handleGallery}/>
      </div>
      <div className="prof-info">
        <h2>{profile.name||user.name}</h2>
        <div style={{fontSize:14,color:"var(--ts)"}}>{user.email}</div>
        {profile.phone&&<div style={{fontSize:14,color:"var(--ts)",display:"flex",alignItems:"center",gap:6,marginTop:2}}>{I.phone} {profile.phone}</div>}
        {profile.role==="owner"&&<div className="role-badge owner">🏠 Property Owner</div>}
      </div>
    </div>
    <div className="prof-form"><h3>Personal Details</h3>
      <div className="pf-grid">
        <div className="fg"><label>Full Name</label><input className="fg-in" value={profile.name} onChange={e=>setProfile(p=>({...p,name:e.target.value}))} placeholder="Enter full name"/></div>
        <div className="fg"><label>Phone</label><input className="fg-in" value={profile.phone} onChange={e=>setProfile(p=>({...p,phone:e.target.value}))} placeholder="+91 98765 43210"/></div>
        <div className="fg"><label>Date of Birth</label><input className="fg-in" type="date" value={profile.dob} onChange={e=>setProfile(p=>({...p,dob:e.target.value}))}/></div>
        <div className="fg"><label>Gender</label><select className="fg-in" value={profile.gender} onChange={e=>setProfile(p=>({...p,gender:e.target.value}))}><option value="">Select</option><option value="male">Male</option><option value="female">Female</option><option value="other">Other</option></select></div>
        <div className="fg pf-full"><label>Address</label><input className="fg-in" value={profile.address} onChange={e=>setProfile(p=>({...p,address:e.target.value}))} placeholder="Full address"/></div>
        <div className="fg"><label>City</label><input className="fg-in" value={profile.city} onChange={e=>setProfile(p=>({...p,city:e.target.value}))} placeholder="City"/></div>
        <div className="fg"><label>Occupation</label><input className="fg-in" value={profile.occupation} onChange={e=>setProfile(p=>({...p,occupation:e.target.value}))} placeholder="e.g. Software Engineer"/></div>
        <div className="fg pf-full"><label>Are you a property owner?</label>
          <div className="pf-role">
            <div className={`pf-role-opt ${profile.role!=="owner"?"sel":""}`} onClick={()=>setProfile(p=>({...p,role:""}))}><div className="ri">🔍</div><div className="rl">Just Browsing</div><div className="rd">Looking for a property to rent</div></div>
            <div className={`pf-role-opt ${profile.role==="owner"?"sel":""}`} onClick={()=>setProfile(p=>({...p,role:"owner"}))}><div className="ri">🏠</div><div className="rl">Property Owner</div><div className="rd">I want to list my property</div></div>
          </div>
        </div>
        <div className="fg pf-full"><label>Bio</label><textarea className="fg-in" rows={3} value={profile.bio} onChange={e=>setProfile(p=>({...p,bio:e.target.value}))} placeholder="Tell us about yourself..." style={{resize:"vertical",minHeight:80}}/></div>
      </div>
      <div className="pf-save-row"><button className="btn btn-p btn-lg" onClick={()=>showToast("Profile saved successfully!")}>Save Profile</button></div>
    </div>
  </div>);
}

/* ═══════════ OWNER DASHBOARD ═══════════ */
function OwnerDashboard({user,profile,showToast,myProperties,setMyProperties,openProperty}){
  const[showForm,setShowForm]=useState(false);
  const[form,setForm]=useState({title:"",description:"",location:"",city:"",price:"",deposit:"",area:"",type:"Apartment",bhk:"2 BHK",furnishing:"Semi Furnished",minLease:"12",contact:"",amenities:[],images:[]});
  const imgRef=useRef(null);const set=(k,v)=>setForm(f=>({...f,[k]:v}));
  const addImage=e=>{Array.from(e.target.files||[]).forEach(file=>{const r=new FileReader();r.onload=ev=>setForm(f=>({...f,images:[...f.images,ev.target.result]}));r.readAsDataURL(file)})};
  const toggleAmenity=a=>setForm(f=>({...f,amenities:f.amenities.includes(a)?f.amenities.filter(x=>x!==a):[...f.amenities,a]}));
  const submit=()=>{
    if(!form.title||!form.city||!form.price){showToast("Fill title, city & price");return}
    const np={id:Date.now(),title:form.title,description:form.description||"No description",city:form.city,location:`${form.location}, ${form.city}`,price:Number(form.price),deposit:Number(form.deposit)||Number(form.price)*2,area:Number(form.area)||0,type:form.type,bhk:form.bhk,furnishing:form.furnishing,images:form.images.length>0?form.images:[PROPERTY_IMAGES[Math.floor(Math.random()*PROPERTY_IMAGES.length)]],owner:profile.name||user.name,ownerPhone:form.contact||profile.phone||"",amenities:form.amenities,rating:0,reviews:0,available:true,minLease:Number(form.minLease)||12,postedDaysAgo:0,views:0,enquiries:0};
    setMyProperties(p=>[np,...p]);setForm({title:"",description:"",location:"",city:"",price:"",deposit:"",area:"",type:"Apartment",bhk:"2 BHK",furnishing:"Semi Furnished",minLease:"12",contact:"",amenities:[],images:[]});setShowForm(false);showToast("Property listed!");
  };
  return(<div className="dash">
    <div className="dash-header"><div><h1>Owner Dashboard</h1><div style={{color:"var(--ts)",fontSize:15,marginTop:4}}>Manage your properties</div></div><button className="btn btn-p" onClick={()=>setShowForm(!showForm)}>{I.plus} {showForm?"Cancel":"Add Property"}</button></div>
    <div className="dash-stats">
      <div className="dash-stat anim-in s1"><div className="ds-ic">🏠</div><div className="ds-num">{myProperties.length}</div><div className="ds-lab">Listed</div></div>
      <div className="dash-stat anim-in s2"><div className="ds-ic">👁️</div><div className="ds-num">{myProperties.reduce((s,p)=>s+(Number(p.views)||0),0)}</div><div className="ds-lab">Views</div></div>
      <div className="dash-stat anim-in s3"><div className="ds-ic">💬</div><div className="ds-num">{myProperties.reduce((s,p)=>s+(Number(p.enquiries)||0),0)}</div><div className="ds-lab">Enquiries</div></div>
      <div className="dash-stat anim-in s4"><div className="ds-ic">⭐</div><div className="ds-num">{(()=>{const r=myProperties.filter(p=>Number(p.rating)>0);return r.length? (r.reduce((s,p)=>s+Number(p.rating),0)/r.length).toFixed(1):"—"})()}</div><div className="ds-lab">Avg Rating</div></div>
    </div>
    {showForm&&<div className="ap-form" style={{marginBottom:32}}>
      <h3>Add New Property</h3><p className="ap-sub">Fill in details to list on StayFinder</p>
      <div className="ap-grid">
        <div className="fg ap-full"><label>Property Title</label><input className="fg-in" value={form.title} onChange={e=>set("title",e.target.value)} placeholder="e.g. 2 BHK in Bandra"/></div>
        <div className="fg"><label>City</label><select className="fg-in" value={form.city} onChange={e=>set("city",e.target.value)}><option value="">Select city</option>{CITIES.map(c=><option key={c} value={c}>{c}</option>)}</select></div>
        <div className="fg"><label>Locality</label><input className="fg-in" value={form.location} onChange={e=>set("location",e.target.value)} placeholder="e.g. Koramangala"/></div>
        <div className="fg"><label>Rent (₹/mo)</label><input className="fg-in" type="number" value={form.price} onChange={e=>set("price",e.target.value)} placeholder="15000"/></div>
        <div className="fg"><label>Deposit (₹)</label><input className="fg-in" type="number" value={form.deposit} onChange={e=>set("deposit",e.target.value)} placeholder="30000"/></div>
        <div className="fg"><label>Area (sq.ft)</label><input className="fg-in" type="number" value={form.area} onChange={e=>set("area",e.target.value)} placeholder="1000"/></div>
        <div className="fg"><label>Type</label><select className="fg-in" value={form.type} onChange={e=>set("type",e.target.value)}>{PROPERTY_TYPES.map(t=><option key={t} value={t}>{t}</option>)}</select></div>
        <div className="fg"><label>BHK</label><select className="fg-in" value={form.bhk} onChange={e=>set("bhk",e.target.value)}>{BHK_OPTIONS.map(b=><option key={b} value={b}>{b}</option>)}</select></div>
        <div className="fg"><label>Furnishing</label><select className="fg-in" value={form.furnishing} onChange={e=>set("furnishing",e.target.value)}>{FURNISHING.map(f=><option key={f} value={f}>{f}</option>)}</select></div>
        <div className="fg"><label>Min Lease (mo)</label><input className="fg-in" type="number" value={form.minLease} onChange={e=>set("minLease",e.target.value)} placeholder="12"/></div>
        <div className="fg ap-full"><label>Your Contact Number</label><input className="fg-in" type="tel" value={form.contact} onChange={e=>set("contact",e.target.value)} placeholder="+91 98765 43210 (tenants will see this)"/></div>
        <div className="fg ap-full"><label>Description</label><textarea className="fg-in" rows={3} value={form.description} onChange={e=>set("description",e.target.value)} placeholder="Describe your property..." style={{resize:"vertical",minHeight:80}}/></div>
        <div className="fg ap-full"><label>Amenities</label><div style={{display:"flex",flexWrap:"wrap",gap:8,marginTop:8}}>{AMENITIES_LIST.map(a=><button key={a} className={`btn btn-sm ${form.amenities.includes(a)?"btn-d":"btn-o"}`} onClick={()=>toggleAmenity(a)}>{a}</button>)}</div></div>
        <div className="fg ap-full"><label>Photos</label><div className="ap-imgs">{form.images.map((img,i)=><div className="ap-img-box" key={i}><img src={img} alt=""/><button className="ap-rm" onClick={()=>setForm(f=>({...f,images:f.images.filter((_,j)=>j!==i)}))}>&times;</button></div>)}<div className="ap-img-box" onClick={()=>imgRef.current?.click()}>{I.plus}</div></div><input ref={imgRef} type="file" accept="image/*" multiple style={{display:"none"}} onChange={addImage}/></div>
      </div>
      <div className="pf-save-row"><button className="btn btn-o" onClick={()=>setShowForm(false)}>Cancel</button><button className="btn btn-p btn-lg" onClick={submit}>List Property</button></div>
    </div>}
    {myProperties.length>0?<div style={{overflowX:"auto"}}><table className="pl-table"><thead><tr><th>Photo</th><th>Title</th><th>City</th><th>Rent</th><th>Type</th><th>Status</th><th>Actions</th></tr></thead><tbody>{myProperties.map(p=><tr key={p.id}><td><img className="pl-thumb" src={p.images[0]} alt=""/></td><td style={{fontWeight:600}}>{p.title}</td><td>{p.city}</td><td>₹{p.price.toLocaleString()}/mo</td><td>{p.type}</td><td><span className="pl-status active">Active</span></td><td><div className="pl-actions"><button type="button" className="pl-act" title="View" onClick={()=>openProperty(p)}>{I.eye}</button><button type="button" className="pl-act del" title="Delete" onClick={()=>{setMyProperties(pp=>pp.filter(x=>x.id!==p.id));showToast("Removed")}}>{I.trash}</button></div></td></tr>)}</tbody></table></div>
    :!showForm&&<div style={{textAlign:"center",padding:"60px 0",color:"var(--ts)"}}><div style={{fontSize:48,marginBottom:16}}>🏠</div><div style={{fontSize:18,fontWeight:600,marginBottom:8}}>No properties listed yet</div><div style={{marginBottom:20}}>Start by adding your first property</div><button className="btn btn-p" onClick={()=>setShowForm(true)}>{I.plus} Add Property</button></div>}
  </div>);
}

/* ═══════════ CONTACT ═══════════ */
function ContactPage({showToast}){
  const[cf,setCf]=useState({name:"",email:"",subject:"",message:""});
  const send=()=>{if(!cf.name||!cf.email||!cf.message){showToast("Fill required fields");return}showToast("Message sent!");setCf({name:"",email:"",subject:"",message:""})};
  return(<div className="page">
    <h1>Get in Touch</h1><p className="page-sub">Have a question? We respond within 24 hours.</p>
    <div className="contact-grid">
      <div className="contact-cards">
        <div className="c-card anim-in s1"><div className="c-card-ic">{I.mail}</div><div><h4>Email Us</h4><p>support@stayfinder.in</p></div></div>
        <div className="c-card anim-in s2"><div className="c-card-ic">{I.phone}</div><div><h4>Call Us</h4><p>+91 98765 43210</p></div></div>
        <div className="c-card anim-in s3"><div className="c-card-ic">{I.map}</div><div><h4>Visit Us</h4><p>Koramangala, Bangalore 560034</p></div></div>
        <div className="c-card anim-in s4"><div className="c-card-ic">{I.contact}</div><div><h4>Hours</h4><p>Mon — Sat, 9 AM — 7 PM IST</p></div></div>
      </div>
      <div className="contact-form anim-in s2"><h3>Send a Message</h3>
        <div className="fg"><label>Your Name *</label><input className="fg-in" value={cf.name} onChange={e=>setCf(p=>({...p,name:e.target.value}))} placeholder="Full name"/></div>
        <div className="fg"><label>Email *</label><input className="fg-in" type="email" value={cf.email} onChange={e=>setCf(p=>({...p,email:e.target.value}))} placeholder="you@example.com"/></div>
        <div className="fg"><label>Subject</label><input className="fg-in" value={cf.subject} onChange={e=>setCf(p=>({...p,subject:e.target.value}))} placeholder="How can we help?"/></div>
        <div className="fg"><label>Message *</label><textarea className="cf-ta" value={cf.message} onChange={e=>setCf(p=>({...p,message:e.target.value}))} placeholder="Your message..."/></div>
        <button className="btn btn-p btn-lg" style={{width:"100%",marginTop:8,justifyContent:"center"}} onClick={send}>Send Message</button>
      </div>
    </div>
  </div>);
}

/* ═══════════ ABOUT ═══════════ */
function AboutPage(){
  return(<div className="page">
    <h1>About StayFinder</h1><p className="page-sub">India's most trusted platform for long-term rentals — connecting tenants with owners, eliminating brokers, making renting transparent.</p>
    <div className="about-grid">
      <div className="about-card anim-in s1"><div className="ab-ic">🎯</div><h4>Our Mission</h4><p>Make renting as easy as booking a ride. No brokers, no hidden charges — just honest connections.</p></div>
      <div className="about-card anim-in s2"><div className="ab-ic">🤝</div><h4>Zero Brokerage</h4><p>We never charge brokerage. Owners list free, tenants search free. Revenue from optional premium features.</p></div>
      <div className="about-card anim-in s3"><div className="ab-ic">✅</div><h4>Verified Listings</h4><p>Every property is verified. We check documents, photos, and details so you trust what you see.</p></div>
      <div className="about-card anim-in s4"><div className="ab-ic">🛡️</div><h4>Safe & Secure</h4><p>Secure payments, digital agreements, and dedicated support to resolve any disputes.</p></div>
    </div>
    <div style={{marginTop:56}}><h2 style={{fontFamily:"var(--fd)",fontSize:28,fontWeight:600,marginBottom:8}}>Meet the Team</h2><p style={{color:"var(--ts)",fontSize:15,marginBottom:8}}>Passionate people building a better rental experience</p>
      <div className="team-grid">{[{n:"Arjun Mehta",r:"Founder & CEO"},{n:"Priya Sharma",r:"CTO"},{n:"Rohan Patel",r:"Design Lead"},{n:"Sneha Iyer",r:"Operations"}].map((m,i)=><div className={`team-card anim-in s${i+1}`} key={i}><div className="team-av">{m.n[0]}</div><h4>{m.n}</h4><p>{m.r}</p></div>)}</div>
    </div>
  </div>);
}

/* ═══════════════════ MAIN APP ═══════════════════ */
function StayFinder(){
  const[user,setUser]=useState(null);const[showAuth,setShowAuth]=useState(false);
  const[selectedProperty,setSelectedProperty]=useState(null);const[liked,setLiked]=useState(new Set());
  const[activeCategory,setActiveCategory]=useState("Apartments");
  const[filterSearch,setFilterSearch]=useState("");const[filterCity,setFilterCity]=useState("");const[filterType,setFilterType]=useState("");const[filterBhk,setFilterBhk]=useState("");const[filterFurnish,setFilterFurnish]=useState("");const[filterBudget,setFilterBudget]=useState("");
  const BUDGETS=[{label:"Under ₹10K",max:10000},{label:"₹10K–20K",min:10000,max:20000},{label:"₹20K–35K",min:20000,max:35000},{label:"₹35K–50K",min:35000,max:50000},{label:"₹50K+",min:50000}];
  const[toast,setToast]=useState(null);const[scrolled,setScrolled]=useState(false);
  const[page,setPage]=useState("home");const[showDropdown,setShowDropdown]=useState(false);
  const[profile,setProfile]=useState({name:"",phone:"",dob:"",gender:"",address:"",city:"",occupation:"",bio:"",role:"",photo:null});
  const[myProperties,setMyProperties]=useState([]);const ddRef=useRef(null);

  useEffect(()=>{const h=()=>setScrolled(window.scrollY>10);window.addEventListener("scroll",h);return()=>window.removeEventListener("scroll",h)},[]);
  useEffect(()=>{const h=e=>{if(ddRef.current&&!ddRef.current.contains(e.target))setShowDropdown(false)};document.addEventListener("mousedown",h);return()=>document.removeEventListener("mousedown",h)},[]);

  const showToast=useCallback(msg=>{setToast(msg);setTimeout(()=>setToast(null),3000)},[]);
  const openPropertyDetail=useCallback(p=>{if(!p?.id)return;const vn=(profile.name||user?.name||"").trim().toLowerCase();const on=(p.owner||"").trim().toLowerCase();const isOwn=user&&vn&&on&&vn===on;setSelectedProperty(p);if(!isOwn)setMyProperties(prev=>prev.map(x=>x.id===p.id?{...x,views:(Number(x.views)||0)+1}:x))},[user,profile.name,user?.name]);
  const recordEnquiry=useCallback(p=>{if(!p?.id||!user)return;const vn=(profile.name||user?.name||"").trim().toLowerCase();const on=(p.owner||"").trim().toLowerCase();if(vn&&on&&vn===on)return;setMyProperties(prev=>prev.map(x=>x.id===p.id?{...x,enquiries:(Number(x.enquiries)||0)+1}:x))},[user,profile.name,user?.name]);
  const handleLike=useCallback(id=>{setLiked(prev=>{const n=new Set(prev);if(n.has(id)){n.delete(id);showToast("Removed from wishlist")}else{n.add(id);showToast("Saved to wishlist")}return n})},[showToast]);
  const handleAuth=u=>{setUser(u);setShowAuth(false);setProfile(p=>({...p,name:p.name||u.name}));showToast(`Welcome, ${u.name}!`)};
  const handleLogout=()=>{setUser(null);setShowDropdown(false);setPage("home");showToast("Logged out")};
  const goTo=pg=>{setPage(pg);setShowDropdown(false);window.scrollTo({top:0,behavior:"smooth"})};

  const allProperties=myProperties;
  let filtered=allProperties;
  // Advanced filter panel
  if(filterSearch)filtered=filtered.filter(p=>p.title.toLowerCase().includes(filterSearch.toLowerCase())||p.location.toLowerCase().includes(filterSearch.toLowerCase())||p.city.toLowerCase().includes(filterSearch.toLowerCase())||p.owner.toLowerCase().includes(filterSearch.toLowerCase()));
  if(filterCity)filtered=filtered.filter(p=>p.city===filterCity);
  if(filterType)filtered=filtered.filter(p=>p.type===filterType);
  if(filterBhk)filtered=filtered.filter(p=>p.bhk===filterBhk);
  if(filterFurnish)filtered=filtered.filter(p=>p.furnishing===filterFurnish);
  if(filterBudget){const b=BUDGETS.find(x=>x.label===filterBudget);if(b){if(b.min)filtered=filtered.filter(p=>p.price>=b.min);if(b.max)filtered=filtered.filter(p=>p.price<=b.max)}}
  const activeFilters=[];
  if(filterCity)activeFilters.push({label:filterCity,clear:()=>setFilterCity("")});
  if(filterType)activeFilters.push({label:filterType,clear:()=>setFilterType("")});
  if(filterBhk)activeFilters.push({label:filterBhk,clear:()=>setFilterBhk("")});
  if(filterFurnish)activeFilters.push({label:filterFurnish,clear:()=>setFilterFurnish("")});
  if(filterBudget)activeFilters.push({label:filterBudget,clear:()=>setFilterBudget("")});
  const clearAllFilters=()=>{setFilterSearch("");setFilterCity("");setFilterType("");setFilterBhk("");setFilterFurnish("");setFilterBudget("")};
  const hasAnyFilter=filterSearch||filterCity||filterType||filterBhk||filterFurnish||filterBudget;

  return(<>
    {/* HEADER */}
    <header className={`hd ${scrolled?"sc":""}`}><div className="hd-in">
      <div className="logo" onClick={()=>goTo("home")}><div className="logo-ic">SF</div>StayFinder</div>
      <nav className="nav">
        <button className={`nav-lk ${page==="home"?"act":""}`} onClick={()=>goTo("home")}>{I.home} Home</button>
        {user&&profile.role==="owner"&&<button className={`nav-lk ${page==="owner-dash"?"act":""}`} onClick={()=>goTo("owner-dash")}>{I.dash} My Properties</button>}
        <button className={`nav-lk ${page==="about"?"act":""}`} onClick={()=>goTo("about")}>{I.about} About</button>
        <button className={`nav-lk ${page==="contact"?"act":""}`} onClick={()=>goTo("contact")}>{I.contact} Contact</button>
      </nav>
      <div style={{display:"flex",alignItems:"center",gap:10}}>
        {user?<div className="u-menu" ref={ddRef}>
          <div className="u-pill" onClick={()=>setShowDropdown(!showDropdown)}>
            <div className="u-ham"><span/><span/><span/></div>
            <div className="u-av">{profile.photo?<img src={profile.photo} alt=""/>:(profile.name||user.name||"U")[0].toUpperCase()}</div>
          </div>
          {showDropdown&&<div className="dd">
            <div className="dd-head">
              <div className="dd-av">{profile.photo?<img src={profile.photo} alt=""/>:(profile.name||user.name||"U")[0].toUpperCase()}</div>
              <div><div className="dd-name">{profile.name||user.name}</div><div className="dd-email">{user.email}</div>{profile.phone&&<div className="dd-email">{profile.phone}</div>}{profile.role==="owner"&&<div className="dd-role">🏠 Owner</div>}</div>
            </div>
            <button className="dd-item" onClick={()=>goTo("profile")}>{I.user} My Profile</button>
            {profile.role==="owner"&&<button className="dd-item" onClick={()=>goTo("owner-dash")}>{I.dash} Owner Dashboard</button>}
            <button className="dd-item" onClick={()=>goTo("wishlist")}>{I.heart(false)} Wishlist</button>
            <div className="dd-sep"/>
            <button className="dd-item danger" onClick={handleLogout}>{I.logout} Log Out</button>
          </div>}
        </div>:<>
          <button className="btn btn-g" onClick={()=>setShowAuth(true)}>Log in</button>
          <button className="btn btn-p" onClick={()=>setShowAuth(true)}>Sign up</button>
        </>}
      </div>
    </div></header>

    {/* HOME */}
    {page==="home"&&<>
      <section className="hero"><div className="hero-bg">{["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1400&q=80","https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1400&q=80","https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1400&q=80","https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1400&q=80"].map((u,i)=><div key={i} className="hero-sl" style={{backgroundImage:`url(${u})`}}/>)}<div className="hero-ov"/></div>
        <div className="hero-ct">
          <div className="hero-badge">🏡 No Brokers · Direct Owner Connect</div>
          <h1>Find Your Perfect Long-Term Home</h1>
          <p className="hero-sub">Rent flats & houses for months or years — directly from owners. Zero brokerage.</p>
        </div>
      </section>
      <div className="mq-wrap"><div className="mq">{[...Array(2)].flatMap((_,r)=>[<div className="mq-i" key={`a${r}`}><strong>10,000+</strong> Properties</div>,<div className="mq-i" key={`b${r}`}><strong>Zero</strong> Brokerage</div>,<div className="mq-i" key={`c${r}`}><strong>50+</strong> Cities</div>,<div className="mq-i" key={`d${r}`}><strong>Direct</strong> Owner Contact</div>,<div className="mq-i" key={`e${r}`}><strong>Verified</strong> Listings</div>,<div className="mq-i" key={`f${r}`}><strong>24/7</strong> Support</div>])}</div></div>
      <div className="cats">{CATEGORIES.map(c=><button key={c.label} className={`cat ${activeCategory===c.label?"act":""}`} onClick={()=>setActiveCategory(c.label)}><span className="ci">{c.icon}</span><span className="cl">{c.label}</span></button>)}</div>
      <div className="sec"><div className="sec-hd"><div><div className="sec-t">Featured Properties</div><div className="sec-st">Hand-picked homes updated daily</div></div></div><FeaturedSlider properties={filtered.length>0?filtered:allProperties} onOpen={openPropertyDetail}/></div>
      <div className="sec"><div className="sec-hd"><div><div className="sec-t">Explore by City</div><div className="sec-st">Popular long-term rental destinations</div></div></div><div className="cities">{Object.entries(CITY_IMAGES).map(([c,img])=><div className="city" key={c} onClick={()=>{setFilterCity(c);window.scrollTo({top:1200,behavior:"smooth"})}}><img src={img} alt={c}/><div className="city-ov"><div className="city-n">{c}</div><div className="city-c">{allProperties.filter(p=>p.city===c).length} listings</div></div></div>)}</div></div>
      <div className="sec">
        <div className="tf-wrap">
          <div className="tf-title">Find Your Perfect Property</div>
          <div className="tf-sub">Search and filter owner-listed rentals across {CITIES.length} cities — zero brokerage</div>
          <div className="tf-search">{I.search}<input placeholder="Search by city, locality, property name, owner..." value={filterSearch} onChange={e=>setFilterSearch(e.target.value)}/>{filterSearch&&<button style={{background:"none",border:"none",cursor:"pointer",color:"var(--ts)",fontSize:16}} onClick={()=>setFilterSearch("")}>✕</button>}</div>
          <div className="tf-row">
            <div className="tf-col"><label>City</label><select className="tf-select" value={filterCity} onChange={e=>setFilterCity(e.target.value)}><option value="">All Cities</option>{CITIES.map(c=><option key={c} value={c}>{c}</option>)}</select></div>
            <div className="tf-col"><label>Property Type</label><select className="tf-select" value={filterType} onChange={e=>setFilterType(e.target.value)}><option value="">All Types</option>{PROPERTY_TYPES.map(t=><option key={t} value={t}>{t}</option>)}</select></div>
            <div className="tf-col"><label>BHK</label><select className="tf-select" value={filterBhk} onChange={e=>setFilterBhk(e.target.value)}><option value="">All BHK</option>{BHK_OPTIONS.map(b=><option key={b} value={b}>{b}</option>)}</select></div>
            <div className="tf-col"><label>Furnishing</label><select className="tf-select" value={filterFurnish} onChange={e=>setFilterFurnish(e.target.value)}><option value="">Any</option>{FURNISHING.map(f=><option key={f} value={f}>{f}</option>)}</select></div>
          </div>
          <div style={{marginBottom:4}}><label style={{fontSize:12,fontWeight:600,textTransform:"uppercase",letterSpacing:".5px",color:"var(--ts)"}}>Budget Range</label></div>
          <div className="tf-budget">{BUDGETS.map(b=><button key={b.label} className={`tf-budget-opt ${filterBudget===b.label?"sel":""}`} onClick={()=>setFilterBudget(filterBudget===b.label?"":b.label)}>{b.label}</button>)}</div>
          {activeFilters.length>0&&<div className="tf-tags">{activeFilters.map((af,i)=><div className="tf-tag" key={i}>{af.label} <button onClick={af.clear}>✕</button></div>)}<button style={{background:"none",border:"none",color:"var(--p)",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"var(--f)",padding:"6px 8px"}} onClick={clearAllFilters}>Clear all</button></div>}
        </div>
        <div style={{marginBottom:12,marginTop:24,display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{fontWeight:600,fontSize:16}}>{filtered.length} {filtered.length===1?"property":"properties"} found</span>{hasAnyFilter&&allProperties.length>0&&<span style={{fontSize:14,color:"var(--ts)"}}>out of {allProperties.length} total</span>}</div>
        {filtered.length>0?<div className="grid">{filtered.map((p,i)=><div key={p.id} className={`anim-in s${(i%8)+1}`}><PropertyCard property={p} onOpen={openPropertyDetail} onLike={handleLike} liked={liked.has(p.id)}/></div>)}</div>:<div style={{textAlign:"center",padding:"60px 0",color:"var(--ts)"}}><div style={{fontSize:48,marginBottom:16}}>{allProperties.length===0?"🏠":"🔍"}</div><div style={{fontSize:18,fontWeight:600,marginBottom:8}}>{allProperties.length===0?"No listings yet":hasAnyFilter?"No properties match your filters":"No listings match"}</div><div style={{marginBottom:20}}>{allProperties.length===0?"Properties appear here when owners list them. List yours free.":hasAnyFilter?"Try changing or removing some filters":"Adjust your search"}</div>{hasAnyFilter&&<button className="btn btn-p" onClick={clearAllFilters}>Clear filters</button>}{allProperties.length===0&&<button className="btn btn-p" style={{marginLeft:hasAnyFilter?12:0}} onClick={()=>{if(!user)setShowAuth(true);else if(profile.role!=="owner"){goTo("profile");showToast("Set yourself as Property Owner in your profile")}else goTo("owner-dash")}}>List a property</button>}</div>}
      </div>
      <div className="sec"><div className="sec-hd"><div><div className="sec-t">How StayFinder Works</div><div className="sec-st">3 simple steps</div></div></div><div className="how"><div className="how-c"><div className="how-ic">🔍</div><h4>Search & Explore</h4><p>Browse thousands of verified properties. Filter by budget, type, amenities.</p></div><div className="how-c"><div className="how-ic">💬</div><h4>Connect with Owner</h4><p>Contact owners directly — no middleman, no broker fees.</p></div><div className="how-c"><div className="how-ic">🏡</div><h4>Move In</h4><p>Finalize lease, pay deposit, move in. Simple.</p></div></div></div>
      <div className="sec"><div className="cta"><div><h2>Own a Property? List it Free</h2><p>Reach thousands of tenants. No commission, just direct connections.</p></div><button className="btn btn-lg" onClick={()=>{if(!user)setShowAuth(true);else if(profile.role!=="owner"){goTo("profile");showToast("Set yourself as 'Property Owner' in your profile")}else goTo("owner-dash")}}>List Your Property</button></div></div>
    </>}

    {page==="profile"&&user&&<ProfilePage user={user} profile={profile} setProfile={setProfile} showToast={showToast}/>}
    {page==="owner-dash"&&user&&<OwnerDashboard user={user} profile={profile} showToast={showToast} myProperties={myProperties} setMyProperties={setMyProperties} openProperty={openPropertyDetail}/>}
    {page==="wishlist"&&<div className="sec" style={{minHeight:"60vh"}}><div className="sec-hd"><div><div className="sec-t">Wishlist</div><div className="sec-st">{allProperties.filter(p=>liked.has(p.id)).length} saved</div></div></div>{allProperties.filter(p=>liked.has(p.id)).length>0?<div className="grid">{allProperties.filter(p=>liked.has(p.id)).map((p,i)=><div key={p.id} className={`anim-in s${(i%8)+1}`}><PropertyCard property={p} onOpen={openPropertyDetail} onLike={handleLike} liked/></div>)}</div>:<div style={{textAlign:"center",padding:"80px 0",color:"var(--ts)"}}><div style={{fontSize:48,marginBottom:16}}>❤️</div><div style={{fontSize:18,fontWeight:600,marginBottom:8}}>No saved properties</div><button className="btn btn-p" style={{marginTop:24}} onClick={()=>goTo("home")}>Explore</button></div>}</div>}
    {page==="about"&&<AboutPage/>}
    {page==="contact"&&<ContactPage showToast={showToast}/>}
    {(page==="profile"||page==="owner-dash")&&!user&&<div className="sec" style={{minHeight:"60vh",textAlign:"center",paddingTop:100}}><div style={{fontSize:56,marginBottom:16}}>🔒</div><div style={{fontSize:22,fontWeight:600,marginBottom:8}}>Please log in</div><div style={{color:"var(--ts)",marginBottom:24}}>You need to be logged in to access this page</div><button className="btn btn-p btn-lg" onClick={()=>setShowAuth(true)}>Log In / Sign Up</button></div>}

    <footer className="ft"><div className="ft-in"><div className="ft-grid">
      <div className="ft-col"><h4>StayFinder</h4><a onClick={()=>goTo("about")}>About Us</a><a onClick={()=>goTo("home")}>How it Works</a><a>Careers</a><a>Press</a></div>
      <div className="ft-col"><h4>For Tenants</h4><a onClick={()=>goTo("home")}>Search Properties</a><a>Rental Guide</a><a>Tenant Rights</a><a>FAQs</a></div>
      <div className="ft-col"><h4>For Owners</h4><a onClick={()=>goTo(user&&profile.role==="owner"?"owner-dash":"home")}>List Property</a><a>Dashboard</a><a>Pricing</a><a>Verification</a></div>
      <div className="ft-col"><h4>Support</h4><a onClick={()=>goTo("contact")}>Help Center</a><a>Safety</a><a>Terms</a><a>Privacy</a></div>
    </div><div className="ft-btm"><div className="ft-cp">© 2026 StayFinder. No brokers, just homes.</div><div className="ft-lks"><a>English (IN)</a><a>₹ INR</a></div></div></div></footer>

    {selectedProperty&&<PropertyModal property={selectedProperty} onClose={()=>setSelectedProperty(null)} user={user} onShowAuth={()=>{setSelectedProperty(null);setShowAuth(true)}} onRecordEnquiry={recordEnquiry} viewerIsOwner={!!user&&(profile.name||user.name||"").trim().toLowerCase()===(selectedProperty.owner||"").trim().toLowerCase()}/>}
    {showAuth&&<AuthModal onClose={()=>setShowAuth(false)} onAuth={handleAuth}/>}
    {toast&&<div className="toast">{toast}</div>}
  </>);
}

export default function App() {
  return <StayFinder />;
}
