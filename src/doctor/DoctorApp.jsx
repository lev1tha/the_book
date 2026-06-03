import { useState, useEffect } from "react";
import {
  Stethoscope, LogOut, User, Clock, CheckCircle,
  Loader, ChevronDown, Calendar, Activity, Info,
  GraduationCap, Code2, Github,
} from "lucide-react";
import { api } from "../api";
import { getUser, clearUser } from "../auth/auth";
import { fmtDate, todayStr } from "../utils/helpers";
import "./doctor.css";

const STATUS_LABEL = {
  confirmed: "Подтверждён",
  waiting: "Ожидает",
  in_progress: "На приёме",
  completed: "Завершён",
  cancelled: "Отменён",
};

const STATUS_NEXT = {
  confirmed: "in_progress",
  waiting: "in_progress",
  in_progress: "completed",
};

const STATUS_BTN = {
  confirmed: "Начать приём",
  waiting: "Начать приём",
  in_progress: "Завершить",
};

function StatusBadge({ status }) {
  return <span className={`dr-badge dr-badge--${status}`}>{STATUS_LABEL[status] ?? status}</span>;
}

// ══════════════════════════════════════════════════════════════
//  СТРАНИЦА «ОБ АВТОРЕ»
//  ↓↓↓ Редактируй только этот блок ↓↓↓
// ══════════════════════════════════════════════════════════════

// Фото автора:
// 1. Положи своё фото в папку: src/assets/author_photo.jpg
// 2. Раскомментируй строку ниже:
// import authorPhoto from "../assets/author_photo.jpg";
// 3. Замени null на authorPhoto:
const AUTHOR_PHOTO = "/assets/auhor_photo.jpeg";

const AUTHOR = {
  name: "Дуйнобаев Жаркынбай Шералиевич",          // ← твоё ФИО
  role: "Разработчик проекта",
  university: "Ошский Государственный Университет",  // ← вуз
  faculty: "Информационные средста технологий",    // ← факультет
  specialty: "программист",          // ← специальность
  group: "ИСТ",                 // ← группа
  year: "2026",                   // ← год защиты
  supervisor: "ФИО научного руководителя", // ← руководитель
  projectName: "Информационная система управления записью пациентов в поликлинике",
  description: "Дипломный проект представляет собой веб-приложение для автоматизации записи пациентов в поликлинике. Система включает личные кабинеты для пациентов, врачей и администраторов, позволяет онлайн-записываться на приём, управлять очередью и отслеживать статус визитов в реальном времени.",
  stack: ["React", "Node.js", "PostgreSQL", "Firebase"],
  github: "", // ← ссылка на GitHub (необязательно)
};

// ══════════════════════════════════════════════════════════════

function AboutPage() {
  return (
    <div className="dr-about">
      <div className="dr-about__header">
        <div className="dr-about__photo-wrap">
          {AUTHOR_PHOTO ? (
            <img src={AUTHOR_PHOTO} alt={AUTHOR.name} className="dr-about__photo" />
          ) : (
            <div className="dr-about__photo-placeholder">
              {AUTHOR.name.split(" ").map(w => w[0]).slice(0, 2).join("")}
            </div>
          )}
        </div>
        <div className="dr-about__author-info">
          <div className="dr-about__badge">Автор проекта</div>
          <h2 className="dr-about__name">{AUTHOR.name}</h2>
          <p className="dr-about__role">{AUTHOR.role}</p>
        </div>
      </div>

      <div className="dr-about__body">
        {/* Данные о проекте */}
        <div className="dr-about__section">
          <div className="dr-about__section-title">
            <Code2 size={15} /> О проекте
          </div>
          <div className="dr-about__project-name">{AUTHOR.projectName}</div>
          <p className="dr-about__desc">{AUTHOR.description}</p>
          <div className="dr-about__stack">
            {AUTHOR.stack.map(t => (
              <span key={t} className="dr-about__tech">{t}</span>
            ))}
          </div>
          {AUTHOR.github && (
            <a href={AUTHOR.github} target="_blank" rel="noreferrer" className="dr-about__github">
              <Github size={14} /> GitHub репозиторий
            </a>
          )}
        </div>

        {/* Данные об авторе */}
        <div className="dr-about__section">
          <div className="dr-about__section-title">
            <GraduationCap size={15} /> Сведения об авторе
          </div>
          <div className="dr-about__meta-grid">
            <div className="dr-about__meta-item">
              <span>Университет</span>
              {AUTHOR.university}
            </div>
            <div className="dr-about__meta-item">
              <span>Факультет</span>
              {AUTHOR.faculty}
            </div>
            <div className="dr-about__meta-item">
              <span>Специальность</span>
              {AUTHOR.specialty}
            </div>
            <div className="dr-about__meta-item">
              <span>Группа</span>
              {AUTHOR.group}
            </div>
            <div className="dr-about__meta-item">
              <span>Год защиты</span>
              {AUTHOR.year}
            </div>
            <div className="dr-about__meta-item">
              <span>Научный руководитель</span>
              {AUTHOR.supervisor}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main app ──────────────────────────────────────────────────
export default function DoctorApp({ onLogout }) {
  const user = getUser();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("today");
  const [expanded, setExpanded] = useState(null);
  const [updating, setUpdating] = useState(null);

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

  const today = todayStr();

  const todayPts = patients.filter(p => (p.appointmentDate || "").slice(0, 10) === today);
  const otherPts = patients.filter(p => (p.appointmentDate || "").slice(0, 10) !== today);
  const displayed = tab === "today" ? todayPts : otherPts;

  const waiting = todayPts.filter(p => p.status === "waiting").length;
  const inProg = todayPts.filter(p => p.status === "in_progress").length;
  const done = todayPts.filter(p => p.status === "completed").length;

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
          <button
            className={`dr-nav__item${tab === "about" ? " dr-nav__item--active" : ""}`}
            onClick={() => setTab("about")}
          >
            <Info size={16} /> Об авторе
          </button>
        </nav>

        <button className="dr-logout" onClick={logout}>
          <LogOut size={15} /> Выйти
        </button>
      </aside>

      {/* Main */}
      <main className="dr-main">
        {tab === "about" && <AboutPage />}

        {tab !== "about" && (<>
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
                          {fmtDate(p.appointmentDate)} · {p.appointmentTime} · {p.complaint}
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
                        <div><span>Дата рождения</span>{fmtDate(p.birthDate)}</div>
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
        </>)}
      </main>
    </div>
  );
}
