import { STATUS_CFG } from "../../constants/clinic";

export default function StatusBadge({ status }) {
  const sc = STATUS_CFG[status] || STATUS_CFG.confirmed;
  return (
    <span className="badge" style={{ background: sc.bg, color: sc.color }}>
      <span className="bdot" style={{ background: sc.dot }} />
      {sc.label}
    </span>
  );
}
