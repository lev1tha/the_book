import { DEPARTMENTS, STATUS_CFG } from "../../constants/clinic";
import { todayStr } from "../../utils/helpers";

const DEPT_COLORS = ["#3b82f6","#8b5cf6","#f59e0b","#22c55e","#ef4444","#14b8a6","#f97316","#ec4899"];
const COMPLAINTS  = ["Боль в груди","Температура","Головная боль","Плановый осмотр","Боли в спине","Слабость","Кашель","Давление","Боль в животе"];
const COMPLAINT_COLORS = [
  { bg:"#eff6ff",color:"#2563eb" }, { bg:"#f0fdf4",color:"#16a34a" }, { bg:"#fef3c7",color:"#d97706" },
  { bg:"#ede9fe",color:"#7c3aed" }, { bg:"#fff7ed",color:"#ea580c" }, { bg:"#fce7f3",color:"#db2777" },
  { bg:"#ecfdf5",color:"#059669" }, { bg:"#eff6ff",color:"#3b82f6" }, { bg:"#fef9c3",color:"#ca8a04" },
];

export default function AnalyticsPage({ patients }) {
  const today     = new Date();
  const totalPts  = patients.length || 1;

  const days = Array.from({ length: 7 }, (_, i) => {
    const d   = new Date(today); d.setDate(d.getDate() - (6 - i));
    const str = d.toISOString().split("T")[0];
    return { str, cnt: patients.filter(p => p.appointmentDate === str).length, lbl: d.toLocaleDateString("ru-RU", { weekday: "short" }) };
  });
  const maxDay = Math.max(...days.map(d => d.cnt), 1);

  const deptStats = DEPARTMENTS
    .map(d => ({ name: d, cnt: patients.filter(p => p.department === d).length }))
    .filter(d => d.cnt > 0)
    .sort((a, b) => b.cnt - a.cnt);

  const statusStats = Object.entries(STATUS_CFG)
    .map(([k, v]) => ({ key: k, label: v.label, color: v.dot, cnt: patients.filter(p => p.status === k).length }))
    .filter(s => s.cnt > 0);

  return (
    <>
      <div className="analytics-grid">
        <div className="chart-area">
          <div className="chart-title">Нагрузка за последние 7 дней</div>
          <div className="bar-chart">
            {days.map(d => (
              <div key={d.str} className="bar-wrap">
                <div className="bar-val">{d.cnt || ""}</div>
                <div className="bar-fill"
                  style={{ height: `${Math.round((d.cnt / maxDay) * 120)}px`, background: d.str === todayStr() ? "var(--brand)" : "#bfdbfe" }}
                  title={`${d.lbl}: ${d.cnt} пациентов`}
                />
                <span className="bar-lbl">{d.lbl}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="chart-area">
          <div className="chart-title">По статусам</div>
          <div className="pie-wrap">
            {statusStats.map(s => (
              <div key={s.key} className="pie-item">
                <span className="pie-dot" style={{ background: s.color }} />
                <span className="pie-name">{s.label}</span>
                <span className="pie-cnt">{s.cnt}</span>
                <span className="pie-pct">{Math.round(s.cnt / totalPts * 100)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="chart-area">
        <div className="chart-title">Нагрузка по отделениям</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {deptStats.map((d, i) => (
            <div key={d.name} style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 12.5, color: "var(--ink3)", width: 140, flexShrink: 0 }}>{d.name}</span>
              <div style={{ flex: 1, background: "#f1f5f9", borderRadius: 6, overflow: "hidden", height: 22 }}>
                <div style={{
                  height: "100%", borderRadius: 6,
                  background: DEPT_COLORS[i % DEPT_COLORS.length],
                  width: `${Math.round(d.cnt / totalPts * 100)}%`,
                  display: "flex", alignItems: "center", paddingLeft: 8,
                  transition: "width .4s ease",
                }}>
                  {d.cnt > 0 && <span style={{ fontSize: 11, fontWeight: 700, color: "#fff", fontFamily: "var(--mono)" }}>{d.cnt}</span>}
                </div>
              </div>
              <span style={{ fontSize: 12, fontFamily: "var(--mono)", color: "var(--muted)", width: 36, textAlign: "right" }}>{Math.round(d.cnt / totalPts * 100)}%</span>
            </div>
          ))}
        </div>
      </div>

      <div className="chart-area">
        <div className="chart-title">Частые жалобы</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {COMPLAINTS.map((c, i) => (
            <span key={c} style={{ padding: "5px 13px", borderRadius: 20, fontSize: 12.5, fontWeight: 500, background: COMPLAINT_COLORS[i].bg, color: COMPLAINT_COLORS[i].color }}>
              {c}
            </span>
          ))}
        </div>
      </div>
    </>
  );
}
