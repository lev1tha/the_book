import { useState } from "react";
import { Search, Eye, Trash2, TrendingUp, Clock, CheckCircle, Activity, Users, Stethoscope } from "lucide-react";
import { StatusChanger } from "../components/StatusChanger";
import { PatientModal } from "../components/PatientModal";
import { DEPARTMENTS, STATUS_CFG } from "../constants";
import { todayStr, fmtDate } from "../utils";

export function DashboardPage({ patients, onDelete, onStatusChange }) {
  const [search, setSearch]     = useState("");
  const [dept, setDept]         = useState("");
  const [status, setStatus]     = useState("");
  const [selected, setSelected] = useState(null);

  const today = todayStr();

  const filtered = patients.filter((p) => {
    const q = `${p.lastName} ${p.firstName} ${p.middleName} ${p.doctor} ${p.phone} ${p.iin}`.toLowerCase();
    return (
      (!search || q.includes(search.toLowerCase())) &&
      (!dept   || p.department === dept) &&
      (!status || p.status === status)
    );
  });

  const stats = [
    { ic: <Users size={18} color="#1d4ed8" />,      bg: "#dbeafe", val: patients.length,                                       lbl: "Всего пациентов",  foot: `+${patients.filter((p) => p.appointmentDate === today).length} сегодня` },
    { ic: <Clock size={18} color="#b45309" />,       bg: "#fde68a", val: patients.filter((p) => p.status === "waiting").length, lbl: "Ожидают приёма",   foot: "в очереди сейчас" },
    { ic: <Stethoscope size={18} color="#6d28d9" />, bg: "#ede9fe", val: patients.filter((p) => p.status === "in_progress").length, lbl: "На приёме",    foot: "у врача сейчас" },
    { ic: <CheckCircle size={18} color="#15803d" />, bg: "#dcfce7", val: patients.filter((p) => p.status === "completed").length,  lbl: "Завершено",     foot: "приёмов всего" },
  ];

  return (
    <>
      <div className="stats-grid">
        {stats.map((s, i) => (
          <div className="stat-card" key={i}>
            <div className="stat-top">
              <span className="stat-lbl">{s.lbl}</span>
              <div className="stat-ic" style={{ background: s.bg }}>{s.ic}</div>
            </div>
            <div className="stat-val">{s.val}</div>
            <div className="stat-foot"><TrendingUp size={11} className="stat-up" />{s.foot}</div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="card-head">
          <div>
            <div className="card-title">Журнал пациентов</div>
            <div className="card-sub">Все записи · {filtered.length} из {patients.length}</div>
          </div>
          <div className="card-actions">
            <div className="srch-wrap">
              <Search size={13} className="srch-ico" />
              <input
                className="srch-inp"
                placeholder="ФИО, телефон, ИИН…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select className="sel" value={dept} onChange={(e) => setDept(e.target.value)}>
              <option value="">Все отделения</option>
              {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
            </select>
            <select className="sel" value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="">Все статусы</option>
              {Object.entries(STATUS_CFG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
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
                <th>Дата · Время</th>
                <th>Статус</th>
                <th style={{ width: 80 }}>Действия</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: "center", color: "var(--muted)", padding: "40px 0" }}>
                    Записи не найдены
                  </td>
                </tr>
              ) : (
                filtered.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <div className="pt-cell">
                        <div className={`pt-av ${p.gender === "male" ? "av-m" : "av-f"}`}>
                          {p.lastName[0]}{p.firstName[0]}
                        </div>
                        <div>
                          <div className="pt-name">{p.lastName} {p.firstName}</div>
                          <div className="pt-meta">ИИН: {p.iin}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ fontFamily: "var(--mono)", fontSize: 13 }}>{p.phone}</td>
                    <td><span className="dept-tag">{p.department}</span></td>
                    <td style={{ color: "var(--ink3)", fontSize: 13 }}>{p.doctor}</td>
                    <td style={{ fontFamily: "var(--mono)", fontSize: 12.5 }}>
                      {fmtDate(p.appointmentDate)}<br />
                      <span style={{ color: "var(--muted)" }}>{p.appointmentTime}</span>
                    </td>
                    <td>
                      <StatusChanger status={p.status} onChange={(s) => onStatusChange(p.id, s)} />
                    </td>
                    <td>
                      <div className="acts">
                        <button className="abt view" onClick={() => setSelected(p)}><Eye size={14} /></button>
                        <button className="abt del"  onClick={() => onDelete(p.id)}><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="tfoot">
          <span className="tcnt">Показано {filtered.length} из {patients.length}</span>
          <span className="tcnt">{new Date().toLocaleString("ru-RU")}</span>
        </div>
      </div>

      {selected && (
        <PatientModal
          patient={selected}
          onClose={() => setSelected(null)}
          onStatusChange={(id, s) => {
            onStatusChange(id, s);
            setSelected((prev) => prev?.id === id ? { ...prev, status: s } : prev);
          }}
        />
      )}
    </>
  );
}
