import { useState, useEffect } from "react";
import {
  Heart, LogOut, Calendar, Clock, CheckCircle, XCircle, AlertCircle, User,
  Phone, Mail, MapPin, CreditCard, Stethoscope, Ticket, CalendarClock, CalendarCheck,
} from "lucide-react";
import { api } from "../api";
import { getUser, clearUser } from "../auth/auth";
import { useI18n } from "../i18n";
import "./patient.css";

const UPCOMING = ["confirmed", "waiting", "in_progress"];
const PAST     = ["completed", "cancelled"];

const STATUS_ICO = {
  confirmed:   <CalendarCheck size={14} />,
  waiting:     <Clock size={14} />,
  in_progress: <AlertCircle size={14} />,
  completed:   <CheckCircle size={14} />,
  cancelled:   <XCircle size={14} />,
};

// appointmentDate / birthDate come from MySQL DATE columns serialized as ISO
// strings (e.g. "2026-05-20T18:00:00.000Z"). Parse via Date + LOCAL components
// so the timezone offset is unwound back to the stored calendar day.
const toDate = v => { if (!v) return null; const d = new Date(v); return isNaN(d) ? null : d; };
const fmtLocal = v => {
  const d = toDate(v); if (!d) return "—";
  const p = n => String(n).padStart(2, "0");
  return `${p(d.getDate())}.${p(d.getMonth() + 1)}.${d.getFullYear()}`;
};
const diffDays = v => {
  const d = toDate(v); if (!d) return null;
  d.setHours(0, 0, 0, 0);
  const t0 = new Date(); t0.setHours(0, 0, 0, 0);
  return Math.round((d - t0) / 86400000);
};
const weekdayIdx = v => { const d = toDate(v); return d ? d.getDay() : null; };

