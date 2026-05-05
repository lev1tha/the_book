import { Bell, Plus, ChevronRight } from "lucide-react";

const PAGE_TITLES = {
  dashboard: "Дашборд",
  patients:  "Пациенты",
  queue:     "Очередь на сегодня",
  register:  "Регистрация пациента",
};

export function Topbar({ page, go }) {
  const dateStr = new Date().toLocaleDateString("ru-RU", {
    day: "numeric", month: "long", year: "numeric",
  });

  return (
    <div className="topbar">
      <div className="tb-left">
        <span className="tb-crumb">Поликлиника №1</span>
        <ChevronRight size={14} className="tb-sep" />
        <span className="tb-title">{PAGE_TITLES[page]}</span>
      </div>
      <div className="tb-right">
        <span className="tb-today">{dateStr}</span>
        <button className="tb-icon">
          <Bell size={15} />
          <span className="tb-ndot" />
        </button>
        {page !== "register" && (
          <button className="tb-btn" onClick={() => go("register")}>
            <Plus size={14} /> Новый пациент
          </button>
        )}
      </div>
    </div>
  );
}
