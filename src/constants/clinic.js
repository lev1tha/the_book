export const DEPARTMENTS = [
  "Терапия","Кардиология","Неврология","Педиатрия",
  "Хирургия","Гинекология","Офтальмология","ЛОР",
];

export const DOCTORS_BY_DEPT = {
  Терапия:       ["Акматов А.А.","Осмонова Г.Б.","Токомбаев С.К."],
  Кардиология:   ["Байзаков К.Э.","Эргешева Н.М."],
  Неврология:    ["Усупов Д.Т.","Асанова А.К."],
  Педиатрия:     ["Мамытбекова С.Р.","Жакыпов Б.Н."],
  Хирургия:      ["Токтосунов М.А.","Джумалиев Р.С."],
  Гинекология:   ["Атабекова Н.Ж."],
  Офтальмология: ["Турдубаев К.А."],
  ЛОР:           ["Кожобеков Э.М.","Чыныбаева З.Ч."],
};

export const TIME_SLOTS = [
  "08:00","08:30","09:00","09:30","10:00","10:30","11:00","11:30",
  "12:00","12:30","13:00","13:30","14:00","14:30","15:00","15:30",
  "16:00","16:30",
];

export const STATUS_CFG = {
  confirmed:   { label:"Подтверждён",  color:"#2563eb", bg:"#eff6ff", dot:"#3b82f6" },
  waiting:     { label:"Ожидает",      color:"#b45309", bg:"#fef3c7", dot:"#f59e0b" },
  in_progress: { label:"На приёме",    color:"#7c3aed", bg:"#ede9fe", dot:"#8b5cf6" },
  completed:   { label:"Завершён",     color:"#166534", bg:"#dcfce7", dot:"#22c55e" },
  cancelled:   { label:"Отменён",      color:"#991b1b", bg:"#fee2e2", dot:"#ef4444" },
};

