import { useState } from "react";
import { Calendar } from "lucide-react";
import { DEPARTMENTS, DOCTORS_BY_DEPT, TIME_SLOTS } from "../../constants/clinic";
import { todayStr, addDays } from "../../utils/helpers";

export default function SchedulePage({ patients, onSelect, onAdd }) {
  const [selDept, setSelDept] = useState(DEPARTMENTS[0]);
  const [selDate, setSelDate] = useState(todayStr());

  const doctors = DOCTORS_BY_DEPT[selDept] || [];
  const dayPts  = patients.filter(p => p.department === selDept && p.appointmentDate === selDate);
  const slotPt  = (doc, time) => dayPts.find(p => p.doctor === doc && p.appointmentTime === time);
  const gridStyle = { gridTemplateColumns: `80px repeat(${doctors.length},1fr)` };

  return (
    <div className="card">
      <div className="sch-filter">
        <Calendar size={15} color="var(--muted)" />
        <select className="sel" value={selDept} onChange={e => setSelDept(e.target.value)}>
          {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
        </select>
        <input
          type="date" className="sel" value={selDate}
          onChange={e => setSelDate(e.target.value)}
          min={addDays(todayStr(), -7)} max={addDays(todayStr(), 30)}
        />
        <span style={{ fontSize: 12, fontFamily: "var(--mono)", color: "var(--muted)", marginLeft: 4 }}>
          {dayPts.length} записей
        </span>
      </div>

      <div style={{ overflowX: "auto" }}>
        <div className="sch-head" style={gridStyle}>
          <div className="sch-head-cell">Время</div>
          {doctors.map(d => <div key={d} className="sch-head-cell">{d}</div>)}
        </div>
        {TIME_SLOTS.map(time => (
          <div key={time} className="sch-row" style={gridStyle}>
            <div className="sch-time">{time}</div>
            {doctors.map(doc => {
              const p = slotPt(doc, time);
              return (
                <div key={doc} className="sch-cell">
                  {p ? (
                    <button className={`sch-slot ${p.status}`} onClick={() => onSelect(p)}>
                      {p.lastName} {p.firstName[0]}.
                    </button>
                  ) : (
                    <div className="sch-empty" onClick={() => onAdd(selDept, doc, selDate, time)}>+ запись</div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
