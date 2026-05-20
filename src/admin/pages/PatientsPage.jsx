import { useState } from "react";
import { Search, Plus, Eye, Trash2 } from "lucide-react";
import { fmtDate } from "../../utils/helpers";
import StatusBadge from "../components/StatusBadge";
import PatientModal from "../components/PatientModal";

export default function PatientsPage({ patients, onDelete, onStatusChange, onUpdate, go }) {
  const [search, setSearch] = useState("");
  const [sel,    setSel]    = useState(null);

  const filtered = patients.filter(p => {
    const q = `${p.lastName} ${p.firstName} ${p.middleName} ${p.phone} ${p.iin}`.toLowerCase();
    return !search || q.includes(search.toLowerCase());
  });

  return (
    <>
      <div className="card">
        <div className="card-head">
          <div>
            <div className="card-title">Картотека пациентов</div>
            <div className="card-sub">{filtered.length} записей</div>
          </div>
          <div className="card-actions">
            <div className="srch-wrap">
              <Search size={13} className="srch-ico" />
              <input className="srch-inp" placeholder="ФИО, ИИН, телефон…" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <button className="btn btn-primary" style={{ margin: 0 }} onClick={() => go("register")}>
              <Plus size={13} /> Добавить
            </button>
          </div>
        </div>
        <div style={{ padding: "14px 18px", display: "flex", flexDirection: "column", gap: 8 }}>
          {filtered.length === 0 ? (
            <div style={{ textAlign: "center", color: "var(--muted)", padding: "36px 0", fontSize: 13 }}>Пациенты не найдены</div>
          ) : filtered.map(p => (
            <div key={p.id} className="p-card">
              <div className={`pt-av ${p.gender === "male" ? "av-m" : "av-f"}`} style={{ width: 42, height: 42, fontSize: 15, flexShrink: 0 }}>
                {p.lastName[0]}{p.firstName[0]}
              </div>
              <div className="p-card-info">
                <div className="p-card-name">{p.lastName} {p.firstName} {p.middleName}</div>
                <div className="p-card-meta">
                  <span>{p.iin}</span>
                  <span>{p.phone}</span>
                  {p.address && <span>{p.address}</span>}
                </div>
              </div>
              <div className="p-card-appt">
                <div className="p-card-date">{fmtDate(p.appointmentDate)} · {p.appointmentTime}</div>
                <div className="p-card-dept">{p.department} — {p.doctor}</div>
              </div>
              <StatusBadge status={p.status} />
              <div className="acts" style={{ marginLeft: 4 }}>
                <button className="abt view" onClick={() => setSel(p)}><Eye size={13} /></button>
                <button className="abt del"  onClick={() => onDelete(p.id)}><Trash2 size={13} /></button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {sel && (
        <PatientModal
          patient={patients.find(p => p.id === sel.id) || sel}
          onClose={() => setSel(null)}
          onStatusChange={onStatusChange}
          onUpdate={p => { onUpdate(p); setSel(p); }}
        />
      )}
    </>
  );
}
