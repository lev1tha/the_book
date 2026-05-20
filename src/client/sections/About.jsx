import { Heart, Shield, Award, Users, TrendingUp } from "lucide-react";
import { useI18n } from "../../i18n";

export default function About() {
  const { t } = useI18n();
  const feats = [
    { key: "f1", icon: <Shield    size={14} color="#1e40af" /> },
    { key: "f2", icon: <Award     size={14} color="#1e40af" /> },
    { key: "f3", icon: <Users     size={14} color="#1e40af" /> },
    { key: "f4", icon: <TrendingUp size={14} color="#1e40af" /> },
  ];

  return (
    <section id="about" className="cl-section cl-about">
      <div className="cl-section-inner">
        <div className="cl-section-tag"><Heart size={13} /> {t("nav.home")}</div>
        <h2 className="cl-section-title">{t("about.title")}</h2>
        <div className="cl-about-grid">
          <div>
            <div className="cl-about-text">
              <p>{t("about.text1")}</p>
              <p>{t("about.text2")}</p>
            </div>
            <div className="cl-about-features">
              {feats.map(f => (
                <div key={f.key} className="cl-about-feat">
                  <div className="cl-about-feat-ic">{f.icon}</div>
                  {t(`about.${f.key}`)}
                </div>
              ))}
            </div>
          </div>
          <div className="cl-about-visual">
            {[
              { val: "15+",   lbl: t("stats.years")   },
              { val: "50+",   lbl: t("stats.doctors")  },
              { val: "100K+", lbl: t("stats.patients") },
            ].map(s => (
              <div key={s.lbl} className="cl-av-stat">
                <div>
                  <div className="cl-av-val">{s.val}</div>
                  <div className="cl-av-lbl">{s.lbl}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
