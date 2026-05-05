import { useState } from "react";
import { User, Calendar, FileText, CheckCircle, AlertCircle, AlertTriangle, ArrowRight, Plus, Printer, Check } from "lucide-react";
import { DEPARTMENTS, DOCTORS_BY_DEPT, TIME_SLOTS } from "../constants";
import { todayStr, fmtDate, age } from "../utils";

const EMPTY_FORM = {
  lastName: "", firstName: "", middleName: "", birthDate: "", gender: "",
  phone: "", email: "", address: "", iin: "",
  department: "", doctor: "", appointmentDate: "", appointmentTime: "", complaint: "",
};

const STEP_LABELS = ["Личные данные", "Запись на приём", "Подтверждение"];

export function RegisterPage({ patients, onRegister }) {
  const [step, setStep]     = useState(1);
  const [form, setForm]     = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [done, setDone]     = useState(null);
  const [dupWarn, setDupWarn] = useState(false);

  const change = (e) => {
    const { name, value } = e.target;
    if (name === "department") {
      setForm((p) => ({ ...p, department: value, doctor: "" }));
    } else {
      setForm((p) => ({ ...p, [name]: value }));
    }
    if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
    if (name === "iin" && value.length >= 14) {
      setDupWarn(patients.some((p) => p.iin === value));
    }
  };

  const validate = (s) => {
    const e = {};
    if (s === 1) {
      if (!form.lastName.trim())  e.lastName  = "Введите фамилию";
      if (!form.firstName.trim()) e.firstName = "Введите имя";
      if (!form.birthDate)        e.birthDate = "Выберите дату рождения";
      if (!form.gender)           e.gender    = "Выберите пол";
      if (!form.phone.trim())     e.phone     = "Введите телефон";
      if (!form.iin.trim())       e.iin       = "Введите ИИН";
      else if (form.iin.length < 14) e.iin    = "ИИН должен содержать 14 цифр";
    }
    if (s === 2) {
      if (!form.department)       e.department      = "Выберите отделение";
      if (!form.doctor)           e.doctor          = "Выберите врача";
      if (!form.appointmentDate)  e.appointmentDate = "Выберите дату";
      if (!form.appointmentTime)  e.appointmentTime = "Выберите время";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next   = () => { if (validate(step)) setStep((s) => s + 1); };
  const prev   = () => setStep((s) => s - 1);
  const submit = () => {
    if (!validate(2)) return;
    const queueNum = patients.filter(
      (p) => p.department === form.department && p.appointmentDate === form.appointmentDate
    ).length + 1;
    const newPt = { ...form, id: Date.now(), status: "confirmed", queueNum };
    onRegister(newPt);
    setDone(newPt);
  };
  const reset = () => {
    setStep(1); setForm(EMPTY_FORM); setDone(null); setDupWarn(false); setErrors({});
  };

  if (done) return (
    <div className="succ-outer">
      <div className="succ-card">
        <div className="succ-icon"><CheckCircle size={36} color="#16a34a" /></div>
        <h2 className="succ-h">Пациент зарегистрирован!</h2>
        <p className="succ-p">Запись создана успешно. Талон с номером очереди выдан пациенту.</p>
        <div className="ticket">
          <span className="ticket-num">№{done.queueNum}</span>
          <div className="ticket-row"><span className="ticket-lbl">Пациент</span><span className="ticket-val">{done.lastName} {done.firstName}</span></div>
          <div className="ticket-row"><span className="ticket-lbl">Отделение</span><span className="ticket-val">{done.department}</span></div>
          <div className="ticket-row"><span className="ticket-lbl">Врач</span><span className="ticket-val">{done.doctor}</span></div>
          <div className="ticket-row"><span className="ticket-lbl">Дата и время</span><span className="ticket-val">{fmtDate(done.appointmentDate)} в {done.appointmentTime}</span></div>
        </div>
        <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
          <button className="btn btn-outline" onClick={() => window.print()}><Printer size={14} /> Печать</button>
          <button className="btn btn-primary" style={{ margin: 0 }} onClick={reset}>
            <Plus size={14} /> Новая запись
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="reg-outer">
      <div className="reg-wrap">
        <div className="reg-card">
          <div className="reg-hd">
            <div className="reg-hdtit">Регистрация пациента</div>
            <div className="reg-hdsub">Городская поликлиника №1 · Шаг {step} из 3</div>
          </div>

          <div className="reg-progress">
            <div className="steps">
              {[1, 2, 3].map((s) => (
                <div key={s} style={{ display: "flex", alignItems: "center", flex: s < 3 ? 1 : undefined }}>
                  <div className="step-item">
                    <div className={`step-circ ${s < step ? "done" : s === step ? "curr" : "next"}`}>
                      {s < step ? <Check size={14} /> : s}
                    </div>
                    <div className={`step-lbl ${s === step ? "curr" : ""}`}>{STEP_LABELS[s - 1]}</div>
                  </div>
                  {s < 3 && <div className={`step-line ${s < step ? "done" : "next"}`} />}
                </div>
              ))}
            </div>
          </div>

          <div className="reg-body">
            {step === 1 && <Step1 form={form} errors={errors} change={change} dupWarn={dupWarn} />}
            {step === 2 && <Step2 form={form} errors={errors} change={change} />}
            {step === 3 && <Step3 form={form} />}

            <div className="btnrow">
              {step > 1 ? (
                <button className="btn btn-ghost" onClick={prev}>← Назад</button>
              ) : <div />}
              {step < 3 ? (
                <button className="btn btn-primary" onClick={next}>Далее <ArrowRight size={14} /></button>
              ) : (
                <button className="btn btn-success" onClick={submit}>
                  <CheckCircle size={15} /> Подтвердить регистрацию
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── STEP 1 ───────────────────────────────────────────────────────────────────

function Step1({ form, errors, change, dupWarn }) {
  return (
    <>
      <div className="reg-stit"><User size={20} color="var(--brand)" />Личные данные</div>

      {dupWarn && (
        <div className="dup-warn">
          <AlertTriangle size={18} color="#d97706" style={{ flexShrink: 0, marginTop: 1 }} />
          <span className="dup-txt">Пациент с таким ИИН уже зарегистрирован. Проверьте данные.</span>
        </div>
      )}

      <div className="fgrid3">
        {[["lastName","Фамилия","Иванов",true],["firstName","Имя","Иван",true],["middleName","Отчество","Иванович",false]].map(([n, l, ph, r]) => (
          <div className="fgroup" key={n}>
            <label className="flbl">{l}{r && <span className="req"> *</span>}</label>
            <input type="text" name={n} value={form[n]} onChange={change} placeholder={ph} className={`finp${errors[n] ? " err" : ""}`} />
            {errors[n] && <p className="ferr">{errors[n]}</p>}
          </div>
        ))}
      </div>

      <div className="fgrid2">
        <div className="fgroup">
          <label className="flbl">Дата рождения<span className="req"> *</span></label>
          <input type="date" name="birthDate" value={form.birthDate} onChange={change} className={`finp${errors.birthDate ? " err" : ""}`} />
          {errors.birthDate && <p className="ferr">{errors.birthDate}</p>}
        </div>
        <div className="fgroup">
          <label className="flbl">Пол<span className="req"> *</span></label>
          <select name="gender" value={form.gender} onChange={change} className={`fsel${errors.gender ? " err" : ""}`}>
            <option value="">— выберите —</option>
            <option value="male">Мужской</option>
            <option value="female">Женский</option>
          </select>
          {errors.gender && <p className="ferr">{errors.gender}</p>}
        </div>
      </div>

      <div className="fgrid2">
        <div className="fgroup">
          <label className="flbl">Телефон<span className="req"> *</span></label>
          <input type="tel" name="phone" value={form.phone} onChange={change} placeholder="+996 700 000 000" className={`finp${errors.phone ? " err" : ""}`} />
          {errors.phone && <p className="ferr">{errors.phone}</p>}
        </div>
        <div className="fgroup">
          <label className="flbl">Email</label>
          <input type="email" name="email" value={form.email} onChange={change} placeholder="example@mail.com" className="finp" />
        </div>
      </div>

      <div className="fgrid2">
        <div className="fgroup">
          <label className="flbl">ИИН<span className="req"> *</span></label>
          <input type="text" name="iin" value={form.iin} onChange={change} maxLength={14} placeholder="14 цифр" className={`finp${errors.iin ? " err" : ""}`} />
          {errors.iin && <p className="ferr">{errors.iin}</p>}
        </div>
        <div className="fgroup">
          <label className="flbl">Адрес</label>
          <input type="text" name="address" value={form.address} onChange={change} placeholder="ул., дом, кв." className="finp" />
        </div>
      </div>
    </>
  );
}

// ─── STEP 2 ───────────────────────────────────────────────────────────────────

function Step2({ form, errors, change }) {
  return (
    <>
      <div className="reg-stit"><Calendar size={20} color="var(--brand)" />Запись на приём</div>

      <div className="fgrid2">
        <div className="fgroup">
          <label className="flbl">Отделение<span className="req"> *</span></label>
          <select name="department" value={form.department} onChange={change} className={`fsel${errors.department ? " err" : ""}`}>
            <option value="">— выберите —</option>
            {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
          </select>
          {errors.department && <p className="ferr">{errors.department}</p>}
        </div>
        <div className="fgroup">
          <label className="flbl">Врач<span className="req"> *</span></label>
          <select name="doctor" value={form.doctor} onChange={change} disabled={!form.department} className={`fsel${errors.doctor ? " err" : ""}`}>
            <option value="">— выберите врача —</option>
            {(DOCTORS_BY_DEPT[form.department] || []).map((d) => <option key={d}>{d}</option>)}
          </select>
          {errors.doctor && <p className="ferr">{errors.doctor}</p>}
        </div>
      </div>

      <div className="fgrid2">
        <div className="fgroup">
          <label className="flbl">Дата приёма<span className="req"> *</span></label>
          <input type="date" name="appointmentDate" value={form.appointmentDate} onChange={change} min={todayStr()} className={`finp${errors.appointmentDate ? " err" : ""}`} />
          {errors.appointmentDate && <p className="ferr">{errors.appointmentDate}</p>}
        </div>
        <div className="fgroup">
          <label className="flbl">Время<span className="req"> *</span></label>
          <select name="appointmentTime" value={form.appointmentTime} onChange={change} className={`fsel${errors.appointmentTime ? " err" : ""}`}>
            <option value="">— выберите —</option>
            {TIME_SLOTS.map((t) => <option key={t}>{t}</option>)}
          </select>
          {errors.appointmentTime && <p className="ferr">{errors.appointmentTime}</p>}
        </div>
      </div>

      <div className="fgroup">
        <label className="flbl">Жалобы / причина обращения</label>
        <textarea name="complaint" value={form.complaint} onChange={change} rows={4} placeholder="Опишите симптомы или причину визита…" className="ftxt" />
      </div>
    </>
  );
}

// ─── STEP 3 ───────────────────────────────────────────────────────────────────

function Step3({ form }) {
  return (
    <>
      <div className="reg-stit"><FileText size={20} color="var(--brand)" />Проверьте данные</div>

      <div className="confirm-box">
        <div className="confirm-sec">
          <div className="confirm-title">Личные данные</div>
          <div className="confirm-grid">
            <span className="cl">ФИО</span>
            <span className="cv">{form.lastName} {form.firstName} {form.middleName}</span>
            <span className="cl">Дата рождения</span>
            <span className="cv">{fmtDate(form.birthDate)} ({age(form.birthDate)})</span>
            <span className="cl">Пол</span>
            <span className="cv">{form.gender === "male" ? "Мужской" : "Женский"}</span>
            <span className="cl">Телефон</span>
            <span className="cv">{form.phone}</span>
            <span className="cl">ИИН</span>
            <span className="cv" style={{ fontFamily: "var(--mono)" }}>{form.iin}</span>
            {form.email && <><span className="cl">Email</span><span className="cv">{form.email}</span></>}
          </div>
        </div>
        <div className="confirm-sec">
          <div className="confirm-title">Запись на приём</div>
          <div className="confirm-grid">
            <span className="cl">Отделение</span><span className="cv">{form.department}</span>
            <span className="cl">Врач</span><span className="cv">{form.doctor}</span>
            <span className="cl">Дата</span><span className="cv">{fmtDate(form.appointmentDate)}</span>
            <span className="cl">Время</span><span className="cv" style={{ fontFamily: "var(--mono)" }}>{form.appointmentTime}</span>
          </div>
        </div>
      </div>

      <div className="alert-info">
        <AlertCircle size={17} color="#2563eb" style={{ flexShrink: 0, marginTop: 1 }} />
        <span className="alert-txt">
          После подтверждения пациенту будет выдан талон с номером очереди и временем приёма.
        </span>
      </div>
    </>
  );
}
