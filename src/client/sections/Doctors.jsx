import { User, Calendar } from "lucide-react";
import { useI18n } from "../../i18n";
import { DOCTORS_LIST } from "../../constants/clinic";

const DEPT_COLORS = {
  Терапия:"#3b82f6", Кардиология:"#ef4444", Неврология:"#8b5cf6",
  Педиатрия:"#f59e0b", Хирургия:"#10b981", Гинекология:"#ec4899",
  Офтальмология:"#06b6d4", ЛОР:"#f97316",
};

export default function Doctors() {
  const { t } = useI18n();

  return (
    <section id="doctors" className="cl-section cl-doctors">
      <div className="cl-section-inner">
        <div className="cl-section-tag"><User size={13} /> {t("nav.doctors")}</div>
        <h2 className="cl-section-title">{t("doctors.title")}</h2>
        <p className="cl-section-sub">{t("doctors.subtitle")}</p>
        <div className="cl-doctors-grid">
          {DOCTORS_LIST.map(doc => {
            const color    = DEPT_COLORS[doc.dept];
            const initials = doc.name.split(" ").map(w => w[0]).slice(0, 2).join("");
            return (
              <div key={doc.name} className="cl-doc-card">
                <div className="cl-doc-av" style={{ background: `linear-gradient(135deg,${color},${color}cc)`, "--dcolor": color }}>
                  {initials}
                </div>
                <div className="cl-doc-name">{doc.name}</div>
                <div className="cl-doc-dept" style={{ color }}>{doc.dept}</div>
                <div className="cl-doc-meta">
                  <Calendar size={12} /> {doc.exp} {t("doctors.exp")}
                </div>
                <div className="cl-doc-cat">{doc.cat}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
