import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { useI18n } from "../../i18n";

export default function Contacts() {
  const { t } = useI18n();

  return (
    <section id="contacts" className="cl-section">
      <div className="cl-section-inner">
        <div className="cl-section-tag"><MapPin size={13} /> {t("nav.contacts")}</div>
        <h2 className="cl-section-title">{t("contacts.title")}</h2>
        <div className="cl-contacts-grid">
          <div className="cl-contact-card">
            {[
              { icon: <MapPin size={18} />, lbl: t("contacts.address"), val: t("contacts.addressVal") },
              { icon: <Phone  size={18} />, lbl: t("contacts.phone"),   val: t("contacts.phoneVal")   },
              { icon: <Mail   size={18} />, lbl: t("contacts.email"),   val: t("contacts.emailVal")   },
            ].map(c => (
              <div key={c.lbl} className="cl-contact-item">
                <div className="cl-contact-ic">{c.icon}</div>
                <div>
                  <div className="cl-contact-lbl">{c.lbl}</div>
                  <div className="cl-contact-val">{c.val}</div>
                </div>
              </div>
            ))}

            <div>
              <div className="cl-contact-item" style={{ marginBottom: 12 }}>
                <div className="cl-contact-ic"><Clock size={18} /></div>
                <div className="cl-contact-lbl" style={{ marginBottom: 0, paddingTop: 10 }}>{t("contacts.hours")}</div>
              </div>
              <div style={{ paddingLeft: 54 }}>
                {[
                  [t("contacts.mf"),  t("contacts.mfVal"),  false],
                  [t("contacts.sat"), t("contacts.satVal"), false],
                  [t("contacts.sun"), t("contacts.sunVal"), true ],
                ].map(([d, v, closed]) => (
                  <div key={d} className="cl-hours-row">
                    <span className="cl-hours-day">{d}</span>
                    <span className={`cl-hours-time${closed ? " closed" : ""}`}>{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="cl-map-box">
            <iframe
              title="map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2924.865!2d74.5926!3d42.8746!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDLCsDUyJzI4LjYiTiA3NMKwMzUnMzMuNCJF!5e0!3m2!1sru!2skg!4v1234567890"
              width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
