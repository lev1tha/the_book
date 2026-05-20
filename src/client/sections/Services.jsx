import { Stethoscope, Activity, Heart, Brain, Baby, Scissors, Star, Eye, Mic2 } from "lucide-react";
import { useI18n } from "../../i18n";
import { DEPARTMENTS } from "../../constants/clinic";

const DEPT_ICONS = {
  Терапия:       <Activity  size={24} />,
  Кардиология:   <Heart     size={24} />,
  Неврология:    <Brain     size={24} />,
  Педиатрия:     <Baby      size={24} />,
  Хирургия:      <Scissors  size={24} />,
  Гинекология:   <Star      size={24} />,
  Офтальмология: <Eye       size={24} />,
  ЛОР:           <Mic2      size={24} />,
};

const DEPT_COLORS = {
  Терапия:"#3b82f6", Кардиология:"#ef4444", Неврология:"#8b5cf6",
  Педиатрия:"#f59e0b", Хирургия:"#10b981", Гинекология:"#ec4899",
  Офтальмология:"#06b6d4", ЛОР:"#f97316",
};

export default function Services({ onBook }) {
  const { t } = useI18n();

  return (
    <section id="services" className="cl-section">
      <div className="cl-section-inner">
        <div className="cl-section-tag"><Stethoscope size={13} /> {t("nav.services")}</div>
        <h2 className="cl-section-title">{t("services.title")}</h2>
        <p className="cl-section-sub">{t("services.subtitle")}</p>
        <div className="cl-services-grid">
          {DEPARTMENTS.map(dept => {
            const color = DEPT_COLORS[dept];
            const svc   = t(`services.${dept}`);
            return (
              <div key={dept} className="cl-svc-card" style={{ "--dcolor": color }} onClick={onBook}>
                <div className="cl-svc-icon" style={{ background: `${color}18`, color }}>
                  {DEPT_ICONS[dept]}
                </div>
                <div className="cl-svc-name" style={{ color }}>{dept}</div>
                <div className="cl-svc-desc">{typeof svc === "object" ? svc.desc : ""}</div>
                <div className="cl-svc-price">
                  {t("services.from")} {typeof svc === "object" ? svc.price : ""} {t("services.currency")}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
