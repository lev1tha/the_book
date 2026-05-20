import { useI18n } from "../../i18n";
import { DEPARTMENTS } from "../../constants/clinic";

export default function Footer() {
  const { t } = useI18n();
  const scrollTo = id => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <footer className="cl-footer">
      <div className="cl-footer-inner">
        <div className="cl-footer-top">
          <div>
            <div className="cl-footer-logo-name">КТП Поликлиника</div>
            <div className="cl-footer-logo-sub">Кыргыз-Түрк Поликлиникасы</div>
            <p className="cl-footer-desc">{t("hero.subtitle")}</p>
          </div>
          <div>
            <div className="cl-footer-col-title">{t("nav.services")}</div>
            {DEPARTMENTS.map(d => (
              <button key={d} className="cl-footer-link" onClick={() => scrollTo("services")}>{d}</button>
            ))}
          </div>
          <div>
            <div className="cl-footer-col-title">{t("nav.contacts")}</div>
            <button className="cl-footer-link" onClick={() => scrollTo("contacts")}>{t("contacts.addressVal")}</button>
            <button className="cl-footer-link">{t("contacts.phoneVal")}</button>
            <button className="cl-footer-link">{t("contacts.emailVal")}</button>
          </div>
        </div>
        <div className="cl-footer-bottom">
          <span>© 2024 КТП Поликлиника. {t("footer.rights")}</span>
          <div style={{ display: "flex", gap: 16 }}>
            <button className="cl-footer-link">{t("footer.about")}</button>
            <button className="cl-footer-link">{t("footer.policy")}</button>
          </div>
        </div>
      </div>
    </footer>
  );
}
