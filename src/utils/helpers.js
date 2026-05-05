export function todayStr() {
  return new Date().toISOString().split("T")[0];
}

export function fmtDate(d) {
  if (!d) return "—";
  const [y, m, day] = d.split("-");
  return `${day}.${m}.${y}`;
}

export function age(birthDate) {
  if (!birthDate) return "";
  const diff = Date.now() - new Date(birthDate).getTime();
  return Math.floor(diff / (365.25 * 24 * 3600 * 1000)) + " лет";
}
