import { useState, useEffect, useRef } from "react";
import {
  Heart, Star, MapPin, Phone, Mail, Clock, ChevronRight,
  CheckCircle, Calendar, User, Stethoscope, Eye, Brain,
  Baby, Scissors, Activity, Mic2, Menu, X, ArrowRight,
  Shield, Award, Users, TrendingUp, Send,
} from "lucide-react";
import { useI18n } from "./i18n";
import { db, isConfigured } from "./firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

// ─── DATA ────────────────────────────────────────────────────────────────────

const DEPARTMENTS = ["Терапия","Кардиология","Неврология","Педиатрия","Хирургия","Гинекология","Офтальмология","ЛОР"];
const DOCTORS_BY_DEPT = {
  Терапия:      ["Иванов И.И.","Петрова А.С.","Сидоров П.К."],
  Кардиология:  ["Козлова Е.В.","Морозов С.А."],
  Неврология:   ["Новикова М.П.","Белов Д.Н."],
  Педиатрия:    ["Смирнова О.Л.","Федоров В.И."],
  Хирургия:     ["Волков А.Н.","Соколов М.М."],
  Гинекология:  ["Павлова Н.С."],
  Офтальмология:["Григорьев К.Р."],
  ЛОР:          ["Титов Е.А.","Кузнецова Л.В."],
};
const TIME_SLOTS = [
  "08:00","08:30","09:00","09:30","10:00","10:30","11:00","11:30",
  "12:00","12:30","13:00","13:30","14:00","14:30","15:00","15:30","16:00","16:30",
];
const DEPT_ICONS = {
  Терапия: <Activity size={24}/>, Кардиология: <Heart size={24}/>,
  Неврология: <Brain size={24}/>, Педиатрия: <Baby size={24}/>,
  Хирургия: <Scissors size={24}/>, Гинекология: <Star size={24}/>,
  Офтальмология: <Eye size={24}/>, ЛОР: <Mic2 size={24}/>,
};
const DEPT_COLORS = {
  Терапия:"#3b82f6", Кардиология:"#ef4444", Неврология:"#8b5cf6",
  Педиатрия:"#f59e0b", Хирургия:"#10b981", Гинекология:"#ec4899",
  Офтальмология:"#06b6d4", ЛОР:"#f97316",
};
const DOCTORS_LIST = [
  { name:"Козлова Е.В.",   dept:"Кардиология",   exp:15, cat:"Высшая" },
  { name:"Иванов И.И.",    dept:"Терапия",        exp:20, cat:"Высшая" },
  { name:"Новикова М.П.",  dept:"Неврология",     exp:12, cat:"Первая" },
  { name:"Смирнова О.Л.",  dept:"Педиатрия",      exp:8,  cat:"Первая" },
  { name:"Волков А.Н.",    dept:"Хирургия",       exp:18, cat:"Высшая" },
  { name:"Павлова Н.С.",   dept:"Гинекология",    exp:14, cat:"Высшая" },
  { name:"Григорьев К.Р.", dept:"Офтальмология",  exp:10, cat:"Первая" },
  { name:"Титов Е.А.",     dept:"ЛОР",            exp:16, cat:"Высшая" },
];

// ─── CSS ─────────────────────────────────────────────────────────────────────

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Golos+Text:wght@400;500;600;700;800;900&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{font-family:'Golos Text',sans-serif;color:#0f172a;-webkit-font-smoothing:antialiased}
::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:transparent}
::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:3px}

