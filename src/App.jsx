import { useState, useEffect, useRef, useCallback } from "react";
import { api, setToken } from "./services/api.js";

const FONTS_URL = "https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=Playfair+Display:wght@400;500;600;700&display=swap";

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
const OWNER_NAMES = ["Arjun Mehta","Priya Sharma","Rohan Patel","Sneha Iyer","Vikram Singh","Ananya Rao","Karan Desai","Meera Nair","Rahul Gupta","Divya Joshi","Amit Kulkarni","Neha Agarwal"];
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

function generateProperties(count=24){
  // Disabled client-side fake properties — server should provide real listings.
  return [];
}
const ALL_PROPERTIES = generateProperties(24); // intentionally empty; server-backed properties are used instead

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

/* ═══════════════════ CSS ═══════════════════ */
const css = `
@import url('${FONTS_URL}');
:root{--p:#FF385C;--pd:#D70466;--pl:#FFE4E9;--dark:#1A1A2E;--t:#222;--ts:#717171;--tl:#ACACAC;--bg:#FFF;--bgs:#F7F7F7;--bdr:#EBEBEB;--sh:0 2px 16px rgba(0,0,0,.08);--shl:0 8px 40px rgba(0,0,0,.12);--shh:0 8px 30px rgba(0,0,0,.15);--r:12px;--rl:16px;--rxl:24px;--tr:.25s cubic-bezier(.4,0,.2,1);--f:'DM Sans',sans-serif;--fd:'Playfair Display',serif;--grad:linear-gradient(135deg,#FF385C 0%,#E61E4D 50%,#D70466 100%)}
*{margin:0;padding:0;box-sizing:border-box}
body,html{font-family:var(--f);color:var(--t);background:var(--bg);-webkit-font-smoothing:antialiased;overflow-x:hidden}
::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:transparent}::-webkit-scrollbar-thumb{background:#ccc;border-radius:3px}
@keyframes fadeIn{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeInUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}
@keyframes scaleIn{from{opacity:0;transform:scale(.95)}to{opacity:1;transform:scale(1)}}
@keyframes heartBeat{0%{transform:scale(1)}25%{transform:scale(1.3)}50%{transform:scale(1)}75%{transform:scale(1.15)}100%{transform:scale(1)}}
@keyframes heroSlide{0%{opacity:0;transform:scale(1.05)}10%{opacity:1;transform:scale(1)}30%{opacity:1}35%{opacity:0;transform:scale(1.02)}100%{opacity:0;transform:scale(1.02)}}
@keyframes marquee{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
@keyframes gradientMove{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
@keyframes slideDown{from{opacity:0;transform:translateY(-10px)}to{opacity:1;transform:translateY(0)}}
.anim-in{animation:fadeIn .5s ease-out both}
.s1{animation-delay:.05s}.s2{animation-delay:.1s}.s3{animation-delay:.15s}.s4{animation-delay:.2s}.s5{animation-delay:.25s}.s6{animation-delay:.3s}.s7{animation-delay:.35s}.s8{animation-delay:.4s}
.hd{position:sticky;top:0;z-index:100;background:rgba(255,255,255,.97);backdrop-filter:blur(16px);border-bottom:1px solid var(--bdr);transition:box-shadow var(--tr)}
.hd.sc{box-shadow:0 2px 20px rgba(0,0,0,.06)}
.hd-in{max-width:1440px;margin:0 auto;padding:0 40px;height:72px;display:flex;align-items:center;justify-content:space-between}
.logo{display:flex;align-items:center;gap:8px;font-family:var(--fd);font-size:24px;font-weight:700;color:var(--p);cursor:pointer;transition:transform var(--tr)}
.logo:hover{transform:scale(1.03)}
.logo-ic{width:36px;height:36px;background:var(--grad);border-radius:10px;display:flex;align-items:center;justify-content:center;color:#fff;font-size:18px;font-family:var(--f);font-weight:700}
.nav{display:flex;align-items:center;gap:2px}
.nav-lk{padding:10px 16px;border-radius:24px;font-size:14px;font-weight:500;color:var(--ts);cursor:pointer;transition:all var(--tr);border:none;background:none;font-family:var(--f);display:flex;align-items:center;gap:6px}
.nav-lk:hover{background:var(--bgs);color:var(--t)}.nav-lk.act{color:var(--t);background:var(--bgs);font-weight:600}
.btn{padding:10px 22px;border-radius:24px;font-size:14px;font-weight:600;cursor:pointer;transition:all var(--tr);border:none;font-family:var(--f);display:inline-flex;align-items:center;gap:8px}
.btn-o{background:transparent;color:var(--t);border:1.5px solid var(--bdr)}.btn-o:hover{background:var(--bgs);border-color:var(--t)}
.btn-p{background:var(--grad);color:#fff;border:none;box-shadow:0 4px 14px rgba(255,56,92,.35)}.btn-p:hover{transform:translateY(-1px);box-shadow:0 6px 20px rgba(255,56,92,.45)}.btn-p:active{transform:translateY(0)}
.btn-g{background:none;border:none;color:var(--ts);padding:10px 14px}.btn-g:hover{color:var(--t);background:var(--bgs)}
.btn-lg{padding:14px 32px;font-size:16px;border-radius:28px}
.btn-sm{padding:8px 16px;font-size:13px;border-radius:20px}
.btn-d{background:var(--p);color:#fff;border:none;box-shadow:0 2px 8px rgba(255,56,92,.25)}.btn-d:hover{background:var(--pd);transform:translateY(-1px)}
.u-menu{position:relative}
.u-pill{display:flex;align-items:center;gap:10px;padding:5px 5px 5px 14px;border:1.5px solid var(--bdr);border-radius:28px;cursor:pointer;transition:all var(--tr);background:#fff}.u-pill:hover{box-shadow:var(--sh)}
.u-av{width:34px;height:34px;border-radius:50%;background:var(--grad);color:#fff;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:600;overflow:hidden}.u-av img{width:100%;height:100%;object-fit:cover}
.u-ham{display:flex;flex-direction:column;gap:4px}.u-ham span{display:block;width:16px;height:2px;background:var(--ts);border-radius:1px}
.dd{position:absolute;top:calc(100% + 8px);right:0;background:#fff;border-radius:var(--rl);box-shadow:var(--shl);border:1px solid var(--bdr);min-width:240px;z-index:200;animation:slideDown .2s ease-out;overflow:hidden}
.dd-head{padding:16px 20px;border-bottom:1px solid var(--bdr);display:flex;align-items:center;gap:12px}
.dd-av{width:40px;height:40px;border-radius:50%;background:var(--grad);color:#fff;display:flex;align-items:center;justify-content:center;font-weight:600;overflow:hidden;flex-shrink:0}.dd-av img{width:100%;height:100%;object-fit:cover}
.dd-name{font-weight:600;font-size:14px}.dd-email{font-size:12px;color:var(--ts)}
.dd-role{font-size:11px;color:var(--p);font-weight:600;background:var(--pl);padding:2px 8px;border-radius:10px;margin-top:2px;display:inline-block}
.dd-item{display:flex;align-items:center;gap:10px;padding:12px 20px;font-size:14px;color:var(--t);cursor:pointer;transition:all var(--tr);border:none;background:none;width:100%;text-align:left;font-family:var(--f)}.dd-item:hover{background:var(--bgs)}.dd-item.danger{color:#e53935}
.dd-sep{height:1px;background:var(--bdr);margin:4px 0}
.hero{position:relative;overflow:hidden;height:540px;background:var(--dark)}
.hero-bg{position:absolute;inset:0}
.hero-sl{position:absolute;inset:0;background-size:cover;background-position:center;animation:heroSlide 20s infinite}
.hero-sl:nth-child(2){animation-delay:-15s}.hero-sl:nth-child(3){animation-delay:-10s}.hero-sl:nth-child(4){animation-delay:-5s}
.hero-ov{position:absolute;inset:0;background:linear-gradient(to bottom,rgba(0,0,0,.35),rgba(0,0,0,.55))}
.hero-ct{position:relative;z-index:2;max-width:1440px;margin:0 auto;padding:0 40px;height:100%;display:flex;flex-direction:column;justify-content:center}
.hero-badge{display:inline-flex;align-items:center;gap:8px;padding:8px 18px;border-radius:28px;background:rgba(255,255,255,.15);backdrop-filter:blur(10px);color:#fff;font-size:13px;font-weight:500;margin-bottom:20px;width:fit-content;animation:fadeIn .8s ease-out both;border:1px solid rgba(255,255,255,.2)}
.hero h1{font-family:var(--fd);font-size:56px;font-weight:700;color:#fff;line-height:1.15;max-width:640px;margin-bottom:16px;animation:fadeInUp .8s ease-out .15s both}
.hero-sub{font-size:18px;color:rgba(255,255,255,.85);max-width:500px;line-height:1.6;animation:fadeInUp .8s ease-out .3s both}
.sbar{display:flex;align-items:center;background:#fff;border-radius:60px;padding:8px;margin-top:32px;box-shadow:0 8px 40px rgba(0,0,0,.2);max-width:720px;animation:fadeInUp .8s ease-out .45s both}
.sbar input{flex:1;padding:12px 20px;border:none;outline:none;background:none;font-size:15px;font-family:var(--f);color:var(--t)}.sbar input::placeholder{color:var(--tl)}
.sbar-div{width:1px;height:32px;background:var(--bdr)}
.sbar select{padding:12px 16px;border:none;outline:none;background:none;font-size:15px;font-family:var(--f);color:var(--t);cursor:pointer;min-width:130px;-webkit-appearance:none}
.sbar-btn{background:var(--grad);border:none;border-radius:50%;width:48px;height:48px;min-width:48px;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all var(--tr);color:#fff}.sbar-btn:hover{transform:scale(1.05);box-shadow:0 4px 16px rgba(255,56,92,.4)}
.mq-wrap{background:var(--dark);padding:16px 0;overflow:hidden}
.mq{display:flex;gap:60px;animation:marquee 30s linear infinite;white-space:nowrap}
.mq-i{display:flex;align-items:center;gap:10px;color:rgba(255,255,255,.7);font-size:14px;font-weight:500}.mq-i strong{color:#fff;font-size:16px}
.cats{max-width:1440px;margin:0 auto;padding:24px 40px 8px;display:flex;align-items:center;gap:8px;overflow-x:auto;scrollbar-width:none;position:sticky;top:72px;z-index:50;background:#fff;border-bottom:1px solid var(--bdr)}.cats::-webkit-scrollbar{display:none}
.cat{display:flex;flex-direction:column;align-items:center;gap:6px;padding:10px 16px 12px;border-radius:12px;cursor:pointer;transition:all var(--tr);white-space:nowrap;border:none;background:none;font-family:var(--f);flex-shrink:0;position:relative}
.cat::after{content:'';position:absolute;bottom:0;left:50%;transform:translateX(-50%);width:0;height:2px;background:var(--t);transition:width var(--tr)}
.cat:hover::after,.cat.act::after{width:70%}.cat .ci{font-size:22px}.cat .cl{font-size:12px;color:var(--ts);font-weight:500}.cat.act .cl{color:var(--t);font-weight:600}
.sec{max-width:1440px;margin:0 auto;padding:40px 40px 24px}
.sec-hd{display:flex;align-items:center;justify-content:space-between;margin-bottom:24px}
.sec-t{font-family:var(--fd);font-size:28px;font-weight:600}.sec-st{color:var(--ts);font-size:15px;margin-top:4px}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(290px,1fr));gap:26px}
.card{border-radius:var(--rl);overflow:hidden;cursor:pointer;transition:all var(--tr);animation:fadeIn .5s ease-out both;position:relative}.card:hover{transform:translateY(-4px)}
.card-car{position:relative;width:100%;aspect-ratio:1/.95;overflow:hidden;border-radius:var(--rl);background:var(--bgs)}
.card-img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;transition:opacity .45s ease}.card-img.hide{opacity:0}
.card-nv{position:absolute;top:50%;transform:translateY(-50%);width:28px;height:28px;border-radius:50%;background:rgba(255,255,255,.92);border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 6px rgba(0,0,0,.15);transition:all var(--tr);opacity:0;font-size:12px;z-index:3}
.card:hover .card-nv{opacity:1}.card-nv:hover{transform:translateY(-50%) scale(1.1);background:#fff}.card-nv.pv{left:10px}.card-nv.nx{right:10px}
.card-dots{position:absolute;bottom:10px;left:50%;transform:translateX(-50%);display:flex;gap:5px;z-index:3}
.card-dot{width:6px;height:6px;border-radius:50%;background:rgba(255,255,255,.5);transition:all var(--tr)}.card-dot.act{background:#fff;width:8px;height:8px}
.card-wl{position:absolute;top:12px;right:12px;z-index:3;background:rgba(255,255,255,.85);border:none;border-radius:50%;width:34px;height:34px;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all var(--tr);font-size:18px;backdrop-filter:blur(4px)}.card-wl:hover{background:#fff;transform:scale(1.1)}.card-wl.liked{color:var(--p);animation:heartBeat .5s ease}
.card-badge{position:absolute;top:12px;left:12px;z-index:3;padding:6px 12px;border-radius:20px;background:rgba(255,255,255,.92);backdrop-filter:blur(4px);font-size:12px;font-weight:600;color:var(--t)}
.card-info{padding:14px 2px 4px}
.card-top{display:flex;justify-content:space-between;align-items:flex-start}
.card-title{font-size:15px;font-weight:600}.card-rating{display:flex;align-items:center;gap:4px;font-size:14px;font-weight:500;flex-shrink:0}
.card-loc{font-size:14px;color:var(--ts);margin-top:2px}.card-det{font-size:13px;color:var(--tl);margin-top:2px}
.card-price{margin-top:6px;font-size:15px}.card-price strong{font-weight:700}.card-price span{color:var(--ts);font-weight:400}
.feat-sl{position:relative;overflow:hidden;border-radius:var(--rxl);margin-bottom:16px}
.feat-tk{display:flex;transition:transform .6s cubic-bezier(.25,.46,.45,.94)}
.feat-s{min-width:100%;position:relative;height:420px;overflow:hidden}.feat-s img{width:100%;height:100%;object-fit:cover}
.feat-ov{position:absolute;inset:0;background:linear-gradient(to right,rgba(0,0,0,.6),rgba(0,0,0,.1) 70%);display:flex;align-items:flex-end;padding:48px}
.feat-ct{color:#fff;max-width:500px}.feat-ct h3{font-family:var(--fd);font-size:32px;font-weight:600;margin-bottom:8px}.feat-ct p{font-size:15px;opacity:.85;margin-bottom:20px;line-height:1.5}
.feat-ind{position:absolute;bottom:24px;right:48px;display:flex;gap:8px;z-index:3}.feat-id{width:32px;height:4px;border-radius:2px;background:rgba(255,255,255,.4);transition:all .4s ease;cursor:pointer;border:none}.feat-id.act{background:#fff;width:48px}
.sl-arr{position:absolute;top:50%;right:48px;transform:translateY(-50%);display:flex;gap:8px;z-index:3}.sl-ar{width:40px;height:40px;border-radius:50%;background:rgba(255,255,255,.2);backdrop-filter:blur(8px);border:1px solid rgba(255,255,255,.3);color:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all var(--tr)}.sl-ar:hover{background:rgba(255,255,255,.35)}
.cities{display:flex;gap:16px;overflow-x:auto;padding-bottom:8px;scrollbar-width:none}.cities::-webkit-scrollbar{display:none}
.city{min-width:200px;height:260px;border-radius:var(--rl);overflow:hidden;position:relative;cursor:pointer;flex-shrink:0;transition:all var(--tr)}.city:hover{transform:translateY(-4px);box-shadow:var(--shh)}
.city img{width:100%;height:100%;object-fit:cover;transition:transform .6s ease}.city:hover img{transform:scale(1.06)}
.city-ov{position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,.65),transparent 60%);display:flex;flex-direction:column;justify-content:flex-end;padding:20px}
.city-n{color:#fff;font-size:18px;font-weight:600}.city-c{color:rgba(255,255,255,.8);font-size:13px;margin-top:2px}
.mo{position:fixed;inset:0;z-index:1000;background:rgba(0,0,0,.5);backdrop-filter:blur(4px);display:flex;align-items:center;justify-content:center;animation:fadeIn .2s ease-out;padding:20px}
.modal{background:#fff;border-radius:var(--rxl);max-width:960px;width:100%;max-height:92vh;overflow-y:auto;animation:scaleIn .3s ease-out;scrollbar-width:thin}
.mo-cl{position:sticky;top:16px;left:16px;z-index:10;width:36px;height:36px;border-radius:50%;background:#fff;border:1px solid var(--bdr);cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:var(--sh);margin:16px 0 -52px 16px;transition:all var(--tr)}.mo-cl:hover{background:var(--bgs);transform:scale(1.05)}
.mo-gal{display:grid;grid-template-columns:1fr 1fr;gap:6px;border-radius:var(--rxl) var(--rxl) 0 0;overflow:hidden;height:380px}
.mo-gal img{width:100%;height:100%;object-fit:cover;transition:all .4s ease;cursor:pointer}.mo-gal img:hover{filter:brightness(.93)}.mo-gal img:first-child{grid-row:1/3}
.mo-body{padding:32px 36px}.mo-hdr{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:20px}
.modal h2{font-family:var(--fd);font-size:28px;font-weight:600}
.mo-meta{display:flex;gap:16px;margin-top:6px;flex-wrap:wrap}.mo-meta span{font-size:14px;color:var(--ts);display:flex;align-items:center;gap:4px}
.mo-div{height:1px;background:var(--bdr);margin:24px 0}
.mo-sec h3{font-size:20px;font-weight:600;margin-bottom:12px}.mo-sec p{color:var(--ts);line-height:1.7;font-size:15px}
.am-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:12px}
.am{display:flex;align-items:center;gap:10px;padding:12px 16px;border-radius:12px;background:var(--bgs);font-size:14px}
.bk-card{border:1.5px solid var(--bdr);border-radius:var(--rl);padding:28px;margin-top:24px;box-shadow:var(--sh)}
.bk-price{font-size:24px;font-weight:700;margin-bottom:4px}.bk-price span{font-size:16px;font-weight:400;color:var(--ts)}
.bk-flds{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:20px 0}
.bk-fld{padding:12px 14px;border:1.5px solid var(--bdr);border-radius:10px;font-size:13px}.bk-fld label{display:block;font-weight:600;font-size:11px;text-transform:uppercase;letter-spacing:.5px;margin-bottom:4px}.bk-fld span{color:var(--ts)}
.bk-btn{width:100%;padding:16px;background:var(--grad);color:#fff;border:none;border-radius:12px;font-size:16px;font-weight:600;cursor:pointer;transition:all var(--tr);font-family:var(--f)}.bk-btn:hover{box-shadow:0 6px 20px rgba(255,56,92,.45);transform:translateY(-1px)}
.ow-info{display:flex;align-items:center;gap:14px;padding:16px;border-radius:12px;background:var(--bgs);margin-top:16px}
.ow-av{width:48px;height:48px;border-radius:50%;background:var(--grad);color:#fff;display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:600}
.ow-nm{font-weight:600;font-size:15px}.ow-lb{font-size:13px;color:var(--ts)}
.ow-contact{display:flex;gap:8px;margin-top:12px}
.ow-call,.ow-whatsapp{flex:1;padding:12px;border-radius:12px;border:1.5px solid var(--bdr);display:flex;align-items:center;justify-content:center;gap:8px;font-size:14px;font-weight:600;cursor:pointer;transition:all var(--tr);font-family:var(--f);text-decoration:none;color:var(--t);background:#fff}
.ow-call:hover{background:#E8F5E9;border-color:#43A047;color:#2E7D32}
.ow-whatsapp:hover{background:#E8F5E9;border-color:#43A047;color:#2E7D32}
.ow-phone-num{font-size:15px;font-weight:600;color:var(--p);margin-top:4px;display:flex;align-items:center;gap:6px;letter-spacing:0.3px}
.tf-wrap{background:#fff;border-radius:var(--rl);border:1.5px solid var(--bdr);padding:28px;margin-bottom:28px}
.tf-title{font-size:20px;font-weight:600;margin-bottom:6px;font-family:var(--fd)}
.tf-sub{font-size:14px;color:var(--ts);margin-bottom:20px}
.tf-search{display:flex;align-items:center;gap:10px;padding:12px 18px;border:1.5px solid var(--bdr);border-radius:14px;margin-bottom:20px;transition:all var(--tr)}
.tf-search:focus-within{border-color:var(--p);box-shadow:0 0 0 3px rgba(255,56,92,.1)}
.tf-search input{flex:1;border:none;outline:none;font-size:15px;font-family:var(--f);color:var(--t);background:none}
.tf-search input::placeholder{color:var(--tl)}
.tf-row{display:flex;gap:12px;flex-wrap:wrap;margin-bottom:16px}
.tf-row label{font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:.5px;color:var(--ts);margin-bottom:6px;display:block}
.tf-col{flex:1;min-width:140px}
.tf-select{width:100%;padding:11px 14px;border:1.5px solid var(--bdr);border-radius:12px;font-size:14px;font-family:var(--f);outline:none;transition:all var(--tr);background:#fff;color:var(--t);-webkit-appearance:none;cursor:pointer}
.tf-select:focus{border-color:var(--p);box-shadow:0 0 0 3px rgba(255,56,92,.1)}
.tf-budget{display:flex;gap:8px;flex-wrap:wrap;margin-top:4px}
.tf-budget-opt{padding:8px 16px;border:1.5px solid var(--bdr);border-radius:20px;font-size:13px;font-weight:500;cursor:pointer;transition:all var(--tr);background:#fff;font-family:var(--f);color:var(--ts)}
.tf-budget-opt:hover{border-color:var(--tl);color:var(--t)}
.tf-budget-opt.sel{border-color:var(--p);background:var(--pl);color:var(--pd);font-weight:600}
.tf-tags{display:flex;gap:8px;flex-wrap:wrap;padding-top:8px}
.tf-tag{display:flex;align-items:center;gap:6px;padding:6px 14px;border-radius:20px;background:var(--pl);color:var(--pd);font-size:13px;font-weight:600}
.tf-tag button{background:none;border:none;cursor:pointer;color:var(--pd);font-size:14px;font-weight:700;padding:0;line-height:1}
.auth{background:#fff;border-radius:var(--rxl);max-width:480px;width:100%;padding:40px;animation:scaleIn .3s ease-out}
.auth h2{font-family:var(--fd);font-size:26px;font-weight:600;text-align:center;margin-bottom:8px}
.auth .sub{text-align:center;color:var(--ts);font-size:15px;margin-bottom:28px}
.auth-tabs{display:flex;background:var(--bgs);border-radius:12px;padding:4px;margin-bottom:28px}
.auth-tab{flex:1;padding:10px;text-align:center;border-radius:10px;border:none;background:none;cursor:pointer;font-size:14px;font-weight:500;font-family:var(--f);transition:all var(--tr);color:var(--ts)}.auth-tab.act{background:#fff;color:var(--t);box-shadow:0 2px 8px rgba(0,0,0,.08);font-weight:600}
.fg{margin-bottom:18px}.fg label{display:block;font-size:13px;font-weight:600;margin-bottom:6px;color:var(--t)}
.fg-in{width:100%;padding:13px 16px;border:1.5px solid var(--bdr);border-radius:12px;font-size:15px;font-family:var(--f);transition:all var(--tr);outline:none}.fg-in:focus{border-color:var(--p);box-shadow:0 0 0 3px rgba(255,56,92,.1)}
.fg-err{color:var(--p);font-size:13px;margin-top:4px}
.auth-div{display:flex;align-items:center;gap:16px;margin:24px 0;color:var(--tl);font-size:13px}.auth-div::before,.auth-div::after{content:'';flex:1;height:1px;background:var(--bdr)}
.auth-ft{text-align:center;margin-top:20px;font-size:13px;color:var(--ts)}.auth-ft a{color:var(--p);font-weight:600;cursor:pointer;text-decoration:none}
.prof{max-width:800px;margin:0 auto;padding:40px 20px}
.prof-head{display:flex;align-items:center;gap:32px;margin-bottom:40px;animation:fadeIn .5s ease-out}
.prof-photo{position:relative;width:120px;height:120px;border-radius:50%;overflow:hidden;background:var(--bgs);border:4px solid var(--pl);flex-shrink:0}
.prof-photo img{width:100%;height:100%;object-fit:cover}
.prof-photo-ph{width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:48px;font-weight:700;color:var(--p);background:var(--pl)}
.prof-photo-actions{display:flex;flex-direction:row;flex-wrap:wrap;align-items:stretch;justify-content:center;gap:8px;width:100%;max-width:280px}
.prof-photo-act{flex:1;min-width:0;padding:8px 10px;border:1.5px solid var(--bdr);border-radius:12px;background:#fff;color:var(--t);cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:6px;font-size:12px;font-weight:600;font-family:var(--f);transition:background var(--tr),border-color var(--tr),color var(--tr);box-shadow:0 1px 3px rgba(0,0,0,.06)}
.prof-photo-act:hover{background:var(--bgs);border-color:var(--tl)}
.prof-photo-act-ic{display:flex;align-items:center;justify-content:center;flex-shrink:0;line-height:0}
.prof-photo-act-ic svg{width:16px;height:16px;display:block}
.prof-photo-act-del{border-color:#fecaca;color:#b91c1c}
.prof-photo-act-del:hover{background:#fef2f2;border-color:#f87171;color:#991b1b}
.prof-info h2{font-family:var(--fd);font-size:28px;font-weight:600}
.role-badge{display:inline-flex;align-items:center;gap:6px;padding:4px 14px;border-radius:20px;font-size:13px;font-weight:600;margin-top:6px}
.role-badge.owner{background:#FFF3E0;color:#E65100}.role-badge.tenant{background:#E3F2FD;color:#1565C0}
.prof-form{background:#fff;border:1.5px solid var(--bdr);border-radius:var(--rl);padding:32px;animation:fadeIn .5s ease-out .1s both}
.prof-form h3{font-size:20px;font-weight:600;margin-bottom:24px;font-family:var(--fd)}
.pf-grid{display:grid;grid-template-columns:1fr 1fr;gap:18px}
.pf-full{grid-column:1/-1}
.pf-role{display:flex;gap:12px;margin-top:4px}
.pf-role-opt{flex:1;padding:16px;border:2px solid var(--bdr);border-radius:var(--r);cursor:pointer;text-align:center;transition:all var(--tr)}.pf-role-opt:hover{border-color:var(--tl)}.pf-role-opt.sel{border-color:var(--p);background:var(--pl)}
.pf-role-opt .ri{font-size:28px;margin-bottom:6px}.pf-role-opt .rl{font-size:14px;font-weight:600}.pf-role-opt .rd{font-size:12px;color:var(--ts);margin-top:2px}
.pf-save-row{display:flex;justify-content:flex-end;gap:12px;margin-top:28px}
.dash{max-width:1200px;margin:0 auto;padding:40px 20px}
.dash-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:32px;animation:fadeIn .5s ease-out}
.dash-header h1{font-family:var(--fd);font-size:32px;font-weight:600}
.dash-stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:16px;margin-bottom:32px}
.dash-stat{padding:24px;border-radius:var(--rl);background:#fff;border:1.5px solid var(--bdr);transition:all var(--tr)}.dash-stat:hover{box-shadow:var(--sh);transform:translateY(-2px)}
.dash-stat .ds-num{font-size:32px;font-weight:700}.dash-stat .ds-lab{font-size:14px;color:var(--ts);margin-top:4px}.dash-stat .ds-ic{font-size:28px;margin-bottom:8px}
.ap-form{background:#fff;border:1.5px solid var(--bdr);border-radius:var(--rl);padding:36px;animation:fadeIn .5s ease-out .1s both}
.ap-form h3{font-size:22px;font-weight:600;margin-bottom:6px;font-family:var(--fd)}.ap-form .ap-sub{color:var(--ts);font-size:14px;margin-bottom:28px}
.ap-grid{display:grid;grid-template-columns:1fr 1fr;gap:18px}.ap-full{grid-column:1/-1}
.ap-imgs{display:flex;gap:12px;flex-wrap:wrap;margin-top:8px}
.ap-img-box{width:100px;height:100px;border-radius:12px;overflow:hidden;border:2px dashed var(--bdr);display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all var(--tr);position:relative;background:var(--bgs)}.ap-img-box:hover{border-color:var(--p);background:var(--pl)}.ap-img-box img{width:100%;height:100%;object-fit:cover}.ap-img-box .ap-rm{position:absolute;top:4px;right:4px;width:20px;height:20px;border-radius:50%;background:rgba(0,0,0,.6);color:#fff;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:10px}
.pl-table{width:100%;border-collapse:separate;border-spacing:0;margin-top:24px}
.pl-table th{text-align:left;padding:12px 16px;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:.5px;color:var(--ts);border-bottom:2px solid var(--bdr)}
.pl-table td{padding:14px 16px;font-size:14px;border-bottom:1px solid var(--bdr);vertical-align:middle}.pl-table tr:hover td{background:var(--bgs)}
.pl-thumb{width:56px;height:42px;border-radius:8px;object-fit:cover}
.pl-status{padding:4px 10px;border-radius:12px;font-size:12px;font-weight:600}.pl-status.active{background:#E8F5E9;color:#2E7D32}
.pl-actions{display:flex;gap:6px}.pl-act{width:32px;height:32px;border-radius:8px;border:1px solid var(--bdr);background:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all var(--tr)}.pl-act:hover{background:var(--bgs);border-color:var(--ts)}.pl-act.del:hover{background:#FFEBEE;border-color:#E53935;color:#E53935}
.td-filters{display:flex;gap:12px;flex-wrap:wrap;margin-bottom:24px}
.td-flt{padding:10px 16px;border:1.5px solid var(--bdr);border-radius:12px;font-size:14px;font-family:var(--f);outline:none;transition:all var(--tr);background:#fff}.td-flt:focus{border-color:var(--p)}
.cta{background:var(--grad);border-radius:var(--rxl);padding:56px 48px;margin:8px 0 16px;display:flex;align-items:center;justify-content:space-between;gap:40px;position:relative;overflow:hidden;background-size:200% 200%;animation:gradientMove 6s ease infinite}
.cta::before{content:'';position:absolute;top:-60%;right:-20%;width:500px;height:500px;border-radius:50%;background:rgba(255,255,255,.08)}
.cta h2{font-family:var(--fd);font-size:34px;font-weight:600;color:#fff;max-width:460px}
.cta p{color:rgba(255,255,255,.85);font-size:16px;margin-top:12px;max-width:400px;line-height:1.6}
.cta .btn{background:#fff;color:var(--p);font-weight:700}.cta .btn:hover{transform:translateY(-2px);box-shadow:0 6px 20px rgba(0,0,0,.2)}
.how{display:grid;grid-template-columns:repeat(3,1fr);gap:24px}
.how-c{padding:32px;border-radius:var(--rl);background:#fff;border:1.5px solid var(--bdr);transition:all var(--tr);text-align:center}.how-c:hover{border-color:var(--pl);transform:translateY(-4px);box-shadow:var(--sh)}
.how-ic{width:60px;height:60px;border-radius:16px;background:var(--pl);display:flex;align-items:center;justify-content:center;font-size:28px;margin:0 auto 16px}
.how-c h4{font-size:17px;font-weight:600;margin-bottom:8px}.how-c p{font-size:14px;color:var(--ts);line-height:1.6}
.page{max-width:900px;margin:0 auto;padding:60px 20px;animation:fadeIn .5s ease-out}
.page h1{font-family:var(--fd);font-size:40px;font-weight:600;margin-bottom:12px}
.page .page-sub{font-size:18px;color:var(--ts);margin-bottom:40px;line-height:1.6}
.contact-grid{display:grid;grid-template-columns:1fr 1fr;gap:40px}
.contact-cards{display:flex;flex-direction:column;gap:16px}
.c-card{padding:24px;border-radius:var(--rl);border:1.5px solid var(--bdr);display:flex;align-items:center;gap:16px;transition:all var(--tr)}.c-card:hover{box-shadow:var(--sh);transform:translateY(-2px)}
.c-card-ic{width:48px;height:48px;border-radius:14px;background:var(--pl);display:flex;align-items:center;justify-content:center;color:var(--p);flex-shrink:0}
.c-card h4{font-size:15px;font-weight:600;margin-bottom:2px}.c-card p{font-size:14px;color:var(--ts)}
.contact-form{padding:32px;border:1.5px solid var(--bdr);border-radius:var(--rl)}
.contact-form h3{font-size:20px;font-weight:600;margin-bottom:20px;font-family:var(--fd)}
.cf-ta{width:100%;padding:13px 16px;border:1.5px solid var(--bdr);border-radius:12px;font-size:15px;font-family:var(--f);transition:all var(--tr);outline:none;resize:vertical;min-height:120px}.cf-ta:focus{border-color:var(--p);box-shadow:0 0 0 3px rgba(255,56,92,.1)}
.about-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:24px;margin-top:40px}
.about-card{padding:32px;border-radius:var(--rl);border:1.5px solid var(--bdr);transition:all var(--tr)}.about-card:hover{box-shadow:var(--sh);transform:translateY(-2px)}
.about-card .ab-ic{font-size:32px;margin-bottom:12px}.about-card h4{font-size:17px;font-weight:600;margin-bottom:8px}.about-card p{font-size:14px;color:var(--ts);line-height:1.6}
.team-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:20px;margin-top:24px}
.team-card{text-align:center;padding:24px 16px;border-radius:var(--rl);border:1.5px solid var(--bdr);transition:all var(--tr)}.team-card:hover{box-shadow:var(--sh);transform:translateY(-2px)}
.team-av{width:64px;height:64px;border-radius:50%;background:var(--grad);color:#fff;display:flex;align-items:center;justify-content:center;font-size:24px;font-weight:600;margin:0 auto 12px}
.team-card h4{font-size:14px;font-weight:600}.team-card p{font-size:12px;color:var(--ts)}
.ft{background:var(--bgs);border-top:1px solid var(--bdr);padding:56px 40px 32px}
.ft-in{max-width:1440px;margin:0 auto}
.ft-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:40px;margin-bottom:40px}
.ft-col h4{font-size:14px;font-weight:700;margin-bottom:16px;text-transform:uppercase;letter-spacing:.5px}
.ft-col a{display:block;font-size:14px;color:var(--ts);margin-bottom:10px;text-decoration:none;transition:color var(--tr);cursor:pointer}.ft-col a:hover{color:var(--t)}
.ft-btm{border-top:1px solid var(--bdr);padding-top:24px;display:flex;justify-content:space-between;align-items:center}
.ft-cp{font-size:13px;color:var(--ts)}.ft-lks{display:flex;gap:20px}.ft-lks a{font-size:13px;color:var(--ts);text-decoration:none}
.toast{position:fixed;bottom:32px;left:50%;transform:translateX(-50%);background:var(--t);color:#fff;padding:14px 28px;border-radius:12px;font-size:14px;font-weight:500;z-index:2000;box-shadow:var(--shl);animation:slideDown .3s ease-out}
@media(max-width:768px){
  .hd-in{padding:0 16px}.nav{display:none}.hero{height:440px}.hero h1{font-size:34px}.hero-ct{padding:0 20px}
  .sbar{flex-wrap:wrap;border-radius:20px;padding:12px}.sbar input{min-width:100%}.sbar-div{display:none}.sbar select{min-width:100%;padding:10px 0}
  .sec{padding:24px 16px}.grid{grid-template-columns:1fr}
  .mo-gal{grid-template-columns:1fr;height:240px}.mo-gal img:first-child{grid-row:auto}.mo-body{padding:24px 20px}.bk-flds{grid-template-columns:1fr}
  .cta{flex-direction:column;padding:36px 24px;text-align:center}.cta h2{font-size:26px}
  .ft-grid{grid-template-columns:repeat(2,1fr);gap:24px}.how{grid-template-columns:1fr}
  .feat-s{height:300px}.feat-ov{padding:24px}.feat-ct h3{font-size:24px}
  .prof-head{flex-direction:column;text-align:center}
  .pf-grid,.ap-grid{grid-template-columns:1fr}.contact-grid,.about-grid{grid-template-columns:1fr}.team-grid{grid-template-columns:repeat(2,1fr)}
  .dash-header{flex-direction:column;gap:16px;align-items:flex-start}
}
`;

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
  const[idx,setIdx]=useState(0);const feat=properties.slice(0,5);
  useEffect(()=>{const t=setInterval(()=>setIdx(i=>(i+1)%feat.length),4500);return()=>clearInterval(t)},[feat.length]);
  return(<div className="feat-sl">
    <div className="feat-tk" style={{transform:`translateX(-${idx*100}%)`}}>
        {feat.map(p=>(<div className="feat-s" key={p.id}>
        <img src={p.images[0]} alt={p.title}/>
        <div className="feat-ov"><div className="feat-ct"><h3>{p.title}</h3><p>{p.furnishing} · {p.area} sq.ft · ₹{p.price.toLocaleString()}/mo</p><button className="btn btn-p" onClick={()=>onOpen(p)}>View Details</button></div></div>
      </div>))}
    </div>
    <div className="feat-ind">{feat.map((_,i)=><button key={i} className={`feat-id ${i===idx?"act":""}`} onClick={()=>setIdx(i)}/>)}</div>
    <div className="sl-arr"><button className="sl-ar" onClick={()=>setIdx(i=>(i-1+feat.length)%feat.length)}>{I.chevL}</button><button className="sl-ar" onClick={()=>setIdx(i=>(i+1)%feat.length)}>{I.chevR}</button></div>
  </div>);
}

