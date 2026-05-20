import { ArrowRight } from "lucide-react";
import { useI18n } from "../../i18n";

export default function Hero({ onBook }) {
  const { t } = useI18n();
  const stats = [
    { val: "15+",   lbl: t("stats.years")       },
    { val: "50+",   lbl: t("stats.doctors")     },
    { val: "8",     lbl: t("stats.departments") },
    { val: "100K+", lbl: t("stats.patients")    },
  ];

  return (
    <section id="hero" className="cl-hero">
      <div className="cl-hero-blob cl-hero-blob1" />
      <div className="cl-hero-blob cl-hero-blob2" />
      <div className="cl-hero-inner">
        <div className="cl-hero-badge">
          <div className="cl-hero-badge-dot" />
          {t("hero.badge")}
        </div>
        <h1 className="cl-hero-title">{t("hero.title")}</h1>
        <p className="cl-hero-sub">{t("hero.subtitle")}</p>
        <div className="cl-hero-btns">
          <button className="cl-btn-primary" onClick={onBook}>
            {t("hero.bookBtn")} <ArrowRight size={16} />
          </button>
          <button className="cl-btn-outline" onClick={() => document.getElementById("services")?.scrollIntoView({ behavior: "smooth" })}>
            {t("hero.servicesBtn")}
          </button>
        </div>
        <div className="cl-hero-stats">
          {stats.map(s => (
            <div key={s.lbl} className="cl-hero-stat">
              <div className="cl-hero-stat-val">{s.val}</div>
              <div className="cl-hero-stat-lbl">{s.lbl}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
