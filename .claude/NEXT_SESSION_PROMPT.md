# Промт для следующей сессии

Вставь этот текст в начале нового чата:

---

## Контекст проекта

Я работаю над дипломным проектом — **веб-система для КТП Поликлиники** (Кыргыз-Турк Поликлиникасы).

### Стек
- React 19 SPA, hash-роутинг (`window.location.hash`)
- Node.js + Express, порт **5001**
- MySQL (`ktp_clinic`), mysql2/promise
- CRA proxy: `"proxy": "http://localhost:5001"` в package.json
- CSS файлы (не CSS-in-JS), шрифт Golos Text, иконки lucide-react
- i18n: RU + KY через React Context

### Роли
- **admin** → `#dashboard` (AdminApp)
- **doctor** → `#doctor` (DoctorApp — только свои пациенты)
- **patient** → `#portal` (PatientApp — вход по ИИН + телефон)
- **клиент** → `#` (лендинг ClientApp)

### Логины для демо
- Админ: `admin` / `admin123`
- Врач: `baizakov` / `doctor123`
- Пациент: ИИН + телефон из таблицы patients

### Репозиторий
github.com/lev1tha/the_book (ветка master)

### Файл с полными заметками
`.claude/SESSION_NOTES.md` в корне проекта — там вся архитектура, схема БД, история фиксов.

### Текущие задачи / что нужно сделать
(опиши здесь что хочешь сделать в этой сессии)

---