function PropertyModal({property:p,onClose,user,onShowAuth}){
  if(!p)return null;
  const phoneClean=(p.ownerPhone||"").replace(/\s+/g,"");
  const handleContact=()=>{if(!user){onShowAuth();return}alert(`Contact request sent to ${p.owner}!`)};
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
          <a className="ow-call" href={`tel:${phoneClean}`}>📞 Call Owner</a>
          <a className="ow-whatsapp" href={`https://wa.me/${phoneClean.replace("+","")}`} target="_blank" rel="noopener noreferrer">💬 WhatsApp</a>
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
  const galRef=useRef(null);const vidRef=useRef(null);const[streaming,setStreaming]=useState(false);
  const handleGallery=e=>{const f=e.target.files?.[0];if(!f)return;const r=new FileReader();r.onload=ev=>setProfile(p=>({...p,photo:ev.target.result}));r.readAsDataURL(f)};
  const startCamera=async()=>{try{const s=await navigator.mediaDevices.getUserMedia({video:{facingMode:"user"},audio:false});if(vidRef.current){vidRef.current.srcObject=s;vidRef.current.play();setStreaming(true)}}catch(err){console.warn('Camera start failed',err);showToast("Camera access denied — allow camera permission in your browser (disable shields if using Brave)")}};
  const capturePhoto=()=>{if(!vidRef.current)return;const c=document.createElement("canvas");c.width=vidRef.current.videoWidth;c.height=vidRef.current.videoHeight;c.getContext("2d").drawImage(vidRef.current,0,0);setProfile(p=>({...p,photo:c.toDataURL("image/jpeg",.85)}));stopCamera()};
  const stopCamera=()=>{if(vidRef.current?.srcObject){vidRef.current.srcObject.getTracks().forEach(t=>t.stop());vidRef.current.srcObject=null}setStreaming(false)};
  return(<div className="prof">
    <div className="prof-head">
      <div className="prof-photo-wrap">
        <div className="prof-photo">
          {streaming?<video ref={vidRef} style={{width:"100%",height:"100%",objectFit:"cover"}} playsInline muted/>:profile.photo?<img src={profile.photo} alt="Profile"/>:<div className="prof-photo-ph">{(profile.name||user.name||"U")[0].toUpperCase()}</div>}
        </div>
        <div style={{display:"flex",justifyContent:"center",marginTop:12}}>
          <div className="prof-photo-actions">
            {streaming?
              <>
                <button className="prof-photo-act" onClick={capturePhoto}>{I.check} Capture</button>
                <button className="prof-photo-act prof-photo-act-del" onClick={stopCamera}>{I.close} Cancel</button>
              </>
              :
              <>
                <button className="prof-photo-act" onClick={startCamera}>{I.camera} Camera</button>
                <button className="prof-photo-act" onClick={()=>galRef.current?.click()}>{I.gallery} Gallery</button>
                {profile.photo&&<button className="prof-photo-act prof-photo-act-del" onClick={async()=>{try{await api.saveProfile({...profile,photo:null});setProfile(p=>({...p,photo:null}));showToast('Profile photo deleted')}catch(e){showToast('Failed to delete photo')}}}>Delete</button>}
              </>
            }
          </div>
        </div>
        <input ref={galRef} id="profile-photo-input" type="file" accept="image/*" style={{display:"none"}} onChange={handleGallery}/>
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
      <div className="pf-save-row"><button className="btn btn-p btn-lg" onClick={async()=>{try{await api.saveProfile(profile);showToast("Profile saved successfully!")}catch(e){showToast("Failed to save profile")}}}>Save Profile</button></div>
    </div>
  </div>);
}

