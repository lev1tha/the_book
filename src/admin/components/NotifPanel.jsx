import { Bell, AlertTriangle, CheckCircle } from "lucide-react";

const COLORS = {
  warn: { bg: "#fff7ed", ic: "#f59e0b" },
  info: { bg: "#eff6ff", ic: "#3b82f6" },
  ok:   { bg: "#dcfce7", ic: "#22c55e" },
};

const ICONS = {
  warn: <AlertTriangle size={16} />,
  info: <Bell size={16} />,
  ok:   <CheckCircle size={16} />,
};

export default function NotifPanel({ notifs, onMarkAll }) {
  return (
    <div className="notif-panel">
      <div className="np-head">
        <span className="np-title">Уведомления</span>
        <span className="np-mark" onClick={onMarkAll}>Прочитать все</span>
      </div>
      {notifs.length === 0 ? (
        <div className="np-empty">Нет новых уведомлений</div>
      ) : notifs.map(n => {
        const c = COLORS[n.type] || COLORS.info;
        return (
          <div key={n.id} className={`notif-item ${n.read ? "" : "unread"}`}>
            <div className="ni-ic" style={{ background: c.bg, color: c.ic }}>{ICONS[n.type]}</div>
            <div>
              <div className="ni-title">{n.title}</div>
              <div className="ni-body">{n.body || n.text}</div>
              <div className="ni-time">{n.time}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
