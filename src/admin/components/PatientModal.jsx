import { useState } from "react";
import { X, Phone, Mail, MapPin, Edit2, Save } from "lucide-react";
import { DEPARTMENTS, DOCTORS_BY_DEPT, TIME_SLOTS } from "../../constants/clinic";
import { fmtDate, calcAge } from "../../utils/helpers";
import StatusChanger from "./StatusChanger";

export default function PatientModal({ patient, onClose, onStatusChange, onUpdate }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm]       = useState({ ...patient });

  if (!patient) return null;

  const change = e => {
    const { name, value } = e.target;
    if (name === "department") setForm(p => ({ ...p, department: value, doctor: "" }));
    else setForm(p => ({ ...p, [name]: value }));
  };

  const save = () => { onUpdate(form); setEditing(false); };

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="mhd">
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div className={`mhd-av ${patient.gender === "male" ? "m" : "f"}`}>
              {patient.lastName[0]}{patient.firstName[0]}
            </div>
            <div>
              <div className="m-name">{patient.lastName} {patient.firstName} {patient.middleName}</div>
              <div className="m-id">ID #{patient.id} · ИИН: {patient.iin} · {calcAge(patient.birthDate)}</div>
            </div>
          </div>
          <button className="mclose" onClick={onClose}><X size={20} /></button>
        </div>

        <div className="mbody">
          {!editing ? (
            <>
              <div className="msect">
                <div className="msect-t">Контакты</div>
                <div className="mrow-ic"><Phone size={14} />{patient.phone}</div>
                {patient.email   && <div className="mrow-ic"><Mail size={14} />{patient.email}</div>}
                {patient.address && <div className="mrow-ic"><MapPin size={14} />{patient.address}</div>}
              </div>
              <div className="msect">
                <div className="msect-t">Личные данные</div>
                <div className="mgrid">
                  <div className="mf"><div className="mfl">Дата рождения</div><div className="mfv">{fmtDate(patient.birthDate)}</div></div>
                  <div className="mf"><div className="mfl">Пол</div><div className="mfv">{patient.gender === "male" ? "Мужской" : "Женский"}</div></div>
                </div>
              </div>
              <div className="msect">
                <div className="msect-t">Запись на приём</div>
                <div className="mgrid">
                  <div className="mf"><div className="mfl">Отделение</div><div className="mfv">{patient.department}</div></div>
                  <div className="mf"><div className="mfl">Врач</div><div className="mfv">{patient.doctor}</div></div>
                  <div className="mf"><div className="mfl">Дата</div><div className="mfv">{fmtDate(patient.appointmentDate)}</div></div>
                  <div className="mf"><div className="mfl">Время</div><div className="mfv mono">{patient.appointmentTime}</div></div>
                  <div className="mf mfull">
                    <div className="mfl">Статус</div>
                    <div className="mfv">
                      <StatusChanger status={patient.status} onChange={s => onStatusChange(patient.id, s)} />
                    </div>
                  </div>
                </div>
              </div>
              {patient.complaint && (
                <div className="msect">
                  <div className="msect-t">Жалобы</div>
                  <div className="mcomplaint">{patient.complaint}</div>
                </div>
              )}
            </>
          ) : (
            <>
              <div className="edit-grid">
                {[["lastName","Фамилия"],["firstName","Имя"],["middleName","Отчество"],["phone","Телефон"],["email","Email"],["address","Адрес"]].map(([n, l]) => (
                  <div className="efg" key={n}>
                    <label className="efl">{l}</label>
                    <input name={n} value={form[n] || ""} onChange={change} className="einp" />
                  </div>
                ))}
              </div>
              <div className="edit-grid">
                <div className="efg">
                  <label className="efl">Отделение</label>
                  <select name="department" value={form.department} onChange={change} className="esel">
                    {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
                <div className="efg">
                  <label className="efl">Врач</label>
                  <select name="doctor" value={form.doctor} onChange={change} className="esel">
                    {(DOCTORS_BY_DEPT[form.department] || []).map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
                <div className="efg">
                  <label className="efl">Дата приёма</label>
                  <input type="date" name="appointmentDate" value={form.appointmentDate} onChange={change} className="einp" />
                </div>
                <div className="efg">
                  <label className="efl">Время</label>
                  <select name="appointmentTime" value={form.appointmentTime} onChange={change} className="esel">
                    {TIME_SLOTS.map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div className="efg">
                <label className="efl">Жалобы</label>
                <textarea name="complaint" value={form.complaint || ""} onChange={change} className="etxt" />
              </div>
            </>
          )}
        </div>

        <div className="m-foot">
          {!editing ? (
            <>
              <button className="btn btn-ghost" onClick={onClose}>Закрыть</button>
              <button className="btn btn-outline" onClick={() => setEditing(true)}>
                <Edit2 size={13} /> Редактировать
              </button>
            </>
          ) : (
            <>
              <button className="btn btn-ghost" onClick={() => { setForm({ ...patient }); setEditing(false); }}>Отмена</button>
              <button className="btn btn-success" onClick={save}><Save size={13} /> Сохранить</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
