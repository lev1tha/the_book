import { LayoutDashboard, Users, ClipboardList, List, CalendarDays, BarChart2, Stethoscope } from "lucide-react";
import { todayStr } from "../../utils/helpers";

export default function Sidebar({ page, go, patients }) {
  const today = todayStr();
  const todayWaiting = patients.filter(
    p => p.appointmentDate === today && (p.status === "waiting" || p.status === "in_progress")
  ).length;

  const nav = [
    { id: "dashboard", icon: <LayoutDashboard size={17} />, label: "Дашборд" },
    { id: "patients",  icon: <Users size={17} />,           label: "Пациенты" },
    { id: "queue",     icon: <List size={17} />,             label: "Очередь",     badge: todayWaiting || null },
    { id: "schedule",  icon: <CalendarDays size={17} />,     label: "Расписание" },
    { id: "analytics", icon: <BarChart2 size={17} />,        label: "Аналитика" },
    { id: "register",  icon: <ClipboardList size={17} />,    label: "Регистрация" },
  ];

  return (
    <aside className="sb">
      <div className="sb-logo">
        <div className="sb-mark"><Stethoscope size={19} color="#fff" /></div>
        <div>
          <div className="sb-title">Поликлиника №1</div>
          <div className="sb-sub">medpolis.kg</div>
        </div>
      </div>
      <nav className="sb-nav">
        <div className="sb-section">Меню</div>
        {nav.map(n => (
          <button key={n.id} className={`sb-item ${page === n.id ? "active" : ""}`} onClick={() => go(n.id)}>
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
