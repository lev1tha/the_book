import { X, Phone, Mail, MapPin } from "lucide-react";
import { StatusChanger } from "./StatusChanger";
import { fmtDate, age } from "../utils";

export function PatientModal({ patient, onClose, onStatusChange }) {
  if (!patient) return null;

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="mhd">
          <div className="mhd-info">
            <div className={`mhd-av ${patient.gender === "male" ? "m" : "f"}`}>
              {patient.lastName[0]}{patient.firstName[0]}
            </div>
            <div>
              <div className="m-name">
                {patient.lastName} {patient.firstName} {patient.middleName}
              </div>
              <div className="m-id">
                ID #{patient.id} · ИИН: {patient.iin} · {age(patient.birthDate)}
              </div>
            </div>
          </div>
          <button className="mclose" onClick={onClose}><X size={20} /></button>
        </div>

        <div className="mbody">
          <div className="m-section">
            <div className="m-sec-title">Контакты</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div className="m-row-icon"><Phone size={14} />{patient.phone}</div>
              {patient.email && <div className="m-row-icon"><Mail size={14} />{patient.email}</div>}
              {patient.address && <div className="m-row-icon"><MapPin size={14} />{patient.address}</div>}
            </div>
          </div>

          <div className="m-section">
            <div className="m-sec-title">Личные данные</div>
            <div className="m-grid">
              <div>
                <div className="m-label">Дата рождения</div>
                <div className="m-value">{fmtDate(patient.birthDate)}</div>
              </div>
              <div>
                <div className="m-label">Пол</div>
                <div className="m-value">{patient.gender === "male" ? "Мужской" : "Женский"}</div>
              </div>
            </div>
          </div>

          <div className="m-section">
            <div className="m-sec-title">Запись на приём</div>
            <div className="m-grid">
              <div>
                <div className="m-label">Отделение</div>
                <div className="m-value">{patient.department}</div>
              </div>
              <div>
                <div className="m-label">Врач</div>
                <div className="m-value">{patient.doctor}</div>
              </div>
              <div>
                <div className="m-label">Дата</div>
                <div className="m-value">{fmtDate(patient.appointmentDate)}</div>
              </div>
              <div>
                <div className="m-label">Время</div>
                <div className="m-value" style={{ fontFamily: "var(--mono)" }}>{patient.appointmentTime}</div>
              </div>
              <div className="m-full">
                <div className="m-label">Статус</div>
                <div className="m-value" style={{ marginTop: 4 }}>
                  <StatusChanger
                    status={patient.status}
                    onChange={(s) => onStatusChange(patient.id, s)}
                  />
                </div>
              </div>
            </div>
          </div>

          {patient.complaint && (
            <div className="m-section">
              <div className="m-sec-title">Жалобы</div>
              <div className="m-complaint">{patient.complaint}</div>
            </div>
          )}
        </div>

        <div className="m-foot">
          <button className="btn btn-ghost" onClick={onClose}>Закрыть</button>
        </div>
      </div>
    </div>
  );
}
