# КТП Поликлиника — Сессионные заметки
> Последнее обновление: 2026-05-31

---

## 🏗️ Архитектура проекта

### Стек
- **Frontend**: React 19, hash-based роутинг, CSS файлы (не CSS-in-JS)
- **Backend**: Node.js + Express, порт **5001** (5000 занят AirPlay на macOS)
- **БД**: MySQL (`ktp_clinic`), mysql2/promise
- **i18n**: React Context, два языка RU + KY, ключ `clinic_lang` в localStorage
- **Иконки**: lucide-react
- **Шрифт**: Golos Text (Google Fonts)

### Структура папок
```
src/
  App.js              — главный роутер (hash-based, role-based)
  api.js              — все fetch запросы, BASE = "/api" (через CRA proxy)
  i18n.js             — переводы RU + KY
  admin/              — AdminApp.jsx + admin.css + components/ + pages/
  client/             — ClientApp.jsx + client.css + components/ + sections/
  doctor/             — DoctorApp.jsx + doctor.css
  patient/            — PatientApp.jsx + patient.css
  auth/               — LoginPage.jsx + auth.js
  constants/clinic.js — DEPARTMENTS, DOCTORS_BY_DEPT, TIME_SLOTS, MOCK_PATIENTS, DOCTORS_LIST
  hooks/              — useRouter.js, useLocalStorage.js
  utils/helpers.js    — todayStr, fmtDate, calcAge, genId, addDays

server/
  index.js            — Express app, порт 5001
  db.js               — mysql2 pool + SET NAMES utf8mb4
  schema.sql          — CREATE TABLE + seed данные (9 users + 15 patients)
  routes/
    auth.js           — POST /login, POST /patient, GET /my-appointments
    patients.js       — CRUD /patients
    bookings.js       — GET/POST /bookings (с IIN)
```

---

## 👥 Роли и маршруты

| Роль | Hash | Логин |
|------|------|-------|
| Клиент (сайт) | `#` (пусто) | без входа |
| Логин | `#login` | — |
| Администратор | `#dashboard`, `#patients`, `#queue`, `#schedule`, `#analytics`, `#register` | `admin` / `admin123` |
| Врач | `#doctor` | `baizakov` / `doctor123` и др. |
| Пациент | `#portal` | ИИН + телефон |

### Врачи в БД
| username | name | department |
|----------|------|------------|
| admin | Администратор | — |
| baizakov | Байзаков К.Э. | Кардиология |
| akmatov | Акматов А.А. | Терапия |
| usupov | Усупов Д.Т. | Неврология |
| mamytbekova | Мамытбекова С.Р. | Педиатрия |
| toktosunov | Токтосунов М.А. | Хирургия |
| atabekova | Атабекова Н.Ж. | Гинекология |
| turdubaev | Турдубаев К.А. | Офтальмология |
| kozhobekov | Кожобеков Э.М. | ЛОР |

---

## 🗄️ База данных

### Таблицы
- **patients** — все записи (admin + online), id VARCHAR(64)
- **bookings** — онлайн заявки с сайта, включая `iin`
- **users** — сотрудники (admin/doctor)

### Важно при импорте на новой машине
```bash
# ОБЯЗАТЕЛЬНО с флагом --default-character-set=utf8mb4
mysql -u root --default-character-set=utf8mb4 < server/schema.sql
```

### db.js — ключевые моменты
- Нет `charset` в createPool (вызывал 500 ошибки)
- SET NAMES utf8mb4 через переопределение `pool.getConnection`
- Порт 3306 по умолчанию

---

## 🔧 Ключевые фиксы этой сессии

1. **CORS** — `api.js` теперь использует `BASE = "/api"` (относительный путь через CRA proxy)
2. **Порт** — сервер на `5001` (macOS AirPlay занимает 5000)
3. **Charset** — двойное UTF-8 кодирование исправлено в db.js
4. **Booking форма** — добавлено поле ИИН (обязательное, 14 цифр)
5. **bookings.js** — ИИН сохраняется в обе таблицы (bookings + patients)
6. **Submit** — теперь показывает ошибку вместо false-успеха
7. **Имена** — все данные заменены на кыргызские
8. **schema.sql** — 15 тестовых пациентов + 9 пользователей

---

## 🚀 Запуск проекта

### macOS
```bash
# Первый раз — запустить MySQL
brew services start mysql

# Каждый раз
npm run dev  # запускает React (3000) + сервер (5001) одновременно
```

### Windows (OpenServer)
```
# В OSPanel терминале
osp on MySQL-8.0
osp use MySQL-8.0

# Окно 1
npm start

# Окно 2
cd server && node index.js
```

### Первый раз на новой машине
```bash
npm install
cd server && npm install && cd ..
mysql -u root --default-character-set=utf8mb4 < server/schema.sql
```

---

## 📋 Что ещё можно улучшить (backlog)

- [ ] Хеширование паролей (сейчас plain text в БД)
- [ ] JWT токены вместо localStorage
- [ ] Пагинация в таблице пациентов
- [ ] Фильтр по дате в панели врача
- [ ] Печать талона из панели врача
- [ ] Уведомления в реальном времени (WebSocket)
- [ ] Экспорт в Excel из admin панели
- [ ] Мобильная версия admin панели

---

## 🔗 Репозиторий
**github.com/lev1tha/the_book** — ветка `master`
