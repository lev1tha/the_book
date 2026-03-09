import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  Bell,
  Search,
  Eye,
  Trash2,
  TrendingUp,
  Clock,
  CheckCircle,
  Activity,
  User,
  Calendar,
  FileText,
  AlertCircle,
  X,
} from "lucide-react";

// ─── DATA ────────────────────────────────────────────────────────────────────

const MOCK_PATIENTS = [
  {
    id: 1,
    lastName: "Иванов",
    firstName: "Иван",
    middleName: "Иванович",
    birthDate: "1985-03-12",
    gender: "male",
    phone: "+996 700 123 456",
    email: "ivanov@mail.com",
    iin: "85031200001234",
    address: "ул. Ленина 10, кв. 5",
    department: "Кардиология",
    doctor: "Козлова Е.В.",
    appointmentDate: "2026-03-12",
    appointmentTime: "09:00",
    complaint: "Боли в груди",
    status: "confirmed",
  },
  {
    id: 2,
    lastName: "Петрова",
    firstName: "Анна",
    middleName: "Сергеевна",
    birthDate: "1992-07-24",
    gender: "female",
    phone: "+996 555 234 567",
    email: "petrova@mail.com",
    iin: "92072400002345",
    address: "пр. Манаса 45",
    department: "Терапия",
    doctor: "Иванов И.И.",
    appointmentDate: "2026-03-12",
    appointmentTime: "10:30",
    complaint: "Высокая температура, кашель",
    status: "waiting",
  },
  {
    id: 3,
    lastName: "Сидоров",
    firstName: "Пётр",
    middleName: "Кириллович",
    birthDate: "1978-11-05",
    gender: "male",
    phone: "+996 700 345 678",
    email: "",
    iin: "78110500003456",
    address: "ул. Токтогула 22",
    department: "Неврология",
    doctor: "Новикова М.П.",
    appointmentDate: "2026-03-13",
    appointmentTime: "11:00",
    complaint: "Головные боли",
    status: "confirmed",
  },
  {
    id: 4,
    lastName: "Козлова",
    firstName: "Мария",
    middleName: "Владимировна",
    birthDate: "2001-02-18",
    gender: "female",
    phone: "+996 312 456 789",
    email: "kozlova@mail.com",
    iin: "01021800004567",
    address: "ул. Байтик Баатыра 8",
    department: "Педиатрия",
    doctor: "Смирнова О.Л.",
    appointmentDate: "2026-03-14",
    appointmentTime: "08:30",
    complaint: "Плановый осмотр",
    status: "completed",
  },
  {
    id: 5,
    lastName: "Абдиев",
    firstName: "Руслан",
    middleName: "Маратович",
    birthDate: "1995-09-30",
    gender: "male",
    phone: "+996 700 567 890",
    email: "abdiev@mail.com",
    iin: "95093000005678",
    address: "мкр. Асанбай 12-45",
    department: "Хирургия",
    doctor: "Волков А.Н.",
    appointmentDate: "2026-03-15",
    appointmentTime: "14:00",
    complaint: "Боли в животе",
    status: "waiting",
  },
  {
    id: 6,
    lastName: "Мамытова",
    firstName: "Айгуль",
    middleName: "Бекова",
    birthDate: "1988-06-15",
    gender: "female",
    phone: "+996 550 678 901",
    email: "mamytova@mail.com",
    iin: "88061500006789",
    address: "ул. Фрунзе 33",
    department: "Гинекология",
    doctor: "Павлова Н.С.",
    appointmentDate: "2026-03-11",
    appointmentTime: "15:30",
    complaint: "Плановый осмотр",
    status: "completed",
  },
  {
    id: 7,
    lastName: "Орозов",
    firstName: "Алмаз",
    middleName: "Дооронбекович",
    birthDate: "1970-04-22",
    gender: "male",
    phone: "+996 700 789 012",
    email: "",
    iin: "70042200007890",
    address: "с. Беловодское",
    department: "ЛОР",
    doctor: "Титов Е.А.",
    appointmentDate: "2026-03-16",
    appointmentTime: "09:30",
    complaint: "Боль в горле",
    status: "confirmed",
  },
];

const DEPARTMENTS = [
  "Терапия",
  "Кардиология",
  "Неврология",
  "Педиатрия",
  "Хирургия",
  "Гинекология",
  "Офтальмология",
  "ЛОР",
];
const DOCTORS_BY_DEPT = {
  Терапия: ["Иванов И.И.", "Петрова А.С.", "Сидоров П.К."],
  Кардиология: ["Козлова Е.В.", "Морозов С.А."],
  Неврология: ["Новикова М.П.", "Белов Д.Н."],
  Педиатрия: ["Смирнова О.Л.", "Федоров В.И."],
  Хирургия: ["Волков А.Н.", "Соколов М.М."],
  Гинекология: ["Павлова Н.С."],
  Офтальмология: ["Григорьев К.Р."],
  ЛОР: ["Титов Е.А.", "Кузнецова Л.В."],
};
const TIME_SLOTS = [
  "08:00",
  "08:30",
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
];
const STATUS_CFG = {
  confirmed: {
    label: "Подтверждён",
    color: "#059669",
    bg: "#d1fae5",
    dot: "#10b981",
  },
  waiting: {
    label: "Ожидает",
    color: "#d97706",
    bg: "#fef3c7",
    dot: "#f59e0b",
  },
  completed: {
    label: "Завершён",
    color: "#6b7280",
    bg: "#f3f4f6",
    dot: "#9ca3af",
  },
};

// ─── HASH ROUTER ─────────────────────────────────────────────────────────────

