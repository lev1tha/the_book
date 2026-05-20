import { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";
import StatusBadge from "./StatusBadge";

export default function GlobalSearch({ patients, onSelect, onClose }) {
  const [q, setQ]     = useState("");
  const [sel, setSel] = useState(0);
  const inpRef        = useRef(null);

  useEffect(() => { inpRef.current?.focus(); }, []);

  const results = q.length < 2 ? [] : patients.filter(p => {
    const s = `${p.lastName} ${p.firstName} ${p.middleName} ${p.phone} ${p.iin} ${p.department}`.toLowerCase();
    return s.includes(q.toLowerCase());
  }).slice(0, 8);

  useEffect(() => {
    const handler = e => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowDown") setSel(s => Math.min(s + 1, results.length - 1));
      if (e.key === "ArrowUp")   setSel(s => Math.max(s - 1, 0));
      if (e.key === "Enter" && results[sel]) { onSelect(results[sel]); onClose(); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  });

  return (
    <div className="gs-overlay" onClick={onClose}>
      <div className="gs-box" onClick={e => e.stopPropagation()}>
        <div className="gs-inp-wrap">
          <Search size={18} color="var(--muted)" />
          <input
            ref={inpRef}
            className="gs-inp"
            placeholder="Поиск по имени, ИИН, телефону…"
            value={q}
            onChange={e => { setQ(e.target.value); setSel(0); }}
          />
          <kbd style={{ fontSize: 11, fontFamily: "var(--mono)", color: "var(--muted)", background: "var(--bg)", border: "1px solid var(--border2)", borderRadius: 5, padding: "2px 7px" }}>Esc</kbd>
        </div>
        <div className="gs-results">
          {q.length < 2 ? (
            <div className="gs-empty">Введите минимум 2 символа для поиска</div>
          ) : results.length === 0 ? (
            <div className="gs-empty">Пациенты не найдены</div>
          ) : results.map((p, i) => (
            <div
              key={p.id}
              className={`gs-item ${i === sel ? "sel" : ""}`}
              onClick={() => { onSelect(p); onClose(); }}
              onMouseEnter={() => setSel(i)}
            >
              <div className={`pt-av ${p.gender === "male" ? "av-m" : "av-f"}`} style={{ width: 36, height: 36, fontSize: 13, flexShrink: 0 }}>
                {p.lastName[0]}{p.firstName[0]}
              </div>
              <div>
                <div className="gs-item-name">{p.lastName} {p.firstName} {p.middleName}</div>
                <div className="gs-item-meta">{p.iin} · {p.phone} · {p.department}</div>
              </div>
              <StatusBadge status={p.status} />
            </div>
          ))}
        </div>
        <div className="gs-footer">
          <span className="gs-hint"><kbd className="gs-kbd">↑↓</kbd> навигация</span>
          <span className="gs-hint"><kbd className="gs-kbd">Enter</kbd> открыть</span>
          <span className="gs-hint"><kbd className="gs-kbd">Esc</kbd> закрыть</span>
        </div>
      </div>
    </div>
  );
}
