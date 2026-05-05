import { useState } from "react";
import { Search, Eye, Trash2, Plus, Phone, MapPin, Hash } from "lucide-react";
import { StatusBadge } from "../components/StatusBadge";
import { PatientModal } from "../components/PatientModal";
import { fmtDate } from "../utils";

export function PatientsPage({ patients, onDelete, onStatusChange, go }) {
  const [search, setSearch]     = useState("");
  const [selected, setSelected] = useState(null);

  const filtered = patients.filter((p) => {
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
              <input
                className="srch-inp"
                placeholder="ФИО, ИИН, телефон…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button
              className="btn btn-primary"
              style={{ marginLeft: 0 }}
              onClick={() => go("register")}
            >
              <Plus size={14} /> Добавить
            </button>
          </div>
        </div>

        <div style={{ padding: "16px 20px" }}>
          <div className="patient-list">
            {filtered.length === 0 ? (
              <div style={{ textAlign: "center", color: "var(--muted)", padding: "40px 0", fontSize: 14 }}>
                Пациенты не найдены
              </div>
            ) : (
              filtered.map((p) => (
                <div key={p.id} className="p-card">
                  <div
                    className={`pt-av ${p.gender === "male" ? "av-m" : "av-f"}`}
                    style={{ width: 44, height: 44, fontSize: 16 }}
                  >
                    {p.lastName[0]}{p.firstName[0]}
                  </div>
                  <div className="p-card-info">
                    <div className="p-card-name">{p.lastName} {p.firstName} {p.middleName}</div>
                    <div className="p-card-meta">
                      <span><Hash size={10} style={{ display: "inline", marginRight: 2 }} />{p.iin}</span>
                      <span><Phone size={10} style={{ display: "inline", marginRight: 2 }} />{p.phone}</span>
                      {p.address && <span><MapPin size={10} style={{ display: "inline", marginRight: 2 }} />{p.address}</span>}
                    </div>
                  </div>
                  <div className="p-card-appt">
                    <div className="p-card-date">{fmtDate(p.appointmentDate)} · {p.appointmentTime}</div>
                    <div className="p-card-dept">{p.department} — {p.doctor}</div>
                  </div>
                  <StatusBadge status={p.status} />
                  <div className="acts" style={{ marginLeft: 4 }}>
                    <button className="abt view" onClick={() => setSelected(p)}><Eye size={14} /></button>
                    <button className="abt del"  onClick={() => onDelete(p.id)}><Trash2 size={14} /></button>
                  </div>
                </div>
              ))
            )}
          </div>
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
