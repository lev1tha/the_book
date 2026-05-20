-- Создать базу данных
CREATE DATABASE IF NOT EXISTS ktp_clinic
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE ktp_clinic;

-- Пациенты
CREATE TABLE IF NOT EXISTS patients (
  id              VARCHAR(64)  PRIMARY KEY,
  lastName        VARCHAR(100) NOT NULL,
  firstName       VARCHAR(100) NOT NULL,
  middleName      VARCHAR(100) DEFAULT '',
  birthDate       DATE         DEFAULT NULL,
  gender          ENUM('male','female','unknown') DEFAULT 'unknown',
  phone           VARCHAR(30)  DEFAULT '',
  email           VARCHAR(100) DEFAULT '',
  address         TEXT,
  iin             VARCHAR(20)  DEFAULT '',
  department      VARCHAR(100) DEFAULT '',
  doctor          VARCHAR(100) DEFAULT '',
  appointmentDate DATE         DEFAULT NULL,
  appointmentTime VARCHAR(10)  DEFAULT '',
  complaint       TEXT,
  status          VARCHAR(30)  DEFAULT 'confirmed',
  queueNum        INT          DEFAULT 0,
  source          VARCHAR(20)  DEFAULT 'admin',
  createdAt       TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Онлайн заявки с сайта
CREATE TABLE IF NOT EXISTS bookings (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  lastName        VARCHAR(100),
  firstName       VARCHAR(100),
  middleName      VARCHAR(100) DEFAULT '',
  phone           VARCHAR(30),
  email           VARCHAR(100) DEFAULT '',
  department      VARCHAR(100),
  doctor          VARCHAR(100),
  appointmentDate DATE         DEFAULT NULL,
  appointmentTime VARCHAR(10),
  complaint       TEXT,
  status          VARCHAR(30)  DEFAULT 'confirmed',
  source          VARCHAR(20)  DEFAULT 'online',
  createdAt       TIMESTAMP    DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Пользователи системы (admin + врачи)
CREATE TABLE IF NOT EXISTS users (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  username    VARCHAR(100) UNIQUE NOT NULL,
  password    VARCHAR(255) NOT NULL,
  role        ENUM('admin','doctor') NOT NULL,
  name        VARCHAR(150),
  department  VARCHAR(100) DEFAULT NULL,
  createdAt   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Демо-аккаунты (admin + все врачи с кыргызскими именами)
INSERT IGNORE INTO users (username, password, role, name, department) VALUES
('admin',       'admin123',  'admin',  'Администратор',    NULL),
('baizakov',    'doctor123', 'doctor', 'Байзаков К.Э.',    'Кардиология'),
('akmatov',     'doctor123', 'doctor', 'Акматов А.А.',     'Терапия'),
('usupov',      'doctor123', 'doctor', 'Усупов Д.Т.',      'Неврология'),
('mamytbekova', 'doctor123', 'doctor', 'Мамытбекова С.Р.', 'Педиатрия'),
('toktosunov',  'doctor123', 'doctor', 'Токтосунов М.А.',  'Хирургия'),
('atabekova',   'doctor123', 'doctor', 'Атабекова Н.Ж.',   'Гинекология'),
('turdubaev',   'doctor123', 'doctor', 'Турдубаев К.А.',   'Офтальмология'),
('kozhobekov',  'doctor123', 'doctor', 'Кожобеков Э.М.',   'ЛОР');

-- Демо-пациенты (тестовые данные)
INSERT IGNORE INTO patients
  (id, lastName, firstName, middleName, birthDate, gender, phone, email, address, iin, department, doctor, appointmentDate, appointmentTime, complaint, status, queueNum, source)
VALUES
('p01','Мамытбеков','Айбек','Акматович','1985-03-12','male','+996 700 123 456','mamytbekov@mail.com','ул. Ленина 10, кв. 5','85031200001234','Кардиология','Байзаков К.Э.','2026-05-21','09:00','Боли в груди','waiting',3,'admin'),
('p02','Чыныбаева','Айчурок','Сапарбековна','1992-07-24','female','+996 555 234 567','chynybayeva@mail.com','пр. Манаса 45','92072400002345','Терапия','Акматов А.А.','2026-05-21','10:30','Высокая температура, кашель','in_progress',1,'admin'),
('p03','Толонбаев','Дамир','Болотович','1978-11-05','male','+996 700 345 678','','ул. Токтогула 22','78110500003456','Неврология','Усупов Д.Т.','2026-05-22','11:00','Головные боли','confirmed',5,'admin'),
('p04','Кадырова','Зарина','Бакытбековна','2001-02-18','female','+996 312 456 789','kadyrova@mail.com','ул. Байтик Баатыра 8','01021800004567','Педиатрия','Мамытбекова С.Р.','2026-05-20','08:30','Плановый осмотр','completed',2,'admin'),
('p05','Иманалиев','Руслан','Кубанычбекович','1995-09-30','male','+996 700 567 890','imanалиев@mail.com','мкр. Асанбай 12-45','95093000005678','Хирургия','Токтосунов М.А.','2026-05-21','14:00','Боли в животе','waiting',7,'admin'),
('p06','Сейталиева','Гулзат','Асанбековна','1988-06-15','female','+996 550 678 901','seitalieva@mail.com','ул. Фрунзе 33','88061500006789','Гинекология','Атабекова Н.Ж.','2026-05-20','15:30','Плановый осмотр','completed',4,'admin'),
('p07','Орозов','Алмаз','Дооронбекович','1970-04-22','male','+996 700 789 012','','с. Беловодское','70042200007890','ЛОР','Кожобеков Э.М.','2026-05-21','09:30','Боль в горле','confirmed',2,'admin'),
('p08','Жакыпова','Бермет','Маратовна','2003-08-11','female','+996 559 111 222','bj@mail.com','мкр. Джал 23-5','03081100008901','Терапия','Осмонова Г.Б.','2026-05-21','11:30','Слабость, головокружение','waiting',4,'admin'),
('p09','Токтогулов','Бакыт','Эркинович','1967-12-30','male','+996 701 333 444','','ул. Советская 5','67123000009012','Кардиология','Эргешева Н.М.','2026-05-21','15:00','Одышка, давление','confirmed',8,'admin'),
('p10','Усупова','Нуриза','Асановна','1999-04-17','female','+996 552 777 888','nusupova@mail.com','мкр. Восток-5 14-3','99041700010123','Офтальмология','Турдубаев К.А.','2026-05-23','10:00','Ухудшение зрения','confirmed',1,'admin'),
('p11','Дыйканов','Марат','Нурланович','1982-09-08','male','+996 708 555 666','','с. Кант','82090800011234','Терапия','Токомбаев С.К.','2026-05-19','09:00','Кашель 2 недели','completed',3,'admin'),
('p12','Асанова','Гульмира','Токтомаматовна','1975-06-22','female','+996 553 999 000','asanova@mail.com','ул. Чуй 88','75062200012345','Неврология','Асанова А.К.','2026-05-21','13:00','Боли в спине','waiting',6,'admin'),
('p13','Байматов','Нурлан','Салиевич','1990-01-15','male','+996 706 444 555','','мкр. Тунгуч 5-12','90011500013456','Терапия','Акматов А.А.','2026-05-21','08:00','Боли в суставах','waiting',9,'admin'),
('p14','Эргешова','Венера','Алмазбековна','1987-05-03','female','+996 551 666 777','ergeshova@mail.com','ул. Горького 14','87050300014567','Кардиология','Байзаков К.Э.','2026-05-21','10:00','Аритмия','in_progress',2,'admin'),
('p15','Карыбеков','Тимур','Бекович','2000-09-20','male','+996 700 888 999','karybek@mail.com','с. Ивановка','00092000015678','Хирургия','Токтосунов М.А.','2026-05-21','12:00','Аппендицит (плановое)','confirmed',3,'admin');
