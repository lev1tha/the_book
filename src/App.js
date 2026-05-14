import { useState, useEffect, useRef, useCallback } from "react";
import {
  LayoutDashboard, Users, ClipboardList, Bell, Search, Eye,
  Trash2, TrendingUp, Clock, CheckCircle, User, Calendar,
  FileText, AlertCircle, X, ChevronRight, Plus, Printer,
  ArrowRight, Stethoscope, Phone, Mail, MapPin, Hash,
  AlertTriangle, ChevronDown, Check, List, BarChart2,
  Edit2, Save, XCircle, Zap, CalendarDays, Command,
} from "lucide-react";

// ─── CONSTANTS ────────────────────────────────────────────────────────────────

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
  "12:00","12:30","13:00","13:30","14:00","14:30","15:00","15:30",
  "16:00","16:30",
];
const STATUS_CFG = {
  confirmed:   { label:"Подтверждён",  color:"#2563eb", bg:"#eff6ff",  dot:"#3b82f6"  },
  waiting:     { label:"Ожидает",      color:"#b45309", bg:"#fef3c7",  dot:"#f59e0b"  },
  in_progress: { label:"На приёме",    color:"#7c3aed", bg:"#ede9fe",  dot:"#8b5cf6"  },
  completed:   { label:"Завершён",     color:"#166534", bg:"#dcfce7",  dot:"#22c55e"  },
  cancelled:   { label:"Отменён",      color:"#991b1b", bg:"#fee2e2",  dot:"#ef4444"  },
};
const MOCK_PATIENTS = [
  { id:1,  lastName:"Иванов",   firstName:"Иван",   middleName:"Иванович",     birthDate:"1985-03-12", gender:"male",   phone:"+996 700 123 456", email:"ivanov@mail.com",   iin:"85031200001234", address:"ул. Ленина 10, кв. 5",    department:"Кардиология",   doctor:"Козлова Е.В.",   appointmentDate:"2026-05-06", appointmentTime:"09:00", complaint:"Боли в груди",              status:"waiting",     queueNum:3 },
  { id:2,  lastName:"Петрова",  firstName:"Анна",   middleName:"Сергеевна",    birthDate:"1992-07-24", gender:"female", phone:"+996 555 234 567", email:"petrova@mail.com",  iin:"92072400002345", address:"пр. Манаса 45",           department:"Терапия",       doctor:"Иванов И.И.",    appointmentDate:"2026-05-06", appointmentTime:"10:30", complaint:"Высокая температура, кашель",status:"in_progress", queueNum:1 },
  { id:3,  lastName:"Сидоров",  firstName:"Пётр",   middleName:"Кириллович",   birthDate:"1978-11-05", gender:"male",   phone:"+996 700 345 678", email:"",                  iin:"78110500003456", address:"ул. Токтогула 22",        department:"Неврология",    doctor:"Новикова М.П.",  appointmentDate:"2026-05-07", appointmentTime:"11:00", complaint:"Головные боли",             status:"confirmed",   queueNum:5 },
  { id:4,  lastName:"Козлова",  firstName:"Мария",  middleName:"Владимировна", birthDate:"2001-02-18", gender:"female", phone:"+996 312 456 789", email:"kozlova@mail.com",  iin:"01021800004567", address:"ул. Байтик Баатыра 8",   department:"Педиатрия",     doctor:"Смирнова О.Л.", appointmentDate:"2026-05-05", appointmentTime:"08:30", complaint:"Плановый осмотр",           status:"completed",   queueNum:2 },
  { id:5,  lastName:"Абдиев",   firstName:"Руслан", middleName:"Маратович",    birthDate:"1995-09-30", gender:"male",   phone:"+996 700 567 890", email:"abdiev@mail.com",   iin:"95093000005678", address:"мкр. Асанбай 12-45",     department:"Хирургия",      doctor:"Волков А.Н.",    appointmentDate:"2026-05-06", appointmentTime:"14:00", complaint:"Боли в животе",             status:"waiting",     queueNum:7 },
  { id:6,  lastName:"Мамытова", firstName:"Айгуль", middleName:"Бекова",       birthDate:"1988-06-15", gender:"female", phone:"+996 550 678 901", email:"mamytova@mail.com", iin:"88061500006789", address:"ул. Фрунзе 33",           department:"Гинекология",   doctor:"Павлова Н.С.",   appointmentDate:"2026-05-05", appointmentTime:"15:30", complaint:"Плановый осмотр",           status:"completed",   queueNum:4 },
  { id:7,  lastName:"Орозов",   firstName:"Алмаз",  middleName:"Дооронбекович",birthDate:"1970-04-22", gender:"male",   phone:"+996 700 789 012", email:"",                  iin:"70042200007890", address:"с. Беловодское",          department:"ЛОР",           doctor:"Титов Е.А.",     appointmentDate:"2026-05-06", appointmentTime:"09:30", complaint:"Боль в горле",              status:"confirmed",   queueNum:2 },
  { id:8,  lastName:"Жакыпова", firstName:"Бермет", middleName:"Маратовна",    birthDate:"2003-08-11", gender:"female", phone:"+996 559 111 222", email:"bj@mail.com",       iin:"03081100008901", address:"мкр. Джал 23-5",         department:"Терапия",       doctor:"Петрова А.С.",   appointmentDate:"2026-05-06", appointmentTime:"11:30", complaint:"Слабость, головокружение",  status:"waiting",     queueNum:4 },
  { id:9,  lastName:"Токтосунов",firstName:"Бакыт", middleName:"Эркинович",    birthDate:"1967-12-30", gender:"male",   phone:"+996 701 333 444", email:"",                  iin:"67123000009012", address:"ул. Советская 5",        department:"Кардиология",   doctor:"Морозов С.А.",   appointmentDate:"2026-05-06", appointmentTime:"15:00", complaint:"Одышка, давление",          status:"confirmed",   queueNum:8 },
  { id:10, lastName:"Усупова",  firstName:"Нуриза", middleName:"Асановна",     birthDate:"1999-04-17", gender:"female", phone:"+996 552 777 888", email:"nusupova@mail.com", iin:"99041700010123", address:"мкр. Восток-5 14-3",    department:"Офтальмология", doctor:"Григорьев К.Р.", appointmentDate:"2026-05-08", appointmentTime:"10:00", complaint:"Ухудшение зрения",          status:"confirmed",   queueNum:1 },
  { id:11, lastName:"Дыйканов", firstName:"Марат",  middleName:"Нурланович",   birthDate:"1982-09-08", gender:"male",   phone:"+996 708 555 666", email:"",                  iin:"82090800011234", address:"с. Кант",                department:"Терапия",       doctor:"Сидоров П.К.",   appointmentDate:"2026-05-04", appointmentTime:"09:00", complaint:"Кашель 2 недели",           status:"completed",   queueNum:3 },
  { id:12, lastName:"Асанова",  firstName:"Гульмира",middleName:"Токтомаматовна",birthDate:"1975-06-22",gender:"female", phone:"+996 553 999 000", email:"asanova@mail.com",  iin:"75062200012345", address:"ул. Чуй 88",             department:"Неврология",    doctor:"Белов Д.Н.",     appointmentDate:"2026-05-06", appointmentTime:"13:00", complaint:"Боли в спине",              status:"waiting",     queueNum:6 },
];

// ─── ROUTER ───────────────────────────────────────────────────────────────────

const ROUTES = {
  "#/dashboard": "dashboard",
  "#/patients":  "patients",
  "#/queue":     "queue",
  "#/schedule":  "schedule",
  "#/analytics": "analytics",
  "#/register":  "register",
};
function getPage() { return ROUTES[window.location.hash] ?? "dashboard"; }
function navigate(page) {
  window.location.hash = Object.keys(ROUTES).find(k => ROUTES[k] === page) ?? "#/dashboard";
}
function useHashRouter() {
  const [page, setPage] = useState(getPage);
  useEffect(() => {
    const fn = () => setPage(getPage());
    window.addEventListener("hashchange", fn);
    if (!window.location.hash) window.location.hash = "#/dashboard";
    return () => window.removeEventListener("hashchange", fn);
  }, []);
  return [page, navigate];
}

// ─── STORAGE ─────────────────────────────────────────────────────────────────

function usePersistedState(key, initial) {
  const [val, setVal] = useState(() => {
    try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : initial; }
    catch { return initial; }
  });
  const set = useCallback((v) => {
    setVal(prev => {
      const next = typeof v === "function" ? v(prev) : v;
      try { localStorage.setItem(key, JSON.stringify(next)); } catch {}
      return next;
    });
  }, [key]);
  return [val, set];
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────

const todayStr = () => new Date().toISOString().split("T")[0];
const fmtDate = d => { if (!d) return "—"; const [y,m,day] = d.split("-"); return `${day}.${m}.${y}`; };
const calcAge = b => { if (!b) return ""; return Math.floor((Date.now() - new Date(b)) / (365.25*24*3600*1000)) + " лет"; };
const genId = () => Date.now() + Math.random();

function addDays(dateStr, n) {
  const d = new Date(dateStr); d.setDate(d.getDate() + n);
  return d.toISOString().split("T")[0];
}

