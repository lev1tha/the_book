import { useState, useEffect } from "react";
import {
  Stethoscope, LogOut, User, Clock, CheckCircle,
  Loader, ChevronDown, Calendar, Activity,
} from "lucide-react";
import { api } from "../api";
import { getUser, clearUser } from "../auth/auth";
import "./doctor.css";

const STATUS_LABEL = {
  waiting:     "Ожидает",
  in_progress: "На приёме",
  completed:   "Завершён",
  cancelled:   "Отменён",
};

const STATUS_NEXT = {
  waiting:     "in_progress",
  in_progress: "completed",
};

const STATUS_BTN = {
  waiting:     "Начать приём",
  in_progress: "Завершить",
};

function StatusBadge({ status }) {
  return <span className={`dr-badge dr-badge--${status}`}>{STATUS_LABEL[status] ?? status}</span>;
}

export default function DoctorApp({ onLogout }) {
  const user = getUser();
  const [patients,  setPatients]  = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [tab,       setTab]       = useState("today");
  const [expanded,  setExpanded]  = useState(null);
  const [updating,  setUpdating]  = useState(null);

  useEffect(() => {
    api.getPatients()
      .then(all => {
        const mine = all.filter(p =>
          p.doctor && p.doctor.trim().toLowerCase() === user.name.trim().toLowerCase()
        );
        setPatients(mine);
      })
      .catch(() => setPatients([]))
      .finally(() => setLoading(false));
  }, [user.name]);

  const todayStr = new Date().toISOString().slice(0, 10);

  const todayPts  = patients.filter(p => p.appointmentDate?.slice(0, 10) === todayStr);
  const otherPts  = patients.filter(p => p.appointmentDate?.slice(0, 10) !== todayStr);
  const displayed = tab === "today" ? todayPts : otherPts;

  const waiting   = todayPts.filter(p => p.status === "waiting").length;
  const inProg    = todayPts.filter(p => p.status === "in_progress").length;
  const done      = todayPts.filter(p => p.status === "completed").length;

  const handleStatus = async (id, newStatus) => {
    setUpdating(id);
    try {
      await api.updateStatus(id, newStatus);
      setPatients(prev => prev.map(p => p.id === id ? { ...p, status: newStatus } : p));
    } catch (e) {
      alert("Ошибка: " + e.message);
    } finally {
      setUpdating(null);
    }
  };

  const logout = () => { clearUser(); onLogout(); };

  return (
    <div className="dr-wrap">
      {/* Sidebar */}
      <aside className="dr-sidebar">
        <div className="dr-sidebar__logo">
          <div className="dr-sidebar__icon"><Stethoscope size={22} color="#fff" /></div>
          <div>
            <div className="dr-sidebar__title">КТП Поликлиника</div>
            <div className="dr-sidebar__sub">Панель врача</div>
          </div>
        </div>

        <div className="dr-doctor-info">
          <div className="dr-doctor-avatar">{user.name?.[0] ?? "Д"}</div>
          <div>
            <div className="dr-doctor-name">{user.name}</div>
            <div className="dr-doctor-dept">{user.department ?? "Врач"}</div>
          </div>
        </div>

        <nav className="dr-nav">
          <button
            className={`dr-nav__item${tab === "today" ? " dr-nav__item--active" : ""}`}
            onClick={() => setTab("today")}
          >
            <Calendar size={16} /> Сегодня
          </button>
          <button
            className={`dr-nav__item${tab === "all" ? " dr-nav__item--active" : ""}`}
            onClick={() => setTab("all")}
          >
            <Activity size={16} /> Все записи
          </button>
        </nav>

        <button className="dr-logout" onClick={logout}>
          <LogOut size={15} /> Выйти
        </button>
      </aside>

      {/* Main */}
      <main className="dr-main">
        <header className="dr-header">
          <div>
            <h1 className="dr-header__title">
              {tab === "today" ? "Приём сегодня" : "Все мои пациенты"}
            </h1>
            <p className="dr-header__sub">
              {new Date().toLocaleDateString("ru-RU", { weekday: "long", day: "numeric", month: "long" })}
            </p>
          </div>
        </header>

        {/* Stats */}
        {tab === "today" && (
          <div className="dr-stats">
            <div className="dr-stat">
              <Clock size={18} className="dr-stat__ico dr-stat__ico--wait" />
              <div className="dr-stat__val">{waiting}</div>
              <div className="dr-stat__lbl">Ожидают</div>
            </div>
            <div className="dr-stat">
              <Loader size={18} className="dr-stat__ico dr-stat__ico--prog" />
              <div className="dr-stat__val">{inProg}</div>
              <div className="dr-stat__lbl">На приёме</div>
            </div>
            <div className="dr-stat">
              <CheckCircle size={18} className="dr-stat__ico dr-stat__ico--done" />
              <div className="dr-stat__val">{done}</div>
              <div className="dr-stat__lbl">Завершено</div>
            </div>
            <div className="dr-stat">
              <User size={18} className="dr-stat__ico dr-stat__ico--total" />
              <div className="dr-stat__val">{todayPts.length}</div>
              <div className="dr-stat__lbl">Всего</div>
            </div>
          </div>
        )}

        {/* Patient list */}
        <div className="dr-list">
          {loading ? (
            <div className="dr-empty">Загрузка...</div>
          ) : displayed.length === 0 ? (
            <div className="dr-empty">
              {tab === "today" ? "На сегодня записей нет" : "Нет записей"}
            </div>
          ) : (
            displayed.map(p => (
              <div key={p.id} className={`dr-card dr-card--${p.status}`}>
                <div className="dr-card__head" onClick={() => setExpanded(e => e === p.id ? null : p.id)}>
                  <div className="dr-card__left">
                    <div className="dr-card__avatar">{p.lastName?.[0] ?? "П"}</div>
                    <div>
                      <div className="dr-card__name">
                        {p.lastName} {p.firstName} {p.middleName}
                      </div>
                      <div className="dr-card__meta">
                        {p.appointmentDate?.slice(0, 10)} · {p.appointmentTime} · {p.complaint}
                      </div>
                    </div>
                  </div>
                  <div className="dr-card__right">
                    <StatusBadge status={p.status} />
                    <ChevronDown size={16} className={`dr-card__chevron${expanded === p.id ? " dr-card__chevron--open" : ""}`} />
                  </div>
                </div>

                {expanded === p.id && (
                  <div className="dr-card__body">
                    <div className="dr-card__details">
                      <div><span>ИИН</span>{p.iin}</div>
                      <div><span>Телефон</span>{p.phone}</div>
                      <div><span>Дата рождения</span>{p.birthDate}</div>
                      <div><span>Жалоба</span>{p.complaint}</div>
                    </div>

                    {STATUS_NEXT[p.status] && (
                      <button
                        className={`dr-card__btn dr-card__btn--${p.status}`}
                        disabled={updating === p.id}
                        onClick={() => handleStatus(p.id, STATUS_NEXT[p.status])}
                      >
                        {updating === p.id ? "..." : STATUS_BTN[p.status]}
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
