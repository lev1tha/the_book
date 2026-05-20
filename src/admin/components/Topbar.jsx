import { Search, Bell, Plus, ChevronRight, LogOut } from "lucide-react";
import { getUser } from "../../auth/auth";

const PAGE_TITLES = {
  dashboard: "Дашборд",
  patients:  "Пациенты",
  queue:     "Очередь на сегодня",
  schedule:  "Расписание",
  analytics: "Аналитика",
  register:  "Регистрация пациента",
};

export default function Topbar({ page, go, notifCount, onNotif, onSearch, onLogout }) {
  const user    = getUser();
  const dateStr = new Date().toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" });

  return (
    <div className="topbar">
      <div className="tb-left">
        <span className="tb-crumb">Поликлиника №1</span>
        <ChevronRight size={13} className="tb-sep" />
        <span className="tb-title">{PAGE_TITLES[page]}</span>
      </div>
      <div className="tb-right">
        <div className="tb-search" onClick={onSearch}>
          <Search size={14} />
          <span>Быстрый поиск</span>
          <kbd className="tb-kbd">⌘K</kbd>
        </div>
        <span className="tb-today">{dateStr}</span>
        <button className="tb-icon" onClick={onNotif}>
          <Bell size={15} />
          {notifCount > 0 && <span className="tb-ndot" />}
        </button>
        {page !== "register" && (
          <button className="tb-btn" onClick={() => go("register")}>
            <Plus size={14} /> Пациент
          </button>
        )}
        {onLogout && (
          <button className="tb-icon tb-icon--logout" title={`Выйти (${user?.name ?? ""})`} onClick={onLogout}>
            <LogOut size={15} />
          </button>
        )}
      </div>
    </div>
  );
}
