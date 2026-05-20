import { useState, useEffect } from "react";
import { Heart, LogOut, Calendar, Clock, CheckCircle, XCircle, AlertCircle, User } from "lucide-react";
import { api } from "../api";
import { getUser, clearUser } from "../auth/auth";
import "./patient.css";

const STATUS_LABEL = {
  waiting:     "Ожидает",
  in_progress: "На приёме",
  completed:   "Завершён",
  cancelled:   "Отменён",
};

const STATUS_ICO = {
  waiting:     <Clock size={14} />,
  in_progress: <AlertCircle size={14} />,
  completed:   <CheckCircle size={14} />,
  cancelled:   <XCircle size={14} />,
};

function StatusBadge({ status }) {
  return (
    <span className={`pt-badge pt-badge--${status}`}>
      {STATUS_ICO[status]} {STATUS_LABEL[status] ?? status}
    </span>
  );
}

export default function PatientApp({ onLogout }) {
  const user = getUser();
  const [appointments, setAppointments] = useState(user.appointments ?? []);
  const [loading,      setLoading]      = useState(false);
  const [error,        setError]        = useState("");

  useEffect(() => {
    if (appointments.length > 0) return;
    setLoading(true);
    api.getMyAppointments(user.iin, user.phone)
      .then(data => setAppointments(data))
      .catch(e  => setError(e.message))
      .finally(()=> setLoading(false));
  }, []);// eslint-disable-line

  const logout = () => { clearUser(); onLogout(); };

  const upcoming = appointments.filter(a => a.status === "waiting" || a.status === "in_progress");
  const past     = appointments.filter(a => a.status === "completed" || a.status === "cancelled");

  return (
    <div className="pt-wrap">
      {/* Top bar */}
      <header className="pt-topbar">
        <div className="pt-topbar__brand">
          <div className="pt-topbar__logo"><Heart size={20} color="#fff" fill="#fff" /></div>
          <span className="pt-topbar__name">КТП Поликлиника</span>
        </div>
        <div className="pt-topbar__right">
          <div className="pt-topbar__user">
            <User size={15} />
            <span>{user.name}</span>
          </div>
          <button className="pt-topbar__logout" onClick={logout}>
            <LogOut size={15} /> Выйти
          </button>
        </div>
      </header>

      <main className="pt-main">
        {/* Welcome */}
        <div className="pt-welcome">
          <h1 className="pt-welcome__title">Добро пожаловать, {user.name.split(" ")[0]}!</h1>
          <p className="pt-welcome__sub">Ваши записи в поликлинике КТП</p>
        </div>

        {/* Stats row */}
        <div className="pt-stats">
          <div className="pt-stat">
            <Calendar size={20} className="pt-stat__ico" />
            <div className="pt-stat__val">{appointments.length}</div>
            <div className="pt-stat__lbl">Всего записей</div>
          </div>
          <div className="pt-stat pt-stat--blue">
            <Clock size={20} className="pt-stat__ico" />
            <div className="pt-stat__val">{upcoming.length}</div>
            <div className="pt-stat__lbl">Предстоит</div>
          </div>
          <div className="pt-stat pt-stat--green">
            <CheckCircle size={20} className="pt-stat__ico" />
            <div className="pt-stat__val">{past.filter(a => a.status === "completed").length}</div>
            <div className="pt-stat__lbl">Завершено</div>
          </div>
        </div>

        {error && (
          <div className="pt-error"><AlertCircle size={15} /> {error}</div>
        )}

        {loading ? (
          <div className="pt-loading">Загрузка записей...</div>
        ) : appointments.length === 0 ? (
          <div className="pt-empty">
            <Calendar size={40} />
            <p>Записей не найдено</p>
            <small>Вы можете записаться через наш сайт</small>
          </div>
        ) : (
          <>
            {upcoming.length > 0 && (
              <section className="pt-section">
                <h2 className="pt-section__title">Предстоящие визиты</h2>
                <div className="pt-cards">
                  {upcoming.map(a => <AppointmentCard key={a.id} a={a} />)}
                </div>
              </section>
            )}

            {past.length > 0 && (
              <section className="pt-section">
                <h2 className="pt-section__title">История</h2>
                <div className="pt-cards">
                  {past.map(a => <AppointmentCard key={a.id} a={a} />)}
                </div>
              </section>
            )}
          </>
        )}
      </main>
    </div>
  );
}

function AppointmentCard({ a }) {
  const dateStr = a.appointmentDate
    ? new Date(a.appointmentDate).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" })
    : "—";

  return (
    <div className={`pt-card pt-card--${a.status}`}>
      <div className="pt-card__top">
        <div className="pt-card__dept">{a.department}</div>
        <StatusBadge status={a.status} />
      </div>
      <div className="pt-card__doctor">{a.doctor}</div>
      <div className="pt-card__row">
        <span><Calendar size={13} /> {dateStr}</span>
        <span><Clock size={13} /> {a.appointmentTime}</span>
      </div>
      {a.complaint && (
        <div className="pt-card__complaint">Жалоба: {a.complaint}</div>
      )}
    </div>
  );
}