export const MOCK_PATIENTS = [
  { id:"p01", lastName:"Мамытбеков",  firstName:"Айбек",    middleName:"Акматович",      birthDate:"1985-03-12", gender:"male",   phone:"+996 700 123 456", email:"mamytbekov@mail.com",  iin:"85031200001234", address:"ул. Ленина 10, кв. 5",   department:"Кардиология",   doctor:"Байзаков К.Э.",     appointmentDate:"2026-05-21", appointmentTime:"09:00", complaint:"Боли в груди",               status:"waiting",     queueNum:3 },
  { id:"p02", lastName:"Чыныбаева",   firstName:"Айчурок",  middleName:"Сапарбековна",   birthDate:"1992-07-24", gender:"female", phone:"+996 555 234 567", email:"chynybayeva@mail.com", iin:"92072400002345", address:"пр. Манаса 45",           department:"Терапия",       doctor:"Акматов А.А.",      appointmentDate:"2026-05-21", appointmentTime:"10:30", complaint:"Высокая температура, кашель", status:"in_progress", queueNum:1 },
  { id:"p03", lastName:"Толонбаев",   firstName:"Дамир",    middleName:"Болотович",      birthDate:"1978-11-05", gender:"male",   phone:"+996 700 345 678", email:"",                     iin:"78110500003456", address:"ул. Токтогула 22",        department:"Неврология",    doctor:"Усупов Д.Т.",       appointmentDate:"2026-05-22", appointmentTime:"11:00", complaint:"Головные боли",              status:"confirmed",   queueNum:5 },
  { id:"p04", lastName:"Кадырова",    firstName:"Зарина",   middleName:"Бакытбековна",   birthDate:"2001-02-18", gender:"female", phone:"+996 312 456 789", email:"kadyrova@mail.com",    iin:"01021800004567", address:"ул. Байтик Баатыра 8",   department:"Педиатрия",     doctor:"Мамытбекова С.Р.", appointmentDate:"2026-05-20", appointmentTime:"08:30", complaint:"Плановый осмотр",            status:"completed",   queueNum:2 },
  { id:"p05", lastName:"Иманалиев",   firstName:"Руслан",   middleName:"Кубанычбекович", birthDate:"1995-09-30", gender:"male",   phone:"+996 700 567 890", email:"imanалиев@mail.com",   iin:"95093000005678", address:"мкр. Асанбай 12-45",     department:"Хирургия",      doctor:"Токтосунов М.А.",   appointmentDate:"2026-05-21", appointmentTime:"14:00", complaint:"Боли в животе",              status:"waiting",     queueNum:7 },
  { id:"p06", lastName:"Сейталиева",  firstName:"Гулзат",   middleName:"Асанбековна",    birthDate:"1988-06-15", gender:"female", phone:"+996 550 678 901", email:"seitalieva@mail.com",  iin:"88061500006789", address:"ул. Фрунзе 33",           department:"Гинекология",   doctor:"Атабекова Н.Ж.",    appointmentDate:"2026-05-20", appointmentTime:"15:30", complaint:"Плановый осмотр",            status:"completed",   queueNum:4 },
  { id:"p07", lastName:"Орозов",      firstName:"Алмаз",    middleName:"Дооронбекович",  birthDate:"1970-04-22", gender:"male",   phone:"+996 700 789 012", email:"",                     iin:"70042200007890", address:"с. Беловодское",          department:"ЛОР",           doctor:"Кожобеков Э.М.",    appointmentDate:"2026-05-21", appointmentTime:"09:30", complaint:"Боль в горле",               status:"confirmed",   queueNum:2 },
  { id:"p08", lastName:"Жакыпова",    firstName:"Бермет",   middleName:"Маратовна",      birthDate:"2003-08-11", gender:"female", phone:"+996 559 111 222", email:"bj@mail.com",           iin:"03081100008901", address:"мкр. Джал 23-5",         department:"Терапия",       doctor:"Осмонова Г.Б.",     appointmentDate:"2026-05-21", appointmentTime:"11:30", complaint:"Слабость, головокружение",   status:"waiting",     queueNum:4 },
  { id:"p09", lastName:"Токтогулов",  firstName:"Бакыт",    middleName:"Эркинович",      birthDate:"1967-12-30", gender:"male",   phone:"+996 701 333 444", email:"",                     iin:"67123000009012", address:"ул. Советская 5",         department:"Кардиология",   doctor:"Эргешева Н.М.",     appointmentDate:"2026-05-21", appointmentTime:"15:00", complaint:"Одышка, давление",           status:"confirmed",   queueNum:8 },
  { id:"p10", lastName:"Усупова",     firstName:"Нуриза",   middleName:"Асановна",       birthDate:"1999-04-17", gender:"female", phone:"+996 552 777 888", email:"nusupova@mail.com",    iin:"99041700010123", address:"мкр. Восток-5 14-3",     department:"Офтальмология", doctor:"Турдубаев К.А.",    appointmentDate:"2026-05-23", appointmentTime:"10:00", complaint:"Ухудшение зрения",           status:"confirmed",   queueNum:1 },
  { id:"p11", lastName:"Дыйканов",    firstName:"Марат",    middleName:"Нурланович",     birthDate:"1982-09-08", gender:"male",   phone:"+996 708 555 666", email:"",                     iin:"82090800011234", address:"с. Кант",                 department:"Терапия",       doctor:"Токомбаев С.К.",    appointmentDate:"2026-05-19", appointmentTime:"09:00", complaint:"Кашель 2 недели",            status:"completed",   queueNum:3 },
  { id:"p12", lastName:"Асанова",     firstName:"Гульмира", middleName:"Токтомаматовна", birthDate:"1975-06-22", gender:"female", phone:"+996 553 999 000", email:"asanova@mail.com",     iin:"75062200012345", address:"ул. Чуй 88",              department:"Неврология",    doctor:"Асанова А.К.",      appointmentDate:"2026-05-21", appointmentTime:"13:00", complaint:"Боли в спине",               status:"waiting",     queueNum:6 },
];

export const INIT_NOTIFS = [
  { id:1, type:"warn", title:"Конфликт времени",  body:"Байзаков К.Э. — 09:00 занято двумя пациентами",         time:"5 мин назад",  read:false },
  { id:2, type:"info", title:"Новая запись",       body:"Токтогулов Б. записан на 15:00 — Кардиология",          time:"12 мин назад", read:false },
  { id:3, type:"ok",   title:"Приём завершён",     body:"Кадырова З.Б. — Педиатрия, Мамытбекова С.Р.",           time:"28 мин назад", read:true  },
  { id:4, type:"warn", title:"Опоздание",          body:"Иманалиев Р.К. — 14:00 Хирургия, не отметился",        time:"1 ч назад",    read:true  },
  { id:5, type:"info", title:"Запись на завтра",   body:"3 пациента записаны на 22.05.2026",                     time:"2 ч назад",    read:true  },
];

export const DOCTORS_LIST = [
  { name:"Байзаков К.Э.",    dept:"Кардиология",   exp:15, cat:"Высшая" },
  { name:"Акматов А.А.",     dept:"Терапия",        exp:20, cat:"Высшая" },
  { name:"Усупов Д.Т.",      dept:"Неврология",     exp:12, cat:"Первая" },
  { name:"Мамытбекова С.Р.", dept:"Педиатрия",      exp:8,  cat:"Первая" },
  { name:"Токтосунов М.А.",  dept:"Хирургия",       exp:18, cat:"Высшая" },
  { name:"Атабекова Н.Ж.",   dept:"Гинекология",    exp:14, cat:"Высшая" },
  { name:"Турдубаев К.А.",   dept:"Офтальмология",  exp:10, cat:"Первая" },
  { name:"Кожобеков Э.М.",   dept:"ЛОР",            exp:16, cat:"Высшая" },
];