// ─── CSS ─────────────────────────────────────────────────────────────────────

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Golos+Text:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --brand:#1a56db; --brand-d:#1447c0; --brand-l:#eff4ff; --brand-ll:#e0eaff;
  --red:#dc2626; --green:#16a34a; --amber:#d97706; --purple:#7c3aed;
  --ink:#0d1117; --ink2:#24292f; --ink3:#404652; --muted:#6b7280;
  --border:#e5e7eb; --border2:#d1d5db;
  --surface:#ffffff; --bg:#f3f4f6; --bg2:#f9fafb; --stripe:#f6f8fa;
  --font:'Golos Text',sans-serif; --mono:'JetBrains Mono',monospace;
  --r:10px;
  --sh:0 1px 3px rgba(0,0,0,.08),0 1px 2px rgba(0,0,0,.05);
  --sh-md:0 4px 16px rgba(0,0,0,.09),0 1px 3px rgba(0,0,0,.06);
  --sh-lg:0 10px 40px rgba(0,0,0,.13),0 2px 8px rgba(0,0,0,.07);
}
html,body,#root{height:100%}
body{font-family:var(--font);background:var(--bg);color:var(--ink2);-webkit-font-smoothing:antialiased}
::-webkit-scrollbar{width:5px;height:5px}
::-webkit-scrollbar-track{background:transparent}
::-webkit-scrollbar-thumb{background:#d1d5db;border-radius:3px}
::-webkit-scrollbar-thumb:hover{background:#9ca3af}

/* LAYOUT */
.layout{display:flex;height:100vh;overflow:hidden}
.main{flex:1;display:flex;flex-direction:column;overflow:hidden;min-width:0}
.page{flex:1;overflow-y:auto;padding:24px;display:flex;flex-direction:column;gap:20px}

/* SIDEBAR */
.sb{width:232px;min-width:232px;background:var(--ink);display:flex;flex-direction:column;border-right:1px solid #1f2937}
.sb-logo{padding:18px 16px;border-bottom:1px solid #1f2937;display:flex;align-items:center;gap:11px}
.sb-mark{width:36px;height:36px;border-radius:9px;background:var(--brand);display:flex;align-items:center;justify-content:center;flex-shrink:0}
.sb-title{color:#f9fafb;font-size:13.5px;font-weight:700;line-height:1.2}
.sb-sub{color:#6b7280;font-size:10.5px;font-family:var(--mono);margin-top:2px}
.sb-nav{flex:1;padding:12px 8px;display:flex;flex-direction:column;gap:1px}
.sb-section{color:#4b5563;font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:.08em;padding:10px 10px 5px;font-family:var(--mono)}
.sb-item{display:flex;align-items:center;gap:9px;padding:8px 12px;border-radius:8px;color:#9ca3af;font-size:13px;font-weight:500;cursor:pointer;border:none;background:none;width:100%;text-align:left;transition:all .14s}
.sb-item:hover{background:#ffffff0d;color:#f3f4f6}
.sb-item.active{background:#1e3a5f;color:#93c5fd}
.sb-ic{display:flex;align-items:center;justify-content:center;width:26px;height:26px;border-radius:6px;flex-shrink:0}
.sb-item.active .sb-ic{background:rgba(59,130,246,.18)}
.sb-badge{margin-left:auto;font-size:10px;font-weight:700;font-family:var(--mono);padding:1px 6px;border-radius:20px;background:#ef4444;color:#fff;flex-shrink:0}
.sb-foot{padding:12px 8px;border-top:1px solid #1f2937}
.sb-user{display:flex;align-items:center;gap:10px;padding:8px 12px;border-radius:8px}
.sb-av{width:30px;height:30px;border-radius:50%;background:linear-gradient(135deg,#3b82f6,#1d4ed8);display:flex;align-items:center;justify-content:center;color:#fff;font-size:10px;font-weight:700;font-family:var(--mono);flex-shrink:0}
.sb-uname{color:#f3f4f6;font-size:12.5px;font-weight:600}
.sb-urole{color:#6b7280;font-size:10px;font-family:var(--mono);margin-top:1px}

/* TOPBAR */
.topbar{height:54px;background:var(--surface);border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;padding:0 24px;flex-shrink:0;gap:12px}
.tb-left{display:flex;align-items:center;gap:8px;min-width:0}
.tb-crumb{color:var(--muted);font-size:12.5px;flex-shrink:0}
.tb-title{font-size:15px;font-weight:700;color:var(--ink);white-space:nowrap}
.tb-sep{color:var(--border2)}
.tb-right{display:flex;align-items:center;gap:8px;flex-shrink:0}
.tb-icon{width:34px;height:34px;border-radius:8px;border:1px solid var(--border);background:#fff;display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--muted);position:relative;transition:all .14s}
.tb-icon:hover{background:var(--bg2);color:var(--ink2)}
.tb-ndot{position:absolute;top:7px;right:7px;width:6px;height:6px;border-radius:50%;background:#ef4444;border:1.5px solid #fff}
.tb-btn{display:flex;align-items:center;gap:6px;background:var(--brand);color:#fff;border:none;border-radius:8px;padding:0 14px;height:34px;font-size:13px;font-weight:600;cursor:pointer;font-family:var(--font);transition:background .14s;white-space:nowrap}
.tb-btn:hover{background:var(--brand-d)}
.tb-search{display:flex;align-items:center;gap:7px;border:1px solid var(--border);border-radius:8px;padding:0 12px;height:34px;cursor:pointer;color:var(--muted);font-size:13px;background:var(--bg2);transition:all .14s;min-width:180px}
.tb-search:hover{border-color:var(--brand);background:#fff}
.tb-kbd{font-size:10px;font-family:var(--mono);background:var(--bg);border:1px solid var(--border2);border-radius:4px;padding:1px 5px;margin-left:auto}
.tb-today{font-size:11.5px;font-family:var(--mono);color:var(--muted)}

/* CARDS */
.card{background:var(--surface);border:1px solid var(--border);border-radius:var(--r);overflow:hidden;box-shadow:var(--sh)}
.card-head{padding:14px 20px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap}
.card-title{font-size:14px;font-weight:700;color:var(--ink)}
.card-sub{font-size:11.5px;color:var(--muted);font-family:var(--mono);margin-top:2px}
.card-actions{display:flex;align-items:center;gap:8px;flex-wrap:wrap}

/* STATS */
.stats-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}
.stat-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--r);padding:16px 18px;transition:box-shadow .18s;cursor:default}
.stat-card:hover{box-shadow:var(--sh-md)}
.stat-top{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px}
.stat-lbl{font-size:12px;color:var(--muted);font-weight:500}
.stat-ic{width:34px;height:34px;border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.stat-val{font-size:28px;font-weight:800;color:var(--ink);font-family:var(--mono);line-height:1}
.stat-foot{display:flex;align-items:center;gap:4px;margin-top:7px;font-size:11.5px;color:var(--muted);font-family:var(--mono)}
.stat-up{color:#16a34a}

/* TABLE */
.srch-wrap{position:relative}
.srch-ico{position:absolute;left:9px;top:50%;transform:translateY(-50%);color:var(--muted);pointer-events:none}
.srch-inp{padding:7px 11px 7px 30px;border:1px solid var(--border);border-radius:8px;font-size:13px;color:var(--ink2);outline:none;width:220px;font-family:var(--font);background:var(--bg2);transition:all .14s}
.srch-inp:focus{border-color:var(--brand);background:#fff;box-shadow:0 0 0 3px #1a56db15}
.sel{padding:7px 10px;border:1px solid var(--border);border-radius:8px;font-size:13px;color:var(--ink2);background:#fff;outline:none;cursor:pointer;font-family:var(--font);transition:border-color .14s}
.sel:focus{border-color:var(--brand)}
.tscroll{overflow-x:auto}
table{width:100%;border-collapse:collapse}
thead th{padding:9px 15px;text-align:left;font-size:11px;font-weight:600;color:var(--muted);text-transform:uppercase;letter-spacing:.06em;border-bottom:1px solid var(--border);background:var(--stripe);white-space:nowrap;font-family:var(--mono)}
tbody td{padding:11px 15px;font-size:13px;color:var(--ink3);border-bottom:1px solid #f3f4f6;vertical-align:middle}
tbody tr:last-child td{border-bottom:none}
tbody tr:hover td{background:#fafbfc}
.tfoot{padding:10px 18px;border-top:1px solid var(--border);display:flex;align-items:center;justify-content:space-between;background:var(--stripe)}
.tcnt{font-size:11.5px;color:var(--muted);font-family:var(--mono)}

/* PATIENT CELL */
.pt-cell{display:flex;align-items:center;gap:10px}
.pt-av{width:34px;height:34px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:13px;flex-shrink:0}
.av-m{background:#dbeafe;color:#1d4ed8}
.av-f{background:#fce7f3;color:#be185d}
.pt-name{font-weight:600;color:var(--ink2);font-size:13px;line-height:1.2}
.pt-meta{font-size:11px;color:var(--muted);font-family:var(--mono)}

/* BADGES */
.badge{display:inline-flex;align-items:center;gap:5px;padding:3px 9px 3px 7px;border-radius:20px;font-size:11.5px;font-weight:600;white-space:nowrap}
.bdot{width:6px;height:6px;border-radius:50%;flex-shrink:0}
.dept-tag{background:var(--brand-l);color:var(--brand);padding:3px 9px;border-radius:20px;font-size:11.5px;font-weight:500;white-space:nowrap}

/* STATUS DROPDOWN */
.status-wrap{position:relative;display:inline-flex}
.status-wrap .sdrop{position:absolute;top:calc(100% + 6px);left:0;background:#fff;border:1px solid var(--border);border-radius:10px;box-shadow:var(--sh-lg);z-index:80;min-width:168px;padding:4px}
.sopt{display:flex;align-items:center;gap:8px;padding:7px 10px;border-radius:7px;font-size:12.5px;font-weight:500;cursor:pointer;transition:background .1s}
.sopt:hover{background:var(--bg2)}

/* ACTION BUTTONS */
.acts{display:flex;align-items:center;gap:4px}
.abt{width:28px;height:28px;border-radius:7px;border:1px solid var(--border);background:#fff;display:flex;align-items:center;justify-content:center;cursor:pointer;color:var(--muted);transition:all .13s}
.abt:hover{background:var(--bg2);color:var(--ink2)}
.abt.view:hover{border-color:#bfdbfe;background:#eff6ff;color:var(--brand)}
.abt.edit:hover{border-color:#bbf7d0;background:#f0fdf4;color:#16a34a}
.abt.del:hover{border-color:#fecaca;background:#fef2f2;color:#dc2626}

/* MODAL */
.overlay{position:fixed;inset:0;background:rgba(13,17,23,.5);z-index:100;display:flex;align-items:center;justify-content:center;padding:20px;backdrop-filter:blur(4px);animation:fi .15s}
@keyframes fi{from{opacity:0}to{opacity:1}}
.modal{background:#fff;border-radius:16px;width:100%;max-width:600px;box-shadow:var(--sh-lg);overflow:hidden;max-height:90vh;display:flex;flex-direction:column;animation:su .17s ease}
@keyframes su{from{transform:translateY(14px);opacity:0}to{transform:translateY(0);opacity:1}}
.mhd{padding:18px 22px;background:var(--ink);color:#fff;flex-shrink:0;display:flex;align-items:flex-start;justify-content:space-between;gap:12px}
.mhd-av{width:46px;height:46px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:16px;flex-shrink:0}
.mhd-av.m{background:#1d3461;color:#93c5fd}
.mhd-av.f{background:#4c1d4c;color:#f9a8d4}
.m-name{font-size:17px;font-weight:700}
.m-id{font-size:11px;color:#9ca3af;font-family:var(--mono);margin-top:3px}
.mclose{background:none;border:none;color:#9ca3af;cursor:pointer;padding:4px;border-radius:6px;transition:all .13s;flex-shrink:0}
.mclose:hover{color:#fff;background:rgba(255,255,255,.1)}
.mbody{padding:20px 22px;overflow-y:auto;flex:1}
.msect{margin-bottom:18px}
.msect-t{font-size:10.5px;font-weight:700;text-transform:uppercase;letter-spacing:.07em;color:var(--muted);margin-bottom:10px;font-family:var(--mono);padding-bottom:7px;border-bottom:1px solid var(--border)}
.mgrid{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.mf{display:flex;flex-direction:column;gap:3px}
.mfl{font-size:11px;color:var(--muted)}
.mfv{font-size:13.5px;font-weight:600;color:var(--ink2)}
.mfv.mono{font-family:var(--mono)}
.mfull{grid-column:span 2}
.mcomplaint{background:var(--bg2);border:1px solid var(--border);border-radius:8px;padding:10px 13px;font-size:13px;color:var(--ink3);line-height:1.6}
.mrow-ic{display:flex;align-items:center;gap:8px;font-size:13px;color:var(--ink3);margin-bottom:7px}
.mrow-ic svg{color:var(--muted);flex-shrink:0}
.mrow-ic:last-child{margin:0}
.m-foot{padding:12px 22px;border-top:1px solid var(--border);background:var(--stripe);display:flex;align-items:center;justify-content:flex-end;gap:8px;flex-shrink:0}

/* EDIT FORM IN MODAL */
.edit-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:12px}
.efg{display:flex;flex-direction:column;gap:4px}
.efl{font-size:12px;font-weight:500;color:var(--ink3)}
.req{color:#ef4444}
.einp,.esel{padding:8px 11px;border:1.5px solid var(--border);border-radius:8px;font-size:13px;color:var(--ink2);outline:none;font-family:var(--font);background:#fff;width:100%;transition:all .13s}
.einp:focus,.esel:focus{border-color:var(--brand);box-shadow:0 0 0 3px #1a56db15}
.etxt{padding:8px 11px;border:1.5px solid var(--border);border-radius:8px;font-size:13px;color:var(--ink2);outline:none;font-family:var(--font);background:#fff;width:100%;resize:vertical;min-height:70px;transition:all .13s}
.etxt:focus{border-color:var(--brand);box-shadow:0 0 0 3px #1a56db15}

/* REGISTER */
.reg-outer{flex:1;overflow-y:auto;padding:24px;display:flex;justify-content:center;align-items:flex-start}
.reg-layout{display:flex;gap:16px;width:100%;max-width:1300px;align-items:flex-start}
.reg-wrap{flex:0 0 620px;width:100%;max-width:620px}
.reg-plist{flex:1;min-width:260px;background:var(--surface);border:1px solid var(--border);border-radius:14px;overflow:hidden;box-shadow:var(--sh-md);display:flex;flex-direction:column;max-height:calc(100vh - 100px)}
.reg-plist-hd{padding:14px 18px;font-size:13.5px;font-weight:700;color:var(--ink);border-bottom:1px solid var(--border);display:flex;align-items:center;gap:8px;background:var(--stripe);flex-shrink:0}
.reg-plist-cnt{margin-left:auto;background:var(--brand);color:#fff;border-radius:20px;padding:2px 9px;font-size:11px;font-family:var(--mono);font-weight:700}
.reg-plist-body{overflow-y:auto;flex:1}
.reg-plist-empty{padding:40px 20px;text-align:center;color:var(--muted);font-size:13px}
.reg-plist-item{display:flex;align-items:center;gap:10px;padding:10px 14px;border-bottom:1px solid #f3f4f6;transition:background .11s}
.reg-plist-item:last-child{border:none}
.reg-plist-item:hover{background:var(--bg2)}
.reg-plist-av{width:34px;height:34px;border-radius:9px;background:var(--brand-l);color:var(--brand);font-weight:700;font-size:12px;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-family:var(--mono)}
.reg-plist-info{flex:1;min-width:0}
.reg-plist-name{font-size:13px;font-weight:600;color:var(--ink2);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.reg-plist-meta{font-size:11px;color:var(--muted);font-family:var(--mono);margin-top:2px}
.reg-card{background:var(--surface);border:1px solid var(--border);border-radius:14px;overflow:hidden;box-shadow:var(--sh-md)}
.reg-hd{background:linear-gradient(120deg,#1a3a6c 0%,#1a56db 100%);padding:22px 26px;color:#fff}
.reg-hdtit{font-size:21px;font-weight:800}
.reg-hdsub{color:#93c5fd;font-size:12px;font-family:var(--mono);margin-top:4px}
.reg-progress{background:#f1f5f9;padding:14px 26px;border-bottom:1px solid var(--border)}
.steps{display:flex;align-items:center}
.step-item{display:flex;flex-direction:column;align-items:center;flex-shrink:0}
.step-circ{width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:13px;border:2.5px solid;font-family:var(--mono);transition:all .22s}
.step-circ.done{background:var(--brand);border-color:var(--brand);color:#fff}
.step-circ.curr{background:#fff;border-color:var(--brand);color:var(--brand)}
.step-circ.next{background:#fff;border-color:var(--border2);color:var(--muted)}
.step-lbl{font-size:10.5px;margin-top:4px;color:var(--muted);font-weight:500;white-space:nowrap}
.step-lbl.curr{color:var(--brand);font-weight:600}
.step-line{flex:1;height:2.5px;margin:0 8px 18px;border-radius:2px;transition:background .22s}
.step-line.done{background:var(--brand)}
.step-line.next{background:var(--border)}
.reg-body{padding:26px}
.reg-stit{font-size:16px;font-weight:700;color:var(--ink);display:flex;align-items:center;gap:8px;margin-bottom:20px;padding-bottom:14px;border-bottom:1px solid var(--border)}
.fgrid3{display:grid;grid-template-columns:repeat(3,1fr);gap:13px;margin-bottom:13px}
.fgrid2{display:grid;grid-template-columns:repeat(2,1fr);gap:13px;margin-bottom:13px}
.fgroup{display:flex;flex-direction:column}
.flbl{font-size:12.5px;font-weight:500;color:var(--ink3);margin-bottom:5px;display:flex;align-items:center;gap:4px}
.finp,.fsel,.ftxt{padding:9px 12px;border:1.5px solid var(--border);border-radius:8px;font-size:13.5px;color:var(--ink2);outline:none;font-family:var(--font);transition:all .14s;background:#fff;width:100%}
.finp:focus,.fsel:focus,.ftxt:focus{border-color:var(--brand);box-shadow:0 0 0 3px #1a56db15}
.finp.err,.fsel.err{border-color:#ef4444;background:#fff9f9}
.finp:disabled,.fsel:disabled{background:var(--bg2);color:var(--muted);cursor:not-allowed}
.ftxt{resize:vertical;min-height:80px}
.ferr{color:#ef4444;font-size:11.5px;margin-top:3px}
.dup-warn{background:#fff7ed;border:1px solid #fed7aa;border-radius:8px;padding:11px 13px;display:flex;gap:9px;margin-bottom:12px;align-items:flex-start}
.dup-txt{font-size:13px;color:#92400e;line-height:1.5}
.confirm-box{background:var(--bg2);border:1px solid var(--border);border-radius:10px;padding:18px}
.confirm-sec{padding-bottom:14px;margin-bottom:14px;border-bottom:1px solid var(--border)}
.confirm-sec:last-child{border:none;padding:0;margin:0}
.confirm-title{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;color:var(--muted);margin-bottom:9px;font-family:var(--mono)}
.confirm-grid{display:grid;grid-template-columns:1fr 1fr;gap:7px 14px}
.cl{font-size:12.5px;color:var(--muted)}
.cv{font-size:12.5px;font-weight:600;color:var(--ink2)}
.alert-info{background:#eff6ff;border:1px solid #bfdbfe;border-radius:8px;padding:11px 13px;display:flex;gap:9px;margin-bottom:13px;align-items:flex-start}
.alert-txt{font-size:12.5px;color:#1e40af;line-height:1.5}
.btnrow{display:flex;align-items:center;justify-content:space-between;margin-top:22px;padding-top:18px;border-top:1px solid var(--border);gap:10px}
.btn{padding:9px 18px;border-radius:8px;font-weight:600;font-size:13.5px;border:none;cursor:pointer;font-family:var(--font);transition:all .14s;display:flex;align-items:center;gap:7px}
.btn-ghost{background:transparent;color:var(--ink3);border:1px solid var(--border)}
.btn-ghost:hover{background:var(--bg2)}
.btn-primary{background:var(--brand);color:#fff;margin-left:auto}
.btn-primary:hover{background:var(--brand-d)}
.btn-success{background:#16a34a;color:#fff;margin-left:auto}
.btn-success:hover{background:#15803d}
.btn-outline{background:#fff;color:var(--brand);border:1.5px solid var(--brand)}
.btn-outline:hover{background:var(--brand-l)}
.btn-danger{background:#dc2626;color:#fff}
.btn-danger:hover{background:#b91c1c}

/* SUCCESS */
.succ-outer{flex:1;display:flex;align-items:center;justify-content:center;padding:24px}
.succ-card{background:#fff;border:1px solid var(--border);border-radius:16px;padding:40px 32px;text-align:center;max-width:440px;width:100%;box-shadow:var(--sh-md)}
.succ-icon{width:68px;height:68px;border-radius:50%;background:#dcfce7;display:flex;align-items:center;justify-content:center;margin:0 auto 18px}
.succ-h{font-size:21px;font-weight:800;color:var(--ink);margin-bottom:7px}
.succ-p{font-size:13px;color:var(--muted);margin-bottom:18px;line-height:1.6}
.ticket{background:var(--ink);color:#fff;border-radius:12px;padding:18px 22px;text-align:left;margin-bottom:18px}
.ticket-num{font-family:var(--mono);font-size:38px;font-weight:900;color:#93c5fd;text-align:center;display:block;margin-bottom:11px}
.ticket-row{display:flex;justify-content:space-between;font-size:12.5px;padding:5px 0;border-bottom:1px solid #1f2937}
.ticket-row:last-child{border:none}
.ticket-lbl{color:#9ca3af}
.ticket-val{color:#f3f4f6;font-weight:600}

/* QUEUE */
.queue-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}
.qcard{background:#fff;border:1px solid var(--border);border-radius:var(--r);overflow:hidden;box-shadow:var(--sh)}
.qcard-hd{padding:11px 15px;background:var(--ink);color:#fff;display:flex;align-items:center;justify-content:space-between}
.qcard-dept{font-size:13.5px;font-weight:700}
.qcard-cnt{font-size:11.5px;font-family:var(--mono);color:#9ca3af}
.qitem{display:flex;align-items:center;gap:11px;padding:10px 15px;border-bottom:1px solid #f3f4f6;transition:background .11s}
.qitem:last-child{border:none}
.qitem.in_progress{background:#faf5ff}
.qnum{width:30px;height:30px;border-radius:7px;background:var(--brand-l);color:var(--brand);font-family:var(--mono);font-weight:700;font-size:13px;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.qnum.active{background:#7c3aed;color:#fff}
.qname{font-size:13px;font-weight:600;color:var(--ink2)}
.qtime{font-size:11px;color:var(--muted);font-family:var(--mono);margin-top:2px}
.qbadge{margin-left:auto;flex-shrink:0}

/* PATIENTS PAGE */
.p-card{background:#fff;border:1px solid var(--border);border-radius:var(--r);padding:14px 18px;display:flex;align-items:center;gap:14px;transition:box-shadow .16s}
.p-card:hover{box-shadow:var(--sh-md)}
.p-card-info{flex:1;min-width:0}
.p-card-name{font-size:14.5px;font-weight:700;color:var(--ink2)}
.p-card-meta{font-size:12px;color:var(--muted);font-family:var(--mono);margin-top:3px;display:flex;flex-wrap:wrap;gap:10px}
.p-card-appt{text-align:right;flex-shrink:0}
.p-card-date{font-size:12.5px;font-family:var(--mono);font-weight:600;color:var(--ink3)}
.p-card-dept{font-size:11.5px;color:var(--muted);margin-top:3px}

/* SCHEDULE */
.sch-table{border:1px solid var(--border);border-radius:var(--r);overflow:hidden;background:#fff}
.sch-head{display:grid;background:var(--stripe);border-bottom:1px solid var(--border)}
.sch-head-cell{padding:10px 12px;font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.06em;font-family:var(--mono);border-right:1px solid var(--border);text-align:center}
.sch-head-cell:last-child{border:none}
.sch-row{display:grid;border-bottom:1px solid #f3f4f6}
.sch-row:last-child{border:none}
.sch-time{padding:8px 12px;font-size:12px;font-family:var(--mono);color:var(--muted);border-right:1px solid var(--border);display:flex;align-items:center;justify-content:center;background:var(--stripe);font-weight:600}
.sch-cell{padding:5px 7px;border-right:1px solid #f3f4f6;min-height:44px;display:flex;align-items:center}
.sch-cell:last-child{border:none}
.sch-empty{width:100%;height:32px;border-radius:6px;cursor:pointer;border:1.5px dashed transparent;transition:all .13s;display:flex;align-items:center;justify-content:center;color:transparent;font-size:11px}
.sch-empty:hover{border-color:var(--brand);color:var(--brand);background:var(--brand-l)}
.sch-slot{background:var(--brand-l);border-radius:6px;padding:4px 8px;font-size:11.5px;font-weight:600;color:var(--brand);width:100%;cursor:pointer;border:none;text-align:left;line-height:1.3;transition:all .13s}
.sch-slot:hover{background:var(--brand-ll);box-shadow:var(--sh)}
.sch-slot.in_progress{background:#ede9fe;color:#7c3aed}
.sch-slot.completed{background:#dcfce7;color:#166534}
.sch-slot.waiting{background:#fef3c7;color:#b45309}
.sch-slot.cancelled{background:#fee2e2;color:#991b1b;text-decoration:line-through}
.sch-filter{display:flex;align-items:center;gap:10px;padding:14px 20px;border-bottom:1px solid var(--border);flex-wrap:wrap}

/* ANALYTICS */
.analytics-grid{display:grid;grid-template-columns:2fr 1fr;gap:16px}
.chart-area{background:#fff;border:1px solid var(--border);border-radius:var(--r);padding:20px;box-shadow:var(--sh)}
.chart-title{font-size:14px;font-weight:700;color:var(--ink);margin-bottom:16px}
.bar-chart{display:flex;align-items:flex-end;gap:8px;height:160px;padding-bottom:24px;position:relative}
.bar-chart::after{content:'';position:absolute;bottom:24px;left:0;right:0;height:1px;background:var(--border)}
.bar-wrap{display:flex;flex-direction:column;align-items:center;flex:1;gap:4px;position:relative}
.bar-fill{width:100%;border-radius:5px 5px 0 0;transition:all .4s ease;cursor:pointer;position:relative;min-height:4px}
.bar-fill:hover{filter:brightness(.92)}
.bar-val{font-size:10px;font-family:var(--mono);font-weight:600;color:var(--ink3);white-space:nowrap}
.bar-lbl{font-size:10px;color:var(--muted);font-family:var(--mono);position:absolute;bottom:-22px;white-space:nowrap}
.pie-wrap{display:flex;flex-direction:column;gap:10px}
.pie-item{display:flex;align-items:center;gap:10px;padding:8px 12px;border-radius:8px;background:var(--bg2)}
.pie-dot{width:12px;height:12px;border-radius:50%;flex-shrink:0}
.pie-name{font-size:13px;color:var(--ink3);flex:1}
.pie-cnt{font-size:13px;font-weight:700;font-family:var(--mono);color:var(--ink2)}
.pie-pct{font-size:11px;color:var(--muted);font-family:var(--mono)}

/* NOTIFICATIONS PANEL */
.notif-panel{position:fixed;top:54px;right:16px;width:340px;background:#fff;border:1px solid var(--border);border-radius:12px;box-shadow:var(--sh-lg);z-index:90;overflow:hidden;animation:su .15s ease}
.np-head{padding:13px 16px;border-bottom:1px solid var(--border);display:flex;align-items:center;justify-content:space-between}
.np-title{font-size:14px;font-weight:700;color:var(--ink)}
.np-mark{font-size:12px;color:var(--brand);cursor:pointer;font-weight:500}
.np-mark:hover{text-decoration:underline}
.notif-item{padding:12px 16px;border-bottom:1px solid #f3f4f6;display:flex;gap:10px;transition:background .11s;cursor:pointer}
.notif-item:last-child{border:none}
.notif-item:hover{background:var(--bg2)}
.notif-item.unread{background:#fafbff}
.ni-ic{width:32px;height:32px;border-radius:8px;display:flex;align-items:center;justify-content:center;flex-shrink:0;margin-top:1px}
.ni-title{font-size:13px;font-weight:600;color:var(--ink2);margin-bottom:2px}
.ni-body{font-size:12px;color:var(--muted);line-height:1.4}
.ni-time{font-size:10.5px;color:var(--muted);font-family:var(--mono);margin-top:4px}
.np-empty{padding:28px;text-align:center;color:var(--muted);font-size:13px}

/* GLOBAL SEARCH */
.gs-overlay{position:fixed;inset:0;background:rgba(13,17,23,.4);z-index:200;display:flex;justify-content:center;padding-top:80px;animation:fi .12s}
.gs-box{background:#fff;border-radius:14px;width:100%;max-width:560px;box-shadow:var(--sh-lg);overflow:hidden;animation:su .15s ease;max-height:500px;display:flex;flex-direction:column}
.gs-inp-wrap{display:flex;align-items:center;gap:12px;padding:14px 18px;border-bottom:1px solid var(--border)}
.gs-inp{flex:1;border:none;outline:none;font-size:16px;font-family:var(--font);color:var(--ink)}
.gs-results{overflow-y:auto;flex:1}
.gs-item{display:flex;align-items:center;gap:12px;padding:11px 18px;cursor:pointer;transition:background .1s;border-bottom:1px solid #f9fafb}
.gs-item:last-child{border:none}
.gs-item:hover,.gs-item.sel{background:var(--brand-l)}
.gs-item-name{font-size:13.5px;font-weight:600;color:var(--ink2)}
.gs-item-meta{font-size:12px;color:var(--muted);font-family:var(--mono);margin-top:1px}
.gs-empty{padding:32px;text-align:center;color:var(--muted);font-size:13.5px}
.gs-footer{padding:9px 18px;border-top:1px solid var(--border);display:flex;gap:16px;background:var(--stripe)}
.gs-hint{font-size:11px;color:var(--muted);font-family:var(--mono);display:flex;align-items:center;gap:4px}
.gs-kbd{background:#fff;border:1px solid var(--border2);border-radius:4px;padding:1px 5px;font-size:10px}

@media(max-width:960px){
  .stats-grid{grid-template-columns:repeat(2,1fr)}
  .queue-grid{grid-template-columns:1fr}
  .analytics-grid{grid-template-columns:1fr}
  .fgrid3,.fgrid2{grid-template-columns:1fr 1fr}
  .reg-layout{flex-direction:column}
  .reg-wrap{flex:none;max-width:100%}
  .reg-plist{max-height:400px}
}
@media(max-width:640px){
  .sb{width:52px;min-width:52px}
  .sb-title,.sb-sub,.sb-item span:not(.sb-badge),.sb-section,.sb-uname,.sb-urole{display:none}
  .sb-item{padding:9px 12px;justify-content:center}
  .sb-logo{padding:13px 10px;justify-content:center}
  .fgrid3,.fgrid2{grid-template-columns:1fr}
  .mgrid{grid-template-columns:1fr}
  .mfull{grid-column:span 1}
  .stats-grid{grid-template-columns:1fr 1fr}
  .confirm-grid{grid-template-columns:1fr}
}
@media print{
  .sb,.topbar{display:none!important}
  .main{display:block}
  .page{display:block}
}
`;

// ─── MOCK NOTIFICATIONS ───────────────────────────────────────────────────────

const INIT_NOTIFS = [
  { id:1, type:"warn",  title:"Конфликт времени",        body:"Козлова Е.В. — 09:00 занято двумя пациентами",          time:"5 мин назад",  read:false },
  { id:2, type:"info",  title:"Новая запись",             body:"Токтосунов Б. записан на 15:00 — Кардиология",          time:"12 мин назад", read:false },
  { id:3, type:"ok",    title:"Приём завершён",           body:"Козлова М.В. — Педиатрия, Смирнова О.Л.",               time:"28 мин назад", read:true  },
  { id:4, type:"warn",  title:"Опоздание",               body:"Абдиев Р.М. — 14:00 Хирургия, не отметился",            time:"1 ч назад",    read:true  },
  { id:5, type:"info",  title:"Запись на завтра",         body:"3 пациента записаны на 07.05.2026",                      time:"2 ч назад",    read:true  },
];

// ─── SHARED COMPONENTS ────────────────────────────────────────────────────────

function StatusBadge({ status }) {
  const sc = STATUS_CFG[status] || STATUS_CFG.confirmed;
  return (
    <span className="badge" style={{ background: sc.bg, color: sc.color }}>
      <span className="bdot" style={{ background: sc.dot }} />
      {sc.label}
    </span>
  );
}

function StatusChanger({ status, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return;
    const fn = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, [open]);
  const sc = STATUS_CFG[status] || STATUS_CFG.confirmed;
  return (
    <div className="status-wrap" ref={ref}>
      <span className="badge" style={{ background: sc.bg, color: sc.color, cursor: "pointer", userSelect: "none" }}
        onClick={() => setOpen(v => !v)}>
        <span className="bdot" style={{ background: sc.dot }} />
        {sc.label}
        <ChevronDown size={10} style={{ marginLeft: 2 }} />
      </span>
      {open && (
        <div className="sdrop">
          {Object.entries(STATUS_CFG).map(([k, v]) => (
            <div key={k} className="sopt" onClick={() => { onChange(k); setOpen(false); }}>
              <span style={{ width:8, height:8, borderRadius:"50%", background:v.dot, display:"inline-block", flexShrink:0 }} />
              <span style={{ color:v.color, fontSize:12.5, fontWeight:600 }}>{v.label}</span>
              {k === status && <Check size={12} style={{ marginLeft:"auto", color:"#9ca3af" }} />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── GLOBAL SEARCH ────────────────────────────────────────────────────────────

function GlobalSearch({ patients, onSelect, onClose }) {
  const [q, setQ] = useState("");
  const [sel, setSel] = useState(0);
  const inpRef = useRef(null);

  useEffect(() => { inpRef.current?.focus(); }, []);
  useEffect(() => {
    const fn = e => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowDown") setSel(s => Math.min(s+1, results.length-1));
      if (e.key === "ArrowUp")   setSel(s => Math.max(s-1, 0));
      if (e.key === "Enter" && results[sel]) { onSelect(results[sel]); onClose(); }
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  });

  const results = q.length < 2 ? [] : patients.filter(p => {
    const s = `${p.lastName} ${p.firstName} ${p.middleName} ${p.phone} ${p.iin} ${p.department}`.toLowerCase();
    return s.includes(q.toLowerCase());
  }).slice(0, 8);

  return (
    <div className="gs-overlay" onClick={onClose}>
      <div className="gs-box" onClick={e => e.stopPropagation()}>
        <div className="gs-inp-wrap">
          <Search size={18} color="var(--muted)" />
          <input ref={inpRef} className="gs-inp" placeholder="Поиск по имени, ИИН, телефону…" value={q} onChange={e => { setQ(e.target.value); setSel(0); }} />
          <kbd style={{ fontSize:11, fontFamily:"var(--mono)", color:"var(--muted)", background:"var(--bg)", border:"1px solid var(--border2)", borderRadius:5, padding:"2px 7px" }}>Esc</kbd>
        </div>
        <div className="gs-results">
          {q.length < 2 ? (
            <div className="gs-empty">Введите минимум 2 символа для поиска</div>
          ) : results.length === 0 ? (
            <div className="gs-empty">Пациенты не найдены</div>
          ) : results.map((p, i) => (
            <div key={p.id} className={`gs-item ${i===sel?"sel":""}`}
              onClick={() => { onSelect(p); onClose(); }}
              onMouseEnter={() => setSel(i)}>
              <div className={`pt-av ${p.gender==="male"?"av-m":"av-f"}`} style={{ width:36, height:36, fontSize:13, flexShrink:0 }}>
                {p.lastName[0]}{p.firstName[0]}
              </div>
              <div>
                <div className="gs-item-name">{p.lastName} {p.firstName} {p.middleName}</div>
                <div className="gs-item-meta">{p.iin} · {p.phone} · {p.department}</div>
              </div>
              <StatusBadge status={p.status} />
            </div>
          ))}
        </div>
        <div className="gs-footer">
          <span className="gs-hint"><kbd className="gs-kbd">↑↓</kbd> навигация</span>
          <span className="gs-hint"><kbd className="gs-kbd">Enter</kbd> открыть</span>
          <span className="gs-hint"><kbd className="gs-kbd">Esc</kbd> закрыть</span>
        </div>
      </div>
    </div>
  );
}

// ─── NOTIFICATIONS ────────────────────────────────────────────────────────────

function NotifPanel({ notifs, onMarkAll, onClose }) {
  const COLORS = { warn:{ bg:"#fff7ed", ic:"#f59e0b" }, info:{ bg:"#eff6ff", ic:"#3b82f6" }, ok:{ bg:"#dcfce7", ic:"#22c55e" } };
  const ICONS  = { warn:<AlertTriangle size={16}/>, info:<Bell size={16}/>, ok:<CheckCircle size={16}/> };
  return (
    <div className="notif-panel">
      <div className="np-head">
        <span className="np-title">Уведомления</span>
        <span className="np-mark" onClick={onMarkAll}>Прочитать все</span>
      </div>
      {notifs.length === 0 ? (
        <div className="np-empty">Нет новых уведомлений</div>
      ) : notifs.map(n => {
        const c = COLORS[n.type];
        return (
          <div key={n.id} className={`notif-item ${n.read?"":"unread"}`}>
            <div className="ni-ic" style={{ background: c.bg, color: c.ic }}>{ICONS[n.type]}</div>
            <div>
              <div className="ni-title">{n.title}</div>
              <div className="ni-body">{n.body}</div>
              <div className="ni-time">{n.time}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── PATIENT MODAL (VIEW + EDIT) ──────────────────────────────────────────────

function PatientModal({ patient, onClose, onStatusChange, onUpdate }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ ...patient });

  if (!patient) return null;

  const change = e => {
    const { name, value } = e.target;
    if (name === "department") setForm(p => ({ ...p, department: value, doctor: "" }));
    else setForm(p => ({ ...p, [name]: value }));
  };
  const save = () => { onUpdate(form); setEditing(false); };

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="mhd">
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <div className={`mhd-av ${patient.gender==="male"?"m":"f"}`}>
              {patient.lastName[0]}{patient.firstName[0]}
            </div>
            <div>
              <div className="m-name">{patient.lastName} {patient.firstName} {patient.middleName}</div>
              <div className="m-id">ID #{patient.id} · ИИН: {patient.iin} · {calcAge(patient.birthDate)}</div>
            </div>
          </div>
          <button className="mclose" onClick={onClose}><X size={20}/></button>
        </div>

        <div className="mbody">
          {!editing ? (
            <>
              <div className="msect">
                <div className="msect-t">Контакты</div>
                <div className="mrow-ic"><Phone size={14}/>{patient.phone}</div>
                {patient.email && <div className="mrow-ic"><Mail size={14}/>{patient.email}</div>}
                {patient.address && <div className="mrow-ic"><MapPin size={14}/>{patient.address}</div>}
              </div>
              <div className="msect">
                <div className="msect-t">Личные данные</div>
                <div className="mgrid">
                  <div className="mf"><div className="mfl">Дата рождения</div><div className="mfv">{fmtDate(patient.birthDate)}</div></div>
                  <div className="mf"><div className="mfl">Пол</div><div className="mfv">{patient.gender==="male"?"Мужской":"Женский"}</div></div>
                </div>
              </div>
              <div className="msect">
                <div className="msect-t">Запись на приём</div>
                <div className="mgrid">
                  <div className="mf"><div className="mfl">Отделение</div><div className="mfv">{patient.department}</div></div>
                  <div className="mf"><div className="mfl">Врач</div><div className="mfv">{patient.doctor}</div></div>
                  <div className="mf"><div className="mfl">Дата</div><div className="mfv">{fmtDate(patient.appointmentDate)}</div></div>
                  <div className="mf"><div className="mfl">Время</div><div className="mfv mono">{patient.appointmentTime}</div></div>
                  <div className="mf mfull">
                    <div className="mfl">Статус</div>
                    <div className="mfv">
                      <StatusChanger status={patient.status} onChange={s => { onStatusChange(patient.id, s); }} />
                    </div>
                  </div>
                </div>
              </div>
              {patient.complaint && (
                <div className="msect">
                  <div className="msect-t">Жалобы</div>
                  <div className="mcomplaint">{patient.complaint}</div>
                </div>
              )}
            </>
          ) : (
            <>
              <div className="edit-grid">
                {[["lastName","Фамилия"],["firstName","Имя"],["middleName","Отчество"],["phone","Телефон"],["email","Email"],["address","Адрес"]].map(([n,l]) => (
                  <div className="efg" key={n}>
                    <label className="efl">{l}</label>
                    <input name={n} value={form[n]||""} onChange={change} className="einp" />
                  </div>
                ))}
              </div>
              <div className="edit-grid">
                <div className="efg">
                  <label className="efl">Отделение</label>
                  <select name="department" value={form.department} onChange={change} className="esel">
                    {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
                <div className="efg">
                  <label className="efl">Врач</label>
                  <select name="doctor" value={form.doctor} onChange={change} className="esel">
                    {(DOCTORS_BY_DEPT[form.department]||[]).map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
                <div className="efg">
                  <label className="efl">Дата приёма</label>
                  <input type="date" name="appointmentDate" value={form.appointmentDate} onChange={change} className="einp" />
                </div>
                <div className="efg">
                  <label className="efl">Время</label>
                  <select name="appointmentTime" value={form.appointmentTime} onChange={change} className="esel">
                    {TIME_SLOTS.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div className="efg">
                <label className="efl">Жалобы</label>
                <textarea name="complaint" value={form.complaint||""} onChange={change} className="etxt" />
              </div>
            </>
          )}
        </div>

        <div className="m-foot">
          {!editing ? (
            <>
              <button className="btn btn-ghost" onClick={onClose}>Закрыть</button>
              <button className="btn btn-outline" onClick={() => setEditing(true)}>
                <Edit2 size={13}/> Редактировать
              </button>
            </>
          ) : (
            <>
              <button className="btn btn-ghost" onClick={() => { setForm({...patient}); setEditing(false); }}>Отмена</button>
              <button className="btn btn-success" onClick={save}><Save size={13}/> Сохранить</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── SIDEBAR ─────────────────────────────────────────────────────────────────

function Sidebar({ page, go, patients }) {
  const today = todayStr();
  const todayWaiting = patients.filter(p => p.appointmentDate === today && (p.status==="waiting"||p.status==="in_progress")).length;
  const nav = [
    { id:"dashboard", icon:<LayoutDashboard size={17}/>, label:"Дашборд" },
    { id:"patients",  icon:<Users size={17}/>,           label:"Пациенты" },
    { id:"queue",     icon:<List size={17}/>,             label:"Очередь", badge: todayWaiting||null },
    { id:"schedule",  icon:<CalendarDays size={17}/>,     label:"Расписание" },
    { id:"analytics", icon:<BarChart2 size={17}/>,        label:"Аналитика" },
    { id:"register",  icon:<ClipboardList size={17}/>,    label:"Регистрация" },
  ];
  return (
    <aside className="sb">
      <div className="sb-logo">
        <div className="sb-mark"><Stethoscope size={19} color="#fff"/></div>
        <div>
          <div className="sb-title">Поликлиника №1</div>
          <div className="sb-sub">medpolis.kg</div>
        </div>
      </div>
      <nav className="sb-nav">
        <div className="sb-section">Меню</div>
        {nav.map(n => (
          <button key={n.id} className={`sb-item ${page===n.id?"active":""}`} onClick={() => go(n.id)}>
            <span className="sb-ic">{n.icon}</span>
            <span>{n.label}</span>
            {n.badge && <span className="sb-badge">{n.badge}</span>}
          </button>
        ))}
      </nav>
      <div className="sb-foot">
        <div className="sb-user">
          <div className="sb-av">АД</div>
          <div>
            <div className="sb-uname">Администратор</div>
            <div className="sb-urole">admin · №1</div>
          </div>
        </div>
      </div>
    </aside>
  );
}

// ─── TOPBAR ───────────────────────────────────────────────────────────────────

function Topbar({ page, go, patients, notifCount, onNotif, onSearch }) {
  const meta = { dashboard:"Дашборд", patients:"Пациенты", queue:"Очередь на сегодня", schedule:"Расписание", analytics:"Аналитика", register:"Регистрация пациента" };
  const dateStr = new Date().toLocaleDateString("ru-RU", { day:"numeric", month:"long", year:"numeric" });
  return (
    <div className="topbar">
      <div className="tb-left">
        <span className="tb-crumb">Поликлиника №1</span>
        <ChevronRight size={13} className="tb-sep"/>
        <span className="tb-title">{meta[page]}</span>
      </div>
      <div className="tb-right">
        <div className="tb-search" onClick={onSearch}>
          <Search size={14}/>
          <span>Быстрый поиск</span>
          <kbd className="tb-kbd">⌘K</kbd>
        </div>
        <span className="tb-today">{dateStr}</span>
        <button className="tb-icon" onClick={onNotif} style={{ position:"relative" }}>
          <Bell size={15}/>
          {notifCount > 0 && <span className="tb-ndot"/>}
        </button>
        {page !== "register" && (
          <button className="tb-btn" onClick={() => go("register")}>
            <Plus size={14}/> Пациент
          </button>
        )}
      </div>
    </div>
  );
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────

function DashboardPage({ patients, onDelete, onStatusChange, onUpdate, go }) {
  const [search, setSearch] = useState("");
  const [dept, setDept]     = useState("");
  const [status, setStatus] = useState("");
  const [sel, setSel]       = useState(null);
  const today = todayStr();

  const filtered = patients.filter(p => {
    const q = `${p.lastName} ${p.firstName} ${p.middleName} ${p.phone} ${p.iin}`.toLowerCase();
    return (!search || q.includes(search.toLowerCase())) &&
           (!dept   || p.department === dept) &&
           (!status || p.status === status);
  });

  const stats = [
    { ic:<Users size={17} color="#1d4ed8"/>,   bg:"#dbeafe", val:patients.length,                                    lbl:"Всего пациентов",    foot:`+${patients.filter(p=>p.appointmentDate===today).length} сегодня` },
    { ic:<Clock size={17} color="#b45309"/>,    bg:"#fde68a", val:patients.filter(p=>p.status==="waiting").length,   lbl:"Ожидают приёма",     foot:"в очереди сейчас" },
    { ic:<Stethoscope size={17} color="#6d28d9"/>,bg:"#ede9fe",val:patients.filter(p=>p.status==="in_progress").length,lbl:"На приёме",          foot:"у врача сейчас" },
    { ic:<CheckCircle size={17} color="#15803d"/>,bg:"#dcfce7",val:patients.filter(p=>p.status==="completed").length, lbl:"Завершено",          foot:"приёмов всего" },
  ];

  return (
    <>
      <div className="stats-grid">
        {stats.map((s, i) => (
          <div className="stat-card" key={i}>
            <div className="stat-top">
              <span className="stat-lbl">{s.lbl}</span>
              <div className="stat-ic" style={{ background:s.bg }}>{s.ic}</div>
            </div>
            <div className="stat-val">{s.val}</div>
            <div className="stat-foot"><TrendingUp size={10} className="stat-up"/>{s.foot}</div>
          </div>
        ))}
      </div>
      <div className="card">
        <div className="card-head">
          <div>
            <div className="card-title">Журнал пациентов</div>
            <div className="card-sub">{filtered.length} из {patients.length}</div>
          </div>
          <div className="card-actions">
            <div className="srch-wrap">
              <Search size={13} className="srch-ico"/>
              <input className="srch-inp" placeholder="ФИО, телефон, ИИН…" value={search} onChange={e=>setSearch(e.target.value)}/>
            </div>
            <select className="sel" value={dept} onChange={e=>setDept(e.target.value)}>
              <option value="">Все отделения</option>
              {DEPARTMENTS.map(d=><option key={d}>{d}</option>)}
            </select>
            <select className="sel" value={status} onChange={e=>setStatus(e.target.value)}>
              <option value="">Все статусы</option>
              {Object.entries(STATUS_CFG).map(([k,v])=><option key={k} value={k}>{v.label}</option>)}
            </select>
          </div>
        </div>
        <div className="tscroll">
          <table>
            <thead>
              <tr>
                <th>Пациент</th><th>Телефон</th><th>Отделение</th><th>Врач</th><th>Дата · Время</th><th>Статус</th><th style={{width:90}}>Действия</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length===0 ? (
                <tr><td colSpan={7} style={{textAlign:"center",color:"var(--muted)",padding:"36px 0",fontSize:13}}>Записи не найдены</td></tr>
              ) : filtered.map(p => (
                <tr key={p.id}>
                  <td>
                    <div className="pt-cell">
                      <div className={`pt-av ${p.gender==="male"?"av-m":"av-f"}`}>{p.lastName[0]}{p.firstName[0]}</div>
                      <div>
                        <div className="pt-name">{p.lastName} {p.firstName}</div>
                        <div className="pt-meta">{p.iin}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{fontFamily:"var(--mono)",fontSize:12.5}}>{p.phone}</td>
                  <td><span className="dept-tag">{p.department}</span></td>
                  <td style={{fontSize:12.5}}>{p.doctor}</td>
                  <td style={{fontFamily:"var(--mono)",fontSize:12}}>
                    {fmtDate(p.appointmentDate)}<br/><span style={{color:"var(--muted)"}}>{p.appointmentTime}</span>
                  </td>
                  <td><StatusChanger status={p.status} onChange={s=>onStatusChange(p.id,s)}/></td>
                  <td>
                    <div className="acts">
                      <button className="abt view" onClick={()=>setSel(p)}><Eye size={13}/></button>
                      <button className="abt edit" onClick={()=>{setSel(p);}}><Edit2 size={13}/></button>
                      <button className="abt del" onClick={()=>onDelete(p.id)}><Trash2 size={13}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="tfoot">
          <span className="tcnt">Показано {filtered.length} из {patients.length}</span>
          <span className="tcnt">{new Date().toLocaleString("ru-RU")}</span>
        </div>
      </div>
      {sel && (
        <PatientModal
          patient={patients.find(p=>p.id===sel.id)||sel}
          onClose={()=>setSel(null)}
          onStatusChange={(id,s)=>{onStatusChange(id,s);}}
          onUpdate={p=>{onUpdate(p);setSel(p);}}
        />
      )}
    </>
  );
}

// ─── PATIENTS PAGE ────────────────────────────────────────────────────────────

function PatientsPage({ patients, onDelete, onStatusChange, onUpdate, go }) {
  const [search, setSearch] = useState("");
  const [sel, setSel] = useState(null);

  const filtered = patients.filter(p => {
    const q = `${p.lastName} ${p.firstName} ${p.middleName} ${p.phone} ${p.iin}`.toLowerCase();
    return !search || q.includes(search.toLowerCase());
  });

  return (
    <>
      <div className="card">
        <div className="card-head">
          <div>
            <div className="card-title">Картотека пациентов</div>
            <div className="card-sub">{filtered.length} записей</div>
          </div>
          <div className="card-actions">
            <div className="srch-wrap">
              <Search size={13} className="srch-ico"/>
              <input className="srch-inp" placeholder="ФИО, ИИН, телефон…" value={search} onChange={e=>setSearch(e.target.value)}/>
            </div>
            <button className="btn btn-primary" style={{margin:0}} onClick={()=>go("register")}>
              <Plus size={13}/> Добавить
            </button>
          </div>
        </div>
        <div style={{padding:"14px 18px",display:"flex",flexDirection:"column",gap:8}}>
          {filtered.length===0 ? (
            <div style={{textAlign:"center",color:"var(--muted)",padding:"36px 0",fontSize:13}}>Пациенты не найдены</div>
          ) : filtered.map(p => (
            <div key={p.id} className="p-card">
              <div className={`pt-av ${p.gender==="male"?"av-m":"av-f"}`} style={{width:42,height:42,fontSize:15,flexShrink:0}}>
                {p.lastName[0]}{p.firstName[0]}
              </div>
              <div className="p-card-info">
                <div className="p-card-name">{p.lastName} {p.firstName} {p.middleName}</div>
                <div className="p-card-meta">
                  <span>{p.iin}</span>
                  <span>{p.phone}</span>
                  {p.address && <span>{p.address}</span>}
                </div>
              </div>
              <div className="p-card-appt">
                <div className="p-card-date">{fmtDate(p.appointmentDate)} · {p.appointmentTime}</div>
                <div className="p-card-dept">{p.department} — {p.doctor}</div>
              </div>
              <StatusBadge status={p.status}/>
              <div className="acts" style={{marginLeft:4}}>
                <button className="abt view" onClick={()=>setSel(p)}><Eye size={13}/></button>
                <button className="abt del" onClick={()=>onDelete(p.id)}><Trash2 size={13}/></button>
              </div>
            </div>
          ))}
        </div>
      </div>
      {sel && (
        <PatientModal
          patient={patients.find(p=>p.id===sel.id)||sel}
          onClose={()=>setSel(null)}
          onStatusChange={onStatusChange}
          onUpdate={p=>{onUpdate(p);setSel(p);}}
        />
      )}
    </>
  );
}

// ─── QUEUE PAGE ───────────────────────────────────────────────────────────────

function QueuePage({ patients, onStatusChange }) {
  const today = todayStr();
  const todayPts = patients
    .filter(p => p.appointmentDate===today && p.status!=="cancelled")
    .sort((a,b) => a.appointmentTime.localeCompare(b.appointmentTime));

  const byDept = {};
  todayPts.forEach(p => { if(!byDept[p.department]) byDept[p.department]=[]; byDept[p.department].push(p); });

  const waiting    = todayPts.filter(p=>p.status==="waiting"||p.status==="in_progress").length;
  const completed  = todayPts.filter(p=>p.status==="completed").length;

  return (
    <>
      <div className="stats-grid" style={{gridTemplateColumns:"repeat(3,1fr)"}}>
        <div className="stat-card">
          <div className="stat-top"><span className="stat-lbl">Всего на сегодня</span><div className="stat-ic" style={{background:"#dbeafe"}}><Calendar size={16} color="#1d4ed8"/></div></div>
          <div className="stat-val">{todayPts.length}</div>
          <div className="stat-foot">записей на {fmtDate(today)}</div>
        </div>
        <div className="stat-card">
          <div className="stat-top"><span className="stat-lbl">Ожидают / На приёме</span><div className="stat-ic" style={{background:"#fde68a"}}><Clock size={16} color="#b45309"/></div></div>
          <div className="stat-val">{waiting}</div>
          <div className="stat-foot">человек в очереди</div>
        </div>
        <div className="stat-card">
          <div className="stat-top"><span className="stat-lbl">Завершено</span><div className="stat-ic" style={{background:"#dcfce7"}}><CheckCircle size={16} color="#15803d"/></div></div>
          <div className="stat-val">{completed}</div>
          <div className="stat-foot">приёмов сегодня</div>
        </div>
      </div>

      {Object.keys(byDept).length===0 ? (
        <div className="card" style={{padding:"48px 0",textAlign:"center",color:"var(--muted)",fontSize:14}}>На сегодня записей нет</div>
      ) : (
        <div className="queue-grid">
          {Object.entries(byDept).map(([dept,pts]) => (
            <div className="qcard" key={dept}>
              <div className="qcard-hd">
                <span className="qcard-dept">{dept}</span>
                <span className="qcard-cnt">{pts.length} чел.</span>
              </div>
              <div>
                {pts.map((p,i) => (
                  <div key={p.id} className={`qitem ${p.status}`}>
                    <div className={`qnum ${p.status==="in_progress"?"active":""}`}>{i+1}</div>
                    <div>
                      <div className="qname">{p.lastName} {p.firstName}</div>
                      <div className="qtime">{p.appointmentTime} · {p.doctor}</div>
                    </div>
                    <div className="qbadge">
                      <StatusChanger status={p.status} onChange={s=>onStatusChange(p.id,s)}/>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

// ─── SCHEDULE PAGE ────────────────────────────────────────────────────────────

function SchedulePage({ patients, onSelect, onAdd }) {
  const [selDept, setSelDept] = useState(DEPARTMENTS[0]);
  const [selDate, setSelDate] = useState(todayStr());

  const doctors = DOCTORS_BY_DEPT[selDept] || [];
  const dayPts  = patients.filter(p => p.department===selDept && p.appointmentDate===selDate);

  const slotPt = (doc, time) => dayPts.find(p => p.doctor===doc && p.appointmentTime===time);

  const cols = 1 + doctors.length;
  const gridStyle = { gridTemplateColumns:`80px repeat(${doctors.length},1fr)` };

  return (
    <>
      <div className="card">
        <div className="sch-filter">
          <Calendar size={15} color="var(--muted)"/>
          <select className="sel" value={selDept} onChange={e=>setSelDept(e.target.value)}>
            {DEPARTMENTS.map(d=><option key={d}>{d}</option>)}
          </select>
          <input type="date" className="sel" value={selDate}
            onChange={e=>setSelDate(e.target.value)}
            min={addDays(todayStr(),-7)} max={addDays(todayStr(),30)}
          />
          <span style={{fontSize:12,fontFamily:"var(--mono)",color:"var(--muted)",marginLeft:4}}>
            {dayPts.length} записей
          </span>
        </div>

        <div style={{overflowX:"auto"}}>
          {/* Header */}
          <div className="sch-head" style={gridStyle}>
            <div className="sch-head-cell">Время</div>
            {doctors.map(d => (
              <div key={d} className="sch-head-cell">{d}</div>
            ))}
          </div>

          {/* Rows */}
          {TIME_SLOTS.map(time => (
            <div key={time} className="sch-row" style={gridStyle}>
              <div className="sch-time">{time}</div>
              {doctors.map(doc => {
                const p = slotPt(doc, time);
                return (
                  <div key={doc} className="sch-cell">
                    {p ? (
                      <button className={`sch-slot ${p.status}`} onClick={()=>onSelect(p)}>
                        {p.lastName} {p.firstName[0]}.
                      </button>
                    ) : (
                      <div className="sch-empty" onClick={()=>onAdd(selDept, doc, selDate, time)}>+ запись</div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

// ─── ANALYTICS PAGE ───────────────────────────────────────────────────────────

function AnalyticsPage({ patients }) {
  const today = new Date();

  // Нагрузка по дням (последние 7 дней)
  const days = Array.from({length:7}, (_,i) => {
    const d = new Date(today); d.setDate(d.getDate() - (6-i));
    const str = d.toISOString().split("T")[0];
    const cnt = patients.filter(p=>p.appointmentDate===str).length;
    const lbl = d.toLocaleDateString("ru-RU",{weekday:"short"});
    return { str, cnt, lbl };
  });
  const maxDay = Math.max(...days.map(d=>d.cnt), 1);

  // По отделениям
  const deptStats = DEPARTMENTS.map(d => ({
    name: d,
    cnt: patients.filter(p=>p.department===d).length,
  })).sort((a,b)=>b.cnt-a.cnt).filter(d=>d.cnt>0);
  const totalPts = patients.length || 1;

  const DEPT_COLORS = ["#3b82f6","#8b5cf6","#f59e0b","#22c55e","#ef4444","#14b8a6","#f97316","#ec4899"];

  // По статусам
  const statusStats = Object.entries(STATUS_CFG).map(([k,v]) => ({
    key:k, label:v.label, color:v.dot,
    cnt: patients.filter(p=>p.status===k).length,
  })).filter(s=>s.cnt>0);

  return (
    <>
      <div className="analytics-grid">
        {/* Bar chart — нагрузка по дням */}
        <div className="chart-area">
          <div className="chart-title">Нагрузка за последние 7 дней</div>
          <div className="bar-chart">
            {days.map((d,i) => (
              <div key={d.str} className="bar-wrap">
                <div className="bar-val">{d.cnt||""}</div>
                <div className="bar-fill"
                  style={{ height: `${Math.round((d.cnt/maxDay)*120)}px`, background: d.str===todayStr()?"var(--brand)":"#bfdbfe" }}
                  title={`${d.lbl}: ${d.cnt} пациентов`}
                />
                <span className="bar-lbl">{d.lbl}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Статусы */}
        <div className="chart-area">
          <div className="chart-title">По статусам</div>
          <div className="pie-wrap">
            {statusStats.map(s => (
              <div key={s.key} className="pie-item">
                <span className="pie-dot" style={{background:s.color}}/>
                <span className="pie-name">{s.label}</span>
                <span className="pie-cnt">{s.cnt}</span>
                <span className="pie-pct">{Math.round(s.cnt/totalPts*100)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* По отделениям */}
      <div className="chart-area">
        <div className="chart-title">Нагрузка по отделениям</div>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {deptStats.map((d,i) => (
            <div key={d.name} style={{display:"flex",alignItems:"center",gap:12}}>
              <span style={{fontSize:12.5,color:"var(--ink3)",width:140,flexShrink:0}}>{d.name}</span>
              <div style={{flex:1,background:"#f1f5f9",borderRadius:6,overflow:"hidden",height:22}}>
                <div style={{
                  height:"100%", borderRadius:6,
                  background: DEPT_COLORS[i%DEPT_COLORS.length],
                  width:`${Math.round(d.cnt/totalPts*100)}%`,
                  display:"flex",alignItems:"center",paddingLeft:8,
                  transition:"width .4s ease",
                }}>
                  {d.cnt > 0 && <span style={{fontSize:11,fontWeight:700,color:"#fff",fontFamily:"var(--mono)"}}>{d.cnt}</span>}
                </div>
              </div>
              <span style={{fontSize:12,fontFamily:"var(--mono)",color:"var(--muted)",width:36,textAlign:"right"}}>{Math.round(d.cnt/totalPts*100)}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Топ жалоб */}
      <div className="chart-area">
        <div className="chart-title">Частые жалобы</div>
        <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
          {["Боль в груди","Температура","Головная боль","Плановый осмотр","Боли в спине","Слабость","Кашель","Давление","Боль в животе"].map((c,i) => (
            <span key={c} style={{
              padding:"5px 13px",borderRadius:20,fontSize:12.5,fontWeight:500,
              background:["#eff6ff","#f0fdf4","#fef3c7","#ede9fe","#fff7ed","#fce7f3","#ecfdf5","#eff6ff","#fef9c3"][i%9],
              color:["#2563eb","#16a34a","#d97706","#7c3aed","#ea580c","#db2777","#059669","#3b82f6","#ca8a04"][i%9],
            }}>
              {c}
            </span>
          ))}
        </div>
      </div>
    </>
  );
}

// ─── REGISTER PAGE ────────────────────────────────────────────────────────────

const EMPTY_FORM = {
  lastName:"",firstName:"",middleName:"",birthDate:"",gender:"",
  phone:"",email:"",address:"",iin:"",
  department:"",doctor:"",appointmentDate:"",appointmentTime:"",complaint:"",
};

function RegisterPage({ patients, onRegister, initForm, onInitUsed }) {
  const [step, setStep]       = useState(initForm ? 2 : 1);
  const [form, setForm]       = useState(initForm ? { ...EMPTY_FORM, ...initForm } : EMPTY_FORM);
  const [errors, setErrors]   = useState({});
  const [done, setDone]       = useState(null);
  const [dupWarn, setDupWarn] = useState(false);

  useEffect(() => { if (initForm && onInitUsed) onInitUsed(); }, []);

  const change = e => {
    const { name, value } = e.target;
    if (name==="department") setForm(p=>({...p, department:value, doctor:""}));
    else setForm(p=>({...p, [name]:value}));
    if (errors[name]) setErrors(p=>({...p,[name]:""}));
    if (name==="iin" && value.length>=14) setDupWarn(patients.some(p=>p.iin===value));
  };

  const validate = s => {
    const e={};
    if(s===1){
      if(!form.lastName.trim())  e.lastName="Введите фамилию";
      if(!form.firstName.trim()) e.firstName="Введите имя";
      if(!form.birthDate)        e.birthDate="Выберите дату";
      if(!form.gender)           e.gender="Выберите пол";
      if(!form.phone.trim())     e.phone="Введите телефон";
      if(!form.iin.trim())       e.iin="Введите ИИН";
      else if(form.iin.length<14) e.iin="ИИН — 14 цифр";
    }
    if(s===2){
      if(!form.department)      e.department="Выберите отделение";
      if(!form.doctor)          e.doctor="Выберите врача";
      if(!form.appointmentDate) e.appointmentDate="Выберите дату";
      if(!form.appointmentTime) e.appointmentTime="Выберите время";
    }
    setErrors(e);
    return Object.keys(e).length===0;
  };

  const next   = () => { if(validate(step)) setStep(s=>s+1); };
  const prev   = () => setStep(s=>s-1);
  const submit = () => {
    if(!validate(2)) return;
    const queueNum = patients.filter(p=>p.department===form.department && p.appointmentDate===form.appointmentDate).length+1;
    const newPt = {...form, id:genId(), status:"confirmed", queueNum};
    onRegister(newPt);
    setDone(newPt);
  };
  const reset  = () => { setStep(1); setForm(EMPTY_FORM); setDone(null); setDupWarn(false); setErrors({}); };

  const STEPS = ["Личные данные","Запись на приём","Подтверждение"];

  if (done) return (
    <div className="succ-outer">
      <div className="succ-card">
        <div className="succ-icon"><CheckCircle size={34} color="#16a34a"/></div>
        <h2 className="succ-h">Пациент зарегистрирован!</h2>
        <p className="succ-p">Запись успешно создана. Талон с номером очереди выдан пациенту.</p>
        <div className="ticket">
          <span className="ticket-num">№{done.queueNum}</span>
          <div className="ticket-row"><span className="ticket-lbl">Пациент</span><span className="ticket-val">{done.lastName} {done.firstName}</span></div>
          <div className="ticket-row"><span className="ticket-lbl">Отделение</span><span className="ticket-val">{done.department}</span></div>
          <div className="ticket-row"><span className="ticket-lbl">Врач</span><span className="ticket-val">{done.doctor}</span></div>
          <div className="ticket-row"><span className="ticket-lbl">Приём</span><span className="ticket-val">{fmtDate(done.appointmentDate)} в {done.appointmentTime}</span></div>
        </div>
        <div style={{display:"flex",gap:10,justifyContent:"center"}}>
          <button className="btn btn-outline" onClick={()=>window.print()}><Printer size={13}/> Печать</button>
          <button className="btn btn-primary" style={{margin:0}} onClick={reset}><Plus size={13}/> Новая запись</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="reg-outer">
      <div className="reg-layout">
      <div className="reg-wrap">
        <div className="reg-card">
          <div className="reg-hd">
            <div className="reg-hdtit">Регистрация пациента</div>
            <div className="reg-hdsub">Городская поликлиника №1 · Шаг {step} из 3</div>
          </div>
          <div className="reg-progress">
            <div className="steps">
              {[1,2,3].map(s => (
                <div key={s} style={{display:"flex",alignItems:"center",flex:s<3?1:undefined}}>
                  <div className="step-item">
                    <div className={`step-circ ${s<step?"done":s===step?"curr":"next"}`}>
                      {s<step ? <Check size={13}/> : s}
                    </div>
                    <div className={`step-lbl ${s===step?"curr":""}`}>{STEPS[s-1]}</div>
                  </div>
                  {s<3 && <div className={`step-line ${s<step?"done":"next"}`}/>}
                </div>
              ))}
            </div>
          </div>

          <div className="reg-body">
            {step===1 && (
              <>
                <div className="reg-stit"><User size={19} color="var(--brand)"/>Личные данные</div>
                {dupWarn && (
                  <div className="dup-warn">
                    <AlertTriangle size={17} color="#d97706" style={{flexShrink:0,marginTop:2}}/>
                    <span className="dup-txt">Пациент с таким ИИН уже зарегистрирован в системе.</span>
                  </div>
                )}
                <div className="fgrid3">
                  {[["lastName","Фамилия","Иванов",true],["firstName","Имя","Иван",true],["middleName","Отчество","Иванович",false]].map(([n,l,ph,r])=>(
                    <div className="fgroup" key={n}>
                      <label className="flbl">{l}{r&&<span className="req"> *</span>}</label>
                      <input type="text" name={n} value={form[n]} onChange={change} placeholder={ph} className={`finp${errors[n]?" err":""}`}/>
                      {errors[n]&&<p className="ferr">{errors[n]}</p>}
                    </div>
                  ))}
                </div>
                <div className="fgrid2">
                  <div className="fgroup">
                    <label className="flbl">Дата рождения<span className="req"> *</span></label>
                    <input type="date" name="birthDate" value={form.birthDate} onChange={change} className={`finp${errors.birthDate?" err":""}`}/>
                    {errors.birthDate&&<p className="ferr">{errors.birthDate}</p>}
                  </div>
                  <div className="fgroup">
                    <label className="flbl">Пол<span className="req"> *</span></label>
                    <select name="gender" value={form.gender} onChange={change} className={`fsel${errors.gender?" err":""}`}>
                      <option value="">— выберите —</option>
                      <option value="male">Мужской</option>
                      <option value="female">Женский</option>
                    </select>
                    {errors.gender&&<p className="ferr">{errors.gender}</p>}
                  </div>
                </div>
                <div className="fgrid2">
                  <div className="fgroup">
                    <label className="flbl">Телефон<span className="req"> *</span></label>
                    <input type="tel" name="phone" value={form.phone} onChange={change} placeholder="+996 700 000 000" className={`finp${errors.phone?" err":""}`}/>
                    {errors.phone&&<p className="ferr">{errors.phone}</p>}
                  </div>
                  <div className="fgroup">
                    <label className="flbl">Email</label>
                    <input type="email" name="email" value={form.email} onChange={change} placeholder="example@mail.com" className="finp"/>
                  </div>
                </div>
                <div className="fgrid2">
                  <div className="fgroup">
                    <label className="flbl">ИИН<span className="req"> *</span></label>
                    <input type="text" name="iin" value={form.iin} onChange={change} maxLength={14} placeholder="14 цифр" className={`finp${errors.iin?" err":""}`}/>
                    {errors.iin&&<p className="ferr">{errors.iin}</p>}
                  </div>
                  <div className="fgroup">
                    <label className="flbl">Адрес</label>
                    <input type="text" name="address" value={form.address} onChange={change} placeholder="Улица, дом, кв." className="finp"/>
                  </div>
                </div>
              </>
            )}

            {step===2 && (
              <>
                <div className="reg-stit"><Calendar size={19} color="var(--brand)"/>Запись на приём</div>
                <div className="fgrid2">
                  <div className="fgroup">
                    <label className="flbl">Отделение<span className="req"> *</span></label>
                    <select name="department" value={form.department} onChange={change} className={`fsel${errors.department?" err":""}`}>
                      <option value="">— выберите —</option>
                      {DEPARTMENTS.map(d=><option key={d}>{d}</option>)}
                    </select>
                    {errors.department&&<p className="ferr">{errors.department}</p>}
                  </div>
                  <div className="fgroup">
                    <label className="flbl">Врач<span className="req"> *</span></label>
                    <select name="doctor" value={form.doctor} onChange={change} disabled={!form.department} className={`fsel${errors.doctor?" err":""}`}>
                      <option value="">— выберите врача —</option>
                      {(DOCTORS_BY_DEPT[form.department]||[]).map(d=><option key={d}>{d}</option>)}
                    </select>
                    {errors.doctor&&<p className="ferr">{errors.doctor}</p>}
                  </div>
                </div>
                <div className="fgrid2">
                  <div className="fgroup">
                    <label className="flbl">Дата приёма<span className="req"> *</span></label>
                    <input type="date" name="appointmentDate" value={form.appointmentDate} onChange={change} min={todayStr()} className={`finp${errors.appointmentDate?" err":""}`}/>
                    {errors.appointmentDate&&<p className="ferr">{errors.appointmentDate}</p>}
                  </div>
                  <div className="fgroup">
                    <label className="flbl">Время<span className="req"> *</span></label>
                    <select name="appointmentTime" value={form.appointmentTime} onChange={change} className={`fsel${errors.appointmentTime?" err":""}`}>
                      <option value="">— выберите —</option>
                      {TIME_SLOTS.map(t=><option key={t}>{t}</option>)}
                    </select>
                    {errors.appointmentTime&&<p className="ferr">{errors.appointmentTime}</p>}
                  </div>
                </div>
                <div className="fgroup">
                  <label className="flbl">Жалобы / причина обращения</label>
                  <textarea name="complaint" value={form.complaint} onChange={change} rows={4} placeholder="Опишите симптомы…" className="ftxt"/>
                </div>
              </>
            )}

            {step===3 && (
              <>
                <div className="reg-stit"><FileText size={19} color="var(--brand)"/>Проверьте данные</div>
                <div className="confirm-box">
                  <div className="confirm-sec">
                    <div className="confirm-title">Личные данные</div>
                    <div className="confirm-grid">
                      <span className="cl">ФИО</span><span className="cv">{form.lastName} {form.firstName} {form.middleName}</span>
                      <span className="cl">Дата рождения</span><span className="cv">{fmtDate(form.birthDate)} ({calcAge(form.birthDate)})</span>
                      <span className="cl">Пол</span><span className="cv">{form.gender==="male"?"Мужской":"Женский"}</span>
                      <span className="cl">Телефон</span><span className="cv">{form.phone}</span>
                      <span className="cl">ИИН</span><span className="cv" style={{fontFamily:"var(--mono)"}}>{form.iin}</span>
                      {form.email&&<><span className="cl">Email</span><span className="cv">{form.email}</span></>}
                    </div>
                  </div>
                  <div className="confirm-sec">
                    <div className="confirm-title">Запись на приём</div>
                    <div className="confirm-grid">
                      <span className="cl">Отделение</span><span className="cv">{form.department}</span>
                      <span className="cl">Врач</span><span className="cv">{form.doctor}</span>
                      <span className="cl">Дата</span><span className="cv">{fmtDate(form.appointmentDate)}</span>
                      <span className="cl">Время</span><span className="cv" style={{fontFamily:"var(--mono)"}}>{form.appointmentTime}</span>
                    </div>
                  </div>
                </div>
                <div className="alert-info">
                  <AlertCircle size={16} color="#2563eb" style={{flexShrink:0,marginTop:2}}/>
                  <span className="alert-txt">После подтверждения пациенту будет выдан талон с номером очереди и временем приёма.</span>
                </div>
              </>
            )}

            <div className="btnrow">
              {step>1 ? <button className="btn btn-ghost" onClick={prev}>← Назад</button> : <div/>}
              {step<3
                ? <button className="btn btn-primary" onClick={next}>Далее <ArrowRight size={13}/></button>
                : <button className="btn btn-success" onClick={submit}><CheckCircle size={14}/> Подтвердить</button>
              }
            </div>
          </div>
        </div>
      </div>

      <div className="reg-plist">
        <div className="reg-plist-hd">
          <ClipboardList size={15} color="var(--brand)" /> Зарегистрированные пациенты
          <span className="reg-plist-cnt">{patients.length}</span>
        </div>
        <div className="reg-plist-body">
          {patients.length === 0 ? (
            <div className="reg-plist-empty">Нет записей</div>
          ) : (
            patients.map(p => (
              <div key={p.id} className="reg-plist-item">
                <div className="reg-plist-av">{p.lastName[0]}{p.firstName[0]}</div>
                <div className="reg-plist-info">
                  <div className="reg-plist-name">{p.lastName} {p.firstName} {p.middleName}</div>
                  <div className="reg-plist-meta">{p.department} · {fmtDate(p.appointmentDate)} {p.appointmentTime}</div>
                </div>
                <StatusBadge status={p.status}/>
              </div>
            ))
          )}
        </div>
      </div>

      </div>
    </div>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────

export default function App() {
  const [page, go]           = useHashRouter();
  const [patients, setPatients] = usePersistedState("clinic_patients", MOCK_PATIENTS);
  const [notifs, setNotifs]  = useState(INIT_NOTIFS);
  const [showNotif, setShowNotif]   = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchSel, setSearchSel]   = useState(null);

  const unread = notifs.filter(n=>!n.read).length;

  // Cmd+K / Ctrl+K
  useEffect(() => {
    const fn = e => { if ((e.metaKey||e.ctrlKey) && e.key==="k") { e.preventDefault(); setShowSearch(v=>!v); } };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, []);

  // Close notif panel on outside click
  const notifRef = useRef(null);
  useEffect(() => {
    if (!showNotif) return;
    const fn = e => { if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotif(false); };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, [showNotif]);

  const [regInit, setRegInit] = useState(null);

  const handleRegister    = p  => { setPatients(prev=>[p,...prev]); };
  const handleDelete      = id => { if(window.confirm("Удалить запись?")) setPatients(prev=>prev.filter(p=>p.id!==id)); };
  const handleStatusChange= (id,s) => setPatients(prev=>prev.map(p=>p.id===id?{...p,status:s}:p));
  const handleUpdate      = upd => setPatients(prev=>prev.map(p=>p.id===upd.id?upd:p));
  const markAllRead       = () => setNotifs(prev=>prev.map(n=>({...n,read:true})));
  const handleScheduleAdd = (dept, doc, date, time) => { setRegInit({ department: dept, doctor: doc, appointmentDate: date, appointmentTime: time }); go("register"); };

  const sharedProps = { patients, onDelete:handleDelete, onStatusChange:handleStatusChange, onUpdate:handleUpdate };

  return (
    <>
      <style>{CSS}</style>
      <div className="layout">
        <Sidebar page={page} go={go} patients={patients}/>
        <div className="main">
          <div ref={notifRef} style={{position:"relative"}}>
            <Topbar
              page={page} go={go} patients={patients}
              notifCount={unread}
              onNotif={()=>setShowNotif(v=>!v)}
              onSearch={()=>setShowSearch(true)}
            />
            {showNotif && <NotifPanel notifs={notifs} onMarkAll={markAllRead} onClose={()=>setShowNotif(false)}/>}
          </div>

          {page==="dashboard" && (
            <div className="page"><DashboardPage {...sharedProps} go={go}/></div>
          )}
          {page==="patients" && (
            <div className="page"><PatientsPage {...sharedProps} go={go}/></div>
          )}
          {page==="queue" && (
            <div className="page"><QueuePage patients={patients} onStatusChange={handleStatusChange}/></div>
          )}
          {page==="schedule" && (
            <div className="page">
              <SchedulePage patients={patients} onSelect={p=>setSearchSel(p)} onAdd={handleScheduleAdd}/>
            </div>
          )}
          {page==="analytics" && (
            <div className="page"><AnalyticsPage patients={patients}/></div>
          )}
          {page==="register" && (
            <RegisterPage patients={patients} onRegister={handleRegister} initForm={regInit} onInitUsed={()=>setRegInit(null)}/>
          )}
        </div>
      </div>

      {showSearch && (
        <GlobalSearch
          patients={patients}
          onSelect={p=>setSearchSel(p)}
          onClose={()=>setShowSearch(false)}
        />
      )}
      {searchSel && (
        <PatientModal
          patient={patients.find(p=>p.id===searchSel.id)||searchSel}
          onClose={()=>setSearchSel(null)}
          onStatusChange={handleStatusChange}
          onUpdate={p=>{handleUpdate(p);setSearchSel(p);}}
        />
      )}
    </>
  );
}