export default function PatientApp({ onLogout }) {
  const { t, lang, switchLang } = useI18n();
  const user = getUser();
  const [appointments, setAppointments] = useState(user.appointments ?? []);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");
  const [tab,     setTab]     = useState("upcoming");

  useEffect(() => {
    if (appointments.length > 0) return;
    setLoading(true);
    api.getMyAppointments(user.iin, user.phone)
      .then(setAppointments)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []); // eslint-disable-line

  const logout = () => { clearUser(); onLogout(); };

  const upcoming = appointments
    .filter(a => UPCOMING.includes(a.status))
    .sort((x, y) => (x.appointmentDate || "").localeCompare(y.appointmentDate || ""));
  const past = appointments
    .filter(a => PAST.includes(a.status))
    .sort((x, y) => (y.appointmentDate || "").localeCompare(x.appointmentDate || ""));

  const next    = upcoming[0];
  const profile = appointments[0] || {};
  const parts   = (user.name || "").split(" ").filter(Boolean);
  const firstName = parts[1] || parts[0] || "";

  const countLabel = n => {
    if (n === null) return "";
    if (n === 0) return t("portal.today");
    if (n === 1) return t("portal.tomorrow");
    if (n > 1)   return t("portal.inDays").replace("{n}", n);
    return t("portal.daysAgo").replace("{n}", Math.abs(n));
  };
  const weekday = s => { const i = weekdayIdx(s); return i === null ? "" : t("portal.weekdays")[i]; };

  const nextDiff = next ? diffDays(next.appointmentDate) : null;

  return (
    <div className="pt-wrap">
      <header className="pt-topbar">
        <div className="pt-topbar__brand">
          <div className="pt-topbar__logo"><Heart size={20} color="#fff" fill="#fff" /></div>
          <span className="pt-topbar__name">КТП Поликлиника</span>
        </div>
        <div className="pt-topbar__right">
          <div className="pt-langswitch">
            {["ru", "ky"].map(l => (
              <button key={l} className={`pt-langbtn${lang === l ? " active" : ""}`} onClick={() => switchLang(l)}>
                {l.toUpperCase()}
              </button>
            ))}
          </div>
          <div className="pt-topbar__user"><User size={15} /><span>{user.name}</span></div>
          <button className="pt-topbar__logout" onClick={logout}><LogOut size={15} /> {t("portal.logout")}</button>
        </div>
      </header>

      <main className="pt-main">
        <div className="pt-welcome">
          <h1 className="pt-welcome__title">{t("portal.greeting")}, {firstName}! 👋</h1>
          <p className="pt-welcome__sub">{t("portal.sub")}</p>
        </div>

        {error && <div className="pt-error"><AlertCircle size={15} /> {error}</div>}

        {loading ? (
          <div className="pt-loading">{t("portal.loading")}</div>
        ) : (
          <>
            {next ? (
              <div className={`pt-next pt-next--${next.status}`}>
                <div className="pt-next__head">
                  <span className="pt-next__label"><CalendarClock size={15} /> {t("portal.nextTitle")}</span>
                  {nextDiff >= 0 && <span className="pt-next__count">{countLabel(nextDiff)}</span>}
                </div>
                <div className="pt-next__date">{weekday(next.appointmentDate)}, {fmtLocal(next.appointmentDate)}</div>
                <div className="pt-next__time"><Clock size={15} /> {next.appointmentTime || "—"}</div>
                <div className="pt-next__info">
                  <span className="pt-next__dept">{next.department}</span>
                  <span className="pt-next__doctor"><Stethoscope size={14} /> {next.doctor}</span>
                </div>
                <div className="pt-next__foot">
                  <StatusBadge status={next.status} t={t} light />
                  {next.queueNum > 0 && <span className="pt-next__ticket"><Ticket size={14} /> {t("portal.ticket")} №{next.queueNum}</span>}
                </div>
              </div>
            ) : (
              <div className="pt-next pt-next--empty">
                <CalendarClock size={30} />
                <div className="pt-next__emptytitle">{t("portal.noNextTitle")}</div>
                <p>{t("portal.noNextText")}</p>
                <button className="pt-next__bookbtn" onClick={() => { window.location.hash = ""; }}>{t("portal.bookBtn")}</button>
              </div>
            )}

            <div className="pt-stats">
              <div className="pt-stat">
                <Calendar size={20} className="pt-stat__ico" />
                <div className="pt-stat__val">{appointments.length}</div>
                <div className="pt-stat__lbl">{t("portal.total")}</div>
              </div>
              <div className="pt-stat pt-stat--blue">
                <Clock size={20} className="pt-stat__ico" />
                <div className="pt-stat__val">{upcoming.length}</div>
                <div className="pt-stat__lbl">{t("portal.upcoming")}</div>
              </div>
              <div className="pt-stat pt-stat--green">
                <CheckCircle size={20} className="pt-stat__ico" />
                <div className="pt-stat__val">{past.filter(a => a.status === "completed").length}</div>
                <div className="pt-stat__lbl">{t("portal.completed")}</div>
              </div>
            </div>

            <div className="pt-tabs">
              <button className={`pt-tab${tab === "upcoming" ? " active" : ""}`} onClick={() => setTab("upcoming")}>
                {t("portal.tabUpcoming")} <span className="pt-tab__count">{upcoming.length}</span>
              </button>
              <button className={`pt-tab${tab === "history" ? " active" : ""}`} onClick={() => setTab("history")}>
                {t("portal.tabHistory")} <span className="pt-tab__count">{past.length}</span>
              </button>
              <button className={`pt-tab${tab === "profile" ? " active" : ""}`} onClick={() => setTab("profile")}>
                {t("portal.tabProfile")}
              </button>
            </div>

            {tab === "upcoming" && (
              upcoming.length
                ? <div className="pt-cards">{upcoming.map(a => <AppointmentCard key={a.id} a={a} t={t} upcoming weekday={weekday} countLabel={countLabel} />)}</div>
                : <div className="pt-empty"><Calendar size={36} /><p>{t("portal.noUpcoming")}</p></div>
            )}
            {tab === "history" && (
              past.length
                ? <div className="pt-cards">{past.map(a => <AppointmentCard key={a.id} a={a} t={t} weekday={weekday} countLabel={countLabel} />)}</div>
                : <div className="pt-empty"><Calendar size={36} /><p>{t("portal.noHistory")}</p></div>
            )}
            {tab === "profile" && <ProfileTab user={user} p={profile} t={t} />}
          </>
        )}
      </main>
    </div>
  );
}

function StatusBadge({ status, t, light }) {
  return (
    <span className={`pt-badge pt-badge--${status}${light ? " pt-badge--light" : ""}`}>
      {STATUS_ICO[status]} {t("portal.status." + status)}
    </span>
  );
}

function AppointmentCard({ a, t, upcoming, weekday, countLabel }) {
  const n = diffDays(a.appointmentDate);
  return (
    <div className={`pt-card pt-card--${a.status}`}>
      <div className="pt-card__top">
        <div className="pt-card__dept">{a.department}</div>
        <StatusBadge status={a.status} t={t} />
      </div>
      <div className="pt-card__doctor"><Stethoscope size={14} /> {a.doctor}</div>
      <div className="pt-card__row">
        <span><Calendar size={13} /> {weekday(a.appointmentDate)}, {fmtLocal(a.appointmentDate)}</span>
        <span><Clock size={13} /> {a.appointmentTime || "—"}</span>
      </div>
      <div className="pt-card__chips">
        {upcoming && n !== null && n >= 0 && <span className="pt-chip pt-chip--blue">{countLabel(n)}</span>}
        {a.queueNum > 0 && <span className="pt-chip"><Ticket size={12} /> {t("portal.ticket")} №{a.queueNum}</span>}
      </div>
      {a.complaint && <div className="pt-card__complaint">{t("portal.complaint")}: {a.complaint}</div>}
    </div>
  );
}

function ProfileTab({ user, p, t }) {
  const initials = (user.name || "").split(" ").filter(Boolean).slice(0, 2).map(s => s[0]).join("").toUpperCase();
  const age = p.birthDate ? Math.floor((Date.now() - new Date(p.birthDate)) / (365.25 * 86400000)) : null;
  const genderMap = { male: t("portal.male"), female: t("portal.female"), unknown: t("portal.unknown") };
  const dash = t("portal.notSpecified");

  const rows = [
    [<User size={15} />,        t("portal.fio"),     user.name],
    [<CreditCard size={15} />,  t("portal.iin"),     user.iin || p.iin],
    [<Phone size={15} />,       t("portal.phone"),   user.phone || p.phone],
    [<Mail size={15} />,        t("portal.email"),   p.email || dash],
    [<Calendar size={15} />,    t("portal.birth"),   p.birthDate ? fmtLocal(p.birthDate) : dash],
    [<User size={15} />,        t("portal.age"),     age !== null ? `${age} ${t("portal.years")}` : dash],
    [<User size={15} />,        t("portal.gender"),  genderMap[p.gender] || dash],
    [<MapPin size={15} />,      t("portal.address"), p.address || dash],
  ];

  return (
    <div className="pt-profile-wrap">
      <div className="pt-profile">
        <div className="pt-profile__head">
          <div className="pt-avatar">{initials || <User size={22} />}</div>
          <div>
            <div className="pt-profile__name">{user.name}</div>
            <div className="pt-profile__role">{t("portal.profileTitle")}</div>
          </div>
        </div>
        <div className="pt-profile__rows">
          {rows.map(([ico, lbl, val], i) => (
            <div className="pt-prow" key={i}>
              <span className="pt-prow__ico">{ico}</span>
              <span className="pt-prow__lbl">{lbl}</span>
              <span className="pt-prow__val">{val || dash}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-help">
        <div className="pt-help__title"><Heart size={15} /> {t("portal.helpTitle")}</div>
        <div className="pt-help__row"><MapPin size={14} /> {t("portal.addressVal")}</div>
        <div className="pt-help__row"><Phone size={14} /> {t("portal.phoneVal")}</div>
        <div className="pt-help__row"><Clock size={14} /> {t("portal.hours")}</div>
      </div>
    </div>
  );
}