/* NAV */
.cl-nav{position:fixed;top:0;left:0;right:0;z-index:200;transition:all .3s}
.cl-nav.scrolled{background:rgba(255,255,255,.96);backdrop-filter:blur(12px);box-shadow:0 1px 20px rgba(0,0,0,.08)}
.cl-nav-inner{max-width:1200px;margin:0 auto;padding:0 24px;height:72px;display:flex;align-items:center;justify-content:space-between;gap:20px}
.cl-logo{display:flex;align-items:center;gap:12px;text-decoration:none}
.cl-logo-mark{width:42px;height:42px;border-radius:12px;background:linear-gradient(135deg,#2563eb,#1d4ed8);display:flex;align-items:center;justify-content:center;flex-shrink:0}
.cl-logo-text{line-height:1.2}
.cl-logo-name{font-size:14px;font-weight:800;color:#0f172a}
.cl-logo-sub{font-size:10px;color:#64748b;font-weight:500}
.cl-nav.hero-zone .cl-logo-name,.cl-nav.hero-zone .cl-logo-sub{color:#fff}
.cl-nav.hero-zone:not(.scrolled) .cl-logo-name{color:#fff}
.cl-nav.hero-zone:not(.scrolled) .cl-logo-sub{color:rgba(255,255,255,.7)}
.cl-nav-links{display:flex;align-items:center;gap:4px}
.cl-nav-link{padding:8px 14px;border-radius:8px;font-size:14px;font-weight:500;color:#374151;cursor:pointer;border:none;background:none;transition:all .18s;font-family:'Golos Text',sans-serif}
.cl-nav-link:hover{background:#f1f5f9;color:#1e40af}
.cl-nav-link.active{color:#1e40af;background:#eff6ff}
.cl-nav.hero-zone:not(.scrolled) .cl-nav-link{color:rgba(255,255,255,.85)}
.cl-nav.hero-zone:not(.scrolled) .cl-nav-link:hover{background:rgba(255,255,255,.12);color:#fff}
.cl-nav-right{display:flex;align-items:center;gap:10px}
.cl-lang-btn{display:flex;align-items:center;gap:1px;border:1.5px solid #e2e8f0;border-radius:8px;overflow:hidden;background:#fff;flex-shrink:0}
.cl-lang-opt{padding:5px 10px;font-size:12px;font-weight:600;cursor:pointer;border:none;background:transparent;font-family:'Golos Text',sans-serif;color:#64748b;transition:all .15s}
.cl-lang-opt.active{background:#1e40af;color:#fff}
.cl-nav.hero-zone:not(.scrolled) .cl-lang-btn{border-color:rgba(255,255,255,.3);background:rgba(255,255,255,.1)}
.cl-nav.hero-zone:not(.scrolled) .cl-lang-opt{color:rgba(255,255,255,.8)}
.cl-nav.hero-zone:not(.scrolled) .cl-lang-opt.active{background:rgba(255,255,255,.25);color:#fff}
.cl-nav-book-btn{padding:9px 18px;background:#1e40af;color:#fff;border:none;border-radius:9px;font-size:13.5px;font-weight:600;cursor:pointer;transition:all .18s;font-family:'Golos Text',sans-serif;white-space:nowrap}
.cl-nav-book-btn:hover{background:#1d3fad;transform:translateY(-1px);box-shadow:0 4px 14px rgba(30,64,175,.35)}
.cl-nav-admin{padding:8px 14px;border:1.5px solid rgba(255,255,255,.3);color:rgba(255,255,255,.8);border-radius:8px;font-size:12.5px;font-weight:600;cursor:pointer;background:transparent;font-family:'Golos Text',sans-serif;transition:all .15s}
.cl-nav-admin:hover{background:rgba(255,255,255,.12);color:#fff}
.cl-nav-admin.dark{border-color:#e2e8f0;color:#374151}
.cl-nav-admin.dark:hover{background:#f1f5f9}
.cl-menu-btn{display:none;background:none;border:none;cursor:pointer;padding:6px;border-radius:8px;color:#374151;transition:background .15s}
.cl-menu-btn:hover{background:#f1f5f9}
.cl-nav.hero-zone:not(.scrolled) .cl-menu-btn{color:#fff}

/* MOBILE MENU */
.cl-mobile-menu{display:none;position:fixed;inset:0;z-index:190;background:rgba(15,23,42,.6);backdrop-filter:blur(4px)}
.cl-mobile-menu.open{display:flex;align-items:flex-end}
.cl-mobile-sheet{background:#fff;width:100%;border-radius:20px 20px 0 0;padding:24px;display:flex;flex-direction:column;gap:8px}
.cl-mobile-link{padding:14px 16px;border-radius:10px;font-size:15px;font-weight:500;color:#374151;cursor:pointer;border:none;background:none;text-align:left;width:100%;transition:background .15s;font-family:'Golos Text',sans-serif}
.cl-mobile-link:hover{background:#f1f5f9;color:#1e40af}

/* HERO */
.cl-hero{min-height:100vh;background:linear-gradient(140deg,#0f2360 0%,#1a3c6e 30%,#1e40af 65%,#2563eb 100%);display:flex;flex-direction:column;justify-content:center;padding:100px 24px 60px;position:relative;overflow:hidden}
.cl-hero::before{content:'';position:absolute;inset:0;background:url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");pointer-events:none}
.cl-hero-blob{position:absolute;border-radius:50%;filter:blur(80px);opacity:.25;pointer-events:none}
.cl-hero-blob1{width:500px;height:500px;background:#60a5fa;top:-100px;right:-100px}
.cl-hero-blob2{width:400px;height:400px;background:#a78bfa;bottom:-100px;left:-100px}
.cl-hero-inner{max-width:1200px;margin:0 auto;width:100%;position:relative;z-index:1}
.cl-hero-badge{display:inline-flex;align-items:center;gap:8px;background:rgba(255,255,255,.12);backdrop-filter:blur(8px);border:1px solid rgba(255,255,255,.2);border-radius:30px;padding:7px 16px;font-size:13px;font-weight:600;color:rgba(255,255,255,.9);margin-bottom:24px}
.cl-hero-badge-dot{width:8px;height:8px;border-radius:50%;background:#4ade80;flex-shrink:0;box-shadow:0 0 0 3px rgba(74,222,128,.3)}
.cl-hero-title{font-size:clamp(38px,6vw,72px);font-weight:900;color:#fff;line-height:1.1;white-space:pre-line;margin-bottom:22px;letter-spacing:-1px}
.cl-hero-sub{font-size:clamp(15px,2vw,20px);color:rgba(255,255,255,.78);max-width:560px;line-height:1.6;margin-bottom:36px}
.cl-hero-btns{display:flex;gap:14px;flex-wrap:wrap}
.cl-btn-primary{padding:14px 28px;background:#fff;color:#1e40af;border:none;border-radius:12px;font-size:15px;font-weight:700;cursor:pointer;transition:all .2s;font-family:'Golos Text',sans-serif;display:flex;align-items:center;gap:8px}
.cl-btn-primary:hover{background:#f0f7ff;transform:translateY(-2px);box-shadow:0 8px 24px rgba(255,255,255,.3)}
.cl-btn-outline{padding:14px 28px;background:rgba(255,255,255,.1);color:#fff;border:1.5px solid rgba(255,255,255,.35);border-radius:12px;font-size:15px;font-weight:600;cursor:pointer;transition:all .2s;font-family:'Golos Text',sans-serif;backdrop-filter:blur(8px)}
.cl-btn-outline:hover{background:rgba(255,255,255,.2);transform:translateY(-2px)}
.cl-hero-stats{display:flex;gap:0;margin-top:56px;background:rgba(255,255,255,.08);backdrop-filter:blur(10px);border:1px solid rgba(255,255,255,.12);border-radius:16px;overflow:hidden;max-width:680px}
.cl-hero-stat{flex:1;padding:18px 20px;text-align:center;border-right:1px solid rgba(255,255,255,.1)}
.cl-hero-stat:last-child{border-right:none}
.cl-hero-stat-val{font-size:28px;font-weight:900;color:#fff;line-height:1}
.cl-hero-stat-lbl{font-size:11px;color:rgba(255,255,255,.6);margin-top:4px;font-weight:500}

/* SECTION */
.cl-section{padding:80px 24px}
.cl-section-inner{max-width:1200px;margin:0 auto}
.cl-section-tag{display:inline-flex;align-items:center;gap:6px;background:#eff6ff;color:#1e40af;padding:6px 14px;border-radius:30px;font-size:12.5px;font-weight:700;text-transform:uppercase;letter-spacing:.05em;margin-bottom:14px}
.cl-section-title{font-size:clamp(26px,4vw,40px);font-weight:800;color:#0f172a;margin-bottom:12px;line-height:1.15}
.cl-section-sub{font-size:16px;color:#64748b;max-width:540px;line-height:1.65}

/* ABOUT */
.cl-about{background:#f8fafc}
.cl-about-grid{display:grid;grid-template-columns:1fr 1fr;gap:60px;align-items:center;margin-top:48px}
.cl-about-text p{font-size:16px;color:#374151;line-height:1.75;margin-bottom:16px}
.cl-about-features{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:24px}
.cl-about-feat{display:flex;align-items:center;gap:10px;padding:12px 16px;background:#fff;border:1px solid #e2e8f0;border-radius:10px;font-size:14px;font-weight:600;color:#374151}
.cl-about-feat-ic{width:28px;height:28px;border-radius:8px;background:#eff6ff;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.cl-about-visual{background:linear-gradient(135deg,#1e3a6e,#1e40af);border-radius:24px;padding:40px;display:flex;flex-direction:column;gap:20px;position:relative;overflow:hidden}
.cl-about-visual::after{content:'';position:absolute;bottom:-40px;right:-40px;width:200px;height:200px;border-radius:50%;background:rgba(255,255,255,.06)}
.cl-av-stat{background:rgba(255,255,255,.12);backdrop-filter:blur(8px);border:1px solid rgba(255,255,255,.15);border-radius:14px;padding:18px 22px;display:flex;align-items:center;gap:14px}
.cl-av-val{font-size:32px;font-weight:900;color:#fff;line-height:1}
.cl-av-lbl{font-size:13px;color:rgba(255,255,255,.7);margin-top:2px}

/* SERVICES */
.cl-services-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:18px;margin-top:48px}
.cl-svc-card{background:#fff;border:1px solid #e2e8f0;border-radius:16px;padding:24px;cursor:pointer;transition:all .22s;position:relative;overflow:hidden}
.cl-svc-card::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:var(--dcolor);opacity:0;transition:opacity .22s}
.cl-svc-card:hover{transform:translateY(-4px);box-shadow:0 12px 32px rgba(0,0,0,.1);border-color:transparent}
.cl-svc-card:hover::before{opacity:1}
.cl-svc-icon{width:48px;height:48px;border-radius:12px;display:flex;align-items:center;justify-content:center;margin-bottom:14px}
.cl-svc-name{font-size:15px;font-weight:700;color:#0f172a;margin-bottom:6px}
.cl-svc-desc{font-size:12.5px;color:#64748b;line-height:1.55;margin-bottom:12px}
.cl-svc-price{font-size:12px;font-weight:600;color:#1e40af}

/* DOCTORS */
.cl-doctors{background:#f8fafc}
.cl-doctors-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:20px;margin-top:48px}
.cl-doc-card{background:#fff;border:1px solid #e2e8f0;border-radius:16px;padding:24px;text-align:center;transition:all .22s}
.cl-doc-card:hover{transform:translateY(-4px);box-shadow:0 12px 32px rgba(0,0,0,.1);border-color:transparent}
.cl-doc-av{width:72px;height:72px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:20px;font-weight:800;color:#fff;margin:0 auto 14px;position:relative}
.cl-doc-av::after{content:'';position:absolute;inset:-3px;border-radius:50%;border:2px solid var(--dcolor);opacity:.3}
.cl-doc-name{font-size:14px;font-weight:700;color:#0f172a;margin-bottom:4px}
.cl-doc-dept{font-size:12.5px;font-weight:600;margin-bottom:8px}
.cl-doc-meta{display:flex;align-items:center;justify-content:center;gap:6px;font-size:11.5px;color:#64748b}
.cl-doc-cat{display:inline-block;background:#f1f5f9;color:#475569;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:600;margin-top:8px}

/* BOOKING */
.cl-booking{background:linear-gradient(135deg,#0f2360,#1a3c6e,#1e40af)}
.cl-booking .cl-section-tag{background:rgba(255,255,255,.15);color:#fff}
.cl-booking .cl-section-title{color:#fff}
.cl-booking .cl-section-sub{color:rgba(255,255,255,.7)}
.cl-book-wrap{background:#fff;border-radius:24px;overflow:hidden;margin-top:48px;box-shadow:0 24px 80px rgba(0,0,0,.3)}
.cl-book-steps{display:flex;background:#f8fafc;border-bottom:1px solid #e2e8f0}
.cl-book-step{flex:1;padding:16px 20px;display:flex;align-items:center;gap:10px;font-size:13.5px;font-weight:600;color:#94a3b8;border-right:1px solid #e2e8f0;transition:color .2s;cursor:default}
.cl-book-step:last-child{border-right:none}
.cl-book-step.active{color:#1e40af}
.cl-book-step.done{color:#16a34a}
.cl-book-step-num{width:26px;height:26px;border-radius:50%;border:2px solid currentColor;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;flex-shrink:0}
.cl-book-step.done .cl-book-step-num{background:#16a34a;border-color:#16a34a;color:#fff}
.cl-book-body{padding:36px}
.cl-form-grid2{display:grid;grid-template-columns:1fr 1fr;gap:16px}
.cl-form-grid3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px}
.cl-fg{display:flex;flex-direction:column;gap:5px}
.cl-flbl{font-size:13px;font-weight:600;color:#374151}
.cl-finp,.cl-fsel,.cl-ftxt{padding:10px 14px;border:1.5px solid #e2e8f0;border-radius:10px;font-size:14px;font-family:'Golos Text',sans-serif;color:#0f172a;outline:none;transition:border-color .18s,box-shadow .18s;background:#fff;width:100%}
.cl-finp:focus,.cl-fsel:focus,.cl-ftxt:focus{border-color:#1e40af;box-shadow:0 0 0 3px rgba(30,64,175,.1)}
.cl-finp.err,.cl-fsel.err{border-color:#ef4444}
.cl-ferr{font-size:12px;color:#ef4444;margin-top:2px}
.cl-ftxt{resize:vertical;min-height:90px}
.cl-book-btns{display:flex;justify-content:space-between;align-items:center;margin-top:28px;padding-top:20px;border-top:1px solid #f1f5f9}
.cl-bbtn{padding:12px 24px;border-radius:10px;font-size:14px;font-weight:600;cursor:pointer;transition:all .18s;font-family:'Golos Text',sans-serif;display:flex;align-items:center;gap:7px;border:none}
.cl-bbtn-primary{background:#1e40af;color:#fff}
.cl-bbtn-primary:hover{background:#1d3fad;box-shadow:0 4px 14px rgba(30,64,175,.3)}
.cl-bbtn-ghost{background:#f1f5f9;color:#374151}
.cl-bbtn-ghost:hover{background:#e2e8f0}
.cl-book-success{padding:60px 36px;text-align:center}
.cl-success-ic{width:72px;height:72px;border-radius:50%;background:#dcfce7;display:flex;align-items:center;justify-content:center;margin:0 auto 20px}
.cl-success-title{font-size:24px;font-weight:800;color:#0f172a;margin-bottom:10px}
.cl-success-text{font-size:15px;color:#64748b;margin-bottom:24px;max-width:400px;margin-left:auto;margin-right:auto;line-height:1.65}
.cl-confirm-box{background:#f8fafc;border:1px solid #e2e8f0;border-radius:14px;padding:24px;text-align:left;margin-top:16px}
.cl-confirm-row{display:flex;justify-content:space-between;padding:7px 0;border-bottom:1px solid #e2e8f0;font-size:13.5px}
.cl-confirm-row:last-child{border-bottom:none}
.cl-cl{color:#64748b}
.cl-cv{font-weight:600;color:#0f172a}

/* CONTACTS */
.cl-contacts-grid{display:grid;grid-template-columns:1fr 1fr;gap:48px;margin-top:48px;align-items:start}
.cl-contact-card{background:#f8fafc;border:1px solid #e2e8f0;border-radius:16px;padding:28px;display:flex;flex-direction:column;gap:20px}
.cl-contact-item{display:flex;gap:14px;align-items:flex-start}
.cl-contact-ic{width:40px;height:40px;border-radius:10px;background:#eff6ff;display:flex;align-items:center;justify-content:center;flex-shrink:0;color:#1e40af}
.cl-contact-lbl{font-size:11.5px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:#94a3b8;margin-bottom:3px}
.cl-contact-val{font-size:14.5px;font-weight:600;color:#0f172a;line-height:1.4}
.cl-hours-row{display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #e2e8f0;font-size:14px}
.cl-hours-row:last-child{border-bottom:none}
.cl-hours-day{color:#64748b;font-weight:500}
.cl-hours-time{font-weight:700;color:#0f172a}
.cl-hours-time.closed{color:#ef4444}
.cl-map-box{border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;height:340px;background:#e2e8f0;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:12px;color:#94a3b8}
.cl-map-box iframe{width:100%;height:100%;border:none;display:block}

/* FOOTER */
.cl-footer{background:#0f172a;padding:48px 24px 28px}
.cl-footer-inner{max-width:1200px;margin:0 auto}
.cl-footer-top{display:grid;grid-template-columns:2fr 1fr 1fr;gap:40px;padding-bottom:36px;border-bottom:1px solid #1e293b}
.cl-footer-brand{}
.cl-footer-logo-name{font-size:16px;font-weight:800;color:#fff;margin-bottom:4px}
.cl-footer-logo-sub{font-size:12px;color:#64748b}
.cl-footer-desc{font-size:13px;color:#64748b;line-height:1.65;margin-top:12px;max-width:260px}
.cl-footer-col-title{font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:#94a3b8;margin-bottom:14px}
.cl-footer-link{display:block;font-size:13.5px;color:#64748b;cursor:pointer;padding:3px 0;transition:color .15s;border:none;background:none;text-align:left;font-family:'Golos Text',sans-serif;width:100%}
.cl-footer-link:hover{color:#fff}
.cl-footer-bottom{display:flex;align-items:center;justify-content:space-between;padding-top:20px;font-size:12.5px;color:#475569;flex-wrap:wrap;gap:8px}

/* RESPONSIVE */
@media(max-width:900px){
  .cl-services-grid,.cl-doctors-grid{grid-template-columns:repeat(2,1fr)}
  .cl-about-grid,.cl-contacts-grid{grid-template-columns:1fr}
  .cl-about-visual{order:-1}
  .cl-footer-top{grid-template-columns:1fr 1fr}
  .cl-form-grid3{grid-template-columns:1fr 1fr}
  .cl-hero-stats{max-width:100%}
}
@media(max-width:640px){
  .cl-services-grid,.cl-doctors-grid{grid-template-columns:1fr 1fr}
  .cl-footer-top{grid-template-columns:1fr}
  .cl-form-grid2,.cl-form-grid3{grid-template-columns:1fr}
  .cl-hero-stats{flex-direction:column;gap:0}
  .cl-hero-stat{border-right:none;border-bottom:1px solid rgba(255,255,255,.1)}
  .cl-hero-stat:last-child{border-bottom:none}
  .cl-nav-links,.cl-nav-book-btn,.cl-nav-admin{display:none}
  .cl-menu-btn{display:flex;align-items:center;justify-content:center}
  .cl-book-steps{flex-direction:column}
  .cl-book-step{border-right:none;border-bottom:1px solid #e2e8f0}
  .cl-about-features{grid-template-columns:1fr}
}
`;

// ─── COMPONENTS ───────────────────────────────────────────────────────────────

function LangSwitcher({ scrolled, heroZone }) {
  const { lang, switchLang } = useI18n();
  return (
    <div className="cl-lang-btn">
      {["ru","ky"].map(l => (
        <button key={l} className={`cl-lang-opt${lang===l?" active":""}`} onClick={()=>switchLang(l)}>
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}

function NavBar({ activeSection, onBook, onAdmin }) {
  const { t, lang } = useI18n();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const scrollTo = id => { document.getElementById(id)?.scrollIntoView({ behavior:"smooth" }); setMobileOpen(false); };
  const links = [
    { id:"about",    label:t("nav.home") },
    { id:"services", label:t("nav.services") },
    { id:"doctors",  label:t("nav.doctors") },
    { id:"contacts", label:t("nav.contacts") },
  ];

  return (
    <>
      <nav className={`cl-nav hero-zone${scrolled?" scrolled":""}`}>
        <div className="cl-nav-inner">
          <button className="cl-logo" style={{background:"none",border:"none",cursor:"pointer"}} onClick={()=>scrollTo("hero")}>
            <div className="cl-logo-mark">
              <Heart size={20} color="#fff" fill="#fff"/>
            </div>
            <div className="cl-logo-text">
              <div className="cl-logo-name">КТП Поликлиника</div>
              <div className="cl-logo-sub">Кыргыз-Түрк</div>
            </div>
          </button>

          <div className="cl-nav-links">
            {links.map(l => (
              <button key={l.id} className={`cl-nav-link${activeSection===l.id?" active":""}`} onClick={()=>scrollTo(l.id)}>
                {l.label}
              </button>
            ))}
          </div>

          <div className="cl-nav-right">
            <LangSwitcher scrolled={scrolled}/>
            <button className="cl-nav-book-btn" onClick={onBook}>{t("nav.booking")}</button>
            <button className={`cl-nav-admin${scrolled?" dark":""}`} onClick={onAdmin}>{t("nav.adminPanel")}</button>
            <button className="cl-menu-btn" onClick={()=>setMobileOpen(v=>!v)}>
              {mobileOpen ? <X size={22}/> : <Menu size={22}/>}
            </button>
          </div>
        </div>
      </nav>

      <div className={`cl-mobile-menu${mobileOpen?" open":""}`} onClick={()=>setMobileOpen(false)}>
        <div className="cl-mobile-sheet" onClick={e=>e.stopPropagation()}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
            <span style={{fontWeight:700,fontSize:16}}>КТП Поликлиника</span>
            <button style={{background:"none",border:"none",cursor:"pointer"}} onClick={()=>setMobileOpen(false)}><X size={20}/></button>
          </div>
          {links.map(l=>(
            <button key={l.id} className="cl-mobile-link" onClick={()=>scrollTo(l.id)}>{l.label}</button>
          ))}
          <div style={{display:"flex",gap:8,marginTop:8}}>
            <LangSwitcher/>
            <button className="cl-nav-book-btn" style={{flex:1}} onClick={()=>{onBook();setMobileOpen(false)}}>{t("nav.booking")}</button>
          </div>
          <button className="cl-mobile-link" style={{textAlign:"center",color:"#1e40af"}} onClick={()=>{onAdmin();setMobileOpen(false)}}>{t("nav.adminPanel")}</button>
        </div>
      </div>
    </>
  );
}

function Hero({ onBook }) {
  const { t } = useI18n();
  const stats = [
    { val:"15+", lbl:t("stats.years") }, { val:"50+", lbl:t("stats.doctors") },
    { val:"8",   lbl:t("stats.departments") }, { val:"100K+", lbl:t("stats.patients") },
  ];
  return (
    <section id="hero" className="cl-hero">
      <div className="cl-hero-blob cl-hero-blob1"/>
      <div className="cl-hero-blob cl-hero-blob2"/>
      <div className="cl-hero-inner">
        <div className="cl-hero-badge">
          <div className="cl-hero-badge-dot"/>
          {t("hero.badge")}
        </div>
        <h1 className="cl-hero-title">{t("hero.title")}</h1>
        <p className="cl-hero-sub">{t("hero.subtitle")}</p>
        <div className="cl-hero-btns">
          <button className="cl-btn-primary" onClick={onBook}>
            {t("hero.bookBtn")} <ArrowRight size={16}/>
          </button>
          <button className="cl-btn-outline" onClick={()=>document.getElementById("services")?.scrollIntoView({behavior:"smooth"})}>
            {t("hero.servicesBtn")}
          </button>
        </div>
        <div className="cl-hero-stats">
          {stats.map(s=>(
            <div key={s.lbl} className="cl-hero-stat">
              <div className="cl-hero-stat-val">{s.val}</div>
              <div className="cl-hero-stat-lbl">{s.lbl}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function About() {
  const { t } = useI18n();
  const feats = [
    { key:"f1", icon:<Shield size={14} color="#1e40af"/> },
    { key:"f2", icon:<Award size={14} color="#1e40af"/> },
    { key:"f3", icon:<Users size={14} color="#1e40af"/> },
    { key:"f4", icon:<TrendingUp size={14} color="#1e40af"/> },
  ];
  return (
    <section id="about" className="cl-section cl-about">
      <div className="cl-section-inner">
        <div className="cl-section-tag"><Heart size={13}/> {t("nav.home")}</div>
        <h2 className="cl-section-title">{t("about.title")}</h2>
        <div className="cl-about-grid">
          <div>
            <div className="cl-about-text">
              <p>{t("about.text1")}</p>
              <p>{t("about.text2")}</p>
            </div>
            <div className="cl-about-features">
              {feats.map(f=>(
                <div key={f.key} className="cl-about-feat">
                  <div className="cl-about-feat-ic">{f.icon}</div>
                  {t(`about.${f.key}`)}
                </div>
              ))}
            </div>
          </div>
          <div className="cl-about-visual">
            {[{val:"15+",lbl:t("stats.years")},{val:"50+",lbl:t("stats.doctors")},{val:"100K+",lbl:t("stats.patients")}].map(s=>(
              <div key={s.lbl} className="cl-av-stat">
                <div>
                  <div className="cl-av-val">{s.val}</div>
                  <div className="cl-av-lbl">{s.lbl}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Services({ onBook }) {
  const { t } = useI18n();
  return (
    <section id="services" className="cl-section">
      <div className="cl-section-inner">
        <div className="cl-section-tag"><Stethoscope size={13}/> {t("nav.services")}</div>
        <h2 className="cl-section-title">{t("services.title")}</h2>
        <p className="cl-section-sub">{t("services.subtitle")}</p>
        <div className="cl-services-grid">
          {DEPARTMENTS.map(dept=>{
            const color = DEPT_COLORS[dept];
            const svc = t(`services.${dept}`);
            return (
              <div key={dept} className="cl-svc-card" style={{"--dcolor":color}} onClick={onBook}>
                <div className="cl-svc-icon" style={{background:`${color}18`,color}}>
                  {DEPT_ICONS[dept]}
                </div>
                <div className="cl-svc-name" style={{color}}>{dept}</div>
                <div className="cl-svc-desc">{typeof svc==="object"?svc.desc:""}</div>
                <div className="cl-svc-price">
                  {t("services.from")} {typeof svc==="object"?svc.price:""} {t("services.currency")}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Doctors() {
  const { t } = useI18n();
  return (
    <section id="doctors" className="cl-section cl-doctors">
      <div className="cl-section-inner">
        <div className="cl-section-tag"><User size={13}/> {t("nav.doctors")}</div>
        <h2 className="cl-section-title">{t("doctors.title")}</h2>
        <p className="cl-section-sub">{t("doctors.subtitle")}</p>
        <div className="cl-doctors-grid">
          {DOCTORS_LIST.map(doc=>{
            const color = DEPT_COLORS[doc.dept];
            const initials = doc.name.split(" ").map(w=>w[0]).slice(0,2).join("");
            return (
              <div key={doc.name} className="cl-doc-card">
                <div className="cl-doc-av" style={{background:`linear-gradient(135deg,${color},${color}cc)`,"--dcolor":color}}>
                  {initials}
                </div>
                <div className="cl-doc-name">{doc.name}</div>
                <div className="cl-doc-dept" style={{color}}>{doc.dept}</div>
                <div className="cl-doc-meta">
                  <Calendar size={12}/> {doc.exp} {t("doctors.exp")}
                </div>
                <div className="cl-doc-cat">{doc.cat}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function BookingSection({ bookRef }) {
  const { t } = useI18n();
  const [step, setStep] = useState(1);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const EMPTY = { lastName:"",firstName:"",middleName:"",phone:"",email:"",department:"",doctor:"",appointmentDate:"",appointmentTime:"",complaint:"" };
  const [form, setForm] = useState(EMPTY);
  const [errs, setErrs] = useState({});

  const change = e => setForm(p=>({...p,[e.target.name]:e.target.value}));
  const todayStr = () => new Date().toISOString().split("T")[0];

  const validate1 = () => {
    const e={};
    if (!form.lastName.trim())  e.lastName  = t("booking.required");
    if (!form.firstName.trim()) e.firstName = t("booking.required");
    if (!form.phone.trim())     e.phone     = t("booking.errPhone");
    setErrs(e); return Object.keys(e).length===0;
  };
  const validate2 = () => {
    const e={};
    if (!form.department)       e.department       = t("booking.required");
    if (!form.doctor)           e.doctor           = t("booking.required");
    if (!form.appointmentDate)  e.appointmentDate  = t("booking.required");
    else if (form.appointmentDate < todayStr()) e.appointmentDate = t("booking.errDate");
    if (!form.appointmentTime)  e.appointmentTime  = t("booking.required");
    setErrs(e); return Object.keys(e).length===0;
  };

  const next = () => {
    if (step===1 && !validate1()) return;
    if (step===2 && !validate2()) return;
    if (step<3) { setStep(s=>s+1); setErrs({}); }
  };
  const back = () => { setStep(s=>s-1); setErrs({}); };
  const fmtDate = d => { if (!d) return "—"; const [y,m,day]=d.split("-"); return `${day}.${m}.${y}`; };

  const submit = async () => {
    setLoading(true);
    try {
      if (isConfigured && db) {
        await addDoc(collection(db,"bookings"), { ...form, status:"confirmed", source:"online", createdAt:serverTimestamp() });
      }
      // Also save to localStorage so admin panel picks it up immediately
      const saved = JSON.parse(localStorage.getItem("clinic_patients")||"[]");
      const fbPatient = {
        id: "online_" + Date.now(),
        ...form, gender:"unknown", iin:"", address:"",
        status:"confirmed", queueNum:0, source:"online",
      };
      localStorage.setItem("clinic_patients", JSON.stringify([fbPatient, ...saved]));
    } catch {}
    setDone(true); setLoading(false);
  };

  const steps = [t("booking.s1"), t("booking.s2"), t("booking.s3")];

  if (done) return (
    <div ref={bookRef} id="booking" style={{scrollMarginTop:80}}>
      <section className="cl-section cl-booking">
        <div className="cl-section-inner">
          <div className="cl-section-tag"><Calendar size={13}/> {t("booking.onlineLabel")}</div>
          <h2 className="cl-section-title">{t("booking.title")}</h2>
          <div className="cl-book-wrap">
            <div className="cl-book-success">
              <div className="cl-success-ic"><CheckCircle size={34} color="#16a34a"/></div>
              <div className="cl-success-title">{t("booking.successTitle")}</div>
              <p className="cl-success-text">{t("booking.successText")}</p>
              <button className="cl-bbtn cl-bbtn-primary" onClick={()=>{setDone(false);setStep(1);setForm(EMPTY);}}>
                {t("booking.newBooking")}
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );

  return (
    <div ref={bookRef} id="booking" style={{scrollMarginTop:80}}>
      <section className="cl-section cl-booking">
        <div className="cl-section-inner">
          <div className="cl-section-tag"><Calendar size={13}/> {t("booking.onlineLabel")}</div>
          <h2 className="cl-section-title">{t("booking.title")}</h2>
          <p className="cl-section-sub">{t("booking.subtitle")}</p>
          <div className="cl-book-wrap">
            <div className="cl-book-steps">
              {steps.map((s,i)=>{
                const n=i+1;
                const cls = n<step?"done":n===step?"active":"";
                return (
                  <div key={s} className={`cl-book-step ${cls}`}>
                    <div className="cl-book-step-num">{n<step?<CheckCircle size={12}/>:n}</div>
                    {s}
                  </div>
                );
              })}
            </div>

            <div className="cl-book-body">
              {step===1 && (
                <>
                  <div className="cl-form-grid3">
                    {[["lastName",t("booking.lastName")],["firstName",t("booking.firstName")],["middleName",t("booking.middleName")]].map(([n,l])=>(
                      <div className="cl-fg" key={n}>
                        <label className="cl-flbl">{l}{n!=="middleName"&&<span style={{color:"#ef4444"}}> *</span>}</label>
                        <input name={n} value={form[n]} onChange={change} className={`cl-finp${errs[n]?" err":""}`}/>
                        {errs[n]&&<p className="cl-ferr">{errs[n]}</p>}
                      </div>
                    ))}
                  </div>
                  <div className="cl-form-grid2" style={{marginTop:16}}>
                    <div className="cl-fg">
                      <label className="cl-flbl">{t("booking.phone")}<span style={{color:"#ef4444"}}> *</span></label>
                      <input name="phone" value={form.phone} onChange={change} placeholder="+996 700 000 000" className={`cl-finp${errs.phone?" err":""}`}/>
                      {errs.phone&&<p className="cl-ferr">{errs.phone}</p>}
                    </div>
                    <div className="cl-fg">
                      <label className="cl-flbl">{t("booking.email")}</label>
                      <input name="email" value={form.email} onChange={change} placeholder="example@mail.com" className="cl-finp"/>
                    </div>
                  </div>
                </>
              )}

              {step===2 && (
                <>
                  <div className="cl-form-grid2">
                    <div className="cl-fg">
                      <label className="cl-flbl">{t("booking.department")}<span style={{color:"#ef4444"}}> *</span></label>
                      <select name="department" value={form.department} onChange={change} className={`cl-fsel${errs.department?" err":""}`}>
                        <option value="">{t("booking.choose")}</option>
                        {DEPARTMENTS.map(d=><option key={d}>{d}</option>)}
                      </select>
                      {errs.department&&<p className="cl-ferr">{errs.department}</p>}
                    </div>
                    <div className="cl-fg">
                      <label className="cl-flbl">{t("booking.doctor")}<span style={{color:"#ef4444"}}> *</span></label>
                      <select name="doctor" value={form.doctor} onChange={change} disabled={!form.department} className={`cl-fsel${errs.doctor?" err":""}`}>
                        <option value="">{t("booking.chooseDoc")}</option>
                        {(DOCTORS_BY_DEPT[form.department]||[]).map(d=><option key={d}>{d}</option>)}
                      </select>
                      {errs.doctor&&<p className="cl-ferr">{errs.doctor}</p>}
                    </div>
                  </div>
                  <div className="cl-form-grid2" style={{marginTop:16}}>
                    <div className="cl-fg">
                      <label className="cl-flbl">{t("booking.date")}<span style={{color:"#ef4444"}}> *</span></label>
                      <input type="date" name="appointmentDate" value={form.appointmentDate} onChange={change} min={todayStr()} className={`cl-finp${errs.appointmentDate?" err":""}`}/>
                      {errs.appointmentDate&&<p className="cl-ferr">{errs.appointmentDate}</p>}
                    </div>
                    <div className="cl-fg">
                      <label className="cl-flbl">{t("booking.time")}<span style={{color:"#ef4444"}}> *</span></label>
                      <select name="appointmentTime" value={form.appointmentTime} onChange={change} className={`cl-fsel${errs.appointmentTime?" err":""}`}>
                        <option value="">{t("booking.choose")}</option>
                        {TIME_SLOTS.map(s=><option key={s}>{s}</option>)}
                      </select>
                      {errs.appointmentTime&&<p className="cl-ferr">{errs.appointmentTime}</p>}
                    </div>
                  </div>
                  <div className="cl-fg" style={{marginTop:16}}>
                    <label className="cl-flbl">{t("booking.complaint")}</label>
                    <textarea name="complaint" value={form.complaint} onChange={change} className="cl-ftxt" rows={3}/>
                  </div>
                </>
              )}

              {step===3 && (
                <div className="cl-confirm-box">
                  {[
                    [t("booking.lastName"),  `${form.lastName} ${form.firstName} ${form.middleName}`.trim()],
                    [t("booking.phone"),     form.phone],
                    [t("booking.department"),form.department],
                    [t("booking.doctor"),    form.doctor],
                    [t("booking.date"),      fmtDate(form.appointmentDate)],
                    [t("booking.time"),      form.appointmentTime],
                  ].map(([l,v])=>(
                    <div key={l} className="cl-confirm-row">
                      <span className="cl-cl">{l}</span>
                      <span className="cl-cv">{v||"—"}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="cl-book-btns">
                {step>1
                  ? <button className="cl-bbtn cl-bbtn-ghost" onClick={back}>{t("booking.back")}</button>
                  : <div/>
                }
                {step<3
                  ? <button className="cl-bbtn cl-bbtn-primary" onClick={next}>{t("booking.next")}</button>
                  : <button className="cl-bbtn cl-bbtn-primary" onClick={submit} disabled={loading} style={{gap:8}}>
                      <Send size={14}/> {loading ? "..." : t("booking.submit")}
                    </button>
                }
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function Contacts() {
  const { t } = useI18n();
  return (
    <section id="contacts" className="cl-section">
      <div className="cl-section-inner">
        <div className="cl-section-tag"><MapPin size={13}/> {t("nav.contacts")}</div>
        <h2 className="cl-section-title">{t("contacts.title")}</h2>
        <div className="cl-contacts-grid">
          <div className="cl-contact-card">
            {[
              { icon:<MapPin size={18}/>,  lbl:t("contacts.address"), val:t("contacts.addressVal") },
              { icon:<Phone size={18}/>,   lbl:t("contacts.phone"),   val:t("contacts.phoneVal")   },
              { icon:<Mail size={18}/>,    lbl:t("contacts.email"),   val:t("contacts.emailVal")   },
            ].map(c=>(
              <div key={c.lbl} className="cl-contact-item">
                <div className="cl-contact-ic">{c.icon}</div>
                <div>
                  <div className="cl-contact-lbl">{c.lbl}</div>
                  <div className="cl-contact-val">{c.val}</div>
                </div>
              </div>
            ))}

            <div>
              <div className="cl-contact-item" style={{marginBottom:12}}>
                <div className="cl-contact-ic"><Clock size={18}/></div>
                <div className="cl-contact-lbl" style={{marginBottom:0,paddingTop:10}}>{t("contacts.hours")}</div>
              </div>
              <div style={{paddingLeft:54}}>
                {[
                  [t("contacts.mf"),  t("contacts.mfVal"),  false],
                  [t("contacts.sat"), t("contacts.satVal"), false],
                  [t("contacts.sun"), t("contacts.sunVal"), true ],
                ].map(([d,v,closed])=>(
                  <div key={d} className="cl-hours-row">
                    <span className="cl-hours-day">{d}</span>
                    <span className={`cl-hours-time${closed?" closed":""}`}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="cl-map-box">
            <iframe
              title="map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2924.865!2d74.5926!3d42.8746!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDLCsDUyJzI4LjYiTiA3NMKwMzUnMzMuNCJF!5e0!3m2!1sru!2skg!4v1234567890"
              width="100%" height="100%" style={{border:0}} allowFullScreen loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const { t } = useI18n();
  const scrollTo = id => document.getElementById(id)?.scrollIntoView({behavior:"smooth"});
  return (
    <footer className="cl-footer">
      <div className="cl-footer-inner">
        <div className="cl-footer-top">
          <div className="cl-footer-brand">
            <div className="cl-footer-logo-name">КТП Поликлиника</div>
            <div className="cl-footer-logo-sub">Кыргыз-Түрк Поликлиникасы</div>
            <p className="cl-footer-desc">{t("hero.subtitle")}</p>
          </div>
          <div>
            <div className="cl-footer-col-title">{t("nav.services")}</div>
            {DEPARTMENTS.map(d=>(
              <button key={d} className="cl-footer-link" onClick={()=>scrollTo("services")}>{d}</button>
            ))}
          </div>
          <div>
            <div className="cl-footer-col-title">{t("nav.contacts")}</div>
            <button className="cl-footer-link" onClick={()=>scrollTo("contacts")}>{t("contacts.addressVal")}</button>
            <button className="cl-footer-link">{t("contacts.phoneVal")}</button>
            <button className="cl-footer-link">{t("contacts.emailVal")}</button>
          </div>
        </div>
        <div className="cl-footer-bottom">
          <span>© 2024 КТП Поликлиника. {t("footer.rights")}</span>
          <div style={{display:"flex",gap:16}}>
            <button className="cl-footer-link">{t("footer.about")}</button>
            <button className="cl-footer-link">{t("footer.policy")}</button>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────

export default function ClientApp() {
  const bookRef = useRef(null);
  const [activeSection, setActiveSection] = useState("hero");

  const scrollToBook = () => {
    document.getElementById("booking")?.scrollIntoView({ behavior:"smooth" });
  };
  const goAdmin = () => { window.location.hash = "#/dashboard"; };

  useEffect(() => {
    const sections = ["hero","about","services","doctors","booking","contacts"];
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) setActiveSection(e.target.id); });
    }, { threshold:0.4 });
    sections.forEach(id => { const el = document.getElementById(id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, []);

  return (
    <>
      <style>{CSS}</style>
      <NavBar activeSection={activeSection} onBook={scrollToBook} onAdmin={goAdmin}/>
      <Hero onBook={scrollToBook}/>
      <About/>
      <Services onBook={scrollToBook}/>
      <Doctors/>
      <BookingSection bookRef={bookRef}/>
      <Contacts/>
      <Footer/>
    </>
  );
}
