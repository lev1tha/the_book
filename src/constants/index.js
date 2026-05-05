export const DEPARTMENTS = [
  "Терапия",
  "Кардиология",
  "Неврология",
  "Педиатрия",
  "Хирургия",
  "Гинекология",
  "Офтальмология",
  "ЛОР",
];

export const DOCTORS_BY_DEPT = {
  Терапия: ["Иванов И.И.", "Петрова А.С.", "Сидоров П.К."],
  Кардиология: ["Козлова Е.В.", "Морозов С.А."],
  Неврология: ["Новикова М.П.", "Белов Д.Н."],
  Педиатрия: ["Смирнова О.Л.", "Федоров В.И."],
  Хирургия: ["Волков А.Н.", "Соколов М.М."],
  Гинекология: ["Павлова Н.С."],
  Офтальмология: ["Григорьев К.Р."],
  ЛОР: ["Титов Е.А.", "Кузнецова Л.В."],
};

export const TIME_SLOTS = [
  "08:00","08:30","09:00","09:30","10:00","10:30",
  "11:00","11:30","12:00","12:30","13:00","13:30",
  "14:00","14:30","15:00","15:30","16:00","16:30",
];

export const STATUS_CFG = {
  confirmed:   { label: "Подтверждён", color: "#2563eb", bg: "#eff6ff", dot: "#3b82f6" },
  waiting:     { label: "Ожидает",     color: "#b45309", bg: "#fef3c7", dot: "#f59e0b" },
  in_progress: { label: "На приёме",   color: "#7c3aed", bg: "#ede9fe", dot: "#8b5cf6" },
  completed:   { label: "Завершён",    color: "#166534", bg: "#dcfce7", dot: "#22c55e" },
  cancelled:   { label: "Отменён",     color: "#991b1b", bg: "#fee2e2", dot: "#ef4444" },
};

export const MOCK_PATIENTS = [
  { id: 1, lastName: "Иванов",   firstName: "Иван",   middleName: "Иванович",      birthDate: "1985-03-12", gender: "male",   phone: "+996 700 123 456", email: "ivanov@mail.com",    iin: "85031200001234", address: "ул. Ленина 10, кв. 5",    department: "Кардиология", doctor: "Козлова Е.В.",  appointmentDate: "2026-05-06", appointmentTime: "09:00", complaint: "Боли в груди",              status: "waiting",     queueNum: 3 },
  { id: 2, lastName: "Петрова",  firstName: "Анна",   middleName: "Сергеевна",     birthDate: "1992-07-24", gender: "female", phone: "+996 555 234 567", email: "petrova@mail.com",   iin: "92072400002345", address: "пр. Манаса 45",           department: "Терапия",     doctor: "Иванов И.И.",   appointmentDate: "2026-05-06", appointmentTime: "10:30", complaint: "Высокая температура, кашель", status: "in_progress", queueNum: 1 },
  { id: 3, lastName: "Сидоров",  firstName: "Пётр",   middleName: "Кириллович",    birthDate: "1978-11-05", gender: "male",   phone: "+996 700 345 678", email: "",                   iin: "78110500003456", address: "ул. Токтогула 22",         department: "Неврология",  doctor: "Новикова М.П.", appointmentDate: "2026-05-07", appointmentTime: "11:00", complaint: "Головные боли",             status: "confirmed",   queueNum: 5 },
  { id: 4, lastName: "Козлова",  firstName: "Мария",  middleName: "Владимировна",  birthDate: "2001-02-18", gender: "female", phone: "+996 312 456 789", email: "kozlova@mail.com",   iin: "01021800004567", address: "ул. Байтик Баатыра 8",     department: "Педиатрия",   doctor: "Смирнова О.Л.", appointmentDate: "2026-05-05", appointmentTime: "08:30", complaint: "Плановый осмотр",           status: "completed",   queueNum: 2 },
  { id: 5, lastName: "Абдиев",   firstName: "Руслан", middleName: "Маратович",     birthDate: "1995-09-30", gender: "male",   phone: "+996 700 567 890", email: "abdiev@mail.com",    iin: "95093000005678", address: "мкр. Асанбай 12-45",       department: "Хирургия",    doctor: "Волков А.Н.",   appointmentDate: "2026-05-06", appointmentTime: "14:00", complaint: "Боли в животе",             status: "waiting",     queueNum: 7 },
  { id: 6, lastName: "Мамытова", firstName: "Айгуль", middleName: "Бекова",        birthDate: "1988-06-15", gender: "female", phone: "+996 550 678 901", email: "mamytova@mail.com",  iin: "88061500006789", address: "ул. Фрунзе 33",            department: "Гинекология", doctor: "Павлова Н.С.",  appointmentDate: "2026-05-05", appointmentTime: "15:30", complaint: "Плановый осмотр",           status: "completed",   queueNum: 4 },
  { id: 7, lastName: "Орозов",   firstName: "Алмаз",  middleName: "Дооронбекович", birthDate: "1970-04-22", gender: "male",   phone: "+996 700 789 012", email: "",                   iin: "70042200007890", address: "с. Беловодское",           department: "ЛОР",         doctor: "Титов Е.А.",    appointmentDate: "2026-05-06", appointmentTime: "09:30", complaint: "Боль в горле",              status: "confirmed",   queueNum: 2 },
  { id: 8, lastName: "Жакыпова", firstName: "Бермет", middleName: "Маратовна",     birthDate: "2003-08-11", gender: "female", phone: "+996 559 111 222", email: "bj@mail.com",        iin: "03081100008901", address: "мкр. Джал 23-5",           department: "Терапия",     doctor: "Петрова А.С.",  appointmentDate: "2026-05-06", appointmentTime: "11:30", complaint: "Слабость, головокружение",  status: "waiting",     queueNum: 4 },
];
