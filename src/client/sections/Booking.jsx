import { useState } from "react";
import { Calendar, CheckCircle, Send, AlertCircle } from "lucide-react";
import { useI18n } from "../../i18n";
import { api } from "../../api";
import { DEPARTMENTS, DOCTORS_BY_DEPT, TIME_SLOTS } from "../../constants/clinic";
import { todayStr, fmtDate } from "../../utils/helpers";

const EMPTY = {
  lastName: "", firstName: "", middleName: "",
  iin: "", phone: "", email: "",
  department: "", doctor: "",
  appointmentDate: "", appointmentTime: "",
  complaint: "",
};

export default function Booking({ bookRef }) {
  const { t } = useI18n();
  const [step,    setStep]    = useState(1);
  const [done,    setDone]    = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiErr,  setApiErr]  = useState("");
  const [form,    setForm]    = useState(EMPTY);
  const [errs,    setErrs]    = useState({});

  const change = e => {
    const { name, value } = e.target;
    if (name === "department") {
      setForm(p => ({ ...p, department: value, doctor: "" }));
    } else {
      setForm(p => ({ ...p, [name]: value }));
    }
    if (errs[name]) setErrs(p => ({ ...p, [name]: "" }));
  };

  const validate1 = () => {
    const e = {};
    if (!form.lastName.trim())  e.lastName  = t("booking.required");
    if (!form.firstName.trim()) e.firstName = t("booking.required");
    if (!form.iin.trim())       e.iin       = t("booking.required");
    else if (form.iin.replace(/\D/g, "").length < 14) e.iin = t("booking.errIin");
    if (!form.phone.trim())     e.phone     = t("booking.errPhone");
    setErrs(e);
    return Object.keys(e).length === 0;
  };

  const validate2 = () => {
    const e = {};
    if (!form.department)      e.department      = t("booking.required");
    if (!form.doctor)          e.doctor          = t("booking.required");
    if (!form.appointmentDate) e.appointmentDate = t("booking.required");
    else if (form.appointmentDate < todayStr()) e.appointmentDate = t("booking.errDate");
    if (!form.appointmentTime) e.appointmentTime = t("booking.required");
    setErrs(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (step === 1 && !validate1()) return;
    if (step === 2 && !validate2()) return;
    if (step < 3) { setStep(s => s + 1); setErrs({}); setApiErr(""); }
  };

  const back = () => { setStep(s => s - 1); setErrs({}); setApiErr(""); };

  const submit = async () => {
    setLoading(true);
    setApiErr("");
    try {
      await api.createBooking(form);
      setDone(true);
    } catch (e) {
      setApiErr(e.message || "Ошибка сервера. Попробуйте позже.");
    } finally {
      setLoading(false);
    }
  };

  const steps = [t("booking.s1"), t("booking.s2"), t("booking.s3")];

  const confirmRows = [
    [t("booking.lastName"),   `${form.lastName} ${form.firstName} ${form.middleName}`.trim()],
    ["ИИН",                   form.iin],
    [t("booking.phone"),      form.phone],
    [t("booking.department"), form.department],
    [t("booking.doctor"),     form.doctor],
    [t("booking.date"),       fmtDate(form.appointmentDate)],
    [t("booking.time"),       form.appointmentTime],
  ];

  return (
    <div ref={bookRef} id="booking" style={{ scrollMarginTop: 80 }}>
      <section className="cl-section cl-booking">
        <div className="cl-section-inner">
          <div className="cl-section-tag"><Calendar size={13} /> {t("booking.onlineLabel")}</div>
          <h2 className="cl-section-title">{t("booking.title")}</h2>
          {!done && <p className="cl-section-sub">{t("booking.subtitle")}</p>}

          <div className="cl-book-wrap">
            {done ? (
              <div className="cl-book-success">
                <div className="cl-success-ic"><CheckCircle size={34} color="#16a34a" /></div>
                <div className="cl-success-title">{t("booking.successTitle")}</div>
                <p className="cl-success-text">{t("booking.successText")}</p>
                <div className="cl-book-success-hint">
                  💡 Войдите в <b>Личный кабинет</b> по ИИН <b>{form.iin}</b> и телефону <b>{form.phone}</b> чтобы отслеживать запись
                </div>
                <button className="cl-bbtn cl-bbtn-primary" onClick={() => { setDone(false); setStep(1); setForm(EMPTY); }}>
                  {t("booking.newBooking")}
                </button>
              </div>
            ) : (
              <>
                <div className="cl-book-steps">
                  {steps.map((s, i) => {
                    const n   = i + 1;
                    const cls = n < step ? "done" : n === step ? "active" : "";
                    return (
                      <div key={s} className={`cl-book-step ${cls}`}>
                        <div className="cl-book-step-num">{n < step ? <CheckCircle size={12} /> : n}</div>
                        {s}
                      </div>
                    );
                  })}
                </div>

                <div className="cl-book-body">
                  {/* ── Шаг 1: Личные данные ── */}
                  {step === 1 && (
                    <>
                      <div className="cl-form-grid3">
                        {[["lastName", t("booking.lastName"), true], ["firstName", t("booking.firstName"), true], ["middleName", t("booking.middleName"), false]].map(([n, l, req]) => (
                          <div className="cl-fg" key={n}>
                            <label className="cl-flbl">{l}{req && <span style={{ color: "#ef4444" }}> *</span>}</label>
                            <input name={n} value={form[n]} onChange={change} className={`cl-finp${errs[n] ? " err" : ""}`} />
                            {errs[n] && <p className="cl-ferr">{errs[n]}</p>}
                          </div>
                        ))}
                      </div>

                      <div className="cl-form-grid2" style={{ marginTop: 16 }}>
                        <div className="cl-fg">
                          <label className="cl-flbl">ИИН (14 цифр)<span style={{ color: "#ef4444" }}> *</span></label>
                          <input
                            name="iin"
                            value={form.iin}
                            onChange={change}
                            placeholder="85031200001234"
                            maxLength={14}
                            inputMode="numeric"
                            className={`cl-finp${errs.iin ? " err" : ""}`}
                          />
                          {errs.iin && <p className="cl-ferr">{errs.iin}</p>}
                        </div>
                        <div className="cl-fg">
                          <label className="cl-flbl">{t("booking.phone")}<span style={{ color: "#ef4444" }}> *</span></label>
                          <input name="phone" value={form.phone} onChange={change} placeholder="+996 700 000 000" className={`cl-finp${errs.phone ? " err" : ""}`} />
                          {errs.phone && <p className="cl-ferr">{errs.phone}</p>}
                        </div>
                      </div>

                      <div className="cl-fg" style={{ marginTop: 12 }}>
                        <label className="cl-flbl">{t("booking.email")}</label>
                        <input name="email" value={form.email} onChange={change} placeholder="example@mail.com" className="cl-finp" />
                      </div>

                      <div className="cl-book-iin-hint">
                        💡 ИИН нужен чтобы войти в <b>Личный кабинет</b> и отслеживать свою запись
                      </div>
                    </>
                  )}

                  {/* ── Шаг 2: Выбор врача ── */}
                  {step === 2 && (
                    <>
                      <div className="cl-form-grid2">
                        <div className="cl-fg">
                          <label className="cl-flbl">{t("booking.department")}<span style={{ color: "#ef4444" }}> *</span></label>
                          <select name="department" value={form.department} onChange={change} className={`cl-fsel${errs.department ? " err" : ""}`}>
                            <option value="">{t("booking.choose")}</option>
                            {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
                          </select>
                          {errs.department && <p className="cl-ferr">{errs.department}</p>}
                        </div>
                        <div className="cl-fg">
                          <label className="cl-flbl">{t("booking.doctor")}<span style={{ color: "#ef4444" }}> *</span></label>
                          <select name="doctor" value={form.doctor} onChange={change} disabled={!form.department} className={`cl-fsel${errs.doctor ? " err" : ""}`}>
                            <option value="">{t("booking.chooseDoc")}</option>
                            {(DOCTORS_BY_DEPT[form.department] || []).map(d => <option key={d}>{d}</option>)}
                          </select>
                          {errs.doctor && <p className="cl-ferr">{errs.doctor}</p>}
                        </div>
                      </div>
                      <div className="cl-form-grid2" style={{ marginTop: 16 }}>
                        <div className="cl-fg">
                          <label className="cl-flbl">{t("booking.date")}<span style={{ color: "#ef4444" }}> *</span></label>
                          <input type="date" name="appointmentDate" value={form.appointmentDate} onChange={change} min={todayStr()} className={`cl-finp${errs.appointmentDate ? " err" : ""}`} />
                          {errs.appointmentDate && <p className="cl-ferr">{errs.appointmentDate}</p>}
                        </div>
                        <div className="cl-fg">
                          <label className="cl-flbl">{t("booking.time")}<span style={{ color: "#ef4444" }}> *</span></label>
                          <select name="appointmentTime" value={form.appointmentTime} onChange={change} className={`cl-fsel${errs.appointmentTime ? " err" : ""}`}>
                            <option value="">{t("booking.choose")}</option>
                            {TIME_SLOTS.map(s => <option key={s}>{s}</option>)}
                          </select>
                          {errs.appointmentTime && <p className="cl-ferr">{errs.appointmentTime}</p>}
                        </div>
                      </div>
                      <div className="cl-fg" style={{ marginTop: 16 }}>
                        <label className="cl-flbl">{t("booking.complaint")}</label>
                        <textarea name="complaint" value={form.complaint} onChange={change} className="cl-ftxt" rows={3} />
                      </div>
                    </>
                  )}

                  {/* ── Шаг 3: Подтверждение ── */}
                  {step === 3 && (
                    <>
                      <div className="cl-confirm-box">
                        {confirmRows.map(([l, v]) => (
                          <div key={l} className="cl-confirm-row">
                            <span className="cl-cl">{l}</span>
                            <span className="cl-cv">{v || "—"}</span>
                          </div>
                        ))}
                      </div>
                      {apiErr && (
                        <div className="cl-book-apierr">
                          <AlertCircle size={15} /> {apiErr}
                        </div>
                      )}
                    </>
                  )}

                  <div className="cl-book-btns">
                    {step > 1
                      ? <button className="cl-bbtn cl-bbtn-ghost" onClick={back}>{t("booking.back")}</button>
                      : <div />
                    }
                    {step < 3
                      ? <button className="cl-bbtn cl-bbtn-primary" onClick={next}>{t("booking.next")}</button>
                      : <button className="cl-bbtn cl-bbtn-primary" onClick={submit} disabled={loading} style={{ gap: 8 }}>
                          <Send size={14} /> {loading ? "..." : t("booking.submit")}
                        </button>
                    }
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
