import { useState } from "react";
import { Search, Users, Clock, CheckCircle, TrendingUp, Eye, Edit2, Trash2 } from "lucide-react";
import { Stethoscope } from "lucide-react";
import { DEPARTMENTS, STATUS_CFG } from "../../constants/clinic";
import { todayStr, fmtDate } from "../../utils/helpers";
import StatusChanger from "../components/StatusChanger";
import PatientModal from "../components/PatientModal";

export default function DashboardPage({ patients, onDelete, onStatusChange, onUpdate }) {
  const [search, setSearch] = useState("");
  const [dept,   setDept]   = useState("");
  const [status, setStatus] = useState("");
  const [sel,    setSel]    = useState(null);
  const today = todayStr();

  const filtered = patients.filter(p => {
    const q = `${p.lastName} ${p.firstName} ${p.middleName} ${p.phone} ${p.iin}`.toLowerCase();
    return (!search || q.includes(search.toLowerCase()))
        && (!dept   || p.department === dept)
        && (!status || p.status === status);
  });

  const stats = [
    { ic: <Users size={17} color="#1d4ed8" />,        bg: "#dbeafe", val: patients.length,                                      lbl: "Всего пациентов",  foot: `+${patients.filter(p => p.appointmentDate === today).length} сегодня` },
    { ic: <Clock size={17} color="#b45309" />,         bg: "#fde68a", val: patients.filter(p => p.status === "waiting").length,  lbl: "Ожидают приёма",   foot: "в очереди сейчас" },
    { ic: <Stethoscope size={17} color="#6d28d9" />,   bg: "#ede9fe", val: patients.filter(p => p.status === "in_progress").length, lbl: "На приёме",     foot: "у врача сейчас" },
    { ic: <CheckCircle size={17} color="#15803d" />,   bg: "#dcfce7", val: patients.filter(p => p.status === "completed").length, lbl: "Завершено",       foot: "приёмов всего" },
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
            <div className="stat-foot"><TrendingUp size={10} className="stat-up" />{s.foot}</div>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="card-head">
          <div>
            <div className="card-title">Журнал пациентов</div>
            <div className="card-sub">{filtered.length} из {patients.length}</div>
          </div>
          <div className="card-actions">
            <div className="srch-wrap">
              <Search size={13} className="srch-ico" />
              <input className="srch-inp" placeholder="ФИО, телефон, ИИН…" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <select className="sel" value={dept} onChange={e => setDept(e.target.value)}>
              <option value="">Все отделения</option>
              {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
            </select>
            <select className="sel" value={status} onChange={e => setStatus(e.target.value)}>
              <option value="">Все статусы</option>
              {Object.entries(STATUS_CFG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
            </select>
          </div>
        </div>
        <div className="tscroll">
          <table>
            <thead>
              <tr>
                <th>Пациент</th><th>Телефон</th><th>Отделение</th><th>Врач</th><th>Дата · Время</th><th>Статус</th><th style={{ width: 90 }}>Действия</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} style={{ textAlign: "center", color: "var(--muted)", padding: "36px 0", fontSize: 13 }}>Записи не найдены</td></tr>
              ) : filtered.map(p => (
                <tr key={p.id}>
                  <td>
                    <div className="pt-cell">
                      <div className={`pt-av ${p.gender === "male" ? "av-m" : "av-f"}`}>{p.lastName[0]}{p.firstName[0]}</div>
                      <div>
                        <div className="pt-name">{p.lastName} {p.firstName}</div>
                        <div className="pt-meta">{p.iin}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ fontFamily: "var(--mono)", fontSize: 12.5 }}>{p.phone}</td>
                  <td><span className="dept-tag">{p.department}</span></td>
                  <td style={{ fontSize: 12.5 }}>{p.doctor}</td>
                  <td style={{ fontFamily: "var(--mono)", fontSize: 12 }}>
                    {fmtDate(p.appointmentDate)}<br /><span style={{ color: "var(--muted)" }}>{p.appointmentTime}</span>
                  </td>
                  <td><StatusChanger status={p.status} onChange={s => onStatusChange(p.id, s)} /></td>
                  <td>
                    <div className="acts">
                      <button className="abt view" onClick={() => setSel(p)}><Eye size={13} /></button>
                      <button className="abt edit" onClick={() => setSel(p)}><Edit2 size={13} /></button>
                      <button className="abt del"  onClick={() => onDelete(p.id)}><Trash2 size={13} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="tfoot">
          <span className="tcnt">Показано {filtered.length} из {patients.length}</span>
          <span className="tcnt">{new Date().toLocaleString("ru-RU")}</span>
        </div>
      </div>

      {sel && (
        <PatientModal
          patient={patients.find(p => p.id === sel.id) || sel}
          onClose={() => setSel(null)}
          onStatusChange={(id, s) => onStatusChange(id, s)}
          onUpdate={p => { onUpdate(p); setSel(p); }}
        />
      )}
    </>
  );
}
