// Локальная дата "YYYY-MM-DD" без UTC-сдвига (важно для сравнений "сегодня":
// toISOString() возвращает UTC и около полуночи даёт вчерашний день).
export const ymd = date => {
  const p = n => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${p(date.getMonth() + 1)}-${p(date.getDate())}`;
};

export const todayStr = () => ymd(new Date());

export const fmtDate = v => {
  if (!v) return "—";
  const s = String(v);
  // Плоская дата "YYYY-MM-DD" — форматируем напрямую, без таймзонной математики.
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
    const [y, m, day] = s.split("-");
    return `${day}.${m}.${y}`;
  }
  // ISO-строка (DATE из MySQL, сериализованный со сдвигом TZ) — берём ЛОКАЛЬНЫЕ части.
  const dt = new Date(s);
  if (isNaN(dt)) return "—";
  const p = n => String(n).padStart(2, "0");
  return `${p(dt.getDate())}.${p(dt.getMonth() + 1)}.${dt.getFullYear()}`;
};

export const calcAge = b => {
  if (!b) return "";
  return Math.floor((Date.now() - new Date(b)) / (365.25 * 24 * 3600 * 1000)) + " лет";
};

export const genId = () => Date.now() + Math.random();

export const addDays = (dateStr, n) => {
  const [y, m, d] = String(dateStr).slice(0, 10).split("-").map(Number);
  return ymd(new Date(y, m - 1, d + n));
};
