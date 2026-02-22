import React, { useState } from "react";
import {
  Calendar,
  User,
  Phone,
  MapPin,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

const styles = `
  .container {
    min-height: 100vh;
    background: linear-gradient(to bottom right, #eff6ff, #e0e7ff);
    padding: 2rem 1rem;
  }

  .maxWidth {
    max-width: 64rem;
    margin: 0 auto;
  }

  .card {
    background: white;
    border-radius: 1rem;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    overflow: hidden;
  }

  .header {
    background: linear-gradient(to right, #2563eb, #4f46e5);
    color: white;
    padding: 1.5rem;
  }

  .headerTitle {
    font-size: 1.875rem;
    font-weight: bold;
    text-align: center;
    margin: 0;
  }

  .headerSubtitle {
    text-align: center;
    color: #bfdbfe;
    margin-top: 0.5rem;
  }

  .progressBar {
    background: #f3f4f6;
    padding: 1rem 1.5rem;
  }

  .progressContainer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    max-width: 28rem;
    margin: 0 auto;
  }

  .progressStep {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .progressStepActive {
    color: #2563eb;
  }

  .progressStepInactive {
    color: #9ca3af;
  }

  .progressCircle {
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    border: 2px solid;
  }

  .progressCircleActive {
    background: #2563eb;
    color: white;
    border-color: #2563eb;
  }

  .progressCircleInactive {
    background: white;
    border-color: #d1d5db;
  }

  .progressLabel {
    font-size: 0.75rem;
    margin-top: 0.25rem;
    font-weight: 500;
  }

  .progressLine {
    flex: 1;
    height: 0.25rem;
    margin: 0 0.5rem;
  }

  .progressLineActive {
    background: #2563eb;
  }

  .progressLineInactive {
    background: #d1d5db;
  }

  .formContent {
    padding: 2rem;
  }

  .formSection {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .sectionTitle {
    font-size: 1.5rem;
    font-weight: bold;
    color: #1f2937;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .gridRow {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .gridRow3 {
    grid-template-columns: repeat(3, 1fr);
  }

  .gridRow2 {
    grid-template-columns: repeat(2, 1fr);
  }

  .formGroup {
    display: flex;
    flex-direction: column;
  }

  .label {
    display: block;
    font-size: 0.875rem;
    font-weight: 500;
    color: #374151;
    margin-bottom: 0.5rem;
  }

  .required {
    color: #ef4444;
  }

  .input {
    width: 100%;
    padding: 0.5rem 1rem;
    border: 1px solid #d1d5db;
    border-radius: 0.5rem;
    outline: none;
    transition: all 0.2s;
  }

  .input:focus {
    ring: 2px;
    ring-color: #3b82f6;
  }

  .inputError {
    border-color: #ef4444;
  }

  .inputDisabled {
    background: #f3f4f6;
  }

  .textarea {
    width: 100%;
    padding: 0.5rem 1rem;
    border: 1px solid #d1d5db;
    border-radius: 0.5rem;
    outline: none;
    transition: all 0.2s;
  }

  .textarea:focus {
    ring: 2px;
    ring-color: #3b82f6;
  }

  .select {
    width: 100%;
    padding: 0.5rem 1rem;
    border: 1px solid #d1d5db;
    border-radius: 0.5rem;
    outline: none;
    transition: all 0.2s;
  }

  .select:focus {
    ring: 2px;
    ring-color: #3b82f6;
  }

  .selectError {
    border-color: #ef4444;
  }

  .selectDisabled {
    background: #f3f4f6;
  }

  .errorText {
    color: #ef4444;
    font-size: 0.75rem;
    margin-top: 0.25rem;
  }

  .confirmationBox {
    background: #f9fafb;
    border-radius: 0.5rem;
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .confirmationSection {
    border-bottom: 1px solid #e5e7eb;
    padding-bottom: 1rem;
  }

  .confirmationTitle {
    font-weight: 600;
    color: #374151;
    margin-bottom: 0.75rem;
  }

  .confirmationGrid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
    font-size: 0.875rem;
  }

  .confirmationLabel {
    color: #6b7280;
  }

  .confirmationValue {
    font-weight: bold;
  }

  .alertBox {
    background: #eff6ff;
    border: 1px solid #bfdbfe;
    border-radius: 0.5rem;
    padding: 1rem;
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
  }

  .alertText {
    font-size: 0.875rem;
    color: #374151;
  }

  .buttonContainer {
    display: flex;
    justify-content: space-between;
    margin-top: 2rem;
    padding-top: 1.5rem;
    border-top: 1px solid #e5e7eb;
  }

  .button {
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    font-weight: 600;
    border: none;
    cursor: pointer;
    transition: all 0.2s;
  }

  .buttonBack {
    background: #e5e7eb;
    color: #374151;
  }

  .buttonBack:hover {
    background: #d1d5db;
  }

  .buttonNext {
    background: #2563eb;
    color: white;
    margin-left: auto;
  }

  .buttonNext:hover {
    background: #1d4ed8;
  }

  .buttonSubmit {
    background: #16a34a;
    color: white;
    margin-left: auto;
    padding: 0.75rem 2rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .buttonSubmit:hover {
    background: #15803d;
  }

  .successContainer {
    min-height: 100vh;
    background: linear-gradient(to bottom right, #eff6ff, #e0e7ff);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
  }

  .successCard {
    background: white;
    border-radius: 1rem;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    padding: 2rem;
    max-width: 28rem;
    width: 100%;
    text-align: center;
  }

  .successIcon {
    margin-bottom: 1.5rem;
  }

  .successTitle {
    font-size: 1.875rem;
    font-weight: bold;
    color: #1f2937;
    margin-bottom: 1rem;
  }

  .successInfo {
    background: #f0fdf4;
    border: 1px solid #bbf7d0;
    border-radius: 0.5rem;
    padding: 1rem;
    margin-bottom: 1.5rem;
  }

  .successInfoItem {
    color: #374151;
    margin-bottom: 0.5rem;
  }

  .successNote {
    font-size: 0.875rem;
    color: #6b7280;
    margin-bottom: 1.5rem;
  }

  .buttonNewPatient {
    background: #2563eb;
    color: white;
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    font-weight: 600;
    border: none;
    cursor: pointer;
    transition: all 0.2s;
  }

  .buttonNewPatient:hover {
    background: #1d4ed8;
  }

  @media (max-width: 768px) {
    .gridRow3, .gridRow2 {
      grid-template-columns: 1fr;
    }

    .confirmationGrid {
      grid-template-columns: 1fr;
    }

    .headerTitle {
      font-size: 1.5rem;
    }
  }
`;

export default function PatientRegistration() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    lastName: "",
    firstName: "",
    middleName: "",
    birthDate: "",
    gender: "",
    phone: "",
    email: "",
    address: "",
    passportSeries: "",
    passportNumber: "",
    iin: "",
    appointmentDate: "",
    appointmentTime: "",
    doctor: "",
    department: "",
    complaint: "",
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const departments = [
    "Терапия",
    "Кардиология",
    "Неврология",
    "Педиатрия",
    "Хирургия",
    "Гинекология",
    "Офтальмология",
    "ЛОР",
  ];

  const doctors = {
    Терапия: ["Иванов И.И.", "Петрова А.С.", "Сидоров П.К."],
    Кардиология: ["Козлова Е.В.", "Морозов С.А."],
    Неврология: ["Новикова М.П.", "Белов Д.Н."],
    Педиатрия: ["Смирнова О.Л.", "Федоров В.И."],
    Хирургия: ["Волков А.Н.", "Соколов М.М."],
    Гинекология: ["Павлова Н.С."],
    Офтальмология: ["Григорьев К.Р."],
    ЛОР: ["Титов Е.А.", "Кузнецова Л.В."],
  };

  const timeSlots = [
    "08:00",
    "08:30",
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "12:30",
    "13:00",
    "13:30",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:00",
    "16:30",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }

    if (name === "department") {
      setFormData((prev) => ({ ...prev, doctor: "" }));
    }
  };

  const validateStep = (currentStep) => {
    const newErrors = {};

    if (currentStep === 1) {
      if (!formData.lastName.trim()) newErrors.lastName = "Введите фамилию";
      if (!formData.firstName.trim()) newErrors.firstName = "Введите имя";
      if (!formData.birthDate) newErrors.birthDate = "Выберите дату рождения";
      if (!formData.gender) newErrors.gender = "Выберите пол";
      if (!formData.phone.trim()) newErrors.phone = "Введите телефон";
      if (!formData.iin.trim()) newErrors.iin = "Введите ИИН";
    }

    if (currentStep === 2) {
      if (!formData.department) newErrors.department = "Выберите отделение";
      if (!formData.doctor) newErrors.doctor = "Выберите врача";
      if (!formData.appointmentDate)
        newErrors.appointmentDate = "Выберите дату";
      if (!formData.appointmentTime)
        newErrors.appointmentTime = "Выберите время";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = () => {
    if (validateStep(step)) {
      setSubmitted(true);
      console.log("Данные пациента:", formData);
    }
  };

  if (submitted) {
    return (
      <>
        <style>{styles}</style>
        <div className="successContainer">
          <div className="successCard">
            <div className="successIcon">
              <CheckCircle
                style={{
                  width: "5rem",
                  height: "5rem",
                  color: "#16a34a",
                  margin: "0 auto",
                }}
              />
            </div>
            <h2 className="successTitle">Регистрация завершена!</h2>
            <div className="successInfo">
              <p className="successInfoItem">
                <strong>Пациент:</strong> {formData.lastName}{" "}
                {formData.firstName} {formData.middleName}
              </p>
              <p className="successInfoItem">
                <strong>Отделение:</strong> {formData.department}
              </p>
              <p className="successInfoItem">
                <strong>Врач:</strong> {formData.doctor}
              </p>
              <p className="successInfoItem">
                <strong>Дата приема:</strong> {formData.appointmentDate}
              </p>
              <p className="successInfoItem" style={{ marginBottom: 0 }}>
                <strong>Время:</strong> {formData.appointmentTime}
              </p>
            </div>
            <p className="successNote">
              Талон отправлен на телефон {formData.phone}
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                setStep(1);
                setFormData({
                  lastName: "",
                  firstName: "",
                  middleName: "",
                  birthDate: "",
                  gender: "",
                  phone: "",
                  email: "",
                  address: "",
                  passportSeries: "",
                  passportNumber: "",
                  iin: "",
                  appointmentDate: "",
                  appointmentTime: "",
                  doctor: "",
                  department: "",
                  complaint: "",
                });
              }}
              className="buttonNewPatient"
            >
              Зарегистрировать нового пациента
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{styles}</style>
      <div className="container">
        <div className="maxWidth">
          <div className="card">
            <div className="header">
              <h1 className="headerTitle">Регистрация пациента</h1>
              <p className="headerSubtitle">Городская поликлиника №1</p>
            </div>

            <div className="progressBar">
              <div className="progressContainer">
                {[1, 2, 3].map((s) => (
                  <React.Fragment key={s}>
                    <div
                      className={`progressStep ${
                        s <= step
                          ? "progressStepActive"
                          : "progressStepInactive"
                      }`}
                    >
                      <div
                        className={`progressCircle ${
                          s <= step
                            ? "progressCircleActive"
                            : "progressCircleInactive"
                        }`}
                      >
                        {s}
                      </div>
                      <span className="progressLabel">
                        {s === 1
                          ? "Личные данные"
                          : s === 2
                          ? "Запись к врачу"
                          : "Подтверждение"}
                      </span>
                    </div>
                    {s < 3 && (
                      <div
                        className={`progressLine ${
                          s < step
                            ? "progressLineActive"
                            : "progressLineInactive"
                        }`}
                      />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            <div className="formContent">
              {step === 1 && (
                <div className="formSection">
                  <h2 className="sectionTitle">
                    <User
                      style={{
                        width: "1.5rem",
                        height: "1.5rem",
                        color: "#2563eb",
                      }}
                    />
                    Личные данные пациента
                  </h2>

                  <div className="gridRow gridRow3">
                    <div className="formGroup">
                      <label className="label">
                        Фамилия <span className="required">*</span>
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className={`input ${
                          errors.lastName ? "inputError" : ""
                        }`}
                        placeholder="Иванов"
                      />
                      {errors.lastName && (
                        <p className="errorText">{errors.lastName}</p>
                      )}
                    </div>

                    <div className="formGroup">
                      <label className="label">
                        Имя <span className="required">*</span>
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className={`input ${
                          errors.firstName ? "inputError" : ""
                        }`}
                        placeholder="Иван"
                      />
                      {errors.firstName && (
                        <p className="errorText">{errors.firstName}</p>
                      )}
                    </div>

                    <div className="formGroup">
                      <label className="label">Отчество</label>
                      <input
                        type="text"
                        name="middleName"
                        value={formData.middleName}
                        onChange={handleChange}
                        className="input"
                        placeholder="Иванович"
                      />
                    </div>
                  </div>

                  <div className="gridRow gridRow2">
                    <div className="formGroup">
                      <label className="label">
                        Дата рождения <span className="required">*</span>
                      </label>
                      <input
                        type="date"
                        name="birthDate"
                        value={formData.birthDate}
                        onChange={handleChange}
                        className={`input ${
                          errors.birthDate ? "inputError" : ""
                        }`}
                      />
                      {errors.birthDate && (
                        <p className="errorText">{errors.birthDate}</p>
                      )}
                    </div>

                    <div className="formGroup">
                      <label className="label">
                        Пол <span className="required">*</span>
                      </label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className={`select ${
                          errors.gender ? "selectError" : ""
                        }`}
                      >
                        <option value="">Выберите пол</option>
                        <option value="male">Мужской</option>
                        <option value="female">Женский</option>
                      </select>
                      {errors.gender && (
                        <p className="errorText">{errors.gender}</p>
                      )}
                    </div>
                  </div>

                  <div className="gridRow gridRow2">
                    <div className="formGroup">
                      <label className="label">
                        Телефон <span className="required">*</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className={`input ${errors.phone ? "inputError" : ""}`}
                        placeholder="+996 XXX XXX XXX"
                      />
                      {errors.phone && (
                        <p className="errorText">{errors.phone}</p>
                      )}
                    </div>

                    <div className="formGroup">
                      <label className="label">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="input"
                        placeholder="example@mail.com"
                      />
                    </div>
                  </div>

                  <div className="formGroup">
                    <label className="label">
                      ИИН <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      name="iin"
                      value={formData.iin}
                      onChange={handleChange}
                      maxLength="14"
                      className={`input ${errors.iin ? "inputError" : ""}`}
                      placeholder="12345678901234"
                    />
                    {errors.iin && <p className="errorText">{errors.iin}</p>}
                  </div>

                  <div className="formGroup">
                    <label className="label">Адрес проживания</label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      rows="3"
                      className="textarea"
                      placeholder="Улица, дом, квартира"
                    />
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="formSection">
                  <h2 className="sectionTitle">
                    <Calendar
                      style={{
                        width: "1.5rem",
                        height: "1.5rem",
                        color: "#2563eb",
                      }}
                    />
                    Запись на прием
                  </h2>

                  <div className="gridRow gridRow2">
                    <div className="formGroup">
                      <label className="label">
                        Отделение <span className="required">*</span>
                      </label>
                      <select
                        name="department"
                        value={formData.department}
                        onChange={handleChange}
                        className={`select ${
                          errors.department ? "selectError" : ""
                        }`}
                      >
                        <option value="">Выберите отделение</option>
                        {departments.map((dept) => (
                          <option key={dept} value={dept}>
                            {dept}
                          </option>
                        ))}
                      </select>
                      {errors.department && (
                        <p className="errorText">{errors.department}</p>
                      )}
                    </div>

                    <div className="formGroup">
                      <label className="label">
                        Врач <span className="required">*</span>
                      </label>
                      <select
                        name="doctor"
                        value={formData.doctor}
                        onChange={handleChange}
                        disabled={!formData.department}
                        className={`select ${
                          errors.doctor ? "selectError" : ""
                        } ${!formData.department ? "selectDisabled" : ""}`}
                      >
                        <option value="">Выберите врача</option>
                        {formData.department &&
                          doctors[formData.department]?.map((doc) => (
                            <option key={doc} value={doc}>
                              {doc}
                            </option>
                          ))}
                      </select>
                      {errors.doctor && (
                        <p className="errorText">{errors.doctor}</p>
                      )}
                    </div>
                  </div>

                  <div className="gridRow gridRow2">
                    <div className="formGroup">
                      <label className="label">
                        Дата приема <span className="required">*</span>
                      </label>
                      <input
                        type="date"
                        name="appointmentDate"
                        value={formData.appointmentDate}
                        onChange={handleChange}
                        min={new Date().toISOString().split("T")[0]}
                        className={`input ${
                          errors.appointmentDate ? "inputError" : ""
                        }`}
                      />
                      {errors.appointmentDate && (
                        <p className="errorText">{errors.appointmentDate}</p>
                      )}
                    </div>

                    <div className="formGroup">
                      <label className="label">
                        Время приема <span className="required">*</span>
                      </label>
                      <select
                        name="appointmentTime"
                        value={formData.appointmentTime}
                        onChange={handleChange}
                        className={`select ${
                          errors.appointmentTime ? "selectError" : ""
                        }`}
                      >
                        <option value="">Выберите время</option>
                        {timeSlots.map((time) => (
                          <option key={time} value={time}>
                            {time}
                          </option>
                        ))}
                      </select>
                      {errors.appointmentTime && (
                        <p className="errorText">{errors.appointmentTime}</p>
                      )}
                    </div>
                  </div>

                  <div className="formGroup">
                    <label className="label">Жалобы / Причина обращения</label>
                    <textarea
                      name="complaint"
                      value={formData.complaint}
                      onChange={handleChange}
                      rows="4"
                      className="textarea"
                      placeholder="Опишите симптомы или причину визита"
                    />
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="formSection">
                  <h2 className="sectionTitle">
                    <FileText
                      style={{
                        width: "1.5rem",
                        height: "1.5rem",
                        color: "#2563eb",
                      }}
                    />
                    Проверьте данные
                  </h2>

                  <div className="confirmationBox">
                    <div className="confirmationSection">
                      <h3 className="confirmationTitle">Личные данные:</h3>
                      <div className="confirmationGrid">
                        <p>
                          <span className="confirmationLabel">ФИО:</span>{" "}
                          <span className="confirmationValue">
                            {formData.lastName} {formData.firstName}{" "}
                            {formData.middleName}
                          </span>
                        </p>
                        <p>
                          <span className="confirmationLabel">
                            Дата рождения:
                          </span>{" "}
                          <span className="confirmationValue">
                            {formData.birthDate}
                          </span>
                        </p>
                        <p>
                          <span className="confirmationLabel">Пол:</span>{" "}
                          <span className="confirmationValue">
                            {formData.gender === "male" ? "Мужской" : "Женский"}
                          </span>
                        </p>
                        <p>
                          <span className="confirmationLabel">Телефон:</span>{" "}
                          <span className="confirmationValue">
                            {formData.phone}
                          </span>
                        </p>
                        <p>
                          <span className="confirmationLabel">ИИН:</span>{" "}
                          <span className="confirmationValue">
                            {formData.iin}
                          </span>
                        </p>
                        {formData.email && (
                          <p>
                            <span className="confirmationLabel">Email:</span>{" "}
                            <span className="confirmationValue">
                              {formData.email}
                            </span>
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className="confirmationTitle">Запись на прием:</h3>
                      <div className="confirmationGrid">
                        <p>
                          <span className="confirmationLabel">Отделение:</span>{" "}
                          <span className="confirmationValue">
                            {formData.department}
                          </span>
                        </p>
                        <p>
                          <span className="confirmationLabel">Врач:</span>{" "}
                          <span className="confirmationValue">
                            {formData.doctor}
                          </span>
                        </p>
                        <p>
                          <span className="confirmationLabel">Дата:</span>{" "}
                          <span className="confirmationValue">
                            {formData.appointmentDate}
                          </span>
                        </p>
                        <p>
                          <span className="confirmationLabel">Время:</span>{" "}
                          <span className="confirmationValue">
                            {formData.appointmentTime}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="alertBox">
                    <AlertCircle
                      style={{
                        width: "1.25rem",
                        height: "1.25rem",
                        color: "#2563eb",
                        marginTop: "0.125rem",
                        flexShrink: 0,
                      }}
                    />
                    <p className="alertText">
                      После подтверждения регистрации на указанный номер
                      телефона будет отправлен талон с номером очереди и
                      временем приема.
                    </p>
                  </div>
                </div>
              )}

              <div className="buttonContainer">
                {step > 1 && (
                  <button onClick={prevStep} className="button buttonBack">
                    Назад
                  </button>
                )}

                {step < 3 ? (
                  <button onClick={nextStep} className="button buttonNext">
                    Далее
                  </button>
                ) : (
                  <button
                    onClick={handleSubmit}
                    className="button buttonSubmit"
                  >
                    <CheckCircle
                      style={{ width: "1.25rem", height: "1.25rem" }}
                    />
                    Подтвердить регистрацию
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