/* ═══════════ OWNER DASHBOARD ═══════════ */
function OwnerDashboard({user,profile,showToast,myProperties,setMyProperties}){
  const[showForm,setShowForm]=useState(false);
  const[form,setForm]=useState({title:"",description:"",location:"",city:"",price:"",deposit:"",area:"",type:"Apartment",bhk:"2 BHK",furnishing:"Semi Furnished",minLease:"12",contact:"",amenities:[],images:[]});
  const imgRef=useRef(null);const set=(k,v)=>setForm(f=>({...f,[k]:v}));
  const addImage=e=>{Array.from(e.target.files||[]).forEach(file=>{const r=new FileReader();r.onload=ev=>setForm(f=>({...f,images:[...f.images,ev.target.result]}));r.readAsDataURL(file)})};
  const toggleAmenity=a=>setForm(f=>({...f,amenities:f.amenities.includes(a)?f.amenities.filter(x=>x!==a):[...f.amenities,a]}));
  const submit=async()=>{
    if(!form.title||!form.city||!form.price){showToast("Fill title, city & price");return}
    try{
      const body={
        title:form.title,
        description:form.description||"No description",
        city:form.city,
        location:form.location?`${form.location}, ${form.city}`:form.city,
        price: Number(form.price),
        deposit: Number(form.deposit) || Number(form.price)*2,
        area: Number(form.area) || 0,
        type: form.type,
        bhk: form.bhk,
        furnishing: form.furnishing,
        minLease: Number(form.minLease) || 12,
        contact: form.contact,
        amenities: form.amenities || [],
        images: form.images || [],
      };
      const res = await api.createProperty(body);
      if(res?.success && res.property){
        setMyProperties(p=>[res.property,...p]);
        setForm({title:"",description:"",location:"",city:"",price:"",deposit:"",area:"",type:"Apartment",bhk:"2 BHK",furnishing:"Semi Furnished",minLease:"12",contact:"",amenities:[],images:[]});
        setShowForm(false);
        showToast("Property listed!");
      } else {
        showToast(res?.message || "Failed to list property");
      }
    }catch(err){
      showToast(err.message||"Error listing property");
    }
  };
  return(<div className="dash">
    <div className="dash-header"><div><h1>Owner Dashboard</h1><div style={{color:"var(--ts)",fontSize:15,marginTop:4}}>Manage your properties</div></div><button className="btn btn-p" onClick={()=>setShowForm(!showForm)}>{I.plus} {showForm?"Cancel":"Add Property"}</button></div>
    <div className="dash-stats">
      <div className="dash-stat anim-in s1"><div className="ds-ic">🏠</div><div className="ds-num">{myProperties.length}</div><div className="ds-lab">Listed</div></div>
      <div className="dash-stat anim-in s2"><div className="ds-ic">👁️</div><div className="ds-num">{myProperties.length*47}</div><div className="ds-lab">Views</div></div>
      <div className="dash-stat anim-in s3"><div className="ds-ic">💬</div><div className="ds-num">{myProperties.length*8}</div><div className="ds-lab">Enquiries</div></div>
      <div className="dash-stat anim-in s4"><div className="ds-ic">⭐</div><div className="ds-num">{myProperties.length>0?"4.6":"—"}</div><div className="ds-lab">Avg Rating</div></div>
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
    {myProperties.length>0?<div style={{overflowX:"auto"}}><table className="pl-table"><thead><tr><th>Photo</th><th>Title</th><th>City</th><th>Rent</th><th>Type</th><th>Status</th><th>Actions</th></tr></thead><tbody>{myProperties.map(p=><tr key={p.id}><td><img className="pl-thumb" src={p.images[0]} alt=""/></td><td style={{fontWeight:600}}>{p.title}</td><td>{p.city}</td><td>₹{p.price.toLocaleString()}/mo</td><td>{p.type}</td><td><span className="pl-status active">Active</span></td><td><div className="pl-actions"><button className="pl-act" title="View">{I.eye}</button><button className="pl-act del" title="Delete" onClick={()=>{setMyProperties(pp=>pp.filter(x=>x.id!==p.id));showToast("Removed")}}>{I.trash}</button></div></td></tr>)}</tbody></table></div>
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
export default function StayFinder(){
  const[user,setUser]=useState(null);const[showAuth,setShowAuth]=useState(false);
  const[selectedProperty,setSelectedProperty]=useState(null);const[liked,setLiked]=useState(new Set());
  const[activeCategory,setActiveCategory]=useState("Apartments");
  const[searchCity,setSearchCity]=useState("");const[searchType,setSearchType]=useState("");
  const[filterSearch,setFilterSearch]=useState("");const[filterCity,setFilterCity]=useState("");const[filterType,setFilterType]=useState("");const[filterBhk,setFilterBhk]=useState("");const[filterFurnish,setFilterFurnish]=useState("");const[filterBudget,setFilterBudget]=useState("");
  const BUDGETS=[{label:"Under ₹10K",max:10000},{label:"₹10K–20K",min:10000,max:20000},{label:"₹20K–35K",min:20000,max:35000},{label:"₹35K–50K",min:35000,max:50000},{label:"₹50K+",min:50000}];
  const[toast,setToast]=useState(null);const[scrolled,setScrolled]=useState(false);
  const[page,setPage]=useState("home");const[showDropdown,setShowDropdown]=useState(false);
  const[profile,setProfile]=useState({name:"",phone:"",dob:"",gender:"",address:"",city:"",occupation:"",bio:"",role:"",photo:null});
  const[myProperties,setMyProperties]=useState([]);const ddRef=useRef(null);
  const[serverProperties,setServerProperties]=useState([]);

  useEffect(()=>{const h=()=>setScrolled(window.scrollY>10);window.addEventListener("scroll",h);return()=>window.removeEventListener("scroll",h)},[]);
  useEffect(()=>{const h=e=>{if(ddRef.current&&!ddRef.current.contains(e.target))setShowDropdown(false)};document.addEventListener("mousedown",h);return()=>document.removeEventListener("mousedown",h)},[]);

  useEffect(()=>{
    if(user?.token) setToken(user.token);
    api.getProperties().then(d=>setServerProperties(d.properties||[])).catch(()=>{});
  },[user]);

  const showToast=useCallback(msg=>{setToast(msg);setTimeout(()=>setToast(null),3000)},[]);
  const handleLike=useCallback(id=>{setLiked(prev=>{const n=new Set(prev);if(n.has(id)){n.delete(id);showToast("Removed from wishlist")}else{n.add(id);showToast("Saved to wishlist")}return n})},[showToast]);
  const handleAuth=u=>{setUser(u);setShowAuth(false);setProfile(p=>({...p,name:p.name||u.name}));showToast(`Welcome, ${u.name}!`)};
  // store token if provided by backend auth
  const wrappedHandleAuth=u=>{ if(u?.token) setToken(u.token); handleAuth(u); };
  const handleLogout=()=>{setUser(null);setShowDropdown(false);setPage("home");showToast("Logged out")};
  const goTo=pg=>{setPage(pg);setShowDropdown(false);window.scrollTo({top:0,behavior:"smooth"})};

  const allProperties=[...myProperties,...serverProperties];
  let filtered=allProperties;
  // Hero search bar filters
  if(searchCity)filtered=filtered.filter(p=>p.city.toLowerCase().includes(searchCity.toLowerCase())||p.location.toLowerCase().includes(searchCity.toLowerCase()));
  if(searchType)filtered=filtered.filter(p=>p.type===searchType);
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
  const clearAllFilters=()=>{setFilterSearch("");setFilterCity("");setFilterType("");setFilterBhk("");setFilterFurnish("");setFilterBudget("");setSearchCity("");setSearchType("")};
  const hasAnyFilter=searchCity||searchType||filterSearch||filterCity||filterType||filterBhk||filterFurnish||filterBudget;

  return(<>
    <style>{css}</style>

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
          <div className="sbar"><input placeholder="Search city, locality..." value={searchCity} onChange={e=>setSearchCity(e.target.value)}/><div className="sbar-div"/><select value={searchType} onChange={e=>setSearchType(e.target.value)}><option value="">All Types</option>{PROPERTY_TYPES.map(t=><option key={t} value={t}>{t}</option>)}</select><button className="sbar-btn">{I.search}</button></div>
        </div>
      </section>
      <div className="mq-wrap"><div className="mq">{[...Array(2)].flatMap((_,r)=>[<div className="mq-i" key={`a${r}`}><strong>10,000+</strong> Properties</div>,<div className="mq-i" key={`b${r}`}><strong>Zero</strong> Brokerage</div>,<div className="mq-i" key={`c${r}`}><strong>50+</strong> Cities</div>,<div className="mq-i" key={`d${r}`}><strong>Direct</strong> Owner Contact</div>,<div className="mq-i" key={`e${r}`}><strong>Verified</strong> Listings</div>,<div className="mq-i" key={`f${r}`}><strong>24/7</strong> Support</div>])}</div></div>
      <div className="cats">{CATEGORIES.map(c=><button key={c.label} className={`cat ${activeCategory===c.label?"act":""}`} onClick={()=>setActiveCategory(c.label)}><span className="ci">{c.icon}</span><span className="cl">{c.label}</span></button>)}</div>
      <div className="sec"><div className="sec-hd"><div><div className="sec-t">Featured Properties</div><div className="sec-st">Hand-picked homes updated daily</div></div></div><FeaturedSlider properties={filtered.length>0?filtered:allProperties} onOpen={setSelectedProperty}/></div>
      <div className="sec"><div className="sec-hd"><div><div className="sec-t">Explore by City</div><div className="sec-st">Popular long-term rental destinations</div></div></div><div className="cities">{Object.entries(CITY_IMAGES).map(([c,img])=><div className="city" key={c} onClick={()=>{setFilterCity(c);setSearchCity("");window.scrollTo({top:1200,behavior:"smooth"})}}><img src={img} alt={c}/><div className="city-ov"><div className="city-n">{c}</div><div className="city-c">{allProperties.filter(p=>p.city===c).length}+ properties</div></div></div>)}</div></div>
      <div className="sec">
        <div className="tf-wrap">
          <div className="tf-title">Find Your Perfect Property</div>
          <div className="tf-sub">Search and filter from {allProperties.length} verified properties across {CITIES.length} cities — zero brokerage</div>
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
        <div style={{marginBottom:12,marginTop:24,display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{fontWeight:600,fontSize:16}}>{filtered.length} properties found</span>{hasAnyFilter&&<span style={{fontSize:14,color:"var(--ts)"}}>out of {allProperties.length} total</span>}</div>
        {filtered.length>0?<div className="grid">{filtered.map((p,i)=><div key={p.id} className={`anim-in s${(i%8)+1}`}><PropertyCard property={p} onOpen={setSelectedProperty} onLike={handleLike} liked={liked.has(p.id)}/></div>)}</div>:<div style={{textAlign:"center",padding:"60px 0",color:"var(--ts)"}}><div style={{fontSize:48,marginBottom:16}}>🔍</div><div style={{fontSize:18,fontWeight:600,marginBottom:8}}>No properties match your filters</div><div style={{marginBottom:20}}>Try changing or removing some filters</div><button className="btn btn-p" onClick={clearAllFilters}>Clear All Filters</button></div>}
      </div>
      <div className="sec"><div className="sec-hd"><div><div className="sec-t">How StayFinder Works</div><div className="sec-st">3 simple steps</div></div></div><div className="how"><div className="how-c"><div className="how-ic">🔍</div><h4>Search & Explore</h4><p>Browse thousands of verified properties. Filter by budget, type, amenities.</p></div><div className="how-c"><div className="how-ic">💬</div><h4>Connect with Owner</h4><p>Contact owners directly — no middleman, no broker fees.</p></div><div className="how-c"><div className="how-ic">🏡</div><h4>Move In</h4><p>Finalize lease, pay deposit, move in. Simple.</p></div></div></div>
      <div className="sec"><div className="cta"><div><h2>Own a Property? List it Free</h2><p>Reach thousands of tenants. No commission, just direct connections.</p></div><button className="btn btn-lg" onClick={()=>{if(!user)setShowAuth(true);else if(profile.role!=="owner"){goTo("profile");showToast("Set yourself as 'Property Owner' in your profile")}else goTo("owner-dash")}}>List Your Property</button></div></div>
    </>}

    {page==="profile"&&user&&<ProfilePage user={user} profile={profile} setProfile={setProfile} showToast={showToast}/>}
    {page==="owner-dash"&&user&&profile.role==="owner"&&<OwnerDashboard user={user} profile={profile} showToast={showToast} myProperties={myProperties} setMyProperties={setMyProperties}/>} 
    {page==="wishlist"&&<div className="sec" style={{minHeight:"60vh"}}><div className="sec-hd"><div><div className="sec-t">Wishlist</div><div className="sec-st">{allProperties.filter(p=>liked.has(p.id)).length} saved</div></div></div>{allProperties.filter(p=>liked.has(p.id)).length>0?<div className="grid">{allProperties.filter(p=>liked.has(p.id)).map((p,i)=><div key={p.id} className={`anim-in s${(i%8)+1}`}><PropertyCard property={p} onOpen={setSelectedProperty} onLike={handleLike} liked/></div>)}</div>:<div style={{textAlign:"center",padding:"80px 0",color:"var(--ts)"}}><div style={{fontSize:48,marginBottom:16}}>❤️</div><div style={{fontSize:18,fontWeight:600,marginBottom:8}}>No saved properties</div><button className="btn btn-p" style={{marginTop:24}} onClick={()=>goTo("home")}>Explore</button></div>}</div>}
    {page==="about"&&<AboutPage/>}
    {page==="contact"&&<ContactPage showToast={showToast}/>}
    {(page==="profile"||page==="owner-dash")&&!user&&<div className="sec" style={{minHeight:"60vh",textAlign:"center",paddingTop:100}}><div style={{fontSize:56,marginBottom:16}}>🔒</div><div style={{fontSize:22,fontWeight:600,marginBottom:8}}>Please log in</div><div style={{color:"var(--ts)",marginBottom:24}}>You need to be logged in to access this page</div><button className="btn btn-p btn-lg" onClick={()=>setShowAuth(true)}>Log In / Sign Up</button></div>}

    <footer className="ft"><div className="ft-in"><div className="ft-grid">
      <div className="ft-col"><h4>StayFinder</h4><a onClick={()=>goTo("about")}>About Us</a><a onClick={()=>goTo("home")}>How it Works</a><a>Careers</a><a>Press</a></div>
      <div className="ft-col"><h4>For Tenants</h4><a onClick={()=>goTo("home")}>Search Properties</a><a>Rental Guide</a><a>Tenant Rights</a><a>FAQs</a></div>
      <div className="ft-col"><h4>For Owners</h4><a onClick={()=>goTo(user&&profile.role==="owner"?"owner-dash":"home")}>List Property</a><a>Dashboard</a><a>Pricing</a><a>Verification</a></div>
      <div className="ft-col"><h4>Support</h4><a onClick={()=>goTo("contact")}>Help Center</a><a>Safety</a><a>Terms</a><a>Privacy</a></div>
    </div><div className="ft-btm"><div className="ft-cp">© 2026 StayFinder. No brokers, just homes.</div><div className="ft-lks"><a>English (IN)</a><a>₹ INR</a></div></div></div></footer>

    {/* Quick-view property modal intentionally disabled to avoid the small popup — use property listing page or implement a dedicated detail page instead. */}
    {showAuth&&<AuthModal onClose={()=>setShowAuth(false)} onAuth={wrappedHandleAuth}/>} 

    {selectedProperty&&<PropertyModal property={selectedProperty} onClose={()=>setSelectedProperty(null)} user={user} onShowAuth={()=>setShowAuth(true)}/>} 

    {toast&&<div className="toast">{toast}</div>}
  </>);
}
