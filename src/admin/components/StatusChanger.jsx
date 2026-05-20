import { useState, useEffect, useRef } from "react";
import { ChevronDown, Check } from "lucide-react";
import { STATUS_CFG } from "../../constants/clinic";

export default function StatusChanger({ status, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const handler = e => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const sc = STATUS_CFG[status] || STATUS_CFG.confirmed;

  return (
    <div className="status-wrap" ref={ref}>
      <span
        className="badge"
        style={{ background: sc.bg, color: sc.color, cursor: "pointer", userSelect: "none" }}
        onClick={() => setOpen(v => !v)}
      >
        <span className="bdot" style={{ background: sc.dot }} />
        {sc.label}
        <ChevronDown size={10} style={{ marginLeft: 2 }} />
      </span>
      {open && (
        <div className="sdrop">
          {Object.entries(STATUS_CFG).map(([k, v]) => (
            <div key={k} className="sopt" onClick={() => { onChange(k); setOpen(false); }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: v.dot, display: "inline-block", flexShrink: 0 }} />
              <span style={{ color: v.color, fontSize: 12.5, fontWeight: 600 }}>{v.label}</span>
              {k === status && <Check size={12} style={{ marginLeft: "auto", color: "#9ca3af" }} />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
