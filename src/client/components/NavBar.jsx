import { useState, useEffect } from "react";
import { Heart, Menu, X, User } from "lucide-react";
import { useI18n } from "../../i18n";

function LangSwitcher() {
  const { lang, switchLang } = useI18n();
  return (
    <div className="cl-lang-btn">
      {["ru", "ky"].map(l => (
        <button key={l} className={`cl-lang-opt${lang === l ? " active" : ""}`} onClick={() => switchLang(l)}>
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}

export default function NavBar({ activeSection, onBook, onAdmin, onPortal }) {
  const { t } = useI18n();
  const [scrolled,    setScrolled]    = useState(false);
  const [mobileOpen,  setMobileOpen]  = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const scrollTo = id => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileOpen(false);
  };

  const links = [
    { id: "about",    label: t("nav.home")     },
    { id: "services", label: t("nav.services") },
    { id: "doctors",  label: t("nav.doctors")  },
    { id: "contacts", label: t("nav.contacts") },
  ];

  return (
    <>
      <nav className={`cl-nav hero-zone${scrolled ? " scrolled" : ""}`}>
        <div className="cl-nav-inner">
          <button className="cl-logo" onClick={() => scrollTo("hero")}>
            <div className="cl-logo-mark">
              <Heart size={20} color="#fff" fill="#fff" />
            </div>
            <div className="cl-logo-text">
              <div className="cl-logo-name">КТП Поликлиника</div>
              <div className="cl-logo-sub">Кыргыз-Түрк</div>
            </div>
          </button>

          <div className="cl-nav-links">
            {links.map(l => (
              <button key={l.id} className={`cl-nav-link${activeSection === l.id ? " active" : ""}`} onClick={() => scrollTo(l.id)}>
                {l.label}
              </button>
            ))}
          </div>

          <div className="cl-nav-right">
            <LangSwitcher />
            <button className="cl-nav-book-btn" onClick={onBook}>{t("nav.booking")}</button>
            <button className="cl-nav-portal-btn" onClick={onPortal}><User size={14} /> Личный кабинет</button>
            <button className={`cl-nav-admin${scrolled ? " dark" : ""}`} onClick={onAdmin}>{t("nav.adminPanel")}</button>
            <button className="cl-menu-btn" onClick={() => setMobileOpen(v => !v)}>
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </nav>

      <div className={`cl-mobile-menu${mobileOpen ? " open" : ""}`} onClick={() => setMobileOpen(false)}>
        <div className="cl-mobile-sheet" onClick={e => e.stopPropagation()}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <span style={{ fontWeight: 700, fontSize: 16 }}>КТП Поликлиника</span>
            <button style={{ background: "none", border: "none", cursor: "pointer" }} onClick={() => setMobileOpen(false)}>
              <X size={20} />
            </button>
          </div>
          {links.map(l => (
            <button key={l.id} className="cl-mobile-link" onClick={() => scrollTo(l.id)}>{l.label}</button>
          ))}
          <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <LangSwitcher />
            <button className="cl-nav-book-btn" style={{ flex: 1 }} onClick={() => { onBook(); setMobileOpen(false); }}>
              {t("nav.booking")}
            </button>
          </div>
          <button className="cl-mobile-link" style={{ textAlign: "center", color: "#1e40af" }} onClick={() => { onAdmin(); setMobileOpen(false); }}>
            {t("nav.adminPanel")}
          </button>
        </div>
      </div>
    </>
  );
}
