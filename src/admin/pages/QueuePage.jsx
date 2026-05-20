import { Calendar, Clock, CheckCircle } from "lucide-react";
import { todayStr, fmtDate } from "../../utils/helpers";
import StatusChanger from "../components/StatusChanger";

export default function QueuePage({ patients, onStatusChange }) {
  const today   = todayStr();
  const todayPts = patients
    .filter(p => p.appointmentDate === today && p.status !== "cancelled")
    .sort((a, b) => a.appointmentTime.localeCompare(b.appointmentTime));

  const byDept    = {};
  todayPts.forEach(p => { if (!byDept[p.department]) byDept[p.department] = []; byDept[p.department].push(p); });
  const waiting   = todayPts.filter(p => p.status === "waiting" || p.status === "in_progress").length;
  const completed = todayPts.filter(p => p.status === "completed").length;

  return (
    <>
      <div className="stats-grid" style={{ gridTemplateColumns: "repeat(3,1fr)" }}>
        <div className="stat-card">
          <div className="stat-top"><span className="stat-lbl">Всего на сегодня</span><div className="stat-ic" style={{ background: "#dbeafe" }}><Calendar size={16} color="#1d4ed8" /></div></div>
          <div className="stat-val">{todayPts.length}</div>
          <div className="stat-foot">записей на {fmtDate(today)}</div>
        </div>
        <div className="stat-card">
          <div className="stat-top"><span className="stat-lbl">Ожидают / На приёме</span><div className="stat-ic" style={{ background: "#fde68a" }}><Clock size={16} color="#b45309" /></div></div>
          <div className="stat-val">{waiting}</div>
          <div className="stat-foot">человек в очереди</div>
        </div>
        <div className="stat-card">
          <div className="stat-top"><span className="stat-lbl">Завершено</span><div className="stat-ic" style={{ background: "#dcfce7" }}><CheckCircle size={16} color="#15803d" /></div></div>
          <div className="stat-val">{completed}</div>
          <div className="stat-foot">приёмов сегодня</div>
        </div>
      </div>

      {Object.keys(byDept).length === 0 ? (
        <div className="card" style={{ padding: "48px 0", textAlign: "center", color: "var(--muted)", fontSize: 14 }}>На сегодня записей нет</div>
      ) : (
        <div className="queue-grid">
          {Object.entries(byDept).map(([dept, pts]) => (
            <div className="qcard" key={dept}>
              <div className="qcard-hd">
                <span className="qcard-dept">{dept}</span>
                <span className="qcard-cnt">{pts.length} чел.</span>
              </div>
              <div>
                {pts.map((p, i) => (
                  <div key={p.id} className={`qitem ${p.status}`}>
                    <div className={`qnum ${p.status === "in_progress" ? "active" : ""}`}>{i + 1}</div>
                    <div>
                      <div className="qname">{p.lastName} {p.firstName}</div>
                      <div className="qtime">{p.appointmentTime} · {p.doctor}</div>
                    </div>
                    <div className="qbadge">
                      <StatusChanger status={p.status} onChange={s => onStatusChange(p.id, s)} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
