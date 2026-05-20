export const todayStr = () => new Date().toISOString().split("T")[0];

export const fmtDate = d => {
  if (!d) return "—";
  const [y, m, day] = d.split("-");
  return `${day}.${m}.${y}`;
};

export const calcAge = b => {
  if (!b) return "";
  return Math.floor((Date.now() - new Date(b)) / (365.25 * 24 * 3600 * 1000)) + " лет";
};

export const genId = () => Date.now() + Math.random();

export const addDays = (dateStr, n) => {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + n);
  return d.toISOString().split("T")[0];
};