const ROUTES = {
  "#/dashboard": "dashboard",
  "#/patients": "patients",
  "#/register": "register",
};

function getPage() {
  return ROUTES[window.location.hash] ?? "dashboard";
}

function navigate(page) {
  const hash =
    Object.keys(ROUTES).find((k) => ROUTES[k] === page) ?? "#/dashboard";
  window.location.hash = hash;
}

function useHashRouter() {
  const [page, setPage] = useState(getPage);
  useEffect(() => {
    const onHash = () => setPage(getPage());
    window.addEventListener("hashchange", onHash);
    if (!window.location.hash) window.location.hash = "#/dashboard";
    return () => window.removeEventListener("hashchange", onHash);
  }, []);
  const go = (p) => navigate(p);
  return [page, go];
}

// ─── STYLES ──────────────────────────────────────────────────────────────────

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;600&family=Onest:wght@400;500;600;700;800&display=swap');
  *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
  :root {
    --blue:#2563eb; --blue-d:#1d4ed8; --green:#16a34a;
    --s50:#f8fafc; --s100:#f1f5f9; --s200:#e2e8f0;
    --s400:#94a3b8; --s500:#64748b; --s600:#475569;
    --s700:#334155; --s800:#1e293b; --s900:#0f172a;
    --font:'Onest',sans-serif; --mono:'IBM Plex Mono',monospace;
  }

  /* LAYOUT */
  .app  { display:flex; height:100vh; overflow:hidden; font-family:var(--font); background:var(--s50); }
  .main { flex:1; display:flex; flex-direction:column; overflow:hidden; min-width:0; }
  .page { flex:1; overflow-y:auto; padding:24px; display:flex; flex-direction:column; gap:20px; }

  /* SIDEBAR */
  .sb      { width:230px; min-width:230px; background:var(--s900); display:flex; flex-direction:column; }
  .sb-logo { padding:20px; border-bottom:1px solid #ffffff12; display:flex; align-items:center; gap:10px; }
  .sb-icon { width:36px; height:36px; border-radius:8px; background:var(--blue); display:flex; align-items:center; justify-content:center; color:#fff; font-weight:800; font-size:14px; flex-shrink:0; font-family:var(--mono); }
  .sb-name { color:#fff; font-weight:700; font-size:13px; }
  .sb-sub  { color:var(--s400); font-size:11px; font-family:var(--mono); }
  .sb-nav  { flex:1; padding:12px 10px; display:flex; flex-direction:column; gap:2px; }
  .sb-lbl  { color:var(--s500); font-size:10px; font-weight:600; letter-spacing:.08em; text-transform:uppercase; padding:8px 10px 4px; font-family:var(--mono); }
  .sb-btn  { display:flex; align-items:center; gap:10px; padding:9px 12px; border-radius:8px; color:var(--s400); font-size:13.5px; font-weight:500; cursor:pointer; border:none; background:none; width:100%; transition:all .15s; }
  .sb-btn:hover  { background:#ffffff0d; color:#fff; }
  .sb-btn.active { background:var(--blue); color:#fff; }

  /* URL badge in sidebar */
  .sb-url  { font-size:10px; font-family:var(--mono); color:var(--s600); padding:2px 6px; background:#ffffff08; border-radius:4px; margin-left:auto; flex-shrink:0; }
  .sb-btn.active .sb-url { color:#93c5fd; background:rgba(255,255,255,.12); }

  .sb-foot  { padding:12px 10px; border-top:1px solid #ffffff12; }
  .sb-user  { display:flex; align-items:center; gap:10px; padding:8px 10px; }
  .sb-av    { width:32px; height:32px; border-radius:50%; background:linear-gradient(135deg,#6366f1,#2563eb); display:flex; align-items:center; justify-content:center; color:#fff; font-size:12px; font-weight:700; }
  .sb-uname { color:#fff; font-size:12.5px; font-weight:600; }
  .sb-urole { color:var(--s400); font-size:11px; font-family:var(--mono); }

  /* TOPBAR */
  .topbar   { height:56px; background:#fff; border-bottom:1px solid var(--s200); display:flex; align-items:center; justify-content:space-between; padding:0 24px; flex-shrink:0; }
  .tb-left  { display:flex; align-items:center; gap:12px; }
  .tb-title { font-size:17px; font-weight:700; color:var(--s800); }
  .tb-hash  { font-size:12px; font-family:var(--mono); color:var(--s400); background:var(--s100); padding:3px 8px; border-radius:6px; }
  .tb-right { display:flex; align-items:center; gap:10px; }
  .tb-icon  { width:36px; height:36px; border-radius:8px; border:1px solid var(--s200); background:#fff; display:flex; align-items:center; justify-content:center; cursor:pointer; color:var(--s500); position:relative; transition:all .15s; }
  .tb-icon:hover { background:var(--s50); }
  .tb-dot   { position:absolute; top:8px; right:8px; width:7px; height:7px; border-radius:50%; background:#ef4444; border:1.5px solid #fff; }
  .tb-btn   { display:flex; align-items:center; gap:6px; background:var(--blue); color:#fff; border:none; border-radius:8px; padding:0 14px; height:36px; font-size:13px; font-weight:600; cursor:pointer; font-family:var(--font); transition:background .15s; }
  .tb-btn:hover { background:var(--blue-d); }

  /* STATS */
  .stats    { display:grid; grid-template-columns:repeat(4,1fr); gap:16px; }
  .stat     { background:#fff; border-radius:12px; padding:18px 20px; border:1px solid var(--s200); display:flex; align-items:flex-start; gap:14px; transition:box-shadow .2s; }
  .stat:hover { box-shadow:0 4px 20px rgba(0,0,0,.07); }
  .stat-ic  { width:42px; height:42px; border-radius:10px; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
  .stat-val { font-size:26px; font-weight:800; color:var(--s800); font-family:var(--mono); line-height:1; }
  .stat-lbl { font-size:12.5px; color:var(--s500); margin-top:4px; font-weight:500; }
  .stat-chg { font-size:11.5px; font-weight:600; margin-top:6px; display:flex; align-items:center; gap:3px; font-family:var(--mono); color:#059669; }

  /* TABLE */
  .tcard  { background:#fff; border-radius:12px; border:1px solid var(--s200); overflow:hidden; }
  .thead  { padding:16px 20px; border-bottom:1px solid var(--s100); display:flex; align-items:center; justify-content:space-between; gap:12px; flex-wrap:wrap; }
  .thead-title { font-size:15px; font-weight:700; color:var(--s800); }
  .tcontrols   { display:flex; align-items:center; gap:8px; flex-wrap:wrap; }
  .srch-wrap { position:relative; }
  .srch-ico  { position:absolute; left:10px; top:50%; transform:translateY(-50%); color:var(--s400); pointer-events:none; }
  .srch-inp  { padding:7px 12px 7px 34px; border:1px solid var(--s200); border-radius:8px; font-size:13px; color:var(--s700); outline:none; width:220px; font-family:var(--font); background:var(--s50); transition:all .15s; }
  .srch-inp:focus { border-color:var(--blue); background:#fff; box-shadow:0 0 0 3px #2563eb18; }
  .flt-sel { padding:7px 10px; border:1px solid var(--s200); border-radius:8px; font-size:13px; color:var(--s600); background:#fff; outline:none; cursor:pointer; font-family:var(--font); }
  .tscroll { overflow-x:auto; }
  table   { width:100%; border-collapse:collapse; }
  thead   { background:var(--s50); }
  th { padding:10px 16px; text-align:left; font-size:11.5px; font-weight:600; color:var(--s500); text-transform:uppercase; letter-spacing:.05em; border-bottom:1px solid var(--s200); white-space:nowrap; font-family:var(--mono); }
  td { padding:13px 16px; font-size:13.5px; color:var(--s700); border-bottom:1px solid var(--s100); vertical-align:middle; }
  tr:last-child td { border-bottom:none; }
  tr:hover td { background:var(--s50); }
  .pcell { display:flex; align-items:center; gap:10px; }
  .pav   { width:34px; height:34px; border-radius:50%; flex-shrink:0; display:flex; align-items:center; justify-content:center; font-weight:700; font-size:13px; }
  .av-m  { background:#dbeafe; color:#2563eb; }
  .av-f  { background:#fce7f3; color:#db2777; }
  .pname { font-weight:600; color:var(--s800); }
  .pid   { font-size:11px; color:var(--s400); font-family:var(--mono); }
  .badge { display:inline-flex; align-items:center; gap:5px; padding:3px 9px; border-radius:20px; font-size:12px; font-weight:600; }
  .bdot  { width:6px; height:6px; border-radius:50%; }
  .dtag  { background:#eff6ff; color:#2563eb; padding:3px 9px; border-radius:20px; font-size:12px; font-weight:500; }
  .acts  { display:flex; align-items:center; gap:4px; }
  .abt   { width:30px; height:30px; border-radius:7px; border:1px solid var(--s200); background:#fff; display:flex; align-items:center; justify-content:center; cursor:pointer; color:var(--s400); transition:all .15s; }
  .abt:hover       { background:var(--s50); color:var(--s700); }
  .abt.del:hover   { background:#fef2f2; color:#dc2626; border-color:#fecaca; }
  .abt.view:hover  { background:#eff6ff; color:var(--blue); border-color:#bfdbfe; }
  .tfoot { padding:12px 20px; border-top:1px solid var(--s100); display:flex; align-items:center; justify-content:space-between; }
  .tcnt  { font-size:12.5px; color:var(--s500); font-family:var(--mono); }

  /* MODAL */
  .overlay { position:fixed; inset:0; background:rgba(15,23,42,.6); z-index:100; display:flex; align-items:center; justify-content:center; padding:20px; backdrop-filter:blur(4px); }
  .modal   { background:#fff; border-radius:16px; width:100%; max-width:560px; box-shadow:0 25px 60px rgba(0,0,0,.25); overflow:hidden; max-height:90vh; display:flex; flex-direction:column; }
  .mhd    { padding:20px 24px; display:flex; align-items:center; justify-content:space-between; background:linear-gradient(to right,var(--blue),#4f46e5); color:#fff; flex-shrink:0; }
  .mtitle { font-size:17px; font-weight:700; }
  .msub   { font-size:12px; opacity:.75; margin-top:2px; font-family:var(--mono); }
  .mclose { background:none; border:none; color:#fff; cursor:pointer; opacity:.7; padding:4px; border-radius:6px; transition:opacity .15s; }
  .mclose:hover { opacity:1; background:rgba(255,255,255,.15); }
  .mbody  { padding:24px; overflow-y:auto; flex:1; }
  .msec   { margin-bottom:20px; }
  .mslbl  { font-size:11px; font-weight:600; text-transform:uppercase; letter-spacing:.07em; color:var(--s400); margin-bottom:12px; font-family:var(--mono); display:flex; align-items:center; gap:6px; }
  .mslbl::after { content:''; flex:1; height:1px; background:var(--s100); }
  .mgrid  { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
  .mflbl  { font-size:11.5px; color:var(--s400); margin-bottom:2px; }
  .mfval  { font-size:14px; color:var(--s800); font-weight:600; }
  .mffull { grid-column:span 2; }
  .mcmpl  { background:var(--s50); border-radius:8px; padding:10px 12px; font-size:13.5px; color:var(--s700); line-height:1.5; }

  /* REGISTER */
  .reg-wrap  { flex:1; overflow-y:auto; padding:24px; display:flex; align-items:flex-start; justify-content:center; }
  .reg-card  { background:#fff; border-radius:16px; border:1px solid var(--s200); overflow:hidden; width:100%; max-width:860px; }
  .reg-hd    { background:linear-gradient(to right,#2563eb,#4f46e5); color:#fff; padding:24px 28px; }
  .reg-hdtit { font-size:22px; font-weight:800; }
  .reg-hdsub { color:#bfdbfe; font-size:13px; margin-top:4px; font-family:var(--mono); }
  .reg-prog  { background:var(--s50); padding:16px 28px; border-bottom:1px solid var(--s100); }
  .reg-steps { display:flex; align-items:center; max-width:440px; }
  .reg-step  { display:flex; flex-direction:column; align-items:center; }
  .rsc  { width:36px; height:36px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:700; font-size:14px; border:2px solid; font-family:var(--mono); }
  .rsc.on  { background:var(--blue); color:#fff; border-color:var(--blue); }
  .rsc.off { background:#fff; color:var(--s400); border-color:var(--s200); }
  .rslbl { font-size:11px; margin-top:4px; font-weight:500; color:var(--s500); }
  .rline { flex:1; height:3px; margin:0 8px 16px; }
  .rline.on  { background:var(--blue); }
  .rline.off { background:var(--s200); }
  .reg-body  { padding:28px; }
  .reg-stit  { font-size:18px; font-weight:700; color:var(--s800); display:flex; align-items:center; gap:8px; margin-bottom:20px; }

  .g3 { display:grid; grid-template-columns:repeat(3,1fr); gap:14px; margin-bottom:14px; }
  .g2 { display:grid; grid-template-columns:repeat(2,1fr); gap:14px; margin-bottom:14px; }
  .g1 { display:grid; grid-template-columns:1fr; gap:14px; margin-bottom:14px; }
  .fg { display:flex; flex-direction:column; }
  .flbl { font-size:13px; font-weight:500; color:var(--s600); margin-bottom:5px; }
  .req  { color:#ef4444; }
  .finp, .fsel, .ftxt { padding:9px 12px; border:1.5px solid var(--s200); border-radius:8px; font-size:14px; color:var(--s800); outline:none; font-family:var(--font); transition:all .15s; background:#fff; width:100%; }
  .finp:focus, .fsel:focus, .ftxt:focus { border-color:var(--blue); box-shadow:0 0 0 3px #2563eb18; }
  .finp.err, .fsel.err { border-color:#ef4444; }
  .finp:disabled, .fsel:disabled { background:var(--s50); color:var(--s400); }
  .ftxt { resize:vertical; }
  .ferr { color:#ef4444; font-size:11.5px; margin-top:3px; }

  .cfbox { background:var(--s50); border-radius:10px; padding:20px; margin-bottom:16px; }
  .cfsec { padding-bottom:16px; margin-bottom:16px; border-bottom:1px solid var(--s200); }
  .cfsec:last-child { border-bottom:none; padding-bottom:0; margin-bottom:0; }
  .cftit { font-weight:600; color:var(--s700); margin-bottom:12px; font-size:14px; }
  .cfgrd { display:grid; grid-template-columns:1fr 1fr; gap:8px; font-size:13px; }
  .cl { color:var(--s500); }
  .cv { font-weight:600; color:var(--s800); }
  .alertb  { background:#eff6ff; border:1px solid #bfdbfe; border-radius:8px; padding:14px 16px; display:flex; gap:10px; margin-bottom:16px; }
  .alrttxt { font-size:13px; color:var(--s700); line-height:1.5; }

  .btnrow { display:flex; justify-content:space-between; margin-top:24px; padding-top:20px; border-top:1px solid var(--s100); }
  .btn      { padding:10px 22px; border-radius:8px; font-weight:600; font-size:14px; border:none; cursor:pointer; font-family:var(--font); transition:all .15s; }
  .btn-back { background:var(--s100); color:var(--s700); }
  .btn-back:hover { background:var(--s200); }
  .btn-next { background:var(--blue); color:#fff; margin-left:auto; }
  .btn-next:hover { background:var(--blue-d); }
  .btn-sub  { background:#16a34a; color:#fff; margin-left:auto; display:flex; align-items:center; gap:6px; }
  .btn-sub:hover { background:#15803d; }

  .succ-wrap { flex:1; display:flex; align-items:center; justify-content:center; padding:24px; }
  .succ-card { background:#fff; border-radius:16px; border:1px solid var(--s200); padding:40px; text-align:center; max-width:440px; width:100%; }
  .succ-tit  { font-size:24px; font-weight:800; color:var(--s800); margin:16px 0 8px; }
  .succ-box  { background:#f0fdf4; border:1px solid #bbf7d0; border-radius:10px; padding:16px; margin-bottom:16px; text-align:left; }
  .succ-row  { font-size:13.5px; color:var(--s700); margin-bottom:6px; }
  .succ-row:last-child { margin-bottom:0; }
  .succ-note { font-size:13px; color:var(--s500); margin-bottom:20px; }
  .btn-new   { background:var(--blue); color:#fff; padding:10px 22px; border-radius:8px; font-weight:600; border:none; cursor:pointer; font-family:var(--font); font-size:14px; }

  @media (max-width:900px) {
    .stats { grid-template-columns:repeat(2,1fr); }
    .g3, .g2 { grid-template-columns:1fr; }
  }
  @media (max-width:640px) {
    .sb { width:54px; min-width:54px; }
    .sb-name,.sb-sub,.sb-btn span,.sb-lbl,.sb-uname,.sb-urole,.sb-url { display:none; }
    .sb-logo { padding:14px 10px; justify-content:center; }
    .sb-btn  { justify-content:center; padding:10px; }
    .tb-hash { display:none; }
    .mgrid  { grid-template-columns:1fr; }
    .mffull { grid-column:span 1; }
  }
`;

// ─── SIDEBAR ─────────────────────────────────────────────────────────────────

function Sidebar({ page, go }) {
  const nav = [
    {
      id: "dashboard",
      icon: <LayoutDashboard size={18} />,
      label: "Дашборд",
      hash: "#/dashboard",
    },
    {
      id: "patients",
      icon: <Users size={18} />,
      label: "Пациенты",
      hash: "#/patients",
    },
    {
      id: "register",
      icon: <ClipboardList size={18} />,
      label: "Регистрация",
      hash: "#/register",
    },
  ];
  return (
    <aside className="sb">
      <div className="sb-logo">
        <div className="sb-icon">МП</div>
        <div>
          <div className="sb-name">Поликлиника №1</div>
          <div className="sb-sub">medpolis.kg</div>
        </div>
      </div>
      <nav className="sb-nav">
        <div className="sb-lbl">Навигация</div>
        {nav.map((n) => (
          <button
            key={n.id}
            className={`sb-btn ${page === n.id ? "active" : ""}`}
            onClick={() => go(n.id)}
          >
            {n.icon}
            <span>{n.label}</span>
            <span className="sb-url">{n.hash}</span>
          </button>
        ))}
      </nav>
      <div className="sb-foot">
        <div className="sb-user">
          <div className="sb-av">АД</div>
          <div>
            <div className="sb-uname">Администратор</div>
            <div className="sb-urole">admin</div>
          </div>
        </div>
      </div>
    </aside>
  );
}

// ─── TOPBAR ──────────────────────────────────────────────────────────────────

function Topbar({ page, go }) {
  const meta = {
    dashboard: { title: "Дашборд", hash: "#/dashboard" },
    patients: { title: "Пациенты", hash: "#/patients" },
    register: { title: "Регистрация пациента", hash: "#/register" },
  };
  const { title, hash } = meta[page];
  return (
    <div className="topbar">
      <div className="tb-left">
        <div className="tb-title">{title}</div>
        <div className="tb-hash">{hash}</div>
      </div>
      <div className="tb-right">
        <button className="tb-icon">
          <Bell size={16} />
          <span className="tb-dot" />
        </button>
        {page !== "register" && (
          <button className="tb-btn" onClick={() => go("register")}>
            + Новый пациент
          </button>
        )}
      </div>
    </div>
  );
}

// ─── MODAL ───────────────────────────────────────────────────────────────────

function PatientModal({ patient, onClose }) {
  const sc = STATUS_CFG[patient.status];
  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="mhd">
          <div>
            <div className="mtitle">
              {patient.lastName} {patient.firstName} {patient.middleName}
            </div>
            <div className="msub">
              ID: #{patient.id} · ИИН: {patient.iin}
            </div>
          </div>
          <button className="mclose" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <div className="mbody">
          <div className="msec">
            <div className="mslbl">Личные данные</div>
            <div className="mgrid">
              <div>
                <div className="mflbl">Дата рождения</div>
                <div className="mfval">{patient.birthDate}</div>
              </div>
              <div>
                <div className="mflbl">Пол</div>
                <div className="mfval">
                  {patient.gender === "male" ? "Мужской" : "Женский"}
                </div>
              </div>
              <div>
                <div className="mflbl">Телефон</div>
                <div className="mfval">{patient.phone}</div>
              </div>
              <div>
                <div className="mflbl">Email</div>
                <div className="mfval">{patient.email || "—"}</div>
              </div>
              {patient.address && (
                <div className="mffull">
                  <div className="mflbl">Адрес</div>
                  <div className="mfval">{patient.address}</div>
                </div>
              )}
            </div>
          </div>
          <div className="msec">
            <div className="mslbl">Запись на приём</div>
            <div className="mgrid">
              <div>
                <div className="mflbl">Отделение</div>
                <div className="mfval">{patient.department}</div>
              </div>
              <div>
                <div className="mflbl">Врач</div>
                <div className="mfval">{patient.doctor}</div>
              </div>
              <div>
                <div className="mflbl">Дата</div>
                <div className="mfval">{patient.appointmentDate}</div>
              </div>
              <div>
                <div className="mflbl">Время</div>
                <div className="mfval">{patient.appointmentTime}</div>
              </div>
              <div>
                <div className="mflbl">Статус</div>
                <div className="mfval">
                  <span
                    className="badge"
                    style={{ background: sc.bg, color: sc.color }}
                  >
                    <span className="bdot" style={{ background: sc.dot }} />
                    {sc.label}
                  </span>
                </div>
              </div>
            </div>
          </div>
          {patient.complaint && (
            <div className="msec">
              <div className="mslbl">Жалобы</div>
              <div className="mcmpl">{patient.complaint}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── DASHBOARD PAGE ──────────────────────────────────────────────────────────

function DashboardPage({ patients, onDelete }) {
  const [search, setSearch] = useState("");
  const [filterDept, setFilterDept] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [selected, setSelected] = useState(null);

  const filtered = patients.filter((p) => {
    const q =
      `${p.lastName} ${p.firstName} ${p.middleName} ${p.doctor}`.toLowerCase();
    return (
      (!search ||
        q.includes(search.toLowerCase()) ||
        p.phone.includes(search) ||
        p.iin.includes(search)) &&
      (!filterDept || p.department === filterDept) &&
      (!filterStatus || p.status === filterStatus)
    );
  });

  const today = new Date().toISOString().split("T")[0];
  const todayCnt = patients.filter((p) => p.appointmentDate === today).length;
  const STATS = [
    {
      icon: <Users size={20} color="#2563eb" />,
      bg: "#eff6ff",
      val: patients.length,
      lbl: "Всего пациентов",
      chg: "+3 сегодня",
    },
    {
      icon: <Clock size={20} color="#d97706" />,
      bg: "#fef3c7",
      val: patients.filter((p) => p.status === "waiting").length,
      lbl: "Ожидают приёма",
      chg: `${todayCnt} на сегодня`,
    },
    {
      icon: <CheckCircle size={20} color="#059669" />,
      bg: "#d1fae5",
      val: patients.filter((p) => p.status === "confirmed").length,
      lbl: "Подтверждено",
      chg: "записей",
    },
    {
      icon: <Activity size={20} color="#7c3aed" />,
      bg: "#ede9fe",
      val: patients.filter((p) => p.status === "completed").length,
      lbl: "Завершено",
      chg: "приёмов",
    },
  ];

  return (
    <>
      <div className="stats">
        {STATS.map((s, i) => (
          <div className="stat" key={i}>
            <div className="stat-ic" style={{ background: s.bg }}>
              {s.icon}
            </div>
            <div>
              <div className="stat-val">{s.val}</div>
              <div className="stat-lbl">{s.lbl}</div>
              <div className="stat-chg">
                <TrendingUp size={11} /> {s.chg}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="tcard">
        <div className="thead">
          <div className="thead-title">Список пациентов</div>
          <div className="tcontrols">
            <div className="srch-wrap">
              <Search size={14} className="srch-ico" />
              <input
                className="srch-inp"
                placeholder="Поиск..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select
              className="flt-sel"
              value={filterDept}
              onChange={(e) => setFilterDept(e.target.value)}
            >
              <option value="">Все отделения</option>
              {DEPARTMENTS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
            <select
              className="flt-sel"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">Все статусы</option>
              <option value="confirmed">Подтверждён</option>
              <option value="waiting">Ожидает</option>
              <option value="completed">Завершён</option>
            </select>
          </div>
        </div>

        <div className="tscroll">
          <table>
            <thead>
              <tr>
                <th>Пациент</th>
                <th>Телефон</th>
                <th>Отделение</th>
                <th>Врач</th>
                <th>Дата / Время</th>
                <th>Статус</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    style={{
                      textAlign: "center",
                      color: "var(--s400)",
                      padding: 32,
                    }}
                  >
                    Пациенты не найдены
                  </td>
                </tr>
              ) : (
                filtered.map((p) => {
                  const sc = STATUS_CFG[p.status];
                  return (
                    <tr key={p.id}>
                      <td>
                        <div className="pcell">
                          <div
                            className={`pav ${
                              p.gender === "male" ? "av-m" : "av-f"
                            }`}
                          >
                            {p.lastName[0]}
                            {p.firstName[0]}
                          </div>
                          <div>
                            <div className="pname">
                              {p.lastName} {p.firstName}
                            </div>
                            <div className="pid">ИИН: {p.iin}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ fontFamily: "var(--mono)", fontSize: 13 }}>
                        {p.phone}
                      </td>
                      <td>
                        <span className="dtag">{p.department}</span>
                      </td>
                      <td style={{ color: "var(--s600)" }}>{p.doctor}</td>
                      <td style={{ fontFamily: "var(--mono)", fontSize: 12.5 }}>
                        {p.appointmentDate}
                        <br />
                        <span style={{ color: "var(--s400)" }}>
                          {p.appointmentTime}
                        </span>
                      </td>
                      <td>
                        <span
                          className="badge"
                          style={{ background: sc.bg, color: sc.color }}
                        >
                          <span
                            className="bdot"
                            style={{ background: sc.dot }}
                          />
                          {sc.label}
                        </span>
                      </td>
                      <td>
                        <div className="acts">
                          <button
                            className="abt view"
                            onClick={() => setSelected(p)}
                          >
                            <Eye size={14} />
                          </button>
                          <button
                            className="abt del"
                            onClick={() => onDelete(p.id)}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        <div className="tfoot">
          <div className="tcnt">
            Показано {filtered.length} из {patients.length} записей
          </div>
        </div>
      </div>

      {selected && (
        <PatientModal patient={selected} onClose={() => setSelected(null)} />
      )}
    </>
  );
}

// ─── REGISTER PAGE ───────────────────────────────────────────────────────────

const EMPTY = {
  lastName: "",
  firstName: "",
  middleName: "",
  birthDate: "",
  gender: "",
  phone: "",
  email: "",
  address: "",
  iin: "",
  appointmentDate: "",
  appointmentTime: "",
  doctor: "",
  department: "",
  complaint: "",
};

function RegisterPage({ onRegister }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
    if (name === "department")
      setForm((p) => ({ ...p, department: value, doctor: "" }));
  };

  const validate = (s) => {
    const e = {};
    if (s === 1) {
      if (!form.lastName.trim()) e.lastName = "Введите фамилию";
      if (!form.firstName.trim()) e.firstName = "Введите имя";
      if (!form.birthDate) e.birthDate = "Выберите дату";
      if (!form.gender) e.gender = "Выберите пол";
      if (!form.phone.trim()) e.phone = "Введите телефон";
      if (!form.iin.trim()) e.iin = "Введите ИИН";
    }
    if (s === 2) {
      if (!form.department) e.department = "Выберите отделение";
      if (!form.doctor) e.doctor = "Выберите врача";
      if (!form.appointmentDate) e.appointmentDate = "Выберите дату";
      if (!form.appointmentTime) e.appointmentTime = "Выберите время";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (validate(step)) setStep((s) => s + 1);
  };
  const prev = () => setStep((s) => s - 1);
  const submit = () => {
    if (validate(step)) {
      onRegister({ ...form, id: Date.now(), status: "confirmed" });
      setSubmitted(true);
    }
  };
  const reset = () => {
    setSubmitted(false);
    setStep(1);
    setForm(EMPTY);
  };

  if (submitted)
    return (
      <div className="succ-wrap">
        <div className="succ-card">
          <CheckCircle
            style={{
              width: 72,
              height: 72,
              color: "#16a34a",
              display: "block",
              margin: "0 auto",
            }}
          />
          <h2 className="succ-tit">Регистрация завершена!</h2>
          <div className="succ-box">
            <p className="succ-row">
              <strong>Пациент:</strong> {form.lastName} {form.firstName}{" "}
              {form.middleName}
            </p>
            <p className="succ-row">
              <strong>Отделение:</strong> {form.department}
            </p>
            <p className="succ-row">
              <strong>Врач:</strong> {form.doctor}
            </p>
            <p className="succ-row">
              <strong>Дата приёма:</strong> {form.appointmentDate}
            </p>
            <p className="succ-row">
              <strong>Время:</strong> {form.appointmentTime}
            </p>
          </div>
          <p className="succ-note">Талон отправлен на номер {form.phone}</p>
          <button className="btn-new" onClick={reset}>
            Зарегистрировать нового пациента
          </button>
        </div>
      </div>
    );

  const labels = ["Личные данные", "Запись", "Подтверждение"];
  return (
    <div className="reg-wrap">
      <div className="reg-card">
        <div className="reg-hd">
          <div className="reg-hdtit">Регистрация пациента</div>
          <div className="reg-hdsub">Городская поликлиника №1</div>
        </div>
        <div className="reg-prog">
          <div className="reg-steps">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                style={{
                  display: "flex",
                  alignItems: "center",
                  flex: s < 3 ? 1 : undefined,
                }}
              >
                <div className="reg-step">
                  <div className={`rsc ${s <= step ? "on" : "off"}`}>{s}</div>
                  <div className="rslbl">{labels[s - 1]}</div>
                </div>
                {s < 3 && (
                  <div className={`rline ${s < step ? "on" : "off"}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="reg-body">
          {step === 1 && (
            <>
              <div className="reg-stit">
                <User size={20} color="#2563eb" />
                Личные данные пациента
              </div>
              <div className="g3">
                {[
                  ["lastName", "Фамилия", "Иванов", true],
                  ["firstName", "Имя", "Иван", true],
                  ["middleName", "Отчество", "Иванович", false],
                ].map(([n, l, ph, r]) => (
                  <div className="fg" key={n}>
                    <label className="flbl">
                      {l} {r && <span className="req">*</span>}
                    </label>
                    <input
                      type="text"
                      name={n}
                      value={form[n]}
                      onChange={handleChange}
                      placeholder={ph}
                      className={`finp${errors[n] ? " err" : ""}`}
                    />
                    {errors[n] && <p className="ferr">{errors[n]}</p>}
                  </div>
                ))}
              </div>
              <div className="g2">
                <div className="fg">
                  <label className="flbl">
                    Дата рождения <span className="req">*</span>
                  </label>
                  <input
                    type="date"
                    name="birthDate"
                    value={form.birthDate}
                    onChange={handleChange}
                    className={`finp${errors.birthDate ? " err" : ""}`}
                  />
                  {errors.birthDate && (
                    <p className="ferr">{errors.birthDate}</p>
                  )}
                </div>
                <div className="fg">
                  <label className="flbl">
                    Пол <span className="req">*</span>
                  </label>
                  <select
                    name="gender"
                    value={form.gender}
                    onChange={handleChange}
                    className={`fsel${errors.gender ? " err" : ""}`}
                  >
                    <option value="">Выберите пол</option>
                    <option value="male">Мужской</option>
                    <option value="female">Женский</option>
                  </select>
                  {errors.gender && <p className="ferr">{errors.gender}</p>}
                </div>
              </div>
              <div className="g2">
                <div className="fg">
                  <label className="flbl">
                    Телефон <span className="req">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+996 700 000 000"
                    className={`finp${errors.phone ? " err" : ""}`}
                  />
                  {errors.phone && <p className="ferr">{errors.phone}</p>}
                </div>
                <div className="fg">
                  <label className="flbl">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="example@mail.com"
                    className="finp"
                  />
                </div>
              </div>
              <div className="g1">
                <div className="fg">
                  <label className="flbl">
                    ИИН <span className="req">*</span>
                  </label>
                  <input
                    type="text"
                    name="iin"
                    value={form.iin}
                    onChange={handleChange}
                    maxLength="14"
                    placeholder="12345678901234"
                    className={`finp${errors.iin ? " err" : ""}`}
                  />
                  {errors.iin && <p className="ferr">{errors.iin}</p>}
                </div>
                <div className="fg">
                  <label className="flbl">Адрес проживания</label>
                  <textarea
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    rows="2"
                    placeholder="Улица, дом, квартира"
                    className="ftxt"
                  />
                </div>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="reg-stit">
                <Calendar size={20} color="#2563eb" />
                Запись на приём
              </div>
              <div className="g2">
                <div className="fg">
                  <label className="flbl">
                    Отделение <span className="req">*</span>
                  </label>
                  <select
                    name="department"
                    value={form.department}
                    onChange={handleChange}
                    className={`fsel${errors.department ? " err" : ""}`}
                  >
                    <option value="">Выберите отделение</option>
                    {DEPARTMENTS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                  {errors.department && (
                    <p className="ferr">{errors.department}</p>
                  )}
                </div>
                <div className="fg">
                  <label className="flbl">
                    Врач <span className="req">*</span>
                  </label>
                  <select
                    name="doctor"
                    value={form.doctor}
                    onChange={handleChange}
                    disabled={!form.department}
                    className={`fsel${errors.doctor ? " err" : ""}`}
                  >
                    <option value="">Выберите врача</option>
                    {form.department &&
                      DOCTORS_BY_DEPT[form.department]?.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                  </select>
                  {errors.doctor && <p className="ferr">{errors.doctor}</p>}
                </div>
              </div>
              <div className="g2">
                <div className="fg">
                  <label className="flbl">
                    Дата приёма <span className="req">*</span>
                  </label>
                  <input
                    type="date"
                    name="appointmentDate"
                    value={form.appointmentDate}
                    onChange={handleChange}
                    min={new Date().toISOString().split("T")[0]}
                    className={`finp${errors.appointmentDate ? " err" : ""}`}
                  />
                  {errors.appointmentDate && (
                    <p className="ferr">{errors.appointmentDate}</p>
                  )}
                </div>
                <div className="fg">
                  <label className="flbl">
                    Время <span className="req">*</span>
                  </label>
                  <select
                    name="appointmentTime"
                    value={form.appointmentTime}
                    onChange={handleChange}
                    className={`fsel${errors.appointmentTime ? " err" : ""}`}
                  >
                    <option value="">Выберите время</option>
                    {TIME_SLOTS.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                  {errors.appointmentTime && (
                    <p className="ferr">{errors.appointmentTime}</p>
                  )}
                </div>
              </div>
              <div className="fg">
                <label className="flbl">Жалобы / Причина обращения</label>
                <textarea
                  name="complaint"
                  value={form.complaint}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Опишите симптомы или причину визита"
                  className="ftxt"
                />
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div className="reg-stit">
                <FileText size={20} color="#2563eb" />
                Проверьте данные
              </div>
              <div className="cfbox">
                <div className="cfsec">
                  <div className="cftit">Личные данные:</div>
                  <div className="cfgrd">
                    <span className="cl">ФИО:</span>
                    <span className="cv">
                      {form.lastName} {form.firstName} {form.middleName}
                    </span>
                    <span className="cl">Дата рождения:</span>
                    <span className="cv">{form.birthDate}</span>
                    <span className="cl">Пол:</span>
                    <span className="cv">
                      {form.gender === "male" ? "Мужской" : "Женский"}
                    </span>
                    <span className="cl">Телефон:</span>
                    <span className="cv">{form.phone}</span>
                    <span className="cl">ИИН:</span>
                    <span className="cv">{form.iin}</span>
                    {form.email && (
                      <>
                        <span className="cl">Email:</span>
                        <span className="cv">{form.email}</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="cfsec">
                  <div className="cftit">Запись на приём:</div>
                  <div className="cfgrd">
                    <span className="cl">Отделение:</span>
                    <span className="cv">{form.department}</span>
                    <span className="cl">Врач:</span>
                    <span className="cv">{form.doctor}</span>
                    <span className="cl">Дата:</span>
                    <span className="cv">{form.appointmentDate}</span>
                    <span className="cl">Время:</span>
                    <span className="cv">{form.appointmentTime}</span>
                  </div>
                </div>
              </div>
              <div className="alertb">
                <AlertCircle
                  size={18}
                  color="#2563eb"
                  style={{ flexShrink: 0, marginTop: 1 }}
                />
                <p className="alrttxt">
                  После подтверждения на указанный номер телефона будет
                  отправлен талон с номером очереди и временем приёма.
                </p>
              </div>
            </>
          )}

          <div className="btnrow">
            {step > 1 && (
              <button className="btn btn-back" onClick={prev}>
                Назад
              </button>
            )}
            {step < 3 ? (
              <button className="btn btn-next" onClick={next}>
                Далее →
              </button>
            ) : (
              <button className="btn btn-sub" onClick={submit}>
                <CheckCircle size={16} />
                Подтвердить регистрацию
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────

export default function App() {
  const [page, go] = useHashRouter();
  const [patients, setPatients] = useState(MOCK_PATIENTS);

  const handleRegister = (p) => {
    setPatients((prev) => [p, ...prev]);
    go("dashboard");
  };
  const handleDelete = (id) =>
    setPatients((prev) => prev.filter((p) => p.id !== id));

  return (
    <>
      <style>{CSS}</style>
      <div className="app">
        <Sidebar page={page} go={go} />
        <div className="main">
          <Topbar page={page} go={go} />
          {(page === "dashboard" || page === "patients") && (
            <div className="page">
              <DashboardPage patients={patients} onDelete={handleDelete} />
            </div>
          )}
          {page === "register" && <RegisterPage onRegister={handleRegister} />}
        </div>
      </div>
    </>
  );
}
